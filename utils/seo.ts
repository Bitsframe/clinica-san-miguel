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

export function buildPageMetadata({
  locale,
  title,
  description,
  path = "",
}: {
  locale: string;
  title?: string;
  description?: string;
  path?: string;
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
      images: ["/apple-icon.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: formattedTitle,
      description: desc,
      images: ["/apple-icon.png"],
    },
    alternates: {
      canonical,
      languages: {
        en: enUrl,
        es: esUrl,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function getRootMetadata(locale: string): Metadata {
  const lang = locale === "es" ? "es" : "en";
  const description = getSiteDescription(locale);
  const canonical = locale === "es" ? `${siteUrl}/es` : siteUrl;

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
      images: ["/apple-icon.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: ["/apple-icon.png"],
    },
    alternates: {
      canonical,
      languages: {
        en: siteUrl,
        es: `${siteUrl}/es`,
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
