import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/seo";
import { supabase } from "@/supabaseClient";
import { CLINICA_TENANT_ID } from "@/utils/clinicaLocations";
import { DetailedLocation } from "./DetailedLocation";

export async function generateStaticParams() {
  const { data: locations } = await supabase
    .from("Locations")
    .select("slug")
    .eq("tenant_id", CLINICA_TENANT_ID)
    .not("slug", "is", null);

  if (!locations) return [];

  const locales = ["en", "es"];
  const params = [];
  
  for (const locale of locales) {
    for (const location of locations) {
      if (location.slug) {
        params.push({ locale, slug: location.slug });
      }
    }
  }
  
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!slug) {
    return buildPageMetadata({
      locale,
      title: "Clinic Location",
      path: `/contact`,
    });
  }

  const { data: _data } = await supabase
    .from("Locations")
    .select("title, address")
    .eq("slug", slug)
    .eq("tenant_id", CLINICA_TENANT_ID)
    .maybeSingle();

  const data = _data as { title: string; address: string } | null;
  const title = data?.title || "Clinic Location";
  const address = data?.address ? ` Located at ${data.address}.` : "";
  const description =
    locale === "es"
      ? `Visite ${title} de Clínica San Miguel.${address} Atención médica familiar asequible. Sin cita.`
      : `Visit ${title} at Clinica San Miguel.${address} Affordable family medicine. Walk-ins welcome.`;

  return buildPageMetadata({
    locale,
    title,
    description,
    path: `/contact/${slug}`,
  });
}

import { parseLatLngFromDirection } from "@/utils/zipcodeService";

export default async function LocationDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return null;
  }

  // Fetch location by slug
  const { data: location } = await supabase
    .from("Locations")
    .select("*")
    .eq("slug", slug)
    .eq("tenant_id", CLINICA_TENANT_ID)
    .maybeSingle();

  if (!location) {
    return <DetailedLocation slug={slug} initialLocation={null} initialImages={[]} />;
  }

  const locationId = location.id;

  const [imagesRes] = await Promise.all([
    supabase
      .from("LocationImages")
      .select("url, alt_text")
      .eq("location_id", locationId),
  ]);

  const images = imagesRes.data || [];

  // Parse Coordinates for JSON-LD
  const coords = parseLatLngFromDirection(location.direction);
  
  // Format hours for JSON-LD (OpeningHoursSpecification)
  const openingHoursSpecification = [];
  const daysMap: Record<string, string> = {
    "mon_timing": "Monday",
    "tuesday_timing": "Tuesday",
    "wednesday_timing": "Wednesday",
    "thursday_timing": "Thursday",
    "friday_timing": "Friday",
    "saturday_timing": "Saturday",
    "sunday_timing": "Sunday",
  };
  
  for (const [dbKey, dayName] of Object.entries(daysMap)) {
    const timing = location[dbKey];
    if (timing && timing.trim() !== "" && timing.toLowerCase() !== "closed") {
      // Very basic parsing for schema: standardizing "8:00 AM - 5:00 PM" to "08:00-17:00" if possible
      // Or just outputting the string as is (Google supports text representations often, though HH:MM is preferred)
      // For simplicity, we just add the days and text representation.
      openingHoursSpecification.push({
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": dayName,
        "description": timing
      });
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": location.title,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": location.address,
      "addressCountry": "US",
      "addressRegion": "TX"
    },
    "telephone": location.phone,
    "url": `https://www.clinicsanmiguel.com/contact/${slug}`,
    "availableLanguage": [
      { "@type": "Language", "name": "English" },
      { "@type": "Language", "name": "Spanish" }
    ],
    ...(coords ? {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": coords.lat,
        "longitude": coords.lng
      }
    } : {}),
    "openingHoursSpecification": openingHoursSpecification.length > 0 ? openingHoursSpecification : undefined,
    "image": images.length > 0 ? images[0].url : undefined
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DetailedLocation 
        slug={slug} 
        initialLocation={location}
        initialImages={images}

      />
    </>
  );
}
