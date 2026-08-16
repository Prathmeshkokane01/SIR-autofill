import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Login karणे आवश्यक आहे." });
  }

  const submission = await prisma.submission.findUnique({ where: { id } });
  if (!submission) {
    return res.status(404).json({ error: "Submission sapadle nahi." });
  }
  if (submission.userId !== session.user.id) {
    return res.status(403).json({ error: "Ha submission tumcha nahi." });
  }

  if (req.method === "DELETE") {
    try {
      // schema.prisma cha Document model onDelete: Cascade mule
      // related documents automatically delete hotात, vegla query lagat nahi.
      await prisma.submission.delete({ where: { id } });
      return res.status(200).json({ deleted: true });
    } catch (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ error: "Delete fail zale: " + err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
