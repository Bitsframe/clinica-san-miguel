import { NextResponse } from "next/server";
import axios from "axios";

/** One feature from the Mapbox Geocoding v6 forward endpoint. Only the fields
 *  used to rebuild a flat address line are typed. */
interface MapboxFeature {
  properties?: {
    name?: string;
    context?: {
      place?: { name?: string };
      region?: { region_code?: string };
      postcode?: { name?: string };
    };
  };
}

export async function POST(req: Request) {
  try {
    const { address } = await req.json();

    if (typeof address !== "string" || address.trim().length < 4) {
      return NextResponse.json({ suggestions: [] }, { status: 200 });
    }

    const accessToken = process.env.MAPBOX_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json({ suggestions: [] }, { status: 200 });
    }

    const response = await axios.get(
      "https://api.mapbox.com/search/geocode/v6/forward",
      {
        params: {
          q: address,
          access_token: accessToken,
          country: "us",
          types: "address",
          autocomplete: true,
          limit: 5,
        },
      }
    );

    // Rebuilt from context rather than using properties.full_address, which
    // spells the state out ("Texas") and appends ", United States". The client
    // runs extractStateZip() over this string and needs it to end in the
    // two-letter state followed by the ZIP.
    const suggestions =
      response.data?.features
        ?.map((feature: MapboxFeature) => {
          const props = feature.properties;
          const context = props?.context;

          const parts = [
            props?.name,
            context?.place?.name,
            context?.region?.region_code,
            context?.postcode?.name,
          ].filter(Boolean);

          return parts.join(" ");
        })
        .filter((s: string) => s.length > 0) || [];

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("[Address API] Error fetching address suggestions:", error);
    return NextResponse.json({ suggestions: [] }, { status: 200 });
  }
}
