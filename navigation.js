import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const locales = ["en", "es"];
export const localePrefix = "as-needed";
export const defaultLocale = "en";

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix, defaultLocale });
