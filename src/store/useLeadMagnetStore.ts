import { create } from 'zustand';

interface LeadMagnetState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useLeadMagnetStore = create<LeadMagnetState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
