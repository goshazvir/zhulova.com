import type { ComponentProps, ReactNode } from 'react';

type HeadingLevel = 1 | 2 | 3 | 4;

interface HeadingProps extends ComponentProps<'h2'> {
  level?: HeadingLevel;
  children: ReactNode;
}

const headingClasses: Record<HeadingLevel, string> = {
  1: 'text-4xl md:text-5xl font-bold',
  2: 'text-3xl md:text-4xl font-bold',
  3: 'text-2xl md:text-3xl font-semibold',
  4: 'text-xl md:text-2xl font-semibold',
};

export function Heading({ level = 2, className = '', children, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={`font-serif text-navy-900 ${headingClasses[level]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

type TextSize = 'sm' | 'md' | 'lg';
type TextTone = 'default' | 'muted' | 'gold';

interface TextProps extends ComponentProps<'p'> {
  size?: TextSize;
  tone?: TextTone;
  children: ReactNode;
}

const textSizeClasses: Record<TextSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const textToneClasses: Record<TextTone, string> = {
  default: 'text-navy-800',
  muted: 'text-navy-500',
  gold: 'text-gold-600',
};

export function Text({ size = 'md', tone = 'default', className = '', children, ...props }: TextProps) {
  return (
    <p
      className={`font-sans ${textSizeClasses[size]} ${textToneClasses[tone]} ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}
