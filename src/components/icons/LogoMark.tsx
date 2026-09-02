/**
 * The Nkweya & Sons mark.
 *
 * A braced structural bay that reads as an N: two columns, a head beam, and
 * the diagonal brace running between them. The brace IS the diagonal of the
 * letter, so the mark is a monogram and a piece of structure at the same time
 * — which is the whole argument of the practice, and it belongs to this firm
 * rather than to construction in general.
 *
 * Drawn on a 32 grid with a 3-unit stroke and square caps, so it holds at
 * 24px in the header, survives a 16px favicon, and prints in one colour. The
 * base plate is heavier than the frame: a foundation reads as the thing
 * everything else stands on.
 */
export function LogoMark({
  className,
  title,
}: {
  className?: string;
  /** Give this when the mark stands alone; omit when adjacent text names it. */
  title?: string;
}) {
  return (
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center bg-limewash text-slate ${className ?? ''}`}
      style={{ borderRadius: 3 }}
    >
      <svg
        viewBox="0 0 32 32"
        className="h-[26px] w-[26px]"
        fill="none"
        role={title ? 'img' : undefined}
        aria-label={title}
        aria-hidden={title ? undefined : true}
      >
        {/* Head beam */}
        <path d="M6 6h20" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
        {/* Columns */}
        <path d="M7.5 6v18M24.5 6v18" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
        {/* The brace — the diagonal of the N, in the action colour */}
        <path d="M7.5 7.5 24.5 24" stroke="#7A3E0C" strokeWidth="3" strokeLinecap="square" />
        {/* Foundation, set heavier than the frame */}
        <path d="M3 27.5h26" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
      </svg>
    </span>
  );
}

/**
 * The mark plus the wordmark, for the footer and anywhere the lockup stands
 * on its own. The header composes these itself so it can hide the second line
 * as the header condenses.
 */
export function LogoLockup({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 ${className ?? ''}`}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[17px] font-bold tracking-[-0.01em]">
          Nkweya &amp; Sons
        </span>
        <span className="mt-1 font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-dim">
          Constructions
        </span>
      </span>
    </span>
  );
}
