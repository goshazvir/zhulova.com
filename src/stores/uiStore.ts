import { create } from 'zustand';

/**
 * UI State Store
 * Manages global UI state like mobile menu, modals, etc.
 */
interface UIState {
  // Mobile menu state
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openMobileMenu: () => void;

  // Consultation modal state
  isConsultationModalOpen: boolean;
  openConsultationModal: () => void;
  closeConsultationModal: () => void;

  // Active navigation section
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isMobileMenuOpen: false,
  isConsultationModalOpen: false,
  activeSection: 'home',

  // Mobile menu actions
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  openMobileMenu: () => set({ isMobileMenuOpen: true }),

  // Consultation modal actions
  openConsultationModal: () => set({ isConsultationModalOpen: true }),

  closeConsultationModal: () => set({ isConsultationModalOpen: false }),

  // Active section actions
  setActiveSection: (section: string) => set({ activeSection: section }),
}));
