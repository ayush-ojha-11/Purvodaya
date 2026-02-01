import User from "../models/User.js";
import Inventory from "../models/Inventory.js";
import Attendance from "../models/Attendance.js";
import Project from "../models/Project.js";
import Lead from "../models/Lead.js";

export const getAdminDashboardStats = async (req, res) => {
  try {
    const [
      employeesCount,
      totalAttendance,
      totalProjects,
      totalLeads,
      totalInventory,
    ] = await Promise.all([
      User.countDocuments({ role: "employee" }),
      Attendance.countDocuments(),
      Project.countDocuments(),
      Lead.countDocuments(),
      Inventory.countDocuments(),
    ]);

    await res.status(200).json({
      employeesCount,
      totalAttendance,
      totalProjects,
      totalInventory,
      totalLeads,
    });
  } catch (error) {
    console.log("Error in adminController (getAdminDashboardStats)", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    res.status(200).json(employees);
  } catch (error) {
    console.log("Error in adminController (getAllEmployees)");
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(employeeId);
    if (!deletedUser) {
      return res.status(404).json({ message: "Employee not found!" });
    }
    res.status(200).json({ message: "Employee deleted successfully." });
  } catch (error) {
    console.log("Error in adminController (deleteEmployee)");
    res.status(500).json({ message: "Internal server error!" });
  }
};
