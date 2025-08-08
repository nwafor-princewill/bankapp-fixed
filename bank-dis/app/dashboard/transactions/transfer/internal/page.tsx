'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import CurrencyDisplay from '@/app/components/CurrencyDisplay';
import Receipt from '@/app/components/Receipt';
import OtpModal from '@/app/components/OtpModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function InternalTransferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');
  const [accountExists, setAccountExists] = useState<boolean | null>(null);
  const [accountName, setAccountName] = useState<string>('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptTransactionId, setReceiptTransactionId] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingTransfer, setPendingTransfer] = useState<{
    amount: number;
    description: string;
    toAccount: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    toAccount: '',
    amount: '',
    description: 'Internal Transfer'
  });

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const res = await fetch(`${API_URL}/api/accounts/primary`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch balance');
        }
        const data = await res.json();
        setCurrentBalance(data.balance || data.availableBalance || 0);
        setCurrency(data.currency || 'USD');
      } catch (error) {
        console.error('Error fetching balance:', error);
        toast.error('Failed to load account balance');
        setCurrentBalance(0);
        setCurrency('USD');
      }
    };
    fetchBalance();
  }, [router]);

  const checkAccount = async (accountNumber: string) => {
    if (accountNumber.length < 8) {
      setAccountExists(null);
      setAccountName('');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const res = await fetch(`${API_URL}/api/accounts/check?accountNumber=${accountNumber}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) {
        throw new Error('Failed to check account');
      }
      const data = await res.json();
      setAccountExists(data.exists);
      setAccountName(data.accountName || '');
    } catch (error) {
      console.error('Error checking account:', error);
      setAccountExists(false);
      setAccountName('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amount > currentBalance) {
      toast.error('Insufficient funds for this transfer');
      return;
    }
    if (accountExists === false) {
      toast.error('Please enter a valid account number');
      return;
    }
    setPendingTransfer({
      amount,
      description: formData.description,
      toAccount: formData.toAccount
    });
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/transfers/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          description: formData.description,
          toAccount: formData.toAccount,
          transferType: 'internal',
          bankName: 'Internal Bank'
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to initiate transfer.');
      }
      toast.success('OTP sent to your registered email.');
      setShowOtpModal(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to initiate transfer.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string): Promise<boolean> => {
    if (!pendingTransfer) return false;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const executeData = {
        ...pendingTransfer,
        otp,
        transferType: 'internal',
        bankName: 'Internal Bank'
      };
      const response = await fetch(`${API_URL}/api/transfers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(executeData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Transfer execution failed.');
      }
      toast.success(`Transfer of ${currency} ${pendingTransfer.amount.toFixed(2)} completed successfully!`);
      setShowOtpModal(false);
      setReceiptTransactionId(data.reference || `INT-TRX-${Date.now()}`);
      setShowReceipt(true);
      setCurrentBalance(prev => prev - pendingTransfer.amount);
      setFormData({
        toAccount: '',
        amount: '',
        description: 'Internal Transfer'
      });
      setAccountExists(null);
      setAccountName('');
      setPendingTransfer(null);
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!pendingTransfer) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/transfers/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...pendingTransfer,
          transferType: 'internal',
          bankName: 'Internal Bank'
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP.');
      }
      toast.success('New OTP sent to your registered email.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-[#03305c]">Internal Transfer</h1>
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Available Balance</p>
        <CurrencyDisplay 
          amount={currentBalance}
          currency={currency}
          className="text-2xl font-bold text-[#03305c]"
        />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">To Account</label>
          <input
            type="text"
            value={formData.toAccount}
            onChange={(e) => {
              setFormData({...formData, toAccount: e.target.value});
              checkAccount(e.target.value);
            }}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
            placeholder="Enter account number"
            required
          />
          {accountExists === false && (
            <p className="text-red-500 text-sm mt-1">Account not found in our bank</p>
          )}
          {accountExists === true && accountName && (
            <p className="text-green-500 text-sm mt-1">Account found: {accountName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount ({currency})</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
            min="0.01"
            step="0.01"
            max={currentBalance}
            placeholder="Enter amount"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
            placeholder="Transfer description"
          />
        </div>
        <button
          type="submit"
          disabled={loading || accountExists === false}
          className={`w-full py-2 px-4 rounded text-white font-semibold transition-colors ${
            loading || accountExists === false
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#03305c] hover:bg-[#e8742c]'
          }`}
        >
          {loading ? 'Processing...' : 'Continue'}
        </button>
      </form>
      {showReceipt && (
        <Receipt 
          transactionId={receiptTransactionId}
          onClose={() => setShowReceipt(false)}
        />
      )}
      {showOtpModal && (
        <OtpModal
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
        />
      )}
      </div>
    );
  }