// route.js

import { NextResponse } from "next/server";
// import { getNewMessages } from "../../../utils/OpenAi";

// Function to get new messages in a thread
export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const threadId = searchParams.get("threadId");
    const lastMessageId = searchParams.get("lastMessageId");

    // Error if threadId or lastMessageId is missing
    if (!threadId || !lastMessageId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // Fetch new messages
    // const newMessages = await getNewMessages(threadId, lastMessageId);
    // return NextResponse.json({ newMessages });
    return NextResponse.json({ message: "OpenAI messaging functionality is currently disabled" }, { status: 503 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
