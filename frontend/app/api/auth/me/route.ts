import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { extractBearerToken, decodeToken } from "@/lib/auth";

interface UserRow {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = extractBearerToken(authHeader);

  if (!token) {
    return NextResponse.json({ detail: "Authentication required." }, { status: 401 });
  }

  const decoded = await decodeToken(token);
  if (!decoded) {
    return NextResponse.json({ detail: "Invalid or expired token." }, { status: 401 });
  }

  const db = getDb();
  const user = db
    .prepare(`SELECT id, email, name, created_at FROM users WHERE id = ?`)
    .get(decoded.sub) as UserRow | undefined;

  if (!user) {
    return NextResponse.json({ detail: "User not found." }, { status: 404 });
  }

  return NextResponse.json(user, { status: 200 });
}

