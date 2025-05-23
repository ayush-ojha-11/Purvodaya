import StatCard from "../components/StatCard";
import { Users, CalendarCheck, ClipboardList, Box } from "lucide-react";
import useAdminStore from "../store/useAdminStore";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const getDashboardStats = useAdminStore((state) => state.getDashboardStats);

  const statItems = [
    {
      title: "Employees",
      value: stats?.employeesCount,
      icon: <Users size={32} />,
    },
    {
      title: "Attendance records",
      value: stats?.totalAttendance,
      icon: <CalendarCheck size={32} />,
    },
    {
      title: "Total Projects",
      value: stats?.totalProjects,
      icon: <ClipboardList size={32} />,
    },
    {
      title: "Total Inventory",
      value: stats?.totalInventory,
      icon: <ClipboardList size={32} />,
    },
  ];

  useEffect(() => {
    console.log("AdminDashboard useEffect called");
    const fetchStats = async () => {
      const data = await getDashboardStats();
      if (data) {
        setStats(data);
      }
    };
    fetchStats();
  }, [getDashboardStats]);

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statItems.map((item) => (
          <StatCard title={item.title} value={item.value} icon={item.icon} />
        ))}
      </div>
    </div>
  );
};
export default AdminDashboard;
