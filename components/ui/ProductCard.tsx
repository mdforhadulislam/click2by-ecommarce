"use client";

import Link from "next/link";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name?: string;
  title?: string;
  slug: string;
  description?: string;
  base_price?: string;
  price?: number;
  discount_price?: string;
  categories?: { id: string; name: string }[];
  category?: string;
  images?: { id: string; image: string; name?: string }[];
  image?: string;
  onAddToCart: () => void;
  testId?: string;
}

export default function ProductCard({
  id,
  name,
  title,
  slug,
  description,
  base_price,
  price: priceNum,
  discount_price,
  categories,
  category: categoryStr,
  images,
  image: imageStr,
  onAddToCart,
  testId,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Handle both API formats
  const productName = name || title || 'Product';
  const mainImage = imageStr || (images && images.length > 0 ? images[0].image : null);
  const category = categoryStr || (categories && categories.length > 0 ? categories[0].name : null);
  const price = discount_price || base_price || (priceNum ? String(priceNum) : '0');

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={testId || `product-card-${id}`}
    >
      {/* Image Section */}
      <Link href={`/products/${slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
          {mainImage ? (
            <img
              src={mainImage}
              alt={productName}
              className={cn(
                "w-full h-full object-cover transition-transform duration-700",
                isHovered && "scale-110"
              )}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl">📦</div>
            </div>
          )}

          {/* Overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Action Buttons */}
          <div
            className={cn(
              "absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300",
              isHovered ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
            )}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsFavorite(!isFavorite);
              }}
              className={cn(
                "p-2 rounded-full backdrop-blur-md transition-colors",
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white"
              )}
            >
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
            </button>

            <Link
              href={`/products/${slug}`}
              className="p-2 bg-white/90 backdrop-blur-md rounded-full text-gray-700 hover:bg-purple-500 hover:text-white transition-colors"
            >
              <Eye size={18} />
            </Link>
          </div>

          {/* Category Badge */}
          {category && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-purple-600">
                {category}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5">
        <Link href={`/products/${slug}`}>
          <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-purple-600 transition-colors">
            {productName}
          </h3>
        </Link>

        {description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ৳{Number(price).toLocaleString()}
            </span>
            {discount_price && (
              <span className="ml-2 text-sm line-through text-gray-400">
                ৳{Number(base_price).toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={onAddToCart}
            className="group/btn relative px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
            data-testid={`add-to-cart-btn-${id}`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <ShoppingCart size={16} />
              <span>Add</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700" />
    </div>
  );
}
