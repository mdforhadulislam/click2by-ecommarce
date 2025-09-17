"use client" 
import { useLang } from "@/context/LangContext";

const En: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isEn } = useLang();
  return <>{isEn ? children : ""}</>;
};

export default En;