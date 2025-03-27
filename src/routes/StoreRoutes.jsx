import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import StoreLayout from "../layouts/StoreLayout";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import Loading from "../shared/components/Loading";

// Lazy-loaded pages
const S_Home = lazy(() => import("../features/store/pages/Home"));
const S_Products = lazy(() => import("../features/store/pages/Products"));
const S_AboutUs = lazy(() => import("../features/store/pages/AboutUs"));
const S_Favorites = lazy(() => import("../features/store/pages/Favorites"));
const S_ProductDetails = lazy(() => import("../features/store/pages/ProductDetails"));
const S_Checkout = lazy(() => import("../features/store/pages/Checkout"));
const S_SignedOrders = lazy(() => import("../features/store/pages/SignedOrders"));
const NotFound = lazy(() => import("../shared/pages/NotFound"));

const StoreRoutes = () => {
  return (
    <CartProvider>
      <FavoritesProvider>
        <Suspense fallback={<Loading />}>
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
        </Suspense>
      </FavoritesProvider>
    </CartProvider>
  );
};

export default StoreRoutes;