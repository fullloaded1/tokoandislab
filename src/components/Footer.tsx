import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import WaLinkCTA from "@/components/WaLinkCTA";

const categories = [
  { href: "/katalog?category=lovibond", label: "Lovibond" },
  { href: "/katalog?category=daihan-labtech", label: "Daihan Labtech" },
  { href: "/katalog?category=pyrex", label: "Pyrex®" },
  { href: "/katalog?category=andislab-custom", label: "Andislab Custom" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group">
              <img src="/logo.png" alt="AndisLab Logo" className="h-12 md:h-14 w-auto object-contain bg-white/10 rounded-xl p-2 transition-transform hover:scale-105" />
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
              Katalog Produk
            </h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {cat.label}
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
            <ul className="space-y-4">
              <li className="flex flex-col gap-1 text-sm text-slate-400">
                <span className="font-bold text-white">PT Andis Sentral Laboratorium</span>
                <div className="flex items-start gap-3 mt-1">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-cyan-500" />
                  <span>Jl. Raya Mayor Oking Jaya Atmaja No.112, Cirimekar, Kec. Cibinong, Kabupaten Bogor, Jawa Barat 16918</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="h-4 w-4 shrink-0 text-cyan-500" />
                <WaLinkCTA 
                  href="?wa=open&source=footer&text=Halo%20AndisLab%2C%20saya%20ingin%20konsultasi%20produk." 
                  className="hover:text-cyan-400 transition-colors"
                >
                  0859-7321-1179
                </WaLinkCTA>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <Mail className="h-4 w-4 shrink-0 text-cyan-500 mt-1" />
                <div className="flex flex-col gap-1">
                  <a href="mailto:cs@andislab.com" className="hover:text-cyan-400 transition-colors">cs@andislab.com</a>
                </div>
              </li>
              <li className="pt-2 border-t border-slate-800">
                <p className="text-sm text-slate-400">Melayani pengiriman Jabodetabek & Nasional.</p>
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
            <Link href="/kebijakan-privasi" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/syarat-ketentuan" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Syarat &amp; Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
