"use client";

import dynamic from "next/dynamic";

const WhatsAppLeadModal = dynamic(() => import("@/components/WhatsAppLeadModal"), { ssr: false });

export default function WhatsAppLeadModalWrapper() {
  return <WhatsAppLeadModal />;
}
