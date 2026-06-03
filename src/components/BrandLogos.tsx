import Image from "next/image";

export default function BrandLogos() {
  const brands = [
    { name: "Lovibond", src: "https://www.lovibond.com/fileadmin/templates/images/lovibond-logo-blue.svg" },
    { name: "Pyrex", src: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Pyrex_logo.svg" },
    { name: "Daihan LabTech", src: "https://andislabs.com/wp-content/uploads/2021/08/labtech-logo.png" }, // fallback to text if fails, but standard image tag is fine
    { name: "Merck", src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Merck_logo.svg" },
  ];

  return (
    <section className="bg-white py-16 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mb-12">
          AUTHORIZED DISTRIBUTOR RESMI
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-20">
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
