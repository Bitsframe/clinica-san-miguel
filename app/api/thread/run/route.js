import { NextResponse } from "next/server";
// import { runCheck } from "../../../utils/OpenAi";

// Route to check on the run thread
export async function GET(req) {
  try {
    // Extracting parameters from the query string
    const searchParams = req.nextUrl.searchParams;
    const threadId = searchParams.get("threadId");
    const runId = searchParams.get("runId");

    // Error handling if threadId or runId is missing
    if (!threadId || !runId) {
      return NextResponse.json(
        { error: "Missing Query Parameters" },
        { status: 400 }
      );
    }

    // Fetching the run check
    // const check = await runCheck({ threadId, runId });
    // return NextResponse.json({ check });
    return NextResponse.json({ message: "OpenAI thread functionality is currently disabled" }, { status: 503 });
  } catch (error) {
    // Handling errors
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
