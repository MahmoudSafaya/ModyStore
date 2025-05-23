import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { axiosMain } from "../api/axios";
import * as jwtDecode from "jwt-decode";
import Loading from "../shared/components/Loading";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const token = Cookies.get("accessToken");

  // Load session from cookies or sessionStorage on initialization
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true); // Start loading
      if (!token) {
        setAuth(null);
        setLoading(false);
        navigate('/admin/login'); // Redirect to login if no token
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
            navigate('/admin/login'); // Redirect to login if token refresh fails
          }
        } else {
          setAuth(decoded);
        }
      } catch (error) {
        console.error("Error handling auth:", error);
        setAuth(null);
        navigate('/admin/login'); // Redirect to login on error
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
    return <Loading />; // Show a loading indicator
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
    navigate('/admin/login'); // Redirect to login after logout
  };

  return (
    <AuthContext.Provider
      value={{ auth, token, login, logout, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

export const useAuth = () => {
  return useContext(AuthContext);
};
