"use client";

import { useState } from "react";
import { Calculator, FlaskConical, Scale, Gauge, ArrowRight, CheckCircle2, MessageCircle, Sparkles, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useWhatsAppLeadStore } from "@/store/useWhatsAppLeadStore";

type TabMode = "pengenceran" | "molaritas" | "autoclave";

export default function LabCalculatorClient() {
  const [activeTab, setActiveTab] = useState<TabMode>("pengenceran");
  const openWaModal = useWhatsAppLeadStore((s) => s.openModal);

  // 1. State Pengenceran C1V1 = C2V2
  const [c1, setC1] = useState<string>("1.0");
  const [v1, setV1] = useState<string>("");
  const [c2, setC2] = useState<string>("0.1");
  const [v2, setV2] = useState<string>("100");
  const [dilutionTarget, setDilutionTarget] = useState<"v1" | "v2" | "c1" | "c2">("v1");

  // Kalkulasi C1V1 = C2V2
  const calculateDilution = () => {
    const numC1 = parseFloat(c1);
    const numV1 = parseFloat(v1);
    const numC2 = parseFloat(c2);
    const numV2 = parseFloat(v2);

    if (dilutionTarget === "v1" && numC1 && numC2 && numV2) {
      const res = (numC2 * numV2) / numC1;
      return { result: res.toFixed(2), unit: "mL", desc: `Ambil ${res.toFixed(2)} mL larutan stok (${numC1} M), masukkan ke labu ukur, lalu tambahkan pelarut hingga tanda tera ${numV2} mL.` };
    }
    if (dilutionTarget === "v2" && numC1 && numV1 && numC2) {
      const res = (numC1 * numV1) / numC2;
      return { result: res.toFixed(2), unit: "mL", desc: `Larutan dapat diencerkan hingga volume total ${res.toFixed(2)} mL untuk mencapai konsentrasi ${numC2} M.` };
    }
    if (dilutionTarget === "c2" && numC1 && numV1 && numV2) {
      const res = (numC1 * numV1) / numV2;
      return { result: res.toFixed(4), unit: "M", desc: `Konsentrasi akhir larutan yang dihasilkan adalah ${res.toFixed(4)} M.` };
    }
    return null;
  };

  const dilutionResult = calculateDilution();

  // 2. State Molaritas m = M x V x Mr
  const [targetMolarity, setTargetMolarity] = useState<string>("0.5");
  const [targetVolumeMl, setTargetVolumeMl] = useState<string>("500");
  const [molecularWeight, setMolecularWeight] = useState<string>("58.44"); // Default NaCl

  const calculateMolarityMass = () => {
    const m = parseFloat(targetMolarity);
    const vMl = parseFloat(targetVolumeMl);
    const mr = parseFloat(molecularWeight);

    if (m > 0 && vMl > 0 && mr > 0) {
      const vLiter = vMl / 1000;
      const massGrams = m * vLiter * mr;
      return {
        mass: massGrams.toFixed(4),
        desc: `Timbang tepat ${massGrams.toFixed(4)} gram zat aktif / bahan kimia murni (${mr} g/mol), larutkan dengan sedikit aquades, lalu genapkan dalam labu takar hingga tepat ${vMl} mL.`
      };
    }
    return null;
  };

  const molarityResult = calculateMolarityMass();

  // 3. State Kapasitas Autoclave
  const [bottleSize, setBottleSize] = useState<number>(500); // 100, 250, 500, 1000 ml
  const [bottleCount, setBottleCount] = useState<number>(8);

  const calculateAutoclaveCapacity = () => {
    const totalVolumeLiters = (bottleCount * bottleSize) / 1000;
    let recommendedModel = "Daihan LAC-1045SV (Kapasitas 45 Liter)";
    let reason = "Cukup untuk batch sterilisasi kecil hingga 8 botol medium per siklus.";
    
    if (bottleCount > 16 || totalVolumeLiters > 10) {
      recommendedModel = "Daihan LAC-1105SV (Kapasitas 100 Liter)";
      reason = "Optimal untuk throughput pengujian tinggi pada laboratorium QC industri farmasi & makanan.";
    } else if (bottleCount > 10 || totalVolumeLiters > 6) {
      recommendedModel = "Daihan LAC-1085SV (Kapasitas 85 Liter)";
      reason = "Ideal untuk laboratorium riset dan pengujian mikrobiologi kapasitas menengah-besar.";
    } else if (bottleCount > 6 || totalVolumeLiters > 3) {
      recommendedModel = "Daihan LAC-1065SV (Kapasitas 60 Liter)";
      reason = "Model paling populer dengan keseimbangan dimensi ruang lab dan kapasitas botol erlenmeyer.";
    }

    return { model: recommendedModel, totalLiters: totalVolumeLiters.toFixed(1), reason };
  };

  const autoclaveResult = calculateAutoclaveCapacity();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-xs font-bold text-blue-700 mb-4 shadow-2xs">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span>Utilitas &amp; Alat Bantu Laboratorium Gratis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          Kalkulator Laboratorium <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Online</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Hitung pengenceran larutan stok ($C_1V_1 = C_2V_2$), bobot penimbangan molaritas ($m = M \times V \times Mr$), dan rekomendasi kapasitas autoclave secara presisi untuk efisiensi pekerjaan laboratorium Anda.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex p-1.5 bg-slate-100 rounded-2xl max-w-xl mx-auto mb-10 border border-slate-200">
        <button
          onClick={() => setActiveTab("pengenceran")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "pengenceran"
              ? "bg-white text-blue-700 shadow-sm shadow-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FlaskConical className="h-4 w-4" />
          <span>Pengenceran ($C_1V_1$)</span>
        </button>
        <button
          onClick={() => setActiveTab("molaritas")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "molaritas"
              ? "bg-white text-blue-700 shadow-sm shadow-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Scale className="h-4 w-4" />
          <span>Molaritas Zat</span>
        </button>
        <button
          onClick={() => setActiveTab("autoclave")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "autoclave"
              ? "bg-white text-blue-700 shadow-sm shadow-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Gauge className="h-4 w-4" />
          <span>Kapasitas Autoclave</span>
        </button>
      </div>

      {/* TAB 1: PENGENCERAN */}
      {activeTab === "pengenceran" && (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-blue-600" />
              <span>Kalkulator Pengenceran Larutan ($C_1 \times V_1 = C_2 \times V_2$)</span>
            </h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Tentukan volume larutan stok pekat yang perlu dipipet untuk membuat larutan kerja dengan konsentrasi dan volume tertentu.
            </p>

            <div className="mb-6 space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Variabel yang Ingin Dihitung:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDilutionTarget("v1")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${dilutionTarget === "v1" ? "bg-blue-50 border-blue-500 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  Hitung $V_1$ (Volume Stok)
                </button>
                <button
                  type="button"
                  onClick={() => setDilutionTarget("c2")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${dilutionTarget === "c2" ? "bg-blue-50 border-blue-500 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  Hitung $C_2$ (Konsentrasi Akhir)
                </button>
                <button
                  type="button"
                  onClick={() => setDilutionTarget("v2")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${dilutionTarget === "v2" ? "bg-blue-50 border-blue-500 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  Hitung $V_2$ (Volume Akhir)
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Konsentrasi Larutan Stok ($C_1$)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      value={c1}
                      onChange={(e) => setC1(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: 1.0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">M / %</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Volume Stok yang Diambil ($V_1$)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      disabled={dilutionTarget === "v1"}
                      value={dilutionTarget === "v1" ? (dilutionResult?.result || "") : v1}
                      onChange={(e) => setV1(e.target.value)}
                      className={`w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold outline-none ${dilutionTarget === "v1" ? "bg-blue-50/70 text-blue-900 border-blue-300 font-bold" : "text-slate-800 focus:ring-2 focus:ring-blue-500"}`}
                      placeholder={dilutionTarget === "v1" ? "Hasil perhitungan" : "Contoh: 10"}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">mL</span>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Konsentrasi Akhir yang Diinginkan ($C_2$)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      disabled={dilutionTarget === "c2"}
                      value={dilutionTarget === "c2" ? (dilutionResult?.result || "") : c2}
                      onChange={(e) => setC2(e.target.value)}
                      className={`w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold outline-none ${dilutionTarget === "c2" ? "bg-blue-50/70 text-blue-900 border-blue-300 font-bold" : "text-slate-800 focus:ring-2 focus:ring-blue-500"}`}
                      placeholder={dilutionTarget === "c2" ? "Hasil perhitungan" : "Contoh: 0.1"}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">M / %</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Volume Total Akhir ($V_2$)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      disabled={dilutionTarget === "v2"}
                      value={dilutionTarget === "v2" ? (dilutionResult?.result || "") : v2}
                      onChange={(e) => setV2(e.target.value)}
                      className={`w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold outline-none ${dilutionTarget === "v2" ? "bg-blue-50/70 text-blue-900 border-blue-300 font-bold" : "text-slate-800 focus:ring-2 focus:ring-blue-500"}`}
                      placeholder={dilutionTarget === "v2" ? "Hasil perhitungan" : "Contoh: 100"}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">mL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Box */}
            {dilutionResult && (
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-1.5">
                  <CheckCircle2 className="h-4.5 w-4.5 text-blue-600" />
                  <span>Instruksi Prosedur Pembuatan:</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {dilutionResult.desc}
                </p>
              </div>
            )}
          </div>

          {/* Contextual Equipment Recommendations */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl">
              <span className="inline-block bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-bold px-3 py-1 rounded-full mb-3">
                Peralatan Pendukung Pengenceran
              </span>
              <h3 className="text-lg font-bold mb-2">Presisi Pemipetan &amp; Labu Takar Standar ISO</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Pengenceran analitik membutuhkan pipet mikro berkalibrasi dan labu takar borosilikat tahan panas (Pyrex / Class A) agar deviasi konsentrasi tetap dalam batas toleransi QC.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Labu Ukur Pyrex Borosilikat 3.3 (Ready Stock 50–1000 mL)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Micropipette Presisi AELAB Seri Variable Volume</span>
                </div>
              </div>
              <button
                onClick={() => openWaModal({
                  source: "kalkulator_pengenceran",
                  text: "Halo AndisLab, saya sedang menghitung pengenceran di web dan tertarik melihat katalog labu ukur Pyrex & micropipette bergaransi resmi."
                })}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Konsultasi Paket Labu &amp; Pipet via WA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MOLARITAS */}
      {activeTab === "molaritas" && (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-600" />
              <span>Kalkulator Molaritas ($m = M \times V \times Mr$)</span>
            </h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Hitung massa (gram) zat terlarut yang harus ditimbang pada timbangan analitik untuk membuat larutan dengan konsentrasi molar tertentu.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Konsentrasi Molar yang Diinginkan (M atau mol/L)</label>
                <input
                  type="number"
                  step="any"
                  value={targetMolarity}
                  onChange={(e) => setTargetMolarity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 0.5"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Volume Larutan yang Ingin Dibuat (mL)</label>
                <input
                  type="number"
                  step="any"
                  value={targetVolumeMl}
                  onChange={(e) => setTargetVolumeMl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Berat Molekul / Massa Molar Zat ($Mr$ dalam g/mol)</label>
                <input
                  type="number"
                  step="any"
                  value={molecularWeight}
                  onChange={(e) => setMolecularWeight(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 58.44 (NaCl)"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Contoh Mr: NaCl = 58.44, NaOH = 40.00, C6H12O6 = 180.16</span>
              </div>
            </div>

            {/* Molarity Result Box */}
            {molarityResult && (
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1.5">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                  <span>Bobot yang Harus Ditimbang:</span>
                </div>
                <div className="text-3xl font-black text-emerald-700 mb-2">
                  {molarityResult.mass} <span className="text-lg font-bold text-emerald-600">gram</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {molarityResult.desc}
                </p>
              </div>
            )}
          </div>

          {/* Contextual Equipment Recommendations */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl">
              <span className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold px-3 py-1 rounded-full mb-3">
                Kebutuhan Timbangan Analitik 4 Desimal
              </span>
              <h3 className="text-lg font-bold mb-2">Timbangan Analitik Aczet 0.1 mg</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Penimbangan zat aktif dengan bobot presisi membutuhkan neraca analitis dengan kestabilan elektromagnetik dan sertifikasi kalibrasi KAN.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Aczet CY-224C: Ketelitian 0.0001 g (0.1 mg) Internal Cal</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Garansi Distributor Resmi 1 Tahun &amp; Sertifikat Kalibrasi</span>
                </div>
              </div>
              <button
                onClick={() => openWaModal({
                  source: "kalkulator_molaritas",
                  text: "Halo AndisLab, saya sedang menghitung molaritas dan ingin menanyakan penawaran harga Timbangan Analitik Aczet 0.1mg ready stock."
                })}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Minta Penawaran Timbangan Aczet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KAPASITAS AUTOCLAVE */}
      {activeTab === "autoclave" && (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-blue-600" />
              <span>Estimasi Kapasitas Autoclave Laboratorium</span>
            </h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Berapa volume autoclave vertikal yang ideal untuk mengakomodasi beban sterilisasi harian botol media kultur dan labu erlenmeyer Anda?
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Ukuran Botol / Erlenmeyer yang Dominan Digunakan:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 250, 500, 1000].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setBottleSize(size)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${bottleSize === size ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                    >
                      {size} mL
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Estimasi Jumlah Botol per Siklus Sterilisasi: ({bottleCount} botol)</label>
                <input
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  value={bottleCount}
                  onChange={(e) => setBottleCount(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-semibold">
                  <span>2 botol</span>
                  <span>15 botol</span>
                  <span>30 botol</span>
                </div>
              </div>
            </div>

            {/* Autoclave Result Box */}
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-1">
                <CheckCircle2 className="h-4.5 w-4.5 text-indigo-600" />
                <span>Rekomendasi Kapasitas Autoclave:</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-indigo-900 mb-2">
                {autoclaveResult.model}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Volume muatan botol: ~{autoclaveResult.totalLiters} Liter cairan media. {autoclaveResult.reason}
              </p>
            </div>
          </div>

          {/* Contextual Equipment Recommendations */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl">
              <span className="inline-block bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-bold px-3 py-1 rounded-full mb-3">
                Instrumen Ready Stock Anti-Indent
              </span>
              <h3 className="text-lg font-bold mb-2">Daihan Labtech Autoclave Vertikal</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Bejana tekan bersertifikat standar internasional, kontrol mikroprosesor digital, dan sensor proteksi overheat ganda.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Kapasitas 45L, 60L, 85L, 100L Siap Kirim</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Dukungan Dokumen SPJ, Faktur Pajak &amp; e-Katalog LKPP</span>
                </div>
              </div>
              <button
                onClick={() => openWaModal({
                  source: "kalkulator_autoclave",
                  text: `Halo AndisLab, saya baru menghitung kapasitas autoclave di web dan tertarik dengan rekomendasi ${autoclaveResult.model}. Mohon penawaran harga resminya.`
                })}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Minta Penawaran Autoclave Daihan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cross-Link to RFQ & Catalog */}
      <div className="mt-12 text-center p-6 bg-slate-50 border border-slate-200 rounded-3xl">
        <h3 className="text-base font-bold text-slate-800 mb-1">Butuh Instrumen atau Reagen Khusus untuk Metode Lab Anda?</h3>
        <p className="text-xs text-slate-500 mb-4 max-w-xl mx-auto">
          Tim spesialis aplikasi PT Andis Sentral Laboratorium siap membantu mencocokkan spesifikasi teknis alat dengan standar SNI, ISO 17025, atau Farmakope Indonesia.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>Jelajahi 2.000+ Produk Katalog</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/inquiry"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>Minta Penawaran Resmi (RFQ)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
