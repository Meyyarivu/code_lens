import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "@/lib/db";
import { analyzeCode, GroqConnectionError, GroqInvalidResponseError } from "@/lib/ai/groq-review";
import { extractBearerToken, decodeToken } from "@/lib/auth";
import { detectLanguage, sanitizeFilename, isBinaryBuffer } from "@/lib/utils-server";

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

  const modelParam = req.nextUrl.searchParams.get("model") || undefined;
  const languageParam = req.nextUrl.searchParams.get("language") || undefined;

  // --- Parse multipart form ---
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ detail: "Invalid form data." }, { status: 400 });
  }

  const fileEntry = formData.get("file");
  if (!fileEntry || !(fileEntry instanceof Blob)) {
    return NextResponse.json({ detail: "No file uploaded." }, { status: 400 });
  }

  const maxBytes = MAX_UPLOAD_SIZE_MB * 1024 * 1024;
  if (fileEntry.size > maxBytes) {
    return NextResponse.json(
      { detail: `File exceeds maximum allowed size of ${MAX_UPLOAD_SIZE_MB}MB.` },
      { status: 413 }
    );
  }

  const rawFilename =
    fileEntry instanceof File ? fileEntry.name : "uploaded_file.txt";
  const cleanFilename = sanitizeFilename(rawFilename);

  const arrayBuffer = await fileEntry.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Reject binary files
  if (isBinaryBuffer(buffer)) {
    return NextResponse.json(
      { detail: "Binary files are not supported. Please upload a source code text file." },
      { status: 400 }
    );
  }

  let textContent: string;
  try {
    textContent = buffer.toString("utf-8");
  } catch {
    try {
      textContent = buffer.toString("latin1");
    } catch {
      return NextResponse.json(
        { detail: "Unable to decode file as text. Unsupported file encoding." },
        { status: 400 }
      );
    }
  }

  if (!textContent.trim()) {
    return NextResponse.json({ detail: "Uploaded file is empty." }, { status: 400 });
  }

  const language = languageParam || detectLanguage(cleanFilename);

  try {
    const reviewResult = await analyzeCode(
      textContent,
      language,
      cleanFilename,
      modelParam
    );

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
      cleanFilename,
      language,
      reviewResult.score,
      reviewResult.issues.length,
      reviewResult.summary,
      JSON.stringify(reviewResult.issues),
      JSON.stringify(reviewResult.strengths),
      JSON.stringify(reviewResult.overall_recommendations),
      textContent,
      reviewResult.fixed_code ?? textContent,
      now
    );

    return NextResponse.json(
      {
        id: reviewId,
        filename: cleanFilename,
        language,
        created_at: now,
        original_code: textContent,
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
    console.error("[POST /api/review/upload] Unexpected error:", err);
    return NextResponse.json(
      { detail: "Failed to process and analyze uploaded file." },
      { status: 500 }
    );
  }
}

