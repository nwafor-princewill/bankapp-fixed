'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import CurrencyDisplay from '@/app/components/CurrencyDisplay';
import Receipt from '@/app/components/Receipt';
import OtpModal from '@/app/components/OtpModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function InternationalTransferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptTransactionId, setReceiptTransactionId] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingTransfer, setPendingTransfer] = useState<{
    amount: number;
    description: string;
    bankName: string;
    toAccount: string;
    accountName: string;
    swiftIban: string;
    bankAddress: string;
    email: string;
    phone: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    bankName: '',
    toAccount: '',
    accountName: '',
    swiftIban: '',
    bankAddress: '',
    email: '',
    phone: '',
    amount: '',
    description: 'International Transfer'
  });

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const response = await fetch(`${API_URL}/api/accounts/primary`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch balance');
        }
        const data = await response.json();
        setCurrentBalance(data.balance ?? 0);
        setCurrency(data.currency ?? 'USD');
      } catch (error) {
        console.error('Error fetching balance:', error);
        toast.error('Failed to load account balance.');
        setCurrentBalance(0);
        setCurrency('USD');
      }
    };
    fetchBalance();
  }, [router]);

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
    setPendingTransfer({
      amount,
      description: formData.description,
      bankName: formData.bankName,
      toAccount: formData.toAccount,
      accountName: formData.accountName,
      swiftIban: formData.swiftIban,
      bankAddress: formData.bankAddress,
      email: formData.email,
      phone: formData.phone
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
          bankName: formData.bankName,
          toAccount: formData.toAccount,
          accountName: formData.accountName,
          swiftIban: formData.swiftIban,
          bankAddress: formData.bankAddress,
          email: formData.email,
          phone: formData.phone,
          transferType: 'international'
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
        transferType: 'international'
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
      setReceiptTransactionId(data.reference || `INTL-TRX-${Date.now()}`);
      setShowReceipt(true);
      setCurrentBalance(prev => prev - pendingTransfer.amount);
      setFormData({
        bankName: '',
        toAccount: '',
        accountName: '',
        swiftIban: '',
        bankAddress: '',
        email: '',
        phone: '',
        amount: '',
        description: 'International Transfer'
      });
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
          transferType: 'international'
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
      <h1 className="text-2xl font-bold mb-6 text-[#03305c]">International Transfer</h1>
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
          <label className="block text-sm font-medium mb-1">Bank Name</label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={(e) => setFormData({...formData, bankName: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
            placeholder="Enter recipient's bank name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Recipient's Full Name</label>
          <input
            type="text"
            name="accountName"
            value={formData.accountName}
            onChange={(e) => setFormData({...formData, accountName: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
            placeholder="Enter recipient's full name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Recipient's Account Number</label>
          <input
            type="text"
            name="toAccount"
            value={formData.toAccount}
            onChange={(e) => setFormData({...formData, toAccount: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
            placeholder="Enter account number"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SWIFT Code / IBAN</label>
          <input
            type="text"
            name="swiftIban"
            value={formData.swiftIban}
            onChange={(e) => setFormData({...formData, swiftIban: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
            placeholder="Enter SWIFT code or IBAN"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bank Address</label>
          <input
            type="text"
            name="bankAddress"
            value={formData.bankAddress}
            onChange={(e) => setFormData({...formData, bankAddress: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
            placeholder="Enter bank address"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Recipient's Email (Optional)</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
            placeholder="Enter recipient's email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Recipient's Phone (Optional)</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
            placeholder="Enter recipient's phone"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount ({currency})</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
            min="0.01"
            step="0.01"
            max={currentBalance}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description (Optional)</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white font-semibold transition-colors ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#03305c] hover:bg-[#e8742c]'
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