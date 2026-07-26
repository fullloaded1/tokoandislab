'use client';

import { useState, useEffect } from 'react';
import { useLeadMagnetStore } from '@/store/useLeadMagnetStore';
import { X, FileText, Send, User, Building, Phone, Mail, Loader2, ArrowRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import Image from 'next/image';

export default function LeadMagnetModal() {
  const { isOpen, closeModal } = useLeadMagnetStore();
  
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Focus trap and prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset state if closed
      setIsSuccess(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !phone) return;

    setIsLoading(true);

    try {
      // In a real app, this would hit an API to store the lead in database/CRM
      // For now we simulate an API call and fire Google Analytics event
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      trackEvent('generate_lead', {
        lead_source: 'contact_form',
        item_name: 'katalog_pdf'
      });

      // Save user details locally for future
      localStorage.setItem('lead_name', name);
      localStorage.setItem('lead_institution', company);
      localStorage.setItem('lead_phone', phone);
      
      setIsSuccess(true);
      
      // Auto-trigger download (using a dummy PDF path for now)
      const link = document.createElement('a');
      link.href = '/docs/katalog-andislab-2026.pdf';
      link.download = 'Katalog-AndisLab-2026.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Close modal after 3 seconds of success state
      setTimeout(() => {
        closeModal();
      }, 3000);

    } catch (error) {
      console.error('Error submitting lead form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Left Side - Visual / Marketing Copy */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-blue-600 to-cyan-600 p-8 sm:p-10 text-white relative flex flex-col justify-between overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-300 opacity-20 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm border border-white/10">
              <FileText className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl font-black mb-4 leading-tight">
              Unduh e-Katalog Alat Lab 2026
            </h2>
            
            <p className="text-blue-50 text-sm leading-relaxed font-medium mb-8">
              Panduan lengkap pengadaan lebih dari 2.000+ alat lab dengan spesifikasi detail, dukungan layanan kalibrasi, dan integrasi e-Katalog pemerintah.
            </p>

            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm font-semibold text-blue-100">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">✓</div>
                Update Harga Terbaru
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-blue-100">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">✓</div>
                Daftar Merek & Principal
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-blue-100">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">✓</div>
                Panduan Pengadaan Instansi
              </li>
            </ul>
          </div>
          
          {/* Close button for Mobile (since header is hidden/moved) */}
          <button 
            onClick={closeModal}
            className="md:hidden absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-7/12 p-8 sm:p-10 relative bg-white">
          <button 
            onClick={closeModal}
            className="hidden md:flex absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300 min-h-[300px]">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                  <svg className="w-6 h-6 animate-[bounce_1s_ease-in-out_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Terima Kasih!</h3>
              <p className="text-slate-500 font-medium max-w-[280px]">
                Katalog sedang diunduh ke perangkat Anda. Tim spesialis kami siap membantu jika ada pertanyaan.
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Silakan lengkapi data Anda</h3>
                <p className="text-sm text-slate-500 font-medium">Tautan unduhan katalog PDF akan segera diberikan setelah form diisi.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nama Lengkap *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-800 font-semibold transition-all"
                        placeholder="Budi Santoso"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Instansi / Perusahaan *</label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-800 font-semibold transition-all"
                        placeholder="Universitas Indonesia"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nomor WhatsApp *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-800 font-semibold transition-all"
                      placeholder="08123456789"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email (Opsional)</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-800 font-semibold transition-all"
                      placeholder="budi@instansi.co.id"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    Dapatkan Katalog Sekarang
                  </button>
                  <p className="text-center text-[11px] text-slate-400 font-medium mt-4">
                    Dengan mengunduh, Anda setuju untuk dihubungi oleh tim spesialis kami.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
