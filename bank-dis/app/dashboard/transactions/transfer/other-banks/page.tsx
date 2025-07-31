'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import CurrencyDisplay from '@/app/components/CurrencyDisplay';
import Receipt from '@/app/components/Receipt';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TransferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');
  
  // **FIX 1: Add new fields to the form state**
  const [formData, setFormData] = useState({
    bankName: '',
    toAccount: '',
    accountName: '', // New field for recipient's name
    swiftIban: '',   // New field for SWIFT/IBAN
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

        const response = await fetch(`${API_URL}/api/accounts/primary`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch balance');
        }

        const data = await response.json();
        const balance = data.balance ?? 0;
        const currency = data.currency ?? 'USD';
        setCurrentBalance(balance);
        setCurrency(currency);
      } catch (error) {
        console.error('Error fetching balance:', error);
        toast.error('Failed to load account balance.');
        setCurrentBalance(0);
        setCurrency('USD');
      }
    };

    fetchBalance();
  }, [router]);

  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptTransactionId, setReceiptTransactionId] = useState('');

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
        // **FIX 2: Send the new fields in the request body**
        body: JSON.stringify({
          bankName: formData.bankName,
          toAccount: formData.toAccount,
          accountName: formData.accountName,
          swiftIban: formData.swiftIban,
          amount: amount,
          description: formData.description,
          transferType: 'international' // Assuming this form is for other banks/international
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Transfer failed');

      toast.success(`Transfer of ${currency} ${amount.toFixed(2)} completed successfully!`);

      setReceiptTransactionId(data.reference || `TRX-${Date.now()}`);
      setShowReceipt(true);
      
      setCurrentBalance(prev => prev - amount);
      
      // **FIX 3: Reset the new fields in the form**
      setFormData({
        bankName: '',
        toAccount: '',
        accountName: '',
        swiftIban: '',
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
      <h1 className="text-2xl font-bold mb-6 text-[#03305c]">Transfer to Other Banks</h1>
      
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

        {/* **FIX 4: Add the new "Account Name" input field** */}
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

        {/* **FIX 5: Add the new "SWIFT/IBAN" input field** */}
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
          {loading ? 'Processing...' : 'Transfer Money'}
        </button>
      </form>

      {showReceipt && (
        <Receipt 
          transactionId={receiptTransactionId}
          onClose={() => setShowReceipt(false)}
        />
      )}

    </div>
  );
}
