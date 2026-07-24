"use client";

import { useEffect, useState, Suspense } from "react";
import { useWhatsAppLeadStore } from "@/store/useWhatsAppLeadStore";
import { X, Send, Phone, User, Building, Loader2, ArrowRight, MessageCircle } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { waMeUrl } from "@/lib/contact";

function WhatsAppLeadModalInner() {
  const { isOpen, source, text, productId, productName, inquiryNo, openModal, closeModal } = useWhatsAppLeadStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [phone, setPhone] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Logic for wa=open URL trigger has been removed to prevent unwanted URL indexing.

  // 2. Load cached lead info if present
  useEffect(() => {
    if (isOpen) {
      const savedName = localStorage.getItem("lead_name") || "";
      const savedInst = localStorage.getItem("lead_institution") || "";
      const savedPhone = localStorage.getItem("lead_phone") || "";
      setName(savedName);
      setInstitution(savedInst);
      setPhone(savedPhone);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !institution.trim() || !phone.trim()) return;

    setIsLoading(true);

    // Cache info if rememberMe is checked
    if (rememberMe) {
      localStorage.setItem("lead_name", name.trim());
      localStorage.setItem("lead_institution", institution.trim());
      localStorage.setItem("lead_phone", phone.trim());
    } else {
      localStorage.removeItem("lead_name");
      localStorage.removeItem("lead_institution");
      localStorage.removeItem("lead_phone");
    }

    try {
      const response = await fetch("/api/wa-redirect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          text,
          productId,
          productName,
          inquiryNo,
          leadName: name.trim(),
          leadInstitution: institution.trim(),
          leadPhone: phone.trim(),
        }),
      });

      const data = await response.json();
      
      if (data.redirectUrl) {
        if (typeof window !== "undefined") {
          (window as any).gtag?.('event', 'whatsapp_click', { wa_source: source, form_completed: true });
        }
        window.open(data.redirectUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Lead submission error:", err);
      // Fallback directly to WA on error
      const fallbackUrl = waMeUrl(text);
      if (typeof window !== "undefined") {
        (window as any).gtag?.('event', 'whatsapp_click', { wa_source: source, form_completed: true, error: true });
      }
      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      // Just hit GET via fetch in background to log anonymous click
      const query = new URLSearchParams({
        source,
        text,
      });
      if (productId) query.append("productId", productId);
      if (productName) query.append("productName", productName);
      if (inquiryNo) query.append("inquiryNo", inquiryNo);

      await fetch(`/api/wa-redirect?${query.toString()}`, { method: "GET" });
    } catch (err) {
      console.error("Skip log error:", err);
    } finally {
      setIsLoading(false);
      closeModal();
      
      if (typeof window !== "undefined") {
        (window as any).gtag?.('event', 'whatsapp_click', { wa_source: source, form_completed: false });
      }
      
      // Redirect immediately
      const redirectUrl = waMeUrl(text);
      window.open(redirectUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
          <button 
            onClick={closeModal}
            aria-label="Tutup"
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 mb-3 border border-white/10">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold">Mulai Konsultasi Sales</h2>
          <p className="text-xs text-blue-100 mt-1">
            Bantu kami melayani Anda lebih cepat dengan mengisi identitas singkat di bawah ini.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-semibold"
                placeholder="Contoh: Budi Santoso"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Instansi / Perusahaan *</label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input 
                required
                type="text" 
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-semibold"
                placeholder="Contoh: Universitas Indonesia / Kimia Farma"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nomor WhatsApp Anda *</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input 
                required
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-semibold"
                placeholder="Contoh: 08123456789"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input 
              type="checkbox" 
              id="remember_me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-slate-200 rounded focus:ring-blue-500"
            />
            <label htmlFor="remember_me" className="text-xs font-semibold text-slate-500 cursor-pointer select-none">
              Simpan identitas saya untuk kunjungan berikutnya
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-2.5">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-75 cursor-pointer text-sm"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Lanjutkan ke WhatsApp
            </button>

            <button
              type="button"
              onClick={handleSkip}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 font-semibold py-2.5 transition-colors cursor-pointer"
            >
              Lompati &amp; Hubungi Langsung
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default function WhatsAppLeadModal() {
  return (
    <Suspense fallback={null}>
      <WhatsAppLeadModalInner />
    </Suspense>
  );
}
