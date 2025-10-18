"use client";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { useEffect, useState } from "react";
import { ApiService } from "@/lib/api";
import { Wallet, DollarSign, TrendingUp, Download, Calendar } from "lucide-react";

export default function AffiliateWalletPage() {
  const { token } = useAuth();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchWallet();
    }
  }, [token]);

  const fetchWallet = async () => {
    try {
      if (!token) return;
      const walletData = await ApiService.affiliate.getWallet(token);
      setWallet(walletData);
      // Transactions would come from wallet API if available
      setTransactions([]);
    } catch (error) {
      console.error("Failed to fetch wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAffiliate={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8" data-testid="affiliate-wallet-page">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Wallet Balance Card */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Wallet size={40} />
                  <h1 className="text-3xl font-bold" data-testid="wallet-title">My Wallet</h1>
                </div>
                <p className="text-green-100 mb-6">Available Balance</p>
                <p className="text-5xl font-bold mb-6">৳{loading ? '...' : ((wallet?.balance || wallet?.total_balance || 0).toFixed(2))}</p>
                <button className="px-8 py-3 bg-white text-green-600 rounded-full font-semibold hover:bg-green-50 transition flex items-center gap-2">
                  <Download size={20} />
                  Withdraw Funds
                </button>
              </div>
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                  <p className="text-green-100 mb-2">Total Earned</p>
                  <p className="text-3xl font-bold">৳{loading ? '...' : ((wallet?.total_earned || 0).toFixed(2))}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-700">Pending</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800">৳{(wallet?.pending_balance || 0).toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-700">This Month</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800">৳{(wallet?.month_earnings || 0).toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Download className="text-purple-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-700">Withdrawn</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800">৳{(wallet?.withdrawn || 0).toFixed(2)}</p>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="text-green-600" />
              Transaction History
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto"></div>
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((txn: any) => (
                  <div key={txn.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{txn.description}</p>
                      <p className="text-sm text-gray-500">{new Date(txn.date).toLocaleDateString()}</p>
                    </div>
                    <p className={`text-xl font-bold ${
                      txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {txn.type === 'credit' ? '+' : '-'}৳{txn.amount}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Wallet size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No transactions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
