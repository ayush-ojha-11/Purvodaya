import { useEffect, useState } from "react";
import useLeadStore from "../../store/useLeadStore";
import {
  Trash2,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  EyeIcon,
  X,
} from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../lib/helper";
import toast from "react-hot-toast";

/* -------------------- Mobile Card -------------------- */
const LeadCard = ({
  lead,
  getStatusBadge,
  onApprove,
  onReject,
  onDelete,
  onViewFull,
}) => (
  <div
    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
    onClick={onViewFull}
  >
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-semibold text-gray-900">{lead.clientName}</h3>
      <span
        className={`px-2 py-0.5 text-xs rounded-full border ${getStatusBadge(
          lead.status
        )}`}
      >
        {lead.status || "Pending"}
      </span>
    </div>

    <p className="text-sm text-gray-600 mb-1">📞 {lead.clientContact}</p>
    <p className="text-xs text-gray-600 mb-3">
      Submitted by: {lead?.employeeId?.name || "NA"}
    </p>

    <div className="flex justify-between items-center">
      <p className="text-xs">
        Last updated:{" "}
        {lead.updatedAt
          ? formatDate(lead.updatedAt)
          : formatDate(lead.createdAt)}
      </p>
      <div className="flex gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onApprove();
          }}
          className="p-2 text-green-600 hover:bg-green-50 rounded-full"
        >
          <CheckCircle size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReject();
          }}
          className="p-2 text-orange-500 hover:bg-orange-50 rounded-full"
        >
          <XCircle size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(lead._id);
          }}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  </div>
);

