import User from "../models/User.js";
import Inventory from "../models/Inventory.js";
import Attendance from "../models/Attendance.js";
import Project from "../models/Project.js";

export const getAdminDashboardStats = async (req, res) => {
  try {
    const employeesCount = await User.countDocuments({ role: "employee" });
    const totalAttendance = await Attendance.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalInventory = await Inventory.countDocuments();

    res.status(200).json({
      employeesCount,
      totalAttendance,
      totalProjects,
      totalInventory,
    });
  } catch (error) {
    console.log("Error in adminController (getAdminDashboardStats)");
    res.status(500).json({ message: "Internal server error!" });
  }
};
