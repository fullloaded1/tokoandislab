"use client";

import { useState } from "react";
import { addKnowledge, deleteKnowledge } from "./actions";
import { Plus, Trash2, Database, Loader2 } from "lucide-react";

export default function KnowledgeClient({ initialData, products }: { initialData: any[]; products: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", productId: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    
    setLoading(true);
    setError("");
    const res = await addKnowledge({
      title: form.title,
      content: form.content,
      productId: form.productId || undefined,
    });
    
    if (res.success) {
      setForm({ title: "", content: "", productId: "" });
      setIsOpen(false);
    } else {
      setError(res.error || "Gagal menambah data.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Database Pengetahuan AI (RAG)</h1>
          <p className="text-sm text-slate-500 mt-1">Tambahkan ekstrak manual book atau brosur agar Chatbot menjadi lebih cerdas.</p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Tambah Dokumen
        </button>
      </div>

      {isOpen && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Input Dokumen Baru</h2>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Judul Dokumen</label>
              <input
                required
                type="text"
                placeholder="Contoh: Troubleshooting HPLC Agilent 1200"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Terkait Produk (Opsional)</label>
              <select
                value={form.productId}
                onChange={(e) => setForm({ ...form, productId: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Pilih Produk (Umum)</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Isi Dokumen (Text)</label>
              <textarea
                required
                rows={6}
                placeholder="Paste isi brosur atau buku manual di sini. AI akan membaca teks ini saat klien bertanya tentang topik terkait."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
              >
                Batal
              </button>
              <button
                disabled={loading}
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Proses & Embed Vector
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialData.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Database className="h-10 w-10 mx-auto text-slate-400 mb-3" />
            <p>Database Vector masih kosong.</p>
            <p className="text-sm mt-1">Tambahkan dokumen agar AI memiliki pengetahuan spesifik.</p>
          </div>
        ) : (
          initialData.map((doc) => (
            <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group">
              <button 
                onClick={async () => {
                  if (confirm("Hapus dokumen ini dari vector database?")) {
                    await deleteKnowledge(doc.id);
                  }
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <h3 className="font-bold text-slate-800 pr-6">{doc.title}</h3>
              <div className="text-xs text-slate-500 mt-2 mb-3 bg-slate-100 inline-block px-2 py-1 rounded">
                Vector 768d Generated
              </div>
              <p className="text-sm text-slate-600 line-clamp-4">
                {doc.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
