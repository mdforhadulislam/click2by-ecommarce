"use client";
import { useEffect, useState } from "react";
import { ApiService } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  base_price: string;
  discount_price: string;
  images: { id: string; name: string; image: string }[];
  categories: { id: string; name: string; slug: string }[];
  color_variations?: { id: string; color: string }[];
  size_variations?: { id: string; size: string }[];
  quantity_variations?: { id: string; stock: number }[];
  quality_variations?: { id: string; quality: string }[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response: any = await ApiService.products.getAll();
      console.log("API Response:", response);

      // Ensure consistent array structure
      const dataArray = Array.isArray(response.results)
        ? response.results
        : Array.isArray(response)
        ? response
        : [response];

      // Transform the product data for UI
      const transformed = dataArray.map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        base_price: item.base_price,
        discount_price: item.discount_price,
        images: item.images || [],
        categories: item.categories || [],
        color_variations: item.color_variations || [],
        size_variations: item.size_variations || [],
        quantity_variations: item.quantity_variations || [],
        quality_variations: item.quality_variations || [],
      }));

      setProducts(transformed);
    } catch (error) {
      console.error("❌ Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      product_id: product.id,
      title: product.name,
      slug: product.slug,
      price: Number(product.discount_price || product.base_price),
      quantity: 1,
      image: product.images?.[0]?.image,
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8"
      data-testid="products-page"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-6 py-2 bg-purple-100 text-purple-600 rounded-full font-semibold mb-4">
            🛍️ SHOP NOW
          </span>
          <h1
            className="text-5xl font-bold gradient-text mb-4"
            data-testid="products-page-title"
          >
            All Products
          </h1>
          <p className="text-gray-600 text-lg">
            Discover amazing products at great prices
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-4 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 transition text-lg"
                  data-testid="product-search-input"
                />
              </div>
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300">
                <SlidersHorizontal size={20} />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Loading / Products */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-purple-600 mx-auto"></div>
            <p className="mt-6 text-gray-600 font-medium text-lg">
              Loading products...
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-bold text-purple-600">
                  {filteredProducts.length}
                </span>{" "}
                products found
              </p>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              data-testid="all-products-grid"
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.name}
                    slug={product.slug}
                    price={Number(product.discount_price || product.base_price)}
                    description={product.description}
                    image={product.images?.[0]?.image}
                    category={product.categories?.[0]?.name}
                    onAddToCart={() => handleAddToCart(product)}
                    testId={`product-item-${product.id}`}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-lg">
                  <div className="text-8xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-600 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
