import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function ProtectedAdminRoute() {
  const authUser = useAuthStore((state) => state.authUser);

  if (!authUser) {
    return <Navigate to="/login" />;
  }
  if (authUser.role !== "admin") {
    return <Navigate to="/employee/dashboard" />;
  }
  return <Outlet />;
}
