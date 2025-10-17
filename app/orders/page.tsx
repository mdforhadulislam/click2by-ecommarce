"use client";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { ApiService } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Truck, CheckCircle, Clock, Eye, ShoppingBag } from "lucide-react";

interface Order {
  id: string;
  order_number?: string;
  items: any[];
  total_amount: number;
  status: string;
  shipping_address: any;
  created_at: string;
  tracking_number?: string;
}

export default function MyOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
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
      const ordersData = response.results || response.data || response || [];
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: any = {
      pending: {
        color: 'from-yellow-500 to-orange-500',
        icon: <Clock size={20} />,
        text: 'Order Placed',
        description: 'Your order is being processed',
      },
      processing: {
        color: 'from-blue-500 to-cyan-500',
        icon: <Package size={20} />,
        text: 'Processing',
        description: 'We are preparing your order',
      },
      shipped: {
        color: 'from-purple-500 to-pink-500',
        icon: <Truck size={20} />,
        text: 'Shipped',
        description: 'Your order is on the way',
      },
      delivered: {
        color: 'from-green-500 to-emerald-500',
        icon: <CheckCircle size={20} />,
        text: 'Delivered',
        description: 'Order delivered successfully',
      },
    };
    return configs[status] || configs.pending;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8" data-testid="my-orders-page">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2" data-testid="my-orders-title">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading orders...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-200"
                    data-testid={`order-${order.id}`}
                  >
                    {/* Header with Gradient */}
                    <div className={`bg-gradient-to-r ${statusConfig.color} p-6 text-white`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {statusConfig.icon}
                          <div>
                            <h3 className="text-xl font-bold">
                              Order #{order.order_number || order.id.slice(0, 8)}
                            </h3>
                            <p className="text-sm text-white/80">{statusConfig.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">৳{order.total_amount?.toLocaleString()}</p>
                          <p className="text-sm text-white/80">{order.items?.length} items</p>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                      {/* Progress Tracker */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between relative">
                          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                            <div
                              className={`h-full bg-gradient-to-r ${statusConfig.color} transition-all duration-500`}
                              style={{
                                width:
                                  order.status === 'pending'
                                    ? '25%'
                                    : order.status === 'processing'
                                    ? '50%'
                                    : order.status === 'shipped'
                                    ? '75%'
                                    : '100%',
                              }}
                            />
                          </div>

                          {['pending', 'processing', 'shipped', 'delivered'].map((step, idx) => {
                            const stepConfig = getStatusConfig(step);
                            const isCompleted =
                              ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= idx;
                            return (
                              <div key={step} className="relative z-10 flex flex-col items-center">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isCompleted
                                      ? `bg-gradient-to-r ${stepConfig.color} text-white shadow-lg`
                                      : 'bg-gray-200 text-gray-400'
                                  }`}
                                >
                                  {stepConfig.icon}
                                </div>
                                <p className="text-xs mt-2 font-semibold text-gray-600">
                                  {stepConfig.text}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-3 text-gray-700">Order Items</h4>
                        <div className="space-y-2">
                          {order.items?.map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                            >
                              <div className="flex items-center gap-3">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                )}
                                <div>
                                  <p className="font-semibold text-sm">{item.product?.title || item.title}</p>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="font-bold">৳{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Info */}
                      {order.shipping_address && (
                        <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                          <h4 className="font-semibold mb-2 text-gray-700">Shipping Address</h4>
                          <p className="text-sm text-gray-600">
                            {order.shipping_address.address}, {order.shipping_address.city},{' '}
                            {order.shipping_address.zip}
                          </p>
                        </div>
                      )}

                      {order.tracking_number && (
                        <div className="mb-4 p-4 bg-purple-50 rounded-xl">
                          <h4 className="font-semibold mb-2 text-gray-700">Tracking Number</h4>
                          <p className="text-sm font-mono text-purple-600">{order.tracking_number}</p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          <p>Ordered on {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <Link href={`/orders/${order.id}`}>
                          <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2" data-testid={`view-order-details-${order.id}`}>
                            <Eye size={18} />
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
              <Link href="/products">
                <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300">
                  Start Shopping
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
