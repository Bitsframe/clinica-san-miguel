import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch("https://api.vapi.ai/call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`, // PRIVATE KEY
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assistant: {
       assistantId: process.env.NEXT_PUBLIC_CLINIC_VAPI_ASSISTANT_ID!,
      },
      transport: {
        provider: "vapi.websocket",
      },
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
