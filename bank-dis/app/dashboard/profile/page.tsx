'use client';

import React, { useEffect, useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiCreditCard, FiDollarSign, FiGlobe } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  country: string;
  state: string;
  address: string;
  createdAt: string;
  accounts: Array<{
    accountNumber: string;
    accountName: string;
    balance: number;
    currency: string;
    openingDate: string;
  }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        setProfile(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error('Could not load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#03305c]"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error || 'Unable to load profile. Please try again later.'}
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#03305c] dark:text-gray-100">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-[#03305c] dark:text-gray-100 mb-4 flex items-center gap-2">
            <FiUser /> Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">First Name</label>
              <p className="mt-1 text-gray-900 dark:text-gray-100 font-medium">{profile.firstName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</label>
              <p className="mt-1 text-gray-900 dark:text-gray-100 font-medium">{profile.lastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <FiMail size={14} /> Email
              </label>
              <p className="mt-1 text-gray-900 dark:text-gray-100">{profile.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <FiPhone size={14} /> Phone
              </label>
              <p className="mt-1 text-gray-900 dark:text-gray-100">{profile.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Gender</label>
              <p className="mt-1 text-gray-900 dark:text-gray-100 capitalize">{profile.gender || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <FiCalendar size={14} /> Date of Birth
              </label>
              <p className="mt-1 text-gray-900 dark:text-gray-100">{formatDate(profile.dateOfBirth)}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <FiMapPin size={14} /> Address
              </label>
              <p className="mt-1 text-gray-900 dark:text-gray-100">
                {profile.address}, {profile.state}, {profile.country}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</label>
              <p className="mt-1 text-gray-900 dark:text-gray-100">{formatDate(profile.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Account Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-[#03305c] dark:text-gray-100 mb-4 flex items-center gap-2">
            <FiCreditCard /> Account Details
          </h2>
          {profile.accounts && profile.accounts.length > 0 ? (
            profile.accounts.map((account, idx) => (
              <div key={idx} className="mb-4 last:mb-0 border-b border-gray-100 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">Account Number</p>
                <p className="font-mono font-medium text-gray-900 dark:text-gray-100">{account.accountNumber}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Account Name</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{account.accountName}</p>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
                    <p className="text-lg font-bold text-[#03305c] dark:text-gray-100">
                      {account.currency} {account.balance.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Opened</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">{formatDate(account.openingDate)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No account information available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;