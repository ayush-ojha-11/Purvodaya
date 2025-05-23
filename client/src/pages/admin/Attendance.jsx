import { useEffect, useState } from "react";
import dayjs from "dayjs";
import useAdminStore from "../../store/useAdminStore";
import toast from "react-hot-toast";
const AdminAttendancePage = () => {
  const getAllEmployees = useAdminStore((state) => state.getAllEmployees);
  const markAttendance = useAdminStore((state) => state.markAttendance);
  const isMarkingAttendance = useAdminStore(
    (state) => state.isMarkingAttendance
  );

  const [employees, setEmployees] = useState([]);
  const [absentIds, setAbsentIds] = useState([]);
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));

  //Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await getAllEmployees();
      if (data) {
        setEmployees(data);
      }
    };
    fetchEmployees();
  }, [getAllEmployees]);

  const handleCheckboxChange = (id) => {
    setAbsentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    const presentIds = employees
      .map((emp) => emp._id)
      .filter((id) => !absentIds.includes(id));

    const success = await markAttendance({
      date,
      present: presentIds,
      absent: absentIds,
    });

    if (success) {
      toast.success("Attendance marked successfully.");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-primary">Mark Attendance</h2>

      <div className="flex items-center gap-4">
        <label className="font-medium">Date:</label>
        <input
          type="date"
          className="input input-bordered"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Absent</th>
            </tr>
          </thead>
          <tbody>
            {employees?.map((emp, idx) => (
              <tr key={emp._id}>
                <td>{idx + 1}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.location}</td>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={absentIds.includes(emp._id)}
                    onChange={() => handleCheckboxChange(emp._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleSubmit}
        className="btn btn-primary"
        disabled={isMarkingAttendance}
      >
        {isMarkingAttendance ? "Please wait..." : "Save Attendance"}
      </button>
    </div>
  );
};
export default AdminAttendancePage;
