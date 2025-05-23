import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

//Admin can mark attendance of employees
export const markAttendanceForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const user = await User.findById(employeeId);

    if (!user || user.role !== "employee") {
      return res.status(404).json({ message: "Employee not found!" });
    }
    // checking if attendance is already marked for today or not
    const existingRecord = await Attendance.findOne({
      user: employeeId,
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999),
      },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for today" });
    }
    const attendance = new Attendance({
      user: employeeId,
      status: "present",
    });
    await attendance.save();
    res.status(201).json({ message: "Attendance marked for employee" });
  } catch (error) {
    console.log(
      "Error in attendance Controller (markAttendanceForEmployee)",
      error.message
    );
    return res.status(500).json({ message: "Internal server error!" });
  }
};

//Employee can view their own attendance
export const getMyAttendance = async (req, res) => {
  try {
    const data = await Attendance.find({ user: req.user._id }).sort({
      date: -1,
    });
    return res.json(data);
  } catch (error) {
    console.log(
      "Error in attendanceController (getMyAttendance)",
      error.message
    );
    return res.status(500).json({ message: "Internal server error!" });
  }
};

//Admin views all attendance
export const getAllAttendance = async (req, res) => {
  try {
    const data = (await Attendance.find().populate("user", "name email")).sort({
      data: -1,
    });
    return res.status(200).json(data);
  } catch (error) {
    console.log(
      "Error in attendanceController (getAllAttendance)",
      error.message
    );
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { date, present, absent } = req.body;
    if (!date || !Array.isArray(present) || !Array.isArray(absent)) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    const existing = await Attendance.findOne({ date });
    if (existing) {
      //Update if already exists
      existing.present = present;
      existing.absent = absent;
      await existing.save();
      return res.status(200).json({ message: "Attendance updated." });
    } else {
      // Create new record
      await Attendance.create({ date, present, absent });
      return res
        .status(201)
        .json({ message: "Attendance marked successfully." });
    }
  } catch (error) {
    console.log(
      "Error in attendanceController (markAttendance)",
      error.message
    );
    return res.status(500).json({ message: "Internal server error!" });
  }
};
