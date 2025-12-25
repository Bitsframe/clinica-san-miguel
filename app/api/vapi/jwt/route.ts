import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("[JWT API] Called /api/vapi/jwt");
  const orgId = process.env.VAPI_ORG_ID;
  const privateKey = process.env.VAPI_PRIVATE_KEY;
  const assistantId = process.env.VAPI_ASSISTANT_ID || "YOUR_ASSISTANT_ID";

  console.log("[JWT API] ORG ID:", orgId);
  console.log("[JWT API] PRIVATE KEY exists:", !!privateKey);
  console.log("[JWT API] ASSISTANT ID:", assistantId);

  if (!orgId || !privateKey) {
    console.error("[JWT API] Missing orgId or privateKey");
    return NextResponse.json({ error: "Missing orgId or privateKey" }, { status: 500 });
  }

  const payload = {
    orgId,
    token: {
      tag: "public",
      restrictions: {
        enabled: true,
        allowedOrigins: ["https://aleeza-clinica.myclinicmd.com"],
        allowedAssistantIds: [assistantId],
        allowTransientAssistant: false,
      },
    },
  };

  console.log("[JWT API] Payload:", payload);

  try {
    const token = jwt.sign(payload, privateKey, { expiresIn: "1h" });
    console.log("[JWT API] JWT generated");
    return NextResponse.json({ token });
  } catch (err) {
    console.error("[JWT API] JWT generation error:", err);
    return NextResponse.json({ error: "JWT generation failed" }, { status: 500 });
  }
}
