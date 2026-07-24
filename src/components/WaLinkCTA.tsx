/* Hallmark · component: WaLinkCTA · genre: modern-minimal · contrast: pass */
"use client";

import { trackWhatsApp } from "@/lib/track";
import { waMeUrl } from "@/lib/contact";
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
    
    window.open(waMeUrl(text), "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className={`${className || ""} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] rounded-sm transition-all duration-200 ease-[var(--ease-out)] active:scale-[0.98]`}
      type="button"
    >
      {children}
    </button>
  );
}
