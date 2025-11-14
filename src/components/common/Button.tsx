import type { ComponentProps, ReactNode } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-navy-900 text-white hover:bg-navy-800 focus:ring-gold-500',
    secondary: 'bg-gold-500 text-navy-900 hover:bg-gold-400 focus:ring-gold-300',
    outline: 'bg-white text-navy-900 border-2 border-navy-900 hover:bg-navy-50 focus:ring-gold-500',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
