import { NextResponse } from "next/server";
// import { getAssistant } from "../../utils/OpenAi";

//get assistant
export async function GET(req) {
  try {
    const assistantId = req.nextUrl.searchParams.get("assistantId");

    //error if missing
    if (!assistantId) {
      return NextResponse.json({ error: "Missing Query" }, { status: 400 });
    }

    // let assistant = await getAssistant(assistantId);
    // return NextResponse.json({ assistant });
    return NextResponse.json({ message: "OpenAI assistant functionality is currently disabled" }, { status: 503 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
