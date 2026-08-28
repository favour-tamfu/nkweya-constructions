type IconProps = { className?: string };

export function IconWhatsApp({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.86 9.86 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7zM12.05 20.15h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-3.15.82.84-3.07-.2-.32a8.18 8.18 0 0 1-1.26-4.35c0-4.52 3.68-8.2 8.21-8.2 2.19 0 4.25.85 5.8 2.4a8.16 8.16 0 0 1 2.4 5.8c0 4.53-3.68 8.24-8.16 8.24zm4.5-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74 1.59.69 2.01.75 2.73.63.42-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.17-.48-.29z" />
    </svg>
  );
}

export function IconPhone({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
      <path d="M6.5 3.5h3L11 7.5 8.8 8.8a12 12 0 0 0 6.4 6.4L16.5 13l4 1.5v3A2 2 0 0 1 18.5 20 15.5 15.5 0 0 1 4 5.5a2 2 0 0 1 2.5-2z" />
    </svg>
  );
}

export function IconMenu({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconMail({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  );
}

export function IconPin({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function IconClock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

/** Deliberately not a cross — an exclusion is a boundary, not a failure. */
export function IconExcluded({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 12h8" />
    </svg>
  );
}

export function IconChevronDown({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function IconArrowDown({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v15M6 13l6 6 6-6" />
    </svg>
  );
}

export function IconCopy({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <rect x="9" y="9" width="11" height="11" />
      <path d="M15 5H5a1 1 0 0 0-1 1v10" />
    </svg>
  );
}

export function IconDocument({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M14 3H6v18h12V7z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  );
}
