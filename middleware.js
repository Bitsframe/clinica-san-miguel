import createMiddleware from "next-intl/middleware";
import { localePrefix, locales, defaultLocale } from "./navigation";

const intlMiddleware = createMiddleware({
  locales,
  localePrefix,
  defaultLocale,
});

export default function middleware(request) {
  const response = intlMiddleware(request);

  if (
    request.nextUrl.hostname.includes("railway.app") ||
    process.env.RAILWAY_ENVIRONMENT_NAME ||
    process.env.VERCEL_ENV === "preview"
  ) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

// only applies this middleware to files in the app directory
export const config = {
  matcher: [
    "/((?!api|_next|_vercel|robots\\.txt|sitemap\\.xml|.*\\..*).*)",
  ],
};
