import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { devtools, persist } from "zustand/middleware";

const useAuthStore = create(
  devtools(
    persist((set) => ({
      authUser: null,
      isLoggingIn: false,

      register: async (formData) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/register", formData);
          set({ authUser: res.data.user });
          toast.success(res.data.message);
          return res.data.user;
        } catch (error) {
          toast.error(error.response.data.message);
          return null;
        } finally {
          set({ isLoggingIn: false });
        }
      },

      login: async (formData) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", formData);
          set({ authUser: res.data.user });
          toast.success("Logged in successfully.");
          return res.data.user;
        } catch (error) {
          toast.error(error.response.data.message);
          return null;
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          const res = await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success(res.data.message);
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
    }))
  )
);

export default useAuthStore;
