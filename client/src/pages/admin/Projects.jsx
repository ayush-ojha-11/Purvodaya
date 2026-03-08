import { useEffect, useState } from "react";
import useProjectStore from "../../store/useProjectStore";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  EyeIcon,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  Download,
  ChevronRight as Arrow,
} from "lucide-react";
import { formatDate } from "../../lib/helper";
import ConfirmDialog from "../../components/ConfirmDialog";
import { PROJECT_WORKFLOW } from "../../config/projectStatus";
import useAuthStore from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

/* ─── Status helpers ──────────────────────────────────────────────────── */
const COMPLETED_STATUSES = ["wifi-configured", "completed"];

const isCompleted = (status) =>
  COMPLETED_STATUSES.includes(status?.toLowerCase());

const getStatusBadge = (status) => {
  if (!status) return "bg-amber-50 text-amber-700 border-amber-200";
  const s = status.toLowerCase();
  if (COMPLETED_STATUSES.includes(s))
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "rejected") return "bg-red-50 text-red-600 border-red-200";
  return "bg-sky-50 text-sky-700 border-sky-200";
};

/* ─── Status Pipeline (visual timeline in modal) ──────────────────────── */
const StatusPipeline = ({ flow, currentStatus }) => {
  const currentIndex = flow.indexOf(currentStatus);

  return (
    <div className="mt-2">
      <div className="flex items-start gap-0 overflow-x-auto pb-2">
        {flow.map((step, i) => {
          const isPast = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isFuture = i > currentIndex;

          return (
            <div key={step} className="flex items-center shrink-0">
              {/* Node */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                    ${isPast ? "bg-emerald-500 border-emerald-500 text-white" : ""}
                    ${isCurrent ? "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100 scale-110" : ""}
                    ${isFuture ? "bg-white border-gray-300 text-gray-400" : ""}
                  `}
                >
                  {isPast ? <CheckCircle2 size={14} /> : <span>{i + 1}</span>}
                </div>
                <p
                  className={`mt-1 text-center max-w-18 leading-tight text-[10px] font-medium capitalize
                    ${isCurrent ? "text-blue-700 font-semibold" : ""}
                    ${isPast ? "text-emerald-600" : ""}
                    ${isFuture ? "text-gray-400" : ""}
                  `}
                >
                  {step}
                </p>
              </div>

              {/* Connector */}
              {i < flow.length - 1 && (
                <div
                  className={`h-0.5 w-8 -mt-4 mx-1 rounded ${
                    i < currentIndex ? "bg-emerald-400" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Mobile card ─────────────────────────────────────────────────────── */
const ProjectMobile = ({ project, onDelete, onViewFull, isAdmin }) => {
  const done = isCompleted(project.status);
  return (
    <div
      className={`
        relative bg-white rounded-xl p-4 shadow-sm border cursor-pointer
        transition hover:shadow-md active:scale-[0.99]
        ${done ? "border-emerald-200" : "border-gray-200"}
      `}
      onClick={onViewFull}
    >
      {/* Completion stripe */}
      {done && (
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-emerald-400" />
      )}

      <div className="flex justify-between items-start mb-1 pl-1">
        <h3 className="font-semibold text-gray-900">{project.clientName}</h3>
        <span
          className={`px-2 py-0.5 text-[11px] rounded-full border ${getStatusBadge(project.status)}`}
        >
          {project.status || "Pending"}
        </span>
      </div>

      <p className="font-mono text-xs text-gray-500 pl-1 mb-3">
        📞 {project.clientContact}
      </p>

      <div className="flex justify-between items-center pl-1">
        <p className="text-[11px] text-gray-400">
          Updated:{" "}
          {project.updatedAt
            ? formatDate(project.updatedAt)
            : formatDate(project.createdAt)}
        </p>
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project._id);
            }}
            className="p-1 rounded hover:bg-red-50 transition"
          >
            <Trash2 size={16} className="text-red-400" />
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── Main Component ──────────────────────────────────────────────────── */
const Projects = () => {
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
  const navigate = useNavigate();

  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [confirmState, setConfirmState] = useState({ open: false });
  const [fullProjectView, setFullProjectView] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "active" | "completed"

  useEffect(() => {
    if (!authUser) navigate("/");
  }, [authUser, navigate]);

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  useEffect(() => {
    document.body.style.overflow = fullProjectView ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [fullProjectView]);

  /* Derived counts */
  const completedProjects = allProjects.filter((p) => isCompleted(p.status));
  const activeProjects = allProjects.filter((p) => !isCompleted(p.status));

  const displayedProjects =
    activeTab === "completed"
      ? completedProjects
      : activeTab === "active"
        ? activeProjects
        : allProjects;

  /* Handlers */
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto min-h-screen pb-16 p-4">
      {/* ── Header ── */}
      <div className="flex flex-row justify-between items-start mb-6 gap-4 p-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            {isAdmin ? "Project Management" : "Projects"}
          </h2>
          <p className="text-sm text-gray-500">
            {isAdmin ? "Manage and track all projects" : "Track all projects"}
          </p>
        </div>

        {allProjects.length > 0 && isAdmin && (
          <button
            onClick={handleDeleteAll}
            disabled={isDeletingAll}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm hover:bg-red-100 transition"
          >
            <Trash2 size={14} />
            {isDeletingAll ? "Deleting..." : "Delete All"}
          </button>
        )}
      </div>

      {/* ── Stat Cards (admin only) ── */}
      {isAdmin && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-800">{totalProjects}</p>
          </div>
          <div className="bg-white rounded-xl border border-sky-200 p-4 shadow-sm">
            <p className="text-xs text-sky-600 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-sky-700">
              {activeProjects.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm">
            <p className="text-xs text-emerald-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-emerald-700">
              {completedProjects.length}
            </p>
          </div>
        </div>
      )}

      {/* ── Filter Tabs ── */}
      {allProjects.length > 0 && (
        <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { key: "all", label: `All (${allProjects.length})` },
            { key: "active", label: `Active (${activeProjects.length})` },
            { key: "completed", label: `Done (${completedProjects.length})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition
                ${
                  activeTab === key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {displayedProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <AlertTriangle size={48} className="mb-4 text-gray-300" />
          <p>No projects found</p>
        </div>
      ) : (
        <>
          {/* Mobile */}
          <div className="md:hidden space-y-3">
            {displayedProjects.map((project) => (
              <ProjectMobile
                key={project._id}
                project={project}
                isAdmin={isAdmin}
                onDelete={handleDeleteSingle}
                onViewFull={() => openFullProjectView(project)}
              />
            ))}

            {/* Mobile Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-2 pt-2">
                <p className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => fetchAllProjects(true, page - 1)}
                    className="btn"
                    disabled={page === 1}
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <button
                    onClick={() => fetchAllProjects(true, page + 1)}
                    className="btn"
                    disabled={page === totalPages}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b text-xs uppercase text-gray-500 tracking-wider">
                <tr>
                  <th className="p-4">Client</th>
                  <th className="p-4">Type / kW</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last Updated</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedProjects.map((project) => {
                  const done = isCompleted(project.status);
                  return (
                    <tr
                      key={project._id}
                      className={`hover:bg-gray-50 transition ${done ? "bg-emerald-50/30" : ""}`}
                    >
                      <td className="p-4">
                        <p className="font-medium text-gray-900">
                          {project.clientName}
                        </p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          {project.clientContact}
                        </p>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <span>{project.type}</span>
                        {project.kw && (
                          <span className="ml-1 text-gray-400">
                            · {project.kw} kW
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          {done ? (
                            <CheckCircle2
                              size={14}
                              className="text-emerald-500 shrink-0"
                            />
                          ) : (
                            <Clock
                              size={14}
                              className="text-sky-500 shrink-0"
                            />
                          )}
                          <span
                            className={`px-2.5 py-0.5 text-xs rounded-full border ${getStatusBadge(project.status)}`}
                          >
                            {project.status || "Pending"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-gray-500">
                        {project.updatedAt
                          ? formatDate(project.updatedAt)
                          : formatDate(project.createdAt)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => openFullProjectView(project)}
                            className="p-1.5 rounded-lg hover:bg-indigo-50 transition"
                            title="View Details"
                          >
                            <EyeIcon size={16} className="text-indigo-500" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteSingle(project._id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 transition"
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Desktop Pagination */}
            <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  className="btn"
                  disabled={page === 1}
                  onClick={() => fetchAllProjects(true, page - 1)}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <button
                  className="btn"
                  disabled={page === totalPages}
                  onClick={() => fetchAllProjects(true, page + 1)}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Confirm Dialog ── */}
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        green={confirmState.green}
        onCancel={() => setConfirmState({ open: false })}
        onConfirm={confirmState.onConfirm}
      />

      {/* ── Full Project Modal ── */}
      {fullProjectView &&
        selectedProject &&
        (() => {
          const flow = PROJECT_WORKFLOW[selectedProject.type] ?? [];
          const currentIndex = flow.indexOf(selectedProject.status);
          const nextStatus = flow[currentIndex + 1];
          const done = !nextStatus && currentIndex !== -1;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setFullProjectView(false)}
              />

              {/* Modal */}
              <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl mx-3">
                {/* Colored top bar */}
                <div
                  className={`h-1.5 rounded-t-2xl ${done ? "bg-emerald-400" : "bg-blue-500"}`}
                />

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Project Details
                      </h3>
                      <p className="text-sm text-gray-400">
                        Created{" "}
                        {new Date(
                          selectedProject.createdAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setFullProjectView(false)}
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition"
                    >
                      <X size={18} className="text-red-400" />
                    </button>
                  </div>

                  {/* Client Info Card */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4 flex justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-base">
                        {selectedProject.clientName}
                      </p>
                      <p className="font-mono text-sm text-gray-500 mt-0.5">
                        📞 {selectedProject.clientContact}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p className="font-medium">{selectedProject.type}</p>
                      {selectedProject.kw && (
                        <p className="text-gray-400">{selectedProject.kw} kW</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  {(selectedProject.full_address || selectedProject.city) && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">
                        Address
                      </p>
                      {selectedProject.full_address && (
                        <p className="text-sm text-gray-700">
                          {selectedProject.full_address}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {[selectedProject.city, selectedProject.pincode]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  {/* ── Status Pipeline ── */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                      Project Pipeline
                    </p>
                    {flow.length > 0 ? (
                      <StatusPipeline
                        flow={flow}
                        currentStatus={selectedProject.status}
                      />
                    ) : (
                      <p className="text-sm text-gray-400">
                        No workflow defined for this project type.
                      </p>
                    )}
                  </div>

                  {/* Current Status + Action */}
                  <div
                    className="rounded-xl border p-4 mb-4 flex items-start justify-between gap-4
                  ${done ? 'border-emerald-200 bg-emerald-50/50' : 'border-blue-100 bg-blue-50/30'}"
                  >
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                        Current Status
                      </p>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium border ${getStatusBadge(selectedProject.status)}`}
                      >
                        {selectedProject.status || "Pending"}
                      </span>

                      {isAdmin && (
                        <div className="mt-4">
                          {nextStatus ? (
                            <button
                              onClick={() => {
                                setConfirmState({
                                  open: true,
                                  title: "Advance Project Status",
                                  green: true,
                                  message: `Change status to "${nextStatus}"?`,
                                  onConfirm: async () => {
                                    await updateProjectStatus(
                                      selectedProject._id,
                                      nextStatus,
                                    );
                                    setConfirmState({ open: false });
                                    setFullProjectView(false);
                                  },
                                });
                              }}
                              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition cursor-pointer"
                            >
                              Advance to "{nextStatus}"
                              <Arrow size={14} />
                            </button>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                                <CheckCircle2 size={16} /> Project Completed 🎉
                              </p>
                              <button
                                onClick={() =>
                                  handleDownloadPDF(selectedProject)
                                }
                                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition cursor-pointer"
                              >
                                <Download size={14} />
                                Download PDF Report
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Status History ── */}
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                      Status History
                    </p>

                    {selectedProject.statusHistory?.length ? (
                      <div className="relative">
                        {/* Vertical timeline line */}
                        <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gray-200" />

                        <ul className="space-y-3 pl-9 relative">
                          {[...selectedProject.statusHistory]
                            .reverse()
                            .map((h, i) => {
                              const isFirst = i === 0;
                              return (
                                <li key={i} className="relative">
                                  {/* Dot */}
                                  <div
                                    className={`absolute -left-5.5 top-1 w-3 h-3 rounded-full border-2 ${
                                      isFirst
                                        ? "bg-blue-500 border-blue-500"
                                        : "bg-white border-gray-300"
                                    }`}
                                  />

                                  <div
                                    className={`rounded-lg border px-4 py-3 text-sm ${
                                      isFirst
                                        ? "border-blue-200 bg-blue-50"
                                        : "border-gray-100 bg-white"
                                    }`}
                                  >
                                    <div className="flex justify-between gap-4">
                                      <span
                                        className={`font-semibold capitalize ${
                                          isFirst
                                            ? "text-blue-700"
                                            : "text-gray-700"
                                        }`}
                                      >
                                        {h.status}
                                        {isFirst && (
                                          <span className="ml-2 text-[10px] font-medium bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                                            Latest
                                          </span>
                                        )}
                                      </span>
                                      <span className="text-xs text-gray-400 shrink-0">
                                        {formatDate(h.changedAt)}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                      By{" "}
                                      <span className="font-medium text-gray-600">
                                        {h.changedBy?.name ?? "System"}
                                      </span>
                                    </p>
                                  </div>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">
                        No status updates yet.
                      </p>
                    )}
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
