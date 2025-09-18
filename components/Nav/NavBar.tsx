"use client";
import {
  CircleUser,
  ShoppingCart,
  TextAlignJustify,
  TicketPercent,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { IconHome } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { FloatingDock } from "../ui/floating-dock";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
export const categories = [
  {
    title: "Sale",
    links: [
      "Unstitched",
      "Pret Wear",
      "Home Essentials",
      "Men’s Fashion",
      "Western Wear",
      "Kids Fashion",
      "Fragrances",
      "Accessories",
      "Unstitched",
      "Pret Wear",
      "Home Essentials",
      "Men’s Fashion",
      "Home Essentials",
      "Men’s Fashion",
      "Western Wear",
      "Kids Fashion",
      "Fragrances",
      "Accessories",
      "Unstitched",
      "Pret Wear",
      "Home Essentials",
      "Men’s Fashion",
      "Home Essentials",
      "Men’s Fashion",
      "Western Wear",
      "Kids Fashion",
      "Fragrances",
      "Accessories",
      "Unstitched",
      "Pret Wear",
      "Home Essentials",
      "Men’s Fashion",
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
      { src: "/images/new1.jpg", label: "Fresh Women's Collection" },
      { src: "/images/new2.jpg", label: "Stylish Men's Wear" },
      { src: "/images/new3.jpg", label: "Trendy Footwear" },
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
      { src: "/women1.jpg", label: "Elegant Sarees" },
      { src: "/women2.jpg", label: "Trendy Kurtis" },
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
      { src: "/men1.jpg", label: "Formal Collection" },
      { src: "/men2.jpg", label: "Casual Wear" },
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
      { src: "/kids1.jpg", label: "Cute Baby Dresses" },
      { src: "/kids2.jpg", label: "Trendy Kids Fashion" },
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
      { src: "/electronics1.jpg", label: "Latest Smartphones" },
      { src: "/electronics2.jpg", label: "Smart Gadgets" },
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
      { src: "/home1.jpg", label: "Cozy Bedding" },
      { src: "/home2.jpg", label: "Modern Furniture" },
    ],
  },
  {
    title: "Beauty & Personal Care",
    links: [
      "Makeup",
      "Skincare",
      "Haircare",
      "Fragrances",
      "Bath & Body",
      "Men’s Grooming",
    ],
    images: [
      { src: "/beauty1.jpg", label: "Top Skincare Picks" },
      { src: "/beauty2.jpg", label: "Makeup Essentials" },
    ],
  },
  {
    title: "Sports & Fitness",
    links: [
      "Sportswear",
      "Gym Equipment",
      "Footwear",
      "Outdoor Gear",
      "Bicycles",
      "Accessories",
    ],
    images: [
      { src: "/sports1.jpg", label: "Activewear Collection" },
      { src: "/sports2.jpg", label: "Fitness Essentials" },
    ],
  },
];

const NavBar = () => {
  const [active, setActive] = useState<string | null>(null);
  const [isMobileMenu, setIsMobileMenu] = useState<boolean>(false)

  const links = [
    {
      title: "MENU",
      icon: (
        <TextAlignJustify
          size={34}
          strokeWidth={1.5}
          className="h-full w-full text-neutral-500 "
        />
      ),
      href: "#",
      onClick: () => {
        console.log("Hello");
        
      },
    },

    {
      title: "ACCOUNT",
      icon: (
        <CircleUser
          size={34}
          strokeWidth={1.5}
          className="h-full w-full text-neutral-500 "
        />
      ),
      href: "#",
    },
    {
      title: "HOME",
      icon: <IconHome className="h-full w-full text-neutral-500 " />,
      href: "#",
    },
    {
      title: "BUY NOW",
      icon: (
        <ShoppingCart
          size={34}
          strokeWidth={1.5}
          className="h-full w-full text-neutral-500 "
        />
      ),
      href: "#",
    },
    {
      title: "NEW OFFERS",
      icon: (
        <TicketPercent
          size={34}
          strokeWidth={1.5}
          className="h-full w-full text-neutral-500 "
        />
      ),
      href: "#",
    },
  ];

  return (
    <header className="w-full h-auto sticky">
      <div className="w-full h-auto border-b ">
        <div className="container px-2 py-2 m-auto flex justify-between align-middle items-center">
          <h1 className="text-2xl md:text-3xl font-bold">CLICK2BY</h1>

          <div className="flex gap-1 items-center align-middle">
            <HoverBorderGradient
              containerClassName="rounded-full "
              as="button"
              className=" bg-white text-black  flex items-center text-base px-[10px] cursor-pointer py-[6px] hover:bg-black hover:text-white transition-all duration-200"
            >
              <span>BUY NOW</span>
            </HoverBorderGradient>

            <div className="p-1 py-1 hover:bg-black hover:text-white transition-all duration-200 cursor-pointer hidden lg:block">
              <CircleUser size={30} strokeWidth={1} />
            </div>
            <div className="p-1 py-1 hover:bg-black hover:text-white transition-all duration-200 cursor-pointer">
              <TextAlignJustify size={30} strokeWidth={1.2} />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full py-3  m-auto border-b hidden lg:block ">
        {/* Main Menu */}
        <ul className="hidden lg:flex gap-8 font-medium text-gray-700 relative justify-center align-middle">
          {categories.map((cat) => (
            <li
              key={cat.title}
              onMouseEnter={() => setActive(cat.title)}
              onMouseLeave={() => setActive(null)}
              className="cursor-pointer "
            >
              {cat.title}

              {/* Mega menu */}
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
                      {/* Left menu links */}
                      <div className="col-span-3 border-r border-gray-200 pr-6">
                        <ul className="space-y-3 text-sm overflow-auto  lg:h-[280px] xl:h-[380px] 2xl:h-[480px]">
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

                      {/* Right images */}
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

      <FloatingDock
        items={links}
       className={` fixed w-screen bottom-0 z-[30]`}
      />
    </header>
  );
};

export default NavBar;
