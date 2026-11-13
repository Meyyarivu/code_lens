import { NextRequest, NextResponse } from "next/server";
import { checkGroqHealth } from "@/lib/ai/groq-review";
import { GROQ_MODEL } from "@/lib/groq";

export async function GET(_req: NextRequest) {
  const health = await checkGroqHealth();
  return NextResponse.json(
    {
      status: "ok",
      groq_connected: health.connected,
      configured_model: health.model || GROQ_MODEL,
      model_available: health.connected,
      error_message: health.error ?? null,
    },
    { status: 200 }
  );
}

