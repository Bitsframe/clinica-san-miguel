import { NextResponse } from "next/server";

export async function GET() {
  const authId = process.env.SMARTY_AUTH_ID;
  const authToken = process.env.SMARTY_AUTH_TOKEN;

  return NextResponse.json({ integrated: !!(authId && authToken) });
}
