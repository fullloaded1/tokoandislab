import { prisma } from "@/lib/db";
import { FileText, Building, Calendar, CheckCircle } from "lucide-react";
import Link from "next/link";
import { formatRupiah } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    include: {
      institution: {
        include: { contacts: true }
      },
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW": return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Baru</span>;
      case "QUOTED": return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Quotation Terkirim</span>;
      case "WON": return <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Deal (Project)</span>;
      default: return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Permintaan Penawaran (RFQ)</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola dan pantau semua pengajuan harga dari calon klien.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">No. Inquiry / Tanggal</th>
                <th className="px-6 py-4">Instansi & PIC</th>
                <th className="px-6 py-4">Item Permintaan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    Belum ada permintaan penawaran.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => {
                  const totalEst = inq.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                  
                  return (
                    <tr key={inq.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{inq.inquiryNo}</div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(inq.createdAt).toLocaleDateString("id-ID")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-slate-400" />
                          <span className="font-bold text-slate-800">{inq.institution.name}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 ml-6">
                          {inq.institution.contacts[0]?.name || "Tanpa Nama"} ({inq.institution.contacts[0]?.phone})
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-700">{inq.items.length} Macam Alat</div>
                        <div className="text-xs text-blue-600 font-bold mt-1">Est. {formatRupiah(totalEst)}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(inq.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/inquiries/${inq.id}`} className="inline-block px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                          Buat Quotation
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
