import React, { useState, useEffect } from 'react';
import { getUsers, getSwaps, banUser, postAnnouncement, deleteSkill } from '../../services/adminService';
import { ShieldAlert, Users, ArrowRightLeft, Trash2, Megaphone } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState({ title: '', message: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, swapsRes] = await Promise.all([
        getUsers(),
        getSwaps()
      ]);
      if (usersRes.success) setUsers(usersRes.data);
      if (swapsRes.success) setSwaps(swapsRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBanUser = async (userId) => {
    const reason = window.prompt("Reason for ban:");
    if (!reason) return;
    try {
      await banUser(userId, reason);
      toast.success('User banned successfully');
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to ban user');
    }
  };

  const handleAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await postAnnouncement(announcement);
      toast.success('Announcement posted');
      setAnnouncement({ title: '', message: '' });
    } catch (error) {
      toast.error('Failed to post announcement');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading admin panel...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 border-b pb-4">
        <ShieldAlert className="h-8 w-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Users Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Platform Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{user.name}</div>
                      <div className="text-gray-500 text-xs">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.isBanned ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Banned</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {!user.isBanned && user.role !== 'ADMIN' && (
                        <button 
                          onClick={() => handleBanUser(user.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Ban
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          {/* Post Announcement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Megaphone className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Post Announcement</h2>
            </div>
            <form onSubmit={handleAnnouncement} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                required
                value={announcement.title}
                onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <textarea
                placeholder="Message"
                required
                rows="3"
                value={announcement.message}
                onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Broadcast
              </button>
            </form>
          </div>

          {/* Swap Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <ArrowRightLeft className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Total Swaps</h2>
            </div>
            <div className="text-3xl font-bold text-indigo-600">{swaps.length}</div>
            <p className="text-sm text-gray-500 mt-1">Platform wide swap requests</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
