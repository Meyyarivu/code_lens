import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "codelens-super-secret-jwt-key-change-in-prod-2026";
const JWT_ALGORITHM = "HS256";
const JWT_EXPIRES_IN_MINUTES = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE_MINUTES || "10080"
);

const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, hashed);
  } catch {
    return false;
  }
}

export async function createAccessToken(
  userId: string,
  email: string
): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + JWT_EXPIRES_IN_MINUTES * 60;
  return new SignJWT({ sub: userId, email, exp })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .sign(SECRET_KEY);
}

export async function decodeToken(
  token: string
): Promise<{ sub: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: [JWT_ALGORITHM],
    });
    return { sub: payload.sub as string, email: payload.email as string };
  } catch {
    return null;
  }
}

export function extractBearerToken(
  authHeader: string | null
): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7).trim() || null;
}

