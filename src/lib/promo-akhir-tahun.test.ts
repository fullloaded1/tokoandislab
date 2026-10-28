import { describe, it, expect } from "vitest";
import {
  formatCutoffDate,
  getPromoState,
  formatPromoRupiah,
  sortProductsByPrice,
  getStockLabel,
  buildProductSphMessage,
  buildPromoWaUrl,
  getCatalogByNumber,
  HERO_SPH_MESSAGE,
} from "./promo-akhir-tahun";
import { catalogs, PO_CUTOFF_JAWA, PO_CUTOFF_LUAR_JAWA, WA_NUMBER } from "@/data/promo-akhir-tahun";

describe("promo-akhir-tahun logic tests", () => {
  it("formats cutoff dates accurately in Indonesian format", () => {
    expect(formatCutoffDate(PO_CUTOFF_JAWA)).toBe("22 Des");
    expect(formatCutoffDate(PO_CUTOFF_LUAR_JAWA)).toBe("15 Des");
  });

  describe("getPromoState phase transitions", () => {
    it("returns 'upcoming' before PROMO_START (e.g. 29 Okt 2026 23:59:59 WIB)", () => {
      const state = getPromoState(new Date("2026-10-29T23:59:59+07:00"));
      expect(state.mode).toBe("upcoming");
      expect(state.phaseId).toBe("upcoming");
      expect(state.phaseName).toBe("Segera Hadir");
      expect(state.isCutoffPassed).toBe(false);
    });

    it("returns 'early-bird' on 30 Okt 2026 00:00:00 WIB", () => {
      const state = getPromoState(new Date("2026-10-30T00:00:00+07:00"));
      expect(state.mode).toBe("active");
      expect(state.phaseId).toBe("early-bird");
      expect(state.phaseName).toBe("Early Bird");
      expect(state.message).toContain("Kunci stok dan harga sekarang");
    });

    it("returns 'early-bird' on 20 Nov 2026 23:59:59 WIB", () => {
      const state = getPromoState(new Date("2026-11-20T23:59:59+07:00"));
      expect(state.phaseId).toBe("early-bird");
    });

    it("returns 'serapan' on 21 Nov 2026 00:00:00 WIB", () => {
      const state = getPromoState(new Date("2026-11-21T00:00:00+07:00"));
      expect(state.phaseId).toBe("serapan");
      expect(state.message).toContain("Kejar PO akhir tahun");
    });

    it("returns 'last-call' on 16 Des 2026 00:00:00 WIB before cutoff", () => {
      const state = getPromoState(new Date("2026-12-16T00:00:00+07:00"));
      expect(state.phaseId).toBe("last-call");
      expect(state.isCutoffPassed).toBe(false);
      expect(state.message).toContain("22 Des (Jawa) atau 15 Des (luar Jawa)");
    });

    it("switches to 'cut-off terlewati' after 22 Des 2026 23:59:59 WIB", () => {
      const state = getPromoState(new Date("2026-12-23T00:00:01+07:00"));
      expect(state.phaseId).toBe("last-call");
      expect(state.isCutoffPassed).toBe(true);
      expect(state.message).toBe("Cut-off pengiriman terlewati. Hubungi kami untuk cek ketersediaan dan jadwal.");
    });

    it("returns 'ended' after PROMO_END (e.g. 31 Des 2026 00:00:01 WIB)", () => {
      const state = getPromoState(new Date("2026-12-31T00:00:01+07:00"));
      expect(state.mode).toBe("ended");
      expect(state.phaseId).toBe("ended");
      expect(state.phaseName).toBe("Promo Berakhir");
    });
  });

  describe("Product sorting and formatting", () => {
    it("sorts products by price descending across all catalogs", () => {
      expect(catalogs[0].products.length).toBe(14);
      expect(catalogs[1].products.length).toBe(8);
      expect(catalogs[2].products.length).toBe(28);

      const cat1 = catalogs[0];
      const sorted = sortProductsByPrice(cat1.products);
      expect(sorted[0].normalPrice).toBeGreaterThanOrEqual(sorted[sorted.length - 1].normalPrice);
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].normalPrice).toBeGreaterThanOrEqual(sorted[i + 1].normalPrice);
      }
    });

    it("formats IDR price cleanly with Rp and dots", () => {
      expect(formatPromoRupiah(25000000)).toBe("Rp 25.000.000");
      expect(formatPromoRupiah(18731250)).toBe("Rp 18.731.250");
    });

    it("formats stock label accurately per requirements", () => {
      expect(getStockLabel(1)).toBe("Unit terakhir");
      expect(getStockLabel(2)).toBe("Tersisa 2 unit");
      expect(getStockLabel(5)).toBe("Tersisa 5 unit");
    });

    it("builds correct SPH message and WhatsApp URL", () => {
      const msg = buildProductSphMessage("Linear Shaker", "SHK-L710");
      expect(msg).toBe("Halo AndisLab, saya mau minta SPH untuk Linear Shaker SHK-L710 (Promo Akhir Tahun).");

      const url = buildPromoWaUrl(msg);
      expect(url).toContain(`https://wa.me/${WA_NUMBER}`);
      expect(url).toContain(encodeURIComponent(msg));

      const heroUrl = buildPromoWaUrl(HERO_SPH_MESSAGE);
      expect(heroUrl).toContain(encodeURIComponent("Halo AndisLab, saya mau minta SPH untuk Promo Akhir Tahun."));
    });

    it("retrieves catalog by number 1, 2, and 3", () => {
      expect(getCatalogByNumber(1)?.id).toBe("katalog-1");
      expect(getCatalogByNumber("2")?.id).toBe("katalog-2");
      expect(getCatalogByNumber(3)?.id).toBe("katalog-3");
      expect(getCatalogByNumber(4)).toBeUndefined();
    });
  });
});
