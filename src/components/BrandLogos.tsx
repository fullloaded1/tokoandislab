export default function BrandLogos() {
  const brands = [
    { name: "Lovibond", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { name: "Pyrex", color: "bg-red-50 text-red-700 border-red-200" },
    { name: "Daihan Labtech", color: "bg-sky-50 text-sky-700 border-sky-200" },
    { name: "Shimadzu", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { name: "Memmert", color: "bg-orange-50 text-orange-700 border-orange-200" },
    { name: "Eppendorf", color: "bg-teal-50 text-teal-700 border-teal-200" },
  ];

  return (
    <section className="border-y border-slate-100 bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-xs font-black text-slate-400/80 uppercase tracking-[0.15em] mb-6">
          PARTNER RESMI & BRAND INTERNASIONAL
        </h2>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className={`px-5 py-2.5 rounded-xl border ${brand.color} font-black text-sm sm:text-base tracking-tight transition-all hover:shadow-sm cursor-default`}
            >
              {brand.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
