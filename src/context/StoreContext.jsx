import React, { createContext, useState, useEffect } from "react";
import { useContext } from "react";
import axios from "../api/axios";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 10000,
    sort: 'ratings',
    page: 1,
    limit: 1,
  });
  

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

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      const data = await getAllProducts(filters);
      setProducts(data);
    };
    getProducts();
  }, [filters]);


  return (
    <StoreContext.Provider value={{ storeMainNav, categories, products, setProducts }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
