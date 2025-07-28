'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPrinter, FiDownload, FiX } from 'react-icons/fi';
import CurrencyDisplay from './CurrencyDisplay';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Receipt({ transactionId, onClose }: { 
  transactionId: string, 
  onClose: () => void 
}) {
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${API_URL}/api/receipts/${transactionId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch receipt');

        const data = await response.json();
        setReceipt(data.data);
      } catch (err) {
        console.error('Error fetching receipt:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [transactionId, router]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implement PDF download functionality
    alert('PDF download would be implemented here');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <p>Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <p>Receipt not found</p>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-200 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Transaction Receipt</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Reference:</span>
            <span>{receipt.reference}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Date:</span>
            <span>{new Date(receipt.transactionDate).toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Status:</span>
            <span className="capitalize">{receipt.status}</span>
          </div>
        </div>

        <div className="border-b pb-4 mb-4">
          <h3 className="font-medium mb-2">Transaction Details</h3>
          <div className="flex justify-between mb-2">
            <span>Type:</span>
            <span className="capitalize">{receipt.type}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Amount:</span>
            <CurrencyDisplay 
              amount={receipt.amount} 
              currency={receipt.currency}
              className="font-medium"
            />
          </div>
          <div className="flex justify-between mb-2">
            <span>Description:</span>
            <span>{receipt.description}</span>
          </div>
          {receipt.recipientDetails && (
            <>
              <div className="flex justify-between mb-2">
                <span>Recipient:</span>
                <span>{receipt.recipientDetails.accountName}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Account:</span>
                <span>{receipt.recipientAccount || receipt.recipientDetails.accountNumber}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between mb-4">
          <span className="font-medium">New Balance:</span>
          <CurrencyDisplay 
            amount={receipt.balanceAfter} 
            currency={receipt.currency}
            className="font-medium"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded"
          >
            <FiPrinter /> Print
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            <FiDownload /> Download
          </button>
        </div>
      </div>
    </div>
  );
}