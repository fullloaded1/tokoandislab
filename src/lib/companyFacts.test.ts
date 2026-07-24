import { describe, it, expect } from "vitest";
import { COMPANY_FACTS } from "./companyFacts";

describe("COMPANY_FACTS Single Source of Truth", () => {
  it("has consistent foundation year and calculated experience years", () => {
    expect(COMPANY_FACTS.foundYear).toBe(2010);
    expect(COMPANY_FACTS.experienceYears).toBeGreaterThanOrEqual(16);
    expect(COMPANY_FACTS.name).toBe("PT Andis Sentral Laboratorium");
    expect(COMPANY_FACTS.shortName).toBe("AndisLab");
  });
});
