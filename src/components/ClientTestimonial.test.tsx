import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import ClientTestimonial, { INSTITUTIONAL_TESTIMONIALS } from "./ClientTestimonial";
import { COMPANY_FACTS } from "@/lib/companyFacts";

describe("ClientTestimonial Component Tests (Institutional Trust Polish)", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the institutional testimonials header and verified quotes accurately", () => {
    render(<ClientTestimonial />);

    // Check institutional headline
    expect(screen.getByText(/Pengalaman Pengadaan Klien Instansi/i)).toBeDefined();
    expect(screen.getByText(/Kepercayaan Instansi & Industri/i)).toBeDefined();

    // Check all 3 institutional quotes
    INSTITUTIONAL_TESTIMONIALS.forEach((item) => {
      expect(screen.getByText(item.author)).toBeDefined();
      expect(screen.getByText(item.institution)).toBeDefined();
    });

    // Check SPJ and e-Katalog guarantees
    expect(screen.getByText(/Jaminan Keaslian & Kelengkapan Dokumen SPJ/i)).toBeDefined();
    expect(screen.getByText(/Terdaftar di LKPP e-Katalog/i)).toBeDefined();
  });
});
