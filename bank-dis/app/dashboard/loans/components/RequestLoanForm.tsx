'use client';
import { useState } from 'react';
import { FaMoneyBillWave, FaCalendarAlt, FaBriefcase } from 'react-icons/fa';

export default function RequestLoanForm() {
  const [formData, setFormData] = useState({
    amount: '',
    term: '12', // Default to 12 months
    employmentType: 'full-time',
    purpose: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ 
        amount: '', 
        term: '12',
        employmentType: 'full-time',
        purpose: '' 
      });
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
        <p>Your loan application has been submitted successfully!</p>
        <p className="text-sm mt-1">Our finance department will contact you within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-4">
        <FaMoneyBillWave className="text-2xl text-[#03305c]" />
        <h2 className="text-xl font-bold text-[#03305c]">REQUEST FOR A LOAN</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Loan Amount 
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full pl-8 p-3 border rounded focus:ring-2 focus:ring-[#03305c] focus:border-[#03305c]"
                placeholder="5,000"
                min="100"
                required
              />
            </div>
          </div>

          {/* Loan Term Field */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600 flex items-center gap-1">
              <FaCalendarAlt className="text-[#03305c]" />
              Loan Term (months)
            </label>
            <select
              value={formData.term}
              onChange={(e) => setFormData({...formData, term: e.target.value})}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-[#03305c] focus:border-[#03305c]"
              required
            >
              <option value="6">6 months</option>
              <option value="12">12 months</option>
              <option value="24">24 months</option>
              <option value="36">36 months</option>
              <option value="60">60 months</option>
            </select>
          </div>
        </div>

        {/* Employment Type Field */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600 flex items-center gap-1">
            <FaBriefcase className="text-[#03305c]" />
            Employment Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['full-time', 'part-time', 'self-employed', 'unemployed'].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="employmentType"
                  value={type}
                  checked={formData.employmentType === type}
                  onChange={() => setFormData({...formData, employmentType: type})}
                  className="text-[#03305c] focus:ring-[#03305c]"
                  required
                />
                <span className="capitalize">{type.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Purpose Field (Enhanced) */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Loan Purpose
          </label>
          <select
            value={formData.purpose}
            onChange={(e) => setFormData({...formData, purpose: e.target.value})}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-[#03305c] focus:border-[#03305c]"
            required
          >
            <option value="">Select a purpose</option>
            <option value="debt-consolidation">Debt Consolidation</option>
            <option value="home-improvement">Home Improvement</option>
            <option value="medical-expenses">Medical Expenses</option>
            <option value="education">Education</option>
            <option value="business">Business Investment</option>
            <option value="vehicle">Vehicle Purchase</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Additional Notes (Conditional) */}
        {formData.purpose === 'other' && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Please specify
            </label>
            <textarea
              className="w-full p-3 border rounded focus:ring-2 focus:ring-[#03305c] focus:border-[#03305c]"
              rows={2}
              placeholder="Describe your loan purpose..."
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded text-white font-medium ${
            loading ? 'bg-gray-400' : 'bg-[#03305c] hover:bg-[#e8742c]'
          }`}
        >
          {loading ? 'Submitting...' : 'Apply For Loan'}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>By submitting, you agree to our <a href="#" className="text-[#03305c] hover:underline">Terms & Conditions</a></p>
      </div>
    </div>
  );
}