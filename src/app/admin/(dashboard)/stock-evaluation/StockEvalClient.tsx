"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Plus,
  CheckCircle,
  XCircle,
  Play,
  Trash2,
  Loader2,
  Search,
  ArrowUpDown,
  Tag,
  Package,
  RefreshCw,
  History,
  Award,
} from "lucide-react";
import {
  generateEvaluation,
  approveEvaluation,
  executeRolling,
  cancelEvaluation,
  addIntroduceItem,
  removeEvalItem,
  setClearanceDiscount,
  getEvaluationDetail,
} from "./actions";
import type { ProductScore } from "@/lib/stockEvaluation";

type Tab = "active" | "history" | "leaderboard";

interface EvalSummary {
  id: string;
  evalNo: string;
  period: string;
  status: string;
  targetCount: number;
  notes: string | null;
  createdAt: string;
  approvedAt: string | null;
  executedAt: string | null;
  _count: { items: number };
  admin: { name: string } | null;
}

interface EvalItem {
  id: string;
  productId: string;
  action: string;
  salesCount: number;
  inquiryCount: number;
  pageViews: number;
  currentStock: number;
  daysSinceLastSale: number | null;
  marginPercent: string | null;
  score: string;
  clearanceDiscount: string | null;
  productName: string;
  productBrand: string | null;
  productModel: string | null;
  reason: string | null;
  product: { image: string; slug: string };
}

interface EvalDetail {
  id: string;
  evalNo: string;
  period: string;
  status: string;
  targetCount: number;
  notes: string | null;
  items: EvalItem[];
  admin: { name: string } | null;
}

interface NonReadyProduct {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  image: string;
}

interface Props {
  initialEvaluations: EvalSummary[];
  leaderboard: ProductScore[];
  nonReadyProducts: NonReadyProduct[];
  readyStockCount: number;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-blue-100 text-blue-800",
  EXECUTED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function StockEvalClient({
  initialEvaluations,
  leaderboard,
  nonReadyProducts,
  readyStockCount,
}: Props) {
  const [tab, setTab] = useState<Tab>("active");
  const [evaluations, setEvaluations] = useState(initialEvaluations);
  const [selectedEval, setSelectedEval] = useState<EvalDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showIntroduceModal, setShowIntroduceModal] = useState(false);
  const [introduceSearch, setIntroduceSearch] = useState("");
  const [retireCount, setRetireCount] = useState(10);

  const activeEvals = evaluations.filter((e) => e.status === "DRAFT" || e.status === "APPROVED");
  const historyEvals = evaluations.filter((e) => e.status === "EXECUTED" || e.status === "CANCELLED");

