"use client";

import { useEffect, useState } from "react";
import { PromoMode } from "@/lib/promo-akhir-tahun";

interface PromoCountdownProps {
  targetDate: string;
  mode: PromoMode;
  phaseName?: string;
}

export default function PromoCountdown({ targetDate, mode, phaseName }: PromoCountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isFinished: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isFinished: false,
  });

  useEffect(() => {
    setMounted(true);
    const targetMs = new Date(targetDate).getTime();

    const updateTimer = () => {
      const nowMs = Date.now();
      const diff = targetMs - nowMs;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isFinished: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (mode === "ended" || (mounted && timeLeft.isFinished && mode === "active")) {
    return (
      <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900/80 border border-slate-700/80 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-300 backdrop-blur-md">
        <span className="flex h-2 w-2 rounded-full bg-red-400"></span>
        <span>Periode Promo 2026 Telah Ditutup</span>
      </div>
    );
  }

  const label =
    mode === "upcoming"
      ? "Promo Dimulai Dalam:"
      : phaseName
      ? `Kuota Fase ${phaseName} Berakhir:`
      : "Order Ditutup Dalam:";

  return (
    <div className="flex flex-col items-center sm:items-start gap-2">
      <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 drop-shadow-sm flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
        {label}
      </span>
      <div className="flex gap-2 sm:gap-2.5 text-white">
        <div className="flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-slate-700/70 min-w-[3.5rem] sm:min-w-[4rem] shadow-sm">
          <span className="text-xl sm:text-2xl font-black font-mono tabular-nums leading-none text-white">
            {mounted ? timeLeft.days : "--"}
          </span>
          <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 mt-1">Hari</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-slate-700/70 min-w-[3.5rem] sm:min-w-[4rem] shadow-sm">
          <span className="text-xl sm:text-2xl font-black font-mono tabular-nums leading-none text-white">
            {mounted ? String(timeLeft.hours).padStart(2, "0") : "--"}
          </span>
          <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 mt-1">Jam</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-slate-700/70 min-w-[3.5rem] sm:min-w-[4rem] shadow-sm">
          <span className="text-xl sm:text-2xl font-black font-mono tabular-nums leading-none text-white">
            {mounted ? String(timeLeft.minutes).padStart(2, "0") : "--"}
          </span>
          <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 mt-1">Menit</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-slate-700/70 min-w-[3.5rem] sm:min-w-[4rem] shadow-sm">
          <span className="text-xl sm:text-2xl font-black font-mono tabular-nums leading-none text-amber-400">
            {mounted ? String(timeLeft.seconds).padStart(2, "0") : "--"}
          </span>
          <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 mt-1">Detik</span>
        </div>
      </div>
    </div>
  );
}
