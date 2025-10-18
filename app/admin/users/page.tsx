"use client";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { ApiService } from "@/lib/api";
import { Users, Search, Shield, UserX, UserCheck } from "lucide-react";

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      if (!token) return;
      // Note: User management endpoint may vary, adjust as needed
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://devforhad.pythonanywhere.com'}/api/v1/admin/users/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const usersList = data.results || data.data || data || [];
      setUsers(usersList);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.full_name || user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50 py-8" data-testid="admin-users-page">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold" data-testid="admin-users-title">Users Management</h1>
                <p className="text-gray-600">Manage all registered users</p>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6 relative">
              <Search className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition"
                data-testid="user-search-input"
              />
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2">
                      <th className="text-left p-4 font-semibold text-gray-700">User</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Phone</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Role</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50" data-testid={`user-row-${user.id}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {(user.full_name || user.name || 'U')[0].toUpperCase()}
                            </div>
                            <span className="font-semibold">{user.full_name || user.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{user.email}</td>
                        <td className="p-4 text-gray-600">{user.phone || 'N/A'}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin' ? 'bg-red-100 text-red-600' :
                            user.role === 'affiliate' ? 'bg-green-100 text-green-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {user.role || 'customer'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition" title="View Details">
                              <Shield size={16} />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded transition" title="Deactivate">
                              <UserX size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="text-center py-12">
                          <Users size={64} className="mx-auto text-gray-300 mb-4" />
                          <p className="text-gray-500">No users found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
