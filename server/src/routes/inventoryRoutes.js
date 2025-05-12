import express from "express";
import {
  getAllInventory,
  addinventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  submitInventoryRequest,
  getAllInventoryRequests,
  approveInventoryRequest,
  rejectInventoryRequest,
} from "../controllers/inventoryController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee + Admin
router.get("/", protect, getAllInventory);

// Admin-only routes
router.post("/", protect, adminOnly, addinventoryItem);
router.put("/:id", protect, adminOnly, updateInventoryItem);
router.delete("/:id", protect, adminOnly, deleteInventoryItem);

// Employee only route
router.post("/request", protect, submitInventoryRequest);

// Admin: View and manage requests
router.get("/requests", protect, adminOnly, getAllInventoryRequests);
router.put("/request/:id/approve", protect, adminOnly, approveInventoryRequest);
router.put("/request/:id/reject", protect, adminOnly, rejectInventoryRequest);

export default router;
