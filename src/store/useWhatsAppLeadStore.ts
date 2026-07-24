"use client";

import { create } from "zustand";

interface WhatsAppLeadModalState {
  isOpen: boolean;
  source: string;
  text: string;
  productId?: string;
  productName?: string;
  inquiryNo?: string;
  openModal: (params: {
    source: string;
    text: string;
    productId?: string;
    productName?: string;
    inquiryNo?: string;
  }) => void;
  closeModal: () => void;
}

export const useWhatsAppLeadStore = create<WhatsAppLeadModalState>((set) => ({
  isOpen: false,
  source: "unknown",
  text: "",
  productId: undefined,
  productName: undefined,
  inquiryNo: undefined,
  openModal: (params) => set({ isOpen: true, ...params }),
  closeModal: () => set({ isOpen: false }),
}));
