import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import RFQCartDrawer from "./RFQCartDrawer";
import { useRFQStore } from "../store/useRFQStore";
import { WA_NUMBER } from "../lib/contact";

// Mock useRouter
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("RFQCartDrawer component tests (TDD & Accessibility)", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    useRFQStore.setState({
      isCartOpen: false,
      cartType: "DIRECT",
      items: [
        {
          id: "item-1",
          productId: "prod-1",
          variantId: "var-1",
          slug: "beaker-glass",
          name: "Beaker Glass Pyrex 250ml",
          image: "/images/beaker.jpg",
          category: "Alat Gelas",
          price: 150000,
          qty: 2,
          type: "DIRECT",
        },
      ],
    });
  });

  it("renders with role='dialog' and aria-modal='true' when open is true", () => {
    render(<RFQCartDrawer open={true} onClose={vi.fn()} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeDefined();
    expect(dialog.getAttribute("aria-modal")).toBe("true");
  });

  it("calls onClose when Escape key is pressed while drawer is open", () => {
    const onCloseMock = vi.fn();
    render(<RFQCartDrawer open={true} onClose={onCloseMock} />);
    
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("displays B2B PPN disclaimer when items are present", () => {
    render(<RFQCartDrawer open={true} onClose={vi.fn()} />);
    expect(screen.getAllByText(/Harga belum termasuk PPN 12% dan ongkos kirim/i).length).toBeGreaterThan(0);
  });

  it("renders textarea for notes and direct WhatsApp button when cartType is RFQ", () => {
    useRFQStore.setState({
      isCartOpen: true,
      cartType: "RFQ",
      notes: "",
      items: [
        {
          id: "item-rfq-1",
          productId: "prod-1",
          slug: "beaker-glass",
          name: "Beaker Glass Pyrex 250ml",
          image: "/images/beaker.jpg",
          category: "Alat Gelas",
          price: 150000,
          qty: 2,
          type: "RFQ",
        },
      ],
    });

    const windowOpenSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    render(<RFQCartDrawer open={true} onClose={vi.fn()} />);
    
    const textarea = screen.getByPlaceholderText(/Misal: Butuh instalasi/i) as HTMLTextAreaElement;
    expect(textarea).toBeDefined();
    fireEvent.change(textarea, { target: { value: "Butuh kalibrasi KAN" } });
    expect(useRFQStore.getState().notes).toBe("Butuh kalibrasi KAN");

    const waBtn = screen.getByText(/Kirim Penawaran Langsung via WhatsApp/i);
    expect(waBtn).toBeDefined();
    fireEvent.click(waBtn);

    expect(windowOpenSpy).toHaveBeenCalledWith(
      expect.stringContaining(WA_NUMBER),
      "_blank",
      expect.any(String)
    );
    expect(windowOpenSpy).toHaveBeenCalledWith(
      expect.stringContaining("kalibrasi%20KAN"),
      "_blank",
      expect.any(String)
    );

    windowOpenSpy.mockRestore();
  });
});
