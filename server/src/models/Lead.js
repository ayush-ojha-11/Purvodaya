import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  clientName: String,
  clientContact: String,
  full_address: String,
  city: String,
  pincode: String,
  type: String,
  kw: String,
  status: {
    type: String,
    enum: ["pending", "confirmed", "rejected"],
    default: "pending",
  },
  rejectionReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Lead", leadSchema);
