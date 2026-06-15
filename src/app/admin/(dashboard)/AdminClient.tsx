"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Edit, Trash2, X, Loader2, UploadCloud, FileSpreadsheet, Download, Layers } from "lucide-react";
import { money } from "@/lib/money";
import { deleteProduct, createProduct, updateProduct, bulkCreateProducts } from "./actions";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { Product as PrismaProduct } from "@prisma/client";

export default function AdminClient({ initialProducts }: { initialProducts: PrismaProduct[] }) {
  const [products, setProducts] = useState<PrismaProduct[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    id: "",
    name: "",
    price: 0,
    category: "lovibond",
    categoryLabel: "Lovibond",
    model: "",
    image: "",
    description: "",
    isReadyStock: false,
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
        isReadyStock: false,
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

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setBulkLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const res = await bulkCreateProducts(results.data);
          if (res.success) {
            alert(`Berhasil mengupload ${res.count} produk!`);
            window.location.reload();
          } else {
            alert(res.error);
          }
        } catch (error) {
          console.error(error);
          alert("Gagal mengupload CSV");
        } finally {
          setBulkLoading(false);
          setIsBulkModalOpen(false);
        }
      },
      error: (error) => {
        alert("Gagal membaca file CSV: " + error.message);
        setBulkLoading(false);
      }
    });
  };

  const downloadTemplate = () => {
    const template = [
      ["name", "price", "category", "categoryLabel", "brand", "model", "subcategory", "description", "image"],
      ["Photometer MD 100", "15000000", "lovibond", "Water Testing", "Lovibond", "MD100", "Photometer", "Alat uji kualitas air", "https://url-gambar.com/img.png"],
    ];
    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "template_upload_produk.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    // Format for E-Katalog LKPP
    const excelData = products.map((p, index) => ({
      "No": index + 1,
      "Nama Produk": p.name,
      "Merek": p.brand || "-",
      "No. Produk Penyedia": p.model || "-",
      "Unit Pengukuran": "Unit",
      "Jenis Produk": "Impor",
      "Harga Satuan": p.price,
      "Stok": 100, // Dummy stock for LKPP requirement
      "Deskripsi Produk": p.description || "-",
      "Kategori": p.categoryLabel || "-",
      "Link Gambar": p.image || "-"
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data_Produk_LKPP");
    XLSX.writeFile(workbook, "Ekspor_Produk_EKatalog.xlsx");
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
            onClick={exportToExcel}
            className="flex items-center justify-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-green-100 transition-colors border border-green-200"
          >
            <Download className="h-5 w-5" />
            Export E-Katalog
          </button>
          <button 
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <FileSpreadsheet className="h-5 w-5" />
            Upload Massal
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Tambah Produk
          </button>
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
                      {money.formatIDR(product.price)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/products/${product.id}/variants`}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1"
                          title="Kelola Varian & Stok"
                        >
                          <Layers className="h-4 w-4" /> <span className="text-xs font-bold hidden sm:inline">Varian/Stok</span>
                        </Link>
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

                <div className="space-y-1 sm:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <input 
                      type="checkbox"
                      checked={formData.isReadyStock || false}
                      onChange={(e) => setFormData({...formData, isReadyStock: e.target.checked})}
                      className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">Tandai sebagai Ready Stock</span>
                      <span className="text-xs text-slate-500">Produk ini akan muncul di Section Khusus halaman depan.</span>
                    </div>
                  </label>
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
      {/* Bulk Upload Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Upload Massal (CSV)</h2>
              <button 
                onClick={() => setIsBulkModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-bold text-blue-800 mb-2">Panduan Upload:</h3>
                <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
                  <li>Gunakan format file <strong>.csv</strong></li>
                  <li>Pastikan header (baris pertama) sesuai dengan template</li>
                  <li>Kolom wajib: name, price, category</li>
                  <li>Pemisah kolom menggunakan koma (,)</li>
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={downloadTemplate}
                  className="flex items-center justify-center gap-2 w-full border border-slate-200 bg-white text-slate-700 px-4 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  <Download className="h-5 w-5" />
                  Download Template CSV
                </button>

                <div className="relative">
                  <input 
                    type="file" 
                    accept=".csv"
                    onChange={handleBulkUpload}
                    disabled={bulkLoading}
                    id="csv-upload"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className={`flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed ${bulkLoading ? 'border-slate-200 bg-slate-50' : 'border-blue-300 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400'} rounded-xl px-4 py-8 transition-colors`}>
                    {bulkLoading ? (
                      <>
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                        <span className="text-sm font-bold text-slate-600">Memproses Data...</span>
                        <span className="text-xs text-slate-500">Mohon tunggu sebentar</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-8 w-8 text-blue-600" />
                        <span className="text-sm font-bold text-blue-700">Klik atau Drag file CSV ke sini</span>
                        <span className="text-xs text-blue-500">Maksimal ukuran file: 5MB</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
