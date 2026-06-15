"use client";

import { useState } from "react";
import { FileText, Building, Calendar, FileDown, MessageCircle, Send, CheckCircle } from "lucide-react";
import { money } from "@/lib/money";
import { createActivityLog, updateInquiryStatus } from "../../actions";
import { ActivityAction } from "@prisma/client";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "@/components/Toast";

export default function InquiryDetailClient({ initialData }: { initialData: any }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [logAction, setLogAction] = useState("CALL");
  const [logDesc, setLogDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalEst = initialData.items.reduce((sum: number, item: any) => sum + (money.toDecimal(item.product.price).toNumber() * item.quantity), 0);
  const ppn = totalEst * 0.11;
  const grandTotal = totalEst + ppn;

  const handleAddLog = async () => {
    if (!logDesc.trim()) return;
    setIsSubmitting(true);
    await createActivityLog({
      inquiryId: initialData.id,
      institutionId: initialData.institutionId,
      action: logAction as ActivityAction,
      description: logDesc
    });
    setLogDesc("");
    setIsSubmitting(false);
    router.refresh();
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("SURAT PENAWARAN HARGA", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`No: ${initialData.inquiryNo}-QUOTE`, 14, 35);
    doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 14, 40);
    
    doc.text(`Kepada Yth.`, 14, 55);
    doc.setFont("helvetica", "bold");
    doc.text(`${initialData.institution.name}`, 14, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Attn: ${initialData.institution.contacts[0]?.name || "Purchasing"}`, 14, 65);
    doc.text(`${initialData.institution.address}`, 14, 70, { maxWidth: 80 });

    const tableData = initialData.items.map((item: any, index: number) => [
      index + 1,
      `${item.product.name}\nBrand: ${item.product.brand}`,
      item.quantity,
      money.formatIDR(item.product.price),
      money.formatIDR(money.toDecimal(item.product.price).toNumber() * item.quantity)
    ]);

    autoTable(doc, {
      startY: 90,
      head: [['No', 'Deskripsi Barang', 'Qty', 'Harga Satuan', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] }, // slate-900
      columnStyles: {
        0: { cellWidth: 10 },
        2: { cellWidth: 15, halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'right' }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 90;
    
    doc.setFont("helvetica", "bold");
    doc.text("Subtotal:", 130, finalY + 10);
    doc.text(money.formatIDR(totalEst), 195, finalY + 10, { align: "right" });
    
    doc.text("PPN (11%):", 130, finalY + 16);
    doc.text(money.formatIDR(ppn), 195, finalY + 16, { align: "right" });
    
    doc.text("Total:", 130, finalY + 22);
    doc.text(money.formatIDR(grandTotal), 195, finalY + 22, { align: "right" });

    // Signature
    doc.text("Hormat Kami,", 14, finalY + 40);
    doc.text("PT. AndisLab Indonesia", 14, finalY + 65);

    doc.save(`Quotation_${initialData.inquiryNo}.pdf`);

    // Automasi: Ubah status ke QUOTED setelah mencetak PDF
    if (initialData.status !== "QUOTED" && initialData.status !== "WON") {
      await updateInquiryStatus(initialData.id, "QUOTED");
      showToast("PDF Quotation berhasil diunduh. Status otomatis diubah menjadi Quotation Sent.", "success");
      router.refresh();
    } else {
      showToast("PDF Quotation berhasil diunduh.", "success");
    }
  };

  const getWaLink = () => {
    const phone = initialData.institution.contacts[0]?.phone || "";
    // Format phone to international if needed
    let waPhone = phone.replace(/\D/g, "");
    if (waPhone.startsWith("0")) waPhone = "62" + waPhone.substring(1);
    
    const text = encodeURIComponent(`Halo Bpk/Ibu ${initialData.institution.contacts[0]?.name}, kami dari AndisLab. Terkait permintaan harga (RFQ: ${initialData.inquiryNo}), berikut kami sampaikan...`);
    return `https://wa.me/${waPhone}?text=${text}`;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Detail RFQ: {initialData.inquiryNo}</h1>
          <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
            <Building className="h-4 w-4" /> {initialData.institution.name}
            <span className="mx-2">•</span>
            <Calendar className="h-4 w-4" /> {new Date(initialData.createdAt).toLocaleDateString("id-ID")}
          </div>
        </div>
        <div className="flex gap-3">
          <a
            href={getWaLink()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> Chat WA
          </a>
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            <FileDown className="h-4 w-4" /> Generate PDF Penawaran
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4">Barang yang Diminta</h2>
            <div className="space-y-4">
              {initialData.items.map((item: any) => (
                <div key={item.id} className="flex gap-4 p-4 border border-slate-100 rounded-xl">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{item.product.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">Brand: {item.product.brand} | Model: {item.product.model}</p>
                    {item.notes && <p className="text-sm text-amber-600 mt-2 bg-amber-50 p-2 rounded">Catatan: {item.notes}</p>}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-slate-800">{item.quantity} Unit</div>
                    <div className="text-sm text-slate-500">@ {money.formatIDR(item.product.price)}</div>
                    <div className="font-bold text-blue-600 mt-1">{money.formatIDR(money.toDecimal(item.product.price).toNumber() * item.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 border-t border-slate-100 pt-4 text-right">
              <div className="text-sm text-slate-500">Subtotal: {money.formatIDR(totalEst)}</div>
              <div className="text-sm text-slate-500">PPN 11%: {money.formatIDR(ppn)}</div>
              <div className="text-xl font-black text-slate-900 mt-2">Total: {money.formatIDR(grandTotal)}</div>
            </div>
          </div>
        </div>

        {/* Right Column: CRM Logs */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">CRM Activity Log</h2>
            
            <div className="space-y-3 mb-6">
              <select 
                value={logAction}
                onChange={(e) => setLogAction(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CALL">Telepon / Call</option>
                <option value="WA">WhatsApp</option>
                <option value="EMAIL">Email</option>
                <option value="MEETING">Meeting</option>
                <option value="NOTE">Catatan Internal</option>
              </select>
              <textarea 
                value={logDesc}
                onChange={(e) => setLogDesc(e.target.value)}
                placeholder="Tulis log follow-up..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={handleAddLog}
                disabled={isSubmitting || !logDesc.trim()}
                className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" /> Simpan Log
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {initialData.activityLogs.length === 0 ? (
                <p className="text-sm text-slate-500 text-center italic">Belum ada aktivitas follow-up.</p>
              ) : (
                initialData.activityLogs.map((log: any) => (
                  <div key={log.id} className="bg-white p-3 rounded-lg border border-slate-200 text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-700 text-xs px-2 py-0.5 bg-slate-100 rounded">{log.action}</span>
                      <span className="text-xs text-slate-400">{new Date(log.createdAt).toLocaleDateString("id-ID")}</span>
                    </div>
                    <p className="text-slate-600 mt-2">{log.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
