import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";

const useAdminStore = create(
  devtools((set) => ({
    isFetchingData: false,

    getDashboardStats: async () => {
      try {
        set({ isFetchingData: true });
        const res = await axiosInstance.get("/admin/dashboard-stats");
        return res.data;
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isFetchingData: false });
      }
    },
  }))
);
export default useAdminStore;
