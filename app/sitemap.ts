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
  { path: "/special", changeFrequency: "monthly", priority: 0.6 },
];

import { supabase } from "@/supabaseClient";
import { CLINICA_TENANT_ID, EXCLUDED_LOCATION_SLUGS } from "@/utils/clinicaLocations";
import { CITIES } from "@/utils/cities";

const EXCLUDED_SERVICE_IDS = [24, 50]; // Dentist (24) and the "Others" catch-all (50)

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
  const { data: locations } = await supabase
    .from("Locations")
    .select("slug")
    .eq("tenant_id", CLINICA_TENANT_ID)
    .eq("is_active", true)
    .not("slug", "in", `(${EXCLUDED_LOCATION_SLUGS.join(",")})`);
    
  if (locations) {
    for (const location of locations) {
      const path = `/contact/${location.slug}`;
      const enUrl = `${siteUrl}${path}`;
      const esUrl = `${siteUrl}/es${path}`;
      
      entries.push({
        url: enUrl,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: { languages: { "en-US": enUrl, "es-US": esUrl } },
      });
      entries.push({
        url: esUrl,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages: { "en-US": enUrl, "es-US": esUrl } },
      });
    }
  }

  // Fetch dynamic services. Slugs are canonical — emitting numeric ids here
  // would fill the sitemap with URLs that only redirect.
  const { data: servicesRaw } = await supabase.from("services").select("id, slug");
  const services = (servicesRaw ?? []) as unknown as Array<{
    id: number;
    slug: string | null;
  }>;
  if (services.length) {
    for (const service of services) {
      if (EXCLUDED_SERVICE_IDS.includes(service.id)) continue;
      const path = `/services/${service.slug ?? service.id}`;
      const enUrl = `${siteUrl}${path}`;
      const esUrl = `${siteUrl}/es${path}`;
      
      entries.push({
        url: enUrl,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: { "en-US": enUrl, "es-US": esUrl } },
      });
      entries.push({
        url: esUrl,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: { "en-US": enUrl, "es-US": esUrl } },
      });
    }
  }

  // City hub pages
  for (const city of CITIES) {
    const path = `/${city.slug}`;
    const enUrl = `${siteUrl}${path}`;
    const esUrl = `${siteUrl}/es${path}`;

    entries.push({
      url: enUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
      alternates: { languages: { "en-US": enUrl, "es-US": esUrl } },
    });
    entries.push({
      url: esUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
      alternates: { languages: { "en-US": enUrl, "es-US": esUrl } },
    });
  }

  // City x service pages
  const { data: serviceSlugs } = await supabase
    .from("services")
    .select("id, slug")
    .not("slug", "is", null);

  const citySlugsForServices = (serviceSlugs ?? []).filter(
    (s) => !EXCLUDED_SERVICE_IDS.includes(s.id)
  );

  for (const city of CITIES) {
    for (const service of citySlugsForServices) {
      const path = `/${city.slug}/${service.slug}`;
      const enUrl = `${siteUrl}${path}`;
      const esUrl = `${siteUrl}/es${path}`;

      entries.push({
        url: enUrl,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: { "en-US": enUrl, "es-US": esUrl } },
      });
      entries.push({
        url: esUrl,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: { "en-US": enUrl, "es-US": esUrl } },
      });
    }
  }

  return entries;
}
