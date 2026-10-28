"use client";

import React from "react";
import { trackEvent } from "@/lib/analytics";
import { buildPromoWaUrl } from "@/lib/promo-akhir-tahun";

interface PromoWaLinkProps {
  message: string;
  productName?: string;
  productModel?: string;
  catalogId?: string;
  catalogName?: string;
  promoPhase?: string;
  placement?: string;
  className?: string;
  children: React.ReactNode;
}

export default function PromoWaLink({
  message,
  productName,
  productModel,
  catalogId,
  catalogName,
  promoPhase = "active",
  placement = "button",
  className,
  children,
}: PromoWaLinkProps) {
  const waUrl = buildPromoWaUrl(message);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      trackEvent("promo_whatsapp_click", {
        product_name: productName,
        product_model: productModel,
        catalog_id: catalogId,
        catalog_name: catalogName,
        promo_phase: promoPhase,
        placement,
        wa_url: waUrl,
      });

      trackEvent("generate_lead", {
        item_id: productModel || catalogId || "promo-akhir-tahun-2026",
        item_name: productName || catalogName || "Promo Akhir Tahun 2026",
        lead_source: "product_cta",
      });
    } catch (err) {
      console.debug("Failed to track promo WA click", err);
    }
  };

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
