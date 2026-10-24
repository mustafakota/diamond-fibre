import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-warm-ivory-200)] min-h-[44px] px-5 py-2.5 text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:pointer-events-none active:scale-[1.02] motion-reduce:transform-none select-none press-scale';

  const variants = {
    primary:
      'bg-[var(--color-terracotta-500)] text-white hover:bg-[var(--color-terracotta-600)] focus-visible:ring-[var(--color-terracotta-600)] active:bg-[var(--color-terracotta-700)] shadow-sm hover:shadow-md',
    secondary:
      'bg-[var(--color-carbon-800)] text-[var(--color-warm-ivory-100)] hover:bg-[var(--color-carbon-900)] focus-visible:ring-[var(--color-carbon-800)] active:bg-black',
    outline:
      'border-2 border-[var(--color-sand-400)] text-[var(--color-carbon-900)] hover:bg-[var(--color-sand-300)]/40 hover:border-[var(--color-sand-500)] focus-visible:ring-[var(--color-carbon-800)] active:bg-[var(--color-sand-300)]/60',
    whatsapp:
      'bg-[var(--color-carbon-900)] text-white hover:bg-[var(--color-carbon-800)] border border-[var(--color-carbon-800)] focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)] active:bg-black shadow-xs font-semibold',
  };

  const sizes = {
    sm: 'text-sm py-2 px-4 min-h-[44px]',
    md: 'text-base py-2.5 px-6 min-h-[48px]',
    lg: 'text-lg py-3.5 px-8 min-h-[52px] active:scale-[1.015]',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
