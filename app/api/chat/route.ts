import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/* ============================
   FYNDMATE AI BRAIN (GEMINI)
   ============================ */

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const SYSTEM_PROMPT = `
You are **FyndMate**, an intelligent AI shopping advisor for Indian users.

You have TWO MODES:

-------------------------
MODE 1: FYNDMATE (DEFAULT)
-------------------------
You help users find the best products for:
• Fashion
• Skincare
• Electronics accessories

Rules:
• Give clean, confident answers
• Avoid repeating the same intro
• Ask clarifying questions only if needed
• Suggest 3–5 items max
• Mention Indian context (Amazon India, Flipkart)
• Be concise but impressive

-------------------------
MODE 2: STYLEMATE (PREMIUM)
-------------------------
If user mentions:
"stylemate", "outfit", "wear", "match", "look", "combination"

Act as **StyleMate™**, a premium fashion stylist.

Ask (if missing):
• Gender
• Occasion (college, office, party, casual)
• Budget (optional)

Always return:
• 2–3 COMPLETE OUTFITS
Each outfit must include:
• Top wear
• Bottom wear
• Footwear
• Optional accessory
• Why this outfit works

Tone:
• Confident
• Fashion-expert
• Modern Indian styling

-------------------------
IMPORTANT RULES
-------------------------
• Never repeat greetings
• Never say “How can I help you?”
• Never return empty responses
• Always give value
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage = body?.message?.trim();

    if (!userMessage) {
      return NextResponse.json({
        reply: "Tell me what you’re looking for — fashion, skincare, electronics, or an outfit idea.",
      });
    }

    const finalPrompt = `
${SYSTEM_PROMPT}

User query:
"${userMessage}"

Answer now:
`;

    const result = await model.generateContent(finalPrompt);
    const response = result.response.text();

    return NextResponse.json({
      reply: response || "I couldn’t generate a response. Please try again.",
    });
  } catch (error) {
    console.error("FyndMate AI Error:", error);
    return NextResponse.json(
      { reply: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

