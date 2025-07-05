import React from 'react';
import { 
  Shield, 
  Monitor, 
  CreditCard, 
  DollarSign, 
  Smartphone, 
  Lock, 
  Clock, 
  TrendingUp,
  Users,
  MapPin,
  Bell,
  FileText,
  Calculator,
  Zap,
  PiggyBank,
  Gift
} from 'lucide-react';

const BankingFeatures = () => {
  const features = [
    {
      icon: <Shield className="w-16 h-16 text-[#03305c]" />,
      title: "Secure online access to your accounts anytime",
      description: "Set up an Online Banking account and begin managing your finances from anywhere. Our advanced security features keep your information safe and secure."
    },
    {
      icon: <Monitor className="w-16 h-16 text-[#03305c]" />,
      title: "Access your accounts quickly",
      description: "View your account balances, transaction history, and account details with Online Banking. Your account balances and transaction history, plus pay bills, transfer funds and more, all at your convenience."
    },
    {
      icon: <CreditCard className="w-16 h-16 text-[#03305c]" />,
      title: "Conveniently pay bills online",
      description: "There's no need for checks or stamps. Simply pay your bills online and you can track your payments. You can also schedule bills to be paid automatically and receive electronic bills from companies that have that capability."
    },
    {
      icon: <DollarSign className="w-16 h-16 text-[#03305c]" />,
      title: "Transfer funds easily",
      description: "Transfer money with ease through Online Banking. Move money between your Montgomery Bank accounts as well as accounts held at other U.S. institutions. You can also schedule transfers or funds automatically from your existing checking account."
    },
    {
      icon: <Smartphone className="w-16 h-16 text-[#03305c]" />,
      title: "Mobile banking on the go",
      description: "Access your accounts anywhere with our mobile banking app. Check balances, transfer funds, pay bills, and deposit checks using your smartphone or tablet. Available for iOS and Android devices."
    },
    {
      icon: <Lock className="w-16 h-16 text-[#03305c]" />,
      title: "Enhanced security features",
      description: "Multi-factor authentication, biometric login options, and real-time fraud monitoring keep your accounts protected. Receive instant alerts for suspicious activity and unauthorized access attempts."
    },
    {
      icon: <Clock className="w-16 h-16 text-[#03305c]" />,
      title: "24/7 account monitoring",
      description: "Round-the-clock account monitoring ensures your finances are always protected. Our automated systems detect unusual activity and alert you immediately of any potential security concerns."
    },
    {
      icon: <TrendingUp className="w-16 h-16 text-[#03305c]" />,
      title: "Investment tracking tools",
      description: "Monitor your investment portfolio performance with integrated tracking tools. View market trends, analyze your holdings, and make informed investment decisions with real-time data and insights."
    },
    {
      icon: <Users className="w-16 h-16 text-[#03305c]" />,
      title: "Joint account management",
      description: "Manage joint accounts with ease. Set different permission levels for account holders, track individual contributions, and maintain transparency in shared financial responsibilities."
    },
    {
      icon: <MapPin className="w-16 h-16 text-[#03305c]" />,
      title: "ATM and branch locator",
      description: "Find nearby ATMs and branch locations with our interactive map feature. Get directions, view hours of operation, and check available services at each location before you visit."
    },
    {
      icon: <Bell className="w-16 h-16 text-[#03305c]" />,
      title: "Customizable account alerts",
      description: "Stay informed with personalized account alerts. Set up notifications for low balances, large transactions, bill due dates, and other important account activities via email or text message."
    },
    {
      icon: <FileText className="w-16 h-16 text-[#03305c]" />,
      title: "Digital statements and documents",
      description: "Access and download your statements, tax documents, and other important banking paperwork online. Go paperless and help the environment while keeping your documents organized and easily accessible."
    },
    {
      icon: <Calculator className="w-16 h-16 text-[#03305c]" />,
      title: "Financial planning calculators",
      description: "Use our suite of financial calculators to plan for your future. Calculate loan payments, mortgage terms, retirement savings, and investment returns to make informed financial decisions."
    },
    {
      icon: <Zap className="w-16 h-16 text-[#03305c]" />,
      title: "Instant money transfers",
      description: "Send money instantly to friends and family using their email address or phone number. Split bills, pay back loans, or send gifts with just a few taps on your mobile device."
    },
    {
      icon: <PiggyBank className="w-16 h-16 text-[#03305c]" />,
      title: "Automated savings programs",
      description: "Set up automatic savings programs that round up your purchases and save the spare change. Create savings goals and track your progress towards achieving your financial objectives."
    },
    {
      icon: <Gift className="w-16 h-16 text-[#03305c]" />,
      title: "Rewards and cashback programs",
      description: "Earn rewards points and cashback on your everyday purchases. Redeem points for gift cards, travel, merchandise, or statement credits. The more you use our services, the more you earn."
    }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#03305c] mb-4">
            Banking Made Simple
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience modern banking with our comprehensive suite of digital services designed to make managing your finances easier and more convenient than ever before.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 p-4 bg-gray-50 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#03305c] mb-4 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#03305c] mb-4">
              Contact Center
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-bold text-[#e8742c] mb-2">Phone Support</h4>
                <p className="text-[#03305c] font-semibold">800-555-0860</p>
                <p className="text-gray-600 text-sm">Available 24/7 for your convenience</p>
              </div>
              <div>
                <h4 className="font-bold text-[#e8742c] mb-2">Email Support</h4>
                <p className="text-[#03305c] font-semibold">support@bank.com</p>
                <p className="text-gray-600 text-sm">Get responses within 24 hours</p>
              </div>
              <div>
                <h4 className="font-bold text-[#e8742c] mb-2">Live Chat</h4>
                <p className="text-[#03305c] font-semibold">Available on our website</p>
                <p className="text-gray-600 text-sm">Click the chat icon on the page to begin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BankingFeatures;