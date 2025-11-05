import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "Server missing GOOGLE_GEMINI_API_KEY. Add it to .env.local and restart." },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const text = lastUser?.content?.toString()?.slice(0, 4000) || "";
    if (!text) {
      return NextResponse.json({ message: "Please send a non-empty user message." }, { status: 400 });
    }

    const tryCall = async (model) => {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const systemInstruction = {
        role: "user",
        parts: [
          {
            text:
              "You are MedAI, a knowledgeable, friendly, and professional virtual medical assistant. Your purpose is to help users understand their symptoms, medical conditions, and general health concerns using accurate and reliable medical information. Always explain terms and conditions in clear, simple language that non-medical users can understand. Provide possible causes and guidance based on symptoms, but never give a confirmed diagnosis or prescribe medications or dosages. Instead, encourage users to consult a licensed doctor for any specific treatment or diagnosis. If the user mentions serious issues like chest pain, trouble breathing, or loss of consciousness, immediately advise them to seek emergency medical help. When you are unsure, admit it politely and suggest speaking with a healthcare professional. Maintain an empathetic, calm, and respectful tone in every response, and aim to keep answers concise (under 250 words) unless the user asks for more detail. Your goal is to educate, guide, and support users in understanding their health safely and responsibly.",
          },
        ],
      };
      // Build multi-turn content from chat history
      const contents = [];
      for (const m of messages.slice(-20)) {
        if (!m?.content) continue;
        const role = m.role === "assistant" ? "model" : "user";
        contents.push({ role, parts: [{ text: String(m.content).slice(0, 4000) }] });
      }
      if (contents.length === 0) contents.push({ role: "user", parts: [{ text }] });

      const payload = {
        systemInstruction,
        contents,
        generationConfig: {
          temperature: 0.6,
          topP: 0.9,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
        ],
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Gemini error ${res.status}: ${msg}`);
      }
      const data = await res.json();
      const candidate = data?.candidates?.[0];
      const parts = candidate?.content?.parts || [];
      const textOut = parts.map((p) => p?.text).filter(Boolean).join("\n");
      return textOut?.trim() || "";
    };

    // Try the chosen model first; fall back if no output
    const primaryModel = "gemini-2.5-flash";
    let output = "";
    try {
      output = await tryCall(primaryModel);
    } catch {}
    if (!output) {
      try {
        output = await tryCall("gemini-1.5-flash");
      } catch {}
    }
    if (!output) {
      output = "I couldn't generate a response right now. Please try again.";
    }

    return NextResponse.json({ message: output });
  } catch (e) {
    return NextResponse.json({ message: `Error: ${e.message}` }, { status: 500 });
  }
}
