import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Menu,
  Users,
  Box,
  CalendarCheck,
  ClipboardList,
  FileCheck,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { useEffect, useState } from "react";

const navItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  { name: "Employees", path: "/admin/employees", icon: <Users size={18} /> },
  { name: "Inventory", path: "/admin/inventory", icon: <Box size={18} /> },
  {
    name: "Attendance",
    path: "/admin/attendance",
    icon: <CalendarCheck size={18} />,
  },
  {
    name: "Projects",
    path: "/admin/projects",
    icon: <ClipboardList size={18} />,
  },
  { name: "Requests", path: "/admin/requests", icon: <FileCheck size={18} /> },
];

const AdminLayout = () => {
  const location = useLocation();
  const authUser = useAuthStore((state) => state.authUser);
  const logout = useAuthStore((state) => state.logout);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex bg-base-100">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="hidden md:flex flex-col w-64 bg-base-100 border-r border-base-300">
          <div className="p-4">
            <h1 className="font-bold text-lg">Welcome, {authUser?.name}</h1>
          </div>

          <nav className="flex-1 p-4 space-y-3">
            {navItems.map(({ name, path, icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-base-200 ${
                  location.pathname === path
                    ? "bg-primary text-primary-content font-semibold hover:bg-primary"
                    : "text-base-content"
                }`}
              >
                {icon}
                {name}
              </Link>
            ))}
          </nav>

          <div className="p-4">
            <button
              className="btn btn-ghost w-full flex justify-start"
              onClick={() => logout()}
            >
              <LogOut /> Logout
            </button>
          </div>
        </aside>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <div className="drawer md:hidden w-full">
          <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col min-h-screen">
            {/* top bar */}
            <div className="w-full flex justify-between items-center p-4 bg-base-200">
              <h1 className="text-xl text-primary font-bold">Purvodaya</h1>
              <label htmlFor="admin-drawer">
                <Menu className="size-6" />
              </label>
            </div>
            <div className="flex-1 p-4">
              <Outlet />
            </div>
          </div>
          <div className="drawer-side z-40">
            <label htmlFor="admin-drawer" className="drawer-overlay"></label>
            <aside className="menu p-4 w-64 min-h-screen bg-base-100 border-r border-base-300">
              <h1 className="px-1 py-5 text-lg font-medium">
                Hello, {authUser?.name}
              </h1>
              <div className="flex flex-col gap-5">
                {navItems.map(({ name, path, icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition hover:bg-base-200 ${
                      location.pathname === path
                        ? "bg-primary text-primary-content font-semibold hover:bg-primary"
                        : "text-base-content"
                    }`}
                  >
                    {icon}
                    {name}
                  </Link>
                ))}
                <button
                  className="btn btn-ghost px-3 py-3 w-full flex justify-start text-red-600 gap-3"
                  onClick={() => logout()}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* Main content */}
      {!isMobile && (
        <main className="flex-1 hidden md:block p-6">
          <Outlet />
        </main>
      )}
    </div>
  );
};

export default AdminLayout;
