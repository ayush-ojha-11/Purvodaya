import { useEffect, useState } from "react";
import useProjectStore from "../../store/useProjectStore";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  EyeIcon,
  Trash2,
  X,
} from "lucide-react";
import { formatDate } from "../../lib/helper";
import ConfirmDialog from "../../components/ConfirmDialog";
import { PROJECT_WORKFLOW } from "../../config/projectStatus";
import useAuthStore from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const ProjectMobile = ({ project, getStatusBadge, onDelete, onViewFull }) => (
  <div
    className="bg-white border-gray-500 rounded-lg p-4 shadow-md shadow-blue-200"
    onClick={onViewFull}
  >
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-semibold text-gray-900">{project.clientName}</h3>
      <span
        className={`px-2 py-0.5 text-xs rounded-full border ${getStatusBadge(
          project.status
        )}`}
      >
        {project.status || "Pending"}
      </span>
    </div>
    <div className="flex justify-between">
      <p className="font-mono text-sm">📞 {project.clientContact}</p>
      <button
        className="mt-1"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(project._id);
        }}
      >
        <Trash2 size={20} className="text-red-500" />
      </button>
    </div>
    <p className="text-xs text-start mt-4">
      Last updated:{" "}
      {project.updatedAt
        ? formatDate(project.updatedAt)
        : formatDate(project.createdAt)}
    </p>
  </div>
);

