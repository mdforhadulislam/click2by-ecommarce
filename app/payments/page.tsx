"use client";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { useEffect, useState } from "react";
import { ApiService } from "@/lib/api";
import { CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";

export default function PaymentsPage() {
  const { token } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchPayments();
    }
  }, [token]);

  const fetchPayments = async () => {
    try {
      if (!token) return;
      const response: any = await ApiService.payments.getMy(token);
      const paymentsList = response.results || response.data || response || [];
      setPayments(paymentsList);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'failed':
        return <XCircle className="text-red-500" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8" data-testid="payments-page">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <CreditCard className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold" data-testid="payments-page-title">Payment History</h1>
                <p className="text-gray-600">View all your transactions</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading payments...</p>
              </div>
            ) : payments.length > 0 ? (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="border rounded-xl p-6 hover:shadow-lg transition" data-testid={`payment-item-${payment.id}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          {getStatusIcon(payment.status)}
                        </div>
                        <div>
                          <p className="font-semibold text-lg">Payment #{payment.id?.slice(0, 8)}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(payment.created_at || payment.payment_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                          <p className="text-sm text-gray-500">Method: {payment.payment_method || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">৳{payment.amount}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'completed' || payment.status === 'success' ? 'bg-green-100 text-green-600' :
                          payment.status === 'failed' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                    {payment.transaction_id && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600">Transaction ID: <span className="font-mono text-gray-800">{payment.transaction_id}</span></p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <CreditCard size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No payments yet</h3>
                <p className="text-gray-500">Your payment history will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
