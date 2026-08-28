import type { IconName } from '@/types/content';

/**
 * Hand-rolled inline SVG (§2). Fourteen icons is less weight than any icon
 * library's tree-shaken minimum, and these can be drawn to the same 1.5px
 * stroke as the rest of the system.
 *
 * All on a 24 grid, `fill="none"`, `stroke="currentColor"`.
 */
type IconProps = { className?: string };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

/** Office block — commercial construction. */
export function IconCommercial({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 21h18" />
      <path d="M5 21V6l7-3 7 3v15" />
      <path d="M9 9h2M13 9h2M9 13h2M13 13h2M9 17h2M13 17h2" />
    </svg>
  );
}

/** Pitched roof over a plan — residential construction. */
export function IconResidential({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 10v11h14V10" />
      <path d="M10 21v-6h4v6" />
    </svg>
  );
}

/** Plumb-bob and level line — structural supervision. */
export function IconSupervision({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3v7" />
      <path d="m9 10 3 6 3-6z" />
      <path d="M3 20h18" />
      <path d="M6 17v3M18 17v3" />
    </svg>
  );
}

/** Trowel over a cracked wall — renovation and repair. */
export function IconRenovation({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 4h9v9H4z" />
      <path d="M6 6.5 8 9l-1.5 2M10 6l1 3-1.5 2" />
      <path d="m14 17 3-3 4 4-3 3z" />
      <path d="m14 17-2.5 5.5L17 20" />
    </svg>
  );
}

/** Borehole through soil strata — geotechnical studies. */
export function IconGeotechnical({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 9h18M3 14h18M3 19h18" />
      <path d="M12 3v13" />
      <path d="m9.5 16 2.5 4 2.5-4z" />
    </svg>
  );
}

const registry: Record<IconName, (props: IconProps) => React.JSX.Element> = {
  commercial: IconCommercial,
  residential: IconResidential,
  supervision: IconSupervision,
  renovation: IconRenovation,
  geotechnical: IconGeotechnical,
};

export function ServiceIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = registry[name];
  return <Icon className={className} />;
}
