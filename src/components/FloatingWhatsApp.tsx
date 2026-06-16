"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function FloatingWhatsApp() {
  return (
    <Link
      href="?wa=open&source=floating_widget&text=Halo%20AndisLab%2C%20saya%20butuh%20bantuan%20dan%20ingin%20bertanya."
      className="fixed bottom-24 right-6 z-[49] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-green-500/30 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
      aria-label="Hubungi kami via WhatsApp"
      scroll={false}
    >
      <MessageCircle className="h-7 w-7" />
      {/* Pulsing effect */}
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
      </span>
    </Link>
  );
}
