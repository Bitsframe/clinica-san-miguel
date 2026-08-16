import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata, formatLocationName } from "@/utils/seo";
import { supabase } from "@/supabaseClient";
import { CLINICA_TENANT_ID } from "@/utils/clinicaLocations";
import { CITIES, getCityBySlug } from "@/utils/cities";
import { Location } from "@/components";
import { parseLatLngFromDirection } from "@/utils/zipcodeService";

export const revalidate = 0;

/**
 * id 50 ("Others") is a catch-all row, not a real service.
 * id 24 (Dentist) is excluded per request — dental isn't offered at every medical location
 * (the separate "Dentista San Miguel" GMB listings confirm it's a distinct sub-brand/address).
 */
const EXCLUDED_SERVICE_IDS = [24, 50];

export async function generateStaticParams() {
  const { data: services } = await supabase
    .from("services")
    .select("id, slug")
    .not("slug", "is", null);

  const serviceSlugs = (services ?? [])
    .filter((s) => !EXCLUDED_SERVICE_IDS.includes(s.id))
    .map((s) => s.slug as string);

  const locales = ["en", "es"];
  const params = [];
  for (const locale of locales) {
    for (const city of CITIES) {
      for (const serviceSlug of serviceSlugs) {
        params.push({ locale, city: city.slug, service: serviceSlug });
      }
    }
  }
  return params;
}

async function getService(slug: string) {
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

async function getCityLocations(cityName: string) {
  const { data } = await supabase
    .from("Locations")
    .select("*")
    .eq("tenant_id", CLINICA_TENANT_ID)
    .eq("is_active", true)
    .eq("city", cityName);
  return data ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string; service: string }>;
}): Promise<Metadata> {
  const { locale, city: citySlug, service: serviceSlug } = await params;
  const city = getCityBySlug(citySlug);
  const service = await getService(serviceSlug);

  if (!city || !service) {
    return buildPageMetadata({ locale, title: "Services", path: "/services" });
  }

  const cityName = locale === "es" ? city.nameEs : city.name;
  const isEs = locale === "es";

  const title = isEs
    ? `${service.title} en ${cityName}, TX`
    : `${service.title} in ${cityName}, TX`;

  const description = isEs
    ? `${service.title} en Clínica San Miguel ${cityName}. Sin cita previa, precios accesibles, personal bilingüe.`
    : `${service.title} at Clinica San Miguel ${cityName}. Walk-ins welcome, cash-pay pricing, bilingual staff.`;

  return buildPageMetadata({
    locale,
    title,
    description,
    path: `/${city.slug}/${service.slug}`,
  });
}

export default async function CityServicePage({
  params,
}: {
  params: Promise<{ locale: string; city: string; service: string }>;
}) {
  const { locale, city: citySlug, service: serviceSlug } = await params;
  const city = getCityBySlug(citySlug);
  const service = await getService(serviceSlug);

  if (!city || !service) {
    notFound();
  }

  const cityName = locale === "es" ? city!.nameEs : city!.name;
  const locations = await getCityLocations(city!.name);

  if (locations.length === 0) {
    notFound();
  }

  const isEs = locale === "es";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      name: service.title,
      description: service.description,
      url: `https://www.clinicsanmiguel.com/${city!.slug}/${service.slug}`,
    },
    ...locations.map((loc: any) => {
      const coords = parseLatLngFromDirection(loc.direction);
      return {
        "@context": "https://schema.org",
        "@type": "MedicalClinic",
        name: formatLocationName(loc.title),
        address: {
          "@type": "PostalAddress",
          streetAddress: loc.address,
          addressLocality: city!.name,
          addressRegion: "TX",
          addressCountry: "US",
        },
        telephone: loc.phone,
        url: `https://www.clinicsanmiguel.com/contact/${loc.slug}`,
        ...(coords
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: coords.lat,
                longitude: coords.lng,
              },
            }
          : {}),
      };
    }),
  ];

  return (
    <main className="w-full py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="flex flex-col items-center gap-4 sm:gap-6 mb-10 sm:mb-14 px-4 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-[#C1001F]">
          {cityName}
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-poppins text-[#19192C] max-w-3xl">
          {isEs ? `${service!.title} en ${cityName}, TX` : `${service!.title} in ${cityName}, TX`}
        </h1>
        {service!.description && (
          <p className="text-base sm:text-lg text-[#3D3D3C] font-inter max-w-2xl whitespace-pre-line">
            {service!.description}
          </p>
        )}
      </section>

      <section className="flex flex-col items-center gap-4 mb-10 px-4">
        <h2 className="text-xl sm:text-2xl font-semibold font-poppins text-[#19192C]">
          {isEs ? `Clínicas en ${cityName}` : `Locations in ${cityName}`}
        </h2>
      </section>

      <section className="flex flex-wrap justify-center gap-6 px-4">
        {locations.map((loc: any) => (
          <Location
            key={loc.id}
            id={loc.slug}
            locationName={formatLocationName(loc.title)}
            number={loc.phone}
            route={loc.direction}
            location={loc.direction}
            address={loc.address}
          />
        ))}
      </section>
    </main>
  );
}
