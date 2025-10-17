"use client";
import React from "react";
import SiteLayout from "./SiteLayout";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const MainLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <AuthProvider>
      <CartProvider>
        <SiteLayout>{children}</SiteLayout>
      </CartProvider>
    </AuthProvider>
  );
};

export default MainLayout;
