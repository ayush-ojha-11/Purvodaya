import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function formatDate(timestamp) {
  if (!timestamp) return "";

  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

  // For older notifications, display the date
  return past.toLocaleDateString();
}

export const downloadProjectPDF = (project) => {
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
