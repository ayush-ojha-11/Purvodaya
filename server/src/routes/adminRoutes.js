import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAdminDashboardStats } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard-stats", protect, adminOnly, getAdminDashboardStats);

export default router;
