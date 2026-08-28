'use client';

import { useState } from 'react';
import { IconCheck, IconCopy, IconPhone } from '@/components/icons/NavIcons';

export interface PhoneEntry {
  raw: string;
  display: string;
  href: string;
  primary: boolean;
}

/**
 * All three numbers, the first marked primary (§4.2).
 *
 * Copy-to-clipboard matters more here than it looks: a lot of visitors are on
 * a desktop reading a number they then need to type into WhatsApp on a phone.
 * The tel: link stays the primary action; copy is a secondary affordance.
 */
export function PhoneList({
  phones,
  primaryLabel,
  copyLabel,
  copiedLabel,
}: {
  phones: PhoneEntry[];
  primaryLabel: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      window.setTimeout(() => setCopied((current) => (current === value ? null : current)), 2000);
    } catch {
      /* clipboard blocked — the tel: link still works, which is the point */
    }
  }

  return (
    <ul className="space-y-px">
      {phones.map((phone) => (
        <li key={phone.raw} className="flex items-center gap-2 border-b border-hairline">
          <a
            href={phone.href}
            className="flex min-h-12 flex-1 items-center gap-3 py-2 no-underline"
          >
            <IconPhone className="h-4 w-4 shrink-0 text-russet" />
            <span className="figure-numerals text-[17px] font-medium text-slate">
              {phone.display}
            </span>
            {phone.primary ? (
              <span className="bg-stucco px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-russet">
                {primaryLabel}
              </span>
            ) : null}
          </a>
          <button
            type="button"
            onClick={() => copy(phone.display)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-mortar transition-colors hover:text-russet"
            aria-label={`${copyLabel}: ${phone.display}`}
          >
            {copied === phone.display ? (
              <IconCheck className="h-4 w-4 text-whatsapp-ink" />
            ) : (
              <IconCopy className="h-4 w-4" />
            )}
          </button>
          <span className="sr-only" role="status" aria-live="polite">
            {copied === phone.display ? copiedLabel : ''}
          </span>
        </li>
      ))}
    </ul>
  );
}
