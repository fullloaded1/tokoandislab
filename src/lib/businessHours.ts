/**
 * Logika Jam Operasional & Pelacakan Target Leads Mingguan AndisLab
 *
 * Kebijakan Operasional:
 * - Hari aktif: Selasa s/d Jumat
 * - Jam aktif: 09:00 - 15:00 WIB (Asia/Jakarta, UTC+7)
 * - Di luar jam ini: status offline / antrian prioritas
 * - Target: 20 leads / minggu (Senin - Minggu WIB)
 */

export const WEEKLY_LEAD_TARGET = 20;

export interface BusinessHoursStatus {
  isOpen: boolean;
  label: string;
  sublabel: string;
  nextOpeningText: string;
}

export interface WIBDateComponents {
  dayOfWeek: number; // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  hour: number;      // 0 - 23
  minute: number;    // 0 - 59
  year: number;
  month: number;     // 1 - 12
  day: number;       // 1 - 31
}

/**
 * Konversi tanggal apapun ke komponen waktu WIB (Asia/Jakarta, UTC+7)
 * Menggunakan Intl.DateTimeFormat agar konsisten di server, client, maupun CI.
 */
export function getWIBComponents(date: Date = new Date()): WIBDateComponents {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const partMap: Record<string, string> = {};
  for (const p of parts) {
    partMap[p.type] = p.value;
  }

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const rawHour = parseInt(partMap.hour || "0", 10);
  // Handle edge case where midnight is formatted as 24 in some environments
  const hour = rawHour === 24 ? 0 : rawHour;

  return {
    dayOfWeek: weekdayMap[partMap.weekday] ?? 0,
    hour,
    minute: parseInt(partMap.minute || "0", 10),
    year: parseInt(partMap.year || "0", 10),
    month: parseInt(partMap.month || "0", 10),
    day: parseInt(partMap.day || "0", 10),
  };
}

/**
 * Mengecek apakah suatu waktu berada dalam jam kerja AndisLab (Selasa-Jumat 09:00 - 15:00 WIB)
 */
export function isWithinBusinessHours(date: Date = new Date()): boolean {
  const { dayOfWeek, hour } = getWIBComponents(date);

  // Hari kerja: Selasa (2), Rabu (3), Kamis (4), Jumat (5)
  const isWorkDay = dayOfWeek >= 2 && dayOfWeek <= 5;
  if (!isWorkDay) return false;

  // Jam operasional: 09.00 s/d 15.00 WIB
  return hour >= 9 && hour < 15;
}

/**
 * Mendapatkan keterangan waktu buka berikutnya saat sedang di luar jam kerja
 */
export function getNextOpeningText(date: Date = new Date()): string {
  const { dayOfWeek, hour } = getWIBComponents(date);

  // 1. Hari kerja sebelum jam 9
  if (dayOfWeek >= 2 && dayOfWeek <= 5 && hour < 9) {
    return "Hari ini pukul 09.00 WIB";
  }

  // 2. Selasa - Kamis setelah jam 15
  if (dayOfWeek >= 2 && dayOfWeek <= 4 && hour >= 15) {
    return "Besok pukul 09.00 WIB";
  }

  // 3. Jumat setelah jam 15
  if (dayOfWeek === 5 && hour >= 15) {
    return "Selasa pukul 09.00 WIB";
  }

  // 4. Sabtu & Minggu
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return "Selasa pukul 09.00 WIB";
  }

  // 5. Senin
  if (dayOfWeek === 1) {
    return "Besok (Selasa) pukul 09.00 WIB";
  }

  return "Selasa pukul 09.00 WIB";
}

/**
 * Status jam operasional untuk komponen badge di website
 */
export function getBusinessHoursStatus(date: Date = new Date()): BusinessHoursStatus {
  const open = isWithinBusinessHours(date);
  const nextOpening = getNextOpeningText(date);

  if (open) {
    return {
      isOpen: true,
      label: "Konsultan Online",
      sublabel: "Aktif melayani penawaran & konsultasi (09.00 - 15.00 WIB)",
      nextOpeningText: "Tutup hari ini pukul 15.00 WIB",
    };
  }

  return {
    isOpen: false,
    label: "Di Luar Jam Kerja",
    sublabel: `Pesan ditampung & diproses prioritas: ${nextOpening}`,
    nextOpeningText: nextOpening,
  };
}

export interface LeadLogMinimal {
  createdAt: string | Date;
  status: string;
  source?: string | null;
  leadName?: string | null;
  leadInstitution?: string | null;
  leadPhone?: string | null;
}

