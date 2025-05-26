import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import dayjs from "dayjs";

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

export const getAttendanceSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    // Fix date handling
    const start = dayjs(`${year}-${month}-01`).startOf("month");
    const end = start.endOf("month");
    const startStr = start.format("YYYY-MM-DD");
    const endStr = end.format("YYYY-MM-DD");

    const employees = await User.find({ role: "employee" });

    const attendanceRecords = await Attendance.find({
      date: { $gte: startStr, $lte: endStr },
    });

    const summary = employees.map((emp) => {
      let present = 0;
      let absent = 0;
      let absentDates = [];

      const empIdStr = emp._id.toString();

      attendanceRecords.forEach((record) => {
        const presentIds = record.present.map((id) => id.toString());
        const absentIds = record.absent.map((id) => id.toString());

        if (presentIds.includes(empIdStr)) {
          present++;
        } else if (absentIds.includes(empIdStr)) {
          absent++;
          absentDates.push(record.date); // Already string in "YYYY-MM-DD"
        }
      });

      return {
        _id: emp._id,
        name: emp.name,
        email: emp.email,
        presentDays: present,
        absentDays: absent,
        absentDates,
      };
    });

    return res.json(summary);
  } catch (error) {
    console.error("Error in getAttendanceSummary:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
