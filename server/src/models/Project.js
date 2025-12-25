import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
  clientName: { type: String, required: true },
  clientContact: { type: String, required: true },
  full_address: String,
  city: String,
  pincode: String,
  type: String,
  kw: String,
  status: { type: String, required: true },
  statusHistory: [
    {
      status: { type: String, required: true },
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      changedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Project", projectSchema);
