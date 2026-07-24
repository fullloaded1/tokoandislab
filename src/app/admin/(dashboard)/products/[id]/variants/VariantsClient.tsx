"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, X, ArrowLeft, PackagePlus, Activity } from "lucide-react";
import Link from "next/link";
import { createVariant, updateVariant, deleteVariant, adjustStockVariant } from "./actions";
import { money } from "@/lib/money";
import { StockLogType } from "@prisma/client";
import { useToast } from "@/components/Toast";

export default function VariantsClient({ initialVariants, product }: { initialVariants: any[], product: any }) {
  const [variants, setVariants] = useState(initialVariants);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  
  // Data untuk Varian (CRUD)
  const [formData, setFormData] = useState({
    id: "",
    sku: "",
    name: "",
    price: 0,
    stock: 0, // Hanya dipakai saat tambah varian (Initial Stock)
  });

  // Data untuk Penyesuaian Stok
  const [stockData, setStockData] = useState<{
    variantId: string;
    variantName: string;
    type: StockLogType;
    quantity: number;
    notes: string;
  }>({
    variantId: "",
    variantName: "",
    type: StockLogType.IN,
    quantity: 1,
    notes: ""
  });

  const handleOpenModal = (variant?: any) => {
    if (variant) {
      setIsEditing(true);
      setFormData({
        id: variant.id,
        sku: variant.sku,
        name: variant.name,
        price: money.toDecimal(variant.price).toNumber(),
        stock: 0, // Tidak bisa edit stok langsung, harus lewat adjust
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: "",
        sku: `${product.model}-V1`,
        name: "",
        price: 0,
        stock: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenStockModal = (variant: any) => {
    setStockData({
      variantId: variant.id,
      variantName: variant.name,
      type: StockLogType.IN,
      quantity: 1,
      notes: ""
    });
    setIsStockModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus varian ini?")) return;
    setIsLoading(true);
    const res = await deleteVariant(id);
    if (res.success) {
      setVariants(variants.filter(v => v.id !== id));
      showToast("Varian berhasil dihapus", "success");
    } else {
      showToast(res.error || "Gagal menghapus", "error");
    }
    setIsLoading(false);
  };

  const handleSubmitVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (isEditing) {
      const res = await updateVariant(formData.id, formData);
      if (res.success) {
        showToast("Varian diperbarui", "success");
        window.location.reload();
      } else {
        showToast(res.error || "Gagal", "error");
      }
    } else {
      const res = await createVariant({ ...formData, productId: product.id });
      if (res.success) {
        showToast("Varian ditambahkan", "success");
        window.location.reload();
      } else {
        showToast(res.error || "Gagal", "error");
      }
    }
    setIsLoading(false);
  };

  const handleSubmitStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await adjustStockVariant(
      stockData.variantId, 
      Number(stockData.quantity), 
      stockData.type, 
      stockData.notes
    );
    if (res.success) {
      showToast("Stok berhasil diupdate", "success");
      window.location.reload();
    } else {
      showToast(res.error || "Gagal update stok", "error");
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Kelola Varian & Stok</h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <span className="font-bold text-slate-700">{product.name}</span>
              <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-600">{product.brand}</span>
            </p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="mt-4 sm:mt-0 flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Tambah Varian
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Varian (SKU)</th>
                <th className="px-6 py-4 text-right">Harga</th>
                <th className="px-6 py-4 text-center">Stok Fisik</th>
                <th className="px-6 py-4 text-center">Di-booking</th>
                <th className="px-6 py-4 text-center">Tersedia</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {variants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Produk ini belum memiliki varian.
                  </td>
                </tr>
              ) : (
                variants.map((v) => {
                  const available = v.stock - v.reservedStock;
                  return (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{v.name}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{v.sku}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-900">
                        {money.formatIDR(money.toDecimal(v.price).toNumber())}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-800">
                        {v.stock}
                      </td>
                      <td className="px-6 py-4 text-center text-amber-600 font-semibold">
                        {v.reservedStock}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {available > 0 ? available : 'Habis'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenStockModal(v)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1"
                            title="Update Stok (IN/OUT)"
                          >
                            <PackagePlus className="h-4 w-4" /> <span className="text-xs font-bold">Stok</span>
                          </button>
                          <button 
                            onClick={() => handleOpenModal(v)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(v.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD Varian */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {isEditing ? "Edit Varian" : "Tambah Varian Baru"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitVariant} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Nama Varian</label>
                <input 
                  required type="text" value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Misal: 500ml / Box isi 100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">SKU (Kode Unik)</label>
                <input 
                  required type="text" value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Harga Jual (Rp)</label>
                <input 
                  required type="number" value={formData.price} min={0}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              {!isEditing && (
                <div className="space-y-1 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <label className="text-sm font-bold text-amber-800">Stok Awal Fisik</label>
                  <p className="text-xs text-amber-700 mb-2">Stok fisik yang ada di gudang saat ini. Akan tercatat sebagai histori (IN).</p>
                  <input 
                    required type="number" value={formData.stock} min={0}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                    className="w-full border border-amber-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100">Batal</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Adjust Stock */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                Update Stok / Ledger
              </h2>
              <button onClick={() => setIsStockModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitStock} className="p-6 space-y-4">
              <div className="mb-4">
                <p className="text-sm text-slate-500">Varian Target</p>
                <p className="font-bold text-lg text-slate-900">{stockData.variantName}</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Tipe Pergerakan Stok</label>
                <select 
                  value={stockData.type}
                  onChange={(e) => setStockData({...stockData, type: e.target.value as StockLogType})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                >
                  <option value={StockLogType.IN}>Stok Masuk (IN) - Tambah Stok</option>
                  <option value={StockLogType.OUT}>Stok Keluar (OUT) - Kurangi Stok (Rusak/Hilang)</option>
                  <option value={StockLogType.ADJUST}>Koreksi Absolut (ADJUST) - Set ke Angka Pasti</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Jumlah (Qty)</label>
                <input 
                  required type="number" min={0} value={stockData.quantity}
                  onChange={(e) => setStockData({...stockData, quantity: Number(e.target.value)})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-xl font-bold font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Catatan / Alasan (Opsional)</label>
                <input 
                  type="text" value={stockData.notes}
                  onChange={(e) => setStockData({...stockData, notes: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="Misal: Restock dari gudang utama / Barang rusak"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 mt-4">
                <strong>Catatan Audit:</strong> Semua perubahan ini akan dicatat ke dalam database (StockLog) secara permanen dan tidak bisa dihapus untuk menjaga keamanan stok.
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsStockModalOpen(false)} className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100">Batal</button>
                <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-lg font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50">Eksekusi Stok</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
