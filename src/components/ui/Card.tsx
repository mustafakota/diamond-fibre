import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] rounded-2xl p-6 shadow-[var(--shadow-card)] transition-shadow duration-150 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
