import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDelete, setIsDelete] = useState({ display: false, itemID: '', itemName: '' });

  // Load session from cookies or sessionStorage on initialization
  // useEffect(() => {
  //   let isSubscribed = true;
  //   const savedUser = sessionStorage.getItem("user");
  //   if (savedUser) {
  //     setAuth(JSON.parse(savedUser));
  //   } else {
  //     const getProfile = async () => {
  //       try {
  //         const response = await axios.get("/api/auth/profile");
  //         // set state with the result if `isSubscribed` is true
  //         if (isSubscribed) {
  //           setAuth(response.data);
  //         }
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };
  //     // call the function
  //     getProfile()
  //       // make sure to catch any error
  //       .catch(console.error);
  //   }
  //   setLoading(false);

  //   // cancel any future `setData`
  //   return () => (isSubscribed = false);
  // }, []);

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
    <AuthContext.Provider
      value={{ auth, login, logout, loading, orders, setOrders, isDelete, setIsDelete }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

export const useAuth = () => {
  return useContext(AuthContext);
};
