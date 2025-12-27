import { Link } from "react-router-dom";
import { MenuIcon, XIcon } from "lucide-react";
import useAuthStore from "../store/useAuthStore.js";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const authUser = useAuthStore((state) => state.authUser);

  if (authUser) return null;

  return (
    <header className="sticky top-0 z-50 bg-base-100/80 backdrop-blur border-b border-base-300">
      <div className="navbar max-w-7xl mx-auto px-4">
        {/* Brand */}
        <div className="flex-1">
          <Link
            to="/"
            className="text-xl font-bold tracking-wide text-primary hover:opacity-90 transition"
          >
            Purvodaya<span className="text-base-content">Portal</span>
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="btn btn-ghost btn-sm hover:bg-base-200">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm shadow-sm">
            Register
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden relative">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-6 w-52 rounded-xl bg-base-100 shadow-xl border border-base-300 animate-in fade-in slide-in-from-top-2">
              <ul className="menu p-2 gap-1">
                <li>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg font-medium text-primary"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
