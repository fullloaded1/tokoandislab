import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import HeroSection from "./HeroSection";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} alt={props.alt || "mocked image"} />,
}));

describe("HeroSection Component (Slider & Mobile Gestures)", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders carousel and first slide with dynamic countdown badge", () => {
    render(<HeroSection />);

    const carousel = screen.getByLabelText(/Sorotan Utama Instrumen Laboratorium AndisLab/i);
    expect(carousel).toBeDefined();

    // Check first slide headline
    expect(screen.getByText(/Tutup 2026, Buka Lab Impian/i)).toBeDefined();

    // Check dynamic countdown chip presence
    expect(screen.getByText(/Sisa \d+ Hari Penyerapan/i)).toBeDefined();
  });

  it("advances slide on next button click and keyboard ArrowRight", () => {
    render(<HeroSection />);

    const nextBtn = screen.getByLabelText(/Slide berikutnya/i);
    fireEvent.click(nextBtn);

    // After clicking next, slide 2 (Anti-indent) should be active
    expect(screen.getByText(/Alat Lab Fisik Ready di Gudang/i)).toBeDefined();

    // Test keyboard ArrowRight on carousel
    const carousel = screen.getByLabelText(/Sorotan Utama Instrumen Laboratorium AndisLab/i);
    fireEvent.keyDown(carousel, { key: "ArrowRight" });

    // Should advance to slide 3 (Pengadaan Pemerintah)
    expect(screen.getByText(/Mitra Resmi e-Katalog INAPROC/i)).toBeDefined();
  });

  it("responds to touch swipe gestures on mobile", () => {
    render(<HeroSection />);

    const carousel = screen.getByLabelText(/Sorotan Utama Instrumen Laboratorium AndisLab/i);

    // Simulate swipe left (touchStartX = 200, touchEndX = 100 -> distance = +100 > minSwipeDistance)
    fireEvent.touchStart(carousel, {
      targetTouches: [{ clientX: 200 }],
    });
    fireEvent.touchMove(carousel, {
      targetTouches: [{ clientX: 100 }],
    });
    fireEvent.touchEnd(carousel);

    // Should have advanced to slide 2
    expect(screen.getByText(/Alat Lab Fisik Ready di Gudang/i)).toBeDefined();
  });

  it("renders 4 trust feature bento cards below the banner", () => {
    render(<HeroSection />);

    expect(screen.getByText("100% Original & Garansi")).toBeDefined();
    expect(screen.getByText("Pengiriman Nasional")).toBeDefined();
    expect(screen.getByText("Engineering Support")).toBeDefined();
    expect(screen.getByText("e-Katalog INAPROC")).toBeDefined();
  });
});
