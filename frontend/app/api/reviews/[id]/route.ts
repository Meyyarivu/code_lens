import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { IssueItem, ReviewResult } from "@/types";

interface ReviewRow {
  id: string;
  user_id: string | null;
  filename: string;
  language: string;
  score: number;
  issue_count: number;
  summary: string;
  issues_json: string;
  strengths_json: string;
  recommendations_json: string;
  original_code: string;
  fixed_code: string;
  created_at: string;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const row = db
    .prepare(`SELECT * FROM reviews WHERE id = ?`)
    .get(id) as ReviewRow | undefined;

  if (!row) {
    return NextResponse.json({ detail: "Review not found." }, { status: 404 });
  }

  const issues: IssueItem[] = JSON.parse(row.issues_json || "[]");
  const strengths: string[] = JSON.parse(row.strengths_json || "[]");
  const overall_recommendations: string[] = JSON.parse(
    row.recommendations_json || "[]"
  );

  const review: ReviewResult = {
    score: row.score,
    summary: row.summary,
    issues,
    strengths,
    overall_recommendations,
    fixed_code: row.fixed_code || "",
  };

  return NextResponse.json(
    {
      id: row.id,
      filename: row.filename,
      language: row.language,
      created_at: row.created_at,
      original_code: row.original_code,
      review,
    },
    { status: 200 }
  );
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const existing = db
    .prepare(`SELECT id FROM reviews WHERE id = ?`)
    .get(id);

  if (!existing) {
    return NextResponse.json({ detail: "Review not found." }, { status: 404 });
  }

  db.prepare(`DELETE FROM reviews WHERE id = ?`).run(id);
  return NextResponse.json(
    { message: "Review deleted successfully", id },
    { status: 200 }
  );
}

