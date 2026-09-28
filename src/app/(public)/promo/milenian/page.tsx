/* Hallmark · page: PromoMilenian2026 · genre: corporate-b2b · macrostructure: Single-Page Promo */
import type { Metadata } from "next";
import Link from "next/link";
import { WA_NUMBER, waMeUrl, WA_NUMBER_DISPLAY } from "@/lib/contact";
import PromoMilenianCountdown from "./Countdown";
import "./promo-milenian.css";

// ─── Konstanta Promo ───────────────────────────────────────────────────────
const PROMO_CODE     = "PROMO-MILENIAN";
const PROMO_START    = "22 September";
const PROMO_END      = "28 Oktober 2026";
const PROMO_PERIOD   = `${PROMO_START} – ${PROMO_END}`;
const WHATSAPP_NUMBER = WA_NUMBER; // sumber: @/lib/contact

// ─── Metadata SEO ─────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Promo Milenian 2026 | AndisLab",
  description:
    "Promo eksklusif Milenian 2026 — diskon 5–15%, bundling gratis aksesoris, dan Star Points ×2 untuk pembelian alat lab & bahan kimia analitik. Berlaku 22 September – 28 Oktober 2026.",
  alternates: { canonical: "/promo/milenian" },
  openGraph: {
    title: "Promo Milenian 2026 | AndisLab",
    description:
      "Lab Lebih Produktif. Budget Tetap Terjaga. Diskon 5–15%, bundling gratis, poin double. Berlaku hingga 28 Oktober 2026.",
    type: "website",
    siteName: "AndisLab",
    images: [
      { url: "/images/promo-milenian-2026.jpg", width: 1200, height: 630, alt: "Promo Milenian 2026 AndisLab" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Promo Milenian 2026 | AndisLab",
    description: "Diskon 5–15%, bundling gratis aksesoris, Star Points ×2. Hubungi kami sebelum 28 Oktober 2026.",
    images: ["/images/promo-milenian-2026.jpg"],
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────
const offers = [
  {
    step: 1,
    icon: "🏷️",
    iconClass: "pm-offer-icon-teal",
    title: "Diskon Langsung",
    desc: "Hemat 5–15% untuk pembelian alat lab & bahan kimia analitik dengan nilai minimum Rp 10.000.000.",
    note: "Min. order Rp 10.000.000",
  },
  {
    step: 2,
    icon: "🎁",
    iconClass: "pm-offer-icon-blue",
    title: "Bundling Hemat",
    desc: "Beli instrumen utama, dapatkan aksesoris atau consumable terkait secara gratis. Berlaku untuk produk pilihan.",
    note: "Berlaku produk pilihan",
  },
  {
    step: 3,
    icon: "⭐",
    iconClass: "pm-offer-icon-amber",
    title: "Star Points ×2",
    desc: "Setiap transaksi selama periode promo mendapatkan poin double. Poin dapat ditukarkan di pembelian berikutnya.",
    note: "Poin bisa ditukar",
  },
];

const products = [
  { icon: "🔬", name: "Incubator Shaker" },
  { icon: "🌡️", name: "Water Bath" },
  { icon: "🔄", name: "Centrifuge" },
  { icon: "📊", name: "EC / pH / Turbidity Meter" },
  { icon: "💧", name: "Water Purification System" },
  { icon: "🧪", name: "Glassware & Consumable Lab" },
  { icon: "⚗️", name: "Bahan Kimia Analitik" },
];

const steps = [
  {
    step: 1,
    icon: "💬",
    title: "Hubungi via WhatsApp",
    desc: "Kirim pesan ke tim AndisLab melalui WhatsApp.",
  },
  {
    step: 2,
    icon: "🎟️",
    title: `Sebut Kode Promo`,
    desc: `Sebutkan kode promo untuk mengaktifkan penawaran eksklusif ini.`,
    code: PROMO_CODE,
  },
  {
    step: 3,
    icon: "📋",
    title: "Terima Proposal Resmi",
    desc: "Tim kami menyiapkan penawaran & proposal harga resmi dalam 1×24 jam kerja.",
  },
];

const terms = [
  `Penawaran berlaku ${PROMO_PERIOD}.`,
  "Diskon 5–15% berlaku untuk pembelian minimal Rp 10.000.000.",
  "Bundling gratis aksesoris berlaku untuk produk yang tercantum dalam daftar pilihan; tanyakan ketersediaan kepada tim sales.",
  "Star Points ×2 dikreditkan otomatis setelah pembayaran dikonfirmasi.",
  "Tidak dapat digabungkan dengan diskon lain kecuali dinyatakan secara tertulis.",
  "Syarat & ketentuan lengkap dapat diminta melalui WhatsApp tim AndisLab.",
];

// ─── WA URL ───────────────────────────────────────────────────────────────
const waUrl = waMeUrl(
  `Halo AndisLab, saya ingin menggunakan kode ${PROMO_CODE} untuk minta penawaran harga alat lab.`
);

// ─── Page ─────────────────────────────────────────────────────────────────
export default function PromoMilenianPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="pm-hero" aria-label="Hero Promo Milenian 2026">
          <div className="pm-hero-overlay" aria-hidden="true" />
          <div className="pm-hero-content">
            <div className="max-w-2xl space-y-5">
              <span className="pm-badge">
                📢 Penawaran Eksklusif
              </span>

              <div>
                <h1 className="pm-hero-title">
                  Promo Milenian{" "}
                  <span className="pm-hero-title-accent">2026</span>
                </h1>
                <p className="pm-hero-tagline">
                  Lab Lebih Produktif. Budget Tetap Terjaga.
                </p>
              </div>

              <span className="pm-hero-period">
                🗓️ Berlaku: {PROMO_PERIOD}
              </span>

              <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
                Khusus periode ini, AndisLab menghadirkan penawaran eksklusif untuk mendukung kebutuhan laboratorium institusi, industri, dan perguruan tinggi Anda.
              </p>

              {/* Countdown Timer */}
              <PromoMilenianCountdown />

              {/* Hero CTA */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="hero-wa-cta"
                  className="pm-wa-btn"
                >
                  <span>💬</span>
                  Hubungi via WhatsApp
                </a>
                <a
                  href="#cara-klaim"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm font-semibold text-sm px-5 py-3 rounded-full transition-colors duration-200"
                >
                  Cara Klaim →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3 PILIHAN PROMO ──────────────────────────────────────────── */}
        <section aria-labelledby="offers-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-2">
              <span className="pm-section-tag">🎯 3 Pilihan Promo</span>
              <h2 id="offers-heading" className="text-2xl sm:text-3xl font-bold text-slate-900">
                Pilih Keuntungan yang Paling Sesuai
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-xs">
              Ketiga promo dapat dikombinasikan dalam satu transaksi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {offers.map((offer) => (
              <div key={offer.step} className="pm-offer-card">
                <div className="flex items-center gap-3">
                  <div className={`pm-offer-icon-wrap ${offer.iconClass}`}>
                    {offer.icon}
                  </div>
                  <span className="pm-offer-step-badge">{offer.step}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{offer.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{offer.desc}</p>
                </div>
                <span className="pm-offer-note">✓ {offer.note}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRODUK UNGGULAN ──────────────────────────────────────────── */}
        <section aria-labelledby="products-heading" className="bg-white rounded-2xl border border-slate-200 p-8">
          <div className="space-y-2 mb-6">
            <span className="pm-section-tag">🔬 Produk Unggulan</span>
            <h2 id="products-heading" className="text-2xl sm:text-3xl font-bold text-slate-900">
              Instrumen & Produk yang Masuk Promo
            </h2>
            <p className="text-sm text-slate-500">
              Semua kategori produk berikut mendapat akses penawaran eksklusif periode ini.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {products.map((p) => (
              <span key={p.name} className="pm-product-chip">
                <span className="pm-product-icon">{p.icon}</span>
                {p.name}
              </span>
            ))}
          </div>
        </section>

        {/* ── CARA KLAIM ───────────────────────────────────────────────── */}
        <section id="cara-klaim" aria-labelledby="claim-heading" className="space-y-6">
          <div className="space-y-2">
            <span className="pm-section-tag">📋 Cara Klaim</span>
            <h2 id="claim-heading" className="text-2xl sm:text-3xl font-bold text-slate-900">
              3 Langkah Sederhana
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, idx) => (
              <div key={s.step} className="relative flex flex-col gap-4 bg-white rounded-2xl border border-slate-200 p-6">
                {/* Arrow connector (desktop only) */}
                {idx < steps.length - 1 && (
                  <span className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-slate-300 text-2xl z-10">›</span>
                )}
                <div className="flex items-center gap-3">
                  <span className="pm-step-circle">{s.step}</span>
                  <span className="text-2xl">{s.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{s.desc}</p>
                  {s.code && (
                    <span className="pm-promo-code mt-3 block w-fit">{s.code}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA PENUTUP ──────────────────────────────────────────────── */}
        <section className="pm-cta-section p-8 sm:p-12 text-center" aria-label="Ajakan bertindak">
          <div className="relative z-10 space-y-4">
            <p className="text-teal-300 text-xs font-bold uppercase tracking-widest">
              Penawaran Terbatas — Berlaku s.d. {PROMO_END}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Hubungi Kami Sekarang
            </h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Untuk penawaran terbaik! Tim sales kami siap menyiapkan proposal resmi dalam 1×24 jam kerja.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="footer-wa-cta"
                className="pm-wa-btn"
              >
                <span>💬</span>
                Hubungi via WhatsApp
              </a>
            </div>
            <div className="pt-3 space-y-1 text-slate-400 text-xs">
              <p>📞 {WA_NUMBER_DISPLAY} (Ahnaf)</p>
              <p>✉️ cs.andislab@gmail.com</p>
              <p>🌐 www.andislab.com</p>
            </div>
          </div>
        </section>

        {/* ── SYARAT & KETENTUAN + LINK KEMBALI ─────────────────────── */}
        <footer className="space-y-4">
          <div className="pm-footer-terms">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Syarat &amp; Ketentuan
            </h3>
            <ul className="space-y-1.5">
              {terms.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="text-teal-500 mt-0.5 flex-shrink-0">•</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center text-sm">
            <Link
              href="/"
              className="text-blue-700 hover:text-blue-900 font-semibold transition-colors duration-150"
            >
              ← Kembali ke Beranda
            </Link>
            <span className="mx-3 text-slate-300">|</span>
            <Link
              href="/katalog"
              className="text-blue-700 hover:text-blue-900 font-semibold transition-colors duration-150"
            >
              Jelajahi Katalog →
            </Link>
          </div>
        </footer>

      </div>
    </main>
  );
}
