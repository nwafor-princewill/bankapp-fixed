import React from 'react';
import { FaHandHoldingUsd, FaUniversity, FaFileSignature, FaChartLine, FaBalanceScale, FaBusinessTime } from 'react-icons/fa';

const LoanContent = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-[#03305c] mb-6">LOANS</h1>
        <p className="text-xl text-[#03305c] max-w-3xl mx-auto">
          Unlock Your Potential with Amalgamated Bank Loans
        </p>
        <p className="text-lg text-[#03305c] mt-4 max-w-3xl mx-auto">
          We understand that some dreams require a helping hand to turn into reality. Our diverse range of loans is designed to empower individuals and businesses alike, offering flexible and affordable financing solutions.
        </p>
      </div>

      {/* Loan Features */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Personalized Options */}
        <div className="bg-[#f8f9fa] p-8 rounded-xl border border-gray-200">
          <div className="flex items-center mb-6">
            <FaHandHoldingUsd className="text-3xl text-[#e8742c] mr-4" />
            <h2 className="text-2xl font-bold text-[#03305c]">Personalized Loan Options</h2>
          </div>
          <p className="text-[#03305c]">
            We recognize that every borrower's needs are unique. Whether you're looking to fund your higher education, renovate your home, or consolidate debt, our personalized loan options are tailored to match your specific requirements and financial goals.
          </p>
        </div>

        {/* Application Process */}
        <div className="bg-[#f8f9fa] p-8 rounded-xl border border-gray-200">
          <div className="flex items-center mb-6">
            <FaFileSignature className="text-3xl text-[#e8742c] mr-4" />
            <h2 className="text-2xl font-bold text-[#03305c]">Simple Application Process</h2>
          </div>
          <p className="text-[#03305c]">
            Time is of the essence, and we value your time. Our streamlined process ensures a hassle-free experience. To apply for a loan, simply create an account with Amalgamated Bank and our dedicated customer service representatives will guide you through the process.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-[#03305c] text-white rounded-xl p-8 mb-16">
        <div className="flex items-center mb-6">
          <div className="bg-[#e8742c] p-3 rounded-full mr-4">
            <FaUniversity className="text-2xl" />
          </div>
          <h2 className="text-2xl font-bold">Why Choose Amalgamated Bank Loans?</h2>
        </div>
        <p className="text-lg mb-6">
          Join us and experience the power of loans that cater to your needs and aspirations. Whether it's achieving personal milestones, expanding your business, or meeting unforeseen expenses, our loans are designed to support your journey to success.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Requirements */}
          <div>
            <h3 className="text-xl font-bold mb-4">Basic Requirements</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-[#e8742c] mr-2">•</span>
                <span>A duly signed loan application form</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#e8742c] mr-2">•</span>
                <span>A written intent for loan</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#e8742c] mr-2">•</span>
                <span>Two recent passport photos</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#e8742c] mr-2">•</span>
                <span>Income and earning disclosure</span>
              </li>
            </ul>
          </div>

          {/* Repayment */}
          <div>
            <h3 className="text-xl font-bold mb-4">Flexible Repayment Options</h3>
            <p>
              Your financial well-being is our priority. Our loans come with flexible repayment options, allowing you to choose a plan that aligns with your cash flow and ensures comfortable repayments.
            </p>
          </div>
        </div>
      </div>

      {/* Business Loans */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="bg-[#f8f9fa] p-8 rounded-xl border border-gray-200">
          <div className="flex items-center mb-6">
            <FaBusinessTime className="text-3xl text-[#e8742c] mr-4" />
            <h2 className="text-2xl font-bold text-[#03305c]">Business Loans for Growth</h2>
          </div>
          <p className="text-[#03305c]">
            For businesses, growth requires adequate funding. Our business loans are tailored to fuel your expansion plans, purchase equipment, or manage working capital, giving your business the boost it needs to reach new heights.
          </p>
        </div>

        <div className="bg-[#f8f9fa] p-8 rounded-xl border border-gray-200">
          <div className="flex items-center mb-6">
            <FaBalanceScale className="text-3xl text-[#e8742c] mr-4" />
            <h2 className="text-2xl font-bold text-[#03305c]">Commitment to Responsible Lending</h2>
          </div>
          <p className="text-[#03305c]">
            At Amalgamated Bank, we are committed to responsible lending practices. We prioritize transparency, ensuring that you fully understand the terms and conditions of your loan, helping you make borrowing decisions with confidence.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-[#f8f9fa] p-8 rounded-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-[#03305c] mb-4">Ready to take the next step?</h2>
        <p className="text-[#03305c] mb-6 max-w-2xl mx-auto">
          To apply for a loan, create an account with Amalgamated Bank and our team will guide you through the simple application process.
        </p>
        <div className="inline-block border-2 border-[#03305c] text-[#03305c] px-6 py-3 rounded-lg font-bold hover:border-[#e8742c] hover:text-[#e8742c] transition-colors">
          Learn more about becoming a customer
        </div>
      </div>
    </div>
  );
};

export default LoanContent;