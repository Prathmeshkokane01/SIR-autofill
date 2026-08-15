import formidable from "formidable";
import fs from "fs";
import os from "os";
import { extractFieldsFromDocuments } from "../../lib/gemini";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Use OS temp dir — safe on Vercel's read-only filesystem (only /tmp is writable there)
  const form = formidable({
    uploadDir: os.tmpdir(),
    keepExtensions: true,
    maxFileSize: 15 * 1024 * 1024, // 15MB per file
    multiples: true,
  });

  try {
    const [fields, filesRaw] = await form.parse(req);

    const docTypes = [].concat(fields.docTypes || []);
    const uploaded = [].concat(filesRaw.files || []);

    if (uploaded.length === 0) {
      return res.status(400).json({ error: "कोणतीही file upload झाली नाही." });
    }

    const fileMetas = uploaded.map((f, i) => ({
      filePath: f.filepath,
      mimeType: f.mimetype,
      originalName: f.originalFilename,
      docType: docTypes[i] || "other_supporting",
    }));

    const extracted = await extractFieldsFromDocuments(fileMetas);

    // Read each file back as base64 so the frontend can hold it and send it
    // to /api/submit later — no permanent disk storage needed.
    const savedDocs = fileMetas.map((f) => {
      const base64 = fs.readFileSync(f.filePath).toString("base64");
      fs.unlink(f.filePath, () => {}); // clean up temp file
      return {
        docType: f.docType,
        fileName: f.originalName,
        mimeType: f.mimeType,
        base64,
      };
    });

    return res.status(200).json({ extracted, documents: savedDocs });
  } catch (err) {
    console.error("Extraction error:", err);
    return res.status(500).json({ error: "Extraction fail zala: " + err.message });
  }
}
