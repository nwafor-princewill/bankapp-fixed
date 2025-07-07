import React from 'react';
import { CreditCard, Shield, Monitor, DollarSign, Smartphone, Phone, Mail, MapPin } from 'lucide-react';

const CreditCards = () => {
  const creditCardFeatures = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Secure online access to your accounts anytime",
      description: "Set up an Online Banking account and begin managing your finances from anywhere. Our advanced security features keep your information safe and secure."
    },
    {
      icon: <Monitor className="w-8 h-8 text-blue-600" />,
      title: "Access your accounts quickly",
      description: "View your account balances, transaction history, and account details with Online Banking. Your account balances and transaction history, plus pay bills, transfer funds and more, all at your convenience."
    },
    {
      icon: <CreditCard className="w-8 h-8 text-blue-600" />,
      title: "Conveniently pay bills online",
      description: "There's no need for checks or stamps. Simply pay your bills online and you can track your payments. You can also schedule bills to be paid automatically and receive electronic bills from companies that have that capability."
    },
    {
      icon: <DollarSign className="w-8 h-8 text-blue-600" />,
      title: "Transfer funds easily",
      description: "Transfer money with ease through Online Banking. Move money between your Amalgamated Bank accounts as well as accounts held at other U.S. institutions. You can also schedule transfers or funds automatically from your existing checking account."
    },
    {
      icon: <Smartphone className="w-8 h-8 text-blue-600" />,
      title: "Mobile Banking on-the-go",
      description: "Access your accounts anywhere with our mobile app. Check balances, make transfers, deposit checks, and manage your finances from your smartphone or tablet."
    }
  ];

  const cardTypes = [
    {
      name: "Amalgamated Rewards Card",
      benefits: ["Earn 2% cash back on all purchases", "No annual fee", "0% introductory APR for 12 months"],
      color: "bg-gradient-to-r from-blue-600 to-blue-800"
    },
    {
      name: "Amalgamated Premium Card",
      benefits: ["3x points on travel and dining", "Premium travel insurance", "Airport lounge access"],
      color: "bg-gradient-to-r from-gray-700 to-gray-900"
    },
    {
      name: "Amalgamated Business Card",
      benefits: ["1.5% cash back on business purchases", "No foreign transaction fees", "Expense management tools"],
      color: "bg-gradient-to-r from-green-600 to-green-800"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <div className="mb-8">
                <div className="text-sm mb-2" style={{ color: "#03305c" }}>Personal Banking</div>
                <h1 className="text-3xl font-bold mb-4" style={{ color: "#03305c" }}>Credit Cards</h1>
              <p className="text-xl text-gray-600 mb-8">Choose the right card for you</p>
            </div>

            {/* Credit Card Options */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6" style={{ color: "#03305c" }}>Our Credit Card Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cardTypes.map((card, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className={`${card.color} h-32 flex items-center justify-center`}>
                      <div className="text-white text-center">
                        <CreditCard className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm font-medium">Amalgamated Bank</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-3" style={{ color: "#e8742c" }}>{card.name}</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {card.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start">
                            <div className="w-2 h-2 rounded-full mt-1.5 mr-2 flex-shrink-0" style={{ backgroundColor: "#e8742c" }}></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Section */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: "#03305c" }}>Apply for your card today</h2>
              <p className="text-gray-600 mb-6">
                The benefits and features of our credit cards are designed to meet your financial needs today and tomorrow. Check out what each card offers and decide which one is right for you.
              </p>
              
            </div>

            {/* Online Banking Features */}
            <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6" style={{ color: "#03305c" }}>
                Online account access for your credit card provides you the quickest and easiest way to:
                </h2>
              
              <div className="space-y-8">
                {creditCardFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2" style={{ color: "#03305c" }}>{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

           
            </div>

            {/* Additional Services */}
            <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Credit Card Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600">Activate your credit card</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600">Make payments</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600">Transfer balances</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600">Request Credit Limit Increases</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600">View statements</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600">Set up automatic payments</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600">Track rewards and points</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600">And much more</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Questions or concerns?</h3>
                  <p className="text-sm text-gray-600">Call us.</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-900">888-295-5540</p>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="#" className="block text-blue-600 hover:text-blue-800">Apply for Credit Card</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">Compare Cards</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">Credit Card Calculator</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">Manage Your Account</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">Credit Card Security</a>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <div className="space-y-3">
                <a href="#" className="block text-blue-600 hover:text-blue-800">Understanding Credit Scores</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">Building Credit History</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">Credit Card Tips</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">Fraud Protection</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">Terms & Conditions</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default CreditCards;