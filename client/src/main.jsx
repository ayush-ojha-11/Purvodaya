import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Landing from "./pages/Landing.jsx";

import "./index.css";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import Register from "./pages/Register.jsx";
import EmployeesPage from "./pages/admin/Employees.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminAttendancePage from "./pages/admin/Attendance.jsx";
import AttendanceSummary from "./pages/admin/AttendanceSummary.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import InventoryPage from "./pages/admin/Inventory.jsx";
import InventoryRequests from "./pages/admin/InventoryRequests.jsx";
import EmployeeLayout from "./layouts/EmployeeLayout.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      //Protected Admin Routes
      {
        path: "/admin",
        element: <ProtectedAdminRoute />,

        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: "dashboard", element: <AdminDashboard /> },
              { path: "employees", element: <EmployeesPage /> },
              { path: "attendance", element: <AdminAttendancePage /> },
              { path: "attendance-summary", element: <AttendanceSummary /> },
              { path: "inventory", element: <InventoryPage /> },
              { path: "requests", element: <InventoryRequests /> },
            ],
          },
        ],
      },
      // Employee routes
      {
        path: "/employee",
        element: <EmployeeLayout />,
        children: [
          {
            path: "dashboard",
            element: <EmployeeDashboard />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={appRouter} />
);
