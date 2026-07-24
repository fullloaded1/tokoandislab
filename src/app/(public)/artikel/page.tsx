/* Hallmark · page: ArticlesIndex · genre: modern-minimal · macrostructure: Workbench · design-system: design.md */
import { prisma } from "@/lib/db";
import ArticlesListClient from "./ArticlesListClient";
import type { Metadata } from "next";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Artikel, Panduan & Spesifikasi Alat Laboratorium - AndisLab",
  description:
    "Temukan artikel ilmiah terbaru, panduan penggunaan alat laboratorium, dan spesifikasi detail instrumen lab dari distributor terpercaya AndisLab Indonesia.",
  openGraph: {
    title: "Artikel & Panduan Alat Laboratorium - AndisLab",
    description:
      "Temukan artikel ilmiah terbaru, panduan penggunaan alat laboratorium, dan spesifikasi detail instrumen lab dari distributor terpercaya AndisLab Indonesia.",
    type: "website",
  },
  alternates: { canonical: "/artikel" },
};

export default async function ArticlesIndexPage() {
  let articles: any[] = [];
  try {
    articles = await (prisma as any).article.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("ArticlesIndexPage: Failed to fetch articles", error);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 mb-4 border border-blue-100">
          📰 Pusat Edukasi & Informasi
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Artikel & Panduan <span className="gradient-text">Spesifikasi Alat Lab</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-500 mt-4 leading-relaxed">
          Temukan tips penggunaan, spesifikasi teknis mendalam, dan berita terbaru seputar alat-alat laboratorium industri, medis, dan pendidikan.
        </p>
      </div>

      <ArticlesListClient initialArticles={articles} />
    </div>
  );
}
