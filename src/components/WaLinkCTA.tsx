"use client";

import { trackWhatsApp } from "@/lib/track";
import { ReactNode } from "react";

interface WaLinkCTAProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export default function WaLinkCTA({ href, className, children }: WaLinkCTAProps) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        trackWhatsApp(href);
      }}
      className={className}
    >
      {children}
    </a>
  );
}
