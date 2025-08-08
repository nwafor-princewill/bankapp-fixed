// app/online-banking/enrollment/page.tsx
import React from 'react';
import { FaLaptop, FaMobileAlt, FaPhone, FaEnvelope, FaComments, FaMoneyBillWave, FaExchangeAlt, FaClock } from 'react-icons/fa';

const OnlineBankingEnrollment = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#03305c] mb-6">
            Secure online access to your accounts anytime
          </h1>
          <p className="text-xl text-[#03305c]">
            Set up an Online Banking account and begin managing your finances from anywhere.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#f8f9fa] p-6 rounded-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <FaPhone className="text-2xl text-[#e8742c] mr-3" />
              <h3 className="text-lg font-bold text-[#03305c]">Contact Center</h3>
            </div>
            <p className="text-2xl font-bold text-[#03305c] mb-2">+44-7469-549275</p>
          </div>
          
          <div className="bg-[#f8f9fa] p-6 rounded-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <FaEnvelope className="text-2xl text-[#e8742c] mr-3" />
              <h3 className="text-lg font-bold text-[#03305c]">Email the Contact Center</h3>
            </div>
          </div>
          
          <div className="bg-[#f8f9fa] p-6 rounded-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <FaComments className="text-2xl text-[#e8742c] mr-3" />
              <h3 className="text-lg font-bold text-[#03305c]">Live chat with us</h3>
            </div>
            <p className="text-[#03305c]">Click the chat box on the page to begin</p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <FaLaptop className="text-3xl text-[#e8742c] mr-4" />
            <h2 className="text-3xl font-bold text-[#03305c]">Benefits of Online Banking</h2>
          </div>

          <div className="space-y-12">
            {/* Benefit 1 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <h3 className="text-2xl font-bold text-[#03305c] mb-3">Access your accounts quickly</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-[#03305c] mb-4">
                  You can access your accounts from any computer anytime, anywhere, with Online Banking. View account balances and transaction history. Plus, pay bills, transfer funds and more, all at your convenience.
                </p>
                <div className="flex items-center text-[#03305c]">
                  <FaClock className="text-[#e8742c] mr-2" />
                  <span>24/7 access to your accounts</span>
                </div>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="flex items-center">
                  <FaMoneyBillWave className="text-2xl text-[#e8742c] mr-3" />
                  <h3 className="text-2xl font-bold text-[#03305c]">Conveniently pay bills online</h3>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-[#03305c]">
                  There's no need for checks or stamps. Simply pay your bills online and you can track your payments. You can also schedule bills to be paid automatically and receive electronic bills from companies that have that capability.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="flex items-center">
                  <FaExchangeAlt className="text-2xl text-[#e8742c] mr-3" />
                  <h3 className="text-2xl font-bold text-[#03305c]">Transfer funds easily</h3>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-[#03305c] mb-4">
                  Transfer funds with ease through Online Banking. Move money between your ZenaTrust Bank accounts as well as accounts held at other U.S. institutions. You can also schedule transfers of funds.
                </p>
                <div className="flex items-center text-[#03305c]">
                  <FaMobileAlt className="text-[#e8742c] mr-2" />
                  <span>Available on mobile and desktop</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollment CTA */}
        <div className="bg-[#03305c] text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to enroll?</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Getting started with online banking is simple and takes just a few minutes.
          </p>
          <div className="bg-white text-[#03305c] inline-block px-6 py-3 rounded-lg font-bold">
            Visit our website and click "Create Account" to register
          </div>
          <p className="mt-4 text-sm opacity-90">
            No paperwork required • Secure enrollment process • Immediate access after verification
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnlineBankingEnrollment;