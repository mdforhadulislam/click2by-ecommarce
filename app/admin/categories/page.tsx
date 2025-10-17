"use client";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { ApiService } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react";
import GradientButton from "@/components/ui/GradientButton";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  product_count?: number;
}

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token]);

  const fetchCategories = async () => {
    try {
      if (!token) return;
      const response: any = await ApiService.categories.admin.getAll(token);
      const categoriesData = response.results || response.data || response || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingCategory) {
        await ApiService.categories.admin.update(editingCategory.id, formData, token);
      } else {
        await ApiService.categories.admin.create(formData, token);
      }
      fetchCategories();
      setShowModal(false);
      setFormData({ name: '', slug: '', description: '' });
      setEditingCategory(null);
    } catch (error) {
      console.error("Failed to save category:", error);
      alert("Failed to save category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm("Are you sure you want to delete this category?")) return;

    try {
      await ApiService.categories.admin.delete(id, token);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category");
    }
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setShowModal(true);
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" data-testid="admin-categories-page">
        <div className="bg-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text" data-testid="admin-categories-title">Category Management</h1>
                <p className="text-gray-600 mt-1">Organize your product categories</p>
              </div>
              <div className="flex gap-3">
                <GradientButton
                  onClick={() => {
                    setEditingCategory(null);
                    setFormData({ name: '', slug: '', description: '' });
                    setShowModal(true);
                  }}
                  size="md"
                  variant="primary"
                  data-testid="add-category-btn"
                >
                  <Plus size={20} className="inline mr-2" />
                  Add Category
                </GradientButton>
                <Link href="/admin">
                  <button className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 font-semibold">
                    Back to Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading...</p>
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-200 group"
                  data-testid={`category-${category.id}`}
                >
                  <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                    ) : (
                      <FolderOpen size={48} className="text-white" />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {category.description || 'No description'}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-gray-500">
                        {category.product_count || 0} products
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          data-testid={`edit-category-${category.id}`}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          data-testid={`delete-category-${category.id}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <FolderOpen size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-xl text-gray-600 font-semibold">No categories found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="category-modal">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 gradient-text">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Category Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 transition"
                    placeholder="e.g., Electronics"
                    data-testid="category-name-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 transition"
                    placeholder="e.g., electronics"
                    data-testid="category-slug-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 transition"
                    rows={3}
                    placeholder="Category description..."
                    data-testid="category-description-input"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <GradientButton type="submit" className="flex-1" data-testid="save-category-btn">
                  {editingCategory ? 'Update' : 'Create'} Category
                </GradientButton>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-full hover:bg-gray-100 font-semibold transition"
                  data-testid="cancel-category-btn"
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
