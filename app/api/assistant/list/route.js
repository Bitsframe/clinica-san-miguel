import { NextResponse } from "next/server";
// import { getAllAssitants } from "../../../utils/OpenAi";

//get assistant
export async function GET(req) {
  try {
    // let assistants = await getAllAssitants();
    // return NextResponse.json({ assistants: assistants.data });
    return NextResponse.json({ message: "OpenAI assistant functionality is currently disabled" }, { status: 503 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
