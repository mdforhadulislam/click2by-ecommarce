"use client";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { useEffect, useState } from "react";
import { ApiService } from "@/lib/api";
import Link from "next/link";
import { DollarSign, TrendingUp, Users, Link2, Wallet, Award } from "lucide-react";

export default function AffiliateDashboard() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({
    totalCommissions: 0,
    pendingCommissions: 0,
    totalClicks: 0,
    totalConversions: 0,
    walletBalance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchAffiliateStats();
    }
  }, [token]);

  const fetchAffiliateStats = async () => {
    try {
      if (!token) return;
      
      const [wallet, commissions] = await Promise.all([
        ApiService.affiliate.getWallet(token).catch(() => ({ balance: 0 })),
        ApiService.affiliate.getCommissions(token).catch(() => ({ results: [] })),
      ]);

      const commissionsList = (commissions as any).results || (commissions as any).data || [];
      const totalEarned = commissionsList.reduce((sum: number, c: any) => sum + (Number(c.amount) || 0), 0);
      const pending = commissionsList.filter((c: any) => c.status === 'pending').reduce((sum: number, c: any) => sum + (Number(c.amount) || 0), 0);

      setStats({
        totalCommissions: totalEarned,
        pendingCommissions: pending,
        totalClicks: 0,
        totalConversions: commissionsList.length,
        walletBalance: (wallet as any).balance || 0,
      });
    } catch (error) {
      console.error("Failed to fetch affiliate stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAffiliate={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8" data-testid="affiliate-dashboard">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <Award size={48} />
              <div>
                <h1 className="text-4xl font-bold" data-testid="affiliate-dashboard-title">Affiliate Dashboard</h1>
                <p className="text-green-100 text-lg">Welcome, {user?.full_name || user?.name}!</p>
              </div>
            </div>
            <p className="text-lg">Track your earnings and performance</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <span className="text-sm font-semibold text-green-600">Total Earned</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">৳{stats.totalCommissions.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">All-time earnings</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <TrendingUp className="text-yellow-600" size={24} />
                </div>
                <span className="text-sm font-semibold text-yellow-600">Pending</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">৳{stats.pendingCommissions.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">Awaiting approval</p>
            </div>

            <Link href="/affiliate/wallet">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Wallet className="text-blue-600" size={24} />
                  </div>
                  <span className="text-sm font-semibold text-blue-600">Wallet</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">৳{stats.walletBalance.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">Available balance</p>
              </div>
            </Link>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="text-purple-600" size={24} />
                </div>
                <span className="text-sm font-semibold text-purple-600">Conversions</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.totalConversions}</p>
              <p className="text-sm text-gray-500 mt-1">Total sales</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/affiliate/links" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Link2 className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2">Generate Links</h3>
                <p className="text-gray-600 text-sm">Create affiliate links</p>
              </div>
            </Link>

            <Link href="/affiliate/commissions" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2">View Commissions</h3>
                <p className="text-gray-600 text-sm">Track your earnings</p>
              </div>
            </Link>

            <Link href="/affiliate/wallet" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2">Manage Wallet</h3>
                <p className="text-gray-600 text-sm">Withdraw earnings</p>
              </div>
            </Link>
          </div>

          {/* Performance Chart Placeholder */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Performance Overview</h2>
            <div className="text-center py-12 text-gray-400">
              <TrendingUp size={64} className="mx-auto mb-4" />
              <p>Performance charts will be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
