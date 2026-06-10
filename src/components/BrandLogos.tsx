import Image from "next/image";

export default function BrandLogos() {
  const brands = [
    { name: "Lovibond", src: "/images/lovibond-logo.png" },
    { name: "Pyrex", src: "/images/pyrexlogo.PNG" },
    { name: "Daihan LabTech", src: "/images/daihanlabtechlogo.png" },
    { name: "Merck", src: "/images/Logo_Merck_KGaA_2015.svg.png" },
    { name: "Yuasa Battery", src: "/images/logos/yuasa_battery_cropped.jpg" },
  ];

  return (
    <section className="bg-white py-16 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mb-12">
          AUTHORIZED DISTRIBUTOR RESMI
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 lg:gap-16">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="relative w-36 h-20 sm:w-48 sm:h-24 hover:scale-105 transition-transform duration-300"
            >
              <Image 
                src={brand.src} 
                alt={`${brand.name} Logo`} 
                fill 
                className="object-contain" 
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
