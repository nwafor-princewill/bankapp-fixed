'use client';
import { useState } from 'react';
import { FaMoneyBillWave, FaCalendarAlt, FaBriefcase } from 'react-icons/fa';

export default function RequestLoanForm() {
  const [formData, setFormData] = useState({
    amount: '',
    term: '12',
    employmentType: 'full-time',
    purpose: '',
    customPurpose: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applicationId, setApplicationId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token'); // Adjust based on how you store auth token
      
      const response = await fetch('/api/loans/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        setApplicationId(data.application.applicationId);
        setFormData({ 
          amount: '', 
          term: '12',
          employmentType: 'full-time',
          purpose: '',
          customPurpose: ''
        });
      } else {
        setError(data.message || 'Application failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Loan application error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="font-semibold">Loan Application Submitted Successfully!</p>
        </div>
        <p className="text-sm">Application ID: <span className="font-mono font-bold">{applicationId}</span></p>
        <p className="text-sm mt-1">Our finance department will contact you within 24 hours.</p>
        <p className="text-sm mt-1">A copy of your application has been sent to the bank for processing.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-3 px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-4">
        <FaMoneyBillWave className="text-2xl text-[#03305c]" />
        <h2 className="text-xl font-bold text-[#03305c]">REQUEST FOR A LOAN</h2>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Loan Amount ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full pl-8 p-3 border rounded focus:ring-2 focus:ring-[#03305c] focus:border-[#03305c]"
                placeholder="5,000"
                min="100"
                max="1000000"
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
                <span className="capitalize text-sm">{type.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Purpose Field */}
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

        {/* Custom Purpose Field */}
        {formData.purpose === 'other' && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Please specify the purpose
            </label>
            <textarea
              value={formData.customPurpose}
              onChange={(e) => setFormData({...formData, customPurpose: e.target.value})}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-[#03305c] focus:border-[#03305c]"
              rows={2}
              placeholder="Describe your loan purpose..."
              required={formData.purpose === 'other'}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded text-white font-medium transition-colors ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#03305c] hover:bg-[#e8742c]'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </span>
          ) : (
            'Apply For Loan'
          )}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>By submitting, you agree to our <a href="#" className="text-[#03305c] hover:underline">Terms & Conditions</a></p>
        <p className="mt-1">Application will be sent directly to our loan processing department.</p>
      </div>
    </div>
  );
}