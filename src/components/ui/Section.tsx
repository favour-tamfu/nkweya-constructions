import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * §5.1 rule 4: never two dark bands in a row. Alternate limewash and stucco
 * for reading; slate carries weight and is spent sparingly — trust bar,
 * the engineer, the final CTA and the footer.
 *
 * Section rhythm from §5.3: desktop 72/56px, mobile 38/18px.
 */
export type Tone = 'limewash' | 'stucco' | 'slate' | 'russet' | 'card';

const tones: Record<Tone, string> = {
  limewash: 'bg-limewash text-slate',
  stucco: 'bg-stucco text-slate',
  slate: 'bg-slate text-white',
  russet: 'bg-russet text-white',
  card: 'bg-card text-slate',
};

export function Section({
  tone = 'limewash',
  children,
  className,
  innerClassName,
  size = 'default',
  id,
  as: Tag = 'section',
  labelledBy,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  size?: 'default' | 'tight' | 'loose';
  id?: string;
  as?: 'section' | 'div' | 'article' | 'aside';
  labelledBy?: string;
}) {
  const padding =
    size === 'tight'
      ? 'py-8 md:py-10'
      : size === 'loose'
        ? 'py-[52px] md:py-24'
        : 'py-[38px] md:py-[72px]';

  return (
    <Tag id={id} aria-labelledby={labelledBy} className={cn(tones[tone], className)}>
      <div className={cn('mx-auto w-full max-w-[1440px] px-[18px] md:px-14', padding, innerClassName)}>
        {children}
      </div>
    </Tag>
  );
}

/** The 11px uppercase label above a heading. Russet on light, iroko on dark. */
export function Eyebrow({
  children,
  onDark = false,
  className,
}: {
  children: ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'font-body text-[11px] font-semibold uppercase leading-none tracking-[0.22em]',
        onDark ? 'text-iroko' : 'text-russet',
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  onDark = false,
  id,
  className,
  align = 'left',
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  onDark?: boolean;
  id?: string;
  className?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={cn(align === 'center' && 'mx-auto text-center', 'max-w-[68ch]', className)}>
      {eyebrow ? <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow> : null}
      <h2
        id={id}
        className={cn(
          'font-display text-[26px] font-bold leading-[1.18] tracking-[-0.01em] md:text-[32px]',
          Boolean(eyebrow) && 'mt-3',
          onDark ? 'text-white' : 'text-slate',
        )}
      >
        {title}
      </h2>
      {body ? (
        <p className={cn('mt-4 text-[16px] leading-[1.65] md:text-[17px]', onDark ? 'text-ash' : 'text-mortar')}>
          {body}
        </p>
      ) : null}
    </div>
  );
}

/** A hairline rule that reads as structure rather than decoration. */
export function Rule({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  return <hr className={cn('border-0 border-t', onDark ? 'border-rule-dark' : 'border-hairline', className)} />;
}
