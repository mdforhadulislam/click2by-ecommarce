"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ApiService } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import {
  ShoppingCart,
  Star,
  Heart,
  Share2,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import GradientButton from "@/components/ui/GradientButton";

interface ImageType {
  id: string;
  name: string;
  image: string;
}

interface CategoryType {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  base_price: string;
  discount_price: string;
  categories: CategoryType[];
  color_variations: { id: string; color: string }[];
  size_variations: { id: string; size: string }[];
  quantity_variations: { id: string; stock: number }[];
  quality_variations: { id: string; quality: string }[];
  images: ImageType[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (params?.slug) {
      fetchProduct(params.slug as string);
    }
  }, [params]);

  const fetchProduct = async (slug: string) => {
    try {
      const response: any = await ApiService.products.getBySlug(slug);
      const productData = response?.data || response;
      setProduct(productData);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      product_id: product.id,
      title: product.name,
      slug: product.slug,
      price: Number(product.discount_price || product.base_price),
      quantity,
      image: product.images?.[0]?.image,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            Product not found
          </h2>
          <Link href="/products">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold">
              Back to Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-purple-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-purple-600">
            Products
          </Link>
          <span>/</span>
          <span className="text-purple-600 font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-xl">
              {product.images.length ? (
                <img
                  src={product.images[selectedImage].image}
                  alt={product.images[selectedImage].name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  📦
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-3 transition-all duration-200 ${
                      selectedImage === idx
                        ? "border-purple-600 scale-105"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img.image}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {product.categories.length > 0 && (
              <span className="inline-block px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-4">
                {product.categories[0].name}
              </span>
            )}

            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  (4.8 / 156 reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ৳{Number(product.discount_price || product.base_price).toLocaleString()}
              </span>
              {product.discount_price && (
                <span className="text-lg text-gray-500 line-through ml-4">
                  ৳{Number(product.base_price).toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

            {/* Variations */}
            {product.color_variations.length > 0 && (
              <div className="mb-4">
                <label className="font-semibold">Colors:</label>
                <div className="flex gap-2 mt-2">
                  {product.color_variations.map((color) => (
                    <span
                      key={color.id}
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: color.color }}
                    ></span>
                  ))}
                </div>
              </div>
            )}

            {product.size_variations.length > 0 && (
              <div className="mb-6">
                <label className="font-semibold">Sizes:</label>
                <div className="flex gap-2 mt-2">
                  {product.size_variations.map((size) => (
                    <span
                      key={size.id}
                      className="px-3 py-1 border rounded-lg text-sm"
                    >
                      {size.size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 font-bold"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 font-bold"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <GradientButton onClick={handleAddToCart} size="lg" className="flex-1">
                <ShoppingCart size={20} className="inline mr-2" />
                Add to Cart
              </GradientButton>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 rounded-xl border-2 transition ${
                  isFavorite
                    ? "bg-red-500 border-red-500 text-white"
                    : "border-gray-200 hover:border-red-500 hover:text-red-500"
                }`}
              >
                <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
              </button>

              <button className="p-3 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:text-purple-500 transition">
                <Share2 size={24} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <Feature icon={<Truck size={32} />} text="Free Delivery" />
              <Feature icon={<Shield size={32} />} text="Secure Payment" />
              <Feature icon={<RefreshCw size={32} />} text="Easy Returns" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto text-purple-600 mb-2">{icon}</div>
      <p className="text-xs font-semibold">{text}</p>
    </div>
  );
}
