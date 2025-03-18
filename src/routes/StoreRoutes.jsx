import React from "react";
import { Routes, Route } from "react-router-dom";
import { S_Home, S_Favorites, S_ProductDetails, S_Products, S_Checkout, S_AboutUs, S_SignedOrders } from "../features/store/pages";
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
            <Route path="/products/category/:categoryId" element={<S_Products />} />
            <Route path="/about-us" element={<S_AboutUs />} />
            <Route path="/favorites" element={<S_Favorites />} />
            <Route path="/products/:id" element={<S_ProductDetails />} />
            <Route path="/checkout" element={<S_Checkout />} />
            <Route path="/signed-orders" element={<S_SignedOrders />} />
          </Route>
          {/* 404 Page */}
          <Route path="/*" element={<NotFound />}></Route>
        </Routes>
      </FavoritesProvider>
    </CartProvider>
  );
};

export default StoreRoutes;
