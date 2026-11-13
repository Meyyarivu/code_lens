import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { createAccessToken } from "@/lib/auth";

interface UserRow {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export async function POST(req: NextRequest) {
  let body: { name?: unknown; email?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  // Input validation
  if (name.length < 2 || name.length > 100) {
    return NextResponse.json(
      { detail: "Name must be between 2 and 100 characters." },
      { status: 400 }
    );
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ detail: "Invalid email address." }, { status: 400 });
  }
  if (password.length < 6 || password.length > 128) {
    return NextResponse.json(
      { detail: "Password must be between 6 and 128 characters." },
      { status: 400 }
    );
  }

  const db = getDb();

  // Check for existing user
  const existing = db
    .prepare(`SELECT id FROM users WHERE email = ?`)
    .get(email);
  if (existing) {
    return NextResponse.json(
      { detail: "An account with this email already exists." },
      { status: 400 }
    );
  }

  const id = uuidv4();
  const hashed = await hashPassword(password);
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO users (id, email, name, hashed_password, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, email, name, hashed, now);

  const user: UserRow = { id, email, name, created_at: now };
  const accessToken = await createAccessToken(id, email);

  return NextResponse.json(
    {
      access_token: accessToken,
      token_type: "bearer",
      user: { id: user.id, email: user.email, name: user.name, created_at: user.created_at },
    },
    { status: 201 }
  );
}

