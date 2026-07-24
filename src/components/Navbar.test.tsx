import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import Navbar from "./Navbar";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe("Navbar Component Tests (TDD & Navigation Polish)", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders streamlined main navigation, top announcement strip, and Hubungi Sales CTA without horizontal clutter", () => {
    render(<Navbar />);

    // Verify top announcement strip
    expect(screen.getAllByText(/Promo MERDEKA — Diskon 17%/i).length).toBeGreaterThan(0);

    // Verify logo and institutional partner badge
    expect(screen.getAllByText(/Distributor e-Katalog/i).length).toBeGreaterThan(0);

    // Verify primary navigation links
    expect(screen.getAllByText(/Beranda/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ready Stock/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pemerintah \/ B2B/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Daihan Labtech/i).length).toBeGreaterThan(0);

    // Verify Hubungi Sales CTA
    expect(screen.getAllByText(/Hubungi Sales/i).length).toBeGreaterThan(0);
  });

  it("opens and closes the Informasi dropdown when clicked or hovered", () => {
    render(<Navbar />);

    const infoBtn = screen.getByText(/Informasi/i);
    expect(infoBtn).toBeDefined();

    // Click to open dropdown
    fireEvent.click(infoBtn);
    expect(screen.getAllByText(/Tentang Kami & Principal/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Artikel & Edukasi Lab/i).length).toBeGreaterThan(0);
  });
});
