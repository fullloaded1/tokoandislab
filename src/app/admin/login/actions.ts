"use server";

import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export async function loginAction(
  _prevState: { error: string } | undefined,
  formData: FormData
) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const validUsername = process.env.ADMIN_USERNAME || "admin";
  const validPassword = process.env.ADMIN_PASSWORD || "andislab123";

  if (!username || !password) {
    return { error: "Username dan password harus diisi." };
  }

  if (username !== validUsername || password !== validPassword) {
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
