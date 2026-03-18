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
  CreditCard,
  Banknote,
  MapPin,
  Phone,
  Zap,
  User,
  Mail,
  Clock,
} from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../lib/helper";

/* ─── Helpers ─────────────────────────────────────────────────────────── */
const TYPE_LABELS = {
  hybrid: "Hybrid",
  "on-grid": "On Grid",
  "off-grid": "Off Grid",
};

const PaymentBadge = ({ type }) => {
  if (!type) return null;
  const isLoan = type === "loan";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border
      ${
        isLoan
          ? "bg-purple-50 text-purple-700 border-purple-200"
          : "bg-emerald-50 text-emerald-700 border-emerald-200"
      }`}
    >
      {isLoan ? <CreditCard size={10} /> : <Banknote size={10} />}
      {isLoan ? "Loan" : "Cash"}
    </span>
  );
};

/* ─── Pagination ──────────────────────────────────────────────────────── */
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);
    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push("...");
    }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages) {
      if (right < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };
  return (
    <div className="flex items-center gap-1">
      <button
        className="btn"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={16} />
      </button>
      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`e-${i}`} className="px-2 text-gray-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition
              ${p === page ? "bg-amber-400 text-white shadow-sm" : "hover:bg-gray-100 text-gray-600"}`}
          >
            {p}
          </button>
        ),
      )}
      <button
        className="btn"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

/* ─── Mobile Card ─────────────────────────────────────────────────────── */
const LeadCard = ({
  lead,
  onApprove,
  onReject,
  onDelete,
  onViewFull,
  isAdmin,
}) => (
  <div
    className="relative bg-white rounded-xl p-4 shadow-sm border border-amber-200 cursor-pointer transition hover:shadow-md active:scale-[0.99]"
    onClick={onViewFull}
  >
    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-amber-400" />
    <div className="pl-1">
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-semibold text-gray-900">{lead.clientName}</h3>
        <span className="px-2 py-0.5 text-[11px] rounded-full border bg-amber-50 text-amber-700 border-amber-200">
          Pending
        </span>
      </div>
      <p className="text-xs font-mono text-gray-500 mb-0.5">
        📞 {lead.clientContact}
      </p>
      <p className="text-xs text-gray-400 mb-2">📍 {lead.city || "—"}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {lead.type && (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[11px] font-medium">
            <Zap size={9} /> {TYPE_LABELS[lead.type] || lead.type}
          </span>
        )}
        {lead.kw && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[11px] font-medium">
            {lead.kw} kW
          </span>
        )}
        <PaymentBadge type={lead.paymentType} />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-[10px] text-gray-400">
            By: {lead?.employeeId?.name || "NA"}
          </p>
          <p className="text-[10px] text-gray-300">
            {lead.updatedAt
              ? formatDate(lead.updatedAt)
              : formatDate(lead.createdAt)}
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApprove();
              }}
              className="p-1.5 rounded-lg hover:bg-emerald-50 transition"
            >
              <CheckCircle size={17} className="text-emerald-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReject();
              }}
              className="p-1.5 rounded-lg hover:bg-orange-50 transition"
            >
              <XCircle size={17} className="text-orange-500" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(lead._id);
              }}
              className="p-1.5 rounded-lg hover:bg-red-50 transition"
            >
              <Trash2 size={17} className="text-red-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

