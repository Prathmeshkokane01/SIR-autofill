import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { prisma } from "../../lib/prisma";
import { FIELD_GROUPS } from "../../lib/documentTypes";

const NAVY = "#16416B";
const INK = "#1C2620";
const MUTED = "#5B6862";
const GREEN = "#2F6E4B";

// Devanagari (Marathi/Hindi) glyphs are NOT in pdfkit's built-in Helvetica
// font. Writing Marathi text with "Helvetica" throws a glyph error *after*
// headers + partial PDF bytes are already streamed to the response, which
// is exactly what produced the "ERR_INVALID_RESPONSE" / broken PDF download.
// Fix: embed a Unicode font that actually has Devanagari glyphs.
const REGULAR_FONT_PATH = path.join(process.cwd(), "fonts", "NotoSansDevanagari-Regular.ttf");
const BOLD_FONT_PATH = path.join(process.cwd(), "fonts", "NotoSansDevanagari-Bold.ttf");
const hasUnicodeFont = fs.existsSync(REGULAR_FONT_PATH) && fs.existsSync(BOLD_FONT_PATH);

function registerFonts(doc) {
  if (hasUnicodeFont) {
    doc.registerFont("Body", REGULAR_FONT_PATH);
    doc.registerFont("Body-Bold", BOLD_FONT_PATH);
  } else {
    // Fallback so English-only content still works instead of crashing —
    // but Marathi/Hindi text won't render correctly until the font files
    // are added under /fonts (see fonts/README.md).
    doc.registerFont("Body", "Helvetica");
    doc.registerFont("Body-Bold", "Helvetica-Bold");
  }
}

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Submission id lagto." });

  let submission;
  try {
    submission = await prisma.submission.findUnique({ where: { id } });
  } catch (err) {
    console.error("generate-pdf DB error:", err);
    return res.status(500).json({ error: "Database peksha data milla nahi: " + err.message });
  }
  if (!submission) return res.status(404).json({ error: "Submission sapadle nahi." });

  try {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="SIR-form-${id}.pdf"`);

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    registerFonts(doc);
    doc.pipe(res);

    // Header band
    doc.rect(0, 0, doc.page.width, 70).fill(NAVY);
    doc.fillColor("#FFFFFF").fontSize(16).font("Body-Bold").text("गणना प्रपत्र — SIR Enumeration Form", 40, 22);
    doc.fontSize(9).font("Body").text("Auto-Fill Assistant द्वारे तयार केलेला मसुदा", 40, 44);
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

    doc.fontSize(9).fillColor(MUTED).font("Body").text(`Submission ID: ${submission.id}`, 40, y);
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
      doc.moveDown(0.5);
      y = doc.y + 10;
      doc.fontSize(11).font("Body-Bold").fillColor(NAVY).text(group.title.mr.replace(/^[^\-]+—\s*/, ""), 40, y);
      y = doc.y + 6;
      doc.moveTo(40, y).lineTo(doc.page.width - 40, y).strokeColor("#D8DED9").stroke();
      y += 10;

      group.fields.forEach((f) => {
        const label = f.label.mr;
        const value = fieldMap[f.key] || "—";
        doc.fontSize(9.5).font("Body").fillColor(MUTED).text(label, 40, y, { width: 220 });
        doc.fontSize(10).font("Body-Bold").fillColor(INK).text(value, 270, y, { width: 280 });
        y += 20;
        if (y > doc.page.height - 100) {
          doc.addPage();
          y = 50;
        }
      });
      doc.y = y;
    });

    doc.moveDown(2);
    doc.fontSize(8.5).fillColor(MUTED).font("Body").text(
      "टीप: हा मसुदा (draft) आहे. अधिकृत ECI/SIR पोर्टलवर सबमिट करण्यापूर्वी सर्व माहिती पुन्हा एकदा पडताळून पाहा.",
      40,
      doc.y + 10,
      { width: doc.page.width - 80 }
    );

    doc.fillColor(GREEN).fontSize(8.5).text("✓ Verified in Auto-Fill Assistant", 40, doc.y + 8);

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    // If we haven't sent headers yet, respond with proper JSON.
    if (!res.headersSent) {
      res.status(500).json({ error: "PDF tayar karta ale nahi: " + err.message });
    } else {
      res.end();
    }
  }
}
