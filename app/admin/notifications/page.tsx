"use client";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { ApiService } from "@/lib/api";
import { Bell, Send, Users, MessageSquare } from "lucide-react";

export default function AdminNotificationsPage() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', type: 'broadcast' });

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      if (!token) return;
      const response = await ApiService.notifications.getMy(token);
      const notifList = (response as any).results || (response as any).data || response || [];
      setNotifications(notifList.slice(0, 20));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async () => {
    if (!token || !formData.title || !formData.message) {
      alert('Please fill in all fields');
      return;
    }
    setSending(true);
    try {
      await ApiService.notifications.admin.broadcast({
        title: formData.title,
        message: formData.message,
      }, token);
      alert('Notification sent successfully!');
      setFormData({ title: '', message: '', type: 'broadcast' });
      fetchNotifications();
    } catch (error: any) {
      alert('Failed to send notification: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50 py-8" data-testid="admin-notifications-page">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Send Notification Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Send className="text-purple-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">Send Notification</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600"
                    >
                      <option value="broadcast">Broadcast to All</option>
                      <option value="specific">Specific User</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      placeholder="Notification title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600"
                      data-testid="notification-title-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <textarea
                      placeholder="Notification message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600"
                      data-testid="notification-message-input"
                    />
                  </div>

                  <button
                    onClick={handleBroadcast}
                    disabled={sending}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                    data-testid="send-notification-btn"
                  >
                    <Send size={20} />
                    {sending ? 'Sending...' : 'Send Notification'}
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Bell className="text-blue-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold" data-testid="notifications-list-title">Recent Notifications</h2>
                </div>

                {loading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="border-2 rounded-lg p-4 hover:bg-gray-50 transition" data-testid={`notification-item-${notif.id}`}>
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <MessageSquare className="text-purple-600" size={20} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{notif.title}</h3>
                            <p className="text-gray-600 mb-2">{notif.message}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{new Date(notif.created_at).toLocaleDateString()}</span>
                              {notif.is_read && <span className="px-2 py-1 bg-green-100 text-green-600 rounded">Read</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Bell size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No notifications sent yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
