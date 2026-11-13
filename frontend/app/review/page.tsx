"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Play,
  SplitSquareVertical,
  Code2,
  Sparkles,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  FileCode,
  Flame,
  Layers,
  X,
} from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import IssuePanel from "@/components/IssuePanel";
import ReviewDashboard from "@/components/ReviewDashboard";
import DiffViewer from "@/components/DiffViewer";
import ReviewLoading from "@/components/ReviewLoading";
import GroqAlert from "@/components/GroqAlert";
import { submitReview, uploadAndReview, fetchHealth, ApiError, fetchReview } from "@/lib/api";
import {
  IssueItem,
  ReviewDetailResponse,
  SeverityType,
  CategoryType,
  SUPPORTED_LANGUAGES,
} from "@/types";

const SAMPLE_PYTHON = `import os
import sqlite3

def get_user_records(user_id):
    # Vulnerability: Direct SQL string interpolation
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    query = f"SELECT * FROM users WHERE id = '{user_id}'"
    cursor.execute(query)
    records = cursor.fetchall()
    
    # Bug: Resource leak - connection not closed
    # Performance: Redundant list comprehension
    formatted = [dict(row) for row in records if row != None]
    return formatted

def compute_factorial(n):
    # Bug: Infinite recursion hazard on negative numbers or 0
    if n == 1:
        return 1
    return n * compute_factorial(n - 1)
`;

