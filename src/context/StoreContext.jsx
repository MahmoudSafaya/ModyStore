import React, { createContext, useState } from "react";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  const addToCart = (product) => setCart([...cart, product]);
  const removeFromCart = (productId) =>
    setCart(cart.filter((item) => item.id !== productId));

  return (
    <StoreContext.Provider value={{ cart, addToCart, removeFromCart, products, setProducts }}>
      {children}
    </StoreContext.Provider>
  );
};
