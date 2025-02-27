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

  return (
    <AdminContext.Provider
      value={{ auth, login, logout, loading, orders, setOrders }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;

export const useAuth = () => {
  return useContext(AdminContext);
};
