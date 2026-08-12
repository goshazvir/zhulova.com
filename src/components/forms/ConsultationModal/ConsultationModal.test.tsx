import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConsultationModal from './index';
import { useUIStore } from '@/stores/uiStore';
import { trackEvent } from '@lib/analytics';
import { createUtmStorage } from '@lib/utm';

vi.mock('@lib/analytics', () => ({ trackEvent: vi.fn() }));

// Mock the fetch API
global.fetch = vi.fn();

describe('ConsultationModal Component', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUIStore.setState({
      isConsultationModalOpen: false,
      closeConsultationModal: vi.fn(),
    });
    window.sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('does not render when modal is closed', () => {
    useUIStore.setState({ isConsultationModalOpen: false });
    render(<ConsultationModal />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders form fields when modal is open', () => {
    useUIStore.setState({ isConsultationModalOpen: true });
    render(<ConsultationModal />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/ім'я/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/телефон/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telegram/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders modal title', () => {
    useUIStore.setState({ isConsultationModalOpen: true });
    render(<ConsultationModal />);

    expect(screen.getByText(/записатись на консультацію/i)).toBeInTheDocument();
  });

  it('has submit and cancel buttons', () => {
    useUIStore.setState({ isConsultationModalOpen: true });
    render(<ConsultationModal />);

    expect(screen.getByRole('button', { name: /відправити заявку/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /скасувати/i })).toBeInTheDocument();
  });

  it('displays required field indicators', () => {
    useUIStore.setState({ isConsultationModalOpen: true });
    render(<ConsultationModal />);

    const nameInput = screen.getByLabelText(/ім'я/i);
    const phoneInput = screen.getByLabelText(/телефон/i);

    expect(nameInput).toHaveAttribute('required');
    expect(phoneInput).toHaveAttribute('required');
  });

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    useUIStore.setState({ isConsultationModalOpen: true });
    render(<ConsultationModal />);

    const submitButton = screen.getByRole('button', { name: /відправити заявку/i });
    await user.click(submitButton);

    // Form validation should prevent submission with empty required fields
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    global.fetch = mockFetch;

    useUIStore.setState({ isConsultationModalOpen: true });
    render(<ConsultationModal />);

    // Fill form fields
    await user.type(screen.getByLabelText(/ім'я/i), 'Тест Користувач');
    await user.type(screen.getByLabelText(/телефон/i), '+380501234567');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /відправити заявку/i });
    await user.click(submitButton);

    // Check if fetch was called
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/submit-lead',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  it('displays success message after successful submission', async () => {
    const user = userEvent.setup();
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    global.fetch = mockFetch;

    useUIStore.setState({ isConsultationModalOpen: true });
    render(<ConsultationModal />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/ім'я/i), 'Тест');
    await user.type(screen.getByLabelText(/телефон/i), '+380501234567');
    await user.click(screen.getByRole('button', { name: /відправити заявку/i }));

    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/дякуємо за вашу заявку/i)).toBeInTheDocument();
    });
  });

  it('displays error message on submission failure', async () => {
    const user = userEvent.setup();
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ success: false, error: { message: 'Test error' } }),
    });
    global.fetch = mockFetch;

    useUIStore.setState({ isConsultationModalOpen: true });
    render(<ConsultationModal />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/ім'я/i), 'Тест');
    await user.type(screen.getByLabelText(/телефон/i), '+380501234567');
    await user.click(screen.getByRole('button', { name: /відправити заявку/i }));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('attaches stored first-touch UTM params to the consultation_lead event (spec §4, AC6)', async () => {
    const utmStorage = createUtmStorage();
    utmStorage.write({ utm_source: 'facebook', utm_medium: 'cpc', utm_campaign: 'launch' });

    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    useUIStore.setState({ isConsultationModalOpen: true });
    render(<ConsultationModal />);

    await user.type(screen.getByLabelText(/ім'я/i), 'Тест');
    await user.type(screen.getByLabelText(/телефон/i), '+380501234567');
    await user.click(screen.getByRole('button', { name: /відправити заявку/i }));

    await waitFor(() => {
      expect(trackEvent).toHaveBeenCalledWith('consultation_lead', {
        utm_source: 'facebook',
        utm_medium: 'cpc',
        utm_campaign: 'launch',
      });
    });
  });
});
