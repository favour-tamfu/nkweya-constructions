/**
 * The path the site is served under.
 *
 * GitHub Pages serves a project site from `/<repo>/`, so the whole site sits
 * under a prefix. Next applies `basePath` to `<Link>`, the router and
 * `next/image` on its own — but NOT to raw strings in `<img src>`,
 * `<source srcSet>`, `<video src>`, metadata icon URLs, or anything passed to
 * `window.location`. Every one of those is used here, so they are prefixed
 * explicitly through the helpers below.
 *
 * Empty for a root deployment (a custom domain, or a user site), which is why
 * everything still works unprefixed in development.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Prefixes one root-absolute asset path. `/media/x.jpg` -> `/repo/media/x.jpg`. */
export function asset(path: string): string {
  if (!basePath) return path;
  if (!path.startsWith('/')) return path;
  // Guard against double-prefixing if a caller has already resolved it.
  if (path.startsWith(`${basePath}/`)) return path;
  return `${basePath}${path}`;
}

/**
 * Prefixes every URL in a srcset.
 *
 * A srcset is `url descriptor, url descriptor, …` — the descriptor must be
 * preserved, so this cannot be a blanket string replace.
 */
export function assetSrcSet(srcSet: string): string {
  if (!basePath) return srcSet;
  return srcSet
    .split(',')
    .map((candidate) => {
      const trimmed = candidate.trim();
      if (!trimmed) return trimmed;
      const [url, ...descriptor] = trimmed.split(/\s+/);
      return [asset(url ?? ''), ...descriptor].join(' ');
    })
    .join(', ');
}
