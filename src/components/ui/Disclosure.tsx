import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { IconChevronDown } from '@/components/icons/NavIcons';

/**
 * A native `<details>` accordion.
 *
 * Deliberately not a React state machine: §13.2 requires core content to work
 * with JS off, and Opera Mini's proxy mode — still a real share in Cameroon —
 * strips scripts. `<details>` opens and closes anyway, is keyboard-operable
 * for free, and is announced correctly by screen readers.
 */
export function Disclosure({
  summary,
  children,
  defaultOpen = false,
  onDark = false,
  className,
}: {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <details
      open={defaultOpen}
      className={cn('border-b', onDark ? 'border-rule-dark' : 'border-hairline', className)}
    >
      <summary
        className={cn(
          'flex min-h-[56px] items-center justify-between gap-4 py-4 font-display text-[17px] font-bold leading-snug transition-colors md:text-[19px]',
          onDark ? 'text-white hover:text-iroko' : 'text-slate hover:text-russet',
        )}
      >
        {summary}
        <IconChevronDown
          className={cn('disclosure-chevron h-5 w-5 shrink-0', onDark ? 'text-iroko' : 'text-russet')}
        />
      </summary>
      <div
        className={cn(
          'prose-measure pb-5 text-[16px] leading-[1.65]',
          onDark ? 'text-ash' : 'text-mortar',
        )}
      >
        {children}
      </div>
    </details>
  );
}
