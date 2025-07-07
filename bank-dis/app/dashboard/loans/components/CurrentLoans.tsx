'use client';
import { FaHandHoldingUsd } from 'react-icons/fa';

export default function CurrentLoans() {
  // Mock data - in a real app, this would come from backend
  const currentLoans = []; // Empty array shows "No current loan found"

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <FaHandHoldingUsd className="text-2xl text-[#03305c]" />
        <h2 className="text-xl font-bold text-[#03305c]">CURRENT LOANS</h2>
      </div>

      {currentLoans.length > 0 ? (
        <div className="space-y-4">
          {/* This would map through actual loans */}
          <div className="border-b pb-4">
            <h3 className="font-medium">Personal Loan</h3>
            <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
              <div>
                <p className="text-gray-500">Amount</p>
                <p>$10,000</p>
              </div>
              <div>
                <p className="text-gray-500">Term</p>
                <p>12 months</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="text-green-500">Active</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded text-center">
          <p className="text-gray-500">No current loan found!</p>
          <p className="text-sm mt-2 text-gray-400">
            You don't have any active loans. Request a new loan below.
          </p>
        </div>
      )}
    </div>
  );
}