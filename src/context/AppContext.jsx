import React, { createContext, useContext, useState } from "react";
import axios from "../api/axios";
import { useEffect } from "react";
import toast from "react-hot-toast";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(false);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [isDelete, setIsDelete] = useState({ purpose: '', itemId: '', itemName: '' });

  const [senderAddress, setSenderAddress] = useState(null);

  const getAllCategories = async () => {
    try {
      const res = await axios.get('/categories');
      setCategories(res.data)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAllCategories();
  }, []);

  const getMainCategories = async () => {
    try {
      const response = await axios.get('/categories/main'); // Replace with your endpoint
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

  const getCategoryById = (cateID) => {
    return (
      categories.map(item => item._id === cateID ? item.name : '')
    )
  }

  const fetchSenderAddress = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/addresses/senders/default');
      setSenderAddress(res.data.sender);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const successNotify = (message) => {
    toast.success(message, {
      style: {
        textAlign: 'center'
      }
    })
  };

  const deleteNotify = (message) => {
    toast.success(message, {
      style: {
        padding: '16px',
        color: '#485363',
        textAlign: 'center'
      },
      iconTheme: {
        primary: '#485363',
        secondary: '#FFFFFF',
      },
    });
  };

  const errorNotify = (message) => {
    toast(message, {
      style: {
        padding: '16px',
        color: '#fb2c36',
        textAlign: 'center'
      },
      iconTheme: {
        primary: '#fb2c36',
        secondary: '#FFFFFF',
      },
    });
  };

  return (
    <AppContext.Provider
      value={{ categories, setCategories, getAllCategories, getMainCategories, getSubcategories, mainCategories, subcategories, loading, setLoading, shippingPrice, setShippingPrice, getCategoryById, isDelete, setIsDelete, senderAddress, setSenderAddress, fetchSenderAddress, successNotify, deleteNotify, errorNotify }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

export const useApp = () => {
  return useContext(AppContext);
};
