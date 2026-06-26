"use client";

import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useWhatsAppLeadStore } from "@/store/useWhatsAppLeadStore";

export default function FloatingWhatsApp() {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const openWaModal = useWhatsAppLeadStore((s) => s.openModal);

  useEffect(() => {
    setMounted(true);
    // Expand every 45 seconds for 5 seconds to grab attention
    const interval = setInterval(() => {
      setExpanded(true);
      setTimeout(() => setExpanded(false), 5000);
    }, 45000);
    
    // Auto-expand on first visit after 5 seconds
    const initialTimer = setTimeout(() => {
      setExpanded(true);
      setTimeout(() => setExpanded(false), 5000);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-[60] flex items-end justify-end pointer-events-none">
      <button
        onClick={() => openWaModal({ source: "floating_widget", text: "Halo Andis Lab, saya ingin berkonsultasi mengenai alat laboratorium." })}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className="group pointer-events-auto relative flex items-center justify-center bg-[#25D366] hover:bg-[#20b858] text-white rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-all duration-500 transform hover:-translate-y-1"
      >
        <div className={`overflow-hidden transition-all duration-500 ease-in-out whitespace-nowrap flex items-center ${expanded ? 'w-48 sm:w-52 px-5' : 'w-14 sm:w-16 h-14 sm:h-16 justify-center'}`}>
          <MessageCircle className={`shrink-0 ${expanded ? 'w-5 h-5 mr-3' : 'w-7 h-7 sm:w-8 sm:h-8'}`} />
          <span className={`font-bold text-sm transition-opacity duration-300 ${expanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
            Tanya Ahli Kami
          </span>
        </div>
        
        {/* Pulse Effect */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
        </span>
      </button>
    </div>
  );
}
