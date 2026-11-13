// Language detection from file extension
export const EXTENSION_LANGUAGE_MAP: Record<string, string> = {
  ".js": "javascript",
  ".jsx": "javascript",
  ".ts": "typescript",
  ".tsx": "typescript",
  ".py": "python",
  ".java": "java",
  ".cpp": "cpp",
  ".cc": "cpp",
  ".cxx": "cpp",
  ".c": "c",
  ".h": "c",
  ".hpp": "cpp",
  ".go": "go",
  ".rs": "rust",
  ".html": "html",
  ".htm": "html",
  ".css": "css",
  ".scss": "css",
  ".json": "json",
};

export function detectLanguage(filename: string): string {
  const dotIdx = filename.lastIndexOf(".");
  if (dotIdx !== -1) {
    const ext = filename.slice(dotIdx).toLowerCase();
    return EXTENSION_LANGUAGE_MAP[ext] ?? "plaintext";
  }
  return "plaintext";
}

export function sanitizeFilename(filename: string): string {
  const base = filename.split(/[\\/]/).pop() ?? "uploaded_file.txt";
  const sanitized = base.replace(/[^a-zA-Z0-9_.-]/g, "_");
  return sanitized.slice(0, 100) || "uploaded_file.txt";
}

/** Check whether a Buffer contains null bytes (binary content). */
export function isBinaryBuffer(buf: Buffer): boolean {
  return buf.includes(0x00);
}

