import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "../api/axios";
import * as jwtDecode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDelete, setIsDelete] = useState({ display: false, itemID: '', itemName: '' });

  // Load session from cookies or sessionStorage on initialization
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("accessToken");

      if (!token) return;

      try {
        const decoded = jwtDecode.jwtDecode(token);
        const now = Date.now() / 1000; // Current time in seconds

        if (decoded.exp < now) {
          // Token expired, refresh it
          const response = await axios.post('/auth/refreshtoken', {}, { withCredentials: true });

          if (response.data.accessToken) {
            Cookies.set("accessToken", response.data.accessToken, { path: "/" });
            const newDecoded = jwtDecode(response.data.accessToken);
            // setAuth({ role: newDecoded.role });
            setAuth(newDecoded);
          }
        } else {
          // setAuth({ role: decoded.role });
          setAuth(decoded);
        }
      } catch (error) {
        console.error("Error handling auth:", error);
      }
    };

    checkAuth();
  }, []);


  const login = (accessToken) => {
    setAuth(jwtDecode.jwtDecode(accessToken));  // Decode and store user role

    Cookies.set("accessToken", accessToken, { expires: 1, path: "/" });
    sessionStorage.setItem("accessToken", accessToken);
};

  const logout = () => {
    setAuth(null);
    Cookies.remove("accessToken");
    sessionStorage.removeItem("accessToken");
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
