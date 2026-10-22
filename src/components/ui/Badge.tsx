import React from 'react';

export interface BadgeProps {
  variant?: 'neutral' | 'accent' | 'success';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  className = '',
  children,
}) => {
  const variants = {
    neutral:
      'bg-[var(--color-sand-300)]/70 text-[var(--color-carbon-800)] border border-[var(--color-sand-400)]/60',
    accent:
      'bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-600)] border border-[var(--color-terracotta-500)]/30 font-medium',
    success:
      'bg-emerald-50 text-emerald-800 border border-emerald-300 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs tracking-wide uppercase font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
