import Footer from "@/components/Footer/Footer";
import UpdatedNavBar from "@/components/Nav/UpdatedNavBar";
import LangContextProvider from "@/context/LangContext";
import React from "react";

const SiteLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <LangContextProvider>
        <UpdatedNavBar />
        {children}
        <Footer />
      </LangContextProvider>
    </>
  );
};

export default SiteLayout;
