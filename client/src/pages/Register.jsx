import { Calendar, Loader2, Lock, Mail, MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
  });
  const navigate = useNavigate();
  const { isLoggingIn, register, authUser } = useAuthStore();

  useEffect(() => {
    if (authUser?.role === "admin") {
      navigate("/admin/dashboard");
    } else if (authUser?.role === "employee") {
      navigate("/employee/dashboard");
    }
  }, [authUser, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateFormData = () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.location.trim() ||
      !formData.password.trim()
    ) {
      return toast.error("All fields are required!");
    }

    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format!");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateFormData() === true) {
      const user = await register(formData);
      if (user) {
        navigate(
          user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard"
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-base-200/65 shadow-lg rounded-xl p-8 space-y">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary">
          Create an Account
        </h2>
        <p className="text-center text-sm text-base-content">
          Register to access your dashboard
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-conrol">
            <label className="label">
              <span className="font-medium">Name</span>
            </label>
            <div className="relative">
              <User className="absolute z-10 left-3 top-3.5 w-3.5 h-3.5 text-base-content" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="input w-full pl-10"
              />
            </div>
          </div>
          {/* Email */}
          <div className="form-conrol">
            <label className="label">
              <span className="font-medium">Email</span>
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
          {/* Password */}
          <div className="form-conrol">
            <label className="label">
              <span className="font-medium">Password</span>
            </label>
            <div className="relative">
              <Lock className="absolute z-10 left-3 top-3.5 w-3.5 h-3.5 text-base-content" />
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
          {/* Location */}
          <div className="form-control">
            <label className="label">
              <span className="font-medium">Location</span>
            </label>

            <div className="relative">
              <MapPin className="absolute z-10 left-3 top-3.5 w-3.5 h-3.5 text-base-content" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City"
                required
                className="input w-full pl-10"
              />
            </div>
          </div>

          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="size-5 animate-spin" />
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-base-content">
          Already have an account?{" "}
          <Link to="/login" className="link link-primary">
            Login
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};
export default Register;
