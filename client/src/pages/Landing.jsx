/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import heroImg from "../assets/solar.svg";
import useAuthStore from "../store/useAuthStore";
import { useEffect } from "react";

export default function Landing() {
  const authUser = useAuthStore((state) => state.authUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      if (authUser?.role === "admin") navigate("/admin/dashboard");
      else if (authUser?.role === "employee") navigate("/employee/dashboard");
    }
  }, [authUser, navigate]);

  return (
    <div className="min-h-screen bg-linear-to-b from-base-100 to-base-200">
      {/* HERO */}
      <section className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12 px-6 lg:px-20 py-24">
        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left"
        >
          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
            Powering Solar
            <span className="block text-primary">Operations Smarter</span>
          </h1>

          <p className="text-lg lg:text-xl text-base-content/80 max-w-xl mb-8">
            One platform to manage{" "}
            <span className="text-primary font-semibold">attendance</span>,{" "}
            <span className="text-primary font-semibold">inventory</span>, and{" "}
            <span className="text-primary font-semibold">projects</span> — built
            for solar teams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/login" className="btn btn-primary btn-lg px-8">
              Get Started
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg px-8">
              Create Account
            </Link>
          </div>
        </motion.div>

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          <img
            src={heroImg}
            alt="Solar Illustration"
            className="max-w-2xs mx-auto drop-shadow-xl"
          />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 lg:px-20 bg-base-100">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-3">Core Features</h2>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            Everything you need to run solar operations efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Attendance & HR",
              desc: "Daily attendance with export-ready reports.",
              icon: "📅",
            },
            {
              title: "Inventory Control",
              desc: "Requests, approvals, and stock tracking.",
              icon: "📦",
            },
            {
              title: "Project Tracking",
              desc: "Live project status and progress updates.",
              icon: "📊",
            },
            {
              title: "Secure Access",
              desc: "Role-based dashboards with JWT auth.",
              icon: "🔐",
            },
            {
              title: "Report Exports",
              desc: "Excel & CSV downloads in one click.",
              icon: "📁",
            },
            {
              title: "Responsive UI",
              desc: "Works perfectly on mobile and desktop.",
              icon: "📱",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="card bg-base-200 border border-base-300 shadow-md hover:shadow-xl transition-all"
            >
              <div className="card-body text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="text-xl font-semibold text-primary">
                  {f.title}
                </h3>
                <p className="text-sm text-base-content/80">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
