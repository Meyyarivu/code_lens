import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword, createAccessToken } from "@/lib/auth";

interface UserRow {
  id: string;
  email: string;
  name: string;
  hashed_password: string;
  created_at: string;
}

export async function POST(req: NextRequest) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body." }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { detail: "Email and password are required." },
      { status: 400 }
    );
  }

  const db = getDb();
  const user = db
    .prepare(`SELECT * FROM users WHERE email = ?`)
    .get(email) as UserRow | undefined;

  if (!user) {
    return NextResponse.json(
      { detail: "Invalid email or password." },
      { status: 401 }
    );
  }

  const valid = await verifyPassword(password, user.hashed_password);
  if (!valid) {
    return NextResponse.json(
      { detail: "Invalid email or password." },
      { status: 401 }
    );
  }

  const accessToken = await createAccessToken(user.id, user.email);

  return NextResponse.json(
    {
      access_token: accessToken,
      token_type: "bearer",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
      },
    },
    { status: 200 }
  );
}

