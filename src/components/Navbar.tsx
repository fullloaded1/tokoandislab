/* Hallmark · component: Navbar · genre: modern-minimal · theme: AndisLab OKLCH Brand · states: default · hover · focus · active · disabled · contrast: pass */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Phone,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { useRFQStore } from "@/store/useRFQStore";
import { useLeadMagnetStore } from "@/store/useLeadMagnetStore";
import RFQCartDrawer from "./RFQCartDrawer";
import { trackWhatsApp } from "@/lib/track";
import { waMeUrl } from "@/lib/contact";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [solusiDropdownOpen, setSolusiDropdownOpen] = useState(false);
  const [infoDropdownOpen, setInfoDropdownOpen] = useState(false);
  const { isCartOpen: cartOpen, setCartOpen, items } = useRFQStore();
  const openLeadMagnet = useLeadMagnetStore((state) => state.openModal);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSolusiDropdownOpen(false);
    setInfoDropdownOpen(false);
  }, [pathname]);

  const totalItems = mounted ? items.reduce((s, i) => s + i.qty, 0) : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/katalog?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Top Utility & Promo Strip - Corporate Kemerdekaan Style */}
      {pathname !== "/promo-merdeka" && (
        <div className="fixed top-0 left-0 right-0 z-[51] bg-red-900 text-white border-b border-red-950 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2 text-[11px] font-semibold tracking-wide">
            <Link
              href="/promo-merdeka"
              className="flex items-center gap-2 hover:text-red-100 transition-colors truncate"
            >
              <span className="shrink-0 flex h-4 w-4 items-center justify-center rounded-sm bg-red-800 text-[10px] border border-red-700">🇮🇩</span>
              <span className="truncate font-bold">✨ Promo MERDEKA Sukses! 24 Pesanan | Rating 4.8★ | 150+ Lab Terpercaya</span>
              <span className="hidden md:inline font-bold text-red-200 underline decoration-red-400/60 shrink-0 ml-1">Lihat Detail Program &rarr;</span>
            </Link>
            <div className="hidden xl:flex items-center gap-4 text-red-100 font-medium shrink-0">
              <span className="flex items-center gap-1.5 border-l border-red-800 pl-4">
                <ShieldCheck className="h-3.5 w-3.5 text-red-200" /> Terdaftar di e-Katalog INAPROC
              </span>
              <span className="border-l border-red-800 pl-4">Faktur Pajak & SPJ Resmi</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Header - SaaS Floating Glass Pill (N5 / N1b) */}
      {/* Main Header - SaaS Floating Glass Pill (N5 / N1b) */}
      <header
        className="fixed left-0 right-0 z-50 transition-all duration-300 ease-[var(--ease-out)] max-w-7xl mx-auto px-2 sm:px-4 lg:px-6"
        style={{ top: pathname !== "/promo-merdeka" ? "42px" : "12px" }}
      >
        <div
          className={`w-full transition-all duration-300 ease-[var(--ease-out)] ${
            scrolled
              ? "bg-white/90 backdrop-blur-2xl shadow-xl shadow-slate-900/10 py-2 px-3 sm:px-5 border border-slate-200/80 rounded-2xl"
              : "bg-white/80 backdrop-blur-xl py-2.5 sm:py-3 px-3 sm:px-5 border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-900/5"
          }`}
        >
          <div className="flex items-center justify-between gap-2 xl:gap-4 min-w-0">
            {/* Logo + Institutional Partner Badge */}
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/" className="flex items-center gap-2 group">
                <Image
                  src="/logo.png"
                  alt="AndisLab Logo"
                  width={140}
                  height={48}
                  className="h-8 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </Link>
              <span className="hidden 2xl:inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-1 text-[11px] font-bold text-blue-700 tracking-tight shadow-2xs shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                Distributor e-Katalog
              </span>
            </div>

            {/* Clean Desktop Navigation (lg:flex) */}
            <nav className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1.5 flex-1 min-w-0 px-2">
              {/* Beranda is redundant with Logo on desktop, removed to save space */}

              <Link
                href="/katalog"
                className={`px-2 xl:px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-200 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] active:translate-y-0.5 ${
                  pathname === "/katalog"
                    ? "text-blue-600 bg-blue-50/80 shadow-2xs"
                    : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                Katalog
              </Link>

              <Link
                href="/ready-stock"
                className={`inline-flex items-center gap-1.5 px-2 xl:px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-200 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] active:translate-y-0.5 ${
                  pathname === "/ready-stock"
                    ? "text-emerald-700 bg-emerald-50 border border-emerald-200/60 shadow-2xs"
                    : "text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span>Ready Stock</span>
              </Link>

              <Link
                href="/pemerintah"
                className={`inline-flex items-center gap-1 px-2 xl:px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-200 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] active:translate-y-0.5 ${
                  pathname === "/pemerintah"
                    ? "text-blue-700 bg-blue-50 border border-blue-200/60 shadow-2xs"
                    : "text-slate-700 hover:text-blue-700 hover:bg-blue-50/60"
                }`}
              >
                <span>Instansi B2B</span>
                <span className="rounded bg-blue-600 px-1 py-0.5 text-[9px] font-extrabold text-white leading-none">
                  Resmi
                </span>
              </Link>

              <Link
                href="/daihan-labtech"
                className={`hidden xl:block px-2 xl:px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-200 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] active:translate-y-0.5 ${
                  pathname === "/daihan-labtech"
                    ? "text-blue-600 bg-blue-50/80 shadow-2xs"
                    : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                Daihan Labtech
              </Link>

              {/* Dropdown for Solusi Industri */}
              <div
                className="relative"
                onMouseEnter={() => setSolusiDropdownOpen(true)}
                onMouseLeave={() => setSolusiDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setSolusiDropdownOpen(!solusiDropdownOpen)}
                  className={`inline-flex items-center gap-1 px-2.5 xl:px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                    ["/solusi/manufaktur", "/solusi/farmasi", "/pemerintah"].includes(pathname)
                      ? "text-blue-600 bg-blue-50/80"
                      : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                >
                  <span>Solusi Industri</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${solusiDropdownOpen ? "rotate-180 text-blue-600" : ""}`} />
                </button>

                {solusiDropdownOpen && (
                  <div className="absolute top-full right-0 lg:left-0 pt-2 w-52 z-50">
                    <div className="rounded-2xl bg-white p-2 shadow-xl border border-slate-100 ring-1 ring-slate-900/5">
                      <Link
                        href="/solusi/manufaktur"
                        onClick={() => setSolusiDropdownOpen(false)}
                        className={`block rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                          pathname === "/solusi/manufaktur"
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                        }`}
                      >
                        Manufaktur & Pabrik
                      </Link>
                      <Link
                        href="/solusi/farmasi"
                        onClick={() => setSolusiDropdownOpen(false)}
                        className={`block rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                          pathname === "/solusi/farmasi"
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                        }`}
                      >
                        Farmasi & Kesehatan
                      </Link>
                      <Link
                        href="/pemerintah"
                        onClick={() => setSolusiDropdownOpen(false)}
                        className={`block rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                          pathname === "/pemerintah"
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                        }`}
                      >
                        Pemerintah / e-Katalog
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Dropdown for Secondary Info (Tentang & Artikel) */}
              <div
                className="relative"
                onMouseEnter={() => setInfoDropdownOpen(true)}
                onMouseLeave={() => setInfoDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setInfoDropdownOpen(!infoDropdownOpen)}
                  className={`inline-flex items-center gap-1 px-2.5 xl:px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                    ["/tentang", "/artikel"].includes(pathname)
                      ? "text-blue-600 bg-blue-50/80"
                      : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                >
                  <span>Informasi</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${infoDropdownOpen ? "rotate-180 text-blue-600" : ""}`} />
                </button>

                {infoDropdownOpen && (
                  <div className="absolute top-full right-0 pt-2 w-52 z-50">
                    <div className="rounded-2xl bg-white p-2 shadow-xl border border-slate-100 ring-1 ring-slate-900/5">
                      <button
                        type="button"
                        onClick={() => {
                          setInfoDropdownOpen(false);
                          openLeadMagnet();
                        }}
                        className="w-full text-left flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all text-indigo-700 bg-indigo-50 hover:bg-indigo-100 mb-1"
                      >
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white">↓</span>
                        Unduh e-Katalog 2026
                      </button>
                      <Link
                        href="/tentang"
                        onClick={() => setInfoDropdownOpen(false)}
                        className={`block rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                          pathname === "/tentang"
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                        }`}
                      >
                        Tentang Kami & Principal
                      </Link>
                      <Link
                        href="/artikel"
                        onClick={() => setInfoDropdownOpen(false)}
                        className={`block rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                          pathname === "/artikel"
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                        }`}
                      >
                        Artikel & Edukasi Lab
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Desktop Quick Actions & CTA */}
            <div className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 shrink-0">
              {/* Quick Search Bar Trigger */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 hover:text-slate-800 text-xs font-semibold border border-slate-200/60 transition-all shrink-0 group"
                aria-label="Cari produk"
              >
                <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                <span className="hidden xl:inline">Cari...</span>
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex h-9 w-9 xl:h-10 xl:w-10 items-center justify-center rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 transition-all shrink-0"
                aria-label="Keranjang RFQ"
              >
                <ShoppingCart className="h-4 w-4 text-slate-600 shrink-0" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-1.5 text-[10px] font-bold text-white shadow-md ring-2 ring-white">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Premium Sales CTA */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  trackWhatsApp("/?wa=open&source=navbar_desktop&text=Halo%20AndisLab,%20saya%20ingin%20konsultasi%20produk.");
                  window.open(waMeUrl("Halo AndisLab, saya ingin konsultasi produk."), "_blank", "noopener,noreferrer");
                }}
                className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 px-3 xl:px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all duration-200 ease-[var(--ease-out)] hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] active:scale-[0.98] shrink-0"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <Phone className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:scale-110" />
                <span>Hubungi Sales</span>
              </button>
            </div>

            {/* Mobile Actions - UI/UX Pro Max 44px touch targets */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 active:scale-95 transition-all"
                aria-label="Cari"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 active:scale-95 transition-all"
                aria-label="Keranjang RFQ"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-1.5 text-[10px] font-black text-white shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 active:scale-95 transition-all"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-slate-900" />
                ) : (
                  <Menu className="h-5 w-5 text-slate-900" />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar (expandable) */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              searchOpen ? "max-h-20 mt-4 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik nama alat laboratorium, brand (Daihan/Lovibond/Pyrex), atau spesifikasi..."
                className="w-full rounded-2xl border border-blue-200 bg-blue-50/30 py-3 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
                autoFocus={searchOpen}
              />
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-[500px] opacity-100 border-t border-slate-100 mt-4 bg-white" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-6 pt-3 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center min-h-[44px] rounded-2xl px-4 text-sm font-black transition-all active:scale-[0.98] ${
                pathname === "/"
                  ? "text-emerald-700 bg-emerald-50 border border-emerald-200/80 shadow-2xs"
                  : "text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/katalog"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center min-h-[44px] rounded-2xl px-4 text-sm font-black transition-all active:scale-[0.98] ${
                pathname === "/katalog"
                  ? "text-emerald-700 bg-emerald-50 border border-emerald-200/80 shadow-2xs"
                  : "text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
              }`}
            >
              Katalog Produk
            </Link>
            <Link
              href="/ready-stock"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between min-h-[44px] rounded-2xl px-4 text-sm font-black transition-all active:scale-[0.98] ${
                pathname === "/ready-stock"
                  ? "text-emerald-700 bg-emerald-50 border border-emerald-200/80 shadow-2xs"
                  : "text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
              }`}
            >
              <span>Ready Stock (Siap Kirim)</span>
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </Link>
            <Link
              href="/pemerintah"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between min-h-[44px] rounded-2xl px-4 text-sm font-black transition-all active:scale-[0.98] ${
                pathname === "/pemerintah"
                  ? "text-blue-700 bg-blue-50 border border-blue-200/80 shadow-2xs"
                  : "text-slate-700 hover:bg-slate-50 hover:text-blue-700"
              }`}
            >
              <span>Pemerintah / e-Katalog</span>
              <span className="rounded-lg bg-blue-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow-2xs">Resmi</span>
            </Link>
            <Link
              href="/daihan-labtech"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center min-h-[44px] rounded-2xl px-4 text-sm font-black transition-all active:scale-[0.98] ${
                pathname === "/daihan-labtech"
                  ? "text-blue-600 bg-blue-50 border border-blue-200/80 shadow-2xs"
                  : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
              }`}
            >
              Daihan Labtech
            </Link>
            <div className="border-t border-slate-100 my-2 pt-2 space-y-1.5">
              <span className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Solusi Industri</span>
              <Link
                href="/solusi/manufaktur"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center min-h-[44px] rounded-2xl px-4 text-sm font-bold transition-all active:scale-[0.98] ${
                  pathname === "/solusi/manufaktur" ? "text-blue-700 bg-blue-50" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                Manufaktur & Pabrik
              </Link>
              <Link
                href="/solusi/farmasi"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center min-h-[44px] rounded-2xl px-4 text-sm font-bold transition-all active:scale-[0.98] ${
                  pathname === "/solusi/farmasi" ? "text-blue-700 bg-blue-50" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                Farmasi & Kesehatan
              </Link>
            </div>
            
            <div className="border-t border-slate-100 my-2 pt-2 space-y-1.5">
              <Link
                href="/tentang"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center min-h-[44px] rounded-2xl px-4 text-sm font-bold transition-all active:scale-[0.98] ${
                  pathname === "/tentang" ? "text-blue-700 bg-blue-50" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                Tentang Kami & Principal
              </Link>
              <Link
                href="/artikel"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center min-h-[44px] rounded-2xl px-4 text-sm font-bold transition-all active:scale-[0.98] ${
                  pathname === "/artikel" ? "text-blue-700 bg-blue-50" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                Artikel & Edukasi Lab
              </Link>
            </div>
            <Link
              href="/promo-merdeka"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center min-h-[44px] rounded-2xl px-4 text-sm font-black transition-all active:scale-[0.98] ${
                pathname === "/promo-merdeka"
                  ? "text-red-700 bg-red-50 border border-red-200 shadow-sm"
                  : "text-red-700 bg-red-50 hover:bg-red-100 border border-red-100"
              }`}
            >
              Promo Kemerdekaan -17%
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                trackWhatsApp("/?wa=open&source=navbar_mobile&text=Halo%20AndisLab,%20saya%20ingin%20konsultasi%20produk.");
                window.open(waMeUrl("Halo AndisLab, saya ingin konsultasi produk."), "_blank", "noopener,noreferrer");
              }}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all mt-3 border border-white/20"
            >
              <Phone className="h-4 w-4" />
              <span>Hubungi Sales Sekarang</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openLeadMagnet();
              }}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 px-4 py-3 text-sm font-black text-indigo-700 active:scale-[0.98] transition-all mt-2 border border-indigo-200"
            >
              <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">↓</span>
              <span>Unduh e-Katalog 2026</span>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed navbar + top bar */}
      <div style={{ height: pathname !== "/promo-merdeka" ? "128px" : "96px" }} />

      {/* RFQ Cart Drawer */}
      <RFQCartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
