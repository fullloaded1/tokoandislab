"use client";

import React from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import PromoWaLink from "./PromoWaLink";
import { HERO_SPH_MESSAGE } from "@/lib/promo-akhir-tahun";

interface MobileStickyCtaProps {
  promoPhase?: string;
}

export default function MobileStickyCta({ promoPhase = "active" }: MobileStickyCtaProps) {
  return (
    <div className="fixed bottom-6 left-4 z-40 sm:hidden pointer-events-auto">
      <PromoWaLink
        message={HERO_SPH_MESSAGE}
        promoPhase={promoPhase}
        placement="mobile_sticky"
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 shadow-xl shadow-blue-900/40 border border-white/20 active:scale-95 transition-transform"
      >
        <MessageSquare className="w-4 h-4 shrink-0 text-cyan-300" />
        <span className="text-xs font-black tracking-tight">Minta SPH Promo</span>
      </PromoWaLink>
    </div>
  );
}
