import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

const useEmployeeStore = create((set, get) => ({
  loading: false,
  stats: null,
  fetchStats: async (force = false) => {
    const { stats } = get();
    if (stats && !force) {
      return stats;
    }
    try {
      set({ loading: true });
      const { data } = await axiosInstance.get("/employee/dashboard-stats");
      set({ stats: data });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useEmployeeStore;
