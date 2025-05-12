import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  markAttendanceForEmployee,
  getMyAttendance,
  getAllAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

// Admin marks attendance for employees
router.post("/mark/:employeeId", protect, adminOnly, markAttendanceForEmployee);

//Admin views all attendance
router.get("/all", protect, adminOnly, getAllAttendance);

//Employee views his own attendance
router.get("/me", protect, getMyAttendance);

export default router;
