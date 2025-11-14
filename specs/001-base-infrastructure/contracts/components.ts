/**
 * Component Contracts for Base Infrastructure & Design System
 *
 * This file defines the TypeScript interfaces and contracts for all
 * components in the base infrastructure. These contracts serve as the
 * source of truth for component props and ensure type safety across
 * the application.
 */

// ============================================================================
// Layout Components
// ============================================================================

/**
 * BaseLayout Component Contract
 * Main layout wrapper providing SEO, meta tags, and document structure
 */
export interface BaseLayoutProps {
  // SEO Meta Tags
  title?: string;                    // Page title (50-60 chars recommended)
  description?: string;               // Meta description (150-160 chars recommended)
  image?: string;                     // Open Graph image URL
  canonical?: string;                 // Canonical URL

  // Page Configuration
  noindex?: boolean;                  // Prevent search engine indexing
  type?: 'website' | 'article';       // Open Graph type

  // Additional Elements
  class?: string;                     // CSS classes (Astro convention)
  'class:list'?: any;                 // Conditional classes (Astro)
}

// ============================================================================
// Navigation Components
// ============================================================================

/**
 * Header Component Contract
 * Site header with navigation and branding
 */
export interface HeaderProps {
  navigationItems: NavigationItem[];   // Main navigation links
  currentPath: string;                 // Current page path
  logoSrc?: string;                    // Logo image source
  logoAlt?: string;                    // Logo alt text
  siteName?: string;                   // Site name (if no logo)
  sticky?: boolean;                    // Sticky header on scroll
  class?: string;                      // Additional CSS classes
}

/**
 * Navigation Item Structure
 */
export interface NavigationItem {
  id: string;                          // Unique identifier
  label: string;                       // Display text
  href: string;                        // Link URL
  ariaLabel?: string;                  // Accessibility label
  external?: boolean;                  // External link flag
  icon?: string;                       // Optional icon
}

/**
 * Footer Component Contract
 * Site footer with links, social media, and copyright
 */
export interface FooterProps {
  companyName: string;                 // Company/brand name
  copyrightYear?: number;              // Copyright year
  navigationGroups?: FooterNavGroup[]; // Footer navigation sections
  socialLinks?: SocialLink[];          // Social media profiles
  legalLinks?: NavigationItem[];       // Privacy, Terms, etc.
  class?: string;                      // Additional CSS classes
}

/**
 * Footer Navigation Group
 */
export interface FooterNavGroup {
  title: string;                       // Section title
  items: NavigationItem[];             // Navigation links
}

/**
 * Social Media Link
 */
export interface SocialLink {
  platform: SocialPlatform;            // Social media platform
  url: string;                         // Profile URL
  ariaLabel: string;                   // Accessibility label
}

export type SocialPlatform =
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'pinterest';

// ============================================================================
// Interactive Components (React)
// ============================================================================

/**
 * Button Component Contract
 * Reusable button with variants
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Card Component Contract
 * Content card with optional image
 */
export interface CardProps {
  title?: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
  };
  link?: {
    href: string;
    label: string;
  };
  variant?: 'default' | 'featured';
  class?: string;
}

/**
 * Modal Component Contract
 * Accessible modal dialog
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
}

/**
 * Toast Notification Contract
 * Temporary notification message
 */
export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;                   // Auto-dismiss after ms
  dismissible?: boolean;               // Can be manually dismissed
  onDismiss?: (id: string) => void;
}

// ============================================================================
// Form Components
// ============================================================================

/**
 * Input Component Contract
 * Form input with validation
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  fullWidth?: boolean;
}

/**
 * Textarea Component Contract
 * Multi-line text input
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

/**
 * Select Component Contract
 * Dropdown selection input
 */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  fullWidth?: boolean;
  options: SelectOption[];
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Checkbox Component Contract
 * Single checkbox input
 */
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

/**
 * Radio Group Component Contract
 * Group of radio buttons
 */
export interface RadioGroupProps {
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  error?: string;
  required?: boolean;
}

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// ============================================================================
// Utility Components
// ============================================================================

/**
 * Icon Component Contract
 * SVG icon wrapper
 */
export interface IconProps {
  name: string;                        // Icon identifier
  size?: 'small' | 'medium' | 'large' | number;
  color?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * Spinner Component Contract
 * Loading indicator
 */
export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

/**
 * Badge Component Contract
 * Small status indicator
 */
export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium';
  children: React.ReactNode;
  className?: string;
}

// ============================================================================
// Composite Components
// ============================================================================

/**
 * Hero Section Contract
 * Large hero/banner section
 */
export interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  cta?: {
    primary?: {
      label: string;
      href: string;
    };
    secondary?: {
      label: string;
      href: string;
    };
  };
  alignment?: 'left' | 'center' | 'right';
  fullHeight?: boolean;
  class?: string;
}

/**
 * Newsletter Signup Contract
 * Email subscription form
 */
export interface NewsletterProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  onSubmit: (email: string) => Promise<void>;
  variant?: 'inline' | 'stacked';
  class?: string;
}

/**
 * Contact Form Contract
 * Full contact form component
 */
export interface ContactFormProps {
  fields?: ContactFormField[];
  onSubmit: (data: ContactFormData) => Promise<void>;
  submitButtonText?: string;
  successMessage?: string;
  errorMessage?: string;
  class?: string;
}

export interface ContactFormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];            // For select type
  validation?: ValidationRule[];
}

export interface ContactFormData {
  [key: string]: string | undefined;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message: string;
}

// ============================================================================
// Store Contracts
// ============================================================================

/**
 * UI Store Contract
 * Global UI state management
 */
export interface UIStore {
  // Mobile Menu
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;

  // Modal
  isModalOpen: boolean;
  modalContent: ModalContent | null;
  openModal: (content: ModalContent) => void;
  closeModal: () => void;

  // Toast Notifications
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Accessibility
  prefersReducedMotion: boolean;
  setPrefersReducedMotion: (value: boolean) => void;
}

export interface ModalContent {
  title: string;
  body: React.ReactNode | string;
  actions?: ModalAction[];
  size?: 'small' | 'medium' | 'large';
  closable?: boolean;
}

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  dismissible?: boolean;
}

// ============================================================================
// Type Utilities
// ============================================================================

/**
 * Astro-specific prop types
 */
export interface AstroComponentProps {
  class?: string;                      // Astro uses 'class' not 'className'
  'class:list'?: any;                  // Conditional classes in Astro
  [key: string]: any;                  // Pass-through props
}

/**
 * Common prop extensions
 */
export interface PropsWithClassName {
  className?: string;
}

export interface PropsWithChildren {
  children?: React.ReactNode;
}

/**
 * HTML attribute helpers
 */
export type HTMLAttributesWithoutRef<T> = React.HTMLAttributes<T> & {
  ref?: never;
};