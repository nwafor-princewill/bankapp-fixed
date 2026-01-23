
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiUsers, FiDollarSign, FiCreditCard, FiSettings, 
  FiCalendar, FiX, FiClock, FiShield, FiTrash2, 
  FiLock, FiUnlock, FiUser, FiArrowLeft, FiActivity, FiPlus
} from 'react-icons/fi';
import { toast } from 'react-toastify';

type Account = { accountNumber: string; balance: number; };
type User = {
  _id: string; firstName: string; lastName: string;
  email: string; accounts: Account[]; isAdmin: boolean;
  status: 'active' | 'blocked'; rewardPoints?: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, totalBalance: 0, btcAddress: '' });
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [forgeData, setForgeData] = useState({
    amount: '',
    type: 'deposit',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const router = useRouter();

  useEffect(() => { checkAdminAccess(); }, []);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }
      const response = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error();
      setIsAdmin(true);
      fetchAdminData();
    } catch (err) {
      router.push('/dashboard');
    } finally { setIsLoading(false); }
  };

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      setStats({
        totalUsers: statsData.users,
        activeUsers: statsData.activeUsers,
        totalBalance: statsData.totalBalance || 0,
        btcAddress: statsData.btcAddress
      });
      setUsers(usersData);
    } catch (err) { toast.error('Failed to refresh data'); }
  };

  // --- POWER ACTIONS ---

  const handleUniversalUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    // FIX: Checkbox sends "on" - convert to true boolean
    const isAdminBool = formData.get('isAdmin') === 'on';

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/update-user-360`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          userId: selectedUser._id,
          updates: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            isAdmin: isAdminBool
          },
          accountUpdates: [{
            accountNumber: selectedUser.accounts[0]?.accountNumber,
            newBalance: Number(formData.get('newBalance')),
            description: formData.get('adjustmentLabel')
          }]
        })
      });

      if (response.ok) {
        toast.success("User and Balance updated successfully");
        setSelectedUser(null);
        fetchAdminData();
      } else {
        const error = await response.json();
        toast.error(error.message || "Update failed");
      }
    } catch (err) { toast.error("Update failed"); } 
    finally { setIsSaving(false); }
  };

  // SECURITY CENTER ACTIONS
  const handleSendResetLink = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/reset-password-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId })
      });
      if (res.ok) toast.success("Reset link sent to user email");
      else toast.error("Failed to send link");
    } catch (err) { toast.error("Error connecting to server"); }
  };

  const handleManualPassword = async (userId: string) => {
    const newPass = prompt("Enter new password for this user:");
    if (!newPass) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/manual-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId, newPassword: newPass })
      });
      if (res.ok) toast.success("Password updated successfully");
      else toast.error("Update failed");
    } catch (err) { toast.error("Error connecting to server"); }
  };

  const handleForgeTransaction = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/forge-transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          userId: selectedUser._id,
          accountNumber: selectedUser.accounts[0].accountNumber,
          ...forgeData
        })
      });
      if (response.ok) {
        toast.success("Transaction forged into history!");
        setSelectedUser(null);
        fetchAdminData();
      }
    } catch (err) { toast.error("Forge failed"); }
  };

  const toggleBlockUser = async (user: User) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/block-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId: user._id, block: user.status !== 'blocked' })
      });
      if (response.ok) {
        toast.success(`User ${user.status === 'blocked' ? 'unblocked' : 'blocked'}`);
        fetchAdminData();
        setSelectedUser(null);
      }
    } catch (err) { toast.error("Action failed"); }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Permanently delete this user? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/delete-user/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("User deleted");
        setSelectedUser(null);
        fetchAdminData();
      }
    } catch (err) { toast.error("Delete failed"); }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen font-bold">Initializing Command Center...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#03305c] tracking-tight">PRINCEWILL<span className="text-orange-500">.AI</span></h1>
          <p className="text-gray-500 text-sm font-medium">Administrative Control Panel</p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase">System Liquidity</p>
            <p className="text-lg font-bold text-green-600">${stats.totalBalance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {!selectedUser ? (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <FiUsers className="text-blue-500 mb-2" size={24} />
              <p className="text-gray-500 text-xs font-bold uppercase">Total Users</p>
              <p className="text-2xl font-black">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <FiActivity className="text-green-500 mb-2" size={24} />
              <p className="text-gray-500 text-xs font-bold uppercase">Active</p>
              <p className="text-2xl font-black">{stats.activeUsers}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#03305c]">User Directory</h2>
              <div className="flex gap-2">
                 <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-full text-sm font-bold ${activeTab === 'users' ? 'bg-[#03305c] text-white' : 'bg-gray-100'}`}>Users</button>
                 <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-full text-sm font-bold ${activeTab === 'settings' ? 'bg-[#03305c] text-white' : 'bg-gray-100'}`}>Settings</button>
              </div>
            </div>

            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-widest">
                      <th className="px-6 py-4">User Details</th>
                      <th className="px-6 py-4">Primary Account</th>
                      <th className="px-6 py-4">Current Balance</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#03305c] to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                              {user.firstName[0]}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-sm text-gray-600">{user.accounts[0]?.accountNumber || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <p className="font-black text-gray-900">${user.accounts[0]?.balance.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {user.status || 'active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedUser(user)}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-[#03305c] hover:bg-[#03305c] hover:text-white transition-all shadow-sm"
                          >
                            Manage User
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto animate-in slide-in-from-right duration-300">
          <button 
            onClick={() => setSelectedUser(null)}
            className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#03305c] mb-6 transition-colors"
          >
            <FiArrowLeft /> Back to Directory
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
                <div className="w-24 h-24 rounded-full bg-blue-100 text-[#03305c] flex items-center justify-center text-4xl font-black mx-auto mb-4 border-4 border-white shadow-lg">
                  {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                </div>
                <h2 className="text-2xl font-black text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</h2>
                <p className="text-gray-500 mb-6">{selectedUser.email}</p>
                
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => toggleBlockUser(selectedUser)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${selectedUser.status === 'blocked' ? 'bg-green-500 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
                  >
                    {selectedUser.status === 'blocked' ? <><FiUnlock /> Unblock Account</> : <><FiLock /> Block Account</>}
                  </button>
                  <button 
                    onClick={() => deleteUser(selectedUser._id)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                  >
                    <FiTrash2 /> Terminate User
                  </button>
                </div>
              </div>

              <div className="bg-[#03305c] p-6 rounded-3xl shadow-xl text-white">
                <h3 className="font-bold flex items-center gap-2 mb-4"><FiShield className="text-orange-400"/> Security Center</h3>
                <p className="text-xs text-blue-200 mb-4">Change user credentials or force password reset.</p>
                <button 
                  onClick={() => handleSendResetLink(selectedUser._id)}
                  className="w-full bg-blue-500/20 border border-blue-400/30 py-2 rounded-lg text-sm font-bold hover:bg-blue-500/40 transition-all mb-2"
                >
                  Send Reset Link
                </button>
                <button 
                  onClick={() => handleManualPassword(selectedUser._id)}
                  className="w-full bg-white text-[#03305c] py-2 rounded-lg text-sm font-bold hover:bg-blue-50"
                >
                  Set Manual Password
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleUniversalUpdate} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-[#03305c]">Account Master Control</h3>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <label className="text-xs font-bold text-gray-500">Admin Privileges</label>
                    <input type="checkbox" name="isAdmin" defaultChecked={selectedUser.isAdmin} className="w-4 h-4 rounded text-[#03305c]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">First Name</label>
                    <input name="firstName" defaultValue={selectedUser.firstName} className="w-full p-3 bg-gray-50 border-none rounded-xl font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Last Name</label>
                    <input name="lastName" defaultValue={selectedUser.lastName} className="w-full p-3 bg-gray-50 border-none rounded-xl font-bold" />
                  </div>
                </div>

                <div className="bg-orange-50 border-2 border-orange-100 p-6 rounded-2xl mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-orange-800 font-black text-sm uppercase tracking-tight">Overwrite Live Balance</label>
                    <span className="bg-orange-200 text-orange-800 text-[10px] px-2 py-1 rounded font-bold italic underline">DANGEROUS ACTION</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-orange-300">$</span>
                    <input 
                      name="newBalance" 
                      type="number" 
                      defaultValue={selectedUser.accounts[0]?.balance} 
                      className="w-full bg-transparent text-4xl font-black text-orange-600 border-none focus:ring-0 p-0"
                    />
                  </div>
                  <input 
                    name="adjustmentLabel" 
                    placeholder="Transaction Label (e.g. Balance Correction)" 
                    className="w-full mt-4 p-2 text-xs bg-white/50 border-orange-200 border rounded-lg"
                  />
                </div>

                <button 
                  disabled={isSaving}
                  className="w-full bg-[#03305c] text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-blue-200 transition-all hover:-translate-y-1"
                >
                  {isSaving ? "PROCESSING SYNC..." : "SYNC ALL CHANGES"}
                </button>
              </form>

              <div className="bg-gray-900 p-8 rounded-3xl shadow-2xl text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-500/20 rounded-xl text-green-400"><FiPlus size={24}/></div>
                  <div>
                    <h3 className="text-xl font-black">History Forge</h3>
                    <p className="text-xs text-gray-400 font-medium">Inject a transaction into the past.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Amount ($)</label>
                    <input 
                      type="number" 
                      placeholder="5000" 
                      className="w-full bg-gray-800 border-gray-700 rounded-xl p-3 text-white font-bold"
                      onChange={(e) => setForgeData({...forgeData, amount: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Type</label>
                    <select 
                      className="w-full bg-gray-800 border-gray-700 rounded-xl p-3 text-white font-bold appearance-none"
                      onChange={(e) => setForgeData({...forgeData, type: e.target.value})}
                    >
                      <option value="deposit">Deposit</option>
                      <option value="withdrawal">Withdrawal</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description</label>
                  <input 
                    type="text" 
                    placeholder="Wired via Swift" 
                    className="w-full bg-gray-800 border-gray-700 rounded-xl p-3 text-white font-medium text-sm"
                    onChange={(e) => setForgeData({...forgeData, description: e.target.value})}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Backdate To</label>
                  <input 
                    type="date" 
                    className="w-full bg-gray-800 border-gray-700 rounded-xl p-3 text-white font-bold"
                    value={forgeData.date}
                    onChange={(e) => setForgeData({...forgeData, date: e.target.value})}
                  />
                </div>

                <button 
                  onClick={handleForgeTransaction}
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-green-900/20"
                >
                  FORGE TRANSACTION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}