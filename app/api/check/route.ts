import { NextResponse } from "next/server";
export async function POST(req: any, res: any) {
  try {
    const { message } = await req.json();

    const TriggerResponse = await fetch("http://64.23.151.134:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      });
    // console.log(TriggerResponse);

    const triggerData = await TriggerResponse.json();
    // console.log(triggerData.answer);
    const answer=triggerData.answer.answer
    return NextResponse.json( { answer },{ status: 200 });
  } catch (error) {
    console.log("Error in message post", error);
  }
}
