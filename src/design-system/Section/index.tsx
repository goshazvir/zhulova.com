import type { ComponentProps, ReactNode } from 'react';

type SectionSpacing = 'sm' | 'md' | 'lg';
type SectionBackground = 'none' | 'navy' | 'sage';

interface SectionProps extends ComponentProps<'section'> {
  spacing?: SectionSpacing;
  background?: SectionBackground;
  children: ReactNode;
}

const spacingClasses: Record<SectionSpacing, string> = {
  sm: 'py-8',
  md: 'py-16',
  lg: 'py-24',
};

const backgroundClasses: Record<SectionBackground, string> = {
  none: '',
  navy: 'bg-navy-900 text-white',
  sage: 'bg-sage-50',
};

export function Section({
  spacing = 'md',
  background = 'none',
  className = '',
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={`${spacingClasses[spacing]} ${backgroundClasses[background]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

interface ContainerProps extends ComponentProps<'div'> {
  children: ReactNode;
}

export function Container({ className = '', children, ...props }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
