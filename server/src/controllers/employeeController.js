import dayjs from "dayjs";
import Attendance from "../models/Attendance.js";
import InventoryRequest from "../models/InventoryRequest.js";

export const getEmployeeDashboardStats = async (req, res) => {
  try {
    const employeeId = req.user._id;

    //Attendance summary for current month

    const start = dayjs().startOf("month").format("YYYY-MM-DD");
    const end = dayjs().endOf("month").format("YYYY-MM-DD");

    const attendanceRecords = await Attendance.find({
      date: { $gte: start, $lte: end },
    });

    let presentDays = 0;
    let absentDays = 0;

    attendanceRecords.forEach((record) => {
      const presentIds = record.present.map((id) => id.toString());
      const absentIds = record.absent.map((id) => id.toString());

      if (presentIds.includes(employeeId.toString())) presentDays++;
      else if (absentIds.includes(employeeId.toString())) absentDays++;
    });

    //Inventory request summary
    const requests = await InventoryRequest.find({ employee: employeeId });
    const requestStats = {
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      approved: requests.filter((r) => r.status === "approved").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    };

    return res.status(200).json({
      presentDays,
      absentDays,
      inventoryRequestStats: requestStats,
    });
  } catch (error) {
    console.error("Error in getEmployeeDashboardStats:", error.message);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
