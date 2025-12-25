import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("[VAPI START API] Called /api/vapi/start");
  let body;
  try {
    body = await req.json();
    console.log("[VAPI START API] Request body:", body);
  } catch (err) {
    console.error("[VAPI START API] Error parsing JSON body:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const privateKey = process.env.VAPI_PRIVATE_KEY;
  const assistantId = process.env.NEXT_PUBLIC_CLINIC_VAPI_ASSISTANT_ID!;
  console.log("[VAPI START API] PRIVATE KEY exists:", !!privateKey);
  console.log("[VAPI START API] Assistant ID:", assistantId);

  try {
    const response = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${privateKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistant: {
          assistantId: assistantId,
        },
        transport: {
          provider: "vapi.websocket",
        },
      }),
    });
    console.log("[VAPI START API] Vapi /call response status:", response.status);
    const data = await response.json();
    console.log("[VAPI START API] Vapi /call response data:", data);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[VAPI START API] Error calling Vapi /call:", err);
    return NextResponse.json({ error: "Vapi call failed" }, { status: 500 });
  }
}
