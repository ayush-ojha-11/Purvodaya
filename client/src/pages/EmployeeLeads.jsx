import { useEffect, useState } from "react";
import useLeadStore from "../store/useLeadStore.js";
import { formatDate } from "../lib/helper.js";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";
import {
  Plus,
  X,
  ChevronRight,
  MapPin,
  Phone,
  Zap,
  CreditCard,
  Banknote,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Home,
  Layers,
} from "lucide-react";

/* ─── Constants ───────────────────────────────────────────────────────── */
const STEPS = ["Client", "Address", "Project"];

const EMPTY_FORM = {
  clientName: "",
  clientContact: "",
  full_address: "",
  city: "",
  pincode: "",
  type: "",
  kw: "",
  paymentType: "",
};

const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle,
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    cls: "bg-amber-50 text-amber-700 border-amber-200",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    cls: "bg-red-50 text-red-600 border-red-200",
  },
};

const TYPE_LABELS = {
  hybrid: "Hybrid",
  "on-grid": "On Grid",
  "off-grid": "Off Grid",
};

/* ─── Step indicators ─────────────────────────────────────────────────── */
const StepBar = ({ current }) => (
  <div className="flex items-center justify-center gap-0 mb-6">
    {STEPS.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
              ${done ? "bg-blue-600 border-blue-600 text-white" : ""}
              ${active ? "bg-white border-blue-600 text-blue-600 shadow-md scale-110" : ""}
              ${!done && !active ? "bg-gray-100 border-gray-300 text-gray-400" : ""}
            `}
            >
              {done ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span
              className={`text-[10px] mt-1 font-medium ${active ? "text-blue-600" : done ? "text-blue-500" : "text-gray-400"}`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-12 h-0.5 mb-4 mx-1 rounded transition-all duration-300 ${i < current ? "bg-blue-500" : "bg-gray-200"}`}
            />
          )}
        </div>
      );
    })}
  </div>
);

/* ─── Field wrapper ───────────────────────────────────────────────────── */
const Field = ({ label, icon: Icon, error, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
      {Icon && <Icon size={12} />} {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl px-3 py-2.5 text-sm outline-none transition ${className}`}
    {...props}
  />
);

const Select = ({ className = "", children, ...props }) => (
  <select
    className={`w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl px-3 py-2.5 text-sm outline-none transition ${className}`}
    {...props}
  >
    {children}
  </select>
);

/* ─── Payment type pill selector ──────────────────────────────────────── */
const PaymentPicker = ({ value, onChange }) => (
  <div className="grid grid-cols-2 gap-3">
    {[
      {
        val: "cash",
        label: "Cash",
        icon: Banknote,
        desc: "Direct payment",
        color: "emerald",
      },
      {
        val: "loan",
        label: "Loan",
        icon: CreditCard,
        desc: "Financed",
        color: "blue",
      },
      // eslint-disable-next-line no-unused-vars
    ].map(({ val, label, icon: Icon, desc, color }) => (
      <button
        key={val}
        type="button"
        onClick={() => onChange(val)}
        className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
          ${
            value === val
              ? color === "emerald"
                ? "border-emerald-500 bg-emerald-50 shadow-md scale-[1.02]"
                : "border-blue-500 bg-blue-50 shadow-md scale-[1.02]"
              : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white"
          }`}
      >
        {value === val && (
          <div
            className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center
            ${color === "emerald" ? "bg-emerald-500" : "bg-blue-500"}`}
          >
            <CheckCircle size={10} className="text-white" />
          </div>
        )}
        <Icon
          size={22}
          className={
            value === val
              ? color === "emerald"
                ? "text-emerald-600"
                : "text-blue-600"
              : "text-gray-400"
          }
        />
        <div className="text-center">
          <p
            className={`text-sm font-semibold ${
              value === val
                ? color === "emerald"
                  ? "text-emerald-700"
                  : "text-blue-700"
                : "text-gray-600"
            }`}
          >
            {label}
          </p>
          <p className="text-[10px] text-gray-400">{desc}</p>
        </div>
      </button>
    ))}
  </div>
);

/* ─── Type picker ─────────────────────────────────────────────────────── */
const TypePicker = ({ value, onChange }) => (
  <div className="grid grid-cols-3 gap-2">
    {[
      { val: "on-grid", label: "On Grid", emoji: "⚡" },
      { val: "off-grid", label: "Off Grid", emoji: "🔋" },
      { val: "hybrid", label: "Hybrid", emoji: "🔄" },
    ].map(({ val, label, emoji }) => (
      <button
        key={val}
        type="button"
        onClick={() => onChange(val)}
        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200
          ${
            value === val
              ? "border-blue-500 bg-blue-50 shadow-sm scale-[1.02]"
              : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white"
          }`}
      >
        <span className="text-xl">{emoji}</span>
        <span
          className={`text-xs font-semibold ${value === val ? "text-blue-700" : "text-gray-500"}`}
        >
          {label}
        </span>
      </button>
    ))}
  </div>
);

