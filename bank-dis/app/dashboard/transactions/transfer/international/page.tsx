// app/dashboard/transactions/transfer/international/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import CurrencyDisplay from '@/app/components/CurrencyDisplay';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function InternationalTransferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ... similar to your existing transfer logic
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">International Transfer</h1>
      
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
          <label className="block text-sm font-medium mb-1">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Account Name</label>
          <input
            type="text"
            name="accountName"
            value={formData.accountName}
            onChange={(e) => setFormData({...formData, accountName: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bank Name</label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={(e) => setFormData({...formData, bankName: e.target.value})}
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">SWIFT/IBAN</label>
          <input
            type="text"
            name="swiftIban"
            value={formData.swiftIban}
            onChange={(e) => setFormData({...formData, swiftIban: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* ... amount and description fields similar to your existing form */}
      </form>
    </div>
  );
}