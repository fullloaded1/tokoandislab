/* Hallmark · component: Footer · genre: modern-minimal · archetype: Compact Statement Footer · theme: AndisLab OKLCH Brand · contrast: pass */
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";
import WaLinkCTA from "@/components/WaLinkCTA";
import { WA_NUMBER_DISPLAY, OFFICE_PHONE } from "@/lib/contact";
import { COMPANY_FACTS } from "@/lib/companyFacts";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-300 mt-12 border-t border-slate-800/80 transition-colors duration-300">
      {/* Ambient blue glow backdrop */}
      <div className="absolute -left-40 top-0 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -right-40 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 text-xs sm:text-sm">
          
          {/* Brand & Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <Link href="/" className="inline-block group focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-xl">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10 shadow-sm transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-105 group-hover:bg-white/15 inline-block">
                <Image src="/logo.png" alt="AndisLab Logo" width={140} height={48} className="h-9 w-auto object-contain" />
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Distributor resmi &amp; terpercaya instrumen laboratorium analitik, alat gelas, dan chemical untuk industri, pendidikan, serta instansi pemerintah Indonesia.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                e-Katalog INAPROC
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300">
                <ShieldCheck className="h-3 w-3 text-cyan-400" /> Dokumen SPJ &amp; PPN 11%
              </span>
            </div>
          </div>

          {/* Katalog & Brand (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Katalog &amp; Brand Utama
            </p>
            <ul className="space-y-1.5 text-xs">
              {[
                { href: "/katalog", label: "Katalog Produk" },
                { href: "/ready-stock", label: "Ready Stock Siap Kirim" },
                { href: "/daihan-labtech", label: "Daihan Labtech Indonesia" },
                { href: "/lovibond", label: "Lovibond Water Testing" },
                { href: "/milwaukee", label: "Milwaukee Instruments" },
                { href: "/aczet", label: "Timbangan Analitik Aczet" },
                { href: "/yamato", label: "Yamato Scientific" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-cyan-400 transition-colors duration-150 rounded-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sumber Daya & Solusi (2 cols) */}
          <div className="lg:col-span-2 space-y-2">
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Layanan &amp; Solusi
            </p>
            <ul className="space-y-1.5 text-xs">
              {[
                { href: "/pemerintah", label: "Pengadaan Pemerintah" },
                { href: "/artikel", label: "Artikel &amp; Panduan Lab" },
                { href: "/solusi/farmasi", label: "Solusi Farmasi" },
                { href: "/solusi/manufaktur", label: "Solusi Manufaktur" },
                { href: "/solusi/pendidikan", label: "Solusi Pendidikan" },
                { href: "/solusi/pengolahan-air", label: "Solusi Pengolahan Air" },
                { href: "/tentang", label: "Tentang Kami" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-cyan-400 transition-colors duration-150 rounded-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Hubungi Kami
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-cyan-400" />
                <span className="leading-snug">{COMPANY_FACTS.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <a href={`tel:${OFFICE_PHONE.replace(/[^0-9]/g, "")}`} className="hover:text-cyan-300 font-semibold text-slate-200">
                    Telp: {OFFICE_PHONE}
                  </a>
                  <span className="text-slate-600">|</span>
                  <WaLinkCTA 
                    href="?wa=open&source=footer&text=Halo%20AndisLab%2C%20saya%20ingin%20konsultasi%20produk." 
                    className="hover:text-cyan-300 font-semibold text-slate-200"
                  >
                    WA: {WA_NUMBER_DISPLAY}
                  </WaLinkCTA>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                <a href="mailto:cs@andislab.com" className="hover:text-cyan-300 text-slate-300 font-medium">cs@andislab.com</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar Compact */}
        <div className="border-t border-slate-800/60 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {COMPANY_FACTS.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/kebijakan-privasi" className="hover:text-slate-200 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/syarat-ketentuan" className="hover:text-slate-200 transition-colors">
              Syarat &amp; Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
