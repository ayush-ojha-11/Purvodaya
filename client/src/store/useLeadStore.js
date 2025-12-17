import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

const useLeadStore = create((set) => ({
  leads: [],
  allLeads: [],
  totalPages: 1,
  totalLeads: 0,
  page: 1,
  isSubmitting: false,
  isLoading: false,

  // POST lead (Employees)
  submitLead: async (requestData) => {
    try {
      set({ isSubmitting: true });
      const res = await axiosInstance.post("/lead", requestData);
      if (res.status === 201) {
        toast.success("Lead submitted.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return null;
    } finally {
      set({ isSubmitting: false });
    }
  },

  // Get My leads (leads of an employee)
  fetchLeads: async (force = false) => {
    const { leads } = useLeadStore.getState();
    if (!force && leads.length) return; // already have data

    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/lead/my");
      set({ leads: res.data });
    } finally {
      set({ isLoading: false });
    }
  },

  // GET all leads (Admin)
  fetchAllLeads: async (force = false, page = 1) => {
    const { allLeads } = useLeadStore.getState();

    if (!force && allLeads.length) return; // already have data

    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/lead?page=${page}&limit=10`);
      set({
        allLeads: res.data.leads,
        totalPages: res.data.totalPages,
        page: page,
        totalLeads: res.data.totalLeads,
      });
    } catch (error) {
      toast.error(error?.response?.data.message);
    } finally {
      set({ isLoading: false });
    }
  },

  // Update lead status (Admin)
  updateLeadStatus: async (id, status, reason = "") => {
    try {
      if (status === "confirmed") {
        const res = await axiosInstance.put(`/lead/${id}/confirm`);
        if (res.status === 201) {
          toast.success(res.data.message);
        }
      }

      if (status === "rejected") {
        const res = await axiosInstance.put(`/lead/${id}/reject`, { reason });
        if (res.status === 200) {
          toast.success(res.data.message);
        }
      }
      // refresh list
      useLeadStore.getState().fetchAllLeads(true, useLeadStore.getState().page);
    } catch (error) {
      console.log("Error in updateLeadStatus (useLeadStore)");
      toast.error(error?.response?.data?.message);
    }
  },
  // delete a lead
  deleteLead: async (id) => {
    try {
      const res = await axiosInstance.delete(`/lead/delete/${id}`);
      if (res.status === 200) {
        // refresh without reload
        set((state) => ({
          allLeads: state.allLeads.filter((lead) => lead._id !== id),
          totalLeads: state.totalLeads - 1,
        }));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Error in deleting lead (useLeadStore)");
      toast.error(error?.response?.data?.message);
    }
  },

  //delete all
  deleteAllLeads: async () => {
    try {
      const res = await axiosInstance.delete("/lead/deleteAll");
      if (res.status === 200) {
        set(() => ({
          allLeads: [],
          totalLeads: 0,
        }));
      }
    } catch (error) {
      console.log("Error in deleting lead (useLeadStore)");
      toast.error(error?.response?.data?.message);
    }
  },
}));
export default useLeadStore;
