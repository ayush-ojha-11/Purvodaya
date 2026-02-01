import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { devtools, persist } from "zustand/middleware";
import useProjectStore from "./useProjectStore.js";
import useLeadStore from "./useLeadStore.js";

const useAuthStore = create(
  devtools(
    persist((set) => ({
      authUser: null,
      isLoggingIn: false,
      isSendingReset: false,
      isResettingPassword: false,

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
          useProjectStore.getState().resetProjectStore();
          useLeadStore.getState().resetLeadStore();
          toast.success(res.data.message);
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
      forgotPassword: async (email) => {
        set({ isSendingReset: true });
        try {
          const res = await axiosInstance.post("/auth/forgot-password", {
            email,
          });

          if (res.status === 200) {
            return true;
          } else {
            return false;
          }
        } catch (error) {
          toast.error(error.response.data.message);
          console.error(error);
          return false;
        } finally {
          set({ isSendingReset: false });
        }
      },

      resetPassword: async (token, password) => {
        set({ isResettingPassword: true });

        try {
          const res = await axiosInstance.post(
            `/auth/reset-password/${token}`,
            {
              password,
            },
          );
          if (res.status === 200) {
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error("Error in resetPassword (useAuthStore)", error);
          toast.error(error.response.data.message);
        } finally {
          set({ isResettingPassword: false });
        }
      },
    })),
  ),
);
export default useAuthStore;
