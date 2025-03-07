import React, { createContext, useContext, useState } from "react";
import axios from "../api/axios";
import { useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [isDelete, setIsDelete] = useState({ purpose: '', itemId: '', itemName: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);


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
  }, [])


  const getCategoryById = (cateID) => {
    return (
      categories.map(item => item._id === cateID ? item.name : '')
    )
  }

  // Open modal with selected item
  const handleDeleteClick = (item) => {
    setDeleteItem(item);
    setIsModalOpen(true);
  };


  return (
    <AppContext.Provider
      value={{ categories, setCategories, getAllCategories, loading, setLoading, shippingPrice, setShippingPrice, getCategoryById, isDelete, setIsDelete }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

export const useApp = () => {
  return useContext(AppContext);
};
