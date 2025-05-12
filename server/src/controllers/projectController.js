import Project from "../models/Project.js";

// GET all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.log("Error in projectController (getAllProjects)");
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// POST: Admin creates a project
export const createProject = async (req, res) => {
  try {
    const { title, description, status, startDate, endDate } = req.body;
    const project = new Project({
      title,
      description,
      status,
      startDate,
      endDate,
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.log("Error in projectController (createProject)");
    return res.status(500).json({ message: "Internal server error!" });
  }
};

//PUT : Admin can update a project
export const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(updated);
  } catch (error) {
    console.log("Error in projectController (updateProject)");
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// DELETE: Admin can delete a project
export const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted" });
  } catch (error) {
    console.log("Error in projectController (deleteProject)");
    return res.status(500).json({ message: "Internal server error!" });
  }
};
