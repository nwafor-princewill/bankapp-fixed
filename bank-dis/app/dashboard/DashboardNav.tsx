'use client';
import React, { useEffect, useState, useRef } from 'react';
import { FiBell, FiUser, FiSun, FiMoon, FiCamera, FiEdit2 } from 'react-icons/fi';
import { usePathname } from 'next/navigation';

const DashboardNav = () => {
  const [userName, setUserName] = useState('');
  const [userProfilePicture, setUserProfilePicture] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadHover, setShowUploadHover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Get user data
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user && user.firstName) {
        setUserName(`${user.firstName} ${user.lastName}`);
        setUserProfilePicture(user.profilePicture || '');
      }
    }
    
    // Get dark mode preference
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference) {
      setIsDarkMode(darkModePreference === 'true');
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemPrefersDark);
    }
  }, []);

  useEffect(() => {
    // Apply dark mode to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      handleProfilePictureUpload(file);
    }
  };

  const handleProfilePictureUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profilePicture', file);

      // Get user ID from localStorage
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?.id || user?._id;

      // Get your backend URL from environment or use relative path
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token') || '';
      
      // Upload to your API endpoint
      const response = await fetch(`${backendUrl}/api/users/${userId}/profile-picture`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const newProfilePictureUrl = data.profilePictureUrl;
        
        // Update local state
        setUserProfilePicture(newProfilePictureUrl);
        
        // Update localStorage
        const updatedUser = { ...user, profilePicture: newProfilePictureUrl };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        alert('Profile picture updated successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      let errorMessage = 'Failed to upload profile picture';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(`Error uploading profile picture: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const currentPage = pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard';

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 capitalize">
          {currentPage}
        </h1>
                
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#03305c] dark:hover:text-blue-400 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          
          {/* Notifications */}
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#03305c] dark:hover:text-blue-400 relative transition-colors duration-200">
            <FiBell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* User Profile with Picture Upload */}
          <div className="flex items-center space-x-2">
            <div 
              className="relative w-8 h-8 rounded-full bg-[#03305c] dark:bg-blue-600 flex items-center justify-center text-white transition-colors duration-200 cursor-pointer group"
              onMouseEnter={() => setShowUploadHover(true)}
              onMouseLeave={() => setShowUploadHover(false)}
              onClick={triggerFileInput}
            >
              {userProfilePicture ? (
                <img 
                  src={userProfilePicture} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FiUser size={18} />
              )}
              
              {/* Upload overlay */}
              {showUploadHover && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FiCamera size={14} className="text-white" />
                  )}
                </div>
              )}
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
            
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {userName || 'User'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNav;