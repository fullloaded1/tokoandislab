import { prisma } from "@/lib/db";
import { Building, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function InstitutionsPage() {
  const institutions = await prisma.institution.findMany({
    include: {
      contacts: true,
      _count: {
        select: { inquiries: true, installedBases: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Pelanggan (Instansi)</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola data rumah sakit, universitas, dan perusahaan.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {institutions.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
            <Building className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Belum ada data instansi.</p>
          </div>
        ) : (
          institutions.map(inst => (
            <div key={inst.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{inst.name}</h3>
                  <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full mt-2">
                    {inst.type}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-slate-400" />
                  <span className="line-clamp-2">{inst.address}</span>
                </div>
                {inst.contacts[0] && (
                  <>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                      <span>{inst.contacts[0].phone} ({inst.contacts[0].name})</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="truncate">{inst.contacts[0].email}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-xs text-slate-500">Inquiry</p>
                  <p className="font-bold text-slate-800">{inst._count.inquiries}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">Alat Terpasang</p>
                  <p className="font-bold text-blue-600">{inst._count.installedBases}</p>
                </div>
                <div className="flex-1 text-right">
                  <Link href={`/admin/institutions/${inst.id}`} className="text-sm font-bold text-blue-600 hover:text-blue-700">
                    Detail &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
