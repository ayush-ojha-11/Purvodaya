import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";

const useAdminStore = create(
  devtools((set) => ({
    isFetchingData: false,
    isDeleting: false,
    isMarkingAttendance: false,

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
    getAllEmployees: async () => {
      try {
        set({ isFetchingData: true });
        const res = await axiosInstance.get("/admin/employees");
        return res.data;
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isFetchingData: false });
      }
    },
    deleteEmployee: async (id) => {
      try {
        set({ isDeleting: true });
        const res = await axiosInstance.delete(`/admin/employees/${id}`);
        toast.success(res.data.message);
        return true;
      } catch (error) {
        toast.error(error.response?.data?.message);
        return false;
      } finally {
        set({ isDeleting: false });
      }
    },
    markAttendance: async (attendanceData) => {
      try {
        set({ isMarkingAttendance: true });
        await axiosInstance.post("/attendance/mark", attendanceData);
        return true;
      } catch (error) {
        toast.error(error?.response?.data?.message);
        return false;
      } finally {
        set({ isMarkingAttendance: false });
      }
    },
  }))
);
export default useAdminStore;
