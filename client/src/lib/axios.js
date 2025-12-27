import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: "/api/api",
  //baseURL: "http://localhost:4001/api",
  withCredentials: true,
});
