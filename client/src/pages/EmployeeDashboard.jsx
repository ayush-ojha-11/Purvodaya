import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useEmployeeStore from "../store/useEmployeeStore";

import {
  FaUserCheck,
  FaUsers,
  FaUserTimes,
  FaPercent,
  FaClipboardList,
} from "react-icons/fa";
import { UserPlus } from "lucide-react";

const getCurrentMonthYear = () => {
  const date = new Date();
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);

  const { stats, fetchStats, loading } = useEmployeeStore();

  useEffect(() => {
    if (!authUser) navigate("/");
  }, [authUser, navigate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const getAttendancePercentage = () => {
    const total = stats?.presentDays + stats?.absentDays;

    if (!total) return 0;

    return ((stats.presentDays / total) * 100).toFixed(1);
  };

  const handleClick = (id) => {
    const routes = {
      projects: "/employee/projects",
      leads: "/employee/leads",
      allLeads: "/employee/allLeads",
    };

    navigate(routes[id]);
  };

  const StatCard = ({ title, value, icon, color, id }) => (
    <div
      onClick={() => handleClick(id)}
      className="flex items-center p-5 bg-white rounded-xl shadow hover:shadow-lg transition-all border border-gray-200 cursor-pointer"
    >
      <div
        className="text-white text-3xl mr-4 p-3 rounded-full"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-600">{title}</h4>
        <p className="text-2xl font-bold text-gray-900">{value ?? 0}</p>
      </div>
    </div>
  );

  const statItems = [
    {
      id: "projects",
      title: "Projects",
      value: stats?.totalProjects,
      icon: <FaClipboardList />,
      color: "#3B82F6",
    },
    {
      id: "allLeads",
      title: "Leads",
      value: stats?.totalLeads,
      icon: <FaUsers />,
      color: "#10B981",
    },
    {
      id: "leads",
      title: "Your Leads",
      value: stats?.totalEmployeeLeads,
      icon: <UserPlus />,
      color: "#F59E0B",
    },
    {
      id: "attendance",
      title: "Attendance %",
      value: `${getAttendancePercentage()}%`,
      icon: <FaPercent />,
      color: "#10B981",
    },
    {
      id: "present",
      title: "Present Days",
      value: stats?.presentDays,
      icon: <FaUserCheck />,
      color: "#22C55E",
    },
    {
      id: "absent",
      title: "Absent Days",
      value: stats?.absentDays,
      icon: <FaUserTimes />,
      color: "#EF4444",
    },
  ];

  const SkeletonGrid = ({ count }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="animate-pulse p-5 rounded-xl bg-white shadow h-32 border border-gray-300"
          />
        ))}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {authUser?.name ?? "Employee"} 👋
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Dashboard stats for {getCurrentMonthYear()}
        </p>
      </div>

      {/* Section */}
      <p className="font-mono font-medium text-sm">Your work overview</p>

      {loading ? (
        <SkeletonGrid count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statItems.map((item) => (
            <StatCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
