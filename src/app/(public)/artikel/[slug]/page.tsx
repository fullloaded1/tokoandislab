import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import ProductCard from "@/components/ProductCard";
import { BookOpen, Calendar, ChevronRight, ArrowLeft } from "lucide-react";
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

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticle(slug);
  if (!article || !article.published) return {};
  
  return {
    title: `${article.title} - AndisLab`,
    description: article.excerpt || "Baca artikel selengkapnya di AndisLab.",
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
      canonical: `https://andislabs.com/artikel/${article.slug}`,
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
              "@type": "Organization",
              name: "AndisLab",
              url: "https://andislabs.com",
            },
            publisher: {
              "@type": "Organization",
              name: "AndisLab",
              logo: {
                "@type": "ImageObject",
                url: "https://andislabs.com/logo.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://andislabs.com/artikel/${article.slug}`,
            },
          }),
        }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-semibold mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <Link href="/artikel" className="hover:text-blue-600 transition-colors">
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
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Artikel
        </Link>

        {/* Article Container */}
        <article className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-10 mb-12">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-semibold mb-4">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(article.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
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
              <a
                href={`/api/wa-redirect?source=artikel_cta&text=Halo AndisLab, saya sedang membaca artikel "${encodeURIComponent(article.title)}" dan ingin bertanya lebih lanjut.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white text-emerald-700 px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shrink-0"
              >
                Tanya Spesialis via WA
              </a>
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
