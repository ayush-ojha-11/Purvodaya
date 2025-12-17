import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    clientName: { type: String, required: true },
    clienContact: { type: String, required: true },
    description: String,
    type: {
      type: String,
      enum: ["off-grid", "on-grid", "hybrid"],
      required: true,
    },
    kw: { type: Number, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
