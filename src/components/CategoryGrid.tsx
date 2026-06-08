import Link from "next/link";
import { Beaker, Thermometer, FlaskConical, Droplets, Microscope, Search, TestTube, Scale, Box } from "lucide-react";

const categories = [
  { id: "lovibond", label: "Water Testing", icon: Droplets, color: "bg-blue-100 text-blue-600" },
  { id: "daihan-labtech", label: "Incubator", icon: Thermometer, color: "bg-orange-100 text-orange-600" },
  { id: "pyrex", label: "Glassware", icon: FlaskConical, color: "bg-indigo-100 text-indigo-600" },
  { id: "andislab-custom", label: "Furniture Lab", icon: Beaker, color: "bg-teal-100 text-teal-600" },
  { id: "microscope", label: "Mikroskop", icon: Microscope, color: "bg-purple-100 text-purple-600" },
  { id: "reagents", label: "Reagen", icon: TestTube, color: "bg-pink-100 text-pink-600" },
  { id: "balances", label: "Timbangan", icon: Scale, color: "bg-emerald-100 text-emerald-600" },
  { id: "general-equipment", label: "General Eqp.", icon: Box, color: "bg-slate-200 text-slate-700" },
];

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Kategori Pilihan</h2>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/katalog?category=${cat.id}`}
            className="flex flex-col items-center gap-3 group"
          >
            <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl ${cat.color} transition-transform group-hover:scale-110 group-hover:shadow-md`}>
              <cat.icon className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-600 text-center line-clamp-2">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
