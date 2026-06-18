import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge, Stat } from './index';

describe('Badge', () => {
  it('renders children with navy variant by default', () => {
    render(<Badge>New</Badge>);
    const el = screen.getByText('New');
    expect(el).toHaveClass('bg-navy-100');
  });

  it('applies gold variant', () => {
    render(<Badge variant="gold">Hot</Badge>);
    expect(screen.getByText('Hot')).toHaveClass('text-gold-700');
  });
});

describe('Stat', () => {
  it('renders value and label', () => {
    render(<Stat value="120+" label="clients" />);
    expect(screen.getByText('120+')).toHaveClass('font-serif');
    expect(screen.getByText('clients')).toBeInTheDocument();
  });
});
