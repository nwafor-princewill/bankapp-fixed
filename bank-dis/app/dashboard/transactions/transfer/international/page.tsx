'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import CurrencyDisplay from '@/app/components/CurrencyDisplay';
import Receipt from '@/app/components/Receipt';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function InternationalTransferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');
   // Receipt state management
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptTransactionId, setReceiptTransactionId] = useState('');
  const [formData, setFormData] = useState({
    accountNumber: '',
    accountName: '',
    bankName: '',
    bankAddress: '',
    swiftIban: '',
    email: '',
    phone: '',
    amount: '',
    description: 'International Transfer'
  });

  // EXISTING BALANCE FETCH (UNCHANGED)
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
          throw new Error('Failed to fetch balance');
        }

        const data = await response.json();
        setCurrentBalance(data.balance ?? data.data?.availableBalance ?? 0);
        setCurrency(data.currency ?? data.data?.currency ?? 'USD');
      } catch (error) {
        console.error('Error fetching balance:', error);
        toast.error('Failed to load account balance');
        setCurrentBalance(0);
        setCurrency('USD');
      }
    };

    fetchBalance();
  }, [router]);

  // FIXED SUBMIT HANDLER
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

    // Validate required fields for international transfer
    if (!formData.accountNumber || !formData.accountName || !formData.bankName || !formData.swiftIban) {
      toast.error('Please fill in all required fields (Account Number, Account Name, Bank Name, SWIFT/IBAN)');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // FIX: Send proper payload structure matching backend expectations
      const response = await fetch(`${API_URL}/api/transfers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          // FIX: Map frontend fields to backend expected fields
          toAccount: formData.accountNumber, // Backend expects 'toAccount'
          amount: amount, // Numeric amount
          description: formData.description,
          transferType: 'international', // Explicitly set transfer type
          // International-specific fields
          accountName: formData.accountName,
          bankName: formData.bankName,
          bankAddress: formData.bankAddress,
          swiftIban: formData.swiftIban,
          email: formData.email,
          phone: formData.phone
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'International transfer failed');
      }

      const data = await response.json();
      toast.success(`International transfer of ${amount.toFixed(2)} ${currency} initiated successfully!`, {
        autoClose: 5000
      });

      // Add these lines:
      setReceiptTransactionId(data.reference || `INT-TRX-${Date.now()}`);
      setShowReceipt(true);
      
      // Update local balance
      setCurrentBalance(prev => prev - amount);
      
      // Reset form
      setFormData({
        accountNumber: '',
        accountName: '',
        bankName: '',
        bankAddress: '',
        swiftIban: '',
        email: '',
        phone: '',
        amount: '',
        description: 'International Transfer'
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'International transfer failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">International Transfer</h1>
      
      {/* EXISTING BALANCE DISPLAY (UNCHANGED) */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Available Balance</p>
        <CurrencyDisplay 
          amount={currentBalance}
          currency={currency}
          className="text-2xl font-bold"
        />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ALL EXISTING INTERNATIONAL FIELDS */}
        <div>
          <label className="block text-sm font-medium mb-1">Account Number *</label>
          <input
            type="text"
            value={formData.accountNumber}
            onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Enter recipient account number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Account Name *</label>
          <input
            type="text"
            value={formData.accountName}
            onChange={(e) => setFormData({...formData, accountName: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Enter account holder name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bank Name *</label>
          <input
            type="text"
            value={formData.bankName}
            onChange={(e) => setFormData({...formData, bankName: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Enter bank name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bank Address</label>
          <input
            type="text"
            value={formData.bankAddress}
            onChange={(e) => setFormData({...formData, bankAddress: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Enter bank address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">SWIFT/IBAN *</label>
          <input
            type="text"
            value={formData.swiftIban}
            onChange={(e) => setFormData({...formData, swiftIban: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Enter SWIFT or IBAN code"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Enter recipient email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Enter recipient phone"
          />
        </div>

        {/* AMOUNT FIELD */}
        <div>
          <label className="block text-sm font-medium mb-1">Amount ({currency}) *</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="w-full p-2 border rounded"
            min="0.01"
            step="0.01"
            max={currentBalance}
            placeholder="Enter transfer amount"
            required
          />
        </div>

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
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? 'bg-gray-400' : 'bg-[#03305c] hover:bg-[#e8742c]'
          }`}
        >
          {loading ? 'Processing...' : 'Transfer Money'}
        </button>
      </form>
    {/* Receipt Modal or Section */}
    {showReceipt && (
      <Receipt 
        transactionId={receiptTransactionId}
        onClose={() => setShowReceipt(false)}
      />
    )}
    </div>
  );
}