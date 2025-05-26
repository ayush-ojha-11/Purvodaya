import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
const useInventoryStore = create((set) => ({
  inventory: [],
  inventoryRequests: [],
  isLoading: false,
  isSubmitting: false,

  //Fetch inventory (Admin+Employee)
  getInventory: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/inventory");
      set({ inventory: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
  //Admin: Add item
  addInventoryItem: async (itemData) => {
    try {
      set({ isSubmitting: true });
      const res = await axiosInstance.post("/inventory", itemData);
      //change the inventory array
      set((state) => ({
        inventory: [res.data, ...state.inventory],
      }));
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },
  //Admin (Update item)
  updateInventoryItem: async (id, updatedData) => {
    try {
      set({ isSubmitting: true });
      const res = await axiosInstance.put(`/inventory/${id}`, updatedData);
      set((state) => ({
        inventory: state.inventory.map((item) =>
          item._id === id ? res.data : item
        ),
      }));
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },
  //Admin (Delete item)
  deleteInventoryItem: async (id) => {
    try {
      await axiosInstance.delete(`/inventory/${id}`);
      set((state) => ({
        inventory: state.inventory.filter((item) => item._id !== id),
      }));
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return false;
    }
  },
  //Admin: Get all inventory requests
  getInventoryRequests: async () => {
    try {
      const res = await axiosInstance.get("/inventory/requests");
      set({ inventoryRequests: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },
  // Admin: approve a request
  approveInventoryRequest: async (requestId) => {
    try {
      await axiosInstance.put(`/inventory/request/${requestId}/approve`);
      set((state) => ({
        inventoryRequests: state.inventoryRequests.filter(
          (req) => req._id !== requestId
        ),
      }));
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return false;
    }
  },
  // Admin: rejects a request
  rejectInventoryRequest: async (requestId) => {
    try {
      await axiosInstance.put(`/inventory/request/${requestId}/reject`);
      set((state) => ({
        inventoryRequests: state.inventoryRequests.filter(
          (req) => req._id !== requestId
        ),
      }));
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return false;
    }
  },
  //Employee: submits a request
  submitInventoryRequest: async (requestData) => {
    try {
      set({ isSubmitting: true });
      const res = await axiosInstance.post("/inventory/request", requestData);
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return null;
    } finally {
      set({ isSubmitting: false });
    }
  },
}));
export default useInventoryStore;
