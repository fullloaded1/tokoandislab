/* Hallmark · component: Countdown · genre: modern-minimal · microinteraction: tabular-nums · contrast: pass */
"use client";

import { useEffect, useState } from "react";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isEnded: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false,
  });

  useEffect(() => {
    // Target date: 14 Agustus 2026 23:59:59 WIB (UTC+7)
    const targetDate = new Date("2026-08-14T23:59:59+07:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isEnded: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  if (timeLeft.isEnded) {
    return (
      <div className="mt-6 inline-flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/10 text-white animate-pulse">
        <span className="text-xs font-bold uppercase tracking-wider text-red-400">Promo Selesai</span>
        <span className="text-sm font-semibold mt-1">Periode pemesanan resmi telah ditutup</span>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col items-start gap-2">
      <span className="text-xs font-extrabold uppercase tracking-wider text-yellow-300 drop-shadow">
        Order ditutup dalam:
      </span>
      <div className="flex gap-2 text-white">
        <div className="flex flex-col items-center bg-black/45 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10 min-w-[3.5rem] transition-colors duration-200 ease-[var(--ease-out)]">
          <span className="text-xl sm:text-2xl font-black font-mono tabular-nums">{timeLeft.days}</span>
          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-300">Hari</span>
        </div>
        <div className="flex flex-col items-center bg-black/45 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10 min-w-[3.5rem] transition-colors duration-200 ease-[var(--ease-out)]">
          <span className="text-xl sm:text-2xl font-black font-mono tabular-nums">{timeLeft.hours}</span>
          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-300">Jam</span>
        </div>
        <div className="flex flex-col items-center bg-black/45 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10 min-w-[3.5rem] transition-colors duration-200 ease-[var(--ease-out)]">
          <span className="text-xl sm:text-2xl font-black font-mono tabular-nums">{timeLeft.minutes}</span>
          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-300">Menit</span>
        </div>
        <div className="flex flex-col items-center bg-black/45 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10 min-w-[3.5rem] transition-colors duration-200 ease-[var(--ease-out)]">
          <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-red-400">{timeLeft.seconds}</span>
          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-300">Detik</span>
        </div>
      </div>
    </div>
  );
}
