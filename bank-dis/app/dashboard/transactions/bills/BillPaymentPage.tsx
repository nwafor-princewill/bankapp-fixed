'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import CurrencyDisplay from '@/app/components/CurrencyDisplay';
import Receipt from '@/app/components/Receipt';
import OtpModal from '@/app/components/OtpModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BillPaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bankName: 'ZenaTrust',
    billerId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    reference: `BILL-${Date.now()}`
  });
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptTransactionRef, setReceiptTransactionRef] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<{
    amount: number;
    billerId: string;
    bankName: string;
    paymentDate: string;
    reference: string;
  } | null>(null);

  const billers = [
    { id: '1', name: 'Electricity Company', category: 'Utilities', accountNumber: 'ELEC-12345' },
    { id: '2', name: 'Water Corporation', category: 'Utilities', accountNumber: 'WATER-67890' },
    { id: '3', name: 'Internet Provider', category: 'Telecom', accountNumber: 'NET-54321' },
    { id: '4', name: 'Cable TV', category: 'Entertainment', accountNumber: 'TV-98765' },
    { id: '5', name: 'Mobile Carrier', category: 'Telecom', accountNumber: 'MOBILE-13579' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!formData.billerId) {
      toast.error('Please select a biller');
      return;
    }

    setPendingPayment({
      amount,
      billerId: formData.billerId,
      bankName: formData.bankName,
      paymentDate: formData.paymentDate,
      reference: formData.reference
    });
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const selectedBiller = billers.find(b => b.id === formData.billerId);
      if (!selectedBiller) {
        throw new Error('Please select a valid biller');
      }

      const response = await fetch(`${API_URL}/api/bill-payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          billerId: formData.billerId,
          amount,
          bankName: formData.bankName,
          paymentDate: formData.paymentDate,
          reference: formData.reference,
          billerName: selectedBiller.name
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to initiate bill payment.');
      }

      toast.success('OTP sent to your registered email.');
      setShowOtpModal(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to initiate bill payment.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string): Promise<boolean> => {
    if (!pendingPayment) return false;
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const selectedBiller = billers.find(b => b.id === pendingPayment.billerId);
      if (!selectedBiller) {
        throw new Error('Invalid biller selected');
      }

      const response = await fetch(`${API_URL}/api/bill-payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          billerId: pendingPayment.billerId,
          amount: pendingPayment.amount,
          bankName: pendingPayment.bankName,
          paymentDate: pendingPayment.paymentDate,
          reference: pendingPayment.reference,
          billerName: selectedBiller.name,
          otp
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Bill payment execution failed.');
      }

      toast.success(`Payment of $${pendingPayment.amount.toFixed(2)} to ${selectedBiller.name} was successful!`);
      setShowOtpModal(false);
      setReceiptTransactionRef(data.reference || `BILL-TRX-${Date.now()}`);
      setShowReceipt(true);

      setFormData({
        bankName: 'ZenaTrust',
        billerId: '',
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        reference: `BILL-${Date.now()}`
      });
      setPendingPayment(null);
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!pendingPayment) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const selectedBiller = billers.find(b => b.id === pendingPayment.billerId);
      if (!selectedBiller) {
        throw new Error('Invalid biller selected');
      }

      const response = await fetch(`${API_URL}/api/bill-payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          billerId: pendingPayment.billerId,
          amount: pendingPayment.amount,
          bankName: pendingPayment.bankName,
          paymentDate: pendingPayment.paymentDate,
          reference: pendingPayment.reference,
          billerName: selectedBiller.name
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
      <h1 className="text-2xl font-bold mb-6 text-[#03305c]">Pay Bills</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Bank Name</label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={(e) => setFormData({...formData, bankName: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
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
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
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
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white font-semibold transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#03305c] hover:bg-[#e8742c]'
          }`}
        >
          {loading ? 'Processing...' : 'Pay Bill'}
        </button>
      </form>

      {showReceipt && (
        <Receipt 
          transactionId={receiptTransactionRef}
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