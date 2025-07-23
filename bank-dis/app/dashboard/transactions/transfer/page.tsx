// import TransferPage from './TransferPage';

// export default function Transfer() {
//   return <TransferPage />;
// }


// app/dashboard/transactions/transfer/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MdAccountBalance, MdPayment, MdPublic } from 'react-icons/md';
import { usePathname } from 'next/navigation';

export default function TransferPage() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (pathname.includes('/internal')) return 'internal';
    if (pathname.includes('/other-banks')) return 'other-banks';
    if (pathname.includes('/international')) return 'international';
    return 'other-banks'; // Default tab
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Transfer Money</h1>
      
      {/* Transfer Type Selector */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('internal')}
          className={`py-2 px-4 font-medium ${activeTab === 'internal' ? 'text-[#03305c] border-b-2 border-[#03305c]' : 'text-gray-500 hover:text-[#03305c]'}`}
        >
          Internal Transfer
        </button>
        <button
          onClick={() => setActiveTab('other-banks')}
          className={`py-2 px-4 font-medium ${activeTab === 'other-banks' ? 'text-[#03305c] border-b-2 border-[#03305c]' : 'text-gray-500 hover:text-[#03305c]'}`}
        >
          Other Banks
        </button>
        <button
          onClick={() => setActiveTab('international')}
          className={`py-2 px-4 font-medium ${activeTab === 'international' ? 'text-[#03305c] border-b-2 border-[#03305c]' : 'text-gray-500 hover:text-[#03305c]'}`}
        >
          International
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'internal' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MdAccountBalance className="text-2xl text-[#03305c] mr-2" />
              Internal Transfer
            </h2>
            <p className="text-gray-600 mb-6">Transfer between your accounts or to other accounts within our bank</p>
            <Link 
              href="/dashboard/transactions/transfer/internal"
              className="inline-block bg-[#03305c] text-white px-4 py-2 rounded hover:bg-[#e8742c] transition-colors"
            >
              Start Internal Transfer
            </Link>
          </div>
        )}

        {activeTab === 'other-banks' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MdPayment className="text-2xl text-[#03305c] mr-2" />
              Transfer to Other Banks
            </h2>
            <p className="text-gray-600 mb-6">Transfer to accounts in other banks within the same country</p>
            <Link 
              href="/dashboard/transactions/transfer/other-banks"
              className="inline-block bg-[#03305c] text-white px-4 py-2 rounded hover:bg-[#e8742c] transition-colors"
            >
              Start Bank Transfer
            </Link>
          </div>
        )}

        {activeTab === 'international' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MdPublic className="text-2xl text-[#03305c] mr-2" />
              International Transfer
            </h2>
            <p className="text-gray-600 mb-6">Send money to accounts in other countries</p>
            <Link 
              href="/dashboard/transactions/transfer/international"
              className="inline-block bg-[#03305c] text-white px-4 py-2 rounded hover:bg-[#e8742c] transition-colors"
            >
              Start International Transfer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}