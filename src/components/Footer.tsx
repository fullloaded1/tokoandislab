/* Hallmark · component: Footer · genre: modern-minimal · archetype: Ft5 Statement Footer · theme: AndisLab OKLCH Brand · contrast: pass */
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import WaLinkCTA from "@/components/WaLinkCTA";
import { WA_NUMBER_DISPLAY } from "@/lib/contact";
import { COMPANY_FACTS } from "@/lib/companyFacts";

const categories = [
  { href: "/katalog?category=lovibond", label: "Lovibond" },
  { href: "/katalog?category=daihan-labtech", label: "Daihan Labtech" },
  { href: "/katalog?category=pyrex", label: "Pyrex®" },
  { href: "/katalog?category=andislab-custom", label: "Andislab Custom" },
  // { href: "/katalog?category=yuasa-battery", label: "Yuasa Battery" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-300 mt-24 border-t border-slate-800/80 transition-colors duration-300">
      {/* Ambient blue glow backdrop */}
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-6 group focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-2xl">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 shadow-lg transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-105 group-hover:bg-white/15">
                <Image src="/logo.png" alt="AndisLab Logo" width={160} height={56} className="h-12 md:h-14 w-auto object-contain" />
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Distributor resmi & terpercaya instrumen laboratorium analitik, alat gelas, dan chemical untuk industri, pendidikan, serta lembaga riset pemerintah Indonesia.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                e-Katalog INAPROC
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Navigasi
            </p>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Beranda" },
                { href: "/katalog", label: "Katalog Produk" },
                { href: "/daihan-labtech", label: "Daihan Labtech" },
                { href: "/tentang", label: "Tentang Kami" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Katalog Produk
            </p>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-sm"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Hubungi Kami
            </p>
            <ul className="space-y-4">
              <li className="flex flex-col gap-1 text-sm text-slate-400">
                <span className="font-bold text-white">{COMPANY_FACTS.name}</span>
                <div className="flex items-start gap-3 mt-1">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-cyan-500" />
                  <span>Pengiriman mudah &amp; cepat ke {COMPANY_FACTS.coverageArea}, dokumen SPJ lengkap.</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="h-4 w-4 shrink-0 text-cyan-500" />
                <WaLinkCTA 
                  href="?wa=open&source=footer&text=Halo%20AndisLab%2C%20saya%20ingin%20konsultasi%20produk." 
                  className="hover:text-cyan-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-sm"
                >
                  {WA_NUMBER_DISPLAY}
                </WaLinkCTA>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <Mail className="h-4 w-4 shrink-0 text-cyan-500 mt-1" />
                <div className="flex flex-col gap-1">
                  <a href="mailto:cs@andislab.com" className="hover:text-cyan-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-sm">cs@andislab.com</a>
                </div>
              </li>
              <li className="pt-2 border-t border-[var(--color-rule)]/15">
                <p className="text-sm text-slate-400">Melayani pengiriman ke {COMPANY_FACTS.coverageArea}.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--color-rule)]/15 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} {COMPANY_FACTS.shortName}. Seluruh hak dilindungi.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/kebijakan-privasi" className="text-sm text-slate-400 hover:text-slate-300 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-sm">
              Kebijakan Privasi
            </Link>
            <Link href="/syarat-ketentuan" className="text-sm text-slate-400 hover:text-slate-300 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-sm">
              Syarat &amp; Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
