import express from "express";
import {
  deleteAllProjects,
  deleteProject,
  getAllProjects,
  updateProjectStatus,
} from "../controllers/projectController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllProjects);
router.delete("/delete/:id", protect, adminOnly, deleteProject);
router.delete("/deleteAll", protect, adminOnly, deleteAllProjects);
router.put("/:id/status", protect, updateProjectStatus);

export default router;
