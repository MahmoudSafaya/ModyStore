import React, { createContext, useContext, useState } from "react";
import axios from "../api/axios";
import { useEffect } from "react";
import toast from "react-hot-toast";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [isDelete, setIsDelete] = useState({ purpose: '', itemId: '', itemName: '' });

  const [senderAddress, setSenderAddress] = useState(null);

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
      value={{ categories, setCategories, getAllCategories, loading, setLoading, shippingPrice, setShippingPrice, getCategoryById, isDelete, setIsDelete, senderAddress, setSenderAddress, fetchSenderAddress, successNotify, deleteNotify, errorNotify }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

export const useApp = () => {
  return useContext(AppContext);
};