/* ─── Review row ──────────────────────────────────────────────────────── */
const ReviewRow = ({ label, value }) => (
  <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
    <span className="text-xs text-gray-400 uppercase tracking-wider">
      {label}
    </span>
    <span className="text-sm font-medium text-gray-800 text-right max-w-[60%]">
      {value || "—"}
    </span>
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────── */
const EmployeeLeads = () => {
  const { leads, submitLead, fetchLeads } = useLeadStore();
  const authUser = useAuthStore((state) => state.authUser);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authUser) navigate("/");
  });
  useEffect(() => {
    fetchLeads(true);
  }, [fetchLeads]);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const set = (field) => (e) =>
    setForm((f) => ({
      ...f,
      [field]: typeof e === "string" ? e : e.target.value,
    }));

  /* Validation per step */
  const validate = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.clientName.trim()) e.clientName = "Name is required";
      if (!form.clientContact.trim()) e.clientContact = "Contact is required";
      else if (!/^\d{10}$/.test(form.clientContact))
        e.clientContact = "Enter a valid 10-digit number";
    }
    if (s === 1) {
      if (!form.full_address.trim()) e.full_address = "Address is required";
      if (!form.city.trim()) e.city = "City is required";
      if (!form.pincode.trim()) e.pincode = "Pincode is required";
      else if (!/^\d{6}$/.test(form.pincode))
        e.pincode = "Enter a valid 6-digit pincode";
    }
    if (s === 2) {
      if (!form.type) e.type = "Select a project type";
      if (!form.kw.trim()) e.kw = "kW is required";
      if (!form.paymentType) e.paymentType = "Select payment type";
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const back = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const openModal = () => {
    setForm(EMPTY_FORM);
    setStep(0);
    setErrors({});
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setStep(0);
    setErrors({});
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await submitLead(form);
    await fetchLeads(true);
    setSubmitting(false);
    closeModal();
  };

  /* Stats */
  const pending = leads.filter((l) => l.status === "pending").length;
  const confirmed = leads.filter((l) => l.status === "confirmed").length;
  const rejected = leads.filter((l) => l.status === "rejected").length;

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 min-h-screen">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Leads</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {authUser?.name
            ? `Hi ${authUser.name.split(" ")[0]} 👋`
            : "Track your submitted leads"}
        </p>
      </div>

      {/* ── Stat pills ── */}
      {leads.length > 0 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          {[
            {
              label: "Total",
              val: leads.length,
              cls: "bg-gray-100 text-gray-700",
            },
            {
              label: "Pending",
              val: pending,
              cls: "bg-amber-50 text-amber-700 border border-amber-200",
            },
            {
              label: "Confirmed",
              val: confirmed,
              cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
            },
            {
              label: "Rejected",
              val: rejected,
              cls: "bg-red-50 text-red-600 border border-red-200",
            },
          ].map(({ label, val, cls }) => (
            <span
              key={label}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}
            >
              {val} {label}
            </span>
          ))}
        </div>
      )}

      {/* ── Leads list ── */}
      {leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Layers size={28} className="text-gray-300" />
          </div>
          <p className="font-medium">No leads yet</p>
          <p className="text-sm mt-1">
            Tap the button below to add your first lead
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => {
            const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.pending;
            const StatusIcon = cfg.icon;
            return (
              <div
                key={lead._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition"
              >
                {/* Top row */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {lead.clientName}
                    </h2>
                    <p className="text-xs font-mono text-gray-400 mt-0.5">
                      📞 {lead.clientContact}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.cls}`}
                  >
                    <StatusIcon size={11} />
                    {cfg.label}
                  </span>
                </div>

                {/* Tags row */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    <Zap size={10} /> {TYPE_LABELS[lead.type] || lead.type}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    ⚡ {lead.kw} kW
                  </span>
                  {lead.paymentType && (
                    <span
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                      ${
                        lead.paymentType === "loan"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {lead.paymentType === "loan" ? (
                        <CreditCard size={10} />
                      ) : (
                        <Banknote size={10} />
                      )}
                      {lead.paymentType === "loan" ? "Loan" : "Cash"}
                    </span>
                  )}
                </div>

                {/* Address + date */}
                <div className="flex justify-between items-end">
                  <p className="text-xs text-gray-400 flex items-start gap-1">
                    <MapPin size={11} className="mt-0.5 shrink-0" />
                    <span>
                      {lead.city}
                      {lead.pincode ? `, ${lead.pincode}` : ""}
                    </span>
                  </p>
                  <p className="text-[11px] text-gray-300">
                    {formatDate(lead.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── FAB ── */}
      <button
        onClick={openModal}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-full shadow-lg shadow-blue-200 flex items-center justify-center transition-all duration-200 z-40"
      >
        <Plus size={24} />
      </button>

      {/* ── Modal ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Sheet */}
          <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Handle bar (mobile) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            <div className="px-5 pb-6 pt-2">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">New Lead</h2>
                  <p className="text-xs text-gray-400">
                    Step {step + 1} of {STEPS.length}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-xl hover:bg-gray-100 transition"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              <StepBar current={step} />

              {/* ── Step 0: Client ── */}
              {step === 0 && (
                <div className="space-y-4">
                  <Field
                    label="Client Name"
                    icon={User}
                    error={errors.clientName}
                  >
                    <Input
                      name="clientName"
                      value={form.clientName}
                      onChange={set("clientName")}
                      placeholder="Full name"
                      autoFocus
                    />
                  </Field>
                  <Field
                    label="Contact Number"
                    icon={Phone}
                    error={errors.clientContact}
                  >
                    <Input
                      name="clientContact"
                      value={form.clientContact}
                      onChange={set("clientContact")}
                      placeholder="10-digit mobile number"
                      type="tel"
                      maxLength={10}
                    />
                  </Field>
                </div>
              )}

              {/* ── Step 1: Address ── */}
              {step === 1 && (
                <div className="space-y-4">
                  <Field
                    label="Full Address"
                    icon={Home}
                    error={errors.full_address}
                  >
                    <Input
                      name="full_address"
                      value={form.full_address}
                      onChange={set("full_address")}
                      placeholder="House / Street / Area"
                      autoFocus
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="City" icon={MapPin} error={errors.city}>
                      <Input
                        name="city"
                        value={form.city}
                        onChange={set("city")}
                        placeholder="City"
                      />
                    </Field>
                    <Field label="Pincode" error={errors.pincode}>
                      <Input
                        name="pincode"
                        value={form.pincode}
                        onChange={set("pincode")}
                        placeholder="6-digit pincode"
                        type="tel"
                        maxLength={6}
                      />
                    </Field>
                  </div>
                </div>
              )}

              {/* ── Step 2: Project ── */}
              {step === 2 && (
                <div className="space-y-5">
                  <Field label="Project Type" icon={Layers} error={errors.type}>
                    <TypePicker value={form.type} onChange={set("type")} />
                  </Field>
                  <Field label="Capacity (kW)" icon={Zap} error={errors.kw}>
                    <Input
                      name="kw"
                      value={form.kw}
                      onChange={set("kw")}
                      placeholder="e.g. 5"
                      type="number"
                      min="1"
                    />
                  </Field>
                  <Field
                    label="Payment Type"
                    icon={CreditCard}
                    error={errors.paymentType}
                  >
                    <PaymentPicker
                      value={form.paymentType}
                      onChange={set("paymentType")}
                    />
                  </Field>
                </div>
              )}

              {/* ── Step 3: Review ── */}
              {step === 3 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                    Review & Confirm
                  </p>
                  <div className="bg-gray-50 rounded-xl p-4 mb-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Client
                    </p>
                    <ReviewRow label="Name" value={form.clientName} />
                    <ReviewRow label="Contact" value={form.clientContact} />
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 mb-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Address
                    </p>
                    <ReviewRow label="Address" value={form.full_address} />
                    <ReviewRow label="City" value={form.city} />
                    <ReviewRow label="Pincode" value={form.pincode} />
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Project
                    </p>
                    <ReviewRow
                      label="Type"
                      value={TYPE_LABELS[form.type] || form.type}
                    />
                    <ReviewRow label="kW" value={`${form.kw} kW`} />
                    <ReviewRow
                      label="Payment"
                      value={form.paymentType === "loan" ? "Loan" : "Cash"}
                    />
                  </div>
                  <p className="text-xs text-red-400 mt-3 text-center">
                    ⚠️ Cannot be edited or deleted after submission
                  </p>
                </div>
              )}

              {/* ── Navigation ── */}
              <div
                className={`flex mt-6 gap-3 ${step > 0 ? "justify-between" : "justify-end"}`}
              >
                {step > 0 && (
                  <button
                    type="button"
                    onClick={step === 3 ? () => setStep(2) : back}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                )}

                {step < 2 && (
                  <button
                    type="button"
                    onClick={next}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                )}

                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      const e = validate(2);
                      if (Object.keys(e).length) {
                        setErrors(e);
                        return;
                      }
                      setErrors({});
                      setStep(3);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    Review <ChevronRight size={16} />
                  </button>
                )}

                {step === 3 && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} /> Submit Lead
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeads;
