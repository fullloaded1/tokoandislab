/* Hallmark · component: HeroSection · genre: modern-minimal · macrostructure: Marquee Hero · 8-state-ui: pass · contrast: pass */
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  PackageCheck,
  Building2,
  MessageSquare,
  Award,
  Clock,
} from "lucide-react";
import AntiIndentBadge from "@/components/AntiIndentBadge";
import { WA_NUMBER } from "@/data/promo-akhir-tahun";

interface FlagshipSlide {
  id: string;
  badge: {
    text: string;
    icon: any;
    className: string;
  };
  headline: string;
  highlight: string;
  description: string;
  pills: { text: string; icon?: any; className: string }[];
  primaryCta: {
    text: string;
    href: string;
    className: string;
    isExternal?: boolean;
    icon?: any;
  };
  secondaryCta?: {
    text: string;
    href: string;
    className: string;
    isExternal?: boolean;
    icon?: any;
  };
  bgGradient: string;
  glowColor: string;
  image: string;
  imageAlt: string;
  floatingCard?: {
    title: string;
    subtitle: string;
    badge: string;
  };
}

const FLAGSHIP_SLIDES: FlagshipSlide[] = [
  // 1. Promo Akhir Tahun 2026 (Active Campaign)
  {
    id: "promo-akhir-tahun-2026",
    badge: {
      text: "PROMO AKHIR TAHUN 2026 • 30 OKT – 30 DES",
      icon: Sparkles,
      className: "bg-blue-500/20 text-cyan-300 border-blue-400/40",
    },
    headline: "Tutup 2026, Buka Lab Impian.",
    highlight: "Serap Anggaran Cepat. Dokumen SPJ Lengkap.",
    description:
      "35 instrumen analitik & laboratorium ready stock gudang siap kirim sebelum tutup buku. SPH resmi 1x24 jam ber-KOP, unit fisik siap inspeksi, dan draft dokumen SPJ disiapkan.",
    pills: [
      { text: "100% Ready Stock Gudang", icon: PackageCheck, className: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" },
      { text: "Draft SPJ & BAST Lengkap", icon: CheckCircle2, className: "bg-teal-500/20 text-teal-300 border-teal-400/30" },
      { text: "Ready Stock Akhir Tahun", icon: Award, className: "bg-blue-500/20 text-cyan-300 border-blue-400/30" },
    ],
    primaryCta: {
      text: "Buka Katalog Promo Akhir Tahun",
      href: "/promo-akhir-tahun",
      className: "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-blue-600/30 hover:shadow-blue-600/50 hover:from-blue-500 hover:to-cyan-400 border border-white/20",
      icon: ArrowRight,
    },
    secondaryCta: {
      text: "Minta SPH via WhatsApp",
      href: `https://wa.me/${WA_NUMBER}?text=Halo%20Tim%20Sales%20AndisLab%2C%20saya%20ingin%20meminta%20Surat%20Penawaran%20Harga%20(SPH)%20resmi%20untuk%20Promo%20Akhir%20Tahun%202026.`,
      className: "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-slate-600",
      isExternal: true,
      icon: MessageSquare,
    },
    bgGradient: "bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950",
    glowColor: "bg-blue-600/15",
    image: "/images/promo/featured/cat2-autoclave.png",
    imageAlt: "Instrumen Promo Akhir Tahun 2026 AndisLab",
    floatingCard: {
      title: "Dokumen SPJ Lengkap",
      subtitle: "Barang Fisik Ada Sebelum BAST",
      badge: "Siap Audit",
    },
  },

  // 2. Ready Stock Anti-Indent
  {
    id: "ready-stock-anti-indent",
    badge: {
      text: "BEBAS INDENT BERBULAN-BULAN",
      icon: PackageCheck,
      className: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    },
    headline: "Alat Lab Fisik Ready di Gudang.",
    highlight: "Kirim Cepat 3–7 Hari ke Seluruh Indonesia.",
    description:
      "Hindari risiko anggaran hangus akibat waktu tunggu impor 8–12 minggu. Autoclave, drying oven, incubator, dan mikroskop siap uji fungsi langsung ke lab Anda.",
    pills: [
      { text: "Kirim Cepat 3–7 Hari Kerja", icon: Truck, className: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" },
      { text: "Uji Fungsi QC Sebelum Kirim", icon: CheckCircle2, className: "bg-teal-500/20 text-teal-300 border-teal-400/30" },
      { text: "Garansi Resmi 12 Bulan", icon: ShieldCheck, className: "bg-sky-500/20 text-sky-300 border-sky-400/30" },
    ],
    primaryCta: {
      text: "Lihat Koleksi Ready Stock",
      href: "/ready-stock",
      className: "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-emerald-600/30 hover:shadow-emerald-600/50 border border-white/20",
      icon: ArrowRight,
    },
    secondaryCta: {
      text: "Cek Ketersediaan Unit",
      href: `https://wa.me/${WA_NUMBER}?text=Halo%20Tim%20Sales%20AndisLab%2C%20saya%20ingin%20cek%20ketersediaan%20stok%20alat%20lab%20ready%20stock.`,
      className: "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-slate-600",
      isExternal: true,
      icon: MessageSquare,
    },
    bgGradient: "bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950",
    glowColor: "bg-teal-500/15",
    image: "/images/daihanreadystock/LAC-1021SV AUTOCLAVE.webp",
    imageAlt: "Autoclave Sterilisasi Ready Stock AndisLab",
    floatingCard: {
      title: "Gudang Jabodetabek",
      subtitle: "Bisa Inspeksi Unit Langsung",
      badge: "Unit Baru",
    },
  },

  // 3. Pengadaan Pemerintah & e-Katalog
  {
    id: "pengadaan-pemerintah-ekatalog",
    badge: {
      text: "PENGADAAN RESMI PEMERINTAH & UNIVERSITAS",
      icon: Building2,
      className: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    },
    headline: "Mitra Resmi e-Katalog INAPROC.",
    highlight: "Dokumen SPJ & Faktur Pajak Lengkap. Transparan & Legal.",
    description:
      "Solusi pengadaan alat laboratorium terpercaya untuk Universitas Negeri, RSUD, Balai Riset, dan Instansi Pemerintah. Dokumen BAST, e-Faktur Pajak, dan kelengkapan SPJ terbit cepat tanpa repot.",
    pills: [
      { text: "Terdaftar di e-Katalog LKPP", icon: Building2, className: "bg-amber-500/20 text-amber-300 border-amber-400/30" },
      { text: "Paket SPJ & BAST Disiapkan", icon: CheckCircle2, className: "bg-blue-500/20 text-blue-300 border-blue-400/30" },
      { text: "Mitra 50+ Kampus & RSUD", icon: Award, className: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30" },
    ],
    primaryCta: {
      text: "Jalur Pengadaan Pemerintah",
      href: "/pemerintah",
      className: "bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-black shadow-amber-600/30 hover:shadow-amber-600/50 border border-white/20",
      icon: ArrowRight,
    },
    secondaryCta: {
      text: "Lihat Bukti Harga e-Katalog",
      href: "/pemerintah#bukti-harga",
      className: "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-slate-600",
      icon: ArrowRight,
    },
    bgGradient: "bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950",
    glowColor: "bg-amber-500/15",
    image: "/images/promo/featured/cat3-bsc.png",
    imageAlt: "Biosafety Cabinet Pengadaan Resmi AndisLab",
    floatingCard: {
      title: "Mitra Resmi e-Katalog",
      subtitle: "Dokumen Lengkap Siap Audit",
      badge: "Terverifikasi",
    },
  },

  // 4. Authorized Brand Flagship (Daihan Labtech & Yamato)
  {
    id: "authorized-brand-flagship",
    badge: {
      text: "DISTRIBUTOR RESMI PRINCIPAL GLOBAL",
      icon: Award,
      className: "bg-sky-500/20 text-sky-300 border-sky-400/40",
    },
    headline: "Teknologi Presisi Korea & Jepang.",
    highlight: "Daihan Labtech & Yamato Scientific.",
    description:
      "Drying oven, autoclave, incubator, water bath, dan muffle furnace bersertifikasi ISO & CE. Didukung ketersediaan suku cadang original dan teknisi tersertifikasi.",
    pills: [
      { text: "Korea: Daihan Labtech", icon: Award, className: "bg-sky-500/20 text-sky-300 border-sky-400/30" },
      { text: "Jepang: Yamato Scientific", icon: Award, className: "bg-red-500/20 text-red-300 border-red-400/30" },
      { text: "100% Suku Cadang Orisinal", icon: ShieldCheck, className: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" },
    ],
    primaryCta: {
      text: "Katalog Daihan Labtech",
      href: "/daihan-labtech",
      className: "bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 text-white shadow-sky-600/30 hover:shadow-sky-600/50 border border-white/20",
      icon: ArrowRight,
    },
    secondaryCta: {
      text: "Katalog Semua Produk",
      href: "/katalog",
      className: "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-slate-600",
      icon: ArrowRight,
    },
    bgGradient: "bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950",
    glowColor: "bg-sky-500/15",
    image: "/images/daihanreadystock/LDO-060E UNIVERSAL DRYING OVEN.webp",
    imageAlt: "Drying Oven Daihan Labtech Original AndisLab",
    floatingCard: {
      title: "Garansi Pabrik Resmi",
      subtitle: "Didukung Teknisi Prinsipal",
      badge: "Original",
    },
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "100% Original & Garansi",
    desc: "Sertifikat resmi langsung dari principal",
  },
  {
    icon: Truck,
    title: "Pengiriman Nasional",
    desc: "Melayani Jabodetabek & seluruh Indonesia",
  },
  {
    icon: Headphones,
    title: "Engineering Support",
    desc: "Konsultasi teknis & instalasi laboratorium",
  },
  {
    icon: ShieldCheck,
    title: "e-Katalog INAPROC",
    desc: "Terdaftar resmi untuk pengadaan pemerintah & SPJ",
  },
];

interface HeroSectionProps {
  featuredProducts?: any[];
  promoBanner?: any;
}

export default function HeroSection({}: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  const totalSlides = FLAGSHIP_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Dynamic remaining days until end of promo year 2026
  useEffect(() => {
    const calcRemaining = () => {
      const target = new Date("2026-12-30T23:59:59+07:00").getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setDaysRemaining(Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };
    calcRemaining();
    const interval = setInterval(calcRemaining, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-play interval with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch swipe handlers
  const minSwipeDistance = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  return (
    <section className="w-full relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pt-6 pb-16 border-b border-slate-200/60">
      {/* Subtle scientific coordinate grid watermark */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AntiIndentBadge variant="banner" showConsultText={true} className="mb-6 w-full" />

        {/* E-Commerce Banner Slider - Studio Glass Framework */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Sorotan Utama Instrumen Laboratorium AndisLab"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full min-h-[520px] lg:h-[540px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-700/60 ring-1 ring-slate-900/10 group bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-400/50 cursor-grab active:cursor-grabbing select-none"
        >
          {FLAGSHIP_SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
            const BadgeIcon = slide.badge.icon;
            const PrimaryIcon = slide.primaryCta.icon;
            const SecondaryIcon = slide.secondaryCta?.icon;

            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} dari ${totalSlides}: ${slide.headline}`}
                className={`absolute inset-0 flex flex-col lg:flex-row transition-all duration-500 ease-in-out ${slide.bgGradient} ${
                  isActive ? "opacity-100 z-10 visible" : "opacity-0 z-0 pointer-events-none invisible"
                }`}
              >
                {/* Ambient Radial Glow */}
                <div
                  className={`absolute top-0 right-1/4 w-[500px] h-[400px] ${slide.glowColor} blur-[120px] rounded-full pointer-events-none`}
                />

                {/* Content Left (60%) */}
                <div className="w-full lg:w-7/12 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-14 py-8 sm:py-12 z-20 space-y-4 sm:space-y-5">
                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-black tracking-wide border backdrop-blur-md ${slide.badge.className}`}
                    >
                      <BadgeIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{slide.badge.text}</span>
                    </span>

                    {/* Dynamic Countdown Chip for Slide 1 */}
                    {slide.id === "promo-akhir-tahun-2026" && daysRemaining !== null && (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black tracking-wide border backdrop-blur-md bg-rose-500/25 text-rose-200 border-rose-400/40 shadow-xs animate-pulse">
                        <Clock className="w-3.5 h-3.5 shrink-0 text-rose-300" />
                        <span>Sisa {daysRemaining} Hari Penyerapan</span>
                      </span>
                    )}
                  </div>

                  {/* Headline */}
                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight">
                      {slide.headline}
                    </h2>
                    <p className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-amber-300 leading-tight">
                      {slide.highlight}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed font-medium max-w-xl">
                    {slide.description}
                  </p>

                  {/* Benefit Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {slide.pills.map((pill, pIdx) => {
                      const PillIcon = pill.icon;
                      return (
                        <span
                          key={pIdx}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border backdrop-blur-sm ${pill.className}`}
                        >
                          {PillIcon && <PillIcon className="w-3.5 h-3.5 shrink-0" />}
                          <span>{pill.text}</span>
                        </span>
                      );
                    })}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    {slide.primaryCta.isExternal ? (
                      <a
                        href={slide.primaryCta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center gap-2 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${slide.primaryCta.className}`}
                      >
                        <span>{slide.primaryCta.text}</span>
                        {PrimaryIcon && <PrimaryIcon className="w-4 h-4" />}
                      </a>
                    ) : (
                      <Link
                        href={slide.primaryCta.href}
                        className={`inline-flex items-center justify-center gap-2 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${slide.primaryCta.className}`}
                      >
                        <span>{slide.primaryCta.text}</span>
                        {PrimaryIcon && <PrimaryIcon className="w-4 h-4" />}
                      </Link>
                    )}

                    {slide.secondaryCta && (
                      slide.secondaryCta.isExternal ? (
                        <a
                          href={slide.secondaryCta.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${slide.secondaryCta.className}`}
                        >
                          {SecondaryIcon && <SecondaryIcon className="w-4 h-4" />}
                          <span>{slide.secondaryCta.text}</span>
                        </a>
                      ) : (
                        <Link
                          href={slide.secondaryCta.href}
                          className={`inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${slide.secondaryCta.className}`}
                        >
                          {SecondaryIcon && <SecondaryIcon className="w-4 h-4" />}
                          <span>{slide.secondaryCta.text}</span>
                        </Link>
                      )
                    )}
                  </div>
                </div>

                {/* Image Right (40%) with Studio Glass Showcase Frame */}
                <div className="w-full lg:w-5/12 h-64 lg:h-full relative flex items-center justify-center p-6 lg:p-10 z-10">
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[380px] lg:h-[380px] rounded-3xl bg-slate-900/60 border border-slate-700/80 p-4 sm:p-6 backdrop-blur-md shadow-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02]">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/95 p-3 flex items-center justify-center">
                      <Image
                        src={slide.image}
                        alt={slide.imageAlt}
                        fill
                        className="object-contain p-2"
                        priority={index === 0}
                        quality={80}
                        sizes="(max-width: 768px) 256px, 380px"
                      />
                    </div>
                  </div>

                  {/* Floating Glass Pill Card */}
                  {slide.floatingCard && (
                    <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 sm:p-4 shadow-xl text-left hidden sm:block">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                          {slide.floatingCard.badge}
                        </span>
                      </div>
                      <div className="text-xs font-black text-white leading-tight">
                        {slide.floatingCard.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {slide.floatingCard.subtitle}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Left Arrow Button */}
          <button
            onClick={prevSlide}
            aria-label="Slide sebelumnya"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white/80 hover:text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={nextSlide}
            aria-label="Slide berikutnya"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white/80 hover:text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl">
            {FLAGSHIP_SLIDES.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(index)}
                  className="flex items-center justify-center p-1 rounded-full transition-all focus:outline-none focus:ring-1 focus:ring-cyan-300"
                  aria-label={`Ke slide ${index + 1}: ${slide.headline}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-8 bg-gradient-to-r from-blue-400 to-cyan-300 shadow-xs"
                        : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Trust Features (4-Column Bento Glass Cards Below Banner) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {features.map((f) => (
            <div
              key={f.title}
              className="group/feature flex items-center gap-4 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-xl hover:border-emerald-500/50 hover:-translate-y-1.5 transition-all duration-300 ease-out"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/15 via-slate-50 to-teal-50 text-emerald-700 shrink-0 transition-transform duration-300 group-hover/feature:scale-110 group-hover/feature:bg-gradient-to-br group-hover/feature:from-emerald-600 group-hover/feature:to-teal-700 group-hover/feature:text-white shadow-sm border border-emerald-500/20">
                <f.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight group-hover/feature:text-emerald-700 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
