"use client";

import React from "react";
import {
  ShieldAlert,
  Bug,
  Zap,
  Sparkles,
  Wrench,
  CheckCircle2,
  Lightbulb,
  AlertOctagon,
  Flame,
  AlertTriangle,
  Info,
  ShieldCheck,
} from "lucide-react";
import { ReviewResult, SeverityType, CategoryType } from "@/types";

interface ReviewDashboardProps {
  review: ReviewResult;
  selectedSeverity: SeverityType | "all";
  onSelectSeverity: (sev: SeverityType | "all") => void;
  selectedCategory: CategoryType | "all";
  onSelectCategory: (cat: CategoryType | "all") => void;
}

export default function ReviewDashboard({
  review,
  selectedSeverity,
  onSelectSeverity,
  selectedCategory,
  onSelectCategory,
}: ReviewDashboardProps) {
  const issues = review.issues || [];

  const counts = {
    critical: issues.filter((i) => i.severity === "critical").length,
    high: issues.filter((i) => i.severity === "high").length,
    medium: issues.filter((i) => i.severity === "medium").length,
    low: issues.filter((i) => i.severity === "low").length,
    info: issues.filter((i) => i.severity === "info").length,
    bug: issues.filter((i) => i.category === "bug").length,
    security: issues.filter((i) => i.category === "security").length,
    performance: issues.filter((i) => i.category === "performance").length,
    quality: issues.filter((i) => i.category === "quality").length,
    maintainability: issues.filter((i) => i.category === "maintainability").length,
  };

  const getScoreTheme = (score: number) => {
    if (score >= 85)
      return {
        text: "text-emerald-400",
        badge: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
        glow: "shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]",
        label: "Excellent",
      };
    if (score >= 70)
      return {
        text: "text-warm-400",
        badge: "bg-warm-500/15 border-warm-500/30 text-warm-300",
        glow: "shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)]",
        label: "Good Quality",
      };
    if (score >= 50)
      return {
        text: "text-amber-400",
        badge: "bg-amber-500/15 border-amber-500/30 text-amber-300",
        glow: "shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]",
        label: "Needs Attention",
      };
    return {
      text: "text-rose-400",
      badge: "bg-rose-500/15 border-rose-500/30 text-rose-300",
      glow: "shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]",
      label: "Critical Risks",
    };
  };

  const scoreTheme = getScoreTheme(review.score);

  return (
    <div className="space-y-4">
      {/* Top Banner: Score & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Score Card */}
        <div
          className={`liquid-glass md:col-span-4 rounded-2xl p-5 flex flex-col justify-between items-center text-center ${scoreTheme.glow}`}
        >
          <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
            Overall Health Score
          </div>

          <div className="my-3 flex items-baseline gap-1">
            <span className={`text-6xl font-black tracking-tight font-mono ${scoreTheme.text}`}>
              {review.score}
            </span>
            <span className="text-base text-zinc-500">/100</span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${scoreTheme.badge}`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{scoreTheme.label}</span>
          </div>
        </div>

        {/* Summary Card */}
        <div className="liquid-glass md:col-span-8 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                Executive Analysis Summary
              </h4>
              <span className="text-xs text-zinc-500 font-mono">
                {issues.length} issue{issues.length === 1 ? "" : "s"} detected
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-200 leading-relaxed font-sans">
              {review.summary}
            </p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-white/[0.06]">
            <span className="text-xs text-zinc-400 font-medium">Filter:</span>
            <button
              onClick={() => onSelectSeverity("all")}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                selectedSeverity === "all"
                  ? "bg-white/[0.15] text-zinc-100 border border-white/[0.12]"
                  : "liquid-glass-subtle text-zinc-400 hover:text-zinc-200"
              }`}
            >
              All ({issues.length})
            </button>
            {counts.critical > 0 && (
              <button
                onClick={() => onSelectSeverity("critical")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  selectedSeverity === "critical"
                    ? "bg-rose-600 text-white"
                    : "bg-rose-500/10 text-rose-300 border border-rose-500/25 hover:bg-rose-500/20"
                }`}
              >
                <AlertOctagon className="h-3 w-3" />
                Critical ({counts.critical})
              </button>
            )}
            {counts.high > 0 && (
              <button
                onClick={() => onSelectSeverity("high")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  selectedSeverity === "high"
                    ? "bg-warm-600 text-white"
                    : "bg-warm-500/10 text-warm-300 border border-warm-500/25 hover:bg-warm-500/20"
                }`}
              >
                <Flame className="h-3 w-3" />
                High ({counts.high})
              </button>
            )}
            {counts.medium > 0 && (
              <button
                onClick={() => onSelectSeverity("medium")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  selectedSeverity === "medium"
                    ? "bg-amber-600 text-white"
                    : "bg-amber-500/10 text-amber-300 border border-amber-500/25 hover:bg-amber-500/20"
                }`}
              >
                <AlertTriangle className="h-3 w-3" />
                Med ({counts.medium})
              </button>
            )}
            {counts.low > 0 && (
              <button
                onClick={() => onSelectSeverity("low")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  selectedSeverity === "low"
                    ? "bg-sky-600 text-white"
                    : "bg-sky-500/10 text-sky-300 border border-sky-500/25 hover:bg-sky-500/20"
                }`}
              >
                <Info className="h-3 w-3" />
                Low ({counts.low})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => onSelectCategory(selectedCategory === "bug" ? "all" : "bug")}
          className={`liquid-glass-interactive rounded-xl p-3 text-left ${
            selectedCategory === "bug" ? "ring-1 ring-warm-400 bg-white/[0.08]" : ""
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Bugs</span>
            <Bug className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-100">{counts.bug}</div>
        </button>

        <button
          onClick={() => onSelectCategory(selectedCategory === "security" ? "all" : "security")}
          className={`liquid-glass-interactive rounded-xl p-3 text-left ${
            selectedCategory === "security" ? "ring-1 ring-warm-400 bg-white/[0.08]" : ""
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Security</span>
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-100">{counts.security}</div>
        </button>

        <button
          onClick={() => onSelectCategory(selectedCategory === "performance" ? "all" : "performance")}
          className={`liquid-glass-interactive rounded-xl p-3 text-left ${
            selectedCategory === "performance" ? "ring-1 ring-warm-400 bg-white/[0.08]" : ""
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Performance</span>
            <Zap className="h-3.5 w-3.5 text-warm-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-100">{counts.performance}</div>
        </button>

        <button
          onClick={() => onSelectCategory(selectedCategory === "quality" ? "all" : "quality")}
          className={`liquid-glass-interactive rounded-xl p-3 text-left ${
            selectedCategory === "quality" ? "ring-1 ring-warm-400 bg-white/[0.08]" : ""
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Code Quality</span>
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-100">{counts.quality}</div>
        </button>

        <button
          onClick={() =>
            onSelectCategory(selectedCategory === "maintainability" ? "all" : "maintainability")
          }
          className={`liquid-glass-interactive rounded-xl p-3 text-left col-span-2 sm:col-span-1 ${
            selectedCategory === "maintainability" ? "ring-1 ring-warm-400 bg-white/[0.08]" : ""
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Maintainability</span>
            <Wrench className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-100">
            {counts.maintainability}
          </div>
        </button>
      </div>

      {/* Strengths & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        {review.strengths && review.strengths.length > 0 && (
          <div className="liquid-glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2.5 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              <span>Identified Strengths</span>
            </div>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {review.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {review.overall_recommendations && review.overall_recommendations.length > 0 && (
          <div className="liquid-glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2.5 text-warm-400 text-xs font-semibold uppercase tracking-wider">
              <Lightbulb className="h-4 w-4" />
              <span>Architectural Recommendations</span>
            </div>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {review.overall_recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-warm-400 font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
