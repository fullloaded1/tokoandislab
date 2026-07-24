import { describe, it, expect } from "vitest";
import { verifyGuestOrderAccess } from "./guestAccess";

describe("verifyGuestOrderAccess", () => {
  it("valid token without expiry returns true", () => {
    expect(verifyGuestOrderAccess({ guestAccessToken: "token123", guestAccessTokenExpiresAt: null }, "token123")).toBe(true);
  });

  it("valid token with future expiry returns true", () => {
    const futureDate = new Date(Date.now() + 100000);
    expect(verifyGuestOrderAccess({ guestAccessToken: "token123", guestAccessTokenExpiresAt: futureDate }, "token123")).toBe(true);
  });

  it("expired token returns false", () => {
    const pastDate = new Date(Date.now() - 100000);
    expect(verifyGuestOrderAccess({ guestAccessToken: "token123", guestAccessTokenExpiresAt: pastDate }, "token123")).toBe(false);
  });

  it("incorrect token returns false", () => {
    expect(verifyGuestOrderAccess({ guestAccessToken: "token123", guestAccessTokenExpiresAt: null }, "wrongToken")).toBe(false);
  });

  it("null token in request returns false", () => {
    expect(verifyGuestOrderAccess({ guestAccessToken: "token123", guestAccessTokenExpiresAt: null }, null)).toBe(false);
  });

  it("null token in order returns false", () => {
    expect(verifyGuestOrderAccess({ guestAccessToken: null, guestAccessTokenExpiresAt: null }, "token123")).toBe(false);
  });
});
