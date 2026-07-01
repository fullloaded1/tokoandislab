"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { MessageCircle, X, Send, User, Bot, Loader2, MinusCircle, Wrench, Sparkles, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Lottie from "lottie-react";
import robotAnimation from "../../public/images/animas/animasi.json";
import { useWhatsAppLeadStore } from "@/store/useWhatsAppLeadStore";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [agent, setAgent] = useState<'sales' | 'tech'>('sales');
  const { messages, sendMessage, status, error, setMessages } = useChat();
  const isLoading = status === "streaming" || status === "submitted";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const openWaModal = useWhatsAppLeadStore((s) => s.openModal);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 items-center gap-2 px-5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 group origin-bottom-right ${
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
        aria-label="Tanya AndisBot"
      >
        <div className="w-8 h-8 -ml-2 drop-shadow-md">
          <Lottie animationData={robotAnimation} loop={true} />
        </div>
        <span className="font-semibold text-sm">Tanya AI Assistant</span>
        
        {/* Pulsing indicator */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex flex-col w-[350px] sm:w-[400px] h-[500px] max-h-[85vh] rounded-3xl bg-white shadow-2xl border border-slate-200 transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm overflow-hidden p-1 shadow-inner">
              <Lottie animationData={robotAnimation} loop={true} className="w-full h-full" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">AndisBot</h3>
              <p className="text-xs text-blue-100">Asisten AI AndisLab</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <MinusCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Agent Selector */}
        <div className="flex bg-white border-b border-slate-100 p-2 gap-2 shadow-sm relative z-10">
          <button
            onClick={() => { setAgent('sales'); setMessages([]); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              agent === 'sales'
                ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Sales & CS
          </button>
          <button
            onClick={() => { setAgent('tech'); setMessages([]); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              agent === 'tech'
                ? 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Wrench className="h-4 w-4" />
            Teknisi Lab
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center h-full pt-8 pb-4 space-y-6">
              <div className="flex flex-col items-center text-center space-y-3 opacity-90">
                <div className={`p-4 rounded-full shadow-sm ${agent === 'sales' ? 'bg-blue-100' : 'bg-cyan-100'}`}>
                  {agent === 'sales' ? <Bot className="h-8 w-8 text-blue-600" /> : <Wrench className="h-8 w-8 text-cyan-600" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    Halo! Saya {agent === 'sales' ? 'Sales AndisBot 👋' : 'Teknisi AndisBot 🔧'}
                  </p>
                  <p className="text-sm text-slate-500 max-w-[250px] mt-1">
                    {agent === 'sales' 
                      ? 'Tanya apa saja tentang rekomendasi produk, stok, atau harga.' 
                      : 'Tanya panduan penggunaan, spesifikasi teknis, atau troubleshooting.'}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-2 w-full px-2 mt-auto">
                <p className="text-xs font-medium text-slate-400 mb-1 ml-1">Coba tanyakan:</p>
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
                        { role: 'user', parts: [{ type: 'text', text: suggestion }] },
                        { body: { agent } }
                      )
                    }
                    className="flex items-center justify-between w-full text-left p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                  >
                    <span className="text-sm text-slate-700 group-hover:text-blue-700 transition-colors">{suggestion}</span>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
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
                      ? "bg-slate-200 text-slate-600"
                      : "bg-blue-100 text-blue-600"
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
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm"
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
                                className={m.role === 'user' ? "text-blue-200 underline hover:text-white" : "text-blue-600 underline hover:text-blue-800"} 
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
                              className={m.role === 'user' ? "text-blue-200 underline hover:text-white" : "text-blue-600 underline hover:text-blue-800"} 
                            >
                              {children}
                            </a>
                          );
                        },
                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
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
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-1 bg-blue-100 text-blue-600">
                {agent === 'sales' ? <Bot className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
              </div>
              <div className="max-w-[75%] rounded-2xl px-4 py-3 text-sm bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                AndisBot sedang mengetik...
              </div>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center text-center p-4 bg-orange-50 rounded-xl border border-orange-200 mt-4 mx-2">
              <span className="text-orange-600 font-semibold mb-1">Sistem Sedang Sibuk</span>
              <p className="text-orange-800 text-sm mb-3">
                Mohon maaf, asisten AI kami sedang melayani banyak klien atau telah mencapai batas. 
                Untuk respon yang lebih cepat, Anda bisa langsung terhubung dengan tim kami!
              </p>
              <button 
                onClick={() => openWaModal({ source: "chatbot_error", text: "Halo AndisLab, saya butuh bantuan karena sistem sedang sibuk." })}
                className="bg-[#25D366] hover:bg-[#1ebd5b] text-white font-semibold py-2 px-5 rounded-full text-sm transition-colors shadow-sm"
              >
                Tanya via WhatsApp
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
                { role: 'user', parts: [{ type: 'text', text: input }] },
                { body: { agent } }
              );
              setInput("");
            }}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1 pr-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pesan..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
