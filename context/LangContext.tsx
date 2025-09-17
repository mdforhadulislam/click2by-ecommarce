"use client";
import { createContext, useContext, useState } from "react";

export const LangContext = createContext({
  isBn: false,
  isEn: true,
  bangla: (): void => {},
  english: (): void => {},
});

const LangContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isBn, setIsBn] = useState(false);
  const [isEn, setIsEn] = useState(true);

  const bangla = () => {
    setIsBn(true);
    setIsEn(false);
  };
  const english = () => {
    setIsBn(false);
    setIsEn(true);
  };

  const contextValue = {
    isBn,
    isEn,
    bangla,
    english,
  };

  return (
    <LangContext.Provider value={contextValue}>{children}</LangContext.Provider>
  );
};

export const useLang = () =>{ return useContext(LangContext)};

export default LangContextProvider;