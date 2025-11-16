import type { ComponentProps } from 'react';
import { forwardRef } from 'react';

interface InputProps extends ComponentProps<'input'> {
  label: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-navy-900 mb-2"
        >
          {label}
          {props.required && (
            <span className="text-gold-600 ml-1" aria-label="обов'язкове поле">
              *
            </span>
          )}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 rounded-lg border transition-colors
            ${error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-navy-300 focus:border-gold-500 focus:ring-gold-500'
            }
            focus:ring-2 focus:ring-offset-0 focus:outline-none
            disabled:bg-navy-50 disabled:cursor-not-allowed
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
              ? `${inputId}-helper`
              : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-2 text-sm text-navy-600"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
