import { prisma } from "@/lib/db";
import { HardDrive, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function InstalledBasePage() {
  const installedBases = await prisma.installedBase.findMany({
    include: {
      institution: {
        include: { contacts: true }
      },
      product: true,
      reminders: {
        where: { status: "PENDING" },
        orderBy: { dueDate: "asc" }
      }
    },
    orderBy: { installationDate: "desc" }
  });

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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Alat Terpasang (Installed Base)</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau alat yang sudah diinstal di instansi untuk kebutuhan maintenance dan up-selling.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {installedBases.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
            <HardDrive className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Belum ada alat yang terpasang.</p>
            <p className="text-sm text-slate-400 mt-1">Alat akan muncul di sini setelah Project selesai.</p>
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
              </div>

              {base.reminders.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    Rekomendasi Up-Selling
                  </p>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5">
                    <p className="text-[11px] text-amber-800 font-semibold">{base.reminders[0].type}</p>
                    <p className="text-[10px] text-amber-700 mt-0.5">Tawarkan kontrak kalibrasi / reagen baru kepada {base.institution.contacts[0]?.name || 'PIC'}.</p>
                  </div>
                </div>
              )}

              <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                Catat Maintenance
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
