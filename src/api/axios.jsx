import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("accessToken");

const axiosMain = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

export { axiosMain, axiosAuth };
