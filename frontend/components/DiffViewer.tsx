"use client";

import React, { useState } from "react";
import { DiffEditor } from "@monaco-editor/react";
import { Check, X, Copy, Download, SplitSquareVertical, ArrowRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface DiffViewerProps {
  originalCode: string;
  fixedCode: string;
  language: string;
  filename?: string;
  onAcceptFix: () => void;
  onRejectFix: () => void;
}

export default function DiffViewer({
  originalCode,
  fixedCode,
  language,
  filename = "solution",
  onAcceptFix,
  onRejectFix,
}: DiffViewerProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopyFixed = () => {
    navigator.clipboard.writeText(fixedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFixed = () => {
    const blob = new Blob([fixedCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename.includes(".") ? `fixed_${filename}` : `fixed_${filename}.${language}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="liquid-glass flex flex-col h-full rounded-2xl overflow-hidden shadow-2xl">
      {/* Diff Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-warm-400">
            <SplitSquareVertical className="h-4 w-4" />
            <span>AI Code Refactor Diff</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px]">
            <span className="flex items-center gap-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Original (Before)
            </span>
            <span className="text-zinc-600">→</span>
            <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Refactored (After)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyFixed}
            className="btn-glass flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-300"
            title="Copy refactored code"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-zinc-400" />
                <span>Copy Fix</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadFixed}
            className="btn-glass flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-300"
            title="Download fixed code"
          >
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={onRejectFix}
            className="btn-glass flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-rose-400"
            title="Discard refactor and return to editor"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reject</span>
          </button>

          <button
            onClick={onAcceptFix}
            className="btn-warm flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold"
            title="Replace editor code with this refactor"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Accept Fix</span>
          </button>
        </div>
      </div>

      {/* Monaco Diff Canvas */}
      <div className="flex-1 w-full min-h-[420px]">
        <DiffEditor
          height="100%"
          language={language === "c" || language === "cpp" ? "cpp" : language}
          original={originalCode}
          modified={fixedCode}
          theme={theme === "dark" ? "vs-dark" : "vs"}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'SF Mono', Fira Code, Consolas, monospace",
            renderSideBySide: true,
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            automaticLayout: true,
            padding: { top: 14, bottom: 14 },
          }}
        />
      </div>
    </div>
  );
}
