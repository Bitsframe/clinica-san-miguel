import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { address } = await req.json();
    console.log("[Address API] Received request for address:", address);

    // Validate input
    if (typeof address !== "string" || address.trim().length < 4) {
      console.log("[Address API] Invalid input - too short or not a string");
      return NextResponse.json({ suggestions: [] }, { status: 200 });
    }

    // Get credentials from environment
    const authId = process.env.SMARTY_AUTH_ID;
    const authToken = process.env.SMARTY_AUTH_TOKEN;

    console.log("[Address API] Credentials check:", {
      hasAuthId: !!authId,
      hasAuthToken: !!authToken,
      authIdLength: authId?.length,
      authTokenLength: authToken?.length
    });

    if (!authId || !authToken) {
      console.error("[Address API] SmartyStreets credentials not configured");
      return NextResponse.json({ suggestions: [] }, { status: 200 });
    }

    console.log("[Address API] Calling SmartyStreets API...");

    // Call SmartyStreets API
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

    console.log("[Address API] SmartyStreets response status:", response.status);
    console.log("[Address API] SmartyStreets response data:", JSON.stringify(response.data, null, 2));

    // Format and return suggestions
    // SmartyStreets returns: { street_line, secondary, city, state, zipcode }
    // We need to format it as: "street_line city state zipcode"
    const suggestions = response.data?.suggestions?.map((s: any) => {
      const parts = [
        s.street_line,
        s.secondary,
        s.city,
        s.state,
        s.zipcode
      ].filter(Boolean); // Remove empty values
      
      return parts.join(' ');
    }) || [];
    
    console.log("[Address API] Formatted suggestions:", suggestions);
    console.log("[Address API] Number of suggestions:", suggestions.length);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("[Address API] Error fetching address suggestions:", error);
    if (axios.isAxiosError(error)) {
      console.error("[Address API] Axios error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      // Log the full error response for debugging
      if (error.response?.data?.errors) {
        console.error("[Address API] SmartyStreets errors:", JSON.stringify(error.response.data.errors, null, 2));
      }
    }
    return NextResponse.json({ suggestions: [] }, { status: 200 });
  }
}
