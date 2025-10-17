"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16" data-testid="empty-cart-page">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link href="/products">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition" data-testid="continue-shopping-btn">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" data-testid="cart-page">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8" data-testid="cart-page-title">Shopping Cart ({totalItems})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-lg p-4 flex gap-4"
                data-testid={`cart-item-${item.id}`}
              >
                <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-semibold mb-1 hover:text-purple-600">
                      {item.title}
                    </h3>
                  </Link>
                  {item.variation && (
                    <p className="text-sm text-gray-500 mb-2">
                      {item.variation.color && `Color: ${item.variation.color}`}
                      {item.variation.size && ` | Size: ${item.variation.size}`}
                    </p>
                  )}
                  <p className="text-lg font-bold text-purple-600">৳{item.price}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                    data-testid={`remove-item-${item.id}`}
                  >
                    <Trash2 size={20} />
                  </button>

                  <div className="flex items-center gap-2 border rounded">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100"
                      data-testid={`decrease-qty-${item.id}`}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 font-semibold" data-testid={`item-quantity-${item.id}`}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                      data-testid={`increase-qty-${item.id}`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-6 sticky top-24" data-testid="order-summary">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">৳{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">৳100</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span className="text-purple-600" data-testid="cart-total-price">৳{totalPrice + 100}</span>
              </div>

              <Link href="/checkout">
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition" data-testid="proceed-checkout-btn">
                  Proceed to Checkout
                </button>
              </Link>

              <Link href="/products">
                <button className="w-full mt-3 border border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
