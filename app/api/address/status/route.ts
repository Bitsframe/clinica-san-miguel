import { NextResponse } from "next/server";

export async function GET() {
  const accessToken = process.env.MAPBOX_ACCESS_TOKEN;

  return NextResponse.json({ integrated: !!accessToken });
}
