// components/Treasury.tsx
'use client';
import React from 'react';
import { FiMonitor, FiDollarSign, FiZap, FiMove, FiBriefcase, FiShield } from 'react-icons/fi';

// Define the type for a single feature item
interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
  points: string[];
}

// Data for the feature sections
const features: FeatureItem[] = [
  {
    icon: FiMonitor,
    title: 'Secure account access around the clock',
    description: 'Provides detailed statements to review and analyze account activities.',
    points: [
      'Account Information Reporting',
      'Mobile Banking - Check account balances, pay bills, and deposit checks from your mobile phone.'
    ]
  },
  {
    icon: FiDollarSign,
    title: 'Accelerate processing of funds',
    description: 'This convenient service allows checks to be deposited electronically right from a desktop scanner and computer.',
    points: [
      'Remote Deposit Capture',
      'Check Management/Check Image Retrieval - Retrieves images of paid checks for up to 120-days online.'
    ]
  },
  {
    icon: FiZap,
    title: 'Conduct business more efficiently',
    description: 'A convenient and cost-effective method of collecting or disbursing funds. Allows operating accounts to be automatically funded from a concentration or sweep account.',
    points: [
      'ACH Origination',
      'Zero Balance Account (ZBA) and Cash Concentration Accounts',
      'Account Reconciliation - Makes reconciling your accounts simple, paperless, and efficient.',
      'Bill Pay/Receive Payments - Allows you to receive payments from and send bills electronically to your customers.'
    ]
  },
  {
    icon: FiMove,
    title: 'Move funds easily and securely',
    description: 'A safe and quick way to receive or transfer funds to another institution located in the United States.',
    points: [
      'Wire/Book Transfer',
      'Internal Funds Transfer - Enables the electronic transfer of funds between ZenaTrust Bank accounts.',
      'Fraud Prevention - Safeguard your account when you use Check Positive Pay or ACH Positive Pay to quickly and efficiently detect fraudulent activity.'
    ]
  },
  {
    icon: FiBriefcase,
    title: 'Meet more of your business needs',
    description: 'Allows funds to be held in escrow and transferred from sub-accounts into the disbursement accounts upon authorization. If requested, the bank will set up an escrow account.',
    points: [
      'Escrow Management Services',
      'Lock Box - Allows receipt of all check payments in a centralized location. Lock box services enable more effective management of accounts receivable.'
    ]
  }
];

const TreasuryFeatureCard: React.FC<{ feature: FeatureItem }> = ({ feature }) => (
  <div className="flex items-start space-x-6 p-8 border-b border-gray-200 last:border-b-0">
    <div className="flex-shrink-0">
      <feature.icon className="w-12 h-12 text-[#e8742c]" />
    </div>
    <div>
      <h3 className="text-2xl font-bold text-[#03305c] mb-2">{feature.title}</h3>
      <p className="text-gray-600 mb-4">{feature.description}</p>
      <ul className="space-y-2">
        {feature.points.map((point, index) => (
          <li key={index} className="flex items-start">
            <FiShield className="w-4 h-4 text-green-500 mr-3 mt-1 flex-shrink-0" />
            <span className="text-gray-700">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Treasury = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-[#03305c] sm:text-5xl">
            Treasury Management
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Our powerful Treasury Management tools are designed to help you enhance your financial control for more efficient and cost-effective money management.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {features.map((feature) => (
            <TreasuryFeatureCard key={feature.title} feature={feature} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Treasury;
