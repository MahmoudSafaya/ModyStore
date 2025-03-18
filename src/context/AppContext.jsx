import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { axiosMain } from "../api/axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(false);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [isDelete, setIsDelete] = useState({ purpose: '', itemId: '', itemName: '' });

  const [senderAddress, setSenderAddress] = useState(null);

  const navigate = useNavigate();

  const getAllCategories = useCallback(async () => {
    try {
      const res = await axiosMain.get('/categories');
      setCategories(res.data)
    } catch (error) {
      console.error(error);
    }
  }, []);


  const getMainCategories = useCallback(async () => {
    try {
      const response = await axiosMain.get('/categories/main'); // Replace with your endpoint
      setMainCategories(response.data);
    } catch (error) {
      console.error("Error fetching main categories:", error);
    }
  }, []);

  const getSubcategories = useCallback(async (categoryId) => {
    if (subcategories[categoryId]) return; // Avoid re-fetching if already loaded

    try {
      const response = await axiosMain.get(`/categories/${categoryId}/subcategories`); // Replace with your endpoint
      setSubcategories((prev) => ({ ...prev, [categoryId]: response.data }));
    } catch (error) {
      console.error(`Error fetching subcategories for ${categoryId}:`, error);
    }
  }, []);

  useEffect(() => {
    getAllCategories();
    getMainCategories();
  }, []);

  const getCategoryById = (cateID) => {
    const category = categories.find(item => item._id === cateID);
    return category ? category.name : '';
  };

  const fetchSenderAddress = async () => {
    setLoading(true);
    try {
      const res = await axiosMain.get('/addresses/senders/default');
      setSenderAddress(res.data.sender);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('Default sender address not found. Redirecting to settings...');
        navigate('/admin/settings');
      } else {
        console.error('Error fetching sender address:', error);
        toast.error('Failed to fetch sender address.');
      }
    } finally {
      setLoading(false);
    }
  };

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

  const contextValue = useMemo(() => ({
    categories,
    setCategories,
    getAllCategories,
    getMainCategories,
    getSubcategories,
    mainCategories,
    subcategories,
    loading,
    setLoading,
    shippingPrice,
    setShippingPrice,
    getCategoryById,
    isDelete,
    setIsDelete,
    senderAddress,
    setSenderAddress,
    fetchSenderAddress,
    successNotify,
    deleteNotify,
    errorNotify,
  }), [
    categories,
    mainCategories,
    subcategories,
    loading,
    shippingPrice,
    isDelete,
    senderAddress,
    getAllCategories,
    getMainCategories,
    getSubcategories,
    getCategoryById,
  ]);

  return (
    <AppContext.Provider
      value={contextValue}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

export const useApp = () => {
  return useContext(AppContext);
};
