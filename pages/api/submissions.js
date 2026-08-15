import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
    include: { documents: true },
  });

  return res.status(200).json({ submissions });
}
