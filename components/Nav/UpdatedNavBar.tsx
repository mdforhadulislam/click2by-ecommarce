"use client";
import {
  CircleUser,
  ShoppingCart,
  TextAlignJustify,
  TicketPercent,
  LogOut,
  User,
  Package,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { IconHome } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { FloatingDock } from "../ui/floating-dock";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import AuthModal from "../Auth/AuthModal";

export const categories = [
  {
    title: "Sale",
    links: [
      "Unstitched",
      "Pret Wear",
      "Home Essentials",
      "Men's Fashion",
      "Western Wear",
      "Kids Fashion",
      "Fragrances",
      "Accessories",
    ],
    images: [
      { src: "/sharee.png", label: "Explore our Festive Collection" },
      { src: "/bag.png", label: "Explore Catalogue" },
      { src: "/candle.png", label: "Explore Home & Living" },
      { src: "/bedding.png", label: "Discover Premium Fragrances" },
    ],
  },
  {
    title: "New Arrivals",
    links: ["Women", "Men", "Shoes", "Bags", "Jewelry", "Beauty"],
    images: [
      { src: "/sharee.png", label: "Fresh Women's Collection" },
      { src: "/bag.png", label: "Stylish Men's Wear" },
    ],
  },
  {
    title: "Women",
    links: [
      "Unstitched",
      "Saree",
      "Three Piece",
      "Kurtis",
      "Western Wear",
      "Shoes",
      "Bags",
      "Jewelry",
      "Beauty & Makeup",
    ],
    images: [
      { src: "/sharee.png", label: "Elegant Sarees" },
      { src: "/bag.png", label: "Trendy Kurtis" },
    ],
  },
  {
    title: "Men",
    links: [
      "Shirts",
      "T-Shirts",
      "Panjabi & Kurta",
      "Suits & Blazers",
      "Jeans",
      "Shoes",
      "Watches",
      "Accessories",
    ],
    images: [
      { src: "/sharee.png", label: "Formal Collection" },
      { src: "/bag.png", label: "Casual Wear" },
    ],
  },
  {
    title: "Kids",
    links: [
      "Boys Clothing",
      "Girls Clothing",
      "Infants",
      "School Wear",
      "Toys",
      "Shoes",
      "Accessories",
    ],
    images: [
      { src: "/sharee.png", label: "Cute Baby Dresses" },
      { src: "/bag.png", label: "Trendy Kids Fashion" },
    ],
  },
  {
    title: "Electronics",
    links: [
      "Mobiles",
      "Laptops",
      "Tablets",
      "Smart Watches",
      "Headphones",
      "Home Appliances",
      "Gaming",
    ],
    images: [
      { src: "/candle.png", label: "Latest Smartphones" },
      { src: "/bedding.png", label: "Smart Gadgets" },
    ],
  },
  {
    title: "Home & Living",
    links: [
      "Furniture",
      "Bedsheets",
      "Curtains",
      "Cushions",
      "Kitchen Essentials",
      "Lighting",
      "Decor Items",
    ],
    images: [
      { src: "/bedding.png", label: "Cozy Bedding" },
      { src: "/candle.png", label: "Modern Furniture" },
    ],
  },
];

const UpdatedNavBar = () => {
  const [active, setActive] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, user, logout, isAdmin, isAffiliate } = useAuth();
  const { totalItems } = useCart();

  const links = [
    {
      title: "MENU",
      icon: (
        <TextAlignJustify
          size={34}
          strokeWidth={1.5}
          className="h-full w-full text-neutral-500"
        />
      ),
      href: "#",
    },
    {
      title: "ACCOUNT",
      icon: (
        <CircleUser
          size={34}
          strokeWidth={1.5}
          className="h-full w-full text-neutral-500"
        />
      ),
      href: "#",
      onClick: () => {
        if (isAuthenticated) {
          setShowUserMenu(!showUserMenu);
        } else {
          setShowAuthModal(true);
        }
      },
    },
    {
      title: "HOME",
      icon: <IconHome className="h-full w-full text-neutral-500" />,
      href: "/",
    },
    {
      title: "CART",
      icon: (
        <div className="relative">
          <ShoppingCart
            size={34}
            strokeWidth={1.5}
            className="h-full w-full text-neutral-500"
          />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      ),
      href: "/cart",
    },
    {
      title: "OFFERS",
      icon: (
        <TicketPercent
          size={34}
          strokeWidth={1.5}
          className="h-full w-full text-neutral-500"
        />
      ),
      href: "/offers",
    },
  ];

  return (
    <>
      <header className="w-full h-auto sticky top-0 bg-white z-40 shadow-sm">
        <div className="w-full h-auto border-b">
          <div className="container px-2 py-2 m-auto flex justify-between align-middle items-center">
            <Link href="/">
              <h1 className="text-2xl md:text-3xl font-bold cursor-pointer" data-testid="site-logo">
                Bazaarfly
              </h1>
            </Link>

            <div className="flex gap-1 items-center align-middle">
              <Link href="/cart">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  as="button"
                  className="bg-white text-black flex items-center text-base px-[10px] cursor-pointer py-[6px] hover:bg-black hover:text-white transition-all duration-200"
                  data-testid="cart-btn"
                >
                  <ShoppingCart size={20} className="mr-1" />
                  <span>Cart ({totalItems})</span>
                </HoverBorderGradient>
              </Link>

              <div className="relative hidden lg:block">
                {isAuthenticated ? (
                  <div
                    className="p-1 py-1 hover:bg-black hover:text-white transition-all duration-200 cursor-pointer"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    data-testid="user-menu-btn"
                  >
                    <CircleUser size={30} strokeWidth={1} />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 text-sm hover:bg-black hover:text-white transition-all duration-200"
                    data-testid="login-btn"
                  >
                    Login
                  </button>
                )}

                {showUserMenu && isAuthenticated && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 border" data-testid="user-dropdown-menu">
                    <div className="px-4 py-2 border-b">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                        data-testid="admin-dashboard-link"
                      >
                        <LayoutDashboard size={16} className="mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    {isAffiliate && (
                      <Link
                        href="/affiliate"
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                        data-testid="affiliate-dashboard-link"
                      >
                        <LayoutDashboard size={16} className="mr-2" />
                        Affiliate Dashboard
                      </Link>
                    )}
                    
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 hover:bg-gray-100"
                      data-testid="profile-link"
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center px-4 py-2 hover:bg-gray-100"
                      data-testid="orders-link"
                    >
                      <Package size={16} className="mr-2" />
                      My Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-red-600"
                      data-testid="logout-btn"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <div className="p-1 py-1 hover:bg-black hover:text-white transition-all duration-200 cursor-pointer">
                <TextAlignJustify size={30} strokeWidth={1.2} />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full py-3 m-auto border-b hidden lg:block">
          <ul className="hidden lg:flex gap-8 font-medium text-gray-700 relative justify-center align-middle">
            {categories.map((cat) => (
              <li
                key={cat.title}
                onMouseEnter={() => setActive(cat.title)}
                onMouseLeave={() => setActive(null)}
                className="cursor-pointer"
              >
                {cat.title}

                <AnimatePresence>
                  {active === cat.title && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-0 top-8 w-full bg-white shadow-lg border-t border-gray-100"
                    >
                      <div className="grid grid-cols-12 gap-6 p-8">
                        <div className="col-span-3 border-r border-gray-200 pr-6">
                          <ul className="space-y-3 text-sm overflow-auto lg:h-[280px] xl:h-[380px] 2xl:h-[480px]">
                            {cat.links.map((link, index) => (
                              <li key={index}>
                                <Link
                                  href={`/category/${link
                                    .toLowerCase()
                                    .replace(/ /g, "-")}`}
                                  className="hover:underline"
                                >
                                  {link}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="col-span-9 grid grid-cols-4 gap-4">
                          {cat.images.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition"
                            >
                              <img
                                src={img.src}
                                alt={img.label}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-end justify-center p-2 opacity-0 group-hover:opacity-100 transition">
                                <p className="text-white text-lg font-medium">
                                  {img.label}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>

        <FloatingDock items={links} className="fixed w-screen bottom-0 z-[30]" />
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default UpdatedNavBar;
