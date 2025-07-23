// app/dashboard/transactions/transfer/internal/page.tsx
'use client';
import { useState } from 'react';
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

  const checkAccount = async (accountNumber: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/accounts/check?accountNumber=${accountNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (response.ok && data.exists) {
        setAccountExists(true);
        setAccountName(data.accountName || '');
      } else {
        setAccountExists(false);
        setAccountName('');
      }
    } catch (err) {
      setAccountExists(null);
      setAccountName('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ... similar to your existing transfer logic
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Internal Transfer</h1>
      
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Available Balance</p>
        <CurrencyDisplay 
          amount={currentBalance}
          currency={currency}
          className="text-2xl font-bold"
        />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">To Account</label>
          <input
            type="text"
            name="toAccount"
            value={formData.toAccount}
            onChange={(e) => {
              setFormData({...formData, toAccount: e.target.value});
              if (e.target.value.length >= 8) {
                checkAccount(e.target.value);
              }
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter account number"
            required
          />
          {accountExists === true && (
            <p className="text-green-600 text-sm mt-1">Account found: {accountName}</p>
          )}
          {accountExists === false && (
            <p className="text-red-600 text-sm mt-1">Account not found</p>
          )}
        </div>

        {/* ... rest of the form similar to your existing one */}
      </form>
    </div>
  );
}