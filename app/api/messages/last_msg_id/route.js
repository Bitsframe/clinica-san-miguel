import { NextResponse } from "next/server";
// import { getLastMessageId } from "../../../utils/OpenAi";

//get all message using thread id
export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("threadId");

    //error if missing
    if (!query) {
      return NextResponse.json({ error: "Missing Query" }, { status: 400 });
    }

    // let messages = await getLastMessageId(query);
    // return NextResponse.json({ messages });
    return NextResponse.json({ message: "OpenAI messaging functionality is currently disabled" }, { status: 503 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
