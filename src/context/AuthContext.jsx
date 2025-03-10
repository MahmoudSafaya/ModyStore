import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "../api/axios";
import * as jwtDecode from "jwt-decode";
import Loading from "../shared/components/Loading";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Load session from cookies or sessionStorage on initialization
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true); // Start loading
      const token = Cookies.get("accessToken");
      if (!token) {
        setAuth(null);
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode.jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          const response = await axios.post('/auth/refreshtoken', {}, { withCredentials: true });

          if (response.data.accessToken) {
            Cookies.set("accessToken", response.data.accessToken, { path: "/" });
            const newDecoded = jwtDecode.jwtDecode(response.data.accessToken);
            setAuth(newDecoded);
          } else {
            setAuth(null);
          }
        } else {
          setAuth(decoded);
        }
      } catch (error) {
        console.error("Error handling auth:", error);
        setAuth(null);
      }

      setLoading(false); // Stop loading
    };

    // Store the current route before running auth check
    if (!localStorage.getItem("lastPath")) {
      localStorage.setItem("lastPath", location.pathname);
    }

    checkAuth();
  }, []);

  useEffect(() => {
    // Redirect to the last visited path after authentication is confirmed
    const lastPath = localStorage.getItem("lastPath");
    if (lastPath && auth) {
      navigate(lastPath, { replace: true });
      localStorage.removeItem("lastPath");
    }
  }, [auth, navigate]);


  if (loading) {
    return <Loading loading={loading} />; // Show a loading indicator
  }

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
      value={{ auth, login, logout, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

export const useAuth = () => {
  return useContext(AuthContext);
};
