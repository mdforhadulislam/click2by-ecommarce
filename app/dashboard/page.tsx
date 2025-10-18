"use client";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiService } from "@/lib/api";
import { ShoppingBag, Package, CreditCard, User, TrendingUp, Clock } from "lucide-react";

export default function UserDashboard() {
  const { user, token } = useAuth();
  const { totalItems } = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      if (!token) return;
      const response: any = await ApiService.orders.getMy(token);
      const ordersList = response.results || response.data || response || [];
      setOrders(ordersList.slice(0, 5)); // Get latest 5 orders
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8" data-testid="user-dashboard">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
            <h1 className="text-4xl font-bold mb-2" data-testid="dashboard-title">Welcome back, {user?.full_name || user?.name || 'User'}! 👋</h1>
            <p className="text-purple-100 text-lg">Here's what's happening with your account today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/orders">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Package className="text-blue-600" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{orders.length}</span>
                </div>
                <h3 className="text-gray-600 font-semibold">Total Orders</h3>
              </div>
            </Link>

            <Link href="/cart">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <ShoppingBag className="text-purple-600" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{totalItems}</span>
                </div>
                <h3 className="text-gray-600 font-semibold">Cart Items</h3>
              </div>
            </Link>

            <Link href="/payments">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CreditCard className="text-green-600" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">৳0</span>
                </div>
                <h3 className="text-gray-600 font-semibold">Total Spent</h3>
              </div>
            </Link>

            <Link href="/profile">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-pink-100 rounded-lg">
                    <User className="text-pink-600" size={24} />
                  </div>
                </div>
                <h3 className="text-gray-600 font-semibold">My Profile</h3>
              </div>
            </Link>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Clock className="text-purple-600" />
                Recent Orders
              </h2>
              <Link href="/orders" className="text-purple-600 hover:text-purple-700 font-semibold">
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto"></div>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">Order #{order.id?.slice(0, 8)}</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">৳{order.total_amount || 0}</p>
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-600' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">No orders yet</p>
                <Link href="/products">
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition">
                    Start Shopping
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/products" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2">Browse Products</h3>
                <p className="text-gray-600 text-sm">Discover amazing deals</p>
              </div>
            </Link>

            <Link href="/orders" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2">Track Orders</h3>
                <p className="text-gray-600 text-sm">View order status</p>
              </div>
            </Link>

            <Link href="/profile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2">My Profile</h3>
                <p className="text-gray-600 text-sm">Update your info</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
