"use client";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { ApiService } from "@/lib/api";
import { Tag, Plus, Edit2, Trash2, Save, X } from "lucide-react";

export default function AdminTagsPage() {
  const { token } = useAuth();
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({ name: '', color: '#8B5CF6' });

  useEffect(() => {
    if (token) {
      fetchTags();
    }
  }, [token]);

  const fetchTags = async () => {
    try {
      if (!token) return;
      const response = await ApiService.variations.tags.getAll(token);
      const tagsList = (response as any).results || (response as any).data || response || [];
      setTags(tagsList);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!token || !formData.name) return;
    try {
      await ApiService.variations.tags.create(formData, token);
      setFormData({ name: '', color: '#8B5CF6' });
      setCreating(false);
      fetchTags();
    } catch (error: any) {
      alert('Failed to create tag: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Delete this tag?')) return;
    try {
      await ApiService.variations.tags.delete(id, token);
      fetchTags();
    } catch (error: any) {
      alert('Failed to delete tag: ' + error.message);
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50 py-8" data-testid="admin-tags-page">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Tag className="text-purple-600" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold" data-testid="admin-tags-title">Tags Management</h1>
                  <p className="text-gray-600">Manage product tags</p>
                </div>
              </div>
              <button
                onClick={() => setCreating(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
                data-testid="create-tag-btn"
              >
                <Plus size={20} />
                Add Tag
              </button>
            </div>

            {/* Create Form */}
            {creating && (
              <div className="mb-6 p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                <h3 className="font-bold text-lg mb-4">Create New Tag</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Tag name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleCreate} className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2">
                      <Save size={16} />
                      Save
                    </button>
                    <button onClick={() => setCreating(false)} className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tags.length > 0 ? tags.map((tag) => (
                  <div key={tag.id} className="border-2 rounded-lg p-4 hover:shadow-lg transition" data-testid={`tag-item-${tag.id}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: tag.color || '#8B5CF6' }}></div>
                        <span className="font-semibold text-lg">{tag.name || tag.tag}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(tag.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-12">
                    <Tag size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No tags found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
