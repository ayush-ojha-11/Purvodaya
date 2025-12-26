import React, { useEffect, useState } from "react";
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

  // ✅ PDF is lazy-loaded
  const handleDownloadPDF = async () => {
    if (!summary.length) return;
    const { downloadAttendancePDF } = await import("../../lib/pdf.js");
    downloadAttendancePDF(summary, month, year);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAttendanceSummary(month, year);
      setSummary(data);
    };
    fetchData();
  }, [getAttendanceSummary, month, year]);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h2 className="text-primary text-2xl font-semibold">
        Attendance Summary
      </h2>

      {/* Month / Year */}
      <div className="flex gap-4">
        <select
          className="select select-bordered"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {Array.from({ length: 12 }, (_, i) => {
            const m = String(i + 1).padStart(2, "0");
            return (
              <option key={m} value={m}>
                {dayjs(`${year}-${m}-01`).format("MMMM")}
              </option>
            );
          })}
        </select>

        <select
          className="select select-bordered"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const y = String(now.year() - i);
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
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
              <th>Present</th>
              <th>Absent</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((emp, index) => (
              <React.Fragment key={emp._id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.presentDays}</td>
                  <td>{emp.absentDays}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline"
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
                    <td colSpan={6}>
                      <div className="flex flex-wrap gap-2">
                        {emp.absentDates.length
                          ? emp.absentDates.map((d, i) => (
                              <span
                                key={i}
                                className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full"
                              >
                                {dayjs(d).date()}
                              </span>
                            ))
                          : "No absences"}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-primary" onClick={handleDownloadPDF}>
        Download PDF
      </button>
    </div>
  );
};

export default AttendanceSummary;
