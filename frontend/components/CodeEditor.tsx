"use client";

import React, { useRef, useEffect, useState } from "react";
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import { Copy, Trash2, Upload, FileCode, Check, Sparkles } from "lucide-react";
import { SUPPORTED_LANGUAGES, IssueItem } from "@/types";
import { useTheme } from "@/context/ThemeContext";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  onFileUpload: (file: File) => void;
  filename?: string;
  issues?: IssueItem[];
  selectedIssueId?: string | null;
  editorRef?: React.MutableRefObject<any>;
}

export default function CodeEditor({
  code,
  onChange,
  language,
  onLanguageChange,
  onFileUpload,
  filename,
  issues = [],
  selectedIssueId,
  editorRef: externalEditorRef,
}: CodeEditorProps) {
  const { theme } = useTheme();
  const internalEditorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const activeEditor = externalEditorRef || internalEditorRef;

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    activeEditor.current = editor;
    monacoRef.current = monaco;
    applyDecorations();
  };

  const applyDecorations = () => {
    if (!activeEditor.current || !monacoRef.current) return;
    const editor = activeEditor.current;
    const monaco = monacoRef.current;

    const newDecorations = issues.map((issue) => {
      const isSelected = selectedIssueId === issue.id;
      const start = Math.max(1, issue.line_start);
      const end = Math.max(start, issue.line_end);

      const className = `monaco-line-${issue.severity} ${
        isSelected ? "ring-1 ring-warm-400" : ""
      }`;
      const glyphClassName = `monaco-glyph-${issue.severity}`;

      return {
        range: new monaco.Range(start, 1, end, 1),
        options: {
          isWholeLine: true,
          className,
          glyphMarginClassName: glyphClassName,
          hoverMessage: {
            value: `**[${issue.severity.toUpperCase()}] ${issue.title}**\n\n${issue.description}\n\n*Suggested fix:* ${issue.suggestion}`,
          },
        },
      };
    });

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
  };

  useEffect(() => {
    applyDecorations();
  }, [issues, selectedIssueId, theme]);

  useEffect(() => {
    if (!selectedIssueId || !activeEditor.current) return;
    const issue = issues.find((i) => i.id === selectedIssueId);
    if (issue) {
      activeEditor.current.revealLineInCenter(issue.line_start);
      activeEditor.current.setPosition({ lineNumber: issue.line_start, column: 1 });
      activeEditor.current.focus();
    }
  }, [selectedIssueId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the editor?")) {
      onChange("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      e.target.value = "";
    }
  };

  return (
    <div className="liquid-glass flex flex-col h-full rounded-2xl overflow-hidden shadow-2xl">
      {/* Editor Glass Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-xs">
        {/* Filename & Language Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
            <FileCode className="h-4 w-4 text-warm-400" />
            <span className="font-mono text-xs max-w-[160px] truncate" title={filename}>
              {filename || "untitled.txt"}
            </span>
          </div>

          <div className="h-3.5 w-px bg-white/[0.1] mx-1" />

          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="input-glass rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-200 focus:outline-none"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-charcoal-900 text-zinc-200">
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-glass flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-300"
            title="Upload source file"
          >
            <Upload className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="btn-glass flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-300"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400 hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="btn-glass flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-rose-400"
            title="Clear editor"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Monaco Canvas */}
      <div className="flex-1 w-full min-h-[350px]">
        <Editor
          height="100%"
          language={language === "c" || language === "cpp" ? "cpp" : language}
          value={code}
          onChange={(val) => onChange(val || "")}
          onMount={handleEditorDidMount}
          theme={theme === "dark" ? "vs-dark" : "vs"}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'SF Mono', Fira Code, Consolas, monospace",
            lineNumbers: "on",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            glyphMargin: true,
            folding: true,
            renderLineHighlight: "all",
            smoothScrolling: true,
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 14, bottom: 14 },
          }}
        />
      </div>
    </div>
  );
}
