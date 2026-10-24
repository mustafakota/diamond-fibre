import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, error, helperText, className = '', ...props }, ref) => {
    const inputId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-[var(--color-carbon-800)]"
        >
          {label}
        </label>
        <textarea
          id={inputId}
          ref={ref}
          rows={4}
          className={`w-full p-4 rounded-xl border bg-white text-base sm:text-sm text-[var(--color-carbon-900)] placeholder:text-[var(--color-carbon-600)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-500)] focus:border-transparent active:border-[var(--color-terracotta-400)] transition-all duration-150 ease-out ${
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
          <p id={`${inputId}-error`} className="text-xs font-medium text-[var(--color-error-red)] animate-fadeIn">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
