import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import useAdminStore from "../../store/useAdminStore";

const AttendanceSummary = () => {
  const getAttendanceSummary = useAdminStore(
    (state) => state.getAttendanceSummary
  );
  const [summary, setSummary] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);

  const now = dayjs();
  const [month, setMonth] = useState(now.format("MM"));
  const [year, setYear] = useState(now.format("YYYY"));

  // For downloading PDF (Attendance data)
  const handleDownloadPDF = () => {
    if (!summary || summary.length === 0) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(
      `Attendance Report - ${dayjs(`${year}-${month}-01`).format("MMMM YYYY")}`,
      14,
      22
    );

    autoTable(doc, {
      startY: 30,
      head: [["#", "Name", "Email", "Present Days", "Absent Days"]],
      body: summary.map((emp, index) => [
        index + 1,
        emp.name,
        emp.email,
        emp.presentDays,
        emp.absentDays,
      ]),
      styles: {
        fontSize: 10,
      },
      headStyles: {
        fillColor: [52, 152, 219], // blue
      },
    });

    doc.save(`Attendance-${month}-${year}.pdf`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAttendanceSummary(month, year);
      setSummary(data);
    };
    fetchData();
  }, [getAttendanceSummary, month, year]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-primary text-2xl font-semibold">Summary</h2>
      {/* Month and year selection */}
      <div className="flex gap-4">
        {/* Month */}
        <select
          className="select select-bordered"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {Array.from({ length: 12 }, (_, i) => {
            const m = (i + 1).toString().padStart(2, "0");
            return (
              <option key={m} value={m}>
                {dayjs(`${year}-${m}-01`).format("MMMM")}
              </option>
            );
          })}
        </select>
        {/* Year */}
        <select
          className="select selcet-bordered"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const y = (now.year() - i).toString();
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>

      {/* Summary Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((emp, index) => (
              <>
                <tr key={emp._id}>
                  <td>{index + 1}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.presentDays}</td>
                  <td>{emp.absentDays}</td>
                  <td>
                    <button
                      className="btn p-5 btn-sm btn-outline lg:btn-md"
                      onClick={() =>
                        setExpandedUserId((prev) =>
                          prev === emp._id ? null : emp._id
                        )
                      }
                    >
                      {expandedUserId === emp._id ? "Hide" : "View"} Dates
                    </button>
                  </td>
                </tr>
                {expandedUserId === emp._id && (
                  <tr className="bg-base-200">
                    <td colSpan={6} className="bg-primary/75 text-white">
                      <p className="text-sm">
                        <span className="font-semibold mr-2">
                          {emp.name} was absent on:
                        </span>
                        {emp.absentDates.length > 0 ? (
                          <span className="flex flex-wrap gap-2 mt-1">
                            {emp.absentDates.map((date, index) => (
                              <span
                                key={index}
                                className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full"
                              >
                                {dayjs(date).date()}
                              </span>
                            ))}
                          </span>
                        ) : (
                          "None"
                        )}
                      </p>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-primary " onClick={handleDownloadPDF}>
        Download
      </button>
    </div>
  );
};

export default AttendanceSummary;
