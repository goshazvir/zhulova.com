import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './index';

describe('Input Component', () => {
  it('renders with label', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<Input label="Name" placeholder="Enter name" />);
    const input = screen.getByPlaceholderText('Enter name') as HTMLInputElement;

    await user.type(input, 'Hello');
    expect(input.value).toBe('Hello');
  });

  it('shows required indicator', () => {
    render(<Input label="Required Field" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
  });

  it('displays helper text', () => {
    render(<Input label="Email" helperText="Enter your email address" />);
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('generates id from label', () => {
    render(<Input label="User Name" />);
    const input = screen.getByLabelText('User Name');
    expect(input).toHaveAttribute('id', 'input-user-name');
  });

  it('uses custom id when provided', () => {
    render(<Input label="Email" id="custom-id" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', 'custom-id');
  });
});
