"use client";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { ApiService } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, ExternalLink, Plus } from "lucide-react";

interface AffiliateLink {
  id: string;
  product?: {
    title: string;
    slug: string;
  };
  tracking_code: string;
  url: string;
  clicks: number;
  conversions: number;
  created_at: string;
}

export default function AffiliateLinksPage() {
  const { token } = useAuth();
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchLinks();
    }
  }, [token]);

  const fetchLinks = async () => {
    try {
      if (!token) return;
      const response: any = await ApiService.affiliate.getLinks(token);
      const linksData = response.results || response.data || response || [];
      setLinks(linksData);
    } catch (error) {
      console.error("Failed to fetch links:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Link copied to clipboard!");
  };

  return (
    <ProtectedRoute requireAffiliate={true}>
      <div className="min-h-screen bg-gray-50" data-testid="affiliate-links-page">
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold" data-testid="affiliate-links-title">My Affiliate Links</h1>
              <div className="flex gap-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700" data-testid="generate-link-btn">
                  <Plus size={20} />
                  Generate Link
                </button>
                <Link href="/affiliate">
                  <button className="px-4 py-2 border rounded hover:bg-gray-50">
                    Back to Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : links.length > 0 ? (
            <div className="grid gap-4">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                  data-testid={`affiliate-link-${link.id}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">
                        {link.product?.title || "General Link"}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Code: {link.tracking_code}
                      </p>
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <input
                          type="text"
                          value={link.url}
                          readOnly
                          className="flex-1 bg-transparent text-sm"
                        />
                        <button
                          onClick={() => copyToClipboard(link.url)}
                          className="text-blue-600 hover:text-blue-700"
                          data-testid={`copy-link-${link.id}`}
                        >
                          <Copy size={18} />
                        </button>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink size={18} />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Clicks</p>
                      <p className="text-xl font-bold">{link.clicks || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Conversions</p>
                      <p className="text-xl font-bold text-green-600">
                        {link.conversions || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Conversion Rate</p>
                      <p className="text-xl font-bold">
                        {link.clicks
                          ? ((link.conversions / link.clicks) * 100).toFixed(1)
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600 mb-4">No affiliate links yet.</p>
              <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
                Generate Your First Link
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