function ReviewContent() {
  const searchParams = useSearchParams();
  const loadReviewId = searchParams.get("id");

  const [code, setCode] = useState<string>(SAMPLE_PYTHON);
  const [language, setLanguage] = useState<string>("python");
  const [filename, setFilename] = useState<string>("snippet.py");
  const [model, setModel] = useState<string>("qwen/qwen3.8-27b");

  const [reviewData, setReviewData] = useState<ReviewDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isGroqOffline, setIsGroqOffline] = useState<boolean>(false);

  const [viewMode, setViewMode] = useState<"editor" | "diff">("editor");
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityType | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | "all">("all");

  const editorRef = useRef<any>(null);

  // Check health on mount to detect configured model
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const h = await fetchHealth();
        if (h.configured_model) setModel(h.configured_model);
        setIsGroqOffline(!h.groq_connected && !h.model_available);
      } catch {
        setIsGroqOffline(true);
      }
    };
    checkBackend();
  }, []);

  // Check if an existing review ID was requested via query param
  useEffect(() => {
    if (loadReviewId) {
      const loadSavedReview = async (id: string) => {
        setLoading(true);
        try {
          const detail = await fetchReview(id);
          setReviewData(detail);
          setCode(detail.original_code);
          setLanguage(detail.language);
          setFilename(detail.filename);
        } catch (err: any) {
          setError("Failed to load review: " + (err.message || "Unknown error"));
        } finally {
          setLoading(false);
        }
      };
      loadSavedReview(loadReviewId);
    }
  }, [loadReviewId]);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.id === newLang);
    if (langObj && filename.includes(".")) {
      const baseName = filename.substring(0, filename.lastIndexOf("."));
      setFilename(`${baseName}${langObj.extension}`);
    }
  };

  const handleFileUpload = async (file: File) => {
    setFilename(file.name);
    // Auto-detect language
    const dotIdx = file.name.lastIndexOf(".");
    if (dotIdx !== -1) {
      const ext = file.name.substring(dotIdx).toLowerCase();
      const matched = SUPPORTED_LANGUAGES.find((l) => l.extension === ext);
      if (matched) {
        setLanguage(matched.id);
      }
    }

    try {
      const text = await file.text();
      setCode(text);
      setReviewData(null);
      setError(null);
    } catch {
      setError("Failed to read the uploaded file.");
    }
  };

  const handleRunReview = async () => {
    if (!code.trim()) {
      setError("Please provide source code to review.");
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedIssueId(null);

    try {
      const result = await submitReview(code, language, filename, model);
      setReviewData(result);
      setIsGroqOffline(false);
    } catch (err: any) {
      if (err instanceof ApiError && err.statusCode === 503) {
        setIsGroqOffline(true);
      } else {
        setError(err.message || "An unexpected error occurred during review.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIssue = (issue: IssueItem) => {
    setSelectedIssueId(issue.id);
    if (viewMode !== "editor") {
      setViewMode("editor");
    }
    if (editorRef.current) {
      editorRef.current.revealLineInCenter(issue.line_start);
      editorRef.current.setPosition({ lineNumber: issue.line_start, column: 1 });
      editorRef.current.focus();
    }
  };

  const handleAcceptFix = () => {
    if (reviewData?.review.fixed_code) {
      setCode(reviewData.review.fixed_code);
      setViewMode("editor");
    }
  };

  const handleRejectFix = () => {
    setViewMode("editor");
  };

  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 pt-4 pb-16 sm:px-6">
      {/* ── Top Workspace Bar ── */}
      <div className="liquid-glass mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-warm-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Review Workspace
            </span>
          </div>

          {/* View Mode Toggle: Editor vs Side-by-Side Diff */}
          {reviewData?.review?.fixed_code && (
            <div className="liquid-glass-subtle flex items-center rounded-xl p-0.5 text-xs">
              <button
                onClick={() => setViewMode("editor")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium transition ${
                  viewMode === "editor"
                    ? "bg-white/[0.1] text-zinc-100 shadow-sm border border-white/[0.08]"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Code2 className="h-3.5 w-3.5 text-warm-400" />
                <span>Editor & Issues</span>
              </button>
              <button
                onClick={() => setViewMode("diff")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium transition ${
                  viewMode === "diff"
                    ? "bg-warm-500/20 text-warm-300 shadow-sm border border-warm-500/30"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <SplitSquareVertical className="h-3.5 w-3.5 text-warm-400" />
                <span>Side-by-Side Diff</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunReview}
            disabled={loading}
            className={`btn-warm flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <Sparkles className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Reviewing..." : "Run AI Review"}</span>
          </button>
        </div>
      </div>

      {/* ── Offline Banner ── */}
      {isGroqOffline && (
        <div className="mb-5">
          <GroqAlert configuredModel={model} onRetry={handleRunReview} />
        </div>
      )}

      {/* ── Error Banner ── */}
      {error && !isGroqOffline && (
        <div className="liquid-glass mb-5 flex items-center justify-between rounded-2xl border-rose-500/30 bg-rose-950/20 p-4 text-xs text-rose-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="rounded-lg p-1 text-rose-400 hover:bg-rose-900/40 hover:text-rose-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Loading Animation ── */}
      {loading && (
        <div className="liquid-glass mb-5 rounded-3xl py-12">
          <ReviewLoading modelName={model} />
        </div>
      )}

      {/* ── Review Results Dashboard ── */}
      {!loading && reviewData?.review && (
        <div className="mb-5">
          <ReviewDashboard
            review={reviewData.review}
            selectedSeverity={selectedSeverity}
            onSelectSeverity={setSelectedSeverity}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      )}

      {/* ── Main Workspace View ── */}
      {!loading && (
        viewMode === "diff" && reviewData?.review?.fixed_code ? (
          <div className="h-[680px]">
            <DiffViewer
              originalCode={code}
              fixedCode={reviewData.review.fixed_code}
              language={language}
              filename={filename}
              onAcceptFix={handleAcceptFix}
              onRejectFix={handleRejectFix}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[640px]">
            {/* Left: Code Editor (7 cols or 12 if no issues) */}
            <div className={`${reviewData?.review ? "lg:col-span-7" : "lg:col-span-12"} h-[640px]`}>
              <CodeEditor
                code={code}
                onChange={setCode}
                language={language}
                onLanguageChange={handleLanguageChange}
                onFileUpload={handleFileUpload}
                filename={filename}
                issues={reviewData?.review?.issues || []}
                selectedIssueId={selectedIssueId}
                editorRef={editorRef}
              />
            </div>

            {/* Right: Issues Panel (5 cols) */}
            {reviewData?.review && (
              <div className="lg:col-span-5 h-[640px]">
                <IssuePanel
                  issues={reviewData.review.issues || []}
                  selectedIssueId={selectedIssueId}
                  onSelectIssue={handleSelectIssue}
                  selectedSeverity={selectedSeverity}
                  selectedCategory={selectedCategory}
                />
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center text-xs text-zinc-500">
          Loading workspace...
        </div>
      }
    >
      <ReviewContent />
    </Suspense>
  );
}
