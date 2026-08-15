import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { form, fieldSource, photoData, documents, status } = req.body;

    const submission = await prisma.submission.create({
      data: {
        status: status || "submitted",
        photoData: photoData || null,
        voterName: form.voterName || null,
        epicNumber: form.epicNumber || null,
        dob: form.dob || null,
        aadhaarNumber: form.aadhaarNumber || null,
        mobileNumber: form.mobileNumber || null,
        address: form.address || null,
        district: form.district || null,
        state: form.state || null,
        assemblyConstituency: form.assemblyConstituency || null,
        partNumber: form.partNumber || null,
        fatherName: form.fatherName || null,
        fatherEpic: form.fatherEpic || null,
        motherName: form.motherName || null,
        motherEpic: form.motherEpic || null,
        spouseName: form.spouseName || null,
        spouseEpic: form.spouseEpic || null,
        fieldSource: JSON.stringify(fieldSource || {}),
        documents: {
          create: (documents || []).map((d) => ({
            docType: d.docType,
            fileName: d.fileName,
            mimeType: d.mimeType || null,
            fileData: d.base64,
          })),
        },
      },
    });

    return res.status(200).json({ id: submission.id });
  } catch (err) {
    console.error("Submit error:", err);
    return res.status(500).json({ error: "Save fail zale: " + err.message });
  }
}
