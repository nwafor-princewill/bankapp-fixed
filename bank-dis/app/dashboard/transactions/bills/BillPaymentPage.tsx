'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import CurrencyDisplay from '@/app/components/CurrencyDisplay';
import Receipt from '@/app/components/Receipt';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BillPaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bankName: 'Amalgamated Bank',
    billerId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    reference: `BILL-${Date.now()}`
  });
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptTransactionId, setReceiptTransactionId] = useState('');

  // Hardcoded billers from your original code
  const billers = [
    { id: '1', name: 'Electricity Company', category: 'Utilities', accountNumber: 'ELEC-12345' },
    { id: '2', name: 'Water Corporation', category: 'Utilities', accountNumber: 'WATER-67890' },
    { id: '3', name: 'Internet Provider', category: 'Telecom', accountNumber: 'NET-54321' },
    { id: '4', name: 'Cable TV', category: 'Entertainment', accountNumber: 'TV-98765' },
    { id: '5', name: 'Mobile Carrier', category: 'Telecom', accountNumber: 'MOBILE-13579' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Please enter a valid amount');
    }

    const selectedBiller = billers.find(b => b.id === formData.billerId);
    if (!selectedBiller) {
      throw new Error('Please select a biller');
    }

    const response = await fetch(`${API_URL}/api/bill-payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        billerId: formData.billerId,
        amount: amount,
        paymentDate: formData.paymentDate,
        reference: formData.reference
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Payment failed');

    toast.success(`Payment of $${amount.toFixed(2)} to ${selectedBiller.name} was successful!`);

    // Add these 2 lines RIGHT HERE:
    setReceiptTransactionId(data.reference || `BILL-${Date.now()}`);
    setShowReceipt(true);
    
    // Reset form
    setFormData({
      bankName: 'Amalgamated Bank',
      billerId: '',
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      reference: `BILL-${Date.now()}`
    });

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
            readOnly
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
          <label className="block text-sm font-medium mb-1">Amount</label>
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

        {/* <div>
          <label className="block text-sm font-medium mb-1">Payment Date</label>
          <input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div> */}

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

      return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
          {/* ... existing JSX ... */}
          {showReceipt && (
            <Receipt 
              transactionId={receiptTransactionId}
              onClose={() => setShowReceipt(false)}
            />
          )}
        </div>
      );

    </div>
  );
}