import React from 'react';
import { Search, Target, Shield, TrendingUp, PieChart, Calculator, Users, Award, CheckCircle, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

const Investment = () => {
  const investmentGoals = [
    {
      title: "Retirement Planning",
      description: "Build a secure financial future with our comprehensive retirement planning services",
      icon: <Target className="w-8 h-8 text-[#e8742c]" />,
      features: ["401(k) Planning", "IRA Options", "Pension Management", "Social Security Optimization"]
    },
    {
      title: "Wealth Management",
      description: "Grow and protect your wealth with our expert investment strategies",
      icon: <TrendingUp className="w-8 h-8 text-[#e8742c]" />,
      features: ["Portfolio Management", "Asset Allocation", "Risk Assessment", "Performance Monitoring"]
    },
    {
      title: "Education Planning",
      description: "Secure your children's educational future with smart investment planning",
      icon: <Award className="w-8 h-8 text-[#e8742c]" />,
      features: ["529 Plans", "Education Savings", "Tuition Planning", "Scholarship Strategies"]
    },
    {
      title: "Estate Planning",
      description: "Protect your legacy and ensure smooth wealth transfer to future generations",
      icon: <Shield className="w-8 h-8 text-[#e8742c]" />,
      features: ["Trust Management", "Will Planning", "Tax Strategies", "Legacy Planning"]
    }
  ];

  const investmentOptions = [
    {
      name: "Conservative Portfolio",
      risk: "Low Risk",
      return: "4-6% Annual Return",
      description: "Ideal for risk-averse investors seeking steady growth with capital preservation",
      allocation: "60% Bonds, 30% Stocks, 10% Cash"
    },
    {
      name: "Balanced Portfolio",
      risk: "Moderate Risk",
      return: "6-8% Annual Return",
      description: "Perfect balance of growth and stability for long-term wealth building",
      allocation: "50% Stocks, 40% Bonds, 10% Alternatives"
    },
    {
      name: "Growth Portfolio",
      risk: "High Risk",
      return: "8-12% Annual Return",
      description: "Aggressive growth strategy for investors with higher risk tolerance",
      allocation: "80% Stocks, 15% Bonds, 5% Cash"
    }
  ];

  const services = [
    {
      title: "Financial Planning",
      description: "Comprehensive financial planning tailored to your unique situation and goals",
      icon: <Calculator className="w-6 h-6 text-[#e8742c]" />
    },
    {
      title: "Investment Advisory",
      description: "Professional investment advice from certified financial advisors",
      icon: <Users className="w-6 h-6 text-[#e8742c]" />
    },
    {
      title: "Portfolio Analysis",
      description: "Regular portfolio reviews and performance analysis to optimize returns",
      icon: <PieChart className="w-6 h-6 text-[#e8742c]" />
    },
    {
      title: "Tax Optimization",
      description: "Strategic tax planning to minimize tax burden and maximize after-tax returns",
      icon: <Shield className="w-6 h-6 text-[#e8742c]" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}


      {/* Navigation */}


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-[#03305c] mb-4">Set goals</h1>
              <div className="bg-[#e8742c] h-1 w-20 mb-6"></div>
              <p className="text-lg text-gray-700 mb-8">
                We'll help you build a plan designed to meet your goals and fit your budget.
              </p>
            </div>

            {/* Consider Your Needs */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#03305c] mb-6">Consider your needs</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#e8742c] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">How much will you need to save in order to retire?</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#e8742c] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Are you protected in case something happens to your family's breadwinner?</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#e8742c] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">How do you plan on paying for your children's education?</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#e8742c] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">What are your immediate and long-term financial goals?</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#e8742c] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">How will you manage unexpected financial emergencies?</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#e8742c] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">What's your strategy for building long-term wealth?</span>
                </div>
              </div>
            </div>

            {/* Investment Goals */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#03305c] mb-6">Investment Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {investmentGoals.map((goal, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      {goal.icon}
                      <h3 className="text-xl font-semibold text-[#03305c]">{goal.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{goal.description}</p>
                    <div className="space-y-2">
                      {goal.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-[#e8742c]" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Make Informed Decisions */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#03305c] mb-6">Make informed decisions</h2>
              <p className="text-gray-700 mb-6">
                An Amalgamated Bank Representative will work with you to <strong>assess</strong> your unique situation and point you toward 
                investments with objectives that reflect your financial goals.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-[#03305c] mb-4">Our Investment Process</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-[#e8742c] rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Financial Assessment</h4>
                      <p className="text-gray-600">Complete analysis of your current financial situation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-[#e8742c] rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Goal Setting</h4>
                      <p className="text-gray-600">Define clear, measurable financial objectives</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-[#e8742c] rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Strategy Development</h4>
                      <p className="text-gray-600">Create a customized investment strategy</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-[#e8742c] rounded-full flex items-center justify-center text-white font-bold">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Implementation & Monitoring</h4>
                      <p className="text-gray-600">Execute the plan and regularly review performance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Options */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#03305c] mb-6">Investment Portfolio Options</h2>
              <div className="space-y-6">
                {investmentOptions.map((option, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-[#03305c]">{option.name}</h3>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{option.risk}</span>
                        <span className="text-sm font-semibold text-[#e8742c]">{option.return}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{option.description}</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <span className="text-sm font-semibold text-gray-800">Asset Allocation: </span>
                      <span className="text-sm text-gray-600">{option.allocation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manage Your Risk */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-[#03305c] mb-6">Manage your risk</h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#e8742c] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Through Amalgamated Bank, we offer access to a range of investment options that reflect our 
                    conservative philosophy
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#e8742c] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    We strive to balance risk and return by using a diversified portfolio approach
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#e8742c] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    We focus on quality so that you can invest with confidence
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#e8742c] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Regular portfolio rebalancing to maintain optimal asset allocation
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#e8742c] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Comprehensive risk assessment and management strategies
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Services */}
            <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
              <h2 className="text-2xl font-bold text-[#03305c] mb-6">Additional Investment Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#03305c] mb-2">{service.title}</h3>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            {/* Arrange Consultation */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <Search className="w-8 h-8 text-[#e8742c]" />
                <div>
                  <h3 className="text-xl font-bold text-[#03305c]">Arrange for a confidential review</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Contact an Amalgamated Bank Institutional Representative
              </p>
              <button className="w-full bg-[#e8742c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                Contact us
              </button>
            </div>

            {/* Investment Calculator */}
          

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-[#03305c] mb-4">Investment Resources</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <ArrowRight className="w-4 h-4 text-[#e8742c]" />
                  <span>Market Research & Analysis</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <ArrowRight className="w-4 h-4 text-[#e8742c]" />
                  <span>Investment Performance Reports</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <ArrowRight className="w-4 h-4 text-[#e8742c]" />
                  <span>Retirement Planning Tools</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <ArrowRight className="w-4 h-4 text-[#e8742c]" />
                  <span>Tax-Efficient Strategies</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <ArrowRight className="w-4 h-4 text-[#e8742c]" />
                  <span>Risk Assessment Tools</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-[#03305c] mb-4">Get in Touch</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#e8742c]" />
                  <div>
                    <p className="font-medium text-gray-800">Call us</p>
                    <p className="text-sm text-gray-600">+44-7469-549275</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#e8742c]" />
                  <div>
                    <p className="font-medium text-gray-800">Email us</p>
                    <p className="text-sm text-gray-600">amalgamateedbank@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-[#e8742c]" />
                  <div>
                    <p className="font-medium text-gray-800">Visit us</p>
                    <p className="text-sm text-gray-600">Find a branch near you</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#03305c] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-[#e8742c] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold">amalgamated</span>
                <span className="text-xl font-light">bank</span>
              </div>
              <p className="text-gray-300 mb-4">
                Amalgamated Bank is committed to providing exceptional investment services to help you achieve your financial goals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Investment Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Wealth Management</li>
                <li>Retirement Planning</li>
                <li>Portfolio Management</li>
                <li>Financial Planning</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Market Research</li>
                <li>Investment Tools</li>
                <li>Educational Materials</li>
                <li>Performance Reports</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Contact Us</li>
                <li>Find Advisors</li>
                <li>Investment FAQs</li>
                <li>Account Access</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Amalgamated Bank. All rights reserved.</p>
            <p className="mt-2">Investment products are not FDIC insured, may lose value, and are not bank guaranteed.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Investment;