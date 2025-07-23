'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import CurrencyDisplay from '@/app/components/CurrencyDisplay';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function InternalTransferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');
  const [accountExists, setAccountExists] = useState<boolean | null>(null);
  const [accountName, setAccountName] = useState<string>('');
  const [formData, setFormData] = useState({
    toAccount: '',
    amount: '',
    description: 'Internal Transfer'
  });

  // Fetch balance on load
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
          throw new Error('Failed to fetch balance');
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

      // FIX: Add Authorization header to account check request
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

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // FIX: Send proper payload with transferType
      const res = await fetch(`${API_URL}/api/transfers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // FIX: Add Authorization header
        },
        body: JSON.stringify({
          toAccount: formData.toAccount,
          amount: amount, // FIX: Send numeric amount, not string
          description: formData.description,
          transferType: 'internal', // FIX: Explicitly set transferType
          bankName: 'Internal Bank' // FIX: Provide bankName for internal transfers
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Transfer failed');
      }

      const data = await res.json();
      toast.success('Internal transfer completed successfully!');
      
      // Update local balance
      setCurrentBalance(prev => prev - amount);
      
      // Reset form
      setFormData({
        toAccount: '',
        amount: '',
        description: 'Internal Transfer'
      });
      setAccountExists(null);
      setAccountName('');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transfer failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Internal Transfer</h1>
      
      {/* BALANCE DISPLAY */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Available Balance</p>
        <CurrencyDisplay 
          amount={currentBalance}
          currency={currency}
          className="text-2xl font-bold"
        />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TO ACCOUNT FIELD */}
        <div>
          <label className="block text-sm font-medium mb-1">To Account</label>
          <input
            type="text"
            value={formData.toAccount}
            onChange={(e) => {
              setFormData({...formData, toAccount: e.target.value});
              checkAccount(e.target.value);
            }}
            className="w-full p-2 border rounded"
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

        {/* AMOUNT FIELD */}
        <div>
          <label className="block text-sm font-medium mb-1">Amount ({currency})</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="w-full p-2 border rounded"
            min="0.01"
            step="0.01"
            max={currentBalance}
            placeholder="Enter amount"
            required
          />
        </div>

        {/* DESCRIPTION FIELD */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Transfer description"
          />
        </div>

        {/* TRANSFER BUTTON */}
        <button
          type="submit"
          disabled={loading || accountExists === false}
          className={`w-full py-2 px-4 rounded text-white ${
            loading || accountExists === false 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#03305c] hover:bg-[#e8742c]'
          }`}
        >
          {loading ? 'Processing...' : 'Transfer Money'}
        </button>
      </form>
    </div>
  );
}