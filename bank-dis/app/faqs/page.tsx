// app/faqs/page.tsx
"use client";
import React, { useState } from 'react';
import { FaShieldAlt, FaMobileAlt, FaCreditCard, FaLock, FaQuestionCircle, FaUserShield } from 'react-icons/fa';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
// 
  const faqCategories = [
    {
      title: "Account Security",
      icon: <FaShieldAlt className="text-2xl text-[#e8742c]" />,
      questions: [
        {
          question: "How does Amalgamated Bank protect my account?",
          answer: "We use multi-layered security including encryption, fraud monitoring, and secure login with multi-factor authentication to protect your accounts 24/7."
        },
        {
          question: "What should I do if I suspect fraud?",
          answer: "Contact us immediately at 800-662-0860. We'll secure your account, investigate any suspicious activity, and help you recover any lost funds."
        }
      ]
    },
    {
      title: "Online & Mobile Banking",
      icon: <FaMobileAlt className="text-2xl text-[#e8742c]" />,
      questions: [
        {
          question: "How do I enroll in online banking?",
          answer: "Visit our website and click 'Enroll Now' or download our mobile app. You'll need your account number and personal information to verify your identity."
        },
        {
          question: "What features are available in mobile banking?",
          answer: "Our mobile app allows you to check balances, transfer funds, pay bills, deposit checks, manage cards, and more—all from your smartphone."
        }
      ]
    },
    {
      title: "Cards & Payments",
      icon: <FaCreditCard className="text-2xl text-[#e8742c]" />,
      questions: [
        {
          question: "How do I activate my new debit card?",
          answer: "Call the number on the activation sticker or activate through online banking. You'll need your card number and may need to verify your identity."
        },
        {
          question: "What should I do if my card is lost or stolen?",
          answer: "Call us immediately at 800-500-1044 (24/7) to report it. We'll cancel the card and send you a replacement within 3-5 business days."
        }
      ]
    },
    {
      title: "Account Management",
      icon: <FaLock className="text-2xl text-[#e8742c]" />,
      questions: [
        {
          question: "How do I update my personal information?",
          answer: "You can update most information through online banking, or visit a branch with proper identification to make changes to your account."
        },
        {
          question: "What's the difference between checking and savings accounts?",
          answer: "Checking accounts are for everyday transactions with unlimited withdrawals, while savings accounts earn interest and help you save for goals."
        }
      ]
    },
    {
      title: "General Banking",
      icon: <FaQuestionCircle className="text-2xl text-[#e8742c]" />,
      questions: [
        {
          question: "What makes Amalgamated Bank different?",
          answer: "As America's socially responsible bank, we align our services with your values—investing in communities and refusing to support harmful industries."
        },
        {
          question: "How do I find branch locations and hours?",
          answer: "Use our branch locator tool on our website or mobile app, which shows locations, hours, services offered, and wait times."
        }
      ]
    },
    {
      title: "Privacy & Data",
      icon: <FaUserShield className="text-2xl text-[#e8742c]" />,
      questions: [
        {
          question: "How does Amalgamated protect my personal information?",
          answer: "We follow strict privacy policies, use advanced encryption, and never sell your data. You control how your information is used and shared."
        },
        {
          question: "What should I know about phishing scams?",
          answer: "We'll never ask for sensitive information via email or text. If you receive suspicious communications, don't respond—contact us immediately."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#03305c] mb-6">FAQs</h1>
          <p className="text-xl text-[#03305c] max-w-3xl mx-auto">
            At Amalgamated, the safety and security of your account(s) is our top priority. Browse the topics below to learn more about how we protect your personal information and finances.
          </p>
        </div>

        {/* Quick Help Bar */}
        <div className="bg-[#03305c] text-white rounded-xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold mb-2">Need immediate assistance?</h2>
            <p>Our Customer Service team is available to help with fraud and security concerns.</p>
          </div>
          <div className="bg-[#e8742c] text-white px-6 py-3 rounded-lg font-bold">
            +1-780-476-1737
          </div>
        </div>

        {/* FAQ Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {faqCategories.map((category, catIndex) => (
            <div key={catIndex} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-[#f8f9fa] p-6 flex items-center">
                <div className="mr-4">
                  {category.icon}
                </div>
                <h2 className="text-xl font-bold text-[#03305c]">{category.title}</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {category.questions.map((item, itemIndex) => (
                  <div key={itemIndex} className="p-6">
                    <button
                      className="w-full flex justify-between items-center text-left"
                      onClick={() => toggleAccordion(catIndex * 10 + itemIndex)}
                    >
                      <span className="font-medium text-[#03305c]">{item.question}</span>
                      <span className="text-[#e8742c] ml-2">
                        {activeIndex === catIndex * 10 + itemIndex ? '−' : '+'}
                      </span>
                    </button>
                    
                    {activeIndex === catIndex * 10 + itemIndex && (
                      <div className="mt-3 text-[#03305c]">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-16 bg-[#f8f9fa] rounded-xl p-8">
          <h2 className="text-2xl font-bold text-[#03305c] mb-6">Additional Resources</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[#e8742c] mb-4">Security Guides</h3>
              <ul className="space-y-3 text-[#03305c]">
                <li>• Protecting Your Online Identity</li>
                <li>• Mobile Banking Safety Tips</li>
                <li>• Recognizing Financial Scams</li>
                <li>• Creating Strong Passwords</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#e8742c] mb-4">Banking Tutorials</h3>
              <ul className="space-y-3 text-[#03305c]">
                <li>• Online Banking Quick Start</li>
                <li>• Mobile Check Deposit Guide</li>
                <li>• Setting Up Account Alerts</li>
                <li>• Using Bill Pay Services</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;