import React, { createContext } from "react";
import { useContext } from "react";


export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {

  const storeMainNav = [
    { label: "الرئيسية", link: '/' },
    { label: "من نحن", link: '/about-us' },
    { label: "تتبع الاوردر", link: '/signed-orders' },
  ];

  return (
    <StoreContext.Provider value={{ storeMainNav }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
