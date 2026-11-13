import {
  HealthResponse,
  ReviewDetailResponse,
  ReviewListItem,
  User,
  AuthResponse,
} from "@/types";

// All API calls now go to Next.js internal routes — no external backend needed
const API_BASE = "";

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("codelens_token");
  }
  return null;
}

export function setAuthToken(token: string | null): void {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("codelens_token", token);
    } else {
      localStorage.removeItem("codelens_token");
    }
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = `Request failed with status ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson.detail) {
        errorDetail = errJson.detail;
      }
    } catch {
      // ignore
    }
    throw new ApiError(errorDetail, res.status);
  }
  return res.json() as Promise<T>;
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return await handleResponse<AuthResponse>(res);
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return await handleResponse<AuthResponse>(res);
}

export async function fetchCurrentUser(): Promise<User> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });
  return await handleResponse<User>(res);
}

export async function fetchHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { cache: "no-store" });
    return await handleResponse<HealthResponse>(res);
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Unable to connect to CodeLens backend service.", 503);
  }
}

export async function submitReview(
  code: string,
  language: string,
  filename?: string,
  model?: string
): Promise<ReviewDetailResponse> {
  const url = new URL(`${API_BASE}/api/review`, window.location.origin);
  if (model) url.searchParams.set("model", model);

  try {
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ code, language, filename }),
    });
    return await handleResponse<ReviewDetailResponse>(res);
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      "Failed to communicate with the server. Please try again.",
      500
    );
  }
}

export async function uploadAndReview(
  file: File,
  language?: string,
  model?: string
): Promise<ReviewDetailResponse> {
  const url = new URL(`${API_BASE}/api/review/upload`, window.location.origin);
  if (language) url.searchParams.set("language", language);
  if (model) url.searchParams.set("model", model);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });
    return await handleResponse<ReviewDetailResponse>(res);
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      "Failed to upload or analyze file. Please verify file format and size.",
      500
    );
  }
}

export async function fetchReviews(): Promise<ReviewListItem[]> {
  const res = await fetch(`${API_BASE}/api/reviews`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });
  return await handleResponse<ReviewListItem[]>(res);
}

export async function fetchReview(id: string): Promise<ReviewDetailResponse> {
  const res = await fetch(`${API_BASE}/api/reviews/${id}`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });
  return await handleResponse<ReviewDetailResponse>(res);
}

export async function deleteReview(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/reviews/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  await handleResponse<unknown>(res);
}
