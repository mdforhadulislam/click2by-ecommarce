"use client";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Settings,
  TrendingUp,
  Box,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ApiService } from "@/lib/api";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  const fetchStats = async () => {
    try {
      if (!token) return;
      
      const [products, orders] = await Promise.all([
        ApiService.products.admin.getAll(token).catch(() => ({ results: [] })),
        ApiService.orders.admin.getAll(token).catch(() => ({ results: [] })),
      ]);

      const productsList = (products as any).results || (products as any).data || [];
      const ordersList = (orders as any).results || (orders as any).data || [];

      const totalRevenue = ordersList.reduce((sum: number, order: any) => {
        return sum + (order.total_amount || 0);
      }, 0);

      const pendingOrders = ordersList.filter(
        (order: any) => order.status === "pending"
      ).length;

      setStats({
        totalProducts: productsList.length,
        totalOrders: ordersList.length,
        totalRevenue,
        pendingOrders,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50" data-testid="admin-dashboard">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold" data-testid="admin-dashboard-title">Admin Dashboard</h1>
              <Link href="/">
                <button className="px-4 py-2 border rounded hover:bg-gray-50">
                  Back to Store
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stats Cards */}
            <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-total-products">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600">Total Products</h3>
                <Package className="text-blue-600" size={24} />
              </div>
              <p className="text-3xl font-bold">{loading ? "..." : stats.totalProducts}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-total-orders">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600">Total Orders</h3>
                <ShoppingCart className="text-green-600" size={24} />
              </div>
              <p className="text-3xl font-bold">{loading ? "..." : stats.totalOrders}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-total-revenue">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600">Total Revenue</h3>
                <DollarSign className="text-purple-600" size={24} />
              </div>
              <p className="text-3xl font-bold">
                {loading ? "..." : `৳${stats.totalRevenue.toLocaleString()}`}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-pending-orders">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600">Pending Orders</h3>
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <p className="text-3xl font-bold">{loading ? "..." : stats.pendingOrders}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/products" data-testid="admin-products-link">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <Package className="text-blue-600 mb-3" size={32} />
                <h3 className="text-xl font-bold mb-2">Manage Products</h3>
                <p className="text-gray-600">Add, edit, or remove products</p>
              </div>
            </Link>

            <Link href="/admin/orders" data-testid="admin-orders-link">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <ShoppingCart className="text-green-600 mb-3" size={32} />
                <h3 className="text-xl font-bold mb-2">Manage Orders</h3>
                <p className="text-gray-600">View and process orders</p>
              </div>
            </Link>

            <Link href="/admin/categories" data-testid="admin-categories-link">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <Box className="text-purple-600 mb-3" size={32} />
                <h3 className="text-xl font-bold mb-2">Manage Categories</h3>
                <p className="text-gray-600">Organize product categories</p>
              </div>
            </Link>

            <Link href="/admin/variations">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <Settings className="text-orange-600 mb-3" size={32} />
                <h3 className="text-xl font-bold mb-2">Product Variations</h3>
                <p className="text-gray-600">Manage colors, sizes, qualities</p>
              </div>
            </Link>

            <Link href="/admin/users">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <Users className="text-pink-600 mb-3" size={32} />
                <h3 className="text-xl font-bold mb-2">User Management</h3>
                <p className="text-gray-600">View and manage users</p>
              </div>
            </Link>

            <Link href="/admin/notifications">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <LayoutDashboard className="text-indigo-600 mb-3" size={32} />
                <h3 className="text-xl font-bold mb-2">Notifications</h3>
                <p className="text-gray-600">Send notifications to users</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