export interface WeeklyProgressReport {
  target: number;
  thisWeekTotal: number;
  thisWeekQualified: number;
  thisWeekRaw: number;
  thisWeekOffHours: number;
  lastWeekTotal: number;
  percentage: number;
  remaining: number;
  isTargetAchieved: boolean;
  growthPercentage: number;
  weekStartStr: string;
  weekEndStr: string;
}

/**
 * Mendapatkan rentang timestamp awal & akhir minggu (Senin 00:00:00 WIB s/d Minggu 23:59:59 WIB)
 */
export function getWIBWeekBounds(now: Date = new Date()) {
  const wib = getWIBComponents(now);

  // Hitung hari sejak Senin (Senin = 0, Selasa = 1, ..., Minggu = 6)
  const daysSinceMonday = (wib.dayOfWeek + 6) % 7;

  // Hitung epoch WIB
  const msPerDay = 24 * 60 * 60 * 1000;
  const nowMs = now.getTime();
  const wibOffsetMs = 7 * 60 * 60 * 1000;
  const currentWIBMs = nowMs + wibOffsetMs;

  const currentWIBDayStartMs = Math.floor(currentWIBMs / msPerDay) * msPerDay;
  const startOfThisWeekWIBMs = currentWIBDayStartMs - (daysSinceMonday * msPerDay);
  
  // Konversi kembali ke UTC Epoch
  const thisWeekStart = new Date(startOfThisWeekWIBMs - wibOffsetMs);
  const thisWeekEnd = new Date(startOfThisWeekWIBMs + (7 * msPerDay) - 1 - wibOffsetMs);

  const lastWeekStart = new Date(startOfThisWeekWIBMs - (7 * msPerDay) - wibOffsetMs);
  const lastWeekEnd = new Date(startOfThisWeekWIBMs - 1 - wibOffsetMs);

  return {
    thisWeekStart,
    thisWeekEnd,
    lastWeekStart,
    lastWeekEnd,
  };
}

/**
 * Menghitung progres pencapaian target 20 leads/minggu dari daftar logs
 */
export function calculateWeeklyProgress(
  logs: LeadLogMinimal[],
  now: Date = new Date()
): WeeklyProgressReport {
  const { thisWeekStart, thisWeekEnd, lastWeekStart, lastWeekEnd } = getWIBWeekBounds(now);

  const startMs = thisWeekStart.getTime();
  const endMs = thisWeekEnd.getTime();
  const lastStartMs = lastWeekStart.getTime();
  const lastEndMs = lastWeekEnd.getTime();

  let thisWeekTotal = 0;
  let thisWeekQualified = 0;
  let thisWeekOffHours = 0;
  let lastWeekTotal = 0;

  for (const log of logs) {
    const t = new Date(log.createdAt).getTime();
    if (t >= startMs && t <= endMs) {
      thisWeekTotal++;
      
      const isQualified = Boolean(
        (log.leadName && log.leadName.trim()) ||
        (log.leadPhone && log.leadPhone.trim()) ||
        (log.leadInstitution && log.leadInstitution.trim()) ||
        ["CONTACTED", "OFFERS", "WON"].includes(log.status)
      );

      if (isQualified) {
        thisWeekQualified++;
      }

      if (!isWithinBusinessHours(new Date(log.createdAt))) {
        thisWeekOffHours++;
      }
    } else if (t >= lastStartMs && t <= lastEndMs) {
      lastWeekTotal++;
    }
  }

  const thisWeekRaw = thisWeekTotal - thisWeekQualified;
  const percentage = Math.min(100, Math.round((thisWeekTotal / WEEKLY_LEAD_TARGET) * 100));
  const remaining = Math.max(0, WEEKLY_LEAD_TARGET - thisWeekTotal);
  const isTargetAchieved = thisWeekTotal >= WEEKLY_LEAD_TARGET;

  const growthPercentage = lastWeekTotal > 0
    ? Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100)
    : thisWeekTotal > 0 ? 100 : 0;

  const formatDate = (d: Date) =>
    d.toLocaleDateString("id-ID", { day: "numeric", month: "short", timeZone: "Asia/Jakarta" });

  return {
    target: WEEKLY_LEAD_TARGET,
    thisWeekTotal,
    thisWeekQualified,
    thisWeekRaw,
    thisWeekOffHours,
    lastWeekTotal,
    percentage,
    remaining,
    isTargetAchieved,
    growthPercentage,
    weekStartStr: formatDate(thisWeekStart),
    weekEndStr: formatDate(thisWeekEnd),
  };
}
