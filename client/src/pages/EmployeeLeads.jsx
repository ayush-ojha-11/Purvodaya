import { useEffect, useState } from "react";
import useLeadStore from "../store/useLeadStore.js";
import { formatDate } from "../lib/helper.js";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";

const EmployeeLeads = () => {
  const { leads, submitLead, fetchLeads } = useLeadStore();
  const authUser = useAuthStore((state) => state.authUser);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    clientName: "",
    clientContact: "",
    full_address: "",
    city: "",
    pincode: "",
    type: "",
    kw: "",
  });
  const statusStyles = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
  };

  useEffect(() => {
    if (!authUser) navigate("/");
  });

  useEffect(() => {
    fetchLeads(true); // fetch all leads of the employee
  }, [fetchLeads]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.clientName || !form.clientContact) return;

    await submitLead(form);
    await fetchLeads(true);

    setForm({
      clientName: "",
      clientContact: "",
      full_address: "",
      city: "",
      pincode: "",
      type: "",
      kw: "",
    });
    setOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <span className="font-bold text-2xl">
          Your Leads{" "}
          <p className="text-gray-500 text-sm">Total leads: {leads.length}</p>
        </span>
        <button
          onClick={() => setOpen(true)}
          className="btn btn-primary text-white"
        >
          + Add Lead
        </button>
      </div>

      {/* Leads list */}
      <div className="grid gap-4">
        {leads?.length == 0 && <p className="text-gray-500">No leads found</p>}

        {leads?.map((lead) => (
          <div
            key={lead._id}
            className="flex justify-between rounded p-4 shadow-sm bg-white hover:shadow-lg hover:cursor-pointer"
          >
            <div>
              <h2 className="font-semibold">{lead.clientName}</h2>
              <p className="text-sm text-gray-600 font-mono">
                Contact: {lead.clientContact}
              </p>
              <span className="text-sm">
                Type: {lead.type} <span>, kW: {lead.kw}</span>{" "}
              </span>
              <div className="mt-4">
                <p className="text-sm text-gray-500">{lead.full_address}</p>
                <span className="text-sm text-gray-500">
                  {lead.city}, <span>{lead.pincode}</span>
                </span>
              </div>
            </div>

            <div>
              <span
                className={`inline-flex  items-center px-2.5 py-1  rounded-full text-xs font-medium 
                ${statusStyles[lead.status] || "bg-gray-100 text-gray-600"}`}
              >
                {lead.status}
              </span>
              <p className="text-xs px-2.5 mt-2">
                {formatDate(lead.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl mx-2">
            <h2 className="text-lg font-bold">Add New Lead</h2>
            <p className="text-gray-400 text-xs">
              Please check all the info, before submitting
            </p>
            <p className="text-red-400 mb-4 text-xs">
              It cannot be edited or deleted
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-gray-400 text-sm">Client Information</p>
              <div className="flex gap-3">
                <input
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  placeholder="Client Name"
                  className="w-full border p-2 rounded-xl"
                  required
                />

                <input
                  name="clientContact"
                  value={form.clientContact}
                  onChange={handleChange}
                  placeholder="Contact number"
                  className="w-full border p-2 rounded-xl"
                  required
                />
              </div>
              <p className="text-gray-400 text-sm mt-5">Address information</p>
              <div className={`block md:flex gap-2`}>
                <input
                  name="full_address"
                  value={form.full_address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full border p-2 rounded-xl"
                  required
                />
                <div className={`flex gap-2 mt-4 md:mt-0`}>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full border p-2 rounded-xl"
                    required
                  />
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className="w-full border p-2 rounded-xl"
                    required
                  />
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-5">Lead information</p>
              <div className="flex gap-3">
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-xl"
                  required
                >
                  <option value="" disabled>
                    Select Lead Type
                  </option>
                  <option value="hybrid">Hybrid</option>
                  <option value="on-grid">On Grid</option>
                  <option value="off-grid">Off Grid</option>
                </select>

                <input
                  name="kw"
                  value={form.kw}
                  onChange={handleChange}
                  placeholder="How many kW?"
                  className="w-full border p-2 rounded-xl"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn btn-error text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-white rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default EmployeeLeads;
