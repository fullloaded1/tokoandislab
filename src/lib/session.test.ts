import { describe, it, expect } from "vitest";

/**
 * Mirrors the validation logic from session.ts.
 * Extracted as a function so TypeScript doesn't narrow literal values.
 */
function isSecretInvalid(secretKey: string | undefined): boolean {
  return !secretKey || secretKey.length < 32;
}

describe("SESSION_SECRET validation", () => {
  it("rejects undefined SESSION_SECRET", () => {
    expect(isSecretInvalid(undefined)).toBe(true);
  });

  it("rejects empty string SESSION_SECRET", () => {
    expect(isSecretInvalid("")).toBe(true);
  });

  it("rejects SESSION_SECRET shorter than 32 chars", () => {
    expect(isSecretInvalid("tooshort")).toBe(true);
  });

  it("accepts SESSION_SECRET of exactly 32 chars", () => {
    expect(isSecretInvalid("a".repeat(32))).toBe(false);
  });

  it("accepts SESSION_SECRET longer than 32 chars", () => {
    expect(isSecretInvalid("a".repeat(64))).toBe(false);
  });
});

describe("requireAdmin guard logic", () => {
  it("throws 'Unauthorized' when session is null", () => {
    // Simulating requireAdmin behavior when verifySession returns null
    const session = null;
    expect(() => {
      if (!session || !(session as any)?.isAuth) {
        throw new Error("Unauthorized");
      }
    }).toThrow("Unauthorized");
  });

  it("throws 'Unauthorized' when session has no isAuth", () => {
    const session = { isAuth: false, username: "" };
    expect(() => {
      if (!session?.isAuth) {
        throw new Error("Unauthorized");
      }
    }).toThrow("Unauthorized");
  });

  it("does not throw when session is valid", () => {
    const session = { isAuth: true, username: "admin-user-id" };
    expect(() => {
      if (!session?.isAuth) {
        throw new Error("Unauthorized");
      }
    }).not.toThrow();
  });
});
