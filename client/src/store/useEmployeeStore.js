import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

const useEmployeeStore = create((set) => ({
  loading: false,
  stats: null,
  fetchStats: async () => {
    set({ loading: true });
    try {
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
