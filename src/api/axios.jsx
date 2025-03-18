import axios from "axios";
import Cookies from "js-cookie";

const axiosMain = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor to dynamically attach token
axiosAuth.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken"); // Fetch token at request time
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { axiosMain, axiosAuth };
