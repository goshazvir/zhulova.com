import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import MobileMenu from './index';

describe('MobileMenu Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<MobileMenu />);
    expect(container).toBeTruthy();
  });
});
