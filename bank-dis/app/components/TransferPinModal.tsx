'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function TransferPinModal({ isOpen, onClose, onSetPin }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSetPin: (pin: string) => Promise<void> 
}) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      toast.error('PIN must be 4 digits');
      return;
    }
    if (pin !== confirmPin) {
      toast.error('PINs do not match');
      return;
    }

    setLoading(true);
    try {
      await onSetPin(pin);
      toast.success('Transfer PIN set successfully');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to set PIN');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-[#03305c]">Set Transfer PIN</h2>
        <p className="mb-4 text-gray-600">
          Create a 4-digit PIN that will be required for all transfers
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New PIN (4 digits)</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
              placeholder="Enter 4-digit PIN"
              maxLength={4}
              inputMode="numeric"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Confirm PIN</label>
            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#03305c]"
              placeholder="Confirm 4-digit PIN"
              maxLength={4}
              inputMode="numeric"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
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
              {loading ? 'Saving...' : 'Set PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}