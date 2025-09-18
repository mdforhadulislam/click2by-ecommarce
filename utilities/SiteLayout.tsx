import Footer from "@/components/Footer/Footer";
import NavBar from "@/components/Nav/NavBar";
import LangContextProvider from "@/context/LangContext";
import React from "react";

const SiteLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <LangContextProvider>
        <NavBar />
        {children}
        <Footer />
      </LangContextProvider>
    </>
  );
};

export default SiteLayout;
