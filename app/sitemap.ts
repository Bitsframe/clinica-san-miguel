import { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.clinicsanmiguel.com";

type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

interface RouteConfig {
  path: string;
  changeFrequency: ChangeFreq;
  priority: number;
}

const routes: RouteConfig[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/career", changeFrequency: "monthly", priority: 0.7 },
  { path: "/testimonials", changeFrequency: "monthly", priority: 0.7 },
  { path: "/additionalservices", changeFrequency: "monthly", priority: 0.7 },
  { path: "/registration", changeFrequency: "yearly", priority: 0.6 },
  { path: "/special", changeFrequency: "monthly", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    const enUrl = `${siteUrl}${route.path}`;
    const esUrl = `${siteUrl}/es${route.path}`;

    entries.push({
      url: enUrl,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          en: enUrl,
          es: esUrl,
        },
      },
    });

    entries.push({
      url: esUrl,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority * 0.9,
      alternates: {
        languages: {
          en: enUrl,
          es: esUrl,
        },
      },
    });
  }

  return entries;
}
