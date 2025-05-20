import { Link } from "react-router-dom";
import { LogOut, LogOutIcon, Menu, MenuIcon } from "lucide-react";
import useAuthStore from "../store/useAuthStore.js";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const authUser = useAuthStore((state) => state.authUser);
  const logout = useAuthStore((state) => state.logout);
  const handleMenuToggle = () => {
    setIsOpen((prev) => !prev);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  if (!authUser) {
    return (
      <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-4">
        {/* Left side brand */}
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl text-primary">
            Purvodaya Portal
          </Link>
        </div>

        {/* Right- Desktop */}
        <div className="hidden md:flex gap-2">
          <Link to="/login" className="btn btn-outline btn-sm md:btn-md">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm md:btn-md">
            Register
          </Link>
        </div>

        {/* Right- Mobile */}
        <div className="md:hidden relative">
          <button className="btn btn-ghost" onClick={handleMenuToggle}>
            <MenuIcon className="w-6 h-6" />
          </button>
          {isOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-base-100 shadow-lg rounded-box menu menu-md">
              <li>
                <Link to="/login" onClick={handleClose}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={handleClose}>
                  Register
                </Link>
              </li>

              <li></li>
            </ul>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-4">
        {/* Left side brand */}
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl text-primary">
            Purvodaya Portal
          </Link>
        </div>

        {/* Right- Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <span className="md:text-base">Hi, {authUser?.name || "User"}</span>
          <button className="btn btn-ghost" onClick={() => logout()}>
            <LogOutIcon className="size-5" /> Logout
          </button>
        </div>

        {/* Right- Mobile */}
        <div className="md:hidden relative">
          <button className="btn btn-ghost" onClick={handleMenuToggle}>
            <MenuIcon className="w-6 h-6" />
          </button>
          {isOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-base-100 shadow-lg rounded-box menu menu-md">
              <li>
                <Link to="/login" onClick={handleClose}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={handleClose}>
                  Register
                </Link>
              </li>

              <li></li>
            </ul>
          )}
        </div>
      </div>
    );
  }
};

export default Navbar;
