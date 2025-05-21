import { Loader2, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuthStore from "../store/useAuthStore.js";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  // Subscribing to parts of useAuthStore using selector functions
  const login = useAuthStore((state) => state.login);
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn);
  const authUser = useAuthStore((state) => state.authUser);

  useEffect(() => {
    if (authUser) {
      navigate(
        authUser.role === "admin" ? "/admin/dashboard" : "/employee/dashboard"
      );
    }
  }, [authUser, navigate]);

  const validateFormData = () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      return toast.error("Both fields are required!");
    }
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format!");

    return true;
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateFormData() === true) {
      const user = await login(formData);
      if (user) {
        navigate(
          user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard"
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-base-200/65 shadow-lg rounded-xl p-8 space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-base-content">
          Sign in to access your dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>

            <div className="relative">
              <Mail className="absolute z-10 left-3 top-3.5 w-3.5 h-3.5 text-base-content" />
              <input
                type="email"
                name="email"
                autoComplete="username"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="input w-full pl-10"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-3.5 h-3.5 text-base-content z-10" />
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="input w-full pl-10"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="size-5 animate-spin" />
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="text-center text-sm text-base-content">
          Don't have an account?{" "}
          <Link to="/register" className="link link-primary">
            Create one
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Login;
