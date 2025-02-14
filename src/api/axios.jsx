import axios from "axios";

export default axios.create({
  baseURL: import.meta.env.VITE_API_RUL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});