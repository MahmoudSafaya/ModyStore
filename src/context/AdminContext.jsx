import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "../api/axios";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session from cookies or sessionStorage on initialization
  useEffect(() => {
    let isSubscribed = true;
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setAuth(JSON.parse(savedUser));
    } else {
      const getProfile = async () => {
        try {
          const response = await axios.get("/api/auth/profile");
          // set state with the result if `isSubscribed` is true
          if (isSubscribed) {
            setAuth(response.data);
          }
        } catch (error) {
          console.error(error);
        }
      };
      // call the function
      getProfile()
        // make sure to catch any error
        .catch(console.error);
    }
    setLoading(false);
    getOrders();

    // cancel any future `setData`
    return () => (isSubscribed = false);
  }, []);

  const login = (userData) => {
    setAuth(userData);
    Cookies.set("user", JSON.stringify(userData), { expires: 1 });
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setAuth(null);
    Cookies.remove("user");
    Cookies.remove("token");
    sessionStorage.removeItem("user");
  };

  const getOrders = async () => {
    try {
      const response = await axios.get("/api/order/orders");
      saveOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const saveOrders = (data) => {
    setOrders(data);
  };

  const deleteOrder = async (id) => {
    try {
      const response = await axios.delete(`/api/order/delete/${id}`);
      const data = response.data;
      console.log(response);
      if (response.statusText === "OK") {
        // Update the state by filtering out the deleted item
        setOrders((prevItems) => prevItems.filter((item) => item._id !== id));
        console.log("Item Deleted Successfully");
      } else {
        alert(data.error || data.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <AdminContext.Provider
      value={{ auth, login, logout, loading, orders, setOrders, getOrders, deleteOrder }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;

export const useAuth = () => {
  return useContext(AdminContext);
};
