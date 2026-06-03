"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, X, Loader2, LogOut, UploadCloud } from "lucide-react";
import { formatRupiah } from "@/lib/products";
import { deleteProduct, createProduct, updateProduct, logoutAction } from "./actions";
import type { Product as PrismaProduct } from "@prisma/client";

export default function AdminClient({ initialProducts }: { initialProducts: PrismaProduct[] }) {
  const [products, setProducts] = useState<PrismaProduct[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    id: "",
    name: "",
    price: 0,
    category: "lovibond",
    categoryLabel: "Lovibond",
    model: "",
    image: "",
    description: "",
  });

  const handleOpenModal = (product?: PrismaProduct) => {
    if (product) {
      setIsEditing(true);
      setFormData({
        ...product,
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: "",
        name: "",
        price: 0,
        category: "lovibond",
        categoryLabel: "Lovibond",
        model: "",
        image: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    
    // Optimistic UI update
    setProducts(products.filter(p => p.id !== id));
    
    const res = await deleteProduct(id);
    if (!res.success) {
      alert(res.error);
      // Revert if failed
      setProducts(initialProducts);
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
        setFormData({ ...formData, image: data.url });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (isEditing) {
      const res = await updateProduct(formData.id, formData);
      if (res.success) {
        setProducts(products.map(p => p.id === formData.id ? { ...p, ...formData } : p));
        handleCloseModal();
      } else {
        alert(res.error);
      }
    } else {
      const res = await createProduct(formData);
      if (res.success) {
        // Just reload the page to get the new product with proper ID and dates from DB
        window.location.reload();
      } else {
        alert(res.error);
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Kelola data produk Anda di sini.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Tambah Produk
          </button>
          <form action={logoutAction}>
            <button 
              type="submit"
              className="flex items-center justify-center gap-2 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg font-semibold hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Produk</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Belum ada produk di database.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <span className="text-xs font-bold text-slate-400">NO IMG</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {product.categoryLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-slate-900">
                {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Nama Produk</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Contoh: BOD Incubator"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Harga (Rp)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Contoh: 35000000"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Model/Tipe</label>
                  <input 
                    type="text" 
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Kategori ID</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="lovibond">lovibond</option>
                    <option value="daihan-labtech">daihan-labtech</option>
                    <option value="pyrex">pyrex</option>
                    <option value="andislab-custom">andislab-custom</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Label Kategori</label>
                  <input 
                    type="text" 
                    value={formData.categoryLabel}
                    onChange={(e) => setFormData({...formData, categoryLabel: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Gambar Produk</label>
                  
                  {formData.image && (
                    <div className="mb-2 relative w-24 h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                      <Image src={formData.image} alt="Preview" fill className="object-contain p-1" />
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-slate-300 rounded-xl px-4 py-6 hover:bg-slate-50 hover:border-blue-400 cursor-pointer transition-colors">
                      {isUploading ? (
                        <>
                          <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                          <span className="text-sm text-slate-500 font-medium">Mengupload...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-6 w-6 text-slate-400" />
                          <span className="text-sm text-slate-600 font-medium">Upload File Gambar</span>
                          <span className="text-xs text-slate-400">Atau masukkan URL di bawah</span>
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
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      placeholder="Atau paste URL gambar di sini (https://...)"
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Deskripsi Panjang</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-slate-100">
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
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                  {isEditing ? "Simpan Perubahan" : "Tambah Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
