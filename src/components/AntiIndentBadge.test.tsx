import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import AntiIndentBadge from "./AntiIndentBadge";

describe("AntiIndentBadge component tests", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders compact badge by default with correct text", () => {
    render(<AntiIndentBadge />);
    expect(screen.getByText("Anti Indent Club")).toBeDefined();
  });

  it("renders card variant properly", () => {
    render(<AntiIndentBadge variant="card" />);
    expect(screen.getByText("Anti Indent Club")).toBeDefined();
    expect(screen.getByText("• Ready")).toBeDefined();
  });

  it("renders banner variant with full slogan without warehouse names", () => {
    render(<AntiIndentBadge variant="banner" showConsultText={true} />);
    expect(screen.getByText("KLUB ANTI INDENT")).toBeDefined();
    expect(screen.getByText(/Barang ADA, Langsung Bisa/i)).toBeDefined();
    expect(screen.getByText(/Ngobrol Kebutuhan Gampang/i)).toBeDefined();
  });
});
