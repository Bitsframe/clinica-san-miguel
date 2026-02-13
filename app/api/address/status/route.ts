import { NextResponse } from "next/server";

export async function GET() {
  const authId = process.env.SMARTY_AUTH_ID;
  const authToken = process.env.SMARTY_AUTH_TOKEN;

  const integrated = !!(authId && authToken);

  console.log("[Address Status API] Checking integration status:", {
    hasAuthId: !!authId,
    hasAuthToken: !!authToken,
    integrated,
    authIdPreview: authId ? `${authId.substring(0, 8)}...` : 'missing',
    authTokenPreview: authToken ? `${authToken.substring(0, 8)}...` : 'missing'
  });

  return NextResponse.json({ integrated });
}
