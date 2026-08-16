// Prisma client singleton — avoids creating a new DB connection on every
// hot-reload in dev mode.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// Neon (especially the free tier) caps total connections fairly low.
// Prisma's default pool size is computed from CPU core count, which is
// often way more than Neon allows — that mismatch is what causes
// "Timed out fetching a new connection from the connection pool" errors.
// We cap it explicitly here instead of requiring every dev to edit .env.
function withConnectionLimit(url) {
  if (!url) return url;
  const hasParams = url.includes("?");
  const alreadySet = /[?&]connection_limit=/.test(url);
  if (alreadySet) return url;
  return url + (hasParams ? "&" : "?") + "connection_limit=5&pool_timeout=20";
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    datasources: {
      db: { url: withConnectionLimit(process.env.DATABASE_URL) },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
