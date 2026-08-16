import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata, formatLocationName } from "@/utils/seo";
import { supabase } from "@/supabaseClient";
import { CLINICA_TENANT_ID } from "@/utils/clinicaLocations";
import { CITIES, getCityBySlug } from "@/utils/cities";
import { Location } from "@/components";
import { parseLatLngFromDirection } from "@/utils/zipcodeService";

export const revalidate = 0;

export async function generateStaticParams() {
  const locales = ["en", "es"];
  const params = [];
  for (const locale of locales) {
    for (const city of CITIES) {
      params.push({ locale, city: city.slug });
    }
  }
  return params;
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
  params: Promise<{ locale: string; city: string }>;
}): Promise<Metadata> {
  const { locale, city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    return buildPageMetadata({ locale, title: "Clinic Locations", path: "/contact" });
  }

  const cityName = locale === "es" ? city.nameEs : city.name;

  const title =
    locale === "es"
      ? `Clínica en ${cityName}, TX`
      : `Clinic in ${cityName}, TX`;

  const description =
    locale === "es"
      ? `Encuentre atención médica familiar asequible en ${cityName}, Texas. Sin cita previa, precios accesibles, personal bilingüe.`
      : `Find affordable family medical care in ${cityName}, Texas. Walk-ins welcome, cash-pay pricing, bilingual staff.`;

  return buildPageMetadata({
    locale,
    title,
    description,
    path: `/${city.slug}`,
  });
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale, city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const cityName = locale === "es" ? city!.nameEs : city!.name;
  const locations = await getCityLocations(city!.name);

  if (locations.length === 0) {
    notFound();
  }

  const isEs = locale === "es";

  const jsonLd = locations.map((loc: any) => {
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
  });

  return (
    <main className="w-full py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="flex flex-col items-center gap-4 sm:gap-6 mb-10 sm:mb-14 px-4 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-[#C1001F]">
          {isEs ? "Nuestras Clínicas" : "Our Clinics"}
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-poppins text-[#19192C] max-w-3xl">
          {isEs ? `Clínica San Miguel en ${cityName}, TX` : `Clinica San Miguel in ${cityName}, TX`}
        </h1>
        <p className="text-base sm:text-lg text-[#3D3D3C] font-inter max-w-2xl">
          {isEs
            ? `${locations.length} ${locations.length === 1 ? "ubicación" : "ubicaciones"} en ${cityName} ofreciendo atención médica familiar sin cita, precios accesibles y personal bilingüe.`
            : `${locations.length} ${locations.length === 1 ? "location" : "locations"} in ${cityName} offering walk-in family medical care, cash-pay pricing, and bilingual staff.`}
        </p>
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
