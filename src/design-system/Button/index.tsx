import type { ComponentProps, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

/** Renders a <button> by default, or an <a> with identical styling when `href` is set. */
type ButtonProps =
  | (CommonProps & ComponentProps<'button'> & { href?: undefined })
  | (CommonProps & ComponentProps<'a'> & { href: string });

const baseClasses = 'font-medium rounded-lg transition-colors focus:ring-2 focus:ring-offset-2';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-navy-900 text-white hover:bg-navy-800 focus:ring-gold-500',
  secondary: 'bg-gold-500 text-navy-900 hover:bg-gold-400 focus:ring-gold-300',
  outline: 'bg-white text-navy-900 border-2 border-navy-900 hover:bg-navy-50 focus:ring-gold-500',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (props.href !== undefined) {
    const anchorProps = props as ComponentProps<'a'>;
    return (
      <a className={`inline-block text-center ${classes}`} {...anchorProps}>
        {children}
      </a>
    );
  }

  const buttonProps = props as ComponentProps<'button'>;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
