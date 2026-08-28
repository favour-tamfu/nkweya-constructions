import path from 'node:path';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isProduction = process.env.NODE_ENV === 'production';

/*
 * GitHub Pages serves a project site from `/<repo>/`. `basePath` makes Next
 * emit that prefix on links, the router and `/_next/*` assets; raw asset
 * strings are prefixed by `src/lib/base-path.ts`, which reads the same value.
 *
 * Empty for a root deployment (custom domain or user site) and in development.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  /*
   * Static export for the real build only.
   *
   * `output: 'export'` disables middleware, and middleware is what rewrites
   * next-intl's translated pathnames (`/fr/realisations/`) back to the
   * internal route (`app/[locale]/projects`) while developing. Without this
   * split, every link 404s in `next dev`. Production does not need it:
   * `scripts/localize-routes.ts` renames the emitted directories after build.
   */
  ...(isProduction ? { output: 'export' as const } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  outputFileTracingRoot: path.join(__dirname),
  images: { unoptimized: true },
  /*
   * Trailing slashes are for the exported site, where every route is a
   * directory containing index.html. In development they trigger a 308 before
   * next-intl's middleware can rewrite a translated pathname, so the localised
   * URLs 404. Production-only, like `output` above.
   */
  ...(isProduction ? { trailingSlash: true } : {}),
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
};

export default withNextIntl(nextConfig);
