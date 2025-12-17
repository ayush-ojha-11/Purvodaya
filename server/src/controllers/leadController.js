import { PROJECT_STATUS } from "../config/projectStatus.js";
import Lead from "../models/Lead.js";
import Project from "../models/Project.js";

// GET : All leads (ADMIN)
export const getAllLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find()
        .populate("employeeId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Lead.countDocuments(),
    ]);

    res.status(200).json({
      leads,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalLeads: total,
    });
  } catch (error) {
    console.log("Error in leadController (getAllLeads)", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// GET : my leads (Employee)
export const getMyLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ employeeId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(leads);
  } catch (error) {
    console.log("Error in leadController (getMyLeads)", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// POST a lead (Employees will post leads)
export const createLead = async (req, res) => {
  try {
    const { clientName, clientContact, full_address, city, pincode, type, kw } =
      req.body;
    const lead = new Lead({
      employeeId: req.user._id,
      clientName,
      clientContact,
      full_address,
      city,
      pincode,
      type,
      kw,
      status: "pending",
    });

    await lead.save();

    res.status(201).json(lead);
  } catch (error) {
    console.log("Error in leadController (createLead)", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// PATCH (admin confirms a lead -> creates)
export const confirmLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    lead.status = "confirmed";
    await lead.save();

    const initialStatus = "confirmed";
    // create project
    const project = new Project({
      leadId: lead._id,
      clientName: lead.clientName,
      clienContact: lead.clientContact,
      description: lead.description,
      type: lead.type,
      kw: lead.kw,
      status: initialStatus,
    });
    await project.save();
    res.status(201).json({ message: "Lead approved and project confirmed." });
  } catch (error) {
    console.log("Error in leadController (confirmLead)", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// Patch (Admin rejects a lead)
export const rejectLead = async (req, res) => {
  try {
    const { reason } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        rejectionReason: reason,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json({ message: "Lead rejected" });
  } catch (error) {
    console.log("Error in leadController (rejectLead) ", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};
//Delete a lead
export const deleteLead = async (req, res) => {
  try {
    const leadId = req.params.id;
    const deletedLead = await Lead.findByIdAndDelete(leadId);
    if (!deletedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error in lead controller (deleteLead)", error.message);
    res.status(500).json({ message: "Internal server error!" });
  }
};
// Delete all leads
export const deleteAllLeads = async (req, res) => {
  try {
    const result = await Lead.deleteMany({});
    res.status(200).json({
      message: "All leads deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.log("Error in lead controller (deleteAllLeads)", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
