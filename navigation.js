import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const locales = ["en", "es"];
export const localePrefix = "as-needed";
export const defaultLocale = "en";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix,
});

/**
 * `createNavigation` replaces the older `createSharedPathnamesNavigation`.
 *
 * The old helper had a known bug under `localePrefix: "as-needed"`
 * (next-intl#647): `Link` emitted the default-locale prefix in server-rendered
 * HTML — /en/about — and only stripped it client-side after hydration. Users
 * never saw a redirect, but every crawled link cost Googlebot a 307 hop to the
 * unprefixed canonical. `createNavigation` emits the correct unprefixed URL
 * server-side, so the markup and the canonical finally agree.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