/* -------------------- Main -------------------- */
const Leads = () => {
  const {
    allLeads,
    isLoading,
    fetchAllLeads,
    totalLeads,
    deleteLead,
    deleteAllLeads,
    updateLeadStatus,
    page,
    totalPages,
  } = useLeadStore();
  const authUser = useAuthStore((state) => state.authUser);
  const navigate = useNavigate();

  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [confirmState, setConfirmState] = useState({
    open: false,
    green: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const [fullLeadView, setFullLeadView] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    if (!authUser) navigate("/");
  });

  useEffect(() => {
    fetchAllLeads(true, 1); // reset on mount
  }, [fetchAllLeads]);

  // handle delete
  const handleDeleteAll = async () => {
    setConfirmState({
      open: true,
      title: "Delete All Leads",
      message: "Delete all leads? This cannot be undone.",
      onConfirm: async () => {
        setIsDeletingAll(true);
        await deleteAllLeads();
        setConfirmState({ open: false });
        setIsDeletingAll(false);
      },
    });
  };

  const handleDeleteSingle = (id) => {
    setConfirmState({
      open: true,
      title: "Delete lead",
      message: "Delete this lead? This cannot be undone.",
      onConfirm: async () => {
        await deleteLead(id);
        setConfirmState({ open: false });
      },
    });
  };

  // handle reject and confirm of lead
  const handleLeadStatus = async (lead, status) => {
    if (status === "rejected") {
      setConfirmState({
        open: true,
        title: "Reject Lead",
        message: `Reject ${lead.clientName} lead?`,
        onConfirm: async () => {
          await updateLeadStatus(lead._id, "rejected");
          setConfirmState({ open: false });
        },
      });
    }
    if (status === "confirmed") {
      setConfirmState({
        open: true,
        title: "Confirm Lead",
        green: true,
        message: `Confirm ${lead.clientName} lead?`,
        onConfirm: async () => {
          await updateLeadStatus(lead._id, "confirmed");
          setConfirmState({ open: false });
        },
      });
    }
  };

  const openFullLeadView = (lead) => {
    setSelectedLead(lead);
    setFullLeadView(true);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  if (isLoading && page === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto min-h-screen pb-16 p-4">
      {/* Header */}
      <div className="flex flex-row justify-between items-center mb-6 gap-4 p-2">
        <div>
          <h2 className="text-2xl font-bold text-primary">Lead Management</h2>
          <p className="text-sm text-gray-500">
            Manage and track incoming leads
          </p>
          <p className="font-mono mt-1">Total leads: {totalLeads}</p>
        </div>

        {allLeads.length > 0 && (
          <button
            onClick={handleDeleteAll}
            disabled={isDeletingAll}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border rounded-lg text-sm"
          >
            <Trash2 size={16} />
            {isDeletingAll ? "Deleting..." : "Delete All"}
          </button>
        )}
      </div>

      {/* Empty */}
      {allLeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <AlertTriangle size={48} className="mb-4 text-gray-300" />
          <p>No leads found</p>
        </div>
      ) : (
        <>
          {/* ---------------- Mobile ---------------- */}
          <div className="md:hidden space-y-4">
            {allLeads.map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                getStatusBadge={getStatusBadge}
                onApprove={() => handleLeadStatus(lead, "confirmed")}
                onReject={() => handleLeadStatus(lead, "rejected")}
                onDelete={handleDeleteSingle}
                onViewFull={() => openFullLeadView(lead)}
              />
            ))}

            <div className="flex flex-col item-center justify-center">
              <p className="text-center mb-1">
                Page: {page} of {totalPages}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => fetchAllLeads(true, page - 1)}
                  className="btn"
                  disabled={page === 1}
                >
                  Prev <ChevronLeft />
                </button>
                <button
                  onClick={() => fetchAllLeads(true, page + 1)}
                  className="btn"
                  disabled={page === totalPages}
                >
                  <ChevronRight /> Next
                </button>
              </div>
            </div>
          </div>

          {/* ---------------- Desktop ---------------- */}
          <div className="hidden md:block bg-white rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b text-xs uppercase">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Sent By</th>
                  <th className="p-4">Last updated</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {allLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{lead.clientName}</td>
                    <td className="p-4">{lead.clientContact}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full border ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        {lead.status || "Pending"}
                      </span>
                    </td>
                    <td className="p-4">{lead?.employeeId?.name || "NA"}</td>
                    <td className="p-4 text-xs">
                      {lead.updatedAt
                        ? formatDate(lead.updatedAt)
                        : formatDate(lead.createdAt)}
                    </td>
                    <td className="p-4 text-right space-x-5">
                      <EyeIcon
                        size={18}
                        className="inline text-indigo-500 cursor-pointer"
                        onClick={() => openFullLeadView(lead)}
                      />
                      <CheckCircle
                        size={18}
                        className={` inline ${
                          lead.status === "confirmed"
                            ? "text-gray-400 cursor-not-allowed opacity-60"
                            : "text-green-600 cursor-pointer hover:scale-105"
                        }
                        `}
                        onClick={() => {
                          if (lead.status === "confirmed") return;
                          handleLeadStatus(lead, "confirmed");
                        }}
                      />
                      <XCircle
                        size={18}
                        className={`inline ${
                          lead.status === "confirmed" ||
                          lead.status === "rejected"
                            ? "text-gray-400 cursor-not-allowed opacity-60"
                            : "text-orange-500 cursor-pointer hover:scale-105"
                        }`}
                        onClick={() => {
                          if (
                            lead.status === "confirmed" ||
                            lead.status === "rejected"
                          )
                            return;
                          handleLeadStatus(lead, "rejected");
                        }}
                      />
                      <Trash2
                        size={18}
                        className="inline text-red-600 cursor-pointer"
                        onClick={() => handleDeleteSingle(lead._id)}
                      />
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
                  onClick={() => fetchAllLeads(true, page - 1)}
                >
                  Prev <ChevronLeft size={16} />
                </button>
                <button
                  className="btn"
                  disabled={page === totalPages}
                  onClick={() => fetchAllLeads(true, page + 1)}
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
        green={confirmState.green}
        message={confirmState.message}
        onCancel={() => setConfirmState({ open: false })}
        onConfirm={confirmState.onConfirm}
      />
      {fullLeadView && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-xs"
            onClick={() => setFullLeadView(false)}
          ></div>
          <div className="relative mx-4 md:mx-0 w-full max-w-3xl mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Lead Details
              </h3>

              <button
                onClick={() => setFullLeadView(false)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                Close <X className="text-red-500" size={18} />
              </button>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Client Name</p>
                <p className="font-medium">{selectedLead.clientName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{selectedLead.clientContact}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{selectedLead.full_address}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="font-medium">{selectedLead.city}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Pincode</p>
                <p className="font-medium">{selectedLead.pincode}</p>
              </div>
            </div>

            <hr className="my-5" />

            {/* Project Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <span className="inline-block rounded bg-blue-100 px-2 py-1 text-sm font-medium text-blue-700">
                  {selectedLead.type}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500">Capacity (kW)</p>
                <p className="font-medium">{selectedLead.kw}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-block rounded px-2 py-1 text-sm font-medium
            ${
              selectedLead.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : selectedLead.status === "confirmed"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
                >
                  {selectedLead.status}
                </span>
              </div>
            </div>

            {/* Rejection reason */}
            {selectedLead.status === "rejected" && (
              <div className="mt-4 rounded border border-red-200 bg-red-50 p-3">
                <p className="text-sm font-medium text-red-700">
                  Rejection Reason
                </p>
                <p className="text-sm text-red-600">
                  {selectedLead.rejectionReason || "Not specified"}
                </p>
              </div>
            )}

            <hr className="my-5" />

            {/* Employee Info */}
            <div className="flex flex-col md:flex-row md:justify-between text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-800">
                  Submitted By: {selectedLead.employeeId?.name}
                </p>
                <p>{selectedLead.employeeId?.email}</p>
              </div>

              <div className="mt-3 md:mt-0 text-right">
                <p>
                  Created:{" "}
                  {new Date(selectedLead.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </p>
                <p>
                  Updated:{" "}
                  {new Date(selectedLead.updatedAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
