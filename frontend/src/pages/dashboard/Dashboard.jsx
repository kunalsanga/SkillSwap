import React, { useState, useEffect } from 'react';
import { searchUsers } from '../../services/userService';
import UserCard from '../../components/user/UserCard';
import { Search, Loader } from 'lucide-react';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async (query = '') => {
    setLoading(true);
    try {
      const res = await searchUsers(query ? { search: query } : {});
      if (res.success) {
        setUsers(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(searchQuery);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find Skills</h1>
          <p className="text-sm text-gray-500 mt-1">Discover other users and the skills they offer.</p>
        </div>
        
        <form onSubmit={handleSearch} className="w-full md:w-96 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by skill or name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 min-h-[400px]">
          <div className="flex flex-col items-center">
            <Loader className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium animate-pulse">Finding perfect skill matches...</p>
          </div>
        </div>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <Search className="h-10 w-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Be the first to offer this skill!</h3>
          <p className="mt-2 text-gray-500 max-w-sm">No users were found matching your criteria. Try adjusting your search terms or update your own profile to stand out.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
