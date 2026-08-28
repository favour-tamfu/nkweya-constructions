'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Scroll reveal via IntersectionObserver — no animation library (§2).
 *
 * Two rules make this safe for the audience:
 *
 *  1. Core content works with JS off (§13.2). The hidden state is applied by
 *     this component only after it mounts, so a browser with no JS — or Opera
 *     Mini in proxy mode, which still has real share in Cameroon — renders
 *     everything visible from the first paint.
 *  2. `prefers-reduced-motion` skips the transform entirely.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  /** Stagger, in milliseconds. Keep under ~240ms total across a group. */
  delay?: number;
  as?: 'div' | 'li' | 'section' | 'article';
}) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    // Arm only now — before this point the element has been visible all along,
    // which is what keeps the no-JS render correct.
    setArmed(true);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn(
        armed && 'motion-safe:transition-[opacity,transform] motion-safe:duration-[600ms] motion-safe:ease-out',
        armed && !shown && 'motion-safe:translate-y-4 motion-safe:opacity-0',
        className,
      )}
      style={armed && !shown ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
