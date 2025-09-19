import { NextResponse } from "next/server";
// import { createMessage } from "../../utils/OpenAi";

//create new message
export async function POST(req) {
  try {
    const formData = await req.formData();
    let threadId = formData.get("threadId");
    let content = formData.get("content");

    if (!threadId || !content) {
      return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
    }

    // let newMessage = await createMessage({ threadId, content });
    // return NextResponse.json({ message: newMessage });
    return NextResponse.json({ message: "OpenAI messaging functionality is currently disabled" }, { status: 503 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
