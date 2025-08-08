// 'use client';
// import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
// import { toast } from 'react-toastify';

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// interface PinContextType {
//   hasPin: boolean;
//   isLoading: boolean;
//   showPinModal: boolean;
//   setShowPinModal: (value: boolean) => void;
//   handleSetPin: (pin: string) => Promise<void>;
//   checkPinStatus: () => Promise<void>;
// }

// const PinContext = createContext<PinContextType | undefined>(undefined);

// export const PinProvider = ({ children }: { children: ReactNode }) => {
//   const [hasPin, setHasPin] = useState<boolean>(false);
//   const [showPinModal, setShowPinModal] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   const checkPinStatus = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.log('No token found, skipping PIN status check');
//         setHasPin(false);
//         setIsLoading(false);
//         return;
//       }
//       console.log('Checking PIN status with token:', token.substring(0, 10) + '...');
//       const res = await fetch(`${API_URL}/api/users/pin-status`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         console.log('PIN status response:', data);
//         setHasPin(data.hasPin || false);
//       } else {
//         console.error('PIN status check failed:', res.status, res.statusText);
//         setHasPin(false);
//       }
//     } catch (error) {
//       console.error('Error checking PIN status:', error);
//       setHasPin(false);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const token = localStorage.getItem('token');
//       console.log('Token change detected:', token ? token.substring(0, 10) + '...' : 'null');
//       if (token) {
//         checkPinStatus();
//       } else {
//         setHasPin(false);
//       }
//     };

//     handleStorageChange(); // Initial check
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, [checkPinStatus]);

//   const handleSetPin = async (pin: string): Promise<void> => {
//     try {
//       const token = localStorage.getItem('token');
//       console.log('Setting PIN with token:', token?.substring(0, 10) + '...');
//       const res = await fetch(`${API_URL}/api/users/set-pin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ pin }),
//       });

//       const data = await res.json();
//       console.log('Set PIN response:', data);
//       if (!res.ok) {
//         throw new Error(data.message || 'Failed to set PIN');
//       }

//       setHasPin(true);
//       setShowPinModal(false);
//       toast.success(data.message || 'Transfer PIN set successfully');
//     } catch (error) {
//       console.error('Set PIN error:', error);
//       toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
//       throw error;
//     }
//   };

//   const value = { hasPin, isLoading, showPinModal, setShowPinModal, handleSetPin, checkPinStatus };

//   return (
//     <PinContext.Provider value={value}>
//       {children}
//     </PinContext.Provider>
//   );
// };

// export const usePin = (): PinContextType => {
//   const context = useContext(PinContext);
//   if (context === undefined) {
//     throw new Error('usePin must be used within a PinProvider');
//   }
//   return context;
// };