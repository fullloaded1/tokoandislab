"use server";

import crypto from "crypto";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

/**
 * Constant-time string comparison to prevent timing attacks.
 * Handles different-length strings safely by always performing a comparison.
 */
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Always perform a comparison to avoid length-based timing leak
    const padded = Buffer.alloc(bufA.length);
    crypto.timingSafeEqual(bufA, padded);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function loginAction(
  _prevState: { error: string } | undefined,
  formData: FormData
) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // Fail-closed: reject login if env vars are not configured
  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validUsername || !validPassword) {
    console.error("ADMIN_USERNAME or ADMIN_PASSWORD environment variable is not set.");
    return { error: "Konfigurasi server belum lengkap. Hubungi administrator." };
  }

  if (!username || !password) {
    return { error: "Username dan password harus diisi." };
  }

  // Constant-time comparison to prevent timing attacks
  const usernameMatch = safeCompare(username, validUsername);
  const passwordMatch = safeCompare(password, validPassword);

  if (!usernameMatch || !passwordMatch) {
    return { error: "Username atau password salah." };
  }

  const adminUser = await prisma.adminUser.upsert({
    where: { email: username },
    create: {
      email: username,
      name: "Administrator",
    },
    update: {}
  });

  await createSession(adminUser.id);
  redirect("/admin");
}
