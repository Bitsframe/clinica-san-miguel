import { NextResponse } from "next/server";
// import { UploadFile } from "../../utils/OpenAi";

//create new thread
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    // let newFile = await UploadFile(file);
    // return NextResponse.json(newFile);
    return NextResponse.json({ message: "OpenAI file upload functionality is currently disabled" }, { status: 503 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
