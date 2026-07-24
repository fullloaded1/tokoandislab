import Image from "next/image";
import React from "react";
import { COMPANY_FACTS } from "@/lib/companyFacts";
import ClientTestimonial from "@/components/ClientTestimonial";

const governmentClients = [
  { name: "Kementerian Kesehatan RI", src: "/images/logos/images.png" },
  { name: "PLN", src: "/images/logos/pln.png" },
  { name: "PLN Icon+", src: "/images/logos/pln icon plus.png" },
  { name: "BRIN", src: "/images/logos/logo brin.png" },
  { name: "PDAM Tirtawening", src: "/images/logos/pdam logo.png" },
  { name: "LPKL Tirtawening", src: "/images/logos/lplk logo.jpg" },
];

const otherClients = [
  { name: "Institut Teknologi Bandung", src: "/images/logos/ITB.png" },
  { name: "Universitas Indonesia", src: "/images/logos/UI.png" },
  { name: "Institut Pertanian Bogor", src: "/images/logos/ipb.png" },
  { name: "Universitas Sumatera Utara", src: "/images/logos/usu.png" },
  { name: "Universitas Jenderal Achmad Yani", src: "/images/logos/Logo_Unjani.png" },
  { name: "Bayer", src: "/images/logos/images.jpg" },
  { name: "Japfa", src: "/images/logos/japfa.png" },
  { name: "Sari Roti", src: "/images/logos/sari roti.png" },
  { name: "Sego Lab", src: "/images/logos/sego lab.jpg" },
  { name: "Vicma Lab", src: "/images/logos/vicmalab.png" },
];

export default function ClientLogos() {
  return (
    <>
      <section className="bg-gradient-to-b from-slate-50 to-white py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mb-2">
            {`Telah Dipercaya Oleh ${COMPANY_FACTS.clientsCount} Instansi & Industri`}
          </h2>
          <p className="text-slate-500 mb-14 max-w-2xl mx-auto text-sm sm:text-base">
            Melayani pengadaan laboratorium di {COMPANY_FACTS.coverageArea} dengan kelengkapan dokumen SPJ dan garansi keaslian produk sejak {COMPANY_FACTS.foundYear}.
          </p>

          <div className="space-y-8 max-w-5xl mx-auto">
            {/* Row 1: Government & SOE (Top, Very clear) */}
            <div className="flex flex-wrap justify-center gap-6">
              {governmentClients.map((client, idx) => (
                <div
                  key={idx}
                  className="group relative flex items-center justify-center rounded-2xl border border-slate-100 bg-white p-5 h-24 sm:h-28 w-36 sm:w-44 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300"
                  title={client.name}
                >
                  <Image
                    src={client.src}
                    alt={client.name}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 640px) 150px, 200px"
                  />
                </div>
              ))}
            </div>

            {/* Row 2: Universities & Private Enterprises */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
              {otherClients.map((client, idx) => (
                <div
                  key={idx}
                  className="group relative flex items-center justify-center rounded-2xl border border-slate-100 bg-white p-4 h-20 sm:h-24 w-28 sm:w-36 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300"
                  title={client.name}
                >
                  <Image
                    src={client.src}
                    alt={client.name}
                    fill
                    className="object-contain p-3 sm:p-4 group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 640px) 120px, 160px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Institutional B2B Testimonials Section */}
      <ClientTestimonial />
    </>
  );
}
