import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();
  
  if (session) {
    redirect("/admin");
  }

  return <>{children}</>;
}
