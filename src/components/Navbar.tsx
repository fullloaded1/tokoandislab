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
  FlaskConical,
} from "lucide-react";
import { useRFQStore } from "@/store/useRFQStore";
import RFQCartDrawer from "./RFQCartDrawer";
import { useWhatsAppLeadStore } from "@/store/useWhatsAppLeadStore";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/katalog", label: "Katalog" },
  { href: "/ready-stock", label: "Ready Stock" },
  { href: "/pemerintah", label: "Pemerintah / B2B" },
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/artikel", label: "Artikel" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isCartOpen: cartOpen, setCartOpen, items } = useRFQStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const openWaModal = useWhatsAppLeadStore((s) => s.openModal);

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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass shadow-lg shadow-black/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image src="/logo.png" alt="AndisLab Logo" width={160} height={56} className="h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105" priority />
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    pathname === link.href
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200"
                aria-label="Cari produk"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200"
                aria-label="Keranjang RFQ"
              >
                <ShoppingCart className="h-[18px] w-[18px]" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-1.5 text-[10px] font-bold text-white shadow-md">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* CTA */}
              <a
                href="/?wa=open&source=navbar_desktop&text=Halo%20AndisLab,%20saya%20ingin%20konsultasi%20produk."
                onClick={(e) => {
                  e.preventDefault();
                  openWaModal({
                    source: "navbar_desktop",
                    text: "Halo AndisLab, saya ingin konsultasi produk."
                  });
                }}
                className="ml-2 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Phone className="h-4 w-4" />
                Hubungi Sales
              </a>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500"
                aria-label="Cari"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500"
                aria-label="Keranjang RFQ"
              >
                <ShoppingCart className="h-[18px] w-[18px]" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-1.5 text-[10px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
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
                placeholder="Cari produk laboratorium..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                autoFocus={searchOpen}
              />
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-4 pt-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/?wa=open&source=navbar_mobile&text=Halo%20AndisLab,%20saya%20ingin%20konsultasi%20produk."
              onClick={(e) => {
                e.preventDefault();
                openWaModal({
                  source: "navbar_mobile",
                  text: "Halo AndisLab, saya ingin konsultasi produk."
                });
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white mt-2"
            >
              <Phone className="h-4 w-4" />
              Hubungi Sales
            </a>
          </div>
        </div>
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      {/* RFQ Cart Drawer */}
      <RFQCartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
