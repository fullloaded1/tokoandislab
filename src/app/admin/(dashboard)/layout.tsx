import Link from "next/link";
import { LogOut, Package, FileText, Users, HardDrive, Bot, BookOpen, MessageCircle, Newspaper } from "lucide-react";
import { logoutAction } from "./actions";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  if (!session) {
    redirect("/admin/login");
  }
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-black text-white tracking-tight">
            AndisLab <span className="text-blue-500">ERP</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
            <Package className="h-5 w-5" />
            <span className="font-semibold text-sm">Katalog Produk</span>
          </Link>
          
          <Link href="/admin/inquiries" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
            <FileText className="h-5 w-5" />
            <span className="font-semibold text-sm">Permintaan (RFQ)</span>
          </Link>

          <Link href="/admin/whatsapp-leads" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold text-sm">Laporan WA</span>
          </Link>

          <Link href="/admin/institutions" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
            <Users className="h-5 w-5" />
            <span className="font-semibold text-sm">Data Pelanggan</span>
          </Link>

          <Link href="/admin/installed-base" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
            <HardDrive className="h-5 w-5" />
            <span className="font-semibold text-sm">Alat Terpasang</span>
          </Link>

          <Link href="/admin/ai-analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
            <Bot className="h-5 w-5" />
            <span className="font-semibold text-sm">AI Analytics</span>
          </Link>

          <Link href="/admin/knowledge" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
            <BookOpen className="h-5 w-5" />
            <span className="font-semibold text-sm">AI Knowledge</span>
          </Link>

          <Link href="/admin/articles" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
            <Newspaper className="h-5 w-5" />
            <span className="font-semibold text-sm">Artikel SEO</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut className="h-5 w-5" />
              <span className="font-semibold text-sm">Keluar</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
