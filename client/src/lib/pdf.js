export const downloadProjectPDF = async (project) => {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const p = project;
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const generatedDate = new Date().toLocaleDateString("en-IN");

  /* =======================
     HEADER
  ======================= */
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Purvodaya Energy Solutions", pageWidth / 2, 14, {
    align: "center",
  });

  doc.setLineWidth(0.5);
  doc.line(14, 18, pageWidth - 14, 18);

  doc.setFontSize(18);
  doc.text("Project Completion Report", pageWidth / 2, 30, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Date Generated: ${generatedDate}`, pageWidth - 14, 38, {
    align: "right",
  });

  /* =======================
     PROJECT DETAILS
  ======================= */
  let y = 48;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Project Details", 14, y);

  y += 4;
  doc.setLineWidth(0.2);
  doc.line(14, y, pageWidth - 14, y);

  y += 8;
  doc.setFont("helvetica", "normal");

  const leftX = 14;
  const rightX = pageWidth / 2 + 5;

  doc.text(`Client Name: ${p.clientName}`, leftX, y);
  doc.text(`Project Type: ${p.type}`, rightX, y);

  y += 6;
  doc.text(`Contact: ${p.clientContact}`, leftX, y);
  doc.text(`Capacity: ${p.kw} kW`, rightX, y);

  y += 6;
  doc.text(
    `Started On: ${new Date(p.createdAt).toLocaleDateString("en-IN")}`,
    leftX,
    y
  );
  doc.text(`Final Status: ${p.status}`, rightX, y);

  y += 10;
  doc.text("Address:", leftX, y);
  y += 6;
  doc.text(`${p.full_address || "-"}, ${p.city}, ${p.pincode}`, leftX, y, {
    maxWidth: pageWidth - 28,
  });

  /* =======================
     STATUS HISTORY TABLE
  ======================= */
  autoTable(doc, {
    startY: y + 12,
    head: [["Status", "Changed At", "Marked By"]],
    body: p.statusHistory.map((h) => [
      h.status,
      new Date(h.changedAt).toLocaleDateString("en-IN"),
      h.changedBy?.name || "System",
    ]),
    theme: "striped",
    headStyles: {
      fillColor: [33, 150, 243],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    margin: { left: 14, right: 14 },
  });

  /* =======================
     FOOTER
  ======================= */
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.text(
      `Purvodaya Energy Solutions | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  /* =======================
     SAVE FILE
  ======================= */
  const safeName = p.clientName.replace(/\s+/g, "_");
  doc.save(`Project_Report_${safeName}.pdf`);
};

export async function downloadAttendancePDF(summary, month, year) {
  const [{ default: jsPDF }, { default: autoTable }, { default: dayjs }] =
    await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
      import("dayjs"),
    ]);
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(
    `Attendance Report - ${dayjs(`${year}-${month}-01`).format("MMMM YYYY")}`,
    14,
    22
  );

  autoTable(doc, {
    startY: 30,
    head: [["#", "Name", "Email", "Present Days", "Absent Days"]],
    body: summary.map((emp, index) => [
      index + 1,
      emp.name,
      emp.email,
      emp.presentDays,
      emp.absentDays,
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [52, 152, 219] },
  });

  doc.save(`Attendance-${month}-${year}.pdf`);
}
