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
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isMobileMenuOpen: false,

  // Actions
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  openMobileMenu: () => set({ isMobileMenuOpen: true }),
}));
