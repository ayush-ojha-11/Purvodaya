import mongoose from "mongoose";
const inventorySchema = new mongoose.Schema({
  material: { type: String, required: true },
  maker: { type: String, required: true },
  model: { type: String, required: true },
  remainingStock: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Inventory", inventorySchema);
