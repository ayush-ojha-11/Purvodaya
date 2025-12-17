import express from "express";
import {
  getAllLeads,
  getMyLeads,
  createLead,
  confirmLead,
  rejectLead,
  deleteLead,
  deleteAllLeads,
} from "../controllers/leadController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllLeads);
router.get("/my", protect, getMyLeads);
router.post("/", protect, createLead);
router.put("/:id/confirm", protect, adminOnly, confirmLead);
router.put("/:id/reject", protect, adminOnly, rejectLead);
router.delete("/delete/:id", protect, adminOnly, deleteLead);
router.delete("/deleteAll", protect, adminOnly, deleteAllLeads);
export default router;
