import React from "react";
import { Routes, Route } from "react-router-dom";
import { S_Home, S_Favorites, S_ProductDetails } from "../features/store/pages";
import NotFound from "../shared/pages/NotFound";
import StoreLayout from "../layouts/StoreLayout";

const StoreRoutes = () => {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route path="/" element={<S_Home />} />
        <Route path="/favorites" element={<S_Favorites />} />
        <Route path="/products/:id" element={<S_ProductDetails />} />
      </Route>
        {/* 404 Page */}
        <Route path="/*" element={<NotFound />}></Route>
    </Routes>
  );
};

export default StoreRoutes;
