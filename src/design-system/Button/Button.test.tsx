import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './index';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with children text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('renders with default variant (primary)', () => {
      render(<Button>Primary Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-navy-900');
    });

    it('renders with secondary variant', () => {
      render(<Button variant="secondary">Secondary Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gold-500');
    });

    it('renders with outline variant', () => {
      render(<Button variant="outline">Outline Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-2');
    });
  });

  describe('Sizing', () => {
    it('renders with default size (md)', () => {
      render(<Button>Medium Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3');
    });

    it('renders with small size', () => {
      render(<Button size="sm">Small Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2');
    });

    it('renders with large size', () => {
      render(<Button size="lg">Large Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-8', 'py-4');
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledOnce();
    });

    it('can be disabled', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} disabled>Disabled Button</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Link rendering (href prop)', () => {
    it('renders an anchor when href is provided', () => {
      render(<Button href="https://t.me/example">Open bot</Button>);
      const link = screen.getByRole('link', { name: /open bot/i });
      expect(link).toHaveAttribute('href', 'https://t.me/example');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('keeps variant and size classes on the anchor', () => {
      render(
        <Button href="/somewhere" variant="primary" size="lg">
          Go
        </Button>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveClass('bg-navy-900', 'px-8', 'py-4');
    });

    it('passes anchor attributes through (target, rel)', () => {
      render(
        <Button href="https://t.me/example" target="_blank" rel="noopener noreferrer">
          External
        </Button>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('calls onClick when the link is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
      render(
        <Button href="https://t.me/example" onClick={handleClick}>
          Track me
        </Button>
      );

      await user.click(screen.getByRole('link'));

      expect(handleClick).toHaveBeenCalledOnce();
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('accepts type prop', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('accepts aria-label prop', () => {
      render(<Button aria-label="Custom label">Button</Button>);
      const button = screen.getByRole('button', { name: 'Custom label' });
      expect(button).toBeInTheDocument();
    });
  });
});
