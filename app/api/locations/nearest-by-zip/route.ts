import { NextRequest, NextResponse } from "next/server";
import {
  lookupZipcode,
  extractZipcodeFromAddress,
  calculateDistance,
  findNearestLocations,
  normalizeZip5,
} from "@/utils/zipcodeService";

export const runtime = "nodejs";

type LocationInput = {
  id: number;
  title?: string | null;
  address?: string | null;
  [key: string]: unknown;
};

async function openAiGeocodeClinics(
  apiKey: string,
  userZip: string,
  items: { id: number; title?: string | null; address?: string | null }[]
): Promise<Map<number, { lat: number; lng: number }> | null> {
  const locations = items
    .filter((i) => (i.address && i.address.trim()) || (i.title && i.title.trim()))
    .map((i) => ({
      id: i.id,
      text: [i.title, i.address].filter(Boolean).join(", "),
    }));

  if (locations.length === 0) {
    return new Map();
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      temperature: 0,
      max_tokens: Math.min(4000, 200 + locations.length * 45),
      messages: [
        {
          role: "system",
          content:
            'You output only valid JSON. Each item is a Texas (USA) clinic. Return WGS84 latitude and longitude accurate enough to sort driving-distance order from a reference ZIP. Shape: {"coords":[{"id":number,"lat":number,"lng":number}]}. Include every input id exactly once.',
        },
        {
          role: "user",
          content: JSON.stringify({ reference_zip: userZip, locations }),
        },
      ],
    }),
  });

  if (!res.ok) {
    return null;
  }

  const raw = await res.text();
  try {
    const parsed = JSON.parse(raw);
    const content = parsed?.choices?.[0]?.message?.content as string | undefined;
    if (!content) return null;
    let inner: { coords?: { id: number; lat: number; lng: number }[] };
    try {
      inner = JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (!m) return null;
      inner = JSON.parse(m[0]);
    }
    const coords = inner.coords || [];
    const map = new Map<number, { lat: number; lng: number }>();
    for (const c of coords) {
      const id = Number(c.id);
      const lat = Number(c.lat);
      const lng = Number(c.lng);
      if (Number.isFinite(id) && Number.isFinite(lat) && Number.isFinite(lng)) {
        map.set(id, { lat, lng });
      }
    }
    return map;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const zipRaw = String(body?.zip ?? "").trim();
    const limit = Math.min(Math.max(Number(body?.limit) || 9, 1), 50);
    const locations = (body?.locations ?? []) as LocationInput[];

    const zip = normalizeZip5(zipRaw);
    if (!zip) {
      return NextResponse.json({ error: "Invalid US ZIP code" }, { status: 400 });
    }
    const userLoc = await lookupZipcode(zip);
    if (!userLoc?.latitude || !userLoc?.longitude) {
      return NextResponse.json(
        { error: "Could not resolve ZIP code to coordinates" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    let coordMap: Map<number, { lat: number; lng: number }> | null = null;

    if (apiKey && locations.length > 0) {
      coordMap = await openAiGeocodeClinics(apiKey, zip, locations);
    }

    const merged: Array<LocationInput & { distance: number }> = [];

    for (const loc of locations) {
      let lat: number | undefined;
      let lng: number | undefined;

      const fromAi = coordMap?.get(Number(loc.id));
      if (fromAi) {
        lat = fromAi.lat;
        lng = fromAi.lng;
      }

      if (lat == null || lng == null) {
        const z = extractZipcodeFromAddress(loc.address ?? null);
        if (z) {
          const place = await lookupZipcode(z);
          if (place?.latitude != null && place?.longitude != null) {
            lat = place.latitude;
            lng = place.longitude;
          }
        }
      }

      if (lat == null || lng == null) continue;

      const distance = calculateDistance(
        userLoc.latitude,
        userLoc.longitude,
        lat,
        lng
      );
      merged.push({ ...loc, distance });
    }

    merged.sort((a, b) => a.distance - b.distance);
    let results = merged.slice(0, limit);

    if (results.length === 0) {
      results = await findNearestLocations(zip, locations, limit);
    }

    return NextResponse.json({ results });
  } catch (e) {
    console.error("[nearest-by-zip]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
