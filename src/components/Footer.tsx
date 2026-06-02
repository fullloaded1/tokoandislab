import Link from "next/link";
import { FlaskConical, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="AndisLab Logo" className="h-10 w-auto brightness-0 invert opacity-90" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Distributor terpercaya alat laboratorium dan instrumen analitik
              untuk industri, pendidikan, dan riset di Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Navigasi
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Beranda" },
                { href: "/katalog", label: "Katalog Produk" },
                { href: "/tentang", label: "Tentang Kami" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Kategori
            </h4>
            <ul className="space-y-3">
              {[
                "Instrumen Analitik",
                "Furnitur Laboratorium",
                "Reagen & Bahan Kimia",
                "Consumable & Aksesoris",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    href="/katalog"
                    className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Hubungi Kami
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-cyan-500" />
                Jl. Raya Laboratorium No. 42, Jakarta Selatan 12345
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="h-4 w-4 shrink-0 text-cyan-500" />
                +62 812-3456-7890
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="h-4 w-4 shrink-0 text-cyan-500" />
                info@andislab.co.id
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} AndisLab. Seluruh hak dilindungi.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/tentang" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/tentang" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
