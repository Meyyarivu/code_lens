import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { extractBearerToken, decodeToken } from "@/lib/auth";

interface ReviewRow {
  id: string;
  user_id: string | null;
  filename: string;
  language: string;
  score: number;
  issue_count: number;
  created_at: string;
}

export async function GET(req: NextRequest) {
  // --- Auth (optional) ---
  let userId: string | null = null;
  const authHeader = req.headers.get("authorization");
  const token = extractBearerToken(authHeader);
  if (token) {
    const decoded = await decodeToken(token);
    if (decoded) userId = decoded.sub;
  }

  const limitParam = parseInt(
    req.nextUrl.searchParams.get("limit") || "50",
    10
  );
  const limit = Math.max(1, Math.min(200, isNaN(limitParam) ? 50 : limitParam));

  const db = getDb();

  let rows: ReviewRow[];
  if (userId) {
    rows = db
      .prepare(
        `SELECT id, user_id, filename, language, score, issue_count, created_at
         FROM reviews
         WHERE user_id = ? OR user_id IS NULL
         ORDER BY created_at DESC
         LIMIT ?`
      )
      .all(userId, limit) as ReviewRow[];
  } else {
    rows = db
      .prepare(
        `SELECT id, user_id, filename, language, score, issue_count, created_at
         FROM reviews
         ORDER BY created_at DESC
         LIMIT ?`
      )
      .all(limit) as ReviewRow[];
  }

  return NextResponse.json(rows, { status: 200 });
}

