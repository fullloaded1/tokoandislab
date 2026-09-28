/* Hallmark · component: PromoMilenianCountdown · genre: corporate-b2b */
"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
}

export default function PromoMilenianCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: false,
  });

  useEffect(() => {
    // Target: 28 Oktober 2026 23:59:59 WIB (UTC+7)
    const target = new Date("2026-10-28T23:59:59+07:00").getTime();

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true });
        return;
      }
      setTimeLeft({
        days:    Math.floor(diff / 86_400_000),
        hours:   Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000)  / 60_000),
        seconds: Math.floor((diff % 60_000)      / 1_000),
        isEnded: false,
      });
    };

    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, []);

  if (timeLeft.isEnded) {
    return (
      <div className="mt-5 inline-flex flex-col items-center bg-black/40 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/10 text-white">
        <span className="text-xs font-bold uppercase tracking-wider text-red-400">Promo Telah Berakhir</span>
        <span className="text-sm font-semibold mt-1">Periode penawaran resmi sudah ditutup</span>
      </div>
    );
  }

  const tiles = [
    { value: timeLeft.days,    label: "Hari" },
    { value: timeLeft.hours,   label: "Jam" },
    { value: timeLeft.minutes, label: "Menit" },
    { value: timeLeft.seconds, label: "Detik" },
  ];

  return (
    <div className="mt-5 flex flex-col items-start gap-2">
      <span className="pm-countdown-label">Penawaran berakhir dalam:</span>
      <div className="flex gap-2">
        {tiles.map(({ value, label }) => (
          <div key={label} className="pm-countdown-tile">
            <span className="pm-countdown-num">{String(value).padStart(2, "0")}</span>
            <span className="pm-countdown-unit">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
