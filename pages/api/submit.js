import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/prisma";

// Default Next.js body limit is 1MB — base64 documents/photo easily exceed
// that. Vercel's serverless functions cap request bodies at ~4.5MB
// regardless of this setting, so keep combined uploads under that.
export const config = {
  api: { bodyParser: { sizeLimit: "4mb" } },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Login karणे आवश्यक आहे." });
  }

  // JWT sessions can outlive the actual User row (e.g. if the database was
  // reset while a browser still held an old login cookie). Catching that
  // here gives a clear, actionable message instead of a raw FK error.
  const userExists = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!userExists) {
    return res.status(401).json({
      error: "Tumcha session expire zala aahe (account sapadle nahi). Kripaya logout karun punha login kara.",
    });
  }

  try {
    const { form, fieldSource, photoData, documents, status } = req.body;

    const submission = await prisma.submission.create({
      data: {
        status: status || "submitted",
        userId: session.user.id,
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
        paternalGrandfatherName: form.paternalGrandfatherName || null,
        paternalGrandmotherName: form.paternalGrandmotherName || null,
        maternalGrandfatherName: form.maternalGrandfatherName || null,
        maternalGrandmotherName: form.maternalGrandmotherName || null,
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
