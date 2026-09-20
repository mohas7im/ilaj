import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_mKvf7o8bMdUH@ep-solitary-poetry-az867tpz-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
  });
}

export function getPrismaClient(): PrismaClient {
  if (
    globalForPrisma.prisma &&
    "inquiry" in globalForPrisma.prisma &&
    "testimonial" in globalForPrisma.prisma &&
    "doctor" in globalForPrisma.prisma &&
    "service" in globalForPrisma.prisma
  ) {
    return globalForPrisma.prisma;
  }

  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  return client;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
