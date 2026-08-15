import PDFDocument from "pdfkit";
import { prisma } from "../../lib/prisma";
import { FIELD_GROUPS } from "../../lib/documentTypes";

const NAVY = "#16416B";
const INK = "#1C2620";
const MUTED = "#5B6862";
const GREEN = "#2F6E4B";

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Submission id lagto." });

  const submission = await prisma.submission.findUnique({ where: { id } });
  if (!submission) return res.status(404).json({ error: "Submission sapadle nahi." });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="SIR-form-${id}.pdf"`);

  const doc = new PDFDocument({ size: "A4", margin: 40 });
  doc.pipe(res);

  // Header band
  doc.rect(0, 0, doc.page.width, 70).fill(NAVY);
  doc.fillColor("#FFFFFF").fontSize(16).font("Helvetica-Bold").text("गणना प्रपत्र — SIR Enumeration Form", 40, 22);
  doc.fontSize(9).font("Helvetica").text("Auto-Fill Assistant द्वारे तयार केलेला मसुदा", 40, 44);
  doc.fillColor(INK);

  let y = 90;

  // Passport photo (top-right)
  if (submission.photoData) {
    try {
      const base64 = submission.photoData.split(",")[1] || submission.photoData;
      const buffer = Buffer.from(base64, "base64");
      doc.image(buffer, doc.page.width - 130, y, { width: 85, height: 100 });
    } catch (e) {
      // ignore bad image data
    }
  }

  doc.fontSize(9).fillColor(MUTED).text(`Submission ID: ${submission.id}`, 40, y);
  doc.text(`Date: ${new Date(submission.createdAt).toLocaleDateString("en-IN")}`, 40, y + 14);
  y += 45;

  const fieldMap = {
    voterName: submission.voterName,
    epicNumber: submission.epicNumber,
    dob: submission.dob,
    aadhaarNumber: submission.aadhaarNumber,
    mobileNumber: submission.mobileNumber,
    address: submission.address,
    district: submission.district,
    state: submission.state,
    assemblyConstituency: submission.assemblyConstituency,
    partNumber: submission.partNumber,
    fatherName: submission.fatherName,
    fatherEpic: submission.fatherEpic,
    motherName: submission.motherName,
    motherEpic: submission.motherEpic,
    spouseName: submission.spouseName,
    spouseEpic: submission.spouseEpic,
  };

  FIELD_GROUPS.forEach((group) => {
    doc.moveDown(0.5);
    y = doc.y + 10;
    doc.fontSize(11).font("Helvetica-Bold").fillColor(NAVY).text(group.title.replace(/^[^\-]+—\s*/, ""), 40, y);
    y = doc.y + 6;
    doc.moveTo(40, y).lineTo(doc.page.width - 40, y).strokeColor("#D8DED9").stroke();
    y += 10;

    group.fields.forEach((f) => {
      const label = f.label.split(" / ")[1] || f.label;
      const value = fieldMap[f.key] || "—";
      doc.fontSize(9.5).font("Helvetica").fillColor(MUTED).text(label, 40, y, { width: 220 });
      doc.fontSize(10).font("Helvetica-Bold").fillColor(INK).text(value, 270, y, { width: 280 });
      y += 20;
      if (y > doc.page.height - 100) {
        doc.addPage();
        y = 50;
      }
    });
    doc.y = y;
  });

  doc.moveDown(2);
  doc.fontSize(8.5).fillColor(MUTED).font("Helvetica-Oblique").text(
    "टीप: हा मसुदा (draft) आहे. अधिकृत ECI/SIR पोर्टलवर सबमिट करण्यापूर्वी सर्व माहिती पुन्हा एकदा पडताळून पाहा.",
    40,
    doc.y + 10,
    { width: doc.page.width - 80 }
  );

  doc.fillColor(GREEN).fontSize(8.5).text("✓ Verified in Auto-Fill Assistant", 40, doc.y + 8);

  doc.end();
}
