"use client";

import { trackWhatsApp } from "@/lib/track";
import { ReactNode } from "react";

interface WaLinkCTAProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export default function WaLinkCTA({ href, className, children }: WaLinkCTAProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    trackWhatsApp(href);
    
    // Parse the href to extract text
    let text = "";
    if (href.includes("text=")) {
      const match = href.match(/text=([^&]*)/);
      if (match && match[1]) {
        text = decodeURIComponent(match[1]);
      }
    }
    
    const waNumber = "6285973211179";
    const waUrl = `https://wa.me/${waNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
}
