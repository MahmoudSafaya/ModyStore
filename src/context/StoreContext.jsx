import React, { createContext, useState, useEffect } from "react";
import { useContext } from "react";
import axios from "../api/axios";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});

  const storeMainNav = [
    { label: "الرئيسية", link: '/' },
    { label: "متجرنا", link: '/products' },
    { label: "من نحن", link: '/about-us' },
    { label: "الشحن والاسترجاع", link: '/shippment' },
  ];

  const getMainCategories = async () => {
    try {
      const response = await axios.get('/categories/main'); // Replace with your endpoint
      console.log()
      setMainCategories(response.data);
    } catch (error) {
      console.error("Error fetching main categories:", error);
    }
  };

  useEffect(() => {
    getMainCategories();
  }, []);

  const getSubcategories = async (categoryId) => {
    if (subcategories[categoryId]) return; // Avoid re-fetching if already loaded

    try {
      const response = await axios.get(`/categories/${categoryId}/subcategories`); // Replace with your endpoint
      setSubcategories((prev) => ({ ...prev, [categoryId]: response.data }));
    } catch (error) {
      console.error(`Error fetching subcategories for ${categoryId}:`, error);
    }
  };


  return (
    <StoreContext.Provider value={{ loading, setLoading, storeMainNav, products, setProducts, mainCategories, subcategories, setSubcategories, getSubcategories }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
