import { NextResponse } from "next/server";
// import { runAssistant } from "../../../utils/OpenAi";

// Run the assistant
export async function POST(req) {
  try {
    // Parsing the JSON data from the request body
    const { assistantId, threadId } = await req.json();

    // Check if the fields are empty
    if (!assistantId || !threadId) {
      return NextResponse.json(
        { error: "Assistant ID and Thread ID are required" },
        { status: 400 }
      );
    }

    // Run the assistant
    // const assistantResult = await runAssistant({ assistantId, threadId });
    // return NextResponse.json(assistantResult);
    return NextResponse.json({ message: "OpenAI assistant functionality is currently disabled" }, { status: 503 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
