import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  UserCircle,
  Box,
  ClipboardList,
  LogOut,
  UserPlus,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { useEffect, useState } from "react";

const navItems = [
  {
    name: "Dashboard",
    path: "/employee/dashboard",
    icon: <UserCircle size={18} />,
  },
  {
    name: "Projects",
    path: "/employee/projects",
    icon: <ClipboardList size={18} />,
  },
  { name: "Your Leads", path: "/employee/leads", icon: <UserPlus size={18} /> },
  { name: "Inventory", path: "/employee/inventory", icon: <Box size={18} /> },
];

const EmployeeLayout = () => {
  const location = useLocation();
  const authUser = useAuthStore((state) => state.authUser);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //helper functions
  const closeDrawer = () => {
    const drawer = document.getElementById("employee-drawer");
    if (drawer) drawer.checked = false;
  };

  return (
    <div className="min-h-screen flex bg-base-100">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="hidden md:flex flex-col w-64 bg-base-100 border-r border-base-300">
          <div className="p-4">
            <h1 className="font-semibold text-xl pl-1 text-secondary">
              Purvodaya Portal
            </h1>
          </div>

          <nav className="flex-1 p-4 space-y-4">
            {navItems.map(({ name, path, icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-base-200 ${
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
              className="btn btn-ghost w-full flex justify-start text-red-600"
              onClick={() => logout()}
            >
              <LogOut /> Logout
            </button>
          </div>
        </aside>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <div className="drawer md:hidden w-full">
          <input
            id="employee-drawer"
            type="checkbox"
            className="drawer-toggle"
          />
          <div className="drawer-content flex flex-col min-h-screen">
            <div className="w-full flex justify-between items-center p-4 bg-base-200">
              <h1
                className="text-xl text-primary font-bold"
                onClick={() => navigate("/employee/dashboard")}
              >
                Purvodaya
              </h1>
              <label htmlFor="employee-drawer">
                <Menu className="size-6" />
              </label>
            </div>
            <div className="flex-1">
              <Outlet />
            </div>
          </div>
          <div className="drawer-side z-40">
            <label htmlFor="employee-drawer" className="drawer-overlay"></label>
            <aside className="menu p-4 w-64 min-h-screen bg-base-100 border-r border-base-300">
              <h1 className="px-1 py-5 text-lg font-medium">
                Hello, {authUser?.name}
              </h1>
              <div className="flex flex-col gap-5">
                {navItems.map(({ name, path, icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={closeDrawer}
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
        <main className="flex-1 hidden md:block ">
          <Outlet />
        </main>
      )}
    </div>
  );
};

export default EmployeeLayout;
