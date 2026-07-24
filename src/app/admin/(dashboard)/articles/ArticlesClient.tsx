"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Edit, Trash2, X, Loader2, UploadCloud, Search, Eye, BookOpen } from "lucide-react";
import { createArticle, updateArticle, deleteArticle } from "./actions";

interface ArticleProduct {
  id: string;
  name: string;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  category: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  products: ArticleProduct[];
}

interface Product {
  id: string;
  name: string;
  model: string | null;
  categoryLabel: string;
}

export default function ArticlesClient({
  initialArticles,
  products,
}: {
  initialArticles: any[];
  products: Product[];
}) {
  const [articles, setArticles] = useState<Article[]>(initialArticles as Article[]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    excerpt: "",
    content: "",
    image: "",
    category: "edukasi-lab",
    published: true,
    productIds: [] as string[],
  });

  // Filter articles by search term
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter products in the selection list
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (product.model && product.model.toLowerCase().includes(productSearch.toLowerCase())) ||
      product.categoryLabel.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleOpenModal = (article?: Article) => {
    if (article) {
      setIsEditing(true);
      setFormData({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt || "",
        content: article.content,
        image: article.image || "",
        category: article.category || "edukasi-lab",
        published: article.published,
        productIds: article.products.map((p) => p.id),
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: "",
        title: "",
        excerpt: "",
        content: "",
        image: "",
        category: "edukasi-lab",
        published: true,
        productIds: [],
      });
    }
    setProductSearch("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;

    // Optimistic UI update
    const previousArticles = [...articles];
    setArticles(articles.filter((a) => a.id !== id));

    const res = await deleteArticle(id);
    if (!res.success) {
      alert(res.error);
      setArticles(previousArticles);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setIsUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });
      const data = await response.json();
      if (response.ok) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      } else {
        alert("Upload gagal: " + data.error);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Gagal mengupload gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setFormData((prev) => {
      const isSelected = prev.productIds.includes(productId);
      const newProductIds = isSelected
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId];
      return { ...prev, productIds: newProductIds };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isEditing) {
      const res = await updateArticle(formData.id, formData);
      if (res.success) {
        // Refresh articles list
        const updatedArticle = {
          ...res.data,
          products: products
            .filter((p) => formData.productIds.includes(p.id))
            .map((p) => ({ id: p.id, name: p.name })),
        } as any;
        setArticles(articles.map((a) => (a.id === formData.id ? updatedArticle : a)));
        handleCloseModal();
      } else {
        alert(res.error);
      }
    } else {
      const res = await createArticle(formData);
      if (res.success) {
        // Just reload window to fetch fully formatted database objects
        window.location.reload();
      } else {
        alert(res.error);
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 p-6 pb-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Artikel SEO & Panduan</h1>
          <p className="text-slate-500 mt-1">
            Kelola artikel blog untuk meningkatkan SEO dan merekomendasikan produk laboratorium.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Tulis Artikel Baru
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="px-6 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul atau ringkasan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Artikel</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Produk Rekomendasi</th>
                  <th className="px-6 py-4">Tanggal Dibuat</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Belum ada artikel. Klik "Tulis Artikel Baru" untuk membuat artikel pertama Anda.
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-20 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                            {article.image ? (
                              <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <BookOpen className="h-6 w-6 text-slate-400" />
                            )}
                          </div>
                          <div className="max-w-xs md:max-w-md lg:max-w-lg">
                            <p className="font-bold text-slate-900 truncate">{article.title}</p>
                            <p className="text-xs text-slate-400 truncate mt-0.5">/{article.slug}</p>
                            {article.excerpt && (
                              <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                                {article.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                          {article.category === "edukasi-lab" && "Edukasi & Riset"}
                          {article.category === "panduan-alat" && "Panduan Alat"}
                          {article.category === "tips-perawatan" && "Tips & Perawatan"}
                          {article.category === "berita-toko" && "Berita & Event"}
                          {!["edukasi-lab", "panduan-alat", "tips-perawatan", "berita-toko"].includes(article.category) && article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {article.published ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-150">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {article.products.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {article.products.map((p) => (
                              <span
                                key={p.id}
                                className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100"
                              >
                                {p.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Tidak ada</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(article.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/artikel/${article.slug}`}
                            target="_blank"
                            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Pratinjau Halaman"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenModal(article)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Artikel"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Artikel"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal CRUD Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10 shrink-0">
              <h2 className="text-xl font-bold text-slate-900">
                {isEditing ? "Edit Artikel" : "Tulis Artikel Baru"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left side: Main details (Span 2) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Judul Artikel</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Contoh: Mengenal Cara Kerja Spektrofotometer Laboratorium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Ringkasan Singkat (Excerpt) - Berguna untuk SEO Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                      placeholder="Ringkasan singkat maksimal 150 karakter untuk deskripsi pencarian Google."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 flex justify-between">
                      <span>Konten Artikel (Format Markdown Didukung)</span>
                      <span className="text-xs text-slate-400">Gunakan ## untuk subjudul, **tebal**, dsb.</span>
                    </label>
                    <textarea
                      required
                      rows={12}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                      placeholder="## Sub-heading pertama&#10;&#10;Tulis isi paragraf di sini. Spektrofotometer adalah...&#10;&#10;- Poin pertama&#10;- Poin kedua"
                    />
                  </div>
                </div>

                {/* Right side: Image, Publish Status, Recommended Products */}
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Gambar Cover Artikel</label>
                    {formData.image && (
                      <div className="mb-2 relative w-full h-32 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                        <Image
                          src={formData.image}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center justify-center gap-2 w-full border border-dashed border-slate-300 rounded-xl px-4 py-5 hover:bg-slate-50 hover:border-blue-400 cursor-pointer transition-colors">
                        {isUploading ? (
                          <>
                            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                            <span className="text-xs text-slate-500 font-medium">Mengupload...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="h-5 w-5 text-slate-400" />
                            <span className="text-xs text-slate-600 font-medium">Upload File Gambar</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                        placeholder="Atau tempel URL gambar (https://...)"
                      />
                    </div>
                  </div>

                  {/* Kategori Dropdown */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Kategori Artikel</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-xs bg-white"
                    >
                      <option value="edukasi-lab">Edukasi & Riset</option>
                      <option value="panduan-alat">Panduan Alat Lab</option>
                      <option value="tips-perawatan">Tips & Perawatan</option>
                      <option value="berita-toko">Berita & Event</option>
                    </select>
                  </div>

                  {/* Publish Status Toggle */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Status Publikasi</label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">Publikasikan Artikel</span>
                        <span className="text-[10px] text-slate-500">
                          Matikan centang jika ingin menyimpannya sebagai draf.
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Recommended Products Checklist */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex justify-between items-center">
                      <span>Rekomendasi Produk</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                        {formData.productIds.length} terpilih
                      </span>
                    </label>

                    {/* Local Product Search */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Cari produk..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                      />
                    </div>

                    {/* Checklist Container */}
                    <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-48 overflow-y-auto bg-white">
                      {filteredProducts.length === 0 ? (
                        <div className="p-3 text-center text-xs text-slate-400 italic">
                          Produk tidak ditemukan
                        </div>
                      ) : (
                        filteredProducts.map((prod) => {
                          const isChecked = formData.productIds.includes(prod.id);
                          return (
                            <label
                              key={prod.id}
                              className="flex items-start gap-2.5 p-2 hover:bg-slate-50 cursor-pointer text-xs"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleProductSelection(prod.id)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                              />
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-slate-800 truncate">{prod.name}</span>
                                <span className="text-[9px] text-slate-500">
                                  {prod.model ? `${prod.model} | ` : ""}
                                  {prod.categoryLabel}
                                </span>
                              </div>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>

                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-70"
                >
                  {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                  {isEditing ? "Simpan Perubahan" : "Terbitkan Artikel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
