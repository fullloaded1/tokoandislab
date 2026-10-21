import { describe, it, expect } from "vitest";
import {
  isWithinBusinessHours,
  getNextOpeningText,
  getBusinessHoursStatus,
  calculateWeeklyProgress,
  getWIBComponents,
  getWIBWeekBounds,
  WEEKLY_LEAD_TARGET,
} from "./businessHours";

describe("businessHours logic (Selasa - Jumat 09:00 - 15:00 WIB)", () => {
  // Helper to create Date from WIB ISO string
  const makeWIBDate = (isoStr: string) => new Date(`${isoStr}+07:00`);

  it("should correctly identify Tuesday within hours (09:00 - 15:00 WIB)", () => {
    // 2026-10-20 is Tuesday
    const morningEarly = makeWIBDate("2026-10-20T08:59:00");
    const openTime = makeWIBDate("2026-10-20T09:00:00");
    const midDay = makeWIBDate("2026-10-20T12:00:00");
    const beforeClosing = makeWIBDate("2026-10-20T14:59:59");
    const closedTime = makeWIBDate("2026-10-20T15:00:00");

    expect(isWithinBusinessHours(morningEarly)).toBe(false);
    expect(isWithinBusinessHours(openTime)).toBe(true);
    expect(isWithinBusinessHours(midDay)).toBe(true);
    expect(isWithinBusinessHours(beforeClosing)).toBe(true);
    expect(isWithinBusinessHours(closedTime)).toBe(false);
  });

  it("should be closed on Saturday, Sunday, and Monday", () => {
    // 2026-10-24 is Saturday, 2026-10-25 is Sunday, 2026-10-26 is Monday
    const saturday = makeWIBDate("2026-10-24T11:00:00");
    const sunday = makeWIBDate("2026-10-25T14:00:00");
    const monday = makeWIBDate("2026-10-26T10:00:00");

    expect(isWithinBusinessHours(saturday)).toBe(false);
    expect(isWithinBusinessHours(sunday)).toBe(false);
    expect(isWithinBusinessHours(monday)).toBe(false);
  });

  it("should give correct next opening messages", () => {
    // Early Tuesday morning (08:00) -> Hari ini pukul 09.00 WIB
    const tueEarly = makeWIBDate("2026-10-20T08:00:00");
    expect(getNextOpeningText(tueEarly)).toBe("Hari ini pukul 09.00 WIB");

    // Tuesday evening (16:00) -> Besok pukul 09.00 WIB
    const tueEve = makeWIBDate("2026-10-20T16:00:00");
    expect(getNextOpeningText(tueEve)).toBe("Besok pukul 09.00 WIB");

    // Friday evening (15:30) -> Selasa pukul 09.00 WIB
    const friEve = makeWIBDate("2026-10-23T15:30:00");
    expect(getNextOpeningText(friEve)).toBe("Selasa pukul 09.00 WIB");

    // Sunday (12:00) -> Selasa pukul 09.00 WIB
    const sunNoon = makeWIBDate("2026-10-25T12:00:00");
    expect(getNextOpeningText(sunNoon)).toBe("Selasa pukul 09.00 WIB");

    // Monday (10:00) -> Besok (Selasa) pukul 09.00 WIB
    const monMorning = makeWIBDate("2026-10-26T10:00:00");
    expect(getNextOpeningText(monMorning)).toBe("Besok (Selasa) pukul 09.00 WIB");
  });

  it("should return comprehensive badge status", () => {
    const active = makeWIBDate("2026-10-21T11:30:00"); // Wednesday 11:30
    const badgeActive = getBusinessHoursStatus(active);
    expect(badgeActive.isOpen).toBe(true);
    expect(badgeActive.label).toBe("Konsultan Online");

    const closed = makeWIBDate("2026-10-25T19:00:00"); // Sunday 19:00
    const badgeClosed = getBusinessHoursStatus(closed);
    expect(badgeClosed.isOpen).toBe(false);
    expect(badgeClosed.label).toBe("Di Luar Jam Kerja");
    expect(badgeClosed.sublabel).toContain("Selasa");
  });

  it("should calculate weekly progress against target of 20 leads", () => {
    // Set reference now to Wednesday 2026-10-21 12:00 WIB
    const now = makeWIBDate("2026-10-21T12:00:00");

    const mockLogs = [
      // Current week logs (Monday 2026-10-19 to Sunday 2026-10-25)
      {
        createdAt: makeWIBDate("2026-10-19T10:00:00"), // Monday (off-hours)
        status: "NEW",
        leadName: "Dr. Bambang",
        leadInstitution: "ITB",
        leadPhone: "0812345678",
      },
      {
        createdAt: makeWIBDate("2026-10-20T10:30:00"), // Tuesday (online)
        status: "CONTACTED",
        leadName: "Siti",
        leadInstitution: "PT Kimia Farma",
        leadPhone: "0819876543",
      },
      {
        createdAt: makeWIBDate("2026-10-20T16:00:00"), // Tuesday evening (off-hours)
        status: "NEW",
        leadName: null,
        leadInstitution: null,
        leadPhone: null, // Raw click
      },
      // Last week log (2026-10-14)
      {
        createdAt: makeWIBDate("2026-10-14T11:00:00"),
        status: "WON",
        leadName: "Ahmad",
      },
    ];

    const report = calculateWeeklyProgress(mockLogs, now);

    expect(report.target).toBe(20);
    expect(report.thisWeekTotal).toBe(3);
    expect(report.thisWeekQualified).toBe(2);
    expect(report.thisWeekRaw).toBe(1);
    expect(report.thisWeekOffHours).toBe(2); // Monday + Tuesday evening
    expect(report.lastWeekTotal).toBe(1);
    expect(report.percentage).toBe(15); // (3 / 20) * 100 = 15%
    expect(report.remaining).toBe(17);
    expect(report.isTargetAchieved).toBe(false);
    expect(report.growthPercentage).toBe(200); // from 1 to 3 = +200%
  });
});
