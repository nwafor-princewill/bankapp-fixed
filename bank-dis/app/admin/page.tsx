'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUsers, FiDollarSign, FiCreditCard, FiSettings, FiCalendar, FiX, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';

// Define types
type Account = {
  accountNumber: string;
  balance: number;
};

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accounts: Account[];
  isAdmin: boolean;
  status: 'active' | 'blocked';
};

type Transaction = {
  _id: string;
  accountNumber: string;
  amount: number;
  type: string;
  reference: string;
  createdAt: string;
  description: string;
  userId: string;
};

type ModificationHistory = {
  date: Date;
  changedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  changes: Record<string, any>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBalance: 0,
    btcAddress: ''
  });
  const [creditForm, setCreditForm] = useState({
    userEmail: '',
    accountNumber: '',
    amount: '',
    description: 'Admin credit'
  });
  const [newBtcAddress, setNewBtcAddress] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [newDate, setNewDate] = useState('');
  const [showBackdateModal, setShowBackdateModal] = useState(false);
  const [modificationHistory, setModificationHistory] = useState<ModificationHistory[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 403) {
        toast.error('Admin access required');
        router.push('/dashboard');
        return;
      }

      if (response.status === 401) {
        toast.error('Please log in');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsAdmin(true);
      fetchAdminData();
    } catch (err) {
      console.error('Admin access check failed:', err);
      toast.error('Failed to verify admin access');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [statsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/admin/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      if (!statsRes.ok) throw new Error(`Stats API failed: ${statsRes.status}`);
      if (!usersRes.ok) throw new Error(`Users API failed: ${usersRes.status}`);
      
      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      
      setStats({
        totalUsers: statsData.users,
        activeUsers: statsData.activeUsers,
        totalBalance: statsData.totalBalance || 0,
        btcAddress: statsData.btcAddress
      });
      setUsers(usersData);
      setNewBtcAddress(statsData.btcAddress);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      toast.error('Failed to load admin data: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const fetchTransactions = async (cacheBuster?: number) => {
    try {
      const token = localStorage.getItem('token');
      const url = `${API_URL}/api/admin/transactions${cacheBuster ? `?t=${cacheBuster}` : ''}`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
      });
      
      if (!response.ok) throw new Error('Failed to fetch transactions');
      
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      toast.error('Failed to load transactions');
    }
  };

  const fetchModificationHistory = async (transactionId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/transaction-history/${transactionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch history');
      
      const data = await response.json();
      setModificationHistory(data.history || []);
      setShowHistoryModal(true);
    } catch (err) {
      console.error('Failed to load modification history:', err);
      toast.error('Failed to load modification history');
    }
  };

  const handleCreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/credit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(creditForm)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success(data.message);
      setCreditForm({
        userEmail: '',
        accountNumber: '',
        amount: '',
        description: 'Admin credit'
      });
      fetchAdminData();
    } catch (err) {
      console.error('Credit failed:', err);
      toast.error(err instanceof Error ? err.message : 'Credit failed');
    }
  };

  const toggleBlockUser = async (userId: string, currentlyBlocked: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/block-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          block: !currentlyBlocked
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setUsers(users.map(user => 
          user._id === userId 
            ? { ...user, status: currentlyBlocked ? 'active' : 'blocked' } 
            : user
        ));
      } else {
        throw new Error(data.message || 'Failed to update user status');
      }
    } catch (err) {
      console.error('Block user failed:', err);
      toast.error(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const handleBtcUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/update-btc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newAddress: newBtcAddress })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success(data.message);
      fetchAdminData();
    } catch (err) {
      console.error('BTC update failed:', err);
      toast.error(err instanceof Error ? err.message : 'BTC address update failed');
    }
  };

  const handleBackdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/backdate-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          transactionId: selectedTransaction?._id,
          newDate: new Date(newDate).toISOString()
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success('Transaction date updated successfully');
      setShowBackdateModal(false);
      fetchTransactions(Date.now());
    } catch (err) {
      console.error('Backdate failed:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to backdate transaction');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return <div className="flex justify-center items-center h-screen">Access Denied</div>;
  }

  const BackdateTransactionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#03305c]">Backdate Transaction</h2>
          <button 
            onClick={() => setShowBackdateModal(false)} 
            className="text-gray-500 hover:text-[#e8742c]"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="mb-4">
          <p className="font-medium">Reference: {selectedTransaction?.reference}</p>
          <p>Amount: ${selectedTransaction?.amount?.toFixed(2)}</p>
          <p>Current Date: {selectedTransaction?.createdAt ? new Date(selectedTransaction.createdAt).toLocaleString() : ''}</p>
        </div>

        <form onSubmit={handleBackdateSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">New Date</label>
            <div className="relative">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded pl-10"
                required
              />
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowBackdateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-white bg-[#03305c] hover:bg-[#e8742c]"
            >
              Update Date
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const HistoryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Modification History</h2>
          <button onClick={() => setShowHistoryModal(false)} className="text-gray-500 hover:text-red-500">
            <FiX size={24} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-96">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Changed By</th>
                <th className="px-4 py-2 text-left">Changes</th>
              </tr>
            </thead>
            <tbody>
              {modificationHistory.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{new Date(item.date).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {item.changedBy?.firstName} {item.changedBy?.lastName}
                  </td>
                  <td className="px-4 py-2">
                    <pre className="text-xs">{JSON.stringify(item.changes, null, 2)}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <FiUsers className="text-blue-500 mr-2" size={20} />
            <span className="font-medium">Total Users</span>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <FiUsers className="text-green-500 mr-2" size={20} />
            <span className="font-medium">Active Users</span>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.activeUsers}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <FiDollarSign className="text-yellow-500 mr-2" size={20} />
            <span className="font-medium">Total Balance</span>
          </div>
          <p className="text-2xl font-bold mt-2">${stats.totalBalance.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <FiCreditCard className="text-purple-500 mr-2" size={20} />
            <span className="font-medium">BTC Address</span>
          </div>
          <p className="text-sm mt-2 break-all">{stats.btcAddress}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded ${
            activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => {
            setActiveTab('transactions');
            fetchTransactions();
          }}
          className={`px-4 py-2 rounded ${
            activeTab === 'transactions' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('credit')}
          className={`px-4 py-2 rounded ${
            activeTab === 'credit' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Credit Account
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded ${
            activeTab === 'settings' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <FiSettings className="inline mr-1" />
          Settings
        </button>
      </div>

      {/* Content */}
      {activeTab === 'users' && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">All Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Account Numbers</th>
                  <th className="text-left p-2">Total Balance</th>
                  <th className="text-left p-2">Admin</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{user.firstName} {user.lastName}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      {user.accounts?.length > 0 ? (
                        <div className="space-y-1">
                          {user.accounts.map((acc, idx) => (
                            <div key={idx} className="text-sm">
                              {acc.accountNumber}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">No accounts</span>
                      )}
                    </td>
                    <td className="p-2">
                      {user.accounts?.length > 0 ? (
                        <div className="space-y-1">
                          {user.accounts.map((acc, idx) => (
                            <div key={idx} className="text-sm font-medium">
                              ${acc.balance?.toLocaleString() || '0'}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">$0</span>
                      )}
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.isAdmin ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => toggleBlockUser(user._id, user.status === 'blocked')}
                        className={`px-3 py-1 rounded text-white text-sm ${
                          user.status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {user.status === 'active' ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">All Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-[#03305c] text-white">
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Reference</th>
                  <th className="py-3 px-4 text-left">Account</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{new Date(txn.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4">{txn.reference}</td>
                    <td className="py-3 px-4">{txn.accountNumber}</td>
                    <td className={`py-3 px-4 ${
                      txn.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${Math.abs(txn.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 capitalize">{txn.type}</td>
                    <td className="py-3 px-4 flex">
                      <button
                        onClick={() => {
                          setSelectedTransaction(txn);
                          setNewDate(new Date(txn.createdAt).toISOString().split('T')[0]);
                          setShowBackdateModal(true);
                        }}
                        className="text-[#03305c] hover:text-[#e8742c] p-1"
                        title="Backdate transaction"
                      >
                        <FiCalendar size={18} />
                      </button>
                      <button
                        onClick={() => fetchModificationHistory(txn._id)}
                        className="text-blue-500 hover:text-blue-700 ml-2 p-1"
                        title="View history"
                      >
                        <FiClock size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'credit' && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Credit User Account</h2>
          <form onSubmit={handleCreditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">User Email</label>
              <input
                type="email"
                value={creditForm.userEmail}
                onChange={(e) => setCreditForm({...creditForm, userEmail: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="user@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Account Number</label>
              <input
                type="text"
                value={creditForm.accountNumber}
                onChange={(e) => setCreditForm({...creditForm, accountNumber: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="1234567890"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={creditForm.amount}
                onChange={(e) => setCreditForm({...creditForm, amount: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="100.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                value={creditForm.description}
                onChange={(e) => setCreditForm({...creditForm, description: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Admin credit adjustment"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Credit Account
            </button>
          </form>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Bitcoin Address Management</h3>
              <form onSubmit={handleBtcUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current BTC Address</label>
                  <p className="text-sm text-gray-600 mb-2 p-2 bg-gray-50 rounded break-all">
                    {stats.btcAddress}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New BTC Address</label>
                  <input
                    type="text"
                    value={newBtcAddress}
                    onChange={(e) => setNewBtcAddress(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="bc1q..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This address will be shown to users for Bitcoin deposits
                  </p>
                </div>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Update BTC Address
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {showBackdateModal && <BackdateTransactionModal />}
      {showHistoryModal && <HistoryModal />}
    </div>
  );
}