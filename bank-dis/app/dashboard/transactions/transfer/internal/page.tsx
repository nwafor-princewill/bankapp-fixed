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
    amount: '', // ADDED AMOUNT FIELD
    description: 'Internal Transfer'
  });

  // Fetch balance on load
  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/accounts/primary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCurrentBalance(data.balance || data.availableBalance || 0);
      setCurrency(data.currency || 'USD');
    };
    fetchBalance();
  }, []);

  const checkAccount = async (accountNumber: string) => {
    if (accountNumber.length < 8) return;
    const res = await fetch(`${API_URL}/api/accounts/check?accountNumber=${accountNumber}`);
    const data = await res.json();
    setAccountExists(data.exists);
    setAccountName(data.accountName || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/api/transfers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          transferType: 'internal',
          bankName: 'Amalgamateed Bank' // Internal transfers don't need bank name
        })
      });
      
      if (!res.ok) throw new Error('Transfer failed');
      toast.success('Transfer completed!');
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
      
      {/* BALANCE DISPLAY - FIXED */}
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
            required
          />
          {accountExists === false && (
            <p className="text-red-500 text-sm mt-1">Account not found</p>
          )}
        </div>

        {/* AMOUNT FIELD - ADDED */}
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
            required
          />
        </div>

        {/* TRANSFER BUTTON - FIXED */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-[#03305c] text-white rounded hover:bg-[#e8742c] disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Transfer Money'}
        </button>
      </form>
    </div>
  );
}