/* ─── Main ────────────────────────────────────────────────────────────── */
const Leads = () => {
  const {
    allLeads,
    isLoading,
    fetchAllLeads,
    totalPendingLeads,
    deleteLead,
    deleteAllLeads,
    updateLeadStatus,
    page,
    totalPages,
  } = useLeadStore();

  const authUser = useAuthStore((state) => state.authUser);
  const isAdmin = authUser?.role === "admin";
  const navigate = useNavigate();

  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [confirmState, setConfirmState] = useState({
    open: false,
    green: false,
  });
  const [fullLeadView, setFullLeadView] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    if (!authUser) navigate("/");
  });
  useEffect(() => {
    document.body.style.overflow = fullLeadView ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [fullLeadView]);
  useEffect(() => {
    fetchAllLeads();
  }, [fetchAllLeads]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const pendingLeads = allLeads.filter(
    (l) => !l.status || l.status.toLowerCase() === "pending",
  );

  const handleDeleteAll = () => {
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
      title: "Delete Lead",
      message: "Delete this lead? This cannot be undone.",
      onConfirm: async () => {
        await deleteLead(id);
        setConfirmState({ open: false });
      },
    });
  };

  const handleLeadStatus = (lead, status) => {
    const isConfirm = status === "confirmed";
    setConfirmState({
      open: true,
      green: isConfirm,
      title: isConfirm ? "Confirm Lead" : "Reject Lead",
      message: `${isConfirm ? "Confirm" : "Reject"} lead for ${lead.clientName}?`,
      onConfirm: async () => {
        await updateLeadStatus(lead._id, status);
        setConfirmState({ open: false });
      },
    });
  };

  if (isLoading && page === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto min-h-screen pb-16 p-4">
      {/* Header */}
      <div className="flex flex-row justify-between items-start mb-6 gap-4 p-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            {isAdmin ? "Lead Management" : "Leads"}
          </h2>
          <p className="text-sm text-gray-500">
            {isAdmin
              ? "Manage and track incoming leads"
              : "See all listed leads"}
          </p>
          <p className="font-mono mt-1 text-sm">Pending: {totalPendingLeads}</p>
        </div>
        {isAdmin && pendingLeads.length > 0 && (
          <button
            onClick={handleDeleteAll}
            disabled={isDeletingAll}
            className="hidden items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm hover:bg-red-100 transition"
          >
            <Trash2 size={14} />
            {isDeletingAll ? "Deleting..." : "Delete All"}
          </button>
        )}
      </div>

      {/* Empty */}
      {pendingLeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <AlertTriangle size={48} className="mb-4 text-gray-300" />
          <p>No pending leads</p>
        </div>
      ) : (
        <>
          {/* Mobile */}
          <div className="md:hidden space-y-3">
            {pendingLeads.map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                isAdmin={isAdmin}
                onApprove={() => handleLeadStatus(lead, "confirmed")}
                onReject={() => handleLeadStatus(lead, "rejected")}
                onDelete={handleDeleteSingle}
                onViewFull={() => {
                  setSelectedLead(lead);
                  setFullLeadView(true);
                }}
              />
            ))}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-2 pt-2">
                <p className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </p>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(p) => fetchAllLeads(true, p)}
                />
              </div>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b text-xs uppercase text-gray-500 tracking-wider">
                <tr>
                  <th className="p-4">Client</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Project</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Submitted By</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-amber-50/30 transition"
                  >
                    <td className="p-4">
                      <p className="font-medium text-gray-900">
                        {lead.clientName}
                      </p>
                      <p className="text-xs font-mono text-gray-400 mt-0.5">
                        {lead.clientContact}
                      </p>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {lead.city || "—"}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium w-fit">
                          <Zap size={10} />{" "}
                          {TYPE_LABELS[lead.type] || lead.type || "—"}
                        </span>
                        {lead.kw && (
                          <span className="text-xs text-gray-400">
                            {lead.kw} kW
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <PaymentBadge type={lead.paymentType} />
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {lead?.employeeId?.name || "NA"}
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {lead.updatedAt
                        ? formatDate(lead.updatedAt)
                        : formatDate(lead.createdAt)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setFullLeadView(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-indigo-50 transition"
                        >
                          <EyeIcon size={16} className="text-indigo-500" />
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() =>
                                handleLeadStatus(lead, "confirmed")
                              }
                              className="p-1.5 rounded-lg hover:bg-emerald-50 transition cursor-pointer"
                            >
                              <CheckCircle
                                size={16}
                                className="text-emerald-600"
                              />
                            </button>
                            <button
                              onClick={() => handleLeadStatus(lead, "rejected")}
                              className="p-1.5 rounded-lg hover:bg-orange-50 transition cursor-pointer"
                            >
                              <XCircle size={16} className="text-orange-500" />
                            </button>
                            <button
                              onClick={() => handleDeleteSingle(lead._id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 transition"
                            >
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => fetchAllLeads(true, p)}
              />
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

      {/* ── Modal ── */}
      {fullLeadView && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-2">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setFullLeadView(false)}
          />
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl mx-3">
            {/* Top bar — purple for loan, emerald for cash */}
            <div
              className={`h-1.5 rounded-t-2xl ${selectedLead.paymentType === "loan" ? "bg-purple-400" : "bg-amber-400"}`}
            />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Lead Details
                  </h3>
                  <p className="text-sm text-gray-400">
                    Submitted{" "}
                    {new Date(selectedLead.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setFullLeadView(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition"
                >
                  <X size={18} className="text-red-400" />
                </button>
              </div>

              {/* Payment type banner */}
              <div
                className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-4 border
                ${
                  selectedLead.paymentType === "loan"
                    ? "bg-purple-50 border-purple-200"
                    : "bg-emerald-50 border-emerald-200"
                }`}
              >
                {selectedLead.paymentType === "loan" ? (
                  <CreditCard size={18} className="text-purple-600 shrink-0" />
                ) : (
                  <Banknote size={18} className="text-emerald-600 shrink-0" />
                )}
                <div>
                  <p
                    className={`text-sm font-semibold ${selectedLead.paymentType === "loan" ? "text-purple-700" : "text-emerald-700"}`}
                  >
                    {selectedLead.paymentType === "loan"
                      ? "Loan Financed"
                      : "Cash Payment"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedLead.paymentType === "loan"
                      ? "This project will include a loan approval step in the workflow"
                      : "Direct cash payment — no loan step in workflow"}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              {isAdmin && (
                <div className="flex gap-2 mb-5">
                  <button
                    onClick={() => {
                      setFullLeadView(false);
                      handleLeadStatus(selectedLead, "confirmed");
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition cursor-pointer"
                  >
                    <CheckCircle size={15} /> Confirm Lead
                  </button>
                  <button
                    onClick={() => {
                      setFullLeadView(false);
                      handleLeadStatus(selectedLead, "rejected");
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition cursor-pointer"
                  >
                    <XCircle size={15} /> Reject Lead
                  </button>
                </div>
              )}

              {/* Client Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-3">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                  Client Info
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <User size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Name</p>
                      <p className="font-semibold text-gray-800">
                        {selectedLead.clientName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone
                      size={14}
                      className="text-gray-400 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-xs text-gray-400">Contact</p>
                      <p className="font-mono text-sm text-gray-700">
                        {selectedLead.clientContact}
                      </p>
                    </div>
                  </div>
                  {selectedLead.full_address && (
                    <div className="sm:col-span-2 flex items-start gap-2">
                      <MapPin
                        size={14}
                        className="text-gray-400 mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-xs text-gray-400">Address</p>
                        <p className="text-sm text-gray-700">
                          {selectedLead.full_address}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {[selectedLead.city, selectedLead.pincode]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-3">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                  Project Info
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-start gap-2">
                    <Zap size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Type</p>
                      <span className="inline-block mt-1 rounded-lg bg-blue-100 px-2.5 py-1 text-sm font-medium text-blue-700">
                        {TYPE_LABELS[selectedLead.type] || selectedLead.type}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Capacity</p>
                    <p className="font-semibold text-gray-800 mt-1">
                      {selectedLead.kw} kW
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Payment</p>
                    <div className="mt-1">
                      <PaymentBadge type={selectedLead.paymentType} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-start text-sm">
                <div className="flex items-start gap-2">
                  <Mail size={14} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Submitted By</p>
                    <p className="font-medium text-gray-800">
                      {selectedLead.employeeId?.name || "NA"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedLead.employeeId?.email || ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1 flex items-center justify-end gap-1">
                    <Clock size={11} /> Timestamps
                  </p>
                  <p className="text-xs text-gray-600">
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
                  <p className="text-xs text-gray-600 mt-0.5">
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
        </div>
      )}
    </div>
  );
};

export default Leads;
