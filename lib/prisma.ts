import { AsyncLocalStorage } from "node:async_hooks";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// WebSocket mode supports transactions. On Cloudflare a connection from one
// request can't be reused by another, so each request gets its own client.

type PrismaScope = { client?: PrismaClient };

const globalForPrisma = globalThis as unknown as {
  prismaScope?: AsyncLocalStorage<PrismaScope>;
  prisma?: PrismaClient;
};

const prismaScope = (globalForPrisma.prismaScope ??= new AsyncLocalStorage<PrismaScope>());

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

/** Gives everything inside `fn` its own Prisma client (used by worker.ts). */
export function runWithPrismaScope<T>(fn: () => T): T {
  return prismaScope.run({}, fn);
}

function getPrismaClient(): PrismaClient {
  const scope = prismaScope.getStore();
  if (scope) return (scope.client ??= createPrismaClient());
  // Local dev / scripts: one shared client is fine
  return (globalForPrisma.prisma ??= createPrismaClient());
}

/** Use `prisma` exactly like before; it picks the current request's client. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
