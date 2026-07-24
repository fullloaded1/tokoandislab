import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import ClientLogos from "./ClientLogos";
import { COMPANY_FACTS } from "@/lib/companyFacts";

describe("ClientLogos Component Tests (Institutional Polish & Testimonials)", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the client logos header with COMPANY_FACTS and embeds ClientTestimonial", () => {
    render(<ClientLogos />);

    expect(screen.getByRole("heading", { name: `Telah Dipercaya Oleh ${COMPANY_FACTS.clientsCount} Instansi & Industri` })).toBeDefined();
    expect(screen.getByText(new RegExp(COMPANY_FACTS.coverageArea, "i"))).toBeDefined();

    // Check embedded ClientTestimonial content
    expect(screen.getByText(/Pengalaman Pengadaan Klien Instansi/i)).toBeDefined();
    expect(screen.getByText(/Pejabat Pembuat Komitmen \(PPK\)/i)).toBeDefined();
  });
});
