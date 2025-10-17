"use client";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { ApiService } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Search } from "lucide-react";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  description: string;
  image?: string;
  category?: any;
}

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const fetchProducts = async () => {
    try {
      if (!token) return;
      const response: any = await ApiService.products.admin.getAll(token);
      const productsData = response.results || response.data || response || [];
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm("Are you sure you want to delete this product?")) return;

    try {
      await ApiService.products.admin.delete(id, token);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50" data-testid="admin-products-page">
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold" data-testid="admin-products-title">Manage Products</h1>
              <div className="flex gap-2">
                <Link href="/admin/products/create">
                  <button className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-700" data-testid="create-product-btn">
                    <Plus size={20} />
                    Add Product
                  </button>
                </Link>
                <Link href="/admin">
                  <button className="px-4 py-2 border rounded hover:bg-gray-50">
                    Back to Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
              data-testid="admin-product-search"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50" data-testid={`product-row-${product.id}`}>
                        <td className="px-6 py-4">
                          <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium">{product.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {product.description}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-semibold">৳{product.price}</td>
                        <td className="px-6 py-4">
                          {product.category?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-end">
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" data-testid={`edit-product-${product.id}`}>
                                <Edit size={18} />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              data-testid={`delete-product-${product.id}`}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
