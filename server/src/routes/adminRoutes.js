import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  deleteEmployee,
  getAdminDashboardStats,
  getAllEmployees,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard-stats", protect, adminOnly, getAdminDashboardStats);
router.get("/employees", protect, adminOnly, getAllEmployees);
router.delete("/employees/:id", protect, adminOnly, deleteEmployee);

export default router;
