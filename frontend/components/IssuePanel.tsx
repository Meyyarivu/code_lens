"use client";

import React, { useState } from "react";
import {
  AlertOctagon,
  Flame,
  AlertTriangle,
  Info,
  Check,
  Copy,
  CornerDownRight,
  Search,
  Filter,
  Code,
  ShieldAlert,
} from "lucide-react";
import { IssueItem, SeverityType, CategoryType } from "@/types";

interface IssuePanelProps {
  issues: IssueItem[];
  selectedIssueId: string | null;
  onSelectIssue: (issue: IssueItem) => void;
  selectedSeverity: SeverityType | "all";
  selectedCategory: CategoryType | "all";
}

export default function IssuePanel({
  issues,
  selectedIssueId,
  onSelectIssue,
  selectedSeverity,
  selectedCategory,
}: IssuePanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredIssues = issues.filter((issue) => {
    if (selectedSeverity !== "all" && issue.severity !== selectedSeverity) {
      return false;
    }
    if (selectedCategory !== "all" && issue.category !== selectedCategory) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        issue.title.toLowerCase().includes(q) ||
        issue.description.toLowerCase().includes(q) ||
        issue.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSeverityStyle = (severity: SeverityType) => {
    switch (severity) {
      case "critical":
        return {
          label: "Critical",
          icon: AlertOctagon,
          badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
          borderAccent: "border-l-rose-500",
        };
      case "high":
        return {
          label: "High",
          icon: Flame,
          badgeClass: "bg-warm-500/15 text-warm-300 border-warm-500/30",
          borderAccent: "border-l-warm-500",
        };
      case "medium":
        return {
          label: "Medium",
          icon: AlertTriangle,
          badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
          borderAccent: "border-l-amber-500",
        };
      case "low":
        return {
          label: "Low",
          icon: Info,
          badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
          borderAccent: "border-l-sky-500",
        };
      case "info":
      default:
        return {
          label: "Info",
          icon: Info,
          badgeClass: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
          borderAccent: "border-l-zinc-500",
        };
    }
  };

  const copyFix = (e: React.MouseEvent, issue: IssueItem) => {
    e.stopPropagation();
    if (issue.fixed_code || issue.suggestion) {
      navigator.clipboard.writeText(issue.fixed_code || issue.suggestion);
      setCopiedId(issue.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="liquid-glass flex flex-col h-full rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-white/[0.02] p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Audit Findings
            </h3>
            <span className="rounded-full bg-white/[0.08] border border-white/[0.06] px-2 py-0.5 text-[11px] font-mono text-zinc-400">
              {filteredIssues.length} / {issues.length}
            </span>
          </div>
          {(selectedSeverity !== "all" || selectedCategory !== "all") && (
            <span className="rounded-md bg-warm-500/20 text-warm-300 border border-warm-500/30 px-2 py-0.5 text-[10px] font-medium font-mono">
              Filtered
            </span>
          )}
        </div>

        {/* Search */}
        <div className="mt-2.5 relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Filter issues by title, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-glass w-full rounded-xl py-1.5 pl-8 pr-3 text-xs text-zinc-200 placeholder-zinc-500"
          />
        </div>
      </div>

      {/* Issues List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-500">
            <Check className="h-8 w-8 text-emerald-400 mb-2" />
            <p className="text-xs font-medium text-zinc-300">No issues found</p>
            <p className="text-[11px] text-zinc-500 mt-1 max-w-xs">
              All clear, or no issues match your filter criteria.
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isSelected = selectedIssueId === issue.id;
            const style = getSeverityStyle(issue.severity);
            const SeverityIcon = style.icon;

            return (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className={`liquid-glass-interactive group cursor-pointer rounded-xl p-3 border-l-4 ${style.borderAccent} ${
                  isSelected
                    ? "bg-white/[0.08] ring-1 ring-warm-400 shadow-warm-glow"
                    : ""
                }`}
              >
                {/* Issue Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold border ${style.badgeClass}`}
                    >
                      <SeverityIcon className="h-3 w-3" />
                      {style.label}
                    </span>
                    <span className="rounded bg-white/[0.05] border border-white/[0.06] px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 uppercase">
                      {issue.category}
                    </span>
                  </div>

                  <span className="font-mono text-[11px] text-zinc-500 shrink-0">
                    L{issue.line_start}
                    {issue.line_end > issue.line_start && `–${issue.line_end}`}
                  </span>
                </div>

                {/* Title */}
                <h4 className="mt-2 text-xs font-semibold text-zinc-200 group-hover:text-warm-300 transition-colors">
                  {issue.title}
                </h4>

                {/* Description */}
                <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
                  {issue.description}
                </p>

                {/* Suggestion / Fix snippet */}
                {(issue.suggestion || issue.fixed_code) && (
                  <div className="mt-2.5 rounded-lg bg-black/40 border border-white/[0.05] p-2.5">
                    <div className="flex items-center justify-between text-[10px] text-warm-300/90 font-medium mb-1">
                      <span className="flex items-center gap-1">
                        <CornerDownRight className="h-3 w-3 text-warm-400" /> Suggested Fix
                      </span>
                      <button
                        onClick={(e) => copyFix(e, issue)}
                        className="flex items-center gap-1 hover:text-zinc-100 text-zinc-400"
                        title="Copy suggested code fix"
                      >
                        {copiedId === issue.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {issue.suggestion && (
                      <p className="text-[11px] text-zinc-300 leading-relaxed">
                        {issue.suggestion}
                      </p>
                    )}

                    {issue.fixed_code && (
                      <pre className="mt-1.5 overflow-x-auto rounded bg-charcoal-950 p-2 font-mono text-[11px] text-warm-200 border border-white/[0.05]">
                        <code>{issue.fixed_code}</code>
                      </pre>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
