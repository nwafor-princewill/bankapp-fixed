'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function VerifyPinModal({ 
  isOpen, 
  onClose, 
  onVerify,
  onForgotPin
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onVerify: (pin: string) => Promise<boolean>;
  onForgotPin: () => void;
}) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      toast.error('Please enter a valid 4-digit PIN');
      return;
    }

    setLoading(true);
    try {
      const isValid = await onVerify(pin);
      if (isValid) {
        onClose();
      } else {
        toast.error('Invalid PIN');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-[#03305c]">Verify Transfer PIN</h2>
        <p className="mb-4 text-gray-600">
          Please enter your 4-digit transfer PIN to continue
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Transfer PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
              placeholder="Enter 4-digit PIN"
              maxLength={4}
              inputMode="numeric"
              required
              autoFocus
            />
          </div>
          
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onForgotPin}
              className="text-sm text-[#e8742c] hover:underline"
            >
              Forgot PIN?
            </button>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-md text-white ${
                  loading ? 'bg-gray-400' : 'bg-[#03305c] hover:bg-[#e8742c]'
                }`}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}