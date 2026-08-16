import PDFDocument from "pdfkit";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/prisma";
import { FIELD_GROUPS, loc } from "../../lib/documentTypes";

const NAVY = "#16416B";
const INK = "#1C2620";
const MUTED = "#5B6862";
const GREEN = "#2F6E4B";

// PDF is generated in Marathi (the app's default/primary language) regardless
// of which language the browser was set to — keeps the exported form consistent.
const PDF_LANG = "mr";

const FONT_PATH = path.join(process.cwd(), "assets", "fonts", "NotoSansDevanagari-Regular.ttf");

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Submission id lagto." });

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Login karणे आवश्यक आहे." });

  const submission = await prisma.submission.findUnique({ where: { id } });
  if (!submission) return res.status(404).json({ error: "Submission sapadle nahi." });
  if (submission.userId !== session.user.id) {
    return res.status(403).json({ error: "Ha submission tumcha nahi." });
  }

  try {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="SIR-form-${id}.pdf"`);

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    doc.pipe(res);

  // Devanagari-capable font (also covers Latin script) — one font used
  // throughout so Marathi/Hindi + English/numbers all render correctly.
  doc.registerFont("Body", FONT_PATH);
  doc.font("Body");

  // Header band
  doc.rect(0, 0, doc.page.width, 70).fill(NAVY);
  doc.fillColor("#FFFFFF").fontSize(16).text("गणना प्रपत्र — SIR Enumeration Form", 40, 22);
  doc.fontSize(9).text("Auto-Fill Assistant द्वारे तयार केलेला मसुदा", 40, 44);
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
    paternalGrandfatherName: submission.paternalGrandfatherName,
    paternalGrandmotherName: submission.paternalGrandmotherName,
    maternalGrandfatherName: submission.maternalGrandfatherName,
    maternalGrandmotherName: submission.maternalGrandmotherName,
  };

  FIELD_GROUPS.forEach((group) => {
    y = doc.y + 10;
    if (y < 135) y = 135; // first group right after the header block
    doc.fontSize(11).fillColor(NAVY).text(loc(group.title, PDF_LANG), 40, y);
    y = doc.y + 6;
    doc.moveTo(40, y).lineTo(doc.page.width - 40, y).strokeColor("#D8DED9").stroke();
    y += 10;

    group.fields.forEach((f) => {
      const label = loc(f.label, PDF_LANG);
      const value = fieldMap[f.key] || "—";
      doc.fontSize(9.5).fillColor(MUTED).text(label, 40, y, { width: 220 });
      doc.fontSize(10).fillColor(INK).text(value, 270, y, { width: 280 });
      y += 20;
      if (y > doc.page.height - 100) {
        doc.addPage();
        doc.font("Body");
        y = 50;
      }
    });
    doc.y = y;
  });

  doc.moveDown(2);
  doc.fontSize(8.5).fillColor(MUTED).text(
    "टीप: हा मसुदा (draft) आहे. अधिकृत ECI/SIR पोर्टलवर सबमिट करण्यापूर्वी सर्व माहिती पुन्हा एकदा पडताळून पाहा.",
    40,
    doc.y + 10,
    { width: doc.page.width - 80 }
  );

  doc.fillColor(GREEN).fontSize(8.5).text("Verified in Auto-Fill Assistant", 40, doc.y + 8);

  doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "PDF tayar karta ale nahi: " + err.message });
    } else {
      res.end();
    }
  }
}
