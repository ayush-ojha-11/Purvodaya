import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const initialState = {
  isLoading: false,
  isUpdatingStatus: false,
  allProjects: [],
  page: 1,
  totalPages: 1,
  totalProjects: 0,
};

const useProjectStore = create((set) => ({
  ...initialState,

  resetProjectStore: () => set(initialState),

  //fetch all projects
  fetchAllProjects: async (force = false, page = 1) => {
    const { allProjects } = useProjectStore.getState();
    if (!force && allProjects.length) return;
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/project?page=${page}&limit=10`);
      if (res.status === 200) {
        set({
          allProjects: res.data.projects,
          totalPages: res.data.totalPages,
          page: page,
          totalProjects: res.data.totalProjects,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data.message);
      console.log("Error in useProjectStore (fetchAllProjects)", error);
    } finally {
      set({ isLoading: false });
    }
  },
  // delete a project
  deleteProject: async (id) => {
    try {
      const res = await axiosInstance.delete(`/project/delete/${id}`);
      if (res.status === 200) {
        set((state) => ({
          allProjects: state.allProjects.filter(
            (project) => project._id !== id
          ),
          totalProjects: state.totalProjects - 1,
        }));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Error in deleting the project (useDeleteproject)", error);
      toast.error(error?.response?.data?.message);
    }
  },

  //delete all projects
  deleteAllProjects: async () => {
    try {
      const res = await axiosInstance.delete("/project/deleteAll");
      if (res.status === 200) {
        set(() => ({
          allProjects: [],
          totalProjects: 0,
        }));
        toast.success("All projects deleted");
      }
    } catch (error) {
      console.log("Error in deleting all projects (useDeleteproject)", error);
      toast.error(error?.response?.data?.message);
    }
  },

  //update project status
  updateProjectStatus: async (id, status) => {
    try {
      console.log(status, id);
      const res = await axiosInstance.put(`/project/${id}/status`, { status });
      if (res.status === 200) {
        const updatedProject = res.data.project;

        set((state) => ({
          allProjects: state.allProjects.map((project) =>
            project._id === id ? updatedProject : project
          ),
        }));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Error in updating project status", error);
      toast.error(error?.response?.data?.message);
    }
  },
}));
export default useProjectStore;
