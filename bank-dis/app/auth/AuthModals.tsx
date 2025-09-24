'use client';
import React, { useState, useEffect } from 'react';
import { ImCancelCircle } from 'react-icons/im';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface AuthModalsProps {
  showLogin: boolean;
  showSignup: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bank-backend-eagz.onrender.com';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'KRW', 'BRL', 'MXN', 'SGD', 'HKD', 'SEK', 'NOK', 'ZAR', 'RUB', 'TRY', 'NGN'] as const;

const SECURITY_QUESTIONS = [
  "What was your first pet's name?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What was your childhood nickname?"
];

const ID_TYPES = ['passport', 'national_id', 'drivers_license'];

const AuthModals: React.FC<AuthModalsProps> = ({
  showLogin,
  showSignup,
  onClose,
  defaultTab = 'login'
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 'prefer-not-to-say',
    dateOfBirth: '',
    country: '',
    state: '',
    address: '',
    currency: 'USD',
    securityQuestions: [
      { question: '', answer: '' },
      { question: '', answer: '' }
    ],
    idType: '', // NEW: ID type
    idDocument: null as File | null // NEW: ID document file
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (showSignup) {
      setActiveTab('signup');
    } else if (showLogin) {
      setActiveTab('login');
    }
  }, [showLogin, showSignup]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setResetToken(token);
      setShowResetPassword(true);
      setActiveTab('login');
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEmailWithSuggestions = (email: string): { isValid: boolean; message?: string } => {
    if (!email) {
      return { isValid: false, message: 'Email is required' };
    }

    if (!validateEmail(email)) {
      if (!email.includes('@')) {
        return { isValid: false, message: 'Email must contain @ symbol (e.g., user@gmail.com)' };
      }
      if (!email.includes('.') || email.split('@')[1]?.split('.').length < 2) {
        return { isValid: false, message: 'Email must include a valid domain extension (e.g., .com, not .con)' };
      }
      return { isValid: false, message: 'Please enter a valid email address (e.g., user@gmail.com)' };
    }

    const domain = email.split('@')[1].toLowerCase();
    if (domain === 'gmail.con') {
      return { isValid: false, message: 'Did you mean @gmail.com? Please correct the email domain.' };
    }

    return { isValid: true };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        idDocument: e.target.files![0],
      }));
    }
  };

  const handleSecurityQuestionChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const fieldName = name.replace(`securityQuestions[${index}].`, '');

    setFormData(prev => {
      const newQuestions = [...prev.securityQuestions];
      newQuestions[index] = {
        ...newQuestions[index],
        [fieldName]: value
      };
      return {
        ...prev,
        securityQuestions: newQuestions
      };
    });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailValidation = validateEmailWithSuggestions(formData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.message || 'Invalid email format');
      return;
    }

    if (!formData.firstName.trim()) {
      setError('First name is required to send OTP');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          firstName: formData.firstName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      toast.success('OTP sent to your email. Please check your inbox and spam folder.');
      setShowOtpStep(true);
      console.log('OTP sent successfully for email:', formData.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.');
      console.error('Send OTP error:', err);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('Please enter the OTP sent to your email');
      return;
    }

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (!formData.idType) {
      setError('Please select an ID type');
      return;
    }

    if (!formData.idDocument) {
      setError('Please upload an ID document');
      return;
    }

    const incompleteQuestions = formData.securityQuestions.some(
      q => !q.question.trim() || !q.answer.trim()
    );

    if (incompleteQuestions) {
      setError('Please complete all security questions');
      return;
    }

    const emailValidation = validateEmailWithSuggestions(formData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.message || 'Invalid email format');
      return;
    }

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.dateOfBirth) {
      setError('Date of birth is required');
      return;
    }

    if (!formData.country) {
      setError('Country is required');
      return;
    }

    if (!formData.state) {
      setError('State/Province is required');
      return;
    }

    if (!formData.address) {
      setError('Address is required');
      return;
    }

    for (let i = 0; i < formData.securityQuestions.length; i++) {
      if (!formData.securityQuestions[i].question || !formData.securityQuestions[i].answer) {
        setError('Please complete all security questions');
        return;
      }
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName.trim());
      formDataToSend.append('lastName', formData.lastName.trim());
      formDataToSend.append('email', formData.email.trim().toLowerCase());
      formDataToSend.append('password', formData.password);
      formDataToSend.append('confirmPassword', formData.confirmPassword);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('phone', formData.phone.trim());
      formDataToSend.append('currency', formData.currency);
      formDataToSend.append('otp', otp);
      formDataToSend.append('idType', formData.idType);
      formDataToSend.append('idDocument', formData.idDocument!); // Append file
      formDataToSend.append('securityQuestions', JSON.stringify(formData.securityQuestions));

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      onClose();
      toast.success('Account created successfully!');
      router.push('/dashboard');
      console.log('Registration successful for user:', data.user.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      console.error('Signup error:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      onClose();
      toast.success('Logged in successfully!');
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      console.error('Login error:', err);
    }
  };

  const handleForgotPassword = async () => {
    try {
      setError('');
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setResetSuccess(true);
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetSuccess(false);
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process request');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetToken,
          newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setResetSuccess(true);
      setTimeout(() => {
        setShowResetPassword(false);
        setResetSuccess(false);
        onClose();
        router.replace('/');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
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
          Welcome to ZenaTrust
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {!showForgotPassword && !showResetPassword && (
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
        )}

        {activeTab === 'login' && !showForgotPassword && !showResetPassword ? (
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
            <div className="relative">
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type={showLoginPassword ? "text" : "password"}
                id="login-password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-500"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
              >
                {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                className="text-sm text-[#03305c] hover:underline"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-[#03305c] text-white py-2 px-4 rounded-md hover:bg-[#e8742c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:ring-offset-2"
            >
              Continue
            </button>
          </form>
        ) : null}

        {activeTab === 'signup' && !showForgotPassword && !showResetPassword ? (
          !showOtpStep ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
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
              <button
                type="submit"
                className="w-full bg-[#03305c] text-white py-2 px-4 rounded-md hover:bg-[#e8742c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:ring-offset-2"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  OTP (Check your email and spam folder)
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent text-center font-mono tracking-wider"
                  placeholder="Enter 6-digit OTP"
                  required
                  maxLength={6}
                  inputMode="numeric"
                />
              </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                    required
                  >
                    <option value="prefer-not-to-say">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                    placeholder="Country"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                    placeholder="State/Province"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                  placeholder="Full address"
                  required
                />
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                  required
                >
                  {CURRENCIES.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Security Questions
                </label>
                {formData.securityQuestions.map((question, index) => (
                  <div key={index} className="mb-4">
                    <select
                      name={`securityQuestions[${index}].question`}
                      value={question.question}
                      onChange={handleSecurityQuestionChange(index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent mb-2"
                      required
                    >
                      <option value="">Select a security question</option>
                      {SECURITY_QUESTIONS.map((q, i) => (
                        <option key={i} value={q}>{q}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name={`securityQuestions[${index}].answer`}
                      value={question.answer}
                      onChange={handleSecurityQuestionChange(index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                      placeholder="Your answer"
                      required
                    />
                  </div>
                ))}
              </div>

              {/* ID Verification Section */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">ID Verification</h3>
                
                {/* ID Type Selection */}
                <div className="mb-4">
                  <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-1">
                    ID Type *
                  </label>
                  <select
                    id="idType"
                    name="idType"
                    value={formData.idType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                    required
                  >
                    <option value="">Select ID Type</option>
                    {ID_TYPES.map(type => (
                      <option key={type} value={type}>
                        {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ID Document Upload */}
                <div className="mb-4">
                  <label htmlFor="idDocument" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload ID Document *
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="idDocument" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">JPG, PNG, PDF (MAX. 5MB)</p>
                      </div>
                      <input 
                        id="idDocument" 
                        name="idDocument" 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.pdf"
                        required
                      />
                    </label>
                  </div>
                  {formData.idDocument && (
                    <p className="mt-2 text-sm text-green-600">
                      ✓ {formData.idDocument.name} selected
                    </p>
                  )}
                </div>
              </div>

              <div className="relative">
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Create Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="signup-password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                  placeholder="Create a password (min. 6 characters)"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="relative">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpStep(false);
                    setOtp('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#03305c] text-white py-2 px-4 rounded-md hover:bg-[#e8742c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:ring-offset-2"
                >
                  Open Account
                </button>
              </div>
            </form>
          )
        ) : null}

        {showForgotPassword && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Reset Password</h3>
            {resetSuccess ? (
              <div className="p-3 bg-green-100 text-green-700 rounded-md">
                If an account exists with this email, you will receive a reset link
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  Enter your email to receive a password reset link
                </p>
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="forgot-email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="flex-1 bg-[#03305c] text-white py-2 px-4 rounded-md hover:bg-[#e8742c] transition-colors"
                  >
                    Send Reset Link
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {showResetPassword && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <h3 className="text-lg font-medium">Set New Password</h3>
            {resetSuccess ? (
              <div className="p-3 bg-green-100 text-green-700 rounded-md">
                Password updated successfully! You can now login with your new password
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03305c] focus:border-transparent"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#03305c] text-white py-2 px-4 rounded-md hover:bg-[#e8742c] transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModals;