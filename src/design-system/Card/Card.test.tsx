import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './index';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Content</Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies default variant and md padding', () => {
    render(<Card data-testid="card">x</Card>);
    const el = screen.getByTestId('card');
    expect(el).toHaveClass('bg-white');
    expect(el).toHaveClass('p-6');
  });

  it('applies bordered variant', () => {
    render(<Card data-testid="card" variant="bordered">x</Card>);
    expect(screen.getByTestId('card')).toHaveClass('border-navy-200');
  });
});
