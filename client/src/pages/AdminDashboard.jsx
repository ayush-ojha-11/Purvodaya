import StatCard from "../components/StatCard";
import { Users, CalendarCheck, ClipboardList, Boxes } from "lucide-react";
import useAdminStore from "../store/useAdminStore";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const getDashboardStats = useAdminStore((state) => state.getDashboardStats);

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
      icon: <Users size={28} className="text-blue-600" />,
    },
    {
      id: "attendance",
      title: "Attendance Records",
      value: stats?.totalAttendance ?? "-",
      icon: <CalendarCheck size={28} className="text-green-600" />,
    },
    {
      id: "projects",
      title: "Total Projects",
      value: stats?.totalProjects ?? "-",
      icon: <ClipboardList size={28} className="text-yellow-600" />,
    },
    {
      id: "inventory",
      title: "Total Inventory",
      value: stats?.totalInventory ?? "-",
      icon: <Boxes size={28} className="text-purple-600" />,
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-primary">Admin Overview</h1>
        {/* Future Action Button (optional)
        <button className="px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary/90">
          Refresh
        </button> */}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="animate-pulse p-4 rounded-lg bg-muted shadow-sm h-32"
              >
                <div className="h-5 w-1/3 bg-gray-300 rounded mb-2" />
                <div className="h-8 w-1/2 bg-gray-200 rounded" />
              </div>
            ))}
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statItems.map((item) => (
            <StatCard
              key={item.id}
              title={item.title}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
