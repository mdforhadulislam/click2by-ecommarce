"use client"
import { useLang } from "@/context/LangContext";

const Bn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isBn } = useLang();
  return <>{isBn ? children : ""}</>;
};

export default Bn;
