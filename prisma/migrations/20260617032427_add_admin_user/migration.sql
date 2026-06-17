-- AlterTable
ALTER TABLE "AuditLog" ALTER COLUMN "actorId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "StockLog_actorId_idx" ON "StockLog"("actorId");

-- Seed default admin identity (so old sessions with id 'admin' remain valid and don't fail FK)
INSERT INTO "AdminUser" ("id", "email", "name", "role", "createdAt", "updatedAt")
VALUES ('admin', 'admin', 'System Admin', 'ADMIN', NOW(), NOW())
ON CONFLICT ("email") DO NOTHING;

-- Backfill missing AdminUsers from existing AuditLog and StockLog
INSERT INTO "AdminUser" ("id", "email", "name", "role", "createdAt", "updatedAt")
SELECT DISTINCT "actorId", "actorId" || '@legacy.local', 'Legacy User ' || "actorId", 'ADMIN', NOW(), NOW()
FROM "AuditLog"
WHERE "actorId" IS NOT NULL AND "actorId" NOT IN (SELECT "id" FROM "AdminUser");

INSERT INTO "AdminUser" ("id", "email", "name", "role", "createdAt", "updatedAt")
SELECT DISTINCT "actorId", "actorId" || '@legacy.local', 'Legacy User ' || "actorId", 'ADMIN', NOW(), NOW()
FROM "StockLog"
WHERE "actorId" IS NOT NULL AND "actorId" NOT IN (SELECT "id" FROM "AdminUser");

-- AddForeignKey
ALTER TABLE "StockLog" ADD CONSTRAINT "StockLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
