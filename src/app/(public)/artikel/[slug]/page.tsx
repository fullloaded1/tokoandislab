/* Hallmark · page: ArticleDetail · genre: modern-minimal · macrostructure: Long Document · design-system: design.md */
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import ProductCard from "@/components/ProductCard";
import ArticleLikeButton from "@/components/ArticleLikeButton";
import ArticleViewTracker from "@/components/ArticleViewTracker";
import ArticleWaCTA from "@/components/ArticleWaCTA";
import { BookOpen, Calendar, ChevronRight, ArrowLeft, Eye, User, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { cache } from "react";

// Cache article fetching to avoid redundant database calls
const getArticle = cache(async (slug: string) => {
  return await (prisma as any).article.findUnique({
    where: { slug },
    include: {
      products: {
        select: {
          id: true,
          slug: true,
          name: true,
          category: true,
          categoryLabel: true,
          brand: true,
          model: true,
          subcategory: true,
          image: true,
          description: true,
          price: true,
          isReadyStock: true,
          isRequestPricing: true,
        },
      },
    },
  });
});

// Override SEO title & meta description per slug (di luar excerpt DB).
const ARTICLE_SEO: Record<string, { title: string; description: string }> = {
  "panduan-cold-chain-penyimpanan-sampel-laboratorium": {
    title: "Kulkas Vaksin & ULT Freezer -86°C: Panduan & Harga 2026",
    description:
      "Cara memilih kulkas vaksin, lab freezer, dan ULT freezer sesuai standar WHO/BPOM — plus perbandingan harga vs e-Katalog 2026. Panduan lengkap untuk instansi.",
  },
  "panduan-lengkap-titrator-otomatis-laboratorium": {
    title: "Titrator Otomatis Lab: Panduan Lengkap & Harga 2026",
    description:
      "Jenis titrator otomatis potensiometri & Karl Fischer, spesifikasi yang wajib dicek, dan kisaran harga 2026 untuk lab QC, PDAM, dan riset universitas.",
  },
  "panduan-peralatan-dasar-laboratorium-lengkap": {
    title: "Peralatan Dasar Laboratorium: Daftar Lengkap & Harga",
    description:
      "Checklist peralatan dasar lab untuk kampus, puskesmas, dan industri — dari glassware borosilikat Pyrex sampai timbangan analitik, dengan kisaran harga 2026.",
  },
  "panduan-pengadaan-alat-laboratorium-e-katalog": {
    title: "Pengadaan Alat Lab e-Katalog vs Penawaran Resmi 2026",
    description:
      "Langkah pengadaan alat laboratorium via e-Katalog/INAPROC untuk dinas, PDAM, dan instansi — plus cara membandingkan harga agar anggaran efisien dan SPJ aman.",
  },
  "panduan-alat-uji-kualitas-air-laboratorium-industri": {
    title: "Alat Uji Kualitas Air: Photometer & pH Meter Lab 2026",
    description:
      "Panduan komprehensif alat uji kualitas air laboratorium dan industri. Pelajari perbedaan photometer, pH meter, turbidimeter, serta rekomendasi Lovibond dan Milwaukee.",
  },
  "panduan-autoclave-sterilisasi-laboratorium": {
    title: "Autoclave Laboratorium: Spesifikasi, Jenis & Harga 2026",
    description:
      "Pelajari prinsip kerja autoclave, perbedaan gravity vs pre-vacuum, prosedur validasi sterilisasi, dan panduan memilih autoclave terbaik dari Daihan Labtech.",
  },
  "panduan-desain-furniture-laboratorium-modern": {
    title: "Furniture Laboratorium: Meja Lab, Fume Hood & Scrubber",
    description:
      "Bangun laboratorium yang aman dan memenuhi standar internasional. Pelajari cara mendesain layout lab, memilih meja laboratorium, fume hood, dan sistem ventilasi wet scrubber.",
  },
  "panduan-lengkap-micropipette-laboratorium": {
    title: "Micropipette Laboratorium: Panduan Memilih & Kalibrasi",
    description:
      "Alat pengukur volume cairan presisi tinggi mikro-liter. Pelajari perbedaan micropipette single dan multi channel, teknik pipetting, serta jadwal kalibrasi resmi.",
  },
  "panduan-lengkap-biosafety-cabinet-laboratorium": {
    title: "Biosafety Cabinet (BSC): Spesifikasi & Panduan Memilih",
    description:
      "Peralatan wajib laboratorium mikrobiologi dan kultur sel. Pelajari perbedaan BSC Kelas I, II Tipe A2/B2, Kelas III, dan cara memverifikasi sertifikasi aliran udara HEPA.",
  },
  "perbedaan-inkubator-dan-oven-laboratorium": {
    title: "Inkubator vs Oven Laboratorium: Perbedaan & Fungsi Alat",
    description:
      "Sering bingung membedakan inkubator dan oven laboratorium? Pelajari perbedaan fungsi, suhu, sistem pemanasan, dan kegunaannya untuk riset mikrobiologi maupun pengeringan.",
  },
  "panduan-memilih-spektrofotometer-laboratorium": {
    title: "Spektrofotometer Lab: Panduan Memilih & Spesifikasi",
    description:
      "Panduan memilih spektrofotometer UV-Vis single beam vs double beam. Pelajari spesifikasi rentang panjang gelombang, bandwidth, dan rekomendasi alat akurasi tinggi.",
  },
};

// FAQPage schema per-slug (di luar konten Markdown). Emit hanya bila slug punya entri.
const ARTICLE_FAQ: Record<string, { q: string; a: string }[]> = {
  "panduan-pengadaan-alat-laboratorium-e-katalog": [
    {
      q: "Apakah pembelian via e-Katalog wajib untuk instansi pemerintah?",
      a: "E-purchasing melalui Katalog Elektronik adalah metode yang diprioritaskan untuk produk yang sudah tayang di katalog, namun instansi tetap berkewajiban memastikan harga terbaik — membandingkan penyedia di dalam katalog maupun penawaran pembanding adalah bagian dari kewajaran harga.",
    },
    {
      q: "Bagaimana cara memastikan harga di e-Katalog wajar?",
      a: "Bandingkan harga tayang beberapa penyedia untuk model persis yang sama, dan minta penawaran langsung dari penyedia di luar katalog sebagai pembanding. Dokumentasikan perbandingan ini sebagai bagian dari berkas pengadaan.",
    },
    {
      q: "Apakah AndisLab terdaftar di e-Katalog / INAPROC?",
      a: "Ya, AndisLab (PT Andis Sentral Laboratorium) terdaftar di Katalog Elektronik INAPROC: katalog.inaproc.id/andis-sentral-laboratorium. Kami juga melayani penawaran langsung yang untuk banyak model Daihan lebih rendah dari harga tayang e-Katalog.",
    },
    {
      q: "Dokumen apa saja yang disiapkan AndisLab untuk SPJ?",
      a: "Penawaran resmi ber-kop, invoice, surat jalan, legalitas perusahaan (NPWP, NIB), spesifikasi teknis, dan dokumen pendukung lain sesuai kebutuhan berkas pengadaan instansi Anda.",
    },
    {
      q: "Berapa lama proses dari penawaran sampai barang tiba?",
      a: "Penawaran resmi terbit dalam 1 hari kerja. Unit ready stock dikirim 1–3 hari kerja setelah PO/pembayaran dengan pengiriman mudah dan cepat ke seluruh Indonesia.",
    },
  ],
};

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticle(slug);
  if (!article || !article.published) return {};

  const seo = ARTICLE_SEO[slug];

  return {
    title: seo?.title ?? `${article.title} - AndisLab`,
    description: seo?.description ?? (article.excerpt || "Baca artikel selengkapnya di AndisLab."),
    openGraph: {
      title: `${article.title} - AndisLab`,
      description: article.excerpt || "Baca artikel selengkapnya di AndisLab.",
      type: "article",
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      images: article.image
        ? [
            {
              url: article.image,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} - AndisLab`,
      description: article.excerpt || "Baca artikel selengkapnya di AndisLab.",
      images: article.image ? [article.image] : [],
    },
    alternates: {
      canonical: `https://www.andislab.com/artikel/${article.slug}`,
    },
  };
}

export default async function ArticleDetailPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const article = await getArticle(slug);

  if (!article || !article.published) {
    notFound();
  }

  return (
    <>
      {/* View tracker – fires once on mount */}
      <ArticleViewTracker slug={article.slug} />
      {/* Schema.org BlogPosting Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: article.title,
            description: article.excerpt || "",
            image: article.image || "",
            datePublished: article.createdAt.toISOString(),
            dateModified: article.updatedAt.toISOString(),
            author: {
              "@type": "Person",
              name: (article as any).authorName || "Tim Redaksi AndisLab",
              url: "https://www.andislab.com/tentang",
            },
            publisher: {
              "@type": "Organization",
              name: "AndisLab",
              logo: {
                "@type": "ImageObject",
                url: "https://www.andislab.com/logo.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.andislab.com/artikel/${article.slug}`,
            },
          }),
        }}
      />

      {/* Schema.org BreadcrumbList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Beranda",
                item: "https://www.andislab.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Artikel",
                item: "https://www.andislab.com/artikel",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: article.title,
                item: `https://www.andislab.com/artikel/${article.slug}`,
              },
            ],
          }),
        }}
      />

      {/* FAQPage Structured Data — hanya untuk artikel yang punya daftar FAQ */}
      {ARTICLE_FAQ[article.slug] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: ARTICLE_FAQ[article.slug].map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            }),
          }}
        />
      )}

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-semibold mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-sm">
            Beranda
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <Link href="/artikel" className="hover:text-blue-600 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-sm">
            Artikel
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-slate-300" />
          <span className="text-slate-600 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
            {article.title}
          </span>
        </nav>

        {/* Back link */}
        <Link
          href="/artikel"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 mb-6 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Artikel
        </Link>

        {/* Article Container */}
        <article className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-10 mb-12">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-400 font-semibold mb-4">
              <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                <span className="inline-flex items-center gap-1.5 font-bold text-slate-800">
                  <User className="h-4 w-4 text-blue-600" />
                  {(article as any).authorName || "Tim Redaksi AndisLab"}
                </span>
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <span className="inline-flex items-center gap-1 text-slate-600 text-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Ditinjau oleh Tim Teknisi Khusus Lab
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(article.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-1.5" title="Jumlah dilihat">
                <Eye className="h-4 w-4" />
                {article.viewCount.toLocaleString("id-ID")} kali dilihat
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed italic border-l-4 border-slate-200 pl-4 py-1">
                {article.excerpt}
              </p>
            )}
            <div className="mt-5">
              <ArticleLikeButton slug={article.slug} initialLikeCount={article.likeCount} />
            </div>
          </header>

          {/* Cover image */}
          {article.image && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-50 mb-8 border border-slate-100 shadow-inner">
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
            </div>
          )}

          {/* Main content with custom rendered Markdown elements */}
          <div className="prose max-w-none text-slate-700 leading-relaxed font-normal text-base sm:text-lg space-y-6">
            <ReactMarkdown
              components={{
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-xl sm:text-2xl font-bold text-slate-900 mt-10 mb-4 tracking-tight border-b border-slate-100 pb-2"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mt-8 mb-3" {...props} />
                ),
                p: ({ node, ...props }) => <p className="mb-4 text-slate-650" {...props} />,
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-650" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-6 mb-6 space-y-2 text-slate-650" {...props} />
                ),
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                a: ({ node, ...props }) => (
                  <a className="text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-2" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-blue-500 pl-4 py-1 my-6 italic text-slate-500 bg-blue-50/30 rounded-r-lg"
                    {...props}
                  />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-6 border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse text-sm text-slate-600" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-800" {...props} />,
                th: ({ node, ...props }) => <th className="px-4 py-3 border-r border-slate-200" {...props} />,
                td: ({ node, ...props }) => <td className="px-4 py-3 border-r border-b border-slate-100" {...props} />,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* Dynamic WhatsApp CTA Banner */}
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-600 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden mt-12 border border-emerald-550/20">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 translate-x-8 -translate-y-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 -translate-x-8 translate-y-8" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-1.5">Butuh Konsultasi Spesifikasi Alat Lab?</h3>
                <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
                  Konsultasikan kebutuhan teknis, negosiasi harga, atau minta surat penawaran resmi (RFQ) untuk produk yang dibahas dalam artikel ini.
                </p>
              </div>
              <ArticleWaCTA title={article.title} />
            </div>
          </div>
        </article>

        {/* Recommended products section */}
        {article.products.length > 0 && (
          <section className="border-t border-slate-150 pt-12 mb-16">
            <div className="mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 mb-2 border border-emerald-100">
                🔬 Produk Terkait
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Rekomendasi Alat Laboratorium
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Alat laboratorium berkualitas tinggi yang dibahas atau direkomendasikan dalam artikel ini.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {article.products.map((product: any) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
