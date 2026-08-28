import { cn } from '@/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

/**
 * §8.1. Five states on every variant: default, hover, active, focus-visible
 * and disabled. `<a>` when it navigates, `<button>` when it acts — never a
 * `<div>`. Russet means exactly one thing on this site: this can be clicked.
 *
 * The class lists are split so that no two of them set the same property.
 * `cn()` only concatenates — it does not resolve Tailwind conflicts — so a
 * caller passing `text-russet` on top of a variant carrying `text-white` gets
 * both, and the winner is decided by stylesheet order rather than intent.
 * That produced a white button with invisible white text on the russet CTA
 * band. Colour lives in `variant`, geometry lives in `size`, and anything a
 * caller adds via `className` must not touch either.
 */
export const buttonVariants = {
  primary:
    'bg-russet text-white border border-russet hover:bg-russet-dark hover:border-russet-dark active:bg-russet-deep disabled:bg-stucco disabled:text-mortar disabled:border-stucco disabled:cursor-not-allowed',
  secondary:
    'bg-transparent text-white border-[1.5px] border-white/70 hover:border-iroko hover:text-iroko active:border-iroko active:text-iroko',
  outline:
    'bg-transparent text-russet border-[1.5px] border-russet hover:bg-russet hover:text-white active:bg-russet-deep active:border-russet-deep',
  /** White fill for use ON the russet band, where primary would disappear. */
  inverse:
    'bg-white text-russet border border-white hover:bg-limewash hover:border-limewash active:bg-stucco active:border-stucco',
  whatsapp:
    'bg-whatsapp text-whatsapp-ink border border-whatsapp hover:brightness-95 active:brightness-90',
  text: 'bg-transparent text-russet border-0 hover:text-russet-dark active:text-russet-deep group',
} as const;

/** Geometry only. Tap targets are 48px (§5.3) except the dense header row. */
export const buttonSizes = {
  md: 'min-h-12 px-5 text-[15px]',
  lg: 'min-h-12 px-6 text-[15px]',
  sm: 'min-h-11 px-4 text-[14px]',
  /** A bare text link: no box, but still a 44px touch target. */
  bare: 'min-h-11 px-0 text-[15px]',
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

type Shared = { variant?: ButtonVariant; size?: ButtonSize; block?: boolean };

type ButtonAsButton = ComponentPropsWithoutRef<'button'> & Shared & { href?: undefined };
type ButtonAsLink = ComponentPropsWithoutRef<'a'> & Shared & { href: string };

export function buttonClassName(
  variant: ButtonVariant = 'primary',
  className?: string,
  block = false,
  size?: ButtonSize,
) {
  return cn(
    'inline-flex items-center justify-center gap-2 font-body font-semibold tracking-[0.01em] no-underline text-center transition-colors duration-150 ease-out',
    buttonSizes[size ?? (variant === 'text' ? 'bare' : 'md')],
    buttonVariants[variant],
    block && 'w-full',
    className,
  );
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', size, block = false, className, ...rest } = props;
  const classes = buttonClassName(variant, className, block, size);

  if ('href' in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as ComponentPropsWithoutRef<'a'> & { href: string };
    return <a href={href} className={classes} {...anchorRest} />;
  }

  return <button className={classes} {...(rest as ComponentPropsWithoutRef<'button'>)} />;
}

/** The arrow on a text link, animated on hover without moving the text. */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn(
        'h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1',
        className,
      )}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}
