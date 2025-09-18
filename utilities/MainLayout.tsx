import React from "react";
import SiteLayout from "./SiteLayout";

const MainLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <SiteLayout>{children}</SiteLayout>
    </>
  );
};

export default MainLayout;
