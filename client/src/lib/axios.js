import axios from "axios";
export const axiosInstance = axios.create({
  // baseURL: "/api/api",
  baseURL: "http://localhost:7001/api",
  withCredentials: true,
});
