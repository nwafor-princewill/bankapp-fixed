'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<boolean>;
  onResend?: () => void; // Optional: To resend the OTP
}

export default function OtpModal({ isOpen, onClose, onVerify, onResend }: OtpModalProps) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input field when the modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      setOtp(''); // Clear previous OTP on open
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const isSuccess = await onVerify(otp);
      if (isSuccess) {
        toast.success('Transfer verified successfully!');
        onClose(); // The parent component will handle showing the receipt
      }
      // If not successful, the onVerify function should have already shown an error toast
    } catch (error) {
      // This catch block is for unexpected errors during the API call
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-2 text-center text-[#03305c]">Enter Verification Code</h2>
        <p className="mb-4 text-gray-600 text-center text-sm">
          A 6-digit code has been sent to your registered email address.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="otp-input" className="sr-only">Enter 6-digit OTP</label>
            <input
              ref={inputRef}
              id="otp-input"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full p-3 text-center text-2xl tracking-[10px] font-mono border-2 rounded-lg focus:ring-2 focus:ring-[#03305c] focus:border-[#03305c]"
              placeholder="------"
              maxLength={6}
              inputMode="numeric"
              required
            />
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#03305c] hover:bg-[#e8742c]'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify & Transfer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
        {onResend && (
            <div className="text-center mt-4">
                <button onClick={onResend} className="text-sm text-[#03305c] hover:underline">
                    Didn't receive the code? Resend
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
