import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Naav, email, ani password sagle bhara." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password kimaan 6 characters cha asava." });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return res.status(409).json({ error: "Ha email already registered aahe. Login kara." });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email: normalizedEmail, passwordHash },
  });

  return res.status(200).json({ id: user.id, email: user.email });
}