  // ── Actions ────────────────────────────────────────────────────
  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const result = await generateEvaluation(retireCount);
      if (!result.success) {
        setError(result.error || "Gagal generate");
        return;
      }
      // Reload page data
      window.location.reload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal generate evaluasi");
    } finally {
      setLoading(false);
    }
  }

  async function loadDetail(id: string) {
    setLoading(true);
    try {
      const detail = await getEvaluationDetail(id);
      setSelectedEval(detail as EvalDetail);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal memuat detail");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    if (!selectedEval) return;
    setLoading(true);
    try {
      await approveEvaluation(selectedEval.id);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  async function handleExecute() {
    if (!selectedEval) return;
    if (!confirm("Yakin execute rolling? Produk retire akan di-unlist dari ready stock.")) return;
    setLoading(true);
    setError("");
    try {
      const result = await executeRolling(selectedEval.id);
      if (!result.success) {
        setError(result.error || "Gagal execute");
        setLoading(false);
        return;
      }
      window.location.reload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal execute");
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!selectedEval) return;
    if (!confirm("Batalkan evaluasi ini?")) return;
    setLoading(true);
    try {
      await cancelEvaluation(selectedEval.id);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  async function handleAddIntroduce(productId: string) {
    if (!selectedEval) return;
    setLoading(true);
    try {
      await addIntroduceItem(selectedEval.id, productId);
      await loadDetail(selectedEval.id);
    } finally {
      setLoading(false);
      setShowIntroduceModal(false);
    }
  }

  async function handleRemoveItem(itemId: string) {
    if (!selectedEval) return;
    setLoading(true);
    try {
      await removeEvalItem(itemId);
      await loadDetail(selectedEval.id);
    } finally {
      setLoading(false);
    }
  }

  async function handleSetDiscount(itemId: string, discount: number) {
    setLoading(true);
    try {
      await setClearanceDiscount(itemId, discount);
      if (selectedEval) await loadDetail(selectedEval.id);
    } finally {
      setLoading(false);
    }
  }

  const filteredIntroduceProducts = nonReadyProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(introduceSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(introduceSearch.toLowerCase())
  );

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <RefreshCw className="h-7 w-7 text-blue-600" />
          Evaluasi Ready Stock
        </h1>
        <p className="text-slate-500 mt-1">
          Rolling bulanan — target <strong>50 produk</strong> ready stock aktif. Saat ini:{" "}
          <span className={readyStockCount >= 50 ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
            {readyStockCount} produk
          </span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        {([
          { key: "active", label: "Evaluasi Aktif", icon: BarChart3 },
          { key: "history", label: "Riwayat", icon: History },
          { key: "leaderboard", label: "Performa", icon: Award },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              setTab(key);
              setSelectedEval(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ═══ Tab: Active ═══ */}
      {tab === "active" && !selectedEval && (
        <div>
          {/* Generate Card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-6">
            <h2 className="text-lg font-bold mb-2">Generate Evaluasi Bulan Ini</h2>
            <p className="text-blue-100 text-sm mb-4">
              Sistem akan menghitung skor semua produk ready stock dan menampilkan kandidat retire.
            </p>
            <div className="flex items-center gap-4">
              <label className="text-sm text-blue-200">
                Jumlah retire:
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={retireCount}
                  onChange={(e) => setRetireCount(Number(e.target.value))}
                  className="ml-2 w-16 px-2 py-1 rounded bg-white/20 text-white border border-white/30 text-center"
                />
              </label>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Generate Evaluasi
              </button>
            </div>
          </div>

          {/* Active evaluations list */}
          {activeEvals.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-semibold">Belum ada evaluasi aktif</p>
              <p className="text-sm">Generate evaluasi baru untuk memulai rolling</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {activeEvals.map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => loadDetail(ev.id)}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all text-left w-full"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{ev.evalNo}</h3>
                      <p className="text-sm text-slate-500">
                        Periode: {new Date(ev.period).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                        {ev.admin && <> · Oleh {ev.admin.name}</>}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500">{ev._count.items} item</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[ev.status]}`}>
                        {ev.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ Detail View ═══ */}
      {selectedEval && (tab === "active" || tab === "history") && (
        <div>
          <button
            onClick={() => setSelectedEval(null)}
            className="text-sm text-blue-600 hover:text-blue-800 mb-4 font-semibold"
          >
            ← Kembali ke daftar
          </button>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {/* Detail Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">{selectedEval.evalNo}</h2>
                <p className="text-sm text-slate-500">
                  Periode: {new Date(selectedEval.period).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                  {" · Target: "}{selectedEval.targetCount} produk
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[selectedEval.status]}`}>
                  {selectedEval.status}
                </span>
                {selectedEval.status === "DRAFT" && (
                  <>
                    <button onClick={() => setShowIntroduceModal(true)} className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                      <Plus className="h-4 w-4" /> Produk Baru
                    </button>
                    <button onClick={handleApprove} disabled={loading} className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                      <CheckCircle className="h-4 w-4" /> Approve
                    </button>
                    <button onClick={handleCancel} disabled={loading} className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition disabled:opacity-50">
                      <XCircle className="h-4 w-4" /> Batalkan
                    </button>
                  </>
                )}
                {selectedEval.status === "APPROVED" && (
                  <button onClick={handleExecute} disabled={loading} className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-50">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    Execute Rolling
                  </button>
                )}
              </div>
            </div>

            {/* RETIRE Section */}
            <div className="p-6">
              <h3 className="font-bold text-red-700 flex items-center gap-2 mb-4">
                <TrendingDown className="h-5 w-5" />
                Produk Retire ({selectedEval.items.filter((i) => i.action === "RETIRE").length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="pb-3 font-semibold">Produk</th>
                      <th className="pb-3 font-semibold text-center">Penjualan</th>
                      <th className="pb-3 font-semibold text-center">Inquiry</th>
                      <th className="pb-3 font-semibold text-center">Views</th>
                      <th className="pb-3 font-semibold text-center">Stok</th>
                      <th className="pb-3 font-semibold text-center">Hari ∅ Jual</th>
                      <th className="pb-3 font-semibold text-center">Margin</th>
                      <th className="pb-3 font-semibold text-center">Skor</th>
                      <th className="pb-3 font-semibold text-center">Diskon Clearance</th>
                      {selectedEval.status === "DRAFT" && <th className="pb-3"></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEval.items
                      .filter((i) => i.action === "RETIRE")
                      .map((item) => (
                        <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              {item.product.image && (
                                <img src={item.product.image} alt="" className="w-10 h-10 object-cover rounded-lg" />
                              )}
                              <div>
                                <p className="font-semibold text-slate-900">{item.productName}</p>
                                <p className="text-xs text-slate-400">
                                  {item.productBrand} {item.productModel && `· ${item.productModel}`}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">{item.salesCount}</td>
                          <td className="text-center">{item.inquiryCount}</td>
                          <td className="text-center">{item.pageViews}</td>
                          <td className="text-center">{item.currentStock}</td>
                          <td className="text-center">
                            {item.daysSinceLastSale !== null ? (
                              <span className={item.daysSinceLastSale > 90 ? "text-red-600 font-bold" : ""}>
                                {item.daysSinceLastSale}d
                              </span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                          <td className="text-center">
                            {item.marginPercent !== null ? `${item.marginPercent}%` : "—"}
                          </td>
                          <td className="text-center">
                            <span className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${
                              parseFloat(item.score) < 0.2 ? "bg-red-100 text-red-700" :
                              parseFloat(item.score) < 0.5 ? "bg-amber-100 text-amber-700" :
                              "bg-green-100 text-green-700"
                            }`}>
                              {item.score}
                            </span>
                          </td>
                          <td className="text-center">
                            {selectedEval.status === "DRAFT" ? (
                              <div className="flex items-center justify-center gap-1">
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  placeholder="0"
                                  defaultValue={item.clearanceDiscount || ""}
                                  className="w-14 px-1 py-1 border border-slate-200 rounded text-center text-xs"
                                  onBlur={(e) => {
                                    const val = Number(e.target.value);
                                    if (val > 0) handleSetDiscount(item.id, val);
                                  }}
                                />
                                <span className="text-xs text-slate-400">%</span>
                              </div>
                            ) : (
                              item.clearanceDiscount ? (
                                <span className="text-orange-600 font-bold flex items-center justify-center gap-1">
                                  <Tag className="h-3 w-3" /> {item.clearanceDiscount}%
                                </span>
                              ) : "—"
                            )}
                          </td>
                          {selectedEval.status === "DRAFT" && (
                            <td className="text-center">
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-400 hover:text-red-600 transition"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* INTRODUCE Section */}
            <div className="p-6 bg-green-50/50 border-t border-slate-100">
              <h3 className="font-bold text-green-700 flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5" />
                Produk Baru / Introduce ({selectedEval.items.filter((i) => i.action === "INTRODUCE").length})
              </h3>
              {selectedEval.items.filter((i) => i.action === "INTRODUCE").length === 0 ? (
                <p className="text-sm text-slate-400 italic">Belum ada produk baru ditambahkan</p>
              ) : (
                <div className="grid gap-2">
                  {selectedEval.items
                    .filter((i) => i.action === "INTRODUCE")
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-white rounded-xl p-3 border border-green-200">
                        <div className="flex items-center gap-3">
                          {item.product.image && (
                            <img src={item.product.image} alt="" className="w-10 h-10 object-cover rounded-lg" />
                          )}
                          <div>
                            <p className="font-semibold text-slate-900">{item.productName}</p>
                            <p className="text-xs text-slate-400">
                              {item.productBrand} {item.productModel && `· ${item.productModel}`}
                            </p>
                          </div>
                        </div>
                        {selectedEval.status === "DRAFT" && (
                          <button onClick={() => handleRemoveItem(item.id)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Tab: History ═══ */}
      {tab === "history" && !selectedEval && (
        <div>
          {historyEvals.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <History className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-semibold">Belum ada riwayat evaluasi</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {historyEvals.map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => loadDetail(ev.id)}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all text-left w-full"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900">{ev.evalNo}</h3>
                      <p className="text-sm text-slate-500">
                        {new Date(ev.period).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                        {ev.admin && <> · {ev.admin.name}</>}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500">{ev._count.items} item</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[ev.status]}`}>
                        {ev.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ Tab: Leaderboard ═══ */}
      {tab === "leaderboard" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Performa Ready Stock — Semua Produk
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Skor dihitung dari penjualan, inquiry, recency, turnover, margin, dan page views (3 bulan terakhir)
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500 bg-slate-50">
                  <th className="p-4 font-semibold w-8">#</th>
                  <th className="p-4 font-semibold">Produk</th>
                  <th className="p-4 font-semibold text-center">
                    <ArrowUpDown className="h-3 w-3 inline mr-1" />Skor
                  </th>
                  <th className="p-4 font-semibold text-center">Penjualan</th>
                  <th className="p-4 font-semibold text-center">Inquiry</th>
                  <th className="p-4 font-semibold text-center">Views</th>
                  <th className="p-4 font-semibold text-center">Stok</th>
                  <th className="p-4 font-semibold text-center">Hari ∅ Jual</th>
                  <th className="p-4 font-semibold text-center">Margin</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((p, idx) => (
                  <tr
                    key={p.productId}
                    className={`border-b border-slate-50 hover:bg-slate-50 ${
                      idx < 10 ? "bg-red-50/30" : ""
                    }`}
                  >
                    <td className="p-4 text-slate-400 font-mono text-xs">{idx + 1}</td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-900">{p.productName}</p>
                      <p className="text-xs text-slate-400">
                        {p.productBrand} {p.productModel && `· ${p.productModel}`}
                      </p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${
                        parseFloat(p.score) < 0.2 ? "bg-red-100 text-red-700" :
                        parseFloat(p.score) < 0.5 ? "bg-amber-100 text-amber-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {p.score}
                      </span>
                      {/* Score bar */}
                      <div className="mt-1 w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            parseFloat(p.score) < 0.2 ? "bg-red-400" :
                            parseFloat(p.score) < 0.5 ? "bg-amber-400" :
                            "bg-green-400"
                          }`}
                          style={{ width: `${Math.min(parseFloat(p.score) * 100, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-4 text-center">{p.salesCount}</td>
                    <td className="p-4 text-center">{p.inquiryCount}</td>
                    <td className="p-4 text-center">{p.pageViews}</td>
                    <td className="p-4 text-center">{p.currentStock}</td>
                    <td className="p-4 text-center">
                      {p.daysSinceLastSale !== null ? (
                        <span className={p.daysSinceLastSale > 90 ? "text-red-600 font-bold" : ""}>
                          {p.daysSinceLastSale}d
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {p.marginPercent !== null ? `${p.marginPercent}%` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {leaderboard.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p>Belum ada produk ready stock</p>
            </div>
          )}
        </div>
      )}

      {/* ═══ Introduce Modal ═══ */}
      {showIntroduceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Tambah Produk Baru (Introduce)</h3>
              <button onClick={() => setShowIntroduceModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={introduceSearch}
                  onChange={(e) => setIntroduceSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredIntroduceProducts.length === 0 ? (
                <p className="text-center text-slate-400 py-8 text-sm">Tidak ada produk ditemukan</p>
              ) : (
                filteredIntroduceProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleAddIntroduce(p.id)}
                    disabled={loading}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-green-300 hover:bg-green-50 transition text-left disabled:opacity-50"
                  >
                    {p.image && <img src={p.image} alt="" className="w-10 h-10 object-cover rounded-lg" />}
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.brand} · {p.category}</p>
                    </div>
                    <Plus className="h-4 w-4 text-green-600 ml-auto" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
