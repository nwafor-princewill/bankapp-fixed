// app/contact/page.tsx
import React from 'react';
import { FaPhone, FaMapMarkerAlt, FaComments, FaClock, FaMobileAlt, FaShieldAlt, FaCreditCard, FaLock, FaLandmark, FaChartLine } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#03305c] mb-6">Let's talk</h1>
          <p className="text-xl text-[#03305c] max-w-2xl mx-auto">
            We're here to help you with all your banking needs. Choose the most convenient way to reach us.
          </p>
        </div>

        {/* Contact Options Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Live Chat */}
          <div className="bg-[#f8f9fa] p-8 rounded-xl border border-gray-200">
            <div className="flex items-center mb-4">
              <FaComments className="text-3xl text-[#e8742c] mr-4" />
              <h2 className="text-2xl font-bold text-[#03305c]">Chat with a representative</h2>
            </div>
            <p className="text-[#03305c] mb-6">Click the chat box on the page to begin</p>
            <div className="flex items-center text-[#03305c]">
              <FaClock className="text-[#e8742c] mr-2" />
              <span>Monday - Friday, 9 AM - 5 PM ET</span>
            </div>
          </div>

          {/* Phone Support */}
          <div className="bg-[#f8f9fa] p-8 rounded-xl border border-gray-200">
            <div className="flex items-center mb-4">
              <FaPhone className="text-3xl text-[#e8742c] mr-4" />
              <h2 className="text-2xl font-bold text-[#03305c]">Have questions? Call us</h2>
            </div>
            <p className="text-3xl font-bold text-[#03305c] mb-6">+44-7469-549275</p>
            <div className="flex items-center text-[#03305c]">
              <FaMapMarkerAlt className="text-[#e8742c] mr-2" />
              <span>Prefer in person? <span className="font-semibold">Find a location</span></span>
            </div>
          </div>
        </div>

        {/* Detailed Contact Information */}
        <div className="bg-[#03305c] rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">Specialized Support</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <FaPhone className="text-2xl" />, title: "Personal Banking", number: "+44-7469-549275", hours: "Mon. - Fri. 8 AM - 8 PM & Sat. 9 AM - 2 PM ET" },
              { icon: <FaCreditCard className="text-2xl" />, title: "Lost or Stolen Card", number: "amalgamateedbank@gmail.com", hours: "24 hours / 7 days a week" },
              { icon: <FaLock className="text-2xl" />, title: "Online Banking Support", number: "+44-7469-549275 (option 2)", hours: "24 hours / 7 days a week" },
              { icon: <FaShieldAlt className="text-2xl" />, title: "Fraud Help Line", number: "+44-7469-549275", hours: "24 hours / 7 days a week" },
              { icon: <FaMobileAlt className="text-2xl" />, title: "Consumer Credit Card", number: "amalgamateedbank@gmail.com", hours: "Mon. - Fri. 9 AM - 5 PM ET" },
              { icon: <FaMobileAlt className="text-2xl" />, title: "Business Credit Card", number: "amalgamateedbank@gmail.com", hours: "Mon. - Fri. 9 AM - 5 PM ET" },
              { icon: <FaLandmark className="text-2xl" />, title: "Political Banking", number: "amalgamateedbank@gmail.com", hours: "Mon. - Fri. 9 AM - 5 PM ET" },
              { icon: <FaLandmark className="text-2xl" />, title: "Commercial Banking", number: "+44-7469-549275", hours: "Mon. - Fri. 8 AM - 5 PM ET" },
              { icon: <FaChartLine className="text-2xl" />, title: "Investment Management", number: "+44-7469-549275", hours: "Mon. - Fri. 9 AM - 5 PM ET" },
            ].map((service, index) => (
              <div key={index} className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-[#e8742c] p-2 rounded-full mr-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                </div>
                <p className="text-2xl font-bold mb-2">{service.number}</p>
                <p className="text-sm opacity-80">{service.hours}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Contact Info */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-[#03305c] mb-6">Other Ways to Connect</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: "Mail", detail: "amalgamateedbank@gmail.com\nNew York, NY 10001" },
              { title: "Secure Message", detail: "Log in to online banking to send a secure message" },
              { title: "Social Media", detail: "Connect with us on Twitter, Facebook, and LinkedIn" },
            ].map((item, index) => (
              <div key={index} className="bg-[#f8f9fa] p-6 rounded-xl">
                <h3 className="text-xl font-bold text-[#03305c] mb-3">{item.title}</h3>
                <p className="text-[#03305c] whitespace-pre-line">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;