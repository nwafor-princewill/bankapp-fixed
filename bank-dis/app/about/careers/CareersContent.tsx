import React from 'react';
import { FaUsers, FaHeart, FaPiggyBank, FaPlane, FaSubway, FaAward } from 'react-icons/fa';
import { GiHealthPotion } from 'react-icons/gi';

const CareersContent = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-[#03305c] mb-12 text-center">
        Diversity, Equity, Inclusion and Belonging
      </h1>

      <div className="text-[#03305c] max-w-3xl mx-auto mb-16">
        <p className="text-lg mb-8">
          At ZenaTrust , we believe that maintaining a diverse and inclusive workplace where everyone feels valued and respected is essential for us to grow as a company. We are dedicated to building a more equitable world in our everyday practices by embracing the values of our employees and customers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { value: '4', label: 'offices nationwide as of December 2023' },
            { value: '58%', label: 'of workforce are female as of December 2023' },
            { value: '63%', label: 'of workforce are people of color as of December 2023' }
          ].map((stat, index) => (
            <div key={index} className="bg-[#f5f5f5] p-6 rounded-lg text-center">
              <p className="text-3xl font-bold text-[#e8742c] mb-2">{stat.value}</p>
              <p className="text-[#03305c]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-3xl font-bold text-[#03305c] mb-8 text-center">
        Benefits
      </h2>

      <p className="text-lg text-[#03305c] max-w-3xl mx-auto mb-12 text-center">
        At ZenaTrust , our employees are our greatest asset and investing in their well-being is essential. We are committed to investing in our employees through a comprehensive compensation and benefits package.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            icon: <GiHealthPotion className="text-4xl text-[#e8742c] mb-4" />,
            title: 'Health Care Benefits',
            description: 'Our health care benefits include medical, dental and vision care plans. We also provide mental health support and resources to ensure the needs of any employee is met.'
          },
          {
            icon: <FaPlane className="text-4xl text-[#e8742c] mb-4" />,
            title: 'Paid Vacation, Holiday, and Personal Days',
            description: 'We encourage our employees to take time off throughout the year to enjoy time away from the office with family and friends. We also offer one paid volunteer day per year.'
          },
          {
            icon: <FaPiggyBank className="text-4xl text-[#e8742c] mb-4" />,
            title: 'Pension Plan',
            description: 'ZenaTrust offers a pension plan, in addition to a 401(k), to help you save and provide financial income for the future.'
          },
          {
            icon: <FaHeart className="text-4xl text-[#e8742c] mb-4" />,
            title: 'Paid Family and Medical Leave (FMLA)',
            description: 'If eligible, employees may receive continued income in the event of health or family-related issues that prevent you from working your regularly paid hours.'
          },
          {
            icon: <FaSubway className="text-4xl text-[#e8742c] mb-4" />,
            title: 'Commuter Benefits',
            description: 'Set aside money on a pre-tax basis to help pay for transit and parking expenses associated with commuting to/from work.'
          },
          {
            icon: <FaAward className="text-4xl text-[#e8742c] mb-4" />,
            title: 'Rewards Program',
            description: 'We love to reward our employees who have excelled in the workplace through our bonus program and our incentive award program for officer level roles.'
          },
          {
            icon: <FaUsers className="text-4xl text-[#e8742c] mb-4" />,
            title: 'Career Development',
            description: 'We ensure employees are given the opportunity to grow and advance in their careers through professional development programs.'
          }
        ].map((benefit, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-center">
              {benefit.icon}
              <h3 className="text-xl font-bold text-[#03305c] mb-3">{benefit.title}</h3>
              <p className="text-[#03305c]">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareersContent;