import Footer from "@/components/Footer/Footer";
import NavBar from "@/components/Nav/NavBar";
import LangContextProvider from "@/context/LangContext";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Click2By | Your Smart Shopping Destination",
  description:
    "Click2By is your one-stop e-commerce platform for fashion, electronics, lifestyle products, and more. Shop smarter with secure checkout, fast delivery, and exclusive deals every day.",
  keywords: [
    "Click2By",
    "online shopping",
    "buy online",
    "e-commerce Bangladesh",
    "fashion",
    "electronics",
    "lifestyle products",
    "secure shopping",
    "fast delivery",
  ],
  authors: [{ name: "Click2By Team" }],
  openGraph: {
    title: "Click2By | Shop Smarter, Live Better",
    description:
      "Discover fashion, electronics, and lifestyle products at Click2By. Exclusive offers, fast delivery, and a seamless shopping experience.",
    url: "https://click2by.com",
    siteName: "Click2By",
    images: [
      {
        url: "https://click2by.com/og-image.jpg", // og image এখানে দিতে হবে
        width: 1200,
        height: 630,
        alt: "Click2By - Online Shopping",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Click2By | Your Smart Shopping Destination",
    description:
      "Shop smarter with Click2By. Fashion, electronics, lifestyle, and more — delivered fast.",
    images: ["https://click2by.com/og-image.jpg"], // twitter card image
  },
  metadataBase: new URL("https://click2by.com"),
  category: "e-commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LangContextProvider>
          <NavBar />
          {children}
          <Footer />
        </LangContextProvider>
      </body>
    </html>
  );
}
