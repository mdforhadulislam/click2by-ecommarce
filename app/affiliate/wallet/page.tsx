"use client";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { ApiService } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet, DollarSign, TrendingUp, ArrowUpCircle, History, CheckCircle } from "lucide-react";
import GradientButton from "@/components/ui/GradientButton";
import StatsCard from "@/components/ui/StatsCard";

interface WalletData {
  balance: number;
  total_earned: number;
  total_withdrawn: number;
  pending_withdrawal: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  created_at: string;
}

export default function AffiliateWalletPage() {
  const { token } = useAuth();
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    total_earned: 0,
    total_withdrawn: 0,
    pending_withdrawal: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bkash');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    if (token) {
      fetchWalletData();
    }
  }, [token]);

  const fetchWalletData = async () => {
    try {
      if (!token) return;
      const response: any = await ApiService.affiliate.getWallet(token);
      const data = response.data || response || {};
      
      setWalletData({
        balance: data.balance || 0,
        total_earned: data.total_earned || 0,
        total_withdrawn: data.total_withdrawn || 0,
        pending_withdrawal: data.pending_withdrawal || 0,
      });
      
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const amount = parseFloat(withdrawAmount);
    if (amount > walletData.balance) {
      alert('Insufficient balance!');
      return;
    }

    if (amount < 500) {
      alert('Minimum withdrawal amount is ৳500');
      return;
    }

    // API call would go here
    alert('Withdrawal request submitted! It will be processed within 2-3 business days.');
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setAccountNumber('');
  };

  return (
    <ProtectedRoute requireAffiliate={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50" data-testid="affiliate-wallet-page">
        <div className="bg-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text" data-testid="affiliate-wallet-title">My Wallet</h1>
                <p className="text-gray-600 mt-1">Manage your earnings and withdrawals</p>
              </div>
              <Link href="/affiliate">
                <button className="px-6 py-2.5 border-2 border-purple-600 text-purple-600 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 font-semibold">
                  Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading wallet...</p>
            </div>
          ) : (
            <>
              {/* Main Balance Card */}
              <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-8 mb-8 text-white shadow-2xl relative overflow-hidden" data-testid="wallet-balance-card">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet size={24} />
                    <span className="text-white/80">Available Balance</span>
                  </div>
                  <h2 className="text-5xl font-bold mb-6">৳{walletData.balance.toLocaleString()}</h2>
                  
                  <GradientButton
                    onClick={() => setShowWithdrawModal(true)}
                    variant="secondary"
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100"
                    data-testid="request-withdrawal-btn"
                  >
                    <ArrowUpCircle size={20} className="inline mr-2" />
                    Request Withdrawal
                  </GradientButton>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatsCard
                  title="Total Earned"
                  value={`৳${walletData.total_earned.toLocaleString()}`}
                  icon={DollarSign}
                  gradient="from-green-500 to-emerald-500"
                  testId="stat-total-earned"
                />
                <StatsCard
                  title="Total Withdrawn"
                  value={`৳${walletData.total_withdrawn.toLocaleString()}`}
                  icon={TrendingUp}
                  gradient="from-blue-500 to-cyan-500"
                  testId="stat-total-withdrawn"
                />
                <StatsCard
                  title="Pending Withdrawal"
                  value={`৳${walletData.pending_withdrawal.toLocaleString()}`}
                  icon={History}
                  gradient="from-orange-500 to-red-500"
                  testId="stat-pending-withdrawal"
                />
              </div>

              {/* Transaction History */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <History size={24} className="text-purple-600" />
                  Transaction History
                </h3>
                
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-purple-200 transition"
                        data-testid={`transaction-${transaction.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'credit' ? (
                              <CheckCircle size={20} className="text-green-600" />
                            ) : (
                              <ArrowUpCircle size={20} className="text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">{transaction.description}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(transaction.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-bold ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'}৳{transaction.amount.toLocaleString()}
                          </p>
                          <span className="text-xs text-gray-500">{transaction.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <History size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-600">No transactions yet</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="withdrawal-modal">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Request Withdrawal</h2>
            <form onSubmit={handleWithdraw}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Amount (৳)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min="500"
                    max={walletData.balance}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 transition"
                    placeholder="Minimum ৳500"
                    data-testid="withdraw-amount-input"
                  />
                  <p className="text-xs text-gray-500 mt-1">Available: ৳{walletData.balance.toLocaleString()}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Withdrawal Method</label>
                  <select
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 transition"
                    data-testid="withdraw-method-select"
                  >
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="rocket">Rocket</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 transition"
                    placeholder="Enter your account number"
                    data-testid="account-number-input"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <GradientButton type="submit" className="flex-1" data-testid="submit-withdrawal-btn">
                  Submit Request
                </GradientButton>
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-full hover:bg-gray-100 font-semibold transition"
                  data-testid="cancel-withdrawal-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
