import React, { useState } from 'react';
// import CurrencyDisplay from './CurrencyDisplay';
import CurrencyDisplay from '@/app/components/CurrencyDisplay';

interface AccountCardProps {
  accountNumber: string;
  accountName: string;
  accountType: string;
  balance: number;
  currency: string;
  iban?: string;
  routingNumber?: string;
  openingDate?: string;
}

const AccountCard: React.FC<AccountCardProps> = ({
  accountNumber,
  accountName,
  accountType,
  balance,
  currency,
  iban,
  routingNumber,
  openingDate
}) => {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-[#03305c]">
      <h3 className="text-xl font-bold text-[#03305c] mb-4">Your Account Details</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Account Name</p>
          <p className="font-medium">{accountName}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Account Number</p>
          <p className="font-mono font-medium">{accountNumber}</p>
        </div>
        
        {iban && (
          <div>
            <p className="text-sm text-gray-500">IBAN</p>
            <p className="font-mono">{iban}</p>
          </div>
        )}
        
        {routingNumber && (
          <div>
            <p className="text-sm text-gray-500">Routing Number</p>
            <p className="font-mono">{routingNumber}</p>
          </div>
        )}
        
        {/* <div>
          <p className="text-sm text-gray-500">Account Type</p>
          <p className="font-medium">{accountType}</p>
        </div> */}

        {openingDate && (
          <div>
            <p className="text-sm text-gray-500">Account Opened</p>
            <p className="font-medium">{new Date(openingDate).toLocaleDateString()}</p>
          </div>
        )}
        
        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Current Balance</p>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showBalance ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              )}
            </button>
          </div>
          {showBalance ? (
            <CurrencyDisplay
              amount={balance}
              currency={currency}
              className="text-2xl font-bold"
            />
          ) : (
            <div className="text-2xl font-bold">••••••</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountCard;