"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, X, Send, User, Bot, Loader2, MinusCircle, Wrench, Sparkles, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Lottie from "lottie-react";
import robotAnimation from "../../public/images/animas/animasi.json";
import { useWhatsAppLeadStore } from "@/store/useWhatsAppLeadStore";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [agent, setAgent] = useState<'sales' | 'tech'>('sales');
  const [transport] = useState(() => new DefaultChatTransport({ api: '/api/chat' }));
  const { messages, sendMessage, status, error, setMessages } = useChat({ transport });
  const isLoading = status === "streaming" || status === "submitted";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const openWaModal = useWhatsAppLeadStore((s) => s.openModal);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Button - UI/UX Pro Max 56px touch safe */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-[92px] right-4 sm:right-6 z-[55] flex min-h-[56px] items-center gap-2.5 px-6 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 text-white shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-105 active:scale-95 group origin-bottom-right border border-emerald-400/30 ${
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
        aria-label="Tanya AndisBot"
      >
        <div className="w-8 h-8 -ml-2 drop-shadow-md">
          <Lottie animationData={robotAnimation} loop={true} />
        </div>
        <span className="font-extrabold text-sm tracking-tight">Tanya AI Assistant</span>
        
        {/* Pulsing indicator */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-4 sm:right-6 z-[80] flex flex-col w-[350px] sm:w-[400px] h-[520px] max-h-[85vh] rounded-3xl bg-white shadow-2xl border border-slate-200 transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 text-white rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm overflow-hidden p-1 shadow-inner border border-white/20">
              <Lottie animationData={robotAnimation} loop={true} className="w-full h-full" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">AndisBot</h3>
              <p className="text-xs text-emerald-100 font-medium">Asisten AI AndisLab</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Kecilkan jendela chat"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all"
          >
            <MinusCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Agent Selector */}
        <div className="flex bg-white border-b border-slate-100 p-2 gap-2 shadow-xs relative z-10">
          <button
            onClick={() => { setAgent('sales'); setMessages([]); }}
            className={`flex-1 flex min-h-[44px] items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black transition-all ${
              agent === 'sales'
                ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300 shadow-2xs'
                : 'text-slate-500 hover:bg-slate-50 font-semibold'
            }`}
          >
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>Sales & CS</span>
          </button>
          <button
            onClick={() => { setAgent('tech'); setMessages([]); }}
            className={`flex-1 flex min-h-[44px] items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black transition-all ${
              agent === 'tech'
                ? 'bg-teal-50 text-teal-800 ring-1 ring-teal-300 shadow-2xs'
                : 'text-slate-500 hover:bg-slate-50 font-semibold'
            }`}
          >
            <Wrench className="h-4 w-4 text-teal-600" />
            <span>Teknisi Lab</span>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center h-full pt-6 pb-4 space-y-5">
              <div className="flex flex-col items-center text-center space-y-3 opacity-95">
                <div className={`p-4 rounded-2xl shadow-xs border ${agent === 'sales' ? 'bg-emerald-100/80 border-emerald-200' : 'bg-teal-100/80 border-teal-200'}`}>
                  {agent === 'sales' ? <Bot className="h-8 w-8 text-emerald-700" /> : <Wrench className="h-8 w-8 text-teal-700" />}
                </div>
                <div>
                  <p className="font-black text-slate-900">
                    Halo! Saya {agent === 'sales' ? 'Sales AndisBot 👋' : 'Teknisi AndisBot 🔧'}
                  </p>
                  <p className="text-xs font-medium text-slate-600 max-w-[250px] mt-1 leading-relaxed">
                    {agent === 'sales' 
                      ? 'Tanya apa saja tentang rekomendasi produk, stok, atau harga.' 
                      : 'Tanya panduan penggunaan, spesifikasi teknis, atau troubleshooting.'}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-2 w-full px-1 mt-auto">
                <p className="text-xs font-black text-slate-500 mb-1 ml-1">Coba tanyakan:</p>
                {(agent === 'sales' ? [
                  "Bantu carikan Incubator terbaik",
                  "Bagaimana cara minta penawaran harga?",
                  "Apakah ada Water Bath Daihan?"
                ] : [
                  "Apa bedanya spesifikasi Oven dan Incubator?",
                  "Bagaimana cara kalibrasi alat ukur?",
                  "Berapa lama garansi standar alat AndisLab?"
                ]).map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      sendMessage(
                        { text: suggestion },
                        { body: { agent } }
                      )
                    }
                    className="flex min-h-[44px] items-center justify-between w-full text-left p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400 hover:shadow-xs transition-all group active:scale-[0.99]"
                  >
                    <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{suggestion}</span>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-1 ${
                    m.role === "user"
                      ? "bg-slate-200 text-slate-700 font-bold"
                      : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {m.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    agent === 'sales' ? <Bot className="h-4 w-4" /> : <Wrench className="h-4 w-4" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold rounded-tr-none shadow-xs"
                      : "bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-xs font-medium"
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        a: ({ node, href, children, ...props }) => {
                          const finalHref = href || "";
                          if (finalHref.includes("wa.me") || finalHref.includes("wa-redirect")) {
                            return (
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  let text = "";
                                  try {
                                    const urlObj = new URL(finalHref.startsWith("http") ? finalHref : `http://localhost${finalHref}`);
                                    text = urlObj.searchParams.get("text") || "";
                                  } catch {}
                                  openWaModal({
                                    source: "chatbot",
                                    text
                                  });
                                }}
                                className={m.role === 'user' ? "text-emerald-100 font-bold underline hover:text-white" : "text-emerald-700 font-bold underline hover:text-emerald-900"} 
                              >
                                {children}
                              </button>
                            );
                          }
                          return (
                            <a 
                              {...props} 
                              href={finalHref}
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={m.role === 'user' ? "text-emerald-100 font-bold underline hover:text-white" : "text-emerald-700 font-bold underline hover:text-emerald-900"} 
                            >
                              {children}
                            </a>
                          );
                        },
                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                        li: ({ node, ...props }) => <li className="mb-0.5" {...props} />,
                      }}
                    >
                      {m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n') || ''}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-3 flex-row">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-1 bg-emerald-100 text-emerald-700 border border-emerald-200">
                {agent === 'sales' ? <Bot className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
              </div>
              <div className="max-w-[75%] rounded-2xl px-4 py-3 text-sm font-semibold bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-xs flex items-center gap-2.5">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                <span>AndisBot sedang merumuskan jawaban...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center text-center p-4 bg-amber-50 rounded-2xl border border-amber-200 mt-4 mx-2 shadow-2xs">
              <span className="text-amber-800 font-black text-sm mb-1">Sistem Sedang Sibuk</span>
              <p className="text-amber-900 font-medium text-xs mb-3 leading-relaxed">
                Mohon maaf, asisten AI kami sedang melayani banyak klien atau telah mencapai batas. 
                Untuk respon yang lebih cepat, Anda bisa langsung terhubung dengan tim kami!
              </p>
              <button 
                onClick={() => openWaModal({ source: "chatbot_error", text: "Halo AndisLab, saya butuh bantuan karena sistem sedang sibuk." })}
                className="min-h-[44px] bg-[#25D366] hover:bg-[#1ebd5b] text-white font-black py-2.5 px-6 rounded-xl text-xs transition-all active:scale-95 shadow-sm"
              >
                <span>Tanya via WhatsApp &rarr;</span>
              </button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 rounded-b-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim() || isLoading) return;
              sendMessage(
                { text: input },
                { body: { agent } }
              );
              setInput("");
            }}
            className="flex min-h-[48px] items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-1.5 pr-2 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-600 focus-within:bg-white transition-all shadow-2xs"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaan Anda..."
              className="flex-1 bg-transparent px-3 py-2 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Kirim pesan"
              className="flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white transition-all hover:from-emerald-500 hover:to-teal-600 active:scale-90 disabled:opacity-40 disabled:hover:from-emerald-600 shadow-2xs"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
