import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './index';

describe('Modal Component', () => {
  const mockOnClose = vi.fn();

  it('renders when isOpen prop is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render when isOpen prop is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal title', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="My Modal Title">
        <div>Content</div>
      </Modal>
    );
    expect(screen.getByText('My Modal Title')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={handleClose} title="Test">
        <div>Content</div>
      </Modal>
    );

    const closeButton = screen.getByLabelText(/закрити|close/i);
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    const { container } = render(
      <Modal isOpen={true} onClose={handleClose} title="Test">
        <div>Content</div>
      </Modal>
    );

    // Find backdrop element (it has aria-hidden="true" and onClick handler)
    const backdrop = container.querySelector('[aria-hidden="true"]');
    expect(backdrop).toBeTruthy();

    if (backdrop) {
      await user.click(backdrop);
      expect(handleClose).toHaveBeenCalled();
    }
  });

  it('moves focus into the dialog on open', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <button type="button">Action</button>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('returns focus to the previously focused element on close', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Open modal';
    document.body.appendChild(trigger);
    trigger.focus();

    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <button type="button">Action</button>
      </Modal>
    );
    expect(document.activeElement).not.toBe(trigger);

    rerender(
      <Modal isOpen={false} onClose={mockOnClose} title="Test">
        <button type="button">Action</button>
      </Modal>
    );

    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('traps Tab within the dialog (last → first)', async () => {
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <button type="button">Last action</button>
      </Modal>
    );

    const closeButton = screen.getByLabelText(/закрити/i);
    const lastButton = screen.getByText('Last action');

    lastButton.focus();
    await user.tab();

    expect(document.activeElement).toBe(closeButton);
  });

  it('traps Shift+Tab within the dialog (first → last)', async () => {
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <button type="button">Last action</button>
      </Modal>
    );

    const closeButton = screen.getByLabelText(/закрити/i);
    const lastButton = screen.getByText('Last action');

    closeButton.focus();
    await user.tab({ shift: true });

    expect(document.activeElement).toBe(lastButton);
  });

  describe('entry animation (animateEntry)', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('starts hidden and becomes visible after an animation frame when animateEntry is set', () => {
      vi.useFakeTimers();
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test" animateEntry>
          <div>Content</div>
        </Modal>
      );

      const panel = container.querySelector('.max-w-lg');
      expect(panel).toHaveClass('opacity-0', 'scale-95');

      act(() => {
        vi.advanceTimersByTime(50); // flush requestAnimationFrame
      });

      expect(panel).toHaveClass('opacity-100', 'scale-100');
    });

    it('renders fully visible immediately when animateEntry is not set', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <div>Content</div>
        </Modal>
      );

      const panel = container.querySelector('.max-w-lg');
      expect(panel).toHaveClass('opacity-100', 'scale-100');
      expect(panel).not.toHaveClass('opacity-0');
    });
  });

  it('has proper ARIA attributes', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Accessible Modal">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
  });
});
