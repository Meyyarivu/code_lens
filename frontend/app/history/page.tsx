"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  History,
  Trash2,
  ExternalLink,
  FileCode,
  Calendar,
  RefreshCw,
  Inbox,
  Loader2,
  UserCheck,
  Search,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { fetchReviews, deleteReview } from "@/lib/api";
import { ReviewListItem } from "@/types";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function HistoryPage() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const [reviews, setReviews] = useState<ReviewListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReviews();
      setReviews(data);
    } catch {
      setError("Unable to load review history. Check if the database service is reachable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this review from your audit history?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Failed to delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReviews = useMemo(() => {
    if (!searchQuery.trim()) return reviews;
    const q = searchQuery.toLowerCase();
    return reviews.filter(
      (r) =>
        r.filename.toLowerCase().includes(q) ||
        r.language.toLowerCase().includes(q)
    );
  }, [reviews, searchQuery]);

  const getScoreBadge = (score: number) => {
    if (score >= 85)
      return "text-emerald-300 bg-emerald-500/15 border-emerald-500/30";
    if (score >= 70)
      return "text-warm-300 bg-warm-500/15 border-warm-500/30";
    if (score >= 50)
      return "text-amber-300 bg-amber-500/15 border-amber-500/30";
    return "text-rose-300 bg-rose-500/15 border-rose-500/30";
  };

  return (
    <div className="relative mx-auto flex w-full max-w-5xl flex-col px-4 pt-6 pb-20 sm:px-6">
      {/* ── Header ── */}
      <div className="liquid-glass mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warm-500/15 border border-warm-500/25 text-warm-400 shadow-xs">
              <History className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
              Audit History Log
            </h1>
          </div>
          <p className="mt-1.5 text-xs text-zinc-400">
            {user ? (
              <span className="flex items-center gap-1.5 text-warm-300 font-medium">
                <UserCheck className="h-3.5 w-3.5" />
                Signed in as {user.name} ({user.email}) · Cloud-persisted audits
              </span>
            ) : (
              <span>Audits are saved locally in SQLite. Sign in anytime to sync across devices.</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!user && (
            <button
              onClick={() => openAuthModal("login")}
              className="btn-glass flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-300"
            >
              Sign In to Sync
            </button>
          )}
          <button
            onClick={loadHistory}
            disabled={loading}
            className="btn-glass flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-300"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ── Search & Filter Bar (if reviews exist) ── */}
      {reviews.length > 0 && (
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search saved reviews by filename or language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-glass w-full rounded-2xl py-2 pl-9 pr-4 text-xs text-zinc-200 placeholder-zinc-500"
            />
          </div>
          <div className="liquid-glass-subtle flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs text-zinc-400 font-mono">
            <span>{filteredReviews.length}</span>
            <span className="text-zinc-600">/</span>
            <span>{reviews.length} audits</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="liquid-glass mb-6 rounded-2xl border-rose-500/30 bg-rose-950/20 p-4 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="liquid-glass flex flex-col items-center justify-center rounded-3xl py-24 text-zinc-500">
          <Loader2 className="h-7 w-7 animate-spin text-warm-400 mb-3" />
          <p className="text-xs font-medium text-zinc-400">Loading audit history...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && reviews.length === 0 && (
        <div className="liquid-glass flex flex-col items-center justify-center rounded-3xl py-20 px-4 text-center">
          <div className="liquid-glass-subtle rounded-2xl p-4 text-zinc-500 mb-4 shadow-sm">
            <Inbox className="h-10 w-10 text-warm-400/80" />
          </div>
          <h3 className="text-base font-semibold text-zinc-200">No review audits yet</h3>
          <p className="mt-1.5 text-xs text-zinc-400 max-w-sm leading-relaxed">
            Run your first source code review in the workspace to automatically save findings, score reports, and refactors.
          </p>
          <Link
            href="/review"
            className="btn-warm mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold"
          >
            <span>Launch Code Reviewer</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* No search matches state */}
      {!loading && !error && reviews.length > 0 && filteredReviews.length === 0 && (
        <div className="liquid-glass-subtle flex flex-col items-center justify-center rounded-2xl py-12 text-center text-zinc-500">
          <p className="text-xs font-medium text-zinc-300">No reviews matched &quot;{searchQuery}&quot;</p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-2 text-xs text-warm-400 underline hover:text-warm-300"
          >
            Clear search filter
          </button>
        </div>
      )}

      {/* Reviews list */}
      {!loading && !error && filteredReviews.length > 0 && (
        <div className="space-y-3">
          {filteredReviews.map((r) => (
            <div
              key={r.id}
              onClick={() => router.push(`/review?id=${r.id}`)}
              className="liquid-glass-interactive group cursor-pointer rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Left Column: Filename, Language, Timestamp */}
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="liquid-glass-subtle rounded-xl p-2.5 text-warm-400 group-hover:scale-105 transition-transform shrink-0">
                  <FileCode className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-warm-300 transition-colors truncate max-w-[260px] sm:max-w-md">
                      {r.filename}
                    </h3>
                    <span className="rounded-md bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 text-[10px] font-mono text-zinc-400 uppercase">
                      {r.language}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(r.created_at)}
                    </span>
                    <span>•</span>
                    <span className="text-zinc-400 font-sans">
                      {r.issue_count} issue{r.issue_count === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Score & Actions */}
              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <div
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs font-bold ${getScoreBadge(
                    r.score
                  )}`}
                >
                  <span>Score: {r.score}</span>
                  <span className="text-[10px] opacity-70">/100</span>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    href={`/review?id=${r.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="liquid-glass-subtle rounded-xl p-2 text-zinc-400 hover:text-warm-300 transition"
                    title="Open in reviewer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  <button
                    onClick={(e) => handleDelete(e, r.id)}
                    disabled={deletingId === r.id}
                    className="liquid-glass-subtle rounded-xl p-2 text-zinc-500 hover:bg-rose-950/40 hover:text-rose-400 transition"
                    title="Delete review from history"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
