import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, error, helperText, className = '', ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-[var(--color-carbon-800)]"
        >
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={`w-full min-h-[48px] px-4 py-2.5 rounded-xl border bg-white text-[var(--color-carbon-900)] placeholder:text-[var(--color-carbon-600)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-500)] focus:border-transparent transition-colors ${
            error
              ? 'border-[var(--color-error-red)] focus:ring-[var(--color-error-red)]'
              : 'border-[var(--color-sand-400)]'
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-xs text-[var(--color-carbon-600)]">
            {helperText}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-xs font-medium text-[var(--color-error-red)]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
