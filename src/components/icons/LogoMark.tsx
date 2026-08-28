export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-9 w-9 items-center justify-center bg-limewash text-slate ${className ?? ''}`}
      style={{ borderRadius: 3 }}
      aria-hidden
    >
      <svg viewBox="0 0 36 36" className="h-7 w-7" fill="none">
        <path d="M6 28V12l12-6 12 6v16" stroke="currentColor" strokeWidth="1.6" />
        <path d="M6 28h24" stroke="#7A3E0C" strokeWidth="1.6" />
        <path d="M18 6v22" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </span>
  );
}
