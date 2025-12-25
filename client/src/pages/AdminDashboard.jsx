import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaCalendarCheck,
  FaClipboardList,
  FaBoxes,
} from "react-icons/fa";
import useAdminStore from "../store/useAdminStore";
import { UserPlus } from "lucide-react";

const getCurrentMonthYear = () => {
  const date = new Date();
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const getDashboardStats = useAdminStore((state) => state.getDashboardStats);

  const handleClick = (id) => {
    if (id === "employees") {
      navigate("/admin/employees");
    } else if (id === "attendance") {
      navigate("/admin/attendance-summary");
    } else if (id === "inventory") {
      navigate("/admin/inventory");
    } else if (id === "lead") {
      navigate("/admin/leads");
    } else if (id === "project") {
      navigate("/admin/projects");
    }
  };

  const StatCard = ({ title, value, icon, color, id }) => (
    <div
      onClick={() => handleClick(id)}
      className="flex items-center p-5 bg-white rounded-xl shadow hover:shadow-lg transition-all border border-gray-200 hover:cursor-pointer"
    >
      <div
        className="text-white text-3xl mr-4 p-3 rounded-full"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <div>
        <h4 className="text-md font-semibold text-gray-600">{title}</h4>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        if (data) {
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
        setError("Unable to load stats. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [getDashboardStats]);

  const statItems = [
    {
      id: "employees",
      title: "Employees",
      value: stats?.employeesCount ?? "-",
      icon: <FaUsers />,
      color: "#3B82F6", // Blue
    },
    {
      id: "attendance",
      title: "Attendance Records",
      value: stats?.totalAttendance ?? "-",
      icon: <FaCalendarCheck />,
      color: "#10B981", // Green
    },
    {
      id: "inventory",
      title: "Total Inventory",
      value: stats?.totalInventory ?? "-",
      icon: <FaBoxes />,
      color: "#8B5CF6", // Purple
    },
  ];

  const statItems2 = [
    {
      id: "lead",
      title: "Total Leads",
      value: stats?.totalLeads ?? "-",
      icon: <UserPlus />,
      color: "#F59E0B",
    },
    {
      id: "project",
      title: "Total Projects",
      value: stats?.totalProjects ?? "-",
      icon: <FaClipboardList />,
      color: "#EF4444",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Dashboard stats for {getCurrentMonthYear()}
          </p>
        </div>
      </div>

      {/* 1st Stats Section */}
      <p className="font-mono font-medium text-sm">
        Manage employees, attendance and inventory
      </p>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="animate-pulse p-5 rounded-xl bg-white shadow h-32 flex flex-col justify-between border border-gray-200"
              >
                <div className="h-4 w-1/3 bg-gray-300 rounded" />
                <div className="h-6 w-1/2 bg-gray-200 rounded" />
              </div>
            ))}
        </div>
      ) : error ? (
        <p className="text-red-500 text-center text-lg font-medium">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statItems.map((item) => (
            <StatCard
              id={item.id}
              key={item.id}
              title={item.title}
              value={item.value}
              icon={item.icon}
              color={item.color}
            />
          ))}
        </div>
      )}
      {/* 2nd Stats Section */}
      <p className="text-sm mt-2 font-mono font-medium">
        Manage Leads and Projects
      </p>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="animate-pulse p-5 rounded-xl bg-white shadow h-32 flex flex-col justify-between border border-gray-200"
              >
                <div className="h-4 w-1/3 bg-gray-300 rounded" />
                <div className="h-6 w-1/2 bg-gray-200 rounded" />
              </div>
            ))}
        </div>
      ) : error ? (
        <p className="text-red-500 text-center text-lg font-medium">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statItems2.map((item) => (
            <StatCard
              id={item.id}
              key={item.id}
              title={item.title}
              value={item.value}
              icon={item.icon}
              color={item.color}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
