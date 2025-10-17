"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ApiService } from "@/lib/api";
import { ShoppingCart, TrendingUp, Star, Sparkles, Zap, Award } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ui/ProductCard";
import GradientButton from "@/components/ui/GradientButton";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  description: string;
  image?: string;
  category?: {
    name: string;
    slug: string;
  };
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response: any = await ApiService.products.getAll();
      const productsData = response.results || response.data || response || [];
      setProducts(productsData.slice(0, 8));
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      product_id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section with Animated Gradient */}
      <section className="animated-gradient text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block animate-bounce mb-4">
            <Sparkles size={48} className="text-yellow-300" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in" data-testid="hero-title">
            Welcome to <span className="inline-block hover:scale-110 transition-transform">Bazaarfly</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90 font-light">
            🚀 Your Smart Shopping Destination - Fashion, Electronics, Lifestyle & More
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products">
              <GradientButton size="lg" data-testid="shop-now-btn">
                <ShoppingCart size={20} className="inline mr-2" />
                Shop Now
              </GradientButton>
            </Link>
            <Link href="/affiliate">
              <button className="px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white/50 text-white rounded-full font-semibold hover:bg-white/30 transition-all duration-300 text-lg">
                💰 Become an Affiliate
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section with Glass Effect */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-2xl text-center hover:scale-105 transition-transform duration-300 bg-white/80">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-6 hover:rotate-12 transition-transform">
                <ShoppingCart className="text-white" size={36} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Easy Shopping</h3>
              <p className="text-gray-600 leading-relaxed">Browse thousands of products with our intuitive interface</p>
            </div>
            
            <div className="glass p-8 rounded-2xl text-center hover:scale-105 transition-transform duration-300 bg-white/80">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg -rotate-6 hover:-rotate-12 transition-transform">
                <Zap className="text-white" size={36} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">Quick checkout and instant order confirmation</p>
            </div>
            
            <div className="glass p-8 rounded-2xl text-center hover:scale-105 transition-transform duration-300 bg-white/80">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-6 hover:rotate-12 transition-transform">
                <Award className="text-white" size={36} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Quality Guaranteed</h3>
              <p className="text-gray-600 leading-relaxed">100% authentic products from verified sellers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-6 py-2 bg-purple-100 text-purple-600 rounded-full font-semibold mb-4">
              ⭐ FEATURED COLLECTION
            </span>
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4" data-testid="featured-products-title">
              Trending Products
            </h2>
            <p className="text-gray-600 text-lg">Discover our most popular items</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-purple-600 mx-auto"></div>
              <p className="mt-6 text-gray-600 font-medium text-lg">Loading amazing products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-testid="products-grid">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    slug={product.slug}
                    price={product.price}
                    description={product.description}
                    image={product.image}
                    category={product.category?.name}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="text-8xl mb-4">🛍️</div>
                  <p className="text-xl text-gray-600 font-semibold">No products available at the moment.</p>
                  <p className="text-gray-500 mt-2">Check back soon for amazing deals!</p>
                </div>
              )}
            </div>
          )}

          {products.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/products">
                <GradientButton size="lg">
                  View All Products →
                </GradientButton>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-5xl font-bold mb-2">10K+</h3>
              <p className="text-white/80">Happy Customers</p>
            </div>
            <div>
              <h3 className="text-5xl font-bold mb-2">5K+</h3>
              <p className="text-white/80">Products</p>
            </div>
            <div>
              <h3 className="text-5xl font-bold mb-2">50+</h3>
              <p className="text-white/80">Categories</p>
            </div>
            <div>
              <h3 className="text-5xl font-bold mb-2">24/7</h3>
              <p className="text-white/80">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-full mb-6">
              <TrendingUp size={48} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Affiliate Program
            </h2>
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Earn up to 15% commission by promoting our products. Join thousands of successful affiliates today!
            </p>
            <Link href="/affiliate">
              <GradientButton size="lg" variant="secondary">
                <Star size={20} className="inline mr-2" />
                Start Earning Now
              </GradientButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

