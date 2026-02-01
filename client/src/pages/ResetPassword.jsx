import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore.js";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const resetPassword = useAuthStore((state) => state.resetPassword);
  const isResetting = useAuthStore((state) => state.isResettingPassword);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const success = await resetPassword(token, password);

    if (success) {
      toast.success("Password updated successfully");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-base-200/65 shadow-lg rounded-xl p-8 space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary">
          Reset Password
        </h2>

        <p className="text-center text-sm text-base-content/70">
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">New Password</span>
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-3.5 h-3.5 text-base-content z-10" />
              <input
                type={showPassword ? "text" : "password"}
                className="input w-full pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-3.5 opacity-70 hover:opacity-100"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Confirm Password</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-3.5 h-3.5 text-base-content z-10" />
              <input
                type="password"
                className="input w-full pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isResetting}
          >
            {isResetting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
