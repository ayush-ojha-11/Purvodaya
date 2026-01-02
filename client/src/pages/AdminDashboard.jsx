import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaCalendarCheck,
  FaClipboardList,
  FaBoxes,
} from "react-icons/fa";
import { UserPlus } from "lucide-react";
import useAdminStore from "../store/useAdminStore";

const getCurrentMonthYear = () => {
  const date = new Date();
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { dashboardStats, getDashboardStats, isFetchingData } = useAdminStore();

  useEffect(() => {
    getDashboardStats(); // cached, no refetch
  }, [getDashboardStats]);

  const handleClick = (id) => {
    const routes = {
      employees: "/admin/employees",
      attendance: "/admin/attendance-summary",
      inventory: "/admin/inventory",
      lead: "/admin/leads",
      project: "/admin/projects",
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
        <p className="text-2xl font-bold text-gray-900">{value ?? "-"}</p>
      </div>
    </div>
  );

  const statItems = [
    {
      id: "employees",
      title: "Employees",
      value: dashboardStats?.employeesCount,
      icon: <FaUsers />,
      color: "#3B82F6",
    },
    {
      id: "attendance",
      title: "Attendance Records",
      value: dashboardStats?.totalAttendance,
      icon: <FaCalendarCheck />,
      color: "#10B981",
    },
    {
      id: "inventory",
      title: "Total Inventory",
      value: dashboardStats?.totalInventory,
      icon: <FaBoxes />,
      color: "#8B5CF6",
    },
  ];

  const statItems2 = [
    {
      id: "lead",
      title: "Total Leads",
      value: dashboardStats?.totalLeads,
      icon: <UserPlus />,
      color: "#F59E0B",
    },
    {
      id: "project",
      title: "Total Projects",
      value: dashboardStats?.totalProjects,
      icon: <FaClipboardList />,
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
        <h1 className="text-3xl font-bold text-gray-800">Admin Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Dashboard stats for {getCurrentMonthYear()}
        </p>
      </div>

      {/* Section 1 */}
      <p className="font-mono font-medium text-sm">
        Manage employees, attendance and inventory
      </p>

      {isFetchingData ? (
        <SkeletonGrid count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statItems.map((item) => (
            <StatCard key={item.id} {...item} />
          ))}
        </div>
      )}

      {/* Section 2 */}
      <p className="text-sm font-mono font-medium">Manage Leads and Projects</p>

      {isFetchingData ? (
        <SkeletonGrid count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statItems2.map((item) => (
            <StatCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
