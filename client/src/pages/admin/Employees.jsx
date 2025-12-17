import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import useAdminStore from "../../store/useAdminStore";
import ConfirmModal from "../../components/ConfirmModal";

const EmployeesPage = () => {
  const getAllEmployees = useAdminStore((state) => state.getAllEmployees);
  const deleteEmployee = useAdminStore((state) => state.deleteEmployee);
  const isDeleting = useAdminStore((state) => state.isDeleting);

  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  // Get unique locations from employees
  const locations = Array.from(
    new Set(employees.map((e) => e.location).filter(Boolean))
  );

  // Fetch employees only once on mount
  useEffect(() => {
    const fetch = async () => {
      const data = await getAllEmployees(); // await this
      if (Array.isArray(data)) {
        setEmployees(data);
        setFiltered(data); // set filtered immediately
      }
    };
    fetch();
  }, [getAllEmployees]);

  //Filter when query/location changes
  useEffect(() => {
    let list = [...employees];
    if (locationFilter !== "all") {
      list = list.filter((e) => e.location === locationFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [employees, locationFilter, searchQuery]);

  // Handle Delete
  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    const success = await deleteEmployee(selectedEmployee._id);
    if (success) {
      const updated = employees.filter((e) => e._id !== selectedEmployee._id);
      setEmployees(updated); // sync employees
    }
    setShowModal(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-semibold text-primary">Employees</h2>

      {/* Filters */}
      <div className="flex md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="input input-bordered flex-2/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="select select-bordered flex-1/3"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="all">City</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp, index) => (
              <tr key={emp._id}>
                <td>{index + 1}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.location || "N/A"}</td>
                <td className="text-center">
                  <button
                    onClick={() => openModal(emp)}
                    className="btn btn-ghost btn-sm text-error"
                    disabled={isDeleting}
                  >
                    Delete
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <ConfirmModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedEmployee(null);
        }}
        onConfirm={handleDelete}
        message={`Are you sure you want to delete ${selectedEmployee?.name}?`}
      />
    </div>
  );
};

export default EmployeesPage;
