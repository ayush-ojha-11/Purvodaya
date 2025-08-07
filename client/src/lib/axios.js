import axios from "axios";
export const axiosInstance = axios.create({
  // baseURL: "/api/api",
  baseURL: "https://purvodaya-server.onrender.com/api",
  withCredentials: true,
});
