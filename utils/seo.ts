import type { Metadata } from "next";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.clinicsanmiguel.com";

export const siteName = "Clinica San Miguel";

const descriptions = {
  en: "Clinica San Miguel provides affordable, compassionate family healthcare across Texas. Walk-ins welcome in Dallas, Houston, San Antonio, and surrounding communities.",
  es: "Clínica San Miguel ofrece atención médica familiar asequible y compasiva en Texas. Sin cita en Dallas, Houston, San Antonio y comunidades cercanas.",
} as const;

export function getSiteDescription(locale: string): string {
  return locale === "es" ? descriptions.es : descriptions.en;
}

export function formatLocationName(title: string | undefined): string {
  if (!title) return "";
  // Clean up trailing commas and spaces like "Clinica San Miguel Fresno,TX " -> "Clinica San Miguel Fresno, TX"
  return title.replace(/,\s*TX\s*$/i, ", TX").trim();
}

/**
 * URL for the dynamic Open Graph card. Passing the page title makes each
 * share preview specific instead of every page showing the same brand image;
 * locale switches the card's strapline to Spanish.
 */
export function buildOgImageUrl({
  locale,
  title,
}: {
  locale: string;
  title?: string;
}): string {
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (locale === "es") params.set("locale", "es");
  const qs = params.toString();
  return qs ? `/api/og?${qs}` : "/api/og";
}

export function buildPageMetadata({
  locale,
  title,
  description,
  path = "",
  noindex = false,
}: {
  locale: string;
  title?: string;
  description?: string;
  path?: string;
  /** Keep the page out of search results. For pages that collect personal
   *  information and have no search value (e.g. the registration form). */
  noindex?: boolean;
}): Metadata {
  const lang = locale === "es" ? "es" : "en";
  const desc = description ?? getSiteDescription(locale);
  const canonicalPath = locale === "es" ? `/es${path}` : path || "/";
  const canonical = `${siteUrl}${canonicalPath === "/" ? "" : canonicalPath}`;
  const enUrl = `${siteUrl}${path}`;
  const esUrl = `${siteUrl}/es${path}`;

  const isHome = path === "/";
  const formattedTitle = title
    ? (isHome ? title : `${title} | ${siteName}`)
    : siteName;

  // Page-specific OG card. Width/height are declared explicitly because
  // WhatsApp (a primary sharing channel for this audience) frequently skips
  // rendering a preview when dimensions aren't in the markup.
  const ogImage = {
    url: buildOgImageUrl({ locale, title }),
    width: 1200,
    height: 630,
    alt: formattedTitle,
  };

  return {
    metadataBase: new URL(siteUrl),
    title: title ? { absolute: formattedTitle } : siteName,
    description: desc,
    openGraph: {
      type: "website",
      locale: lang === "es" ? "es_US" : "en_US",
      url: canonical,
      siteName,
      title: formattedTitle,
      description: desc,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: formattedTitle,
      description: desc,
      images: [ogImage],
    },
    alternates: {
      canonical,
      languages: {
        "en-US": enUrl,
        "es-US": esUrl,
        "x-default": enUrl,
      },
    },
    robots: {
      index: !noindex,
      follow: !noindex,
    },
  };
}

export function getRootMetadata(locale: string): Metadata {
  const lang = locale === "es" ? "es" : "en";
  const description = getSiteDescription(locale);
  const canonical = locale === "es" ? `${siteUrl}/es` : siteUrl;

  // Homepage keeps the brand card (no page title), but still declares
  // dimensions so WhatsApp/Facebook render the preview reliably.
  const rootOgImage = {
    url: buildOgImageUrl({ locale }),
    width: 1200,
    height: 630,
    alt: siteName,
  };

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    openGraph: {
      type: "website",
      locale: lang === "es" ? "es_US" : "en_US",
      url: canonical,
      siteName,
      title: siteName,
      description,
      images: [rootOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: [rootOgImage],
    },
    alternates: {
      canonical,
      languages: {
        "en-US": siteUrl,
        "es-US": `${siteUrl}/es`,
        "x-default": siteUrl,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [{ url: "/favicon.png", type: "image/png" }],
      apple: [{ url: "/apple-icon.png", type: "image/png" }],
    },
  };
}
