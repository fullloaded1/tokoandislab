import { Building2, Search, ArrowRight, Activity, Beaker } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ContentPillar } from "@prisma/client";

export default async function PengetahuanHubPage() {
  const articlesCount = await prisma.article.count({ where: { published: true } });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
          Laboratory Knowledge & Procurement Hub
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Temukan solusi untuk masalah laboratorium Anda, pelajari metode uji terbaru, panduan memilih spesifikasi alat, hingga direktori alat ready stock.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HubCard 
          title="Masalah & Solusi"
          desc="Identifikasi masalah pada proses QC lab Anda dan temukan solusinya."
          icon={<Activity className="w-8 h-8 text-rose-500" />}
          href="/masalah"
          color="bg-rose-50 border-rose-100"
        />
        <HubCard 
          title="Metode Uji"
          desc="Prinsip dasar, standar ISO/SNI, dan alat yang dibutuhkan untuk setiap parameter uji."
          icon={<Beaker className="w-8 h-8 text-blue-500" />}
          href="/metode-uji"
          color="bg-blue-50 border-blue-100"
        />
        <HubCard 
          title="Panduan Memilih"
          desc="Checklist spesifikasi, perbandingan brand, dan estimasi budget."
          icon={<Search className="w-8 h-8 text-amber-500" />}
          href="/panduan-memilih"
          color="bg-amber-50 border-amber-100"
        />
        <HubCard 
          title="Artikel & Edukasi"
          desc={`Kumpulan ${articlesCount} artikel edukasi, regulasi terbaru, dan berita lab.`}
          icon={<Building2 className="w-8 h-8 text-emerald-500" />}
          href="/artikel"
          color="bg-emerald-50 border-emerald-100"
        />
      </div>
    </div>
  );
}

function HubCard({ title, desc, icon, href, color }: { title: string, desc: string, icon: React.ReactNode, href: string, color: string }) {
  return (
    <Link href={href} className={`block p-8 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group ${color}`}>
      <div className="mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed mb-6">
        {desc}
      </p>
      <div className="flex items-center gap-2 text-sm font-bold text-slate-800 group-hover:text-blue-600">
        Jelajahi <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
