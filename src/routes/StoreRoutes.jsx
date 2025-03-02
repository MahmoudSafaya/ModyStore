import React from "react";
import { Routes, Route } from "react-router-dom";
import { S_Home, S_Favorites, S_ProductDetails, S_Products, S_Checkout } from "../features/store/pages";
import NotFound from "../shared/pages/NotFound";
import StoreLayout from "../layouts/StoreLayout";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoritesContext";

const StoreRoutes = () => {
  return (
    <CartProvider>
      <FavoritesProvider>
        <Routes>
          <Route element={<StoreLayout />}>
            <Route path="/" element={<S_Home />} />
            <Route path="/products" element={<S_Products />} />
            <Route path="/favorites" element={<S_Favorites />} />
            <Route path="/products/:id" element={<S_ProductDetails />} />
            <Route path="/checkout" element={<S_Checkout />} />
          </Route>
          {/* 404 Page */}
          <Route path="/*" element={<NotFound />}></Route>
        </Routes>
      </FavoritesProvider>
    </CartProvider>
  );
};

export default StoreRoutes;
