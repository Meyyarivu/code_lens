"use client";

import React from "react";
import { AlertCircle, Cloud, RefreshCw, ExternalLink } from "lucide-react";
import Link from "next/link";

interface GroqAlertProps {
  message?: string;
  onRetry?: () => void;
  configuredModel?: string;
}

export default function GroqAlert({
  message = "Groq Cloud API is unavailable. Check your GROQ_API_KEY in .env.local.",
  onRetry,
  configuredModel = "qwen/qwen3.8-27b",
}: GroqAlertProps) {
  return (
    <div className="liquid-glass rounded-2xl border-rose-500/30 bg-rose-950/20 p-5 shadow-xl">
      <div className="flex items-start gap-3.5">
        <div className="rounded-xl bg-rose-500/15 p-2 text-rose-400 border border-rose-500/30 shrink-0">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-rose-300">
            Groq API Connection Notice
          </h3>
          <p className="mt-1 text-xs text-rose-200/90 leading-relaxed">
            {message}
          </p>

          <div className="liquid-glass-subtle mt-3.5 rounded-xl p-3.5 space-y-2 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 font-medium text-warm-300">
              <Cloud className="h-3.5 w-3.5 text-warm-400" />
              <span>How to configure your API connection:</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-zinc-400 leading-relaxed">
              <p>
                1. Obtain a free API key at{" "}
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm-400 underline underline-offset-2 hover:text-warm-300"
                >
                  console.groq.com/keys
                </a>
              </p>
              <p>
                2. Add it to your{" "}
                <code className="font-mono bg-charcoal-900 border border-white/[0.08] px-1 py-0.5 rounded text-warm-300">
                  frontend/.env.local
                </code>{" "}
                file:
              </p>
              <div className="bg-charcoal-950/80 p-2 rounded-lg font-mono text-[11px] text-zinc-300 border border-white/[0.05] select-all">
                <span className="text-zinc-500">GROQ_API_KEY=</span>
                <span className="text-warm-300">gsk_your_api_key_here</span>
                <br />
                <span className="text-zinc-500">GROQ_MODEL=</span>
                <span className="text-warm-300">{configuredModel}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="btn-warm flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry Connection</span>
              </button>
            )}
            <Link
              href="/settings"
              className="btn-glass flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-300"
            >
              <span>Manage Models in Settings</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
