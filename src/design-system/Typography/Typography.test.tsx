import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Heading, Text } from './index';

describe('Typography', () => {
  it('renders Heading as h2 by default with serif font', () => {
    render(<Heading>Title</Heading>);
    const el = screen.getByRole('heading', { level: 2, name: 'Title' });
    expect(el).toHaveClass('font-serif');
  });

  it('renders Heading at the requested level', () => {
    render(<Heading level={1}>Big</Heading>);
    expect(screen.getByRole('heading', { level: 1, name: 'Big' })).toBeInTheDocument();
  });

  it('renders Text with sans font and gold tone', () => {
    render(<Text tone="gold">Body</Text>);
    const el = screen.getByText('Body');
    expect(el).toHaveClass('font-sans');
    expect(el).toHaveClass('text-gold-600');
  });
});