const Projects = () => {
  // Zustand stores
  const {
    isLoading,
    totalProjects,
    allProjects,
    fetchAllProjects,
    deleteProject,
    deleteAllProjects,
    page,
    updateProjectStatus,
    totalPages,
  } = useProjectStore();

  const authUser = useAuthStore((state) => state.authUser);
  const isAdmin = authUser?.role === "admin";

  // hooks
  const navigate = useNavigate();
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const [fullProjectView, setFullProjectView] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Use effect hooks
  useEffect(() => {
    if (!authUser) navigate("/");
  }, [authUser, navigate]);

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  useEffect(() => {
    if (fullProjectView) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [fullProjectView]);

  const handleDeleteSingle = (id) => {
    setConfirmState({
      open: true,
      title: "Delete Project",
      message: "Delete this project? This cannot be undone.",
      onConfirm: async () => {
        await deleteProject(id);
        setConfirmState({ open: false });
      },
    });
  };

  const handleDeleteAll = () => {
    setConfirmState({
      open: true,
      title: "Delete All Projects",
      message: "Delete all projects? This cannot be undone.",
      onConfirm: async () => {
        setIsDeletingAll(true);
        await deleteAllProjects();
        setConfirmState({ open: false });
        setIsDeletingAll(false);
      },
    });
  };

  const handleDownloadPDF = async (project) => {
    const { downloadProjectPDF } = await import("../../lib/pdf.js");
    downloadProjectPDF(project);
  };

  const openFullProjectView = (project) => {
    setSelectedProject(project);
    setFullProjectView(true);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "wifi-configured":
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto min-h-screen pb-16 p-4">
      <div className="flex flex-row justify-between items-center mb-6 gap-4 p-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            {isAdmin ? "Project Management" : "Projects"}
          </h2>
          <p className="text-sm text-gray-500">
            {isAdmin ? "Manage and track all Projects" : "Track all projects"}
          </p>
          <p className="font-mono mt-1">Total Projects: {totalProjects}</p>
        </div>

        {allProjects.length > 0 && isAdmin && (
          <button
            onClick={handleDeleteAll}
            disabled={isDeletingAll}
            className="flex items-center gap-2 px-2 py-1 bg-red-50 text-red-600 border rounded-lg text-sm hover:cursor-pointer"
          >
            <Trash2 size={14} />
            {isDeletingAll ? "Deleting..." : "Delete All"}
          </button>
        )}
      </div>
      {/* Empty */}
      {allProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <AlertTriangle size={48} className="mb-4 text-gray-300" />
          <p>No projects found</p>
        </div>
      ) : (
        <>
          {/* Mobile */}
          <div className="md:hidden space-y-4">
            {allProjects.map((project) => (
              <ProjectMobile
                key={project._id}
                project={project}
                getStatusBadge={getStatusBadge}
                onDelete={handleDeleteSingle}
                onViewFull={() => openFullProjectView(project)}
              />
            ))}
            <div
              className={`flex-col item-center justify-center ${
                page === totalPages ? "hidden" : "flex"
              }`}
            >
              <p className="text-center mb-1">
                Page: {page} of {totalPages}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => fetchAllProjects(true, page - 1)}
                  className="btn"
                  disabled={page === 1}
                >
                  Prev <ChevronLeft />
                </button>
                <button
                  onClick={() => fetchAllProjects(true, page + 1)}
                  className="btn"
                  disabled={page === totalPages}
                >
                  <ChevronRight /> Next
                </button>
              </div>
            </div>
          </div>
          {/* Desktop */}
          <div className="hidden md:block bg-white rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b text-xs uppercase">
                <tr>
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last updated</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allProjects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{project.clientName}</td>
                    <td className="p-4">{project.clientContact}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full border ${getStatusBadge(
                          project.status
                        )}`}
                      >
                        {project.status || "Pending"}
                      </span>
                    </td>
                    <td className="text-xs p-4">
                      {project.updatedAt
                        ? formatDate(project.updatedAt)
                        : formatDate(project.createdAt)}
                    </td>
                    <td className="p-4 space-x-5 text-right">
                      <EyeIcon
                        onClick={() => openFullProjectView(project)}
                        size={20}
                        className="inline text-indigo-500 cursor-pointer"
                      />
                      {isAdmin && (
                        <Trash2
                          onClick={() => handleDeleteSingle(project._id)}
                          size={20}
                          className="inline text-red-500 cursor-pointer"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Desktop Pagination */}
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-4">
                <button
                  className="btn"
                  disabled={page === 1}
                  onClick={() => fetchAllProjects(true, page - 1)}
                >
                  Prev <ChevronLeft size={16} />
                </button>
                <button
                  className="btn"
                  disabled={page === totalPages}
                  onClick={() => fetchAllProjects(true, page + 1)}
                >
                  <ChevronRight size={16} /> Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        onCancel={() => setConfirmState({ open: false })}
        onConfirm={confirmState.onConfirm}
      />
      {fullProjectView &&
        selectedProject &&
        (() => {
          const flow = PROJECT_WORKFLOW[selectedProject.type];
          const currentIndex = flow.indexOf(selectedProject.status);
          const nextStatus = flow[currentIndex + 1];

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/30 backdrop-blur-xs"
                onClick={() => setFullProjectView(false)}
              />

              {/* Modal */}
              <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 mx-2">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Project Details
                  </h3>
                  <button
                    onClick={() => setFullProjectView(false)}
                    className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Close <X className="text-red-500" size={18} />
                  </button>
                </div>

                {/* Client Info */}
                <p className="mb-2 text-sm text-gray-500">Client Info</p>
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{selectedProject.clientName}</p>
                    <p className="text-sm text-gray-600">
                      {selectedProject.clientContact}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p>Type: {selectedProject.type}</p>
                    <p>kW: {selectedProject.kw}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{selectedProject.full_address || "-"}</p>
                  <p className="text-sm text-gray-600">
                    {selectedProject.city}, {selectedProject.pincode}
                  </p>
                </div>

                <hr className="my-5" />

                {/* Status */}
                <div>
                  <p className="mb-2 text-sm text-gray-500">Current Status</p>

                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                        {selectedProject.status}
                      </span>

                      {nextStatus ? (
                        <div className="mt-4">
                          <button
                            onClick={() => {
                              updateProjectStatus(
                                selectedProject._id,
                                nextStatus
                              );
                              setFullProjectView(false);
                            }}
                            className="cursor-pointer rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                          >
                            Change to “{nextStatus}”
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="mt-4 text-sm font-medium text-green-700">
                            Project completed 🎉
                          </p>
                          <button
                            onClick={() => handleDownloadPDF(selectedProject)}
                            className="mt-3 rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer"
                          >
                            Download Project PDF
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Time */}
                    <div className="text-right text-xs text-gray-500">
                      <p>Started:</p>
                      <p>
                        {new Date(
                          selectedProject.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="my-5" />

                {/* Status History */}
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Status History
                  </p>

                  <div className="max-h-64 overflow-y-auto pr-2">
                    <ul className="space-y-2">
                      {selectedProject.statusHistory?.length ? (
                        selectedProject.statusHistory.map((h, i) => (
                          <li
                            key={i}
                            className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition hover:bg-gray-50"
                          >
                            <span className="font-medium capitalize text-gray-800">
                              {h.status}
                            </span>

                            <div className="text-right">
                              <p className="text-xs text-gray-400">
                                {formatDate(h.changedAt)}
                              </p>
                              <p className="mt-1 text-xs text-gray-600">
                                Marked completed by{" "}
                                <span className="font-medium text-gray-800">
                                  {h.changedBy?.name ?? "System"}
                                </span>
                              </p>
                            </div>
                          </li>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">
                          No status updates yet
                        </p>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default Projects;
