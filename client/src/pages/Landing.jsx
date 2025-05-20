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
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* HERO SECTION */}
      <section className="w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-8 px-6 lg:px-20 py-16">
        {/* TEXT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1 text-center lg:text-left"
        >
          <h1 className="text-5xl lg:text-5xl font-bold text-primary leading-tight mb-4">
            Purvodaya Energy Solutions
          </h1>
          <p className="text-lg lg:text-xl text-base-content max-w-xl mx-auto lg:mx-0 mb-6">
            Streamline your solar business with our all-in-one platform — manage{" "}
            <span className="font-semibold text-primary">attendance</span>,
            <span className="font-semibold text-primary"> inventory</span>, and
            <span className="font-semibold text-primary">
              {" "}
              project tracking
            </span>
            .
          </p>
          <div className="flex justify-center lg:justify-start gap-4">
            <Link to="/login">
              <button className="btn btn-primary px-6 text-lg">Login</button>
            </Link>
            <Link to="/register">
              <button className="btn btn-outline btn-secondary px-6 text-lg">
                Create Account
              </button>
            </Link>
          </div>
        </motion.div>

        {/* IMAGE SECTION */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1"
        >
          <img
            src={heroImg}
            alt="Solar Panel Illustration"
            className="max-w-md mx-auto sm:size-96 size-80"
          />
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="w-full bg-base-100 py-16 px-6 lg:px-20">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-primary mb-2">
            Core Features
          </h2>
          <p className="text-base-content max-w-2xl mx-auto">
            Everything you need to manage your solar workforce and business
            operations.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {[
            {
              title: "Attendance & HR",
              desc: "Track and export attendance. Employees can view their own daily records.",
              icon: "📅",
            },
            {
              title: "Inventory Management",
              desc: "Admin-controlled inventory with employee request and approval workflow.",
              icon: "📦",
            },
            {
              title: "Project Tracking",
              desc: "Monitor ongoing and completed solar installations with real-time updates.",
              icon: "📊",
            },
            {
              title: "Secure Login System",
              desc: "Role-based dashboards for Admins and Employees with secure JWT auth.",
              icon: "🔐",
            },
            {
              title: "Export Reports",
              desc: "Download attendance and inventory logs in Excel or CSV format.",
              icon: "📁",
            },
            {
              title: "Fully Responsive",
              desc: "Optimized UI and performance for desktops, tablets, and mobile devices.",
              icon: "📱",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-2">{feature.icon}</div>
                <h2 className="card-title text-primary">{feature.title}</h2>
                <p className="text-base-content text-sm">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
