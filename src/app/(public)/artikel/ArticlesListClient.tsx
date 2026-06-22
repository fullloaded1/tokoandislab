"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calendar, ArrowRight, Search, FileText, Eye, Heart } from "lucide-react";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  category: string;
  createdAt: Date;
  viewCount: number;
  likeCount: number;
}

const CATEGORY_TABS = [
  { id: "all", label: "Semua Artikel" },
  { id: "edukasi-lab", label: "Edukasi & Riset" },
  { id: "panduan-alat", label: "Panduan Alat" },
  { id: "tips-perawatan", label: "Tips & Perawatan" },
  { id: "berita-toko", label: "Berita & Event" },
];

const ArticleCard = ({ article }: { article: Article }) => {
  const [imgError, setImgError] = useState(false);
  const showImage = article.image && !imgError;

  return (
    <article className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <Link href={`/artikel/${article.slug}`} className="relative aspect-[4/3] sm:aspect-video w-full overflow-hidden block">
        {showImage ? (
          <>
            <Image
              src={article.image!}
              alt={article.title}
              fill
              onError={() => setImgError(true)}
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Premium overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50/50">
            <div className="bg-white p-3 rounded-full shadow-sm shadow-blue-100/50 mb-2 group-hover:scale-110 group-hover:shadow-md transition-all duration-500">
              <BookOpen className="h-8 w-8 text-blue-400/80" />
            </div>
            <span className="text-[10px] font-bold text-blue-300 tracking-wider uppercase">Ilustrasi</span>
          </div>
        )}
        {/* Subtle inset border */}
        <div className="absolute inset-0 border border-black/5 pointer-events-none"></div>

        {/* Category label badge on image */}
        <span className="absolute top-4 left-4 z-10 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 shadow-sm backdrop-blur-md">
          {article.category === "edukasi-lab" && "Edukasi & Riset"}
          {article.category === "panduan-alat" && "Panduan Alat"}
          {article.category === "tips-perawatan" && "Tips & Perawatan"}
          {article.category === "berita-toko" && "Berita & Event"}
        </span>
      </Link>

      {/* Body */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Meta details */}
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-3 font-semibold">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(article.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="inline-flex items-center gap-1" title="Dilihat">
            <Eye className="h-3.5 w-3.5" />
            {article.viewCount}
          </span>
          <span className="inline-flex items-center gap-1" title="Disukai">
            <Heart className="h-3.5 w-3.5" />
            {article.likeCount}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
          <Link href={`/artikel/${article.slug}`}>
            {article.title}
          </Link>
        </h2>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-sm text-slate-500 line-clamp-3 mt-3 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        {/* Read more */}
        <div className="mt-auto pt-5">
          <Link
            href={`/artikel/${article.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 hover:gap-2.5 transition-all duration-300"
          >
            Baca Selengkapnya
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default function ArticlesListClient({ initialArticles }: { initialArticles: any[] }) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const articles = initialArticles as Article[];

  // Filter based on tab and search query
  const filteredArticles = articles.filter((article) => {
    const matchesTab = activeTab === "all" || article.category === activeTab;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* Search and Tabs Sifter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 order-2 md:order-1">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 order-1 md:order-2 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari panduan atau tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-xs shadow-sm font-semibold"
          />
        </div>
      </div>

      {/* Grid List */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-150 max-w-2xl mx-auto">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-700">Artikel Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500 mt-1">
            Cobalah mengubah pencarian Anda atau memilih kategori artikel yang lain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
