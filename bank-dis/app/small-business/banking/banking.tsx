import React from 'react';

const BusinessBankingTools = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#03305c] mb-6">
          Business Banking Tools That Amplify Your Impact
        </h1>
        <p className="text-xl text-[#03305c] max-w-3xl mx-auto">
          As America's largest B Corp bank, we're dedicated to helping business and organizations like yours succeed. 
          If you want to grow your business and have a positive impact, we are the Bank for you.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {/* Business Checking Plus */}
        <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold text-[#03305c] mb-4">ZenaTrust Business Checking Plus</h3>
          <p className="text-[#03305c] mb-6">
            A checking account designed for growing business, with ultra-connected everyday banking and easy cashflow and transaction management.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-bold text-[#e8742c] mb-2">2023 USERS</h4>
            <div className="text-[#03305c] space-y-2">
              <p className="font-bold">$0 <span className="font-normal">Minimum opening deposit</span></p>
              <p>$50 transactions included*</p>
              <p>$50 monthly service fee*</p>
              <p>Includes Treasury Management</p>
            </div>
          </div>
        </div>

        {/* Business Checking */}
        <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold text-[#03305c] mb-4">ZenaTrust Business Checking</h3>
          <p className="text-[#03305c] mb-6">
            Essential checking with 10 monthly maintenance and limited transactions for your business or organization's everyday needs.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-bold text-[#e8742c] mb-2">2022 USERS</h4>
            <div className="text-[#03305c] space-y-2">
              <p className="font-bold">$0 <span className="font-normal">Minimum Opening Deposit</span></p>
              <p>$0 transactions included*</p>
              <p>$0 monthly service fee</p>
              <p>Includes Treasury Management</p>
            </div>
          </div>
        </div>

        {/* Money Market Account */}
        <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold text-[#03305c] mb-4">Small Business Money Market Account</h3>
          <p className="text-[#03305c] mb-6">
            A savings account that helps you grow your business savings faster with a higher rate of interest on larger business.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-bold text-[#e8742c] mb-2">2023 USERS</h4>
            <div className="text-[#03305c] space-y-2">
              <p className="font-bold">$1,000 <span className="font-normal">Minimum initial deposit</span></p>
              <p>$7 monthly fee*</p>
              <p>Utilized in-person and electronic deposits and withdrawals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-[#f5f5f5] p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-[#e8742c] mb-4">Learn about our mission</h3>
          <p className="text-[#03305c]">
            ZenaTrust is for those who want the power to make more impact by using the financial system to advance social goals. 
            We are committed to ensuring your personal prosperity leads to collective prosperity for all of us and our planet.
          </p>
        </div>

        <div className="bg-[#f5f5f5] p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-[#e8742c] mb-4">Fight climate change with a debit card</h3>
          <p className="text-[#03305c]">
            Made from renewable resources, our Climate Impact Debit Mastercard® replaces up to 80% of fossil-based plastics found in traditional debit cards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessBankingTools;