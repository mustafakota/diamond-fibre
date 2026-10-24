'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  id?: string;
  name?: string;
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  clearAriaLabel?: string;
}

export const Select: React.FC<SelectProps> = ({
  id,
  name,
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  clearAriaLabel = 'Clear selection',
}) => {
  const generatedId = useId();
  const selectId = id || `select-${generatedId}`;
  const labelId = `${selectId}-label`;
  const listboxId = `${selectId}-listbox`;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const openMenu = () => {
    const selectedIdx = options.findIndex((opt) => opt.value === value);
    setHighlightedIndex(selectedIdx >= 0 ? selectedIdx : 0);
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Scroll active option into view inside scrollable listbox
  useEffect(() => {
    if (isOpen && listboxRef.current && highlightedIndex >= 0) {
      const activeEl = listboxRef.current.querySelector<HTMLElement>(
        `#${selectId}-opt-${highlightedIndex}`
      );
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen, selectId]);

  // Outside click & touch dismissal
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  const handleSelectOption = (optValue: string) => {
    onChange(optValue);
    closeMenu();
    triggerRef.current?.focus();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    closeMenu();
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!isOpen) {
          openMenu();
        } else {
          setHighlightedIndex((prev) => (prev + 1) % options.length);
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (!isOpen) {
          openMenu();
        } else {
          setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
        }
        break;
      }
      case 'Home': {
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(0);
        }
        break;
      }
      case 'End': {
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(options.length - 1);
        }
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (isOpen) {
          if (options[highlightedIndex]) {
            handleSelectOption(options[highlightedIndex].value);
          }
        } else {
          openMenu();
        }
        break;
      }
      case 'Escape': {
        if (isOpen) {
          e.preventDefault();
          closeMenu();
          triggerRef.current?.focus();
        }
        break;
      }
      case 'Tab': {
        if (isOpen) {
          closeMenu();
        }
        break;
      }
      case 'Backspace':
      case 'Delete': {
        if (!isOpen && value) {
          e.preventDefault();
          onChange('');
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-1.5 relative">
      {/* Hidden input for form submission serialization */}
      <input type="hidden" name={name || selectId} value={value} />

      <label
        id={labelId}
        htmlFor={selectId}
        className="text-sm font-semibold text-[var(--color-carbon-800)]"
      >
        {label}
      </label>

      <div className="relative w-full">
        <button
          id={selectId}
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-labelledby={`${labelId} ${selectId}`}
          aria-describedby={
            error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
          }
          aria-activedescendant={
            isOpen && highlightedIndex >= 0 ? `${selectId}-opt-${highlightedIndex}` : undefined
          }
          aria-invalid={Boolean(error)}
          aria-required={required}
          disabled={disabled}
          onClick={() => !disabled && (isOpen ? closeMenu() : openMenu())}
          onKeyDown={handleKeyDown}
          className={`w-full min-h-[48px] px-4 py-2.5 rounded-xl border bg-white text-left text-base sm:text-sm flex items-center justify-between gap-2.5 transition-all duration-150 ease-out cursor-pointer active:scale-[1.01] press-scale-subtle motion-reduce:transform-none select-none ${
            error
              ? 'border-[var(--color-error-red)] focus:ring-2 focus:ring-[var(--color-error-red)]'
              : isOpen
              ? 'border-[var(--color-terracotta-500)] ring-2 ring-[var(--color-terracotta-500)]/20'
              : 'border-[var(--color-sand-400)] hover:border-[var(--color-sand-500)]'
          } focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)] focus-visible:ring-offset-1 ${className}`}
        >
          <span
            className={`truncate ${
              selectedOption
                ? 'text-[var(--color-carbon-900)] font-medium'
                : 'text-[var(--color-carbon-600)]/70'
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            {value && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                onClick={handleClear}
                className="p-1 rounded-md text-[var(--color-carbon-400)] hover:text-[var(--color-carbon-800)] hover:bg-[var(--color-sand-300)]/40 transition-colors cursor-pointer"
                aria-label={clearAriaLabel}
                title={clearAriaLabel}
              >
                <X className="w-3.5 h-3.5" />
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 text-[var(--color-carbon-600)] transition-transform duration-200 motion-reduce:transition-none pointer-events-none ${
                isOpen ? 'rotate-180 text-[var(--color-terracotta-600)]' : ''
              }`}
              aria-hidden="true"
            />
          </div>
        </button>

        {isOpen && (
          <ul
            id={listboxId}
            ref={listboxRef}
            role="listbox"
            aria-labelledby={labelId}
            tabIndex={-1}
            className="absolute top-full left-0 right-0 mt-1.5 z-30 bg-white border border-[var(--color-sand-300)] rounded-xl shadow-[0_12px_28px_-6px_rgba(34,35,31,0.12),0_8px_10px_-6px_rgba(34,35,31,0.06)] py-1.5 overflow-auto max-h-60 animate-fadeIn"
          >
            {options.map((opt, index) => {
              const isSelected = opt.value === value;
              const isHighlighted = index === highlightedIndex;

              return (
                <li
                  key={opt.value}
                  id={`${selectId}-opt-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectOption(opt.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`min-h-[44px] px-4 py-2.5 text-base sm:text-sm flex items-center justify-between gap-3 text-left cursor-pointer transition-colors duration-150 select-none ${
                    isSelected
                      ? 'bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-800)] font-semibold'
                      : isHighlighted
                      ? 'bg-[var(--color-sand-200)]/60 text-[var(--color-carbon-900)]'
                      : 'text-[var(--color-carbon-900)] hover:bg-[var(--color-sand-200)]/40'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <Check
                      className="w-4 h-4 text-[var(--color-terracotta-600)] stroke-[2.5] shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {helperText && !error && (
        <p id={`${selectId}-helper`} className="text-xs text-[var(--color-carbon-600)]">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${selectId}-error`} className="text-xs font-medium text-[var(--color-error-red)] animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

Select.displayName = 'Select';
