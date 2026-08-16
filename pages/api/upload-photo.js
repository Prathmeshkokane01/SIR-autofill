import formidable from "formidable";
import fs from "fs";
import os from "os";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Login karणे आवश्यक आहे." });
  }

  const form = formidable({
    uploadDir: os.tmpdir(),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  try {
    const [, files] = await form.parse(req);
    const photo = [].concat(files.photo || [])[0];
    if (!photo) return res.status(400).json({ error: "Photo file sapadli nahi." });

    const base64 = fs.readFileSync(photo.filepath).toString("base64");
    fs.unlink(photo.filepath, () => {});

    const dataUrl = `data:${photo.mimetype};base64,${base64}`;
    return res.status(200).json({ photoData: dataUrl });
  } catch (err) {
    console.error("Photo upload error:", err);
    return res.status(500).json({ error: "Photo upload fail zala: " + err.message });
  }
}
