import type { ComponentProps, ReactNode } from 'react';

type CardVariant = 'default' | 'bordered' | 'elevated';
type CardPadding = 'sm' | 'md' | 'lg';

interface CardProps extends ComponentProps<'div'> {
  variant?: CardVariant;
  padding?: CardPadding;
  children: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white',
  bordered: 'bg-white border border-navy-200',
  elevated: 'bg-white shadow-lg',
};

const paddingClasses: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
