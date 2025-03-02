import React, { createContext, useState, useEffect } from "react";
import { useContext } from "react";
import axios from "../api/axios";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const storeMainNav = [
    { label: "الرئيسية", link: '/' },
    { label: "متجرنا", link: '/products' },
    { label: "من نحن", link: '/about-us' },
    { label: "الشحن والاسترجاع", link: '/shippment' },
  ];

  const getAllProducts = async (filters) => {
    try {
      const response = await axios.get("/products");
      console.log(response)
      return response.data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  const getAllCategories = async () => {
    try {
      const res = await axios.get('/categories');
      console.log(res);
      setCategories(res.data)
    } catch (error) {
      console.error(error);
    }
  }

  const getCategoryById = (cateID) => {
    return (
      categories.map(item => item._id === cateID ? item.name : '')
    )
  }

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <StoreContext.Provider value={{ loading, setLoading, storeMainNav, categories, products, setProducts, getCategoryById }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
