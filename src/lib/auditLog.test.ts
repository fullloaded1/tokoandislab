import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "./db";

describe("AuditLog and StockLog with AdminUser FK", () => {
  let adminUserId = "";

  beforeAll(async () => {
    // Upsert a test admin user
    const admin = await prisma.adminUser.upsert({
      where: { email: "testadmin@test.local" },
      create: {
        email: "testadmin@test.local",
        name: "Test Admin",
        role: "ADMIN"
      },
      update: {}
    });
    adminUserId = admin.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.auditLog.deleteMany({ where: { actorId: adminUserId } });
    await prisma.stockLog.deleteMany({ where: { actorId: adminUserId } });
    await prisma.adminUser.delete({ where: { id: adminUserId } });
  });

  it("can create an AuditLog referencing a valid AdminUser actorId", async () => {
    const log = await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entityType: "TestEntity",
        entityId: "test-id-123",
        actorId: adminUserId,
        notes: "Testing audit log FK"
      }
    });

    expect(log.id).toBeDefined();
    expect(log.actorId).toBe(adminUserId);

    // Verify relation works
    const logWithActor = await prisma.auditLog.findUnique({
      where: { id: log.id },
      include: { actor: true }
    });

    expect(logWithActor?.actor?.email).toBe("testadmin@test.local");
  });

});
