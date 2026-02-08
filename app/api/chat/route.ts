import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });

    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: message,
      config: {
        systemInstruction: "You are Fyndmate, a helpful Indian shopping buddy. Suggest products in Hinglish.",
      },
    });

    return NextResponse.json({ output: result.text ?? "" });
  } catch (error) {
    return NextResponse.json({ error: "Brain error!" }, { status: 500 });
  }
}

