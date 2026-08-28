'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * §8.6. Label above, input, helper below. Focus darkens the border to slate —
 * no colour change, because russet means "clickable" and nothing else (§5.1).
 * Errors get a russet border, the field-error background, and a message wired
 * through `aria-describedby` / `aria-invalid`.
 */
export function Field({
  id,
  label,
  help,
  error,
  required,
  requiredLabel,
  optionalLabel,
  children,
  className,
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col', className)}>
      <label
        htmlFor={id}
        className="flex flex-wrap items-baseline gap-2 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-mortar"
      >
        {label}
        {required && requiredLabel ? (
          <span className="font-body text-[10px] normal-case tracking-normal text-russet">
            {requiredLabel}
          </span>
        ) : null}
        {!required && optionalLabel ? (
          <span className="font-body text-[10px] normal-case tracking-normal text-dim">
            {optionalLabel}
          </span>
        ) : null}
      </label>

      <div className="mt-2">{children}</div>

      {help && !error ? (
        <p id={`${id}-help`} className="mt-2 text-[13px] leading-snug text-mortar">
          {help}
        </p>
      ) : null}

      {error ? (
        <p
          id={`${id}-error`}
          className="mt-2 flex items-start gap-2 text-[13px] leading-snug text-russet"
          role="alert"
        >
          <svg
            viewBox="0 0 16 16"
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
            aria-hidden
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 5v4M8 11h.01" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function inputClassName(hasError = false) {
  return cn(
    'min-h-12 w-full border px-4 font-body text-[16px] text-slate transition-colors',
    'focus:border-slate focus:outline-offset-0',
    hasError ? 'border-russet bg-field-error' : 'border-hairline bg-card',
  );
}

export function selectClassName(hasError = false) {
  return cn(inputClassName(hasError), 'appearance-none pr-10');
}

export function textareaClassName(hasError = false) {
  return cn(
    'w-full border px-4 py-3 font-body text-[16px] leading-[1.6] text-slate transition-colors',
    'focus:border-slate focus:outline-offset-0',
    hasError ? 'border-russet bg-field-error' : 'border-hairline bg-card',
  );
}

/** The chevron a native select needs once its own arrow is suppressed. */
export function SelectChevron() {
  return (
    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mortar">
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}
