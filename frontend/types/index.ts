// ─── Severity & Category ───────────────────────────────────────────────────
export type SeverityType = "critical" | "high" | "medium" | "low" | "info";
export type CategoryType =
  | "bug"
  | "security"
  | "performance"
  | "quality"
  | "maintainability";

// ─── Issue ─────────────────────────────────────────────────────────────────
export interface IssueItem {
  id: string;
  severity: SeverityType;
  category: CategoryType;
  title: string;
  description: string;
  line_start: number;
  line_end: number;
  suggestion: string;
  fixed_code: string;
}

// ─── Review Result ─────────────────────────────────────────────────────────
export interface ReviewResult {
  score: number;
  summary: string;
  issues: IssueItem[];
  strengths: string[];
  overall_recommendations: string[];
  fixed_code: string;
}

// ─── Review Response Shapes ────────────────────────────────────────────────
export interface ReviewDetailResponse {
  id: string;
  filename: string;
  language: string;
  created_at: string;
  original_code: string;
  review: ReviewResult;
}

export interface ReviewListItem {
  id: string;
  filename: string;
  language: string;
  score: number;
  issue_count: number;
  created_at: string;
}

// ─── Health Response ───────────────────────────────────────────────────────
export interface HealthResponse {
  status: string;
  groq_connected: boolean;
  configured_model: string;
  model_available: boolean;
  error_message?: string | null;
  // Legacy compat fields (kept for backwards compatibility with existing UI code)
  ollama_connected?: boolean;
  available_models?: string[];
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ─── Supported Languages (used by CodeEditor & Settings) ──────────────────
export const SUPPORTED_LANGUAGES = [
  { id: "javascript", name: "JavaScript", extension: ".js" },
  { id: "typescript", name: "TypeScript", extension: ".ts" },
  { id: "python", name: "Python", extension: ".py" },
  { id: "java", name: "Java", extension: ".java" },
  { id: "cpp", name: "C++", extension: ".cpp" },
  { id: "c", name: "C", extension: ".c" },
  { id: "go", name: "Go", extension: ".go" },
  { id: "rust", name: "Rust", extension: ".rs" },
  { id: "html", name: "HTML", extension: ".html" },
  { id: "css", name: "CSS", extension: ".css" },
  { id: "json", name: "JSON", extension: ".json" },
  { id: "plaintext", name: "Plain Text", extension: ".txt" },
] as const;
