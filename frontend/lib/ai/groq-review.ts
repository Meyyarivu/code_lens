import { getGroqClient, GROQ_MODEL } from "@/lib/groq";
import { ReviewResult, IssueItem } from "@/types";

export class GroqConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GroqConnectionError";
  }
}

export class GroqInvalidResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GroqInvalidResponseError";
  }
}

function buildPrompt(
  code: string,
  language: string,
  filename?: string | null
): string {
  const fileInfo = filename ? `Filename: ${filename}\n` : "";
  return `You are a Principal Software Engineer, Senior Security Auditor, and Code Reviewer.
Analyze the following ${language} code thoroughly for:
1. Bugs (logic errors, off-by-one, null references, unhandled exceptions)
2. Security vulnerabilities (OWASP top 10, injection, buffer overflows, insecure deserialization, timing attacks, data leaks)
3. Performance problems (inefficient algorithmic complexity, unnecessary allocations, memory leaks, I/O blocking)
4. Code quality & maintainability (DRY, SOLID, readability, proper error handling)
5. Best-practice and idiom violations for ${language}

${fileInfo}Source Code:
\`\`\`${language}
${code}
\`\`\`

CRITICAL INSTRUCTIONS:
- You must output STRICT VALID RAW JSON.
- DO NOT wrap the output in markdown code blocks like \`\`\`json or \`\`\`.
- DO NOT include introductory or concluding conversational text.
- Follow this exact JSON schema:
{
  "score": <integer from 0 to 100 representing overall quality>,
  "summary": "<high-level summary of code quality and main concerns>",
  "issues": [
    {
      "id": "issue-1",
      "severity": "critical" | "high" | "medium" | "low" | "info",
      "category": "bug" | "security" | "performance" | "quality" | "maintainability",
      "title": "<concise title>",
      "description": "<thorough explanation of the issue and why it matters>",
      "line_start": <starting line number, integer >= 1>,
      "line_end": <ending line number, integer >= 1>,
      "suggestion": "<actionable fix instructions>",
      "fixed_code": "<replacement code snippet for this specific issue>"
    }
  ],
  "strengths": ["<strength 1>", "<strength 2>"],
  "overall_recommendations": ["<recommendation 1>", "<recommendation 2>"],
  "fixed_code": "<the complete refactored and fixed source code for the entire file>"
}`;
}

function extractAndParseJson(rawText: string): Record<string, unknown> {
  let text = rawText.trim();

  // Remove thinking blocks (reasoning models)
  text = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  // Strip markdown code fences
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  // Find first '{' and last '}'
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch (err) {
    throw new GroqInvalidResponseError(
      `Failed to parse model JSON: ${String(err)}. Raw output excerpt: ${rawText.slice(0, 200)}`
    );
  }
}

function normalizeSeverity(v: unknown): IssueItem["severity"] {
  const valid = ["critical", "high", "medium", "low", "info"] as const;
  const s = String(v ?? "").trim().toLowerCase();
  return (valid.includes(s as IssueItem["severity"]) ? s : "medium") as IssueItem["severity"];
}

function normalizeCategory(v: unknown): IssueItem["category"] {
  const valid = ["bug", "security", "performance", "quality", "maintainability"] as const;
  const s = String(v ?? "").trim().toLowerCase();
  return (valid.includes(s as IssueItem["category"]) ? s : "quality") as IssueItem["category"];
}

function parseReviewResult(data: Record<string, unknown>): ReviewResult {
  const rawIssues = Array.isArray(data.issues) ? data.issues : [];
  const issues: IssueItem[] = rawIssues.map(
    (item: unknown, idx: number): IssueItem => {
      const i = (item ?? {}) as Record<string, unknown>;
      return {
        id: String(i.id ?? `issue-${idx + 1}`),
        severity: normalizeSeverity(i.severity),
        category: normalizeCategory(i.category),
        title: String(i.title ?? "Untitled Issue"),
        description: String(i.description ?? ""),
        line_start: Math.max(1, parseInt(String(i.line_start ?? 1), 10) || 1),
        line_end: Math.max(1, parseInt(String(i.line_end ?? 1), 10) || 1),
        suggestion: String(i.suggestion ?? ""),
        fixed_code: String(i.fixed_code ?? ""),
      };
    }
  );

  const rawScore = parseInt(String(data.score ?? 50), 10);
  const score = isNaN(rawScore) ? 50 : Math.max(0, Math.min(100, rawScore));

  return {
    score,
    summary: String(data.summary ?? ""),
    issues,
    strengths: Array.isArray(data.strengths)
      ? data.strengths.map(String)
      : [],
    overall_recommendations: Array.isArray(data.overall_recommendations)
      ? data.overall_recommendations.map(String)
      : [],
    fixed_code: String(data.fixed_code ?? ""),
  };
}

export async function analyzeCode(
  code: string,
  language: string,
  filename?: string | null,
  model?: string | null
): Promise<ReviewResult> {
  const groq = getGroqClient();
  const chosenModel = model || GROQ_MODEL;
  const prompt = buildPrompt(code, language, filename);

  let rawText: string;
  try {
    const completion = await groq.chat.completions.create({
      model: chosenModel,
      messages: [
        {
          role: "system",
          content:
            "You are a world-class code review assistant. Always respond with strict valid raw JSON only, no markdown, no preamble.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      top_p: 0.9,
      max_tokens: 8192,
      response_format: { type: "json_object" },
    });

    rawText = completion.choices[0]?.message?.content ?? "";
    if (!rawText) {
      throw new GroqInvalidResponseError("Groq returned an empty response.");
    }
  } catch (err: unknown) {
    if (
      err instanceof GroqInvalidResponseError ||
      err instanceof GroqConnectionError
    ) {
      throw err;
    }
    const msg = err instanceof Error ? err.message : String(err);
    if (
      msg.includes("rate_limit") ||
      msg.includes("429")
    ) {
      throw new GroqConnectionError(
        "Groq API rate limit reached. Please wait a moment and try again."
      );
    }
    if (msg.includes("401") || msg.includes("invalid_api_key")) {
      throw new GroqConnectionError(
        "Invalid GROQ_API_KEY. Check your .env.local configuration."
      );
    }
    if (msg.includes("model_not_found") || msg.includes("404")) {
      throw new GroqConnectionError(
        `Model '${chosenModel}' not found. Check the GROQ_MODEL in your .env.local.`
      );
    }
    throw new GroqConnectionError(
      `Groq API error: ${msg}`
    );
  }

  const parsed = extractAndParseJson(rawText);
  return parseReviewResult(parsed);
}

export async function checkGroqHealth(): Promise<{
  connected: boolean;
  model: string;
  error?: string;
}> {
  try {
    const groq = getGroqClient();
    const chosenModel = GROQ_MODEL;
    // Lightweight test call
    await groq.chat.completions.create({
      model: chosenModel,
      messages: [{ role: "user", content: 'Reply with the JSON: {"ok":true}' }],
      max_tokens: 16,
      temperature: 0,
    });
    return { connected: true, model: chosenModel };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { connected: false, model: GROQ_MODEL, error: msg };
  }
}

