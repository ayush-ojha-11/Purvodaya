import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  markAttendance,
  getAttendanceSummary,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/mark", protect, adminOnly, markAttendance);
router.get("/records", protect, adminOnly, getAttendanceSummary);
export default router;
