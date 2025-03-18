import React, { createContext } from "react";
import { useContext } from "react";


export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {

  const storeMainNav = [
    { label: "الرئيسية", link: '/' },
    // { label: "متجرنا", link: '/products' },
    { label: "من نحن", link: '/about-us' },
    // { label: "الشحن والاسترجاع", link: '/shippment' },
  ];

  return (
    <StoreContext.Provider value={{ storeMainNav }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
