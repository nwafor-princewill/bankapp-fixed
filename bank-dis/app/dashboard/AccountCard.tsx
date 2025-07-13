import React from 'react';
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
          <p className="text-sm text-gray-500">Current Balance</p>
          <CurrencyDisplay 
            amount={balance}
            currency={currency}
            className="text-2xl font-bold"
          />
        </div>
      </div>
    </div>
  );
};

export default AccountCard;