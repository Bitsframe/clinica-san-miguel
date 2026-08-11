import createMiddleware from "next-intl/middleware";
import { localePrefix, locales, defaultLocale } from "./navigation";

export default createMiddleware({
  locales,
  localePrefix,
  defaultLocale,
});

// only applies this middleware to files in the app directory
export const config = {
  matcher: [
    "/((?!api|_next|_vercel|robots\\.txt|sitemap\\.xml|.*\\..*).*)",
  ],
};
