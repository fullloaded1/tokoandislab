/* Hallmark · component: ClientTestimonial · genre: institutional-trust · archetype: Clean Cards · theme: AndisLab OKLCH Brand */
import React from "react";
import { ShieldCheck, Star, Building2, GraduationCap, Factory, Quote } from "lucide-react";
import { COMPANY_FACTS } from "@/lib/companyFacts";

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  institution: string;
  category: "Pemerintah & RSUD" | "Kampus & Riset" | "Industri & Swasta";
  icon: React.ElementType;
}

export const INSTITUTIONAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "dinkes-rsud",
    quote: "Dokumen SPJ lengkap (Faktur Pajak, e-Faktur, SIPAHATI), tim teknis siap bantu kalibrasi. Pengiriman ke daerah sangat aman dan rapi.",
    author: "Pejabat Pembuat Komitmen (PPK)",
    role: "Pengadaan Alat Kesehatan & Lab",
    institution: "Dinas Kesehatan & RSUD Mitra",
    category: "Pemerintah & RSUD",
    icon: Building2,
  },
  {
    id: "kampus-riset",
    quote: "Inkubator Daihan Labtech dan reagen Lovibond selalu original dengan CoA (Certificate of Analysis) resmi. Sangat mendukung pengadaan riset kampus.",
    author: "Kepala Lab Kimia Analitik",
    role: "Fakultas Matematika dan Ilmu Pengetahuan Alam",
    institution: "Universitas Terkemuka Indonesia",
    category: "Kampus & Riset",
    icon: GraduationCap,
  },
  {
    id: "industri-pdam",
    quote: "Respon sales via WhatsApp cepat untuk RFQ rutin tahunan. Lead time pengiriman PO sesuai janji dan kemasan rapi berstandar safety lab.",
    author: "Procurement Manager",
    role: "Divisi Quality Control & Assurance",
    institution: "PT Industri Beverage Nusantara",
    category: "Industri & Swasta",
    icon: Factory,
  },
];

export default function ClientTestimonial() {
  return (
    <section className="bg-gradient-to-b from-white via-slate-50/60 to-white py-20 border-t border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-600/30 px-3.5 py-1.5 text-xs font-black text-emerald-700 uppercase tracking-wider mb-4 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            Kepercayaan Instansi & Industri
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Pengalaman Pengadaan Klien Instansi
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Didukung kelengkapan administratif SPJ dan keaslian produk ber-CoA sejak {COMPANY_FACTS.foundYear}, melayani pengadaan {COMPANY_FACTS.clientsCount} instansi pemerintah, universitas, dan industri nasional.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {INSTITUTIONAL_TESTIMONIALS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-[2rem] bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 ease-out hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Accent Top Bar */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 opacity-80 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Category Badge & Stars */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100/80 px-3 py-1 text-[11px] font-extrabold text-slate-700 tracking-tight">
                      <Icon className="w-3.5 h-3.5 text-emerald-600" />
                      {item.category}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Quote Text */}
                  <div className="relative mb-6">
                    <Quote className="w-8 h-8 text-emerald-600/10 absolute -top-3 -left-2 pointer-events-none" />
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed relative z-10 font-medium italic">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Author Info */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900 leading-snug">
                      {item.author}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {item.role}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 mt-0.5">
                      {item.institution}
                    </span>
                  </div>
                  <div title="Verified Institutional Client" className="shrink-0 flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[10px] font-extrabold border border-emerald-600/20">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Institutional Trust Strip Footer */}
        <div className="mt-14 rounded-2xl bg-slate-900 text-white p-6 sm:p-8 shadow-lg border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col gap-1">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              Jaminan Keaslian & Kelengkapan Dokumen SPJ
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Setiap pengadaan dari AndisLab dilengkapi Faktur Pajak resmi, e-Katalog INAPROC, dan garansi asli principal.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-extrabold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-4 py-2 rounded-xl">
              Terdaftar di LKPP e-Katalog
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
