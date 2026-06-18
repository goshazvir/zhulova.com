import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Section, Container } from './index';

describe('Section', () => {
  it('renders a section element with md spacing by default', () => {
    render(<Section data-testid="s">x</Section>);
    const el = screen.getByTestId('s');
    expect(el.tagName).toBe('SECTION');
    expect(el).toHaveClass('py-16');
  });

  it('applies navy background', () => {
    render(<Section data-testid="s" background="navy">x</Section>);
    expect(screen.getByTestId('s')).toHaveClass('bg-navy-900');
  });
});

describe('Container', () => {
  it('applies max-width and horizontal padding', () => {
    render(<Container data-testid="c">x</Container>);
    const el = screen.getByTestId('c');
    expect(el).toHaveClass('max-w-6xl');
    expect(el).toHaveClass('mx-auto');
  });
});
