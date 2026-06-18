import type { ComponentProps, ReactNode } from 'react';

type BadgeVariant = 'navy' | 'gold' | 'sage';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends ComponentProps<'span'> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
}

const badgeVariantClasses: Record<BadgeVariant, string> = {
  navy: 'bg-navy-100 text-navy-900',
  gold: 'bg-gold-100 text-gold-700',
  sage: 'bg-sage-100 text-sage-800',
};

const badgeSizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
};

export function Badge({
  variant = 'navy',
  size = 'md',
  className = '',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${badgeVariantClasses[variant]} ${badgeSizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

interface StatProps extends ComponentProps<'div'> {
  value: ReactNode;
  label: ReactNode;
}

export function Stat({ value, label, className = '', ...props }: StatProps) {
  return (
    <div className={`text-center ${className}`} {...props}>
      <div className="font-serif text-4xl font-bold text-gold-600">{value}</div>
      <div className="mt-1 font-sans text-sm text-navy-600">{label}</div>
    </div>
  );
}
