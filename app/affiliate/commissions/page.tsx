"use client";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { ApiService } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DollarSign, TrendingUp, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";

interface Commission {
  id: string;
  order: any;
  amount: number;
  status: string;
  commission_rate: number;
  created_at: string;
  paid_at?: string;
}

export default function AffiliateCommissionsPage() {
  const { token } = useAuth();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (token) {
      fetchCommissions();
    }
  }, [token]);

  const fetchCommissions = async () => {
    try {
      if (!token) return;
      const response: any = await ApiService.affiliate.getCommissions(token);
      const commissionsData = response.results || response.data || response || [];
      setCommissions(commissionsData);
    } catch (error) {
      console.error("Failed to fetch commissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-yellow-600" />;
      case 'approved': return <CheckCircle size={16} className="text-green-600" />;
      case 'paid': return <CheckCircle size={16} className="text-blue-600" />;
      case 'rejected': return <XCircle size={16} className="text-red-600" />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      paid: 'bg-blue-100 text-blue-800 border-blue-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredCommissions = filter === 'all'
    ? commissions
    : commissions.filter(c => c.status === filter);

  const stats = {
    total: commissions.reduce((sum, c) => sum + c.amount, 0),
    pending: commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0),
    approved: commissions.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.amount, 0),
    paid: commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0),
  };

  return (
    <ProtectedRoute requireAffiliate={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50" data-testid="affiliate-commissions-page">
        <div className="bg-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text" data-testid="affiliate-commissions-title">Commission History</h1>
                <p className="text-gray-600 mt-1">Track your earnings and commission status</p>
              </div>
              <Link href="/affiliate">
                <button className="px-6 py-2.5 border-2 border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 font-semibold">
                  Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Earned"
              value={`৳${stats.total.toLocaleString()}`}
              icon={DollarSign}
              gradient="from-green-500 to-emerald-500"
              testId="stat-total-earned"
            />
            <StatsCard
              title="Pending"
              value={`৳${stats.pending.toLocaleString()}`}
              icon={Clock}
              gradient="from-yellow-500 to-orange-500"
              testId="stat-pending-commissions"
            />
            <StatsCard
              title="Approved"
              value={`৳${stats.approved.toLocaleString()}`}
              icon={CheckCircle}
              gradient="from-blue-500 to-cyan-500"
              testId="stat-approved-commissions"
            />
            <StatsCard
              title="Paid Out"
              value={`৳${stats.paid.toLocaleString()}`}
              icon={TrendingUp}
              gradient="from-purple-500 to-pink-500"
              testId="stat-paid-commissions"
            />
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'paid', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  filter === status
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                }`}
                data-testid={`filter-${status}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading commissions...</p>
            </div>
          ) : filteredCommissions.length > 0 ? (
            <div className="space-y-4">
              {filteredCommissions.map((commission) => (
                <div
                  key={commission.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-green-200"
                  data-testid={`commission-${commission.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(commission.status)}`}>
                          {getStatusIcon(commission.status)}
                          {commission.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(commission.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">
                          <span className="font-semibold">Order ID:</span> #{commission.order?.order_number || commission.order?.id?.slice(0, 8) || 'N/A'}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Commission Rate:</span> {commission.commission_rate || 10}%
                        </p>
                        {commission.paid_at && (
                          <p className="text-gray-600">
                            <span className="font-semibold">Paid on:</span> {new Date(commission.paid_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ৳{commission.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Commission</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <DollarSign size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-xl text-gray-600 font-semibold">No {filter !== 'all' ? filter : ''} commissions found.</p>
              <p className="text-gray-500 mt-2">Start promoting products to earn commissions!</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
