import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Fail-fast: reject startup if SESSION_SECRET is missing or too short
const secretKey = process.env.SESSION_SECRET;
if (!secretKey || secretKey.length < 32) {
  throw new Error(
    "SESSION_SECRET belum di-set atau terlalu pendek (min 32 karakter). " +
    "Set env variable SESSION_SECRET dengan nilai acak ≥32 karakter."
  );
}
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
  username: string;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    console.log("Failed to verify session");
    return null;
  }
}

export async function createSession(username: string) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ username, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function verifySession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.username) {
    return null;
  }

  return { isAuth: true, username: session.username };
}

/**
 * Guard for admin server actions. Call at the start of every
 * server action that performs read/write of sensitive admin data.
 * Throws "Unauthorized" if session is invalid.
 * Returns session object with `username` (AdminUser.id) for audit logging.
 */
export async function requireAdmin() {
  const session = await verifySession();
  if (!session?.isAuth) {
    throw new Error("Unauthorized");
  }
  return session; // session.username = AdminUser.id → use as actorId for audit
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
