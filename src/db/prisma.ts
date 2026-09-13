// Prisma client singleton
// Ensures a single PrismaClient instance is reused across hot reloads in dev
// TODO: Initialize Prisma client
// Example:
//   import { PrismaClient } from '@prisma/client'
//   const globalForPrisma = global as unknown as { prisma: PrismaClient }
//   export const db = globalForPrisma.prisma ?? new PrismaClient()
//   if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export {};
