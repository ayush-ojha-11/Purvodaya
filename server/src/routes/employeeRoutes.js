import express from "express";
import { getEmployeeDashboardStats } from "../controllers/employeeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-stats", protect, getEmployeeDashboardStats);

export default router;
