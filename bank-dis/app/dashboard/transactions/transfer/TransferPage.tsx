'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import CurrencyDisplay from '@/app/components/CurrencyDisplay';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TransferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');
  const [formData, setFormData] = useState({
    bankName: '',
    toAccount: '',
    amount: '',
    description: 'Fund Transfer'
  });

  // Fetch user balance on component mount
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // First try the primary account endpoint
        let response = await fetch(`${API_URL}/api/accounts/primary`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // If primary endpoint fails, try the summary endpoint as fallback
        if (!response.ok) {
          response = await fetch(`${API_URL}/api/accounts/summary`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch balance');
        }

        const data = await response.json();
        // Handle both response formats
        const balance = data.balance ?? data.data?.availableBalance ?? 0;
        const currency = data.currency ?? data.data?.currency ?? 'USD';
        setCurrentBalance(balance);
        setCurrency(currency);
      } catch (error) {
        console.error('Error fetching balance:', error);
        toast.error('Failed to load account balance. Showing 0.00 as default.');
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

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/transfers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bankName: formData.bankName,
          toAccount: formData.toAccount,
          amount: amount,
          description: formData.description
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Transfer failed');

      toast.success(`Transfer of $${amount.toFixed(2)} completed successfully!`, {
        autoClose: 5000
      });
      
      // Update local balance
      setCurrentBalance(prev => prev - amount);
      
      // Reset form
      setFormData({
        bankName: '',
        toAccount: '',
        amount: '',
        description: 'Fund Transfer'
      });
      
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Transfer Funds</h1>
      
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
          <label className="block text-sm font-medium mb-1">Bank Name</label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={(e) => setFormData({...formData, bankName: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Enter bank name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">To Account</label>
          <input
            type="text"
            name="toAccount"
            value={formData.toAccount}
            onChange={(e) => setFormData({...formData, toAccount: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Enter account number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount ({currency})</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="w-full p-2 border rounded"
            min="0.01"
            step="0.01"
            max={currentBalance}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? 'bg-gray-400' : 'bg-[#03305c] hover:bg-[#e8742c]'
          }`}
        >
          {loading ? 'Processing...' : 'Transfer Money'}
        </button>
      </form>
    </div>
  );
}