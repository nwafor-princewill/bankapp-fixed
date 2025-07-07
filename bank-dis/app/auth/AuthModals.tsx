'use client';
import React, { useState, useEffect } from 'react';
import { ImCancelCircle } from 'react-icons/im';
import { useRouter } from 'next/navigation';

interface AuthModalsProps {
  showLogin: boolean;
  showSignup: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AuthModals: React.FC<AuthModalsProps> = ({ 
  showLogin, 
  showSignup, 
  onClose,
  defaultTab = 'login'
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Set the active tab based on which modal is shown
  useEffect(() => {
    if (showSignup) {
      setActiveTab('signup');
    } else if (showLogin) {
      setActiveTab('login');
    }
  }, [showLogin, showSignup]);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Enhanced email validation with common domain suggestions
  const validateEmailWithSuggestions = (email: string): { isValid: boolean; message?: string } => {
    if (!email) {
      return { isValid: false, message: 'Email is required' };
    }
    
    if (!validateEmail(email)) {
      // Check if it's missing @ symbol
      if (!email.includes('@')) {
        return { isValid: false, message: 'Email must contain @ symbol (e.g., user@gmail.com)' };
      }
      
      // Check if it's missing domain extension
      if (!email.includes('.') || email.split('@')[1]?.split('.').length < 2) {
        return { isValid: false, message: 'Email must include domain extension (e.g., user@gmail.com)' };
      }
      
      return { isValid: false, message: 'Please enter a valid email address (e.g., user@gmail.com)' };
    }
    
    return { isValid: true };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate email format
    const emailValidation = validateEmailWithSuggestions(loginData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.message || 'Invalid email format');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        }),
      });

      const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || 'Login failed');
      // }

      if (!response.ok) {
      if (response.status === 403) {
        // Handle blocked user case
        throw new Error('Your account has been blocked. Please contact support.');
      }
      throw new Error(data.message || 'Login failed');
    }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      onClose();
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      console.error('Login error:', err);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate email format
    const emailValidation = validateEmailWithSuggestions(formData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.message || 'Invalid email format');
      return;
    }
    
    // Additional validation
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return;
    }
    
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return;
    }
    
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          phone: formData.phone.trim()
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      onClose();
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      console.error('Signup error:', err);
    }
  };

  if (!showLogin && !showSignup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <ImCancelCircle size={24} />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-[#03305c] mb-6 pr-8">
          Welcome to Amalgamated Bank
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex border-b mb-6">
          <button
            type="button"
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === 'login' 
                ? 'text-[#03305c] border-b-2 border-[#03305c]' 
                : 'text-gray-500 hover:text-[#03305c]'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === 'signup' 
                ? 'text-[#03305c] border-b-2 border-[#03305c]' 
                : 'text-gray-500 hover:text-[#03305c]'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            Open an Account
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="login-email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                placeholder="Enter your email (e.g., user@gmail.com)"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="login-password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="flex justify-between items-center">
              <a href="#" className="text-sm text-[#03305c] hover:underline">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-[#03305c] text-white py-2 px-4 rounded-md hover:bg-[#e8742c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:ring-offset-2"
            >
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="signup-firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="signup-firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label htmlFor="signup-lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="signup-lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="signup-email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                placeholder="Enter your email (e.g., user@gmail.com)"
                required
              />
            </div>
            <div>
              <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="signup-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                Create Password
              </label>
              <input
                type="password"
                id="signup-password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                placeholder="Create a password (min. 6 characters)"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#03305c] text-white py-2 px-4 rounded-md hover:bg-[#e8742c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:ring-offset-2"
            >
              Open Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModals;