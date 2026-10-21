/** Canonical origin. Set NEXT_PUBLIC_SITE_URL in production; Vercel's production URL is used as a fallback. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3100");
