import axios from "axios";
import useAuthStore from "../store/useAuthStore";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "/api/api"
      : "http://localhost:4001/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.data?.expired) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
