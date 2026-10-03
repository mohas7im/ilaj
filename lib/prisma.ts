import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // PrismaNeonHttp uses Neon's HTTP transport (fetch-based), which is the
  // correct adapter for Cloudflare Workers. PrismaNeon uses WebSockets (Pool)
  // which hangs in Workers, and PrismaPg uses raw TCP which is blocked entirely.
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, {});
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
