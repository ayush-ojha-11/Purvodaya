import mongoose from "mongoose";

const inventoryRequestSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  inventoryItem: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory" },
  type: { type: String, enum: ["add", "update", "delete"], required: true },
  data: { type: Object }, // contains proposed changes
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("InventoryRequest", inventoryRequestSchema);
