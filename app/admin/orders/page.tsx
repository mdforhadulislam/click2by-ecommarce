"use client";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { ApiService } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Clock, CheckCircle, XCircle, Truck, Eye } from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";

interface Order {
  id: string;
  order_number?: string;
  customer: any;
  items: any[];
  total_amount: number;
  status: string;
  shipping_address: any;
  created_at: string;
  updated_at: string;
}

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      if (!token) return;
      const response: any = await ApiService.orders.admin.getAll(token);
      const ordersData = response.results || response.data || response || [];
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!token) return;
    try {
      await ApiService.orders.admin.update(orderId, { status: newStatus }, token);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'processing': return <Package size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'delivered': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50" data-testid="admin-orders-page">
        {/* Header */}
        <div className="bg-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text" data-testid="admin-orders-title">Order Management</h1>
                <p className="text-gray-600 mt-1">Monitor and manage all customer orders</p>
              </div>
              <Link href="/admin">
                <button className="px-6 py-2.5 border-2 border-purple-600 text-purple-600 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 font-semibold">
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
              title="Total Orders"
              value={stats.total}
              icon={Package}
              gradient="from-purple-500 to-pink-500"
              testId="stat-total-orders"
            />
            <StatsCard
              title="Pending"
              value={stats.pending}
              icon={Clock}
              gradient="from-yellow-500 to-orange-500"
              testId="stat-pending-orders"
            />
            <StatsCard
              title="Processing"
              value={stats.processing}
              icon={Package}
              gradient="from-blue-500 to-cyan-500"
              testId="stat-processing-orders"
            />
            <StatsCard
              title="Delivered"
              value={stats.delivered}
              icon={CheckCircle}
              gradient="from-green-500 to-emerald-500"
              testId="stat-delivered-orders"
            />
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  filter === status
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
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
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading orders...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-200"
                  data-testid={`order-${order.id}`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            Order #{order.order_number || order.id.slice(0, 8)}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><span className="font-semibold">Customer:</span> {order.customer?.name || 'N/A'}</p>
                          <p><span className="font-semibold">Email:</span> {order.customer?.email || 'N/A'}</p>
                          <p><span className="font-semibold">Date:</span> {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ৳{order.total_amount?.toLocaleString() || 0}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{order.items?.length || 0} items</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold mb-2 text-gray-700">Order Items:</h4>
                      <div className="space-y-2">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.product?.title || item.title || 'Product'} x {item.quantity}</span>
                            <span className="font-semibold">৳{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shipping_address && (
                      <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                        <h4 className="font-semibold mb-2 text-gray-700">Shipping Address:</h4>
                        <p className="text-sm text-gray-600">
                          {order.shipping_address.address}, {order.shipping_address.city}, {order.shipping_address.zip}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Link href={`/admin/orders/${order.id}`} className="flex-1">
                        <button className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2" data-testid={`view-order-${order.id}`}>
                          <Eye size={18} />
                          View Details
                        </button>
                      </Link>
                      
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                          data-testid={`process-order-${order.id}`}
                        >
                          Mark as Processing
                        </button>
                      )}
                      
                      {order.status === 'processing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                          data-testid={`ship-order-${order.id}`}
                        >
                          Mark as Shipped
                        </button>
                      )}
                      
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                          data-testid={`deliver-order-${order.id}`}
                        >
                          Mark as Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-xl text-gray-600 font-semibold">No {filter !== 'all' ? filter : ''} orders found.</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
