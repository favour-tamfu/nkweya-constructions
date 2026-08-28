import { cn } from '@/lib/cn';

/**
 * §8.5. Wraps any MediaRef with `kind: 'render'`.
 *
 * Always visible. Not dismissible, not hover-only, not a tooltip. Three of the
 * eight sites audited present visualisations and stock photography as
 * completed work — one shows projects in New York, Malmö, Toronto and Athens.
 * This badge is the mechanism that stops the same thing happening here, so it
 * is deliberately impossible to miss and impossible to turn off.
 */
export function RenderNotice({
  label,
  className,
  placement = 'absolute',
}: {
  label: string;
  className?: string;
  placement?: 'absolute' | 'static';
}) {
  return (
    <span
      className={cn(
        'pointer-events-none z-10 inline-flex items-center gap-1.5 bg-slate/95 px-2.5 py-1.5 font-body text-[10px] font-semibold uppercase leading-none tracking-[0.18em] text-iroko',
        placement === 'absolute' && 'absolute left-3 top-3',
        className,
      )}
    >
      <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12.5 8 3l6 9.5H2Z" />
        <path d="M8 3v9.5" />
      </svg>
      {label}
    </span>
  );
}

/**
 * The same statement in prose, for a page that shows renders below the fold
 * where a badge alone is not enough context.
 */
export function RenderNoticeBanner({ label, explain }: { label: string; explain: string }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-l-2 border-russet bg-stucco px-4 py-3 text-sm text-mortar">
      <strong className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-russet">
        {label}
      </strong>
      <span>{explain}</span>
    </p>
  );
}
