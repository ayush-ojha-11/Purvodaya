import React, { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);

  useEffect(() => {
    if (!authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);
  return <div className="min-h-screen">EmployeeDashboard</div>;
};

export default EmployeeDashboard;
