/**
 * Canonical origin for absolute URLs. Canonical tags, Open Graph tags and
 * JSON-LD must all agree, so every route builds them from this one value.
 * server/middleware/www-redirect.ts pins the live host to the non-www form.
 */
export const SITE_URL = process.env.SITE_URL ?? "https://certificaatkopen.com";
