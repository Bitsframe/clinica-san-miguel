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

  { path: "/additionalservices", changeFrequency: "monthly", priority: 0.7 },
  { path: "/registration", changeFrequency: "yearly", priority: 0.6 },
  { path: "/special", changeFrequency: "monthly", priority: 0.6 },
];

import { supabase } from "@/supabaseClient";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Fetch dynamic locations
  const { data: locations } = await supabase.from("locations").select("id");
  if (locations) {
    for (const location of locations) {
      const path = `/contact/${location.id}`;
      const enUrl = `${siteUrl}${path}`;
      const esUrl = `${siteUrl}/es${path}`;
      
      entries.push({
        url: enUrl,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: { languages: { en: enUrl, es: esUrl } },
      });
      entries.push({
        url: esUrl,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages: { en: enUrl, es: esUrl } },
      });
    }
  }

  // Fetch dynamic services
  const { data: services } = await supabase.from("services").select("id");
  if (services) {
    for (const service of services) {
      const path = `/services/${service.id}`;
      const enUrl = `${siteUrl}${path}`;
      const esUrl = `${siteUrl}/es${path}`;
      
      entries.push({
        url: enUrl,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: { en: enUrl, es: esUrl } },
      });
      entries.push({
        url: esUrl,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: { en: enUrl, es: esUrl } },
      });
    }
  }

  return entries;
}
