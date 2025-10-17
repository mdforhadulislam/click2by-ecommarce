"use client";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  DollarSign,
  Link as LinkIcon,
  TrendingUp,
  Wallet,
  Users,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ApiService } from "@/lib/api";

export default function AffiliateDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingCommissions: 0,
    totalClicks: 0,
    totalConversions: 0,
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
      
      const [commissions, wallet] = await Promise.all([
        ApiService.affiliate.getCommissions(token).catch(() => ({ results: [] })),
        ApiService.affiliate.getWallet(token).catch(() => ({ balance: 0 })),
      ]);

      const commissionsList = (commissions as any).results || (commissions as any).data || [];
      const walletData = (wallet as any).data || wallet || {};

      const totalEarnings = commissionsList.reduce((sum: number, comm: any) => {
        return sum + (comm.amount || 0);
      }, 0);

      const pendingCommissions = commissionsList
        .filter((c: any) => c.status === "pending")
        .reduce((sum: number, c: any) => sum + (c.amount || 0), 0);

      setStats({
        totalEarnings: walletData.balance || totalEarnings,
        pendingCommissions,
        totalClicks: 0, // Will be implemented by backend
        totalConversions: commissionsList.length,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAffiliate={true}>
      <div className="min-h-screen bg-gray-50" data-testid="affiliate-dashboard">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2" data-testid="affiliate-dashboard-title">
                  Affiliate Dashboard
                </h1>
                <p className="text-green-100">Welcome back, {user?.name}!</p>
              </div>
              <Link href="/">
                <button className="bg-white text-green-600 px-6 py-2 rounded font-semibold hover:bg-gray-100 transition">
                  Back to Store
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-total-earnings">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600">Total Earnings</h3>
                <DollarSign className="text-green-600" size={24} />
              </div>
              <p className="text-3xl font-bold text-green-600">
                {loading ? "..." : `৳${stats.totalEarnings.toLocaleString()}`}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-pending-commissions">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600">Pending</h3>
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <p className="text-3xl font-bold text-orange-600">
                {loading ? "..." : `৳${stats.pendingCommissions.toLocaleString()}`}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-total-clicks">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600">Total Clicks</h3>
                <Eye className="text-blue-600" size={24} />
              </div>
              <p className="text-3xl font-bold">{loading ? "..." : stats.totalClicks}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-conversions">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600">Conversions</h3>
                <Users className="text-purple-600" size={24} />
              </div>
              <p className="text-3xl font-bold">{loading ? "..." : stats.totalConversions}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/affiliate/links" data-testid="affiliate-links-link">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <LinkIcon className="text-blue-600 mb-3" size={32} />
                <h3 className="text-xl font-bold mb-2">My Links</h3>
                <p className="text-gray-600">Generate and manage affiliate links</p>
              </div>
            </Link>

            <Link href="/affiliate/commissions" data-testid="affiliate-commissions-link">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <DollarSign className="text-green-600 mb-3" size={32} />
                <h3 className="text-xl font-bold mb-2">Commissions</h3>
                <p className="text-gray-600">View your commission history</p>
              </div>
            </Link>

            <Link href="/affiliate/wallet" data-testid="affiliate-wallet-link">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <Wallet className="text-purple-600 mb-3" size={32} />
                <h3 className="text-xl font-bold mb-2">Wallet</h3>
                <p className="text-gray-600">Manage withdrawals and balance</p>
              </div>
            </Link>

            <Link href="/affiliate/profile">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <Users className="text-orange-600 mb-3" size={32} />
                <h3 className="text-xl font-bold mb-2">Profile</h3>
                <p className="text-gray-600">Update your affiliate profile</p>
              </div>
            </Link>

            <Link href="/products">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <TrendingUp className="text-pink-600 mb-3" size={32} />
                <h3 className="text-xl font-bold mb-2">Browse Products</h3>
                <p className="text-gray-600">Find products to promote</p>
              </div>
            </Link>

            <div className="bg-gradient-to-br from-green-500 to-blue-500 p-6 rounded-lg shadow text-white">
              <h3 className="text-xl font-bold mb-2">Pro Tip!</h3>
              <p className="text-green-100">
                Share your links on social media to increase conversions
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
