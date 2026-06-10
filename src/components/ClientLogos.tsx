import Image from "next/image";

export default function ClientLogos() {
  const clients = [
    { name: "Institut Teknologi Bandung", src: "/images/logos/ITB.png" },
    { name: "Universitas Indonesia", src: "/images/logos/UI.png" },
    { name: "Institut Pertanian Bogor", src: "/images/logos/ipb.png" },
    { name: "Universitas Sumatera Utara", src: "/images/logos/usu.png" },
    { name: "Universitas Jenderal Achmad Yani", src: "/images/logos/Logo_Unjani.png" },
    { name: "Japfa", src: "/images/logos/japfa.png" },
    { name: "Sari Roti", src: "/images/logos/sari roti.png" },
    { name: "Sego Lab", src: "/images/logos/sego lab.jpg" },
    { name: "Vicma Lab", src: "/images/logos/vicmalab.png" },
    { name: "Client 1", src: "/images/logos/images.jpg" },
    { name: "Client 2", src: "/images/logos/images.png" },
  ];

  return (
    <section className="bg-slate-50 py-20 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2">
          Telah Dipercaya Oleh
        </h2>
        <p className="text-slate-500 mb-12">
          Ratusan instansi pendidikan, rumah sakit, dan perusahaan terkemuka di Indonesia
        </p>

        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 lg:gap-16">
          {clients.map((client, idx) => (
            <div
              key={idx}
              className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center transition-all duration-500 hover:scale-110"
              title={client.name}
            >
              <Image
                src={client.src}
                alt={client.name}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 96px, 128px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
