"use client";

import { useState } from "react";
import { HardDrive, AlertTriangle, CheckCircle, Clock, Plus, X, Loader2, Calendar } from "lucide-react";
import Image from "next/image";
import { createInstalledBase, logMaintenance } from "./actions";
import { useToast } from "@/components/Toast";

export default function InstalledBaseClient({
  initialData,
  institutions,
  products
}: {
  initialData: any[];
  institutions: { id: string; name: string }[];
  products: { id: string; name: string; image: string | null }[];
}) {
  const [installedBases, setInstalledBases] = useState(initialData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // Form State
  const [institutionId, setInstitutionId] = useState("");
  const [productId, setProductId] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [installationDate, setInstallationDate] = useState("");
  const [warrantyMonths, setWarrantyMonths] = useState(12);

  const getWarrantyStatus = (expiryDate: Date) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <span className="flex items-center gap-1 text-red-600 font-bold text-xs"><AlertTriangle className="h-3 w-3" /> Habis (Lewat {Math.abs(diffDays)} Hari)</span>;
    } else if (diffDays <= 30) {
      return <span className="flex items-center gap-1 text-yellow-600 font-bold text-xs"><Clock className="h-3 w-3" /> Hampir Habis ({diffDays} Hari)</span>;
    } else {
      return <span className="flex items-center gap-1 text-green-600 font-bold text-xs"><CheckCircle className="h-3 w-3" /> Aktif</span>;
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionId || !productId || !installationDate) return;

    setIsLoading(true);
    try {
      const result = await createInstalledBase({
        institutionId,
        productId,
        serialNumber,
        installationDate,
        warrantyMonths
      });

      if (result.error) {
        showToast(result.error, "error");
        return;
      }

      showToast("Alat terpasang berhasil ditambahkan", "success");
      setInstalledBases([result.data, ...installedBases]);
      setIsAddModalOpen(false);
      
      // Reset form
      setInstitutionId("");
      setProductId("");
      setSerialNumber("");
      setInstallationDate("");
      setWarrantyMonths(12);
    } catch (err) {
      showToast("Terjadi kesalahan sistem", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogMaintenance = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin mencatat maintenance hari ini?")) return;

    try {
      const result = await logMaintenance(id);
      if (result.error) {
        showToast(result.error, "error");
        return;
      }

      showToast("Maintenance berhasil dicatat", "success");
      setInstalledBases(installedBases.map((base) => base.id === id ? result.data : base));
    } catch (err) {
      showToast("Terjadi kesalahan sistem", "error");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Alat Terpasang (Installed Base)</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau alat yang sudah diinstal di instansi untuk kebutuhan maintenance dan up-selling.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Tambah Alat
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {installedBases.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
            <HardDrive className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Belum ada alat yang terpasang.</p>
            <p className="text-sm text-slate-400 mt-1">Klik tombol Tambah Alat untuk memulai.</p>
          </div>
        ) : (
          installedBases.map((base) => (
            <div key={base.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative h-16 w-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                  {base.product.image ? (
                    <Image src={base.product.image} alt={base.product.name} fill className="object-contain p-1" />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">NO IMG</span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm line-clamp-2">{base.product.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">SN: <span className="font-mono text-slate-800">{base.serialNumber || "N/A"}</span></p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Instansi</span>
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{base.institution.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Tgl. Instalasi</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {new Date(base.installationDate).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-xs text-slate-500">Status Garansi</span>
                  {getWarrantyStatus(base.warrantyExpiry)}
                </div>
                {base.lastMaintenance && (
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-500">Maintenance Terakhir</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {new Date(base.lastMaintenance).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                )}
              </div>

              {base.reminders && base.reminders.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    Rekomendasi Up-Selling
                  </p>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5">
                    <p className="text-[11px] text-amber-800 font-semibold">{base.reminders[0].type}</p>
                    <p className="text-[10px] text-amber-700 mt-0.5">Tawarkan kontrak kalibrasi / maintenance kepada {base.institution.contacts?.[0]?.name || 'PIC'}.</p>
                  </div>
                </div>
              )}

              <button 
                onClick={() => handleLogMaintenance(base.id)}
                className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
              >
                Catat Maintenance
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Tambah Alat Terpasang</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-xl">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Pilih Instansi *</label>
                <select 
                  required
                  value={institutionId}
                  onChange={(e) => setInstitutionId(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">-- Pilih Instansi --</option>
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Pilih Produk *</label>
                <select 
                  required
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">-- Pilih Produk --</option>
                  {products.map(prod => (
                    <option key={prod.id} value={prod.id}>{prod.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nomor Seri (S/N)</label>
                <input 
                  type="text" 
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  placeholder="Misal: SN-20230911"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Tanggal Instalasi *</label>
                  <input 
                    required
                    type="date" 
                    value={installationDate}
                    onChange={(e) => setInstallationDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Durasi Garansi (Bulan) *</label>
                  <input 
                    required
                    type="number" 
                    min="1"
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <HardDrive className="h-4 w-4" />}
                  Simpan Alat Terpasang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
