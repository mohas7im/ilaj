-- AlterTable
ALTER TABLE "inquiries" ADD COLUMN "emailStatus" TEXT NOT NULL DEFAULT 'pending';

-- Existing inquiries were created before email delivery was tracked.
UPDATE "inquiries" SET "emailStatus" = 'unknown';
