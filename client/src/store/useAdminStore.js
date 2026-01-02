import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";

const useAdminStore = create(
  devtools((set, get) => ({
    employees: null,
    dashboardStats: null,
    statsFetched: false,
    isFetchingData: false,
    isDeleting: false,
    isMarkingAttendance: false,

    getDashboardStats: async (force = false) => {
      const { statsFetched, dashboardStats, isFetchingData } = get();
      // HARD STOP: already fetched
      if (statsFetched && dashboardStats && !force) {
        return dashboardStats;
      }
      // Prevent parallel calls
      if (isFetchingData) return;

      try {
        set({ isFetchingData: true });
        const res = await axiosInstance.get("/admin/dashboard-stats");
        set({
          dashboardStats: res.data,
          statsFetched: true,
        });
        return res.data;
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isFetchingData: false });
      }
    },
    getAllEmployees: async (force = false) => {
      const { employees } = get();
      if (!force && employees) {
        return employees;
      }
      try {
        set({ isFetchingData: true });
        const res = await axiosInstance.get("/admin/employees");
        set({ employees: res.data });
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
    getAttendanceSummary: async (month, year) => {
      try {
        set({ isFetchingData: true });

        const res = await axiosInstance.get("/attendance/records", {
          params: { month, year },
        });
        return res.data;
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        set({ isFetchingData: false });
      }
    },
  }))
);
export default useAdminStore;
