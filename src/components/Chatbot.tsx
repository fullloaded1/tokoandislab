"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { MessageCircle, X, Send, User, Bot, Loader2, MinusCircle } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();
  const isLoading = status === "streaming" || status === "submitted";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/30 transition-transform duration-300 hover:scale-110 ${
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
        aria-label="Tanya AndisBot"
      >
        <MessageCircle className="h-6 w-6" />
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Bot className="h-6 w-6 text-white" />
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

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-70">
              <div className="bg-white p-4 rounded-full shadow-sm">
                <Bot className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-700">Halo! Saya AndisBot 👋</p>
                <p className="text-sm text-slate-500 max-w-[250px] mt-1">
                  Tanya apa saja tentang spesifikasi, rekomendasi, atau harga alat lab kami.
                </p>
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
                    <Bot className="h-4 w-4" />
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
                  {/* Basic markdown parsing (very simple) */}
                  {(m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n') || '').split("\n").map((line: string, i: number) => {
                    if (line.startsWith("- ")) {
                      return <li key={i} className="ml-4 list-disc">{line.substring(2)}</li>;
                    }
                    if (line.trim() === "") return <br key={i} />;
                    return <p key={i}>{line}</p>;
                  })}
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-3 flex-row">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-1 bg-blue-100 text-blue-600">
                <Bot className="h-4 w-4" />
              </div>
              <div className="max-w-[75%] rounded-2xl px-4 py-3 text-sm bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                AndisBot sedang mengetik...
              </div>
            </div>
          )}
          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg border border-red-200 mt-2">
              Terjadi kesalahan: {error.message || "Gagal menghubungi server"}
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
              sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] });
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
