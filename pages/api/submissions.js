import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Login karणे आवश्यक आहे." });
  }

  const submissions = await prisma.submission.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { documents: true },
  });

  return res.status(200).json({ submissions });
}
