import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { address } = await req.json();

    if (typeof address !== "string" || address.trim().length < 4) {
      return NextResponse.json({ suggestions: [] }, { status: 200 });
    }

    const authId = process.env.SMARTY_AUTH_ID;
    const authToken = process.env.SMARTY_AUTH_TOKEN;

    if (!authId || !authToken) {
      return NextResponse.json({ suggestions: [] }, { status: 200 });
    }

    const response = await axios.get(
      "https://us-autocomplete-pro.api.smartystreets.com/lookup",
      {
        params: {
          "auth-id": authId,
          "auth-token": authToken,
          search: address,
          max_results: 5,
        },
      }
    );

    const suggestions =
      response.data?.suggestions?.map((s: {
        street_line?: string;
        secondary?: string;
        city?: string;
        state?: string;
        zipcode?: string;
      }) => {
        const parts = [
          s.street_line,
          s.secondary,
          s.city,
          s.state,
          s.zipcode,
        ].filter(Boolean);

        return parts.join(" ");
      }) || [];

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("[Address API] Error fetching address suggestions:", error);
    return NextResponse.json({ suggestions: [] }, { status: 200 });
  }
}
