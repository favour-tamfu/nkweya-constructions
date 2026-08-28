/**
 * Renders a JSON-LD block (§12).
 *
 * The payload is always assembled in `lib/seo.ts` from typed content modules —
 * it never contains user input — so serialising it into a script tag is safe.
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[] | null;
}) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
