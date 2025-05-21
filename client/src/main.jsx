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
import AdminLayout from "./layouts/AdminLayout.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
            children: [{ path: "dashboard", element: <AdminDashboard /> }],
          },
        ],
      },
      // Employee routes
      {
        path: "/employee",
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
