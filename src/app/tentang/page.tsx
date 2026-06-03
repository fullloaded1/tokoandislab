import type { Metadata } from "next";
import { ShieldCheck, Users, Award, Beaker, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Tentang Kami — AndisLab",
  description:
    "AndisLab adalah distributor alat laboratorium terpercaya di Indonesia sejak 2010.",
};

const stats = [
  { value: "14+", label: "Tahun Pengalaman" },
  { value: "500+", label: "Klien Aktif" },
  { value: "2.000+", label: "Produk Tersedia" },
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

export default function TentangPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white">
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
              Tentang AndisLab
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 leading-relaxed">
              Kami adalah distributor alat laboratorium terpercaya yang melayani
              kebutuhan industri, pendidikan, dan riset di seluruh Indonesia
              sejak tahun 2010.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center rounded-3xl bg-white p-6 shadow-xl shadow-blue-500/10 border border-slate-100"
            >
              <span className="text-3xl sm:text-4xl font-extrabold gradient-text">
                {stat.value}
              </span>
              <span className="text-sm text-slate-500 mt-1 font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* About Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wider mb-2">
              Mengapa Memilih Kami
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-6">
              Partner Terpercaya untuk{" "}
              <span className="gradient-text">Laboratorium Modern</span>
            </h2>
            <p className="text-slate-500 leading-relaxed mb-4">
              AndisLab didirikan dengan misi menyediakan akses mudah dan
              terjangkau terhadap alat laboratorium berkualitas tinggi di
              Indonesia. Kami bermitra langsung dengan principal internasional
              ternama seperti Shimadzu, Eppendorf, Memmert, Merck, dan Hanna
              Instruments.
            </p>
            <p className="text-slate-500 leading-relaxed">
              Dengan sistem Request for Quotation (RFQ) yang sederhana,
              pelanggan dapat dengan mudah meminta penawaran harga untuk
              berbagai produk sekaligus, tanpa harus menghubungi satu per satu.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-500/10 border border-slate-100">
            <Image
              src="https://picsum.photos/id/3/800/600"
              alt="Laboratorium modern"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
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
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 mb-4">
                <v.icon className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">
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
                Siap Membantu Kebutuhan <br className="hidden sm:block" />
                Laboratorium Anda
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8 max-w-lg">
                Jangan ragu untuk menghubungi tim ahli kami untuk konsultasi produk, 
                permintaan penawaran, atau dukungan teknis.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 text-blue-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 mb-1">Kantor Pusat</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Jl. Scientia Boulevard, Gading Serpong, <br />
                      Tangerang, Banten 15810, Indonesia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 text-blue-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 mb-1">Telepon</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      +62 21 555-0198
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 text-blue-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 mb-1">Email</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      sales@andislabs.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <a
                  href="https://wa.me/6282125523466?text=Halo%20AndisLab,%20saya%20ingin%20berkonsultasi..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#25D366] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                >
                  <MessageCircle className="h-5 w-5" />
                  Chat via WhatsApp
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="relative aspect-square sm:aspect-video lg:aspect-square rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 bg-slate-200">
              <Image 
                src="https://picsum.photos/id/11/800/800" 
                alt="Map Location" 
                fill 
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 backdrop-blur px-6 py-4 rounded-2xl shadow-lg border border-slate-100 text-center">
                  <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-bold text-slate-800">AndisLab HQ</p>
                  <p className="text-xs text-slate-500 mt-1">Gading Serpong, Tangerang</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
