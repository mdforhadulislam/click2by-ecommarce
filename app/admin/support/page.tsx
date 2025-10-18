"use client";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { ApiService } from "@/lib/api";
import { Headphones, MessageCircle, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminSupportPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (token) {
      fetchTickets();
    }
  }, [token]);

  const fetchTickets = async () => {
    try {
      if (!token) return;
      const response = await ApiService.adminPanel.supportTickets.getAll(token);
      const ticketsList = (response as any).results || (response as any).data || response || [];
      setTickets(ticketsList);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!token || !selectedTicket || !replyText) return;
    try {
      await ApiService.adminPanel.supportTickets.createReply(selectedTicket.id, {
        message: replyText,
      }, token);
      setReplyText('');
      alert('Reply sent successfully!');
    } catch (error: any) {
      alert('Failed to send reply: ' + error.message);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'open':
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <AlertCircle className="text-red-500" size={20} />;
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50 py-8" data-testid="admin-support-page">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tickets List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Headphones className="text-orange-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">Support Tickets</h2>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-600 mx-auto"></div>
                  </div>
                ) : tickets.length > 0 ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                          selectedTicket?.id === ticket.id
                            ? 'border-orange-600 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                        data-testid={`ticket-item-${ticket.id}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm line-clamp-1">{ticket.subject || 'Support Request'}</h3>
                          {getStatusIcon(ticket.status)}
                        </div>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{ticket.message}</p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{ticket.user_name || 'User'}</span>
                          <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Headphones size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No tickets yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ticket Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                {selectedTicket ? (
                  <div>
                    <div className="flex items-center justify-between mb-6 pb-6 border-b-2">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{selectedTicket.subject || 'Support Request'}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>👤 {selectedTicket.user_name || 'User'}</span>
                          <span>📅 {new Date(selectedTicket.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        selectedTicket.status === 'resolved' || selectedTicket.status === 'closed'
                          ? 'bg-green-100 text-green-600'
                          : selectedTicket.status === 'open' || selectedTicket.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {selectedTicket.status}
                      </span>
                    </div>

                    {/* Message Thread */}
                    <div className="mb-6">
                      <div className="bg-gray-50 rounded-xl p-6 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            U
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold mb-1">{selectedTicket.user_name || 'User'}</p>
                            <p className="text-gray-700">{selectedTicket.message}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reply Box */}
                    <div className="border-t-2 pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <MessageCircle className="text-orange-600" size={20} />
                        <h3 className="font-bold">Send Reply</h3>
                      </div>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your response here..."
                        rows={5}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-600 mb-4"
                        data-testid="support-reply-input"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={handleReply}
                          className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                          data-testid="send-reply-btn"
                        >
                          Send Reply
                        </button>
                        <button
                          onClick={() => {
                            // Mark as resolved
                          }}
                          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                          Mark as Resolved
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Headphones size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Select a ticket to view details</p>
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
