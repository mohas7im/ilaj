import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaNeon, PrismaNeonHttp } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // PrismaNeonHttp uses Neon's HTTP transport (fetch-based): stateless, so one
  // client can be shared by every request on Cloudflare Workers. It can't run
  // transactions though — use withTransactionalPrisma for those writes.
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, {});
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Runs `fn` with a short-lived WebSocket client, which supports transactions
 * (e.g. nested writes). Workers can't share sockets across requests, so the
 * client is created per call and always disconnected to free its memory.
 */
export async function withTransactionalPrisma<T>(
  fn: (client: PrismaClient) => Promise<T>
): Promise<T> {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
  const client = new PrismaClient({ adapter });
  try {
    return await fn(client);
  } finally {
    await client.$disconnect();
  }
}
