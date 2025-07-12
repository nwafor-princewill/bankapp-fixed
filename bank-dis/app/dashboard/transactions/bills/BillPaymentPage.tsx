'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Biller {
  id: string;
  name: string;
  category: string;
  accountNumber: string;
}

interface Account {
  accountNumber: string;
  balance: number;
  type: string;
}

export default function BillPaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [billers, setBillers] = useState<Biller[]>([]);
  const [formData, setFormData] = useState({
    bankName: 'Amalgamateed Bank', // Changed from fromAccount to bankName
    billerId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    reference: `BILL-${Date.now()}`
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch billers - now using hardcoded billers instead of API call
        const hardcodedBillers: Biller[] = [
          { id: '1', name: 'Electricity Company', category: 'Utilities', accountNumber: 'ELEC-12345' },
          { id: '2', name: 'Water Corporation', category: 'Utilities', accountNumber: 'WATER-67890' },
          { id: '3', name: 'Internet Provider', category: 'Telecom', accountNumber: 'NET-54321' },
          { id: '4', name: 'Cable TV', category: 'Entertainment', accountNumber: 'TV-98765' },
          { id: '5', name: 'Mobile Carrier', category: 'Telecom', accountNumber: 'MOBILE-13579' }
        ];
        setBillers(hardcodedBillers);

        // Keeping accounts fetch in case you need it elsewhere
        const accountsRes = await fetch(`${API_URL}/api/accounts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const accountsData = await accountsRes.json();
        if (accountsRes.ok) setAccounts(accountsData.accounts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Show error message instead of processing payment
      throw new Error('Cannot pay bills now. Try again later.');
      
      // The original API call is commented out since we're showing error
      /*
      const response = await fetch(`${API_URL}/api/bill-payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Payment failed');

      toast.success(`Bill payment of $${formData.amount} processed!`);
      router.push('/dashboard');
      */
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Pay Bills</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Bank Name</label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={(e) => setFormData({...formData, bankName: e.target.value})}
            className="w-full p-2 border rounded"
            required
            readOnly // Making it read-only since it's fixed to "Global Trust Bank"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Biller</label>
          <select
            name="billerId"
            value={formData.billerId}
            onChange={(e) => setFormData({...formData, billerId: e.target.value})}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Biller</option>
            {billers.map((biller) => (
              <option key={biller.id} value={biller.id}>
                {biller.name} ({biller.category})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="w-full p-2 border rounded"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Payment Date</label>
          <input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? 'bg-gray-400' : 'bg-[#03305c] hover:bg-[#e8742c]'
          }`}
        >
          {loading ? 'Processing...' : 'Pay Bill'}
        </button>
      </form>
    </div>
  );
}