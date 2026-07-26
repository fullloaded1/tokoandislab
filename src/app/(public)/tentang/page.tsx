/* Hallmark · page: Tentang · genre: modern-minimal · macrostructure: Long Document · design-system: design.md */
import type { Metadata } from "next";
import { ShieldCheck, Users, Award, Beaker, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import WaLinkCTA from "@/components/WaLinkCTA";
import { WA_NUMBER_DISPLAY } from "@/lib/contact";
import { COMPANY_FACTS } from "@/lib/companyFacts";

export const metadata: Metadata = {
  title: "Tentang AndisLab — PT Andis Sentral Laboratorium",
  description:
    "Distributor alat laboratorium resmi di Indonesia, terdaftar di e-Katalog INAPROC. Melayani Kemenkes, PLN, BRIN, ITB, UI, IPB, PDAM, dan rumah sakit daerah.",
  alternates: { canonical: "/tentang" },
};

const stats = [
  { value: `${COMPANY_FACTS.experienceYears}+`, label: "Tahun Pengalaman" },
  { value: COMPANY_FACTS.clientsCount, label: "Klien Aktif" },
  { value: COMPANY_FACTS.productsCount, label: "Produk Tersedia" },
  { value: "34", label: "Provinsi Terjangkau" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Kualitas Terjamin",
    desc: "Seluruh produk kami berasal dari principal terpercaya dengan garansi resmi dan sertifikat keaslian.",
  },
  {
    icon: Users,
    title: "Layanan Profesional",
    desc: "Tim sales dan engineer kami siap membantu konsultasi, instalasi, dan after-sales service.",
  },
  {
    icon: Award,
    title: "Harga Kompetitif",
    desc: "Sebagai distributor langsung, kami menawarkan harga terbaik tanpa perantara.",
  },
  {
    icon: Beaker,
    title: "Keahlian Teknis",
    desc: "Didukung oleh tim dengan latar belakang teknik dan sains untuk rekomendasi produk yang tepat.",
  },
];

const partners = [
  { name: "Lovibond", desc: "Water Quality Analysis" },
  { name: "Daihan Labtech", desc: "General Lab Equipment" },
  { name: "Pyrex®", desc: "Lab Glassware" },
  { name: "Andislab Custom", desc: "Custom Lab Furniture" },
];

export default function TentangPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
      {/* Hero - Scientific Storytelling Dark Console Stage */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-950 via-indigo-950/90 to-slate-950 text-white shadow-2xl border border-cyan-500/30 p-8 sm:p-14 mb-12">
        <div className="absolute inset-0 -z-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-3xl z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 px-3.5 py-1.5 text-xs font-bold text-cyan-300 mb-6 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Institutional Profil & Principal Partner</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            Distributor Resmi Alat Laboratorium & Partner Pengadaan Nasional
          </h1>
          <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
            Lebih dari satu dekade menjadi mitra strategis untuk instansi pemerintah, BUMN, universitas, dan industri. Kami mendistribusikan instrumen lab presisi dengan jaminan keaslian dan dukungan teknis penuh.
          </p>
        </div>
      </section>

      {/* Stats - High-Density Bento Glass Matrix */}
      <section className="mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group flex flex-col items-center text-center rounded-3xl bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl border border-cyan-500/20 hover:border-cyan-400/60 hover:-translate-y-1.5 transition-all duration-300"
            >
              <span className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm text-slate-300 mt-2 font-semibold">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* About Content & Bento Partners */}
      <section className="rounded-[2.5rem] bg-slate-900 text-white p-8 sm:p-14 border border-slate-800 shadow-2xl mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
              Mengapa Memilih Kami
            </p>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-6 text-white">
              Partner Terpercaya untuk{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Laboratorium Modern
              </span>
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4 text-sm sm:text-base">
              AndisLab didirikan dengan misi menyediakan akses mudah dan
              terjangkau terhadap alat laboratorium berkualitas tinggi di
              Indonesia. Kami bermitra langsung dengan principal internasional
              ternama seperti Lovibond, Daihan Labtech, dan Pyrex®.
            </p>
            <p className="text-slate-300 leading-relaxed mb-8 text-sm sm:text-base">
              Dengan sistem Request for Quotation (RFQ) yang sederhana,
              pelanggan dapat dengan mudah meminta penawaran harga untuk
              berbagai produk sekaligus, tanpa harus menghubungi satu per satu.
            </p>

            {/* Brand Partners Bento */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {partners.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-3 rounded-2xl bg-slate-950/80 border border-slate-800 p-4 shadow-sm hover:border-cyan-500/50 transition-all duration-200 group"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 font-bold text-xs shrink-0 group-hover:scale-110 transition-transform">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-400">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex items-center justify-center p-8 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-blue-500/5" />
            <img
              src="/logo.png"
              alt="Andis Lab"
              className="w-3/4 max-w-[280px] object-contain brightness-200 transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-800">
            Nilai-Nilai <span className="gradient-text">Kami</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="group flex flex-col items-center text-center p-8 rounded-[2rem] bg-white border border-slate-200/80 shadow-xs hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-6 transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                <v.icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {v.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-slate-50 border-t border-slate-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                Hubungi Kami
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-6">
                Butuh Penawaran Resmi Hari Ini?
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8 max-w-lg">
                Hubungi tim engineering kami untuk konsultasi teknis, pengurusan dokumen SPJ, atau permintaan Quotation. Kami menjamin respons cepat dalam hari kerja.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 text-blue-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 mb-1">Layanan &amp; Pengiriman</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Pengiriman mudah &amp; cepat ke 34 Provinsi di seluruh Indonesia, <br />
                      dilengkapi dokumen formal &amp; SPJ pengadaan lengkap.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 text-blue-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 mb-1">WhatsApp</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {WA_NUMBER_DISPLAY}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 text-blue-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 mb-1">Email</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      info@andislab.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <WaLinkCTA
                  href="?wa=open&source=about_page&text=Halo%20AndisLab,%20saya%20ingin%20berkonsultasi..."
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#25D366] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                >
                  <MessageCircle className="h-5 w-5" />
                  Chat via WhatsApp
                </WaLinkCTA>
              </div>
            </div>

            {/* Map Embed */}
            <div className="relative aspect-square sm:aspect-video lg:aspect-square rounded-[2rem] overflow-hidden shadow-xl border border-slate-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.5!2d106.85!3d-6.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzAnMDAuMCJTIDEwNsKwNTEnMDAuMCJF!5e0!3m2!1sid!2sid!4v1600000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Andis Lab"
                className="absolute inset-0"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
