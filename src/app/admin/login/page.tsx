"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Loader2, FlaskConical, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900 to-slate-900 z-0" />
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.05] z-0" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FlaskConical className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">AndisLab <span className="text-blue-400">ERP</span></span>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold mb-4 leading-tight">Kelola Bisnis Laboratorium dengan Cerdas.</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Akses dashboard terpusat untuk memantau inventaris produk, mengelola permintaan RFQ, dan menganalisis performa bisnis B2B Anda secara real-time.
          </p>
          
          <div className="mt-8 flex items-center gap-4 text-sm font-medium text-slate-300">
            <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-slate-900 flex items-center justify-center ${i===1?'bg-emerald-500':i===2?'bg-purple-500':'bg-amber-500'}`}>
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
              ))}
            </div>
            <span>Dilengkapi keamanan enkripsi standar industri</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <FlaskConical className="h-7 w-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Selamat Datang Kembali</h1>
            <p className="text-slate-500 mt-2">Silakan masukkan kredensial admin Anda untuk melanjutkan.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            {state?.error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3 items-start">
                <div className="mt-0.5">
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-800">Login Gagal</h3>
                  <p className="text-sm text-red-600 mt-1">{state.error}</p>
                </div>
              </div>
            )}

            <form action={action} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Masukkan username"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="w-full mt-2 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20"
              >
                {pending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Masuk Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <p className="text-center text-sm text-slate-500 font-medium">
            Sistem Internal Terenkripsi &bull; AndisLab ERP
          </p>
        </div>
      </div>
    </div>
  );
}
