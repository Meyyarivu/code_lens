import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "@/lib/db";
import { analyzeCode, GroqConnectionError, GroqInvalidResponseError } from "@/lib/ai/groq-review";
import { extractBearerToken, decodeToken } from "@/lib/auth";

const MAX_UPLOAD_SIZE_MB = parseInt(
  process.env.MAX_UPLOAD_SIZE_MB || "5",
  10
);

export async function POST(req: NextRequest) {
  // --- Auth (optional) ---
  let userId: string | null = null;
  const authHeader = req.headers.get("authorization");
  const token = extractBearerToken(authHeader);
  if (token) {
    const decoded = await decodeToken(token);
    if (decoded) userId = decoded.sub;
  }

  // --- Parse body ---
  let body: { code?: unknown; language?: unknown; filename?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body." }, { status: 400 });
  }

  const code = typeof body.code === "string" ? body.code.trim() : "";
  const language = typeof body.language === "string" ? body.language.trim() : "plaintext";
  const filename = typeof body.filename === "string" ? body.filename.trim() : `snippet.${language}`;

  // Model override via query param
  const modelParam = req.nextUrl.searchParams.get("model") || undefined;

  if (!code) {
    return NextResponse.json(
      { detail: "Source code cannot be empty." },
      { status: 400 }
    );
  }

  // Validate code length
  const maxBytes = MAX_UPLOAD_SIZE_MB * 1024 * 1024;
  if (Buffer.byteLength(code, "utf-8") > maxBytes) {
    return NextResponse.json(
      { detail: `Code exceeds maximum allowed size of ${MAX_UPLOAD_SIZE_MB}MB.` },
      { status: 413 }
    );
  }

  // --- AI Analysis ---
  try {
    const reviewResult = await analyzeCode(code, language, filename, modelParam);

    const db = getDb();
    const reviewId = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO reviews
        (id, user_id, filename, language, score, issue_count, summary,
         issues_json, strengths_json, recommendations_json, original_code, fixed_code, created_at)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      reviewId,
      userId,
      filename,
      language,
      reviewResult.score,
      reviewResult.issues.length,
      reviewResult.summary,
      JSON.stringify(reviewResult.issues),
      JSON.stringify(reviewResult.strengths),
      JSON.stringify(reviewResult.overall_recommendations),
      code,
      reviewResult.fixed_code ?? code,
      now
    );

    return NextResponse.json(
      {
        id: reviewId,
        filename,
        language,
        created_at: now,
        original_code: code,
        review: reviewResult,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof GroqConnectionError) {
      return NextResponse.json({ detail: err.message }, { status: 503 });
    }
    if (err instanceof GroqInvalidResponseError) {
      return NextResponse.json(
        { detail: `AI model produced an invalid response: ${err.message}` },
        { status: 502 }
      );
    }
    console.error("[POST /api/review] Unexpected error:", err);
    return NextResponse.json(
      { detail: "An error occurred while analyzing the code. Please try again." },
      { status: 500 }
    );
  }
}

