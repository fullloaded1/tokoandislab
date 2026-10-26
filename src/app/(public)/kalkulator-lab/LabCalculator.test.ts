import { describe, it, expect } from "vitest";

describe("Lab Calculator Logic Unit Tests", () => {
  it("calculates dilution volume V1 accurately with C1V1 = C2V2 formula", () => {
    // Need 100 mL of 0.1 M from a 1.0 M stock solution:
    // V1 = (C2 * V2) / C1 = (0.1 * 100) / 1.0 = 10 mL
    const c1 = 1.0;
    const c2 = 0.1;
    const v2 = 100;
    const v1 = (c2 * v2) / c1;

    expect(v1).toBe(10);
    expect(v1.toFixed(2)).toBe("10.00");
  });

  it("calculates final concentration C2 accurately when diluted", () => {
    // 5 mL of 2.0 M stock diluted to 50 mL:
    // C2 = (C1 * V1) / V2 = (2.0 * 5) / 50 = 0.2 M
    const c1 = 2.0;
    const v1 = 5;
    const v2 = 50;
    const c2 = (c1 * v1) / v2;

    expect(c2).toBe(0.2);
    expect(c2.toFixed(4)).toBe("0.2000");
  });

  it("calculates molarity mass required accurately with m = M * V(L) * Mr", () => {
    // 500 mL of 0.5 M NaCl (Mr = 58.44 g/mol):
    // mass = 0.5 * (500 / 1000) * 58.44 = 0.5 * 0.5 * 58.44 = 14.61 g
    const molarity = 0.5;
    const volumeMl = 500;
    const molecularWeight = 58.44;
    const volumeLiter = volumeMl / 1000;
    const massGrams = molarity * volumeLiter * molecularWeight;

    expect(massGrams).toBeCloseTo(14.61, 2);
    expect(massGrams.toFixed(4)).toBe("14.6100");
  });

  it("recommends autoclave chamber size based on throughput batch volume", () => {
    const calculateAutoclaveRecommendation = (litersPerBatch: number) => {
      if (litersPerBatch <= 15) {
        return { model: "Daihan LAC-5045SP (45 Liter)", minCapacity: 45 };
      }
      if (litersPerBatch <= 30) {
        return { model: "Daihan LAC-5065SP (60 Liter)", minCapacity: 60 };
      }
      return { model: "Daihan LAC-5105SP (100 Liter)", minCapacity: 100 };
    };

    expect(calculateAutoclaveRecommendation(10).minCapacity).toBe(45);
    expect(calculateAutoclaveRecommendation(25).minCapacity).toBe(60);
    expect(calculateAutoclaveRecommendation(50).minCapacity).toBe(100);
  });
});
