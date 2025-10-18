"use client";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { ApiService } from "@/lib/api";
import { BarChart3, TrendingUp, Users, DollarSign, Package, Download } from "lucide-react";

export default function AdminReportsPage() {
  const { token } = useAuth();
  const [reportType, setReportType] = useState('sales');
  const [salesData, setSalesData] = useState<any>(null);
  const [productData, setProductData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchReport(reportType);
    }
  }, [token, reportType]);

  const fetchReport = async (type: string) => {
    setLoading(true);
    try {
      if (!token) return;
      
      switch (type) {
        case 'sales':
          const sales = await ApiService.adminPanel.reports.sales(token);
          setSalesData(sales);
          break;
        case 'products':
          const products = await ApiService.adminPanel.reports.productPerformance(token);
          setProductData(products);
          break;
        case 'customers':
          const customers = await ApiService.adminPanel.reports.customerAnalytics(token);
          setCustomerData(customers);
          break;
      }
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50 py-8" data-testid="admin-reports-page">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BarChart3 className="text-green-600" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold" data-testid="admin-reports-title">Reports & Analytics</h1>
                  <p className="text-gray-600">View detailed business insights</p>
                </div>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2">
                <Download size={20} />
                Export Report
              </button>
            </div>

            {/* Report Type Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => setReportType('sales')}
                className={`p-6 rounded-xl border-2 transition ${
                  reportType === 'sales'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className={reportType === 'sales' ? 'text-green-600' : 'text-gray-400'} size={24} />
                  <h3 className="font-bold text-lg">Sales Report</h3>
                </div>
                <p className="text-sm text-gray-600">Revenue, orders, and trends</p>
              </button>

              <button
                onClick={() => setReportType('products')}
                className={`p-6 rounded-xl border-2 transition ${
                  reportType === 'products'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Package className={reportType === 'products' ? 'text-blue-600' : 'text-gray-400'} size={24} />
                  <h3 className="font-bold text-lg">Product Performance</h3>
                </div>
                <p className="text-sm text-gray-600">Best sellers and inventory</p>
              </button>

              <button
                onClick={() => setReportType('customers')}
                className={`p-6 rounded-xl border-2 transition ${
                  reportType === 'customers'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Users className={reportType === 'customers' ? 'text-purple-600' : 'text-gray-400'} size={24} />
                  <h3 className="font-bold text-lg">Customer Analytics</h3>
                </div>
                <p className="text-sm text-gray-600">Demographics and behavior</p>
              </button>
            </div>

            {/* Report Content */}
            <div className="border-t-2 pt-8">
              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading report data...</p>
                </div>
              ) : (
                <div>
                  {reportType === 'sales' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Sales Report</h2>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-green-50 rounded-xl p-6">
                          <p className="text-gray-600 mb-2">Total Revenue</p>
                          <p className="text-3xl font-bold text-green-600">৳{salesData?.total_revenue || 0}</p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-6">
                          <p className="text-gray-600 mb-2">Total Orders</p>
                          <p className="text-3xl font-bold text-blue-600">{salesData?.total_orders || 0}</p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-6">
                          <p className="text-gray-600 mb-2">Average Order Value</p>
                          <p className="text-3xl font-bold text-purple-600">৳{salesData?.avg_order_value || 0}</p>
                        </div>
                        <div className="bg-pink-50 rounded-xl p-6">
                          <p className="text-gray-600 mb-2">Growth Rate</p>
                          <p className="text-3xl font-bold text-pink-600">{salesData?.growth_rate || 0}%</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-8 text-center">
                        <TrendingUp size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Detailed sales charts will be displayed here</p>
                      </div>
                    </div>
                  )}

                  {reportType === 'products' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Product Performance</h2>
                      <div className="bg-gray-50 rounded-xl p-8 text-center">
                        <Package size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Product analytics will be displayed here</p>
                      </div>
                    </div>
                  )}

                  {reportType === 'customers' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Customer Analytics</h2>
                      <div className="bg-gray-50 rounded-xl p-8 text-center">
                        <Users size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Customer insights will be displayed here</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
