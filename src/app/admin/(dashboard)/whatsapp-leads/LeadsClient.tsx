"use client";

import { useState, useEffect } from "react";
import { 
  MessageCircle, 
  Search, 
  Download, 
  Calendar, 
  ArrowUpRight, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  Inbox,
  LayoutGrid,
  ListTodo,
  User,
  Building,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import * as XLSX from "xlsx";
import { updateLeadStatus } from "./actions";
import { WhatsAppLogStatus } from "@prisma/client";

interface LogItem {
  id: string;
  source: string;
  productName: string | null;
  productId: string | null;
  inquiryNo: string | null;
  messageText: string | null;
  leadName: string | null;
  leadInstitution: string | null;
  leadPhone: string | null;
  status: string;
  createdAt: string;
  product?: {
    slug: string;
    category: string;
  } | null;
}

const SOURCE_DETAILS: Record<string, { label: string; bg: string }> = {
  rfq_success: { label: "Checkout RFQ", bg: "bg-emerald-50 text-emerald-700 border-emerald-250" },
  product_detail: { label: "Tanya Produk", bg: "bg-blue-50 text-blue-700 border-blue-250" },
  product_brochure: { label: "Minta Brosur", bg: "bg-violet-50 text-violet-700 border-violet-250" },
  navbar_desktop: { label: "Navbar (PC)", bg: "bg-cyan-50 text-cyan-700 border-cyan-250" },
  navbar_mobile: { label: "Navbar (HP)", bg: "bg-cyan-50 text-cyan-700 border-cyan-250" },
  footer: { label: "Footer Link", bg: "bg-slate-100 text-slate-700 border-slate-300" },
  homepage_cta: { label: "Banner Beranda", bg: "bg-indigo-50 text-indigo-700 border-indigo-250" },
  about_page: { label: "Tentang Kami", bg: "bg-sky-50 text-sky-700 border-sky-250" },
  chatbot: { label: "AndisBot Chat", bg: "bg-amber-50 text-amber-700 border-amber-250" },
  chatbot_error: { label: "Bot Fallback", bg: "bg-rose-50 text-rose-700 border-rose-250" },
};

const CRM_COLUMNS = [
  { id: "NEW", title: "Baru (New)", icon: AlertCircle, color: "border-yellow-200 bg-yellow-50/40", headerBg: "bg-yellow-100 text-yellow-800" },
  { id: "CONTACTED", title: "Dihubungi (Follow Up)", icon: Clock, color: "border-purple-200 bg-purple-50/40", headerBg: "bg-purple-100 text-purple-800" },
  { id: "OFFERS", title: "Kirim Penawaran", icon: FileTextIcon, color: "border-blue-200 bg-blue-50/40", headerBg: "bg-blue-100 text-blue-800" },
  { id: "WON", title: "Deal (Project)", icon: CheckCircle, color: "border-emerald-200 bg-emerald-50/40", headerBg: "bg-emerald-100 text-emerald-800" },
  { id: "LOST", title: "Batal (Lost)", icon: XCircle, color: "border-slate-200 bg-slate-50/45", headerBg: "bg-slate-200 text-slate-800" },
];

function FileTextIcon(props: any) {
  return <Inbox {...props} />;
}

export default function LeadsClient({ initialLogs }: { initialLogs: LogItem[] }) {
  const [logs, setLogs] = useState<LogItem[]>(initialLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "crm">("table");
  const [isMounted, setIsMounted] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Calculations & Metrics
  const totalClicks = logs.length;
  const rfqSuccessCount = logs.filter(l => l.source === "rfq_success").length;
  const productDetailCount = logs.filter(l => l.source === "product_detail" || l.source === "product_brochure").length;
  const botCount = logs.filter(l => l.source.startsWith("chatbot")).length;
  const generalCount = totalClicks - rfqSuccessCount - productDetailCount - botCount;

  // Click sources breakdown
  const sourceBreakdown = logs.reduce<Record<string, number>>((acc, item) => {
    acc[item.source] = (acc[item.source] || 0) + 1;
    return acc;
  }, {});

  const sortedSources = Object.entries(sourceBreakdown)
    .map(([source, count]) => ({
      source,
      count,
      percentage: totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // 2. 7-Day Trend Chart Processing
  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("id-ID", { month: "short", day: "numeric" });
    const dStr = d.toDateString();
    const count = logs.filter(log => new Date(log.createdAt).toDateString() === dStr).length;
    return { label, count };
  });

  const maxCount = Math.max(...last7DaysData.map(d => d.count), 5);
  const chartPoints = last7DaysData.map((d, i) => {
    const x = 40 + (i * 380) / 6;
    const y = 120 - (d.count * 90) / maxCount;
    return { x, y, label: d.label, count: d.count };
  });

  const pathD = `M ${chartPoints.map(p => `${p.x} ${p.y}`).join(" L ")}`;
  const areaD = `M ${chartPoints[0].x} 120 L ${chartPoints.map(p => `${p.x} ${p.y}`).join(" L ")} L ${chartPoints[chartPoints.length - 1].x} 120 Z`;

  // 3. Search & Filter logic
  const filteredLogs = logs.filter(log => {
    const matchesSource = selectedSource === "all" || log.source === selectedSource;
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      !searchTerm ||
      (log.productName && log.productName.toLowerCase().includes(searchLower)) ||
      (log.inquiryNo && log.inquiryNo.toLowerCase().includes(searchLower)) ||
      (log.messageText && log.messageText.toLowerCase().includes(searchLower)) ||
      (log.leadName && log.leadName.toLowerCase().includes(searchLower)) ||
      (log.leadInstitution && log.leadInstitution.toLowerCase().includes(searchLower)) ||
      (log.source && log.source.toLowerCase().includes(searchLower));

    return matchesSource && matchesSearch;
  });

  // 4. Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  // 5. CRM drag & drop handler
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimistic UI state update
    const updatedLogs = logs.map(log => 
      log.id === draggableId ? { ...log, status: destination.droppableId } : log
    );
    setLogs(updatedLogs);

    // Hit server action
    try {
      const res = await updateLeadStatus(draggableId, destination.droppableId as WhatsAppLogStatus);
      if (!res.success) {
        alert(res.error || "Gagal mengupdate status lead");
        setLogs(initialLogs); // Revert on failure
      }
    } catch (err) {
      console.error(err);
      setLogs(initialLogs);
    }
  };

  // 6. Excel Export Handler
  const handleExportExcel = () => {
    const excelData = filteredLogs.map((l, index) => ({
      "No": index + 1,
      "Tanggal & Waktu": new Date(l.createdAt).toLocaleString("id-ID"),
      "Nama Prospek": l.leadName || "Visitor",
      "Instansi / Perusahaan": l.leadInstitution || "-",
      "WhatsApp Prospek": l.leadPhone || "-",
      "Sumber Klik": SOURCE_DETAILS[l.source]?.label || l.source,
      "Tipe Produk": l.productName || "-",
      "Nomor Referensi RFQ": l.inquiryNo || "-",
      "Status Follow-Up": l.status,
      "Isi Pesan WA": l.messageText || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Auto-fit column widths
    const maxLens = Object.keys(excelData[0] || {}).map(key => {
      const maxColLen = excelData.reduce((max, row: any) => {
        const val = row[key] ? String(row[key]).length : 0;
        return val > max ? val : max;
      }, key.length);
      return { wch: maxColLen + 3 };
    });
    worksheet["!cols"] = maxLens;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan_Leads_WA");
    
    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `Laporan_WhatsApp_Leads_${dateStr}.xlsx`);
  };

  const getSourceBadge = (source: string) => {
    const details = SOURCE_DETAILS[source] || { label: source, bg: "bg-slate-50 text-slate-600 border-slate-200" };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${details.bg}`}>
        {details.label}
      </span>
    );
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-blue-600 shrink-0" />
            Laporan Hubungi WA
          </h1>
          <p className="text-slate-500 mt-1">Pantau klik tombol WhatsApp untuk mengetahui minat, identitas lead, dan status prospek.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "table" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <ListTodo className="h-4 w-4" />
              Daftar Aktivitas
            </button>
            <button
              onClick={() => setViewMode("crm")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "crm" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Papan CRM
            </button>
          </div>

          <button
            onClick={handleExportExcel}
            disabled={filteredLogs.length === 0}
            className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-100 transition-all border border-emerald-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
          >
            <Download className="h-5 w-5" />
            Ekspor Excel ({filteredLogs.length})
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Klik WA</p>
              <h3 className="text-3xl font-black text-slate-800 mt-0.5">{totalClicks}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Inbox className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Checkout RFQ</p>
              <h3 className="text-3xl font-black text-slate-800 mt-0.5">{rfqSuccessCount}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tanya Produk</p>
              <h3 className="text-3xl font-black text-slate-800 mt-0.5">{productDetailCount}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
              <ArrowUpRight className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menu &amp; Umum</p>
              <h3 className="text-3xl font-black text-slate-800 mt-0.5">{generalCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === "table" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
          
          {/* Left Column: Visual Trends & Popular Sources */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Visual Trends Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Tren Aktivitas (7 Hari)
              </h2>
              
              <div className="relative h-[160px] w-full mt-2">
                <svg className="h-full w-full" viewBox="0 0 450 150">
                  <defs>
                    <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="30" y1="30" x2="420" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="75" x2="420" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="120" x2="420" y2="120" stroke="#e2e8f0" strokeWidth="1.5" />

                  {/* Gradient Area under line */}
                  <path d={areaD} fill="url(#chart-gradient)" />

                  {/* Main Line */}
                  <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Coordinates Points Dots */}
                  {chartPoints.map((p, idx) => (
                    <g key={idx}>
                      <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                      {p.count > 0 && (
                        <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[10px] font-black fill-blue-600">
                          {p.count}
                        </text>
                      )}
                      <text x={p.x} y="138" textAnchor="middle" className="text-[9px] font-bold fill-slate-400">
                        {p.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Popular Sources Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                Sumber Klik Terpopuler
              </h2>
              
              {sortedSources.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-6">Belum ada data distribusi klik.</p>
              ) : (
                <div className="space-y-4">
                  {sortedSources.map((item) => {
                    const details = SOURCE_DETAILS[item.source] || { label: item.source };
                    return (
                      <div key={item.source} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-600">
                          <span>{details.label}</span>
                          <span>{item.count} klik ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" 
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Table Logs */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Filters Header */}
              <div className="p-6 border-b border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <h2 className="text-lg font-bold text-slate-800">Riwayat Aktivitas Klik</h2>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Filter className="h-3.5 w-3.5" />
                    Filter Aktif
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      placeholder="Cari prospek, produk, inquiry, atau pesan..."
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white placeholder:text-slate-400 text-slate-700 font-medium"
                    />
                  </div>

                  {/* Filter Source Dropdown */}
                  <select
                    value={selectedSource}
                    onChange={(e) => { setSelectedSource(e.target.value); setCurrentPage(1); }}
                    className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white text-slate-700 font-semibold cursor-pointer"
                  >
                    <option value="all">Semua Sumber Klik</option>
                    {Object.entries(SOURCE_DETAILS).map(([key, value]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table Area */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Waktu</th>
                      <th className="px-6 py-4">Prospek</th>
                      <th className="px-6 py-4">Sumber &amp; Minat</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-semibold">
                          Tidak ada riwayat klik yang cocok dengan kriteria pencarian Anda.
                        </td>
                      </tr>
                    ) : (
                      paginatedLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                          {/* Time */}
                          <td className="px-6 py-4 whitespace-nowrap align-top">
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              {new Date(log.createdAt).toLocaleDateString("id-ID", { month: "short", day: "numeric" })}
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                              {new Date(log.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </td>

                          {/* Prospect details */}
                          <td className="px-6 py-4 align-top">
                            {log.leadName ? (
                              <div className="space-y-1">
                                <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                                  <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                  {log.leadName}
                                </div>
                                {log.leadInstitution && (
                                  <div className="text-xs text-slate-500 flex items-center gap-1 pl-5">
                                    <Building className="h-3 w-3 text-slate-400 shrink-0" />
                                    {log.leadInstitution}
                                  </div>
                                )}
                                {log.leadPhone && (
                                  <div className="text-xs text-slate-500 flex items-center gap-1 pl-5">
                                    <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                                    {log.leadPhone}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Visitor Anonim</span>
                            )}
                          </td>

                          {/* Source & Content */}
                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-wrap gap-1.5 mb-1.5 items-center">
                              {getSourceBadge(log.source)}
                              {log.inquiryNo && (
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5">
                                  RFQ: {log.inquiryNo}
                                </span>
                              )}
                            </div>
                            {log.productName && (
                              <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                {log.productName}
                              </div>
                            )}
                            {log.messageText && (
                              <p className="text-xs text-slate-500 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 break-words max-w-sm line-clamp-2 hover:line-clamp-none transition-all">
                                {log.messageText}
                              </p>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right align-top whitespace-nowrap">
                            <div className="flex flex-col gap-1 items-end">
                              {log.leadPhone && (
                                <a
                                  href={`https://wa.me/${log.leadPhone.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-100"
                                >
                                  Hubungi Klien
                                  <MessageCircle className="h-3 w-3" />
                                </a>
                              )}
                              {log.product?.slug && (
                                <a
                                  href={`/katalog/${log.product.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-100"
                                >
                                  Lihat Alat
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold">
                    Menampilkan <span className="font-bold text-slate-800">{startIndex + 1}</span> hingga{" "}
                    <span className="font-bold text-slate-800">{Math.min(startIndex + itemsPerPage, filteredLogs.length)}</span> dari{" "}
                    <span className="font-bold text-slate-800">{filteredLogs.length}</span> lead
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-slate-600"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-slate-600"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* CRM Kanban Board View */
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-8 h-[calc(100vh-230px)] items-start snap-x snap-mandatory animate-in fade-in duration-200">
            {CRM_COLUMNS.map(column => {
              const colLogs = filteredLogs.filter(log => log.status === column.id);
              const Icon = column.icon;

              return (
                <div key={column.id} className={`flex-shrink-0 w-[290px] snap-center rounded-2xl border ${column.color} flex flex-col h-full overflow-hidden shadow-sm`}>
                  
                  {/* Column Header */}
                  <div className={`px-4 py-3 border-b ${column.color} ${column.headerBg} flex items-center justify-between shrink-0`}>
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Icon className="h-4 w-4 shrink-0" />
                      {column.title}
                    </div>
                    <div className="px-2 py-0.5 bg-white/50 rounded-full text-xs font-black">
                      {colLogs.length}
                    </div>
                  </div>

                  {/* Drop zone */}
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 p-3 overflow-y-auto space-y-3 transition-colors custom-scrollbar ${
                          snapshot.isDraggingOver ? "bg-black/5" : ""
                        }`}
                      >
                        {colLogs.map((log, index) => (
                          <Draggable key={log.id} draggableId={log.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-4 bg-white rounded-xl border border-slate-200 shadow-sm transition-all select-none
                                  ${snapshot.isDragging ? "shadow-xl rotate-1 scale-102 border-blue-400" : "hover:border-blue-300 hover:shadow-md"}`}
                              >
                                <div className="flex justify-between items-start mb-2.5">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                    {new Date(log.createdAt).toLocaleDateString("id-ID", { month: "short", day: "numeric" })}
                                  </span>
                                  {getSourceBadge(log.source)}
                                </div>

                                {/* Prospect Info */}
                                <div className="space-y-1 mb-3">
                                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                    {log.leadName || "Visitor Anonim"}
                                  </h4>
                                  {log.leadInstitution && (
                                    <p className="text-xs text-slate-500 flex items-center gap-1 pl-5">
                                      <Building className="h-3 w-3 text-slate-400 shrink-0" />
                                      {log.leadInstitution}
                                    </p>
                                  )}
                                  {log.leadPhone && (
                                    <p className="text-xs text-slate-500 flex items-center gap-1 pl-5">
                                      <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                                      {log.leadPhone}
                                    </p>
                                  )}
                                </div>

                                {/* Product Interest */}
                                {log.productName && (
                                  <div className="mb-3 pl-2.5 border-l-2 border-blue-500 text-xs">
                                    <p className="font-bold text-slate-700 line-clamp-1">{log.productName}</p>
                                    {log.inquiryNo && <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Ref: {log.inquiryNo}</p>}
                                  </div>
                                )}

                                {/* Action button */}
                                {log.leadPhone && (
                                  <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center">
                                    <a
                                      href={`https://wa.me/${log.leadPhone.replace(/[^0-9]/g, "")}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full flex items-center justify-center gap-1 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold py-1.5 rounded-lg transition-colors cursor-pointer"
                                    >
                                      Chat Client
                                      <MessageCircle className="h-3 w-3" />
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}
    </>
  );
}
