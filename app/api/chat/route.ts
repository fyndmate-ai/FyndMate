import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY!);
    
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are Fyndmate, a helpful Indian shopping buddy. Suggest products in Hinglish.",
    });

    const result = await model.generateContent(message);
    return NextResponse.json({ output: result.response.text() });
  } catch (error) {
    return NextResponse.json({ error: "Brain error!" }, { status: 500 });
  }
}

