import Project from "../models/Project.js";
import { PROJECT_WORKFLOW } from "../config/projectStatus.js";

// GET all projects
export const getAllProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find()
        .populate("statusHistory.changedBy", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Project.countDocuments(),
    ]);
    res.status(200).json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalProjects: total,
    });
  } catch (error) {
    console.log("Error in projectController (getAllProjects)");
    return res.status(500).json({ message: "Internal server error!" });
  }
};
// Delete a Project
export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const deletedProject = await Project.findByIdAndDelete(projectId);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.log("Error in projectController (deleteProject)", error.message);
    res.status(500).json({ message: "Internal server error!" });
  }
};

// Delete all projects
export const deleteAllProjects = async (req, res) => {
  try {
    const result = await Project.deleteMany({});
    res.status(200).json({
      message: "All Projects deleted successfully",
    });
  } catch (error) {
    console.log(
      "Error in projectController (deleteAllProjects)",
      error.message,
    );
    res.status(500).json({ message: "Internal server error!" });
  }
};
// Update the status of project
export const updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const projectId = req.params.id;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Resolve flow based on type + paymentType (supports both flat and nested)
    const workflowEntry = PROJECT_WORKFLOW[project.type];
    const flow = Array.isArray(workflowEntry)
      ? workflowEntry
      : workflowEntry?.[project.paymentType ?? "cash"];

    if (!flow || !flow.length) {
      return res
        .status(400)
        .json({ message: `Invalid project type: ${project.type}` });
    }

    const currentIndex = flow.indexOf(project.status);
    const nextIndex = flow.indexOf(status);

    if (nextIndex === -1) {
      return res.status(400).json({
        message: `Invalid status "${status}" for project type "${project.type}"`,
      });
    }

    if (nextIndex !== currentIndex + 1) {
      return res.status(400).json({
        message: `Invalid status transition from "${project.status}" to "${status}"`,
      });
    }

    project.status = status;
    project.statusHistory.push({ status, changedBy: req.user._id });
    project.updatedAt = new Date();
    await project.save();

    const populatedProject = await Project.findById(project._id).populate(
      "statusHistory.changedBy",
      "name",
    );

    res.status(200).json({
      message: "Project status changed successfully",
      project: populatedProject,
    });
  } catch (error) {
    console.log(
      "Error in projectController (updateProjectStatus)",
      error.message,
    );
    res.status(500).json({ message: "Internal server error!" });
  }
};
