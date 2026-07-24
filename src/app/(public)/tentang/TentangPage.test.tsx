import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import TentangPage from "./page";
import { COMPANY_FACTS } from "@/lib/companyFacts";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

describe("TentangPage Component Tests (TDD & Institutional Trust Polish)", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders Hero banner, experience stats, verified partners, and corporate values", () => {
    render(<TentangPage />);

    // Verify main institutional headline
    expect(screen.getAllByText(/Tentang AndisLab: Distributor Alat Laboratorium Resmi/i).length).toBeGreaterThan(0);
    
    // Verify stats
    expect(screen.getAllByText(new RegExp(`${COMPANY_FACTS.experienceYears}\\+`, "i")).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Tahun Pengalaman/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/500\+/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Klien Aktif/i).length).toBeGreaterThan(0);

    // Verify institutional partners
    expect(screen.getAllByText(/Lovibond/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Daihan Labtech/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pyrex®/i).length).toBeGreaterThan(0);

    // Verify core values section
    expect(screen.getAllByText(/Kualitas Terjamin/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Layanan Profesional/i).length).toBeGreaterThan(0);
  });
});
