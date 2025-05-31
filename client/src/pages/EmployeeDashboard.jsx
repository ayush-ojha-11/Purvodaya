import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useEmployeeStore from "../store/useEmployeeStore";
import { FaUserCheck, FaUserTimes, FaPercent } from "react-icons/fa";

const getCurrentMonthYear = () => {
  const date = new Date();
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const Card = ({ icon, title, value, color }) => (
  <div className="flex items-center p-5 bg-white rounded-lg shadow hover:shadow-md transition duration-300 border border-gray-200">
    <div
      className={`text-3xl mr-4 p-3 rounded-full bg-opacity-10`}
      style={{ color, backgroundColor: `${color}20` }}
    >
      {icon}
    </div>
    <div>
      <h4 className="text-md font-semibold text-gray-700  mb-1">{title}</h4>
      <p className="text-2xl font-bold text-gray-900 ">{value}</p>
    </div>
  </div>
);

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);

  const stats = useEmployeeStore((state) => state.stats);
  const fetchStats = useEmployeeStore((state) => state.fetchStats);
  const loading = useEmployeeStore((state) => state.loading);

  const getAttendancePercentage = () => {
    const percentage =
      (stats?.presentDays / (stats?.presentDays + stats?.absentDays)) * 100;
    return percentage.toFixed(2);
  };

  useEffect(() => {
    if (!authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center text-gray-500 text-lg dark:text-gray-400">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="sm:p-6 lg:p-8 bg-gray-50  min-h-screen space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome back, {authUser?.name ?? "Employee"} 👋
        </h2>
        <p className="text-sm text-gray-500  mt-1">
          Dashboard stats for {getCurrentMonthYear()}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          icon={<FaPercent />}
          title="Attendance percentage"
          value={getAttendancePercentage()}
        />
        <Card
          icon={<FaUserCheck />}
          title="Present Days"
          value={stats?.presentDays ?? 0}
          color="#10B981"
        />
        <Card
          icon={<FaUserTimes />}
          title="Absent Days"
          value={stats?.absentDays ?? 0}
          color="#EF4444"
        />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
