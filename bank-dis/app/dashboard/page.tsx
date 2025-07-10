'use client'; 

import React, { useEffect, useState } from 'react';
import AccountSummary from './AccountSummary';
import QuickActions from './QuickActions';
import AccountCard from './AccountCard';
import CryptoTransactions from './crypto/CryptoTransactions';
import CryptoSummary from './crypto/CryptoSummary';
import SendBTC from './crypto/SendBTC';
import TransactionHistory from './TransactionHistory';

interface UserAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accounts: {
    accountNumber: string;
    accountName: string;
    accountType: string;
    balance: number;
    currency: string;
    iban?: string;
    routingNumber?: string;
    openingDate: string;
  }[];
}

const DashboardPage = () => {
  const [accountData, setAccountData] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const data = await response.json();
        setAccountData(data.user); 

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#03305c] dark:border-blue-400"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-red-500 dark:text-red-400">{error}</div>
    </div>
  );

  const defaultAccount = {
    accountNumber: '0000000000',
    accountName: 'TEST ACCOUNT',
    accountType: 'Checking',
    balance: 1000.00,
    currency: 'USD',
    iban: 'US00AMAL0010000000000',
    routingNumber: '021000021',
    openingDate: new Date().toISOString().split('T')[0]
  };

  const primaryAccount = (accountData?.accounts && accountData.accounts.length > 0) 
    ? accountData.accounts[0] 
    : defaultAccount;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#03305c] dark:text-gray-100">
        Welcome back, {accountData?.firstName} {accountData?.lastName}!
      </h1>

      {/* Mobile: Single column, Desktop: 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mobile Order #1, Desktop: Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <AccountCard 
            accountNumber={primaryAccount.accountNumber}
            accountName={primaryAccount.accountName}
            accountType={primaryAccount.accountType}
            balance={primaryAccount.balance}
            currency={primaryAccount.currency}
            iban={primaryAccount.iban}
            routingNumber={primaryAccount.routingNumber}
            openingDate={primaryAccount.openingDate}
          />
          {/* Desktop: CryptoSummary and SendBTC in left column */}
          <div className="hidden lg:block">
            <CryptoSummary />
          </div>
          <div className="hidden lg:block">
            <SendBTC />
          </div>
        </div>

        {/* Desktop: Right Column (2 columns wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Desktop: Top row with AccountSummary and QuickActions */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6">
            <AccountSummary accountNumber={primaryAccount.accountNumber} />
            <QuickActions accountNumber={primaryAccount.accountNumber} />
          </div>
          
          {/* Desktop: TransactionHistory spanning full width */}
          <div className="hidden lg:block">
            <TransactionHistory accountNumber={primaryAccount.accountNumber} />
          </div>
          
          {/* Desktop: CryptoTransactions */}
          <div className="hidden lg:block">
            <CryptoTransactions />
          </div>
        </div>

        {/* Mobile Order #2: QuickActions (shown only on mobile) */}
        <div className="lg:hidden">
          <QuickActions accountNumber={primaryAccount.accountNumber} />
        </div>
        
        {/* Mobile Order #3: AccountSummary (shown only on mobile) */}
        <div className="lg:hidden">
          <AccountSummary accountNumber={primaryAccount.accountNumber} />
        </div>

        {/* Mobile Order #4: TransactionHistory (shown only on mobile) */}
        <div className="lg:hidden">
          <TransactionHistory accountNumber={primaryAccount.accountNumber} />
        </div>

        {/* Mobile Order #5: CryptoSummary (shown only on mobile) */}
        <div className="lg:hidden">
          <CryptoSummary />
        </div>

        {/* Mobile Order #6: SendBTC (shown only on mobile) */}
        <div className="lg:hidden">
          <SendBTC />
        </div>

        {/* Mobile Order #7: CryptoTransactions (shown only on mobile) */}
        <div className="lg:hidden">
          <CryptoTransactions />
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;