"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  Cloud,
  ExternalLink,
  Sparkles,
  Zap,
} from "lucide-react";
import { fetchHealth } from "@/lib/api";
import { HealthResponse, SUPPORTED_LANGUAGES } from "@/types";

// Supported Groq models available in your account
const GROQ_MODELS = [
  {
    id: "qwen/qwen3.8-27b",
    label: "Qwen 3.8 27B",
    badge: "Recommended",
    description: "Fast code synthesis and robust structured JSON audits.",
  },
  {
    id: "openai/gpt-oss-120b",
    label: "GPT OSS 120B",
    badge: "Maximum Depth",
    description: "Large parameter capacity for complex multi-file architectural analysis.",
  },
  {
    id: "openai/gpt-oss-20b",
    label: "GPT OSS 20B",
    badge: "Ultra Fast",
    description: "Low-latency inference for rapid syntax and bug passes.",
  },
  {
    id: "allam-2-7b",
    label: "Allam 2 7B",
    badge: "Lightweight",
    description: "Compact parameter footprint for high throughput.",
  },
];

export default function SettingsPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [customModel, setCustomModel] = useState("qwen/qwen3.8-27b");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const data = await fetchHealth();
      setHealth(data);
      if (data.configured_model) {
        setCustomModel(data.configured_model);
      }
    } catch {
      setHealth({
        status: "error",
        groq_connected: false,
        configured_model: customModel,
        model_available: false,
        error_message: "API health check failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveModel = (modelName: string) => {
    setCustomModel(modelName);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="relative mx-auto flex w-full max-w-5xl flex-col px-4 pt-6 pb-20 sm:px-6 space-y-6">
      {/* ── Header ── */}
      <div className="liquid-glass flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warm-500/15 border border-warm-500/25 text-warm-400 shadow-xs">
              <Settings className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
              AI Engine & System Settings
            </h1>
          </div>
          <p className="mt-1.5 text-xs text-zinc-400">
            Configure Groq Cloud models, inspect connection health, and view supported language parsers.
          </p>
        </div>

        <button
          onClick={checkStatus}
          disabled={loading}
          className="btn-glass flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-300"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Re-check Diagnostics</span>
        </button>
      </div>

      {/* ── Groq API Status Card ── */}
      <div className="liquid-glass rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cloud className="h-5 w-5 text-warm-400" />
            <h2 className="text-sm font-bold text-zinc-100">Groq Cloud AI Engine</h2>
          </div>

          <div>
            {loading ? (
              <span className="text-xs text-zinc-500 font-mono">Pinging endpoint...</span>
            ) : health?.groq_connected ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Connected & Ready
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 px-3 py-1 text-xs font-semibold text-rose-300">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                API Offline
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="liquid-glass-subtle rounded-2xl p-4">
            <span className="text-zinc-500 text-[11px] block font-sans">Provider</span>
            <span className="text-zinc-200 mt-1 block font-semibold text-sm">Groq Cloud</span>
          </div>

          <div className="liquid-glass-subtle rounded-2xl p-4">
            <span className="text-zinc-500 text-[11px] block font-sans">Active Model</span>
            <span className="text-warm-300 mt-1 block font-semibold text-sm truncate">
              {health?.configured_model || customModel}
            </span>
          </div>

          <div className="liquid-glass-subtle rounded-2xl p-4">
            <span className="text-zinc-500 text-[11px] block font-sans">Inference Status</span>
            <span
              className={`mt-1 block font-semibold text-sm ${
                health?.model_available ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {health?.model_available ? "Sub-second Active" : "Unverified"}
            </span>
          </div>
        </div>

        {/* Notice if Groq is not configured */}
        {!loading && !health?.groq_connected && (
          <div className="liquid-glass-subtle rounded-2xl border-rose-500/30 bg-rose-950/20 p-4 text-xs text-rose-300">
            <div className="flex items-center gap-2 font-semibold mb-1">
              <AlertCircle className="h-4 w-4 text-rose-400" />
              <span>Groq API Key Error</span>
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              Ensure your key is placed in <code className="font-mono text-warm-300">frontend/.env.local</code> as <code className="font-mono text-warm-300">GROQ_API_KEY=gsk_...</code>.
            </p>
          </div>
        )}
      </div>

      {/* ── Model Selection Matrix ── */}
      <div className="liquid-glass rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5">
          <Cpu className="h-5 w-5 text-warm-400" />
          <div>
            <h2 className="text-sm font-bold text-zinc-100">Groq Model Selector</h2>
            <p className="text-xs text-zinc-400">
              Select an active model from your Groq account or override with a custom tag.
            </p>
          </div>
        </div>

        {/* Preset Model Radio Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GROQ_MODELS.map((m) => {
            const isSelected = customModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleSaveModel(m.id)}
                className={`liquid-glass-interactive rounded-2xl p-4 text-left transition-all ${
                  isSelected
                    ? "bg-white/[0.09] ring-2 ring-warm-500 shadow-warm-glow"
                    : "opacity-80"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-semibold text-zinc-100">
                    {m.label}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                      isSelected
                        ? "bg-warm-500/20 text-warm-300 border-warm-500/40"
                        : "bg-white/[0.05] text-zinc-400 border-white/[0.06]"
                    }`}
                  >
                    {m.badge}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  {m.description}
                </p>
                <div className="mt-2 text-[10px] font-mono text-zinc-500 truncate">
                  Tag: {m.id}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Input */}
        <div className="pt-2 border-t border-white/[0.06]">
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            Custom Model Name Tag
          </label>
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              placeholder="e.g. qwen/qwen3.8-27b"
              className="input-glass flex-1 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200"
            />
            <button
              onClick={() => handleSaveModel(customModel)}
              className="btn-warm rounded-xl px-4 py-2 text-xs font-semibold shadow-sm"
            >
              Set Model
            </button>
          </div>
          {savedSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Model updated for current session! (Persist via GROQ_MODEL in .env.local)</span>
            </span>
          )}
        </div>
      </div>

      {/* ── Supported Languages ── */}
      <div className="liquid-glass rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <Layers className="h-5 w-5 text-warm-400" />
          <div>
            <h2 className="text-sm font-bold text-zinc-100">Language Heuristics & Parsers</h2>
            <p className="text-xs text-zinc-400">
              Native syntax highlighting, file extension detection, and AST-aware prompt rules.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <div
              key={lang.id}
              className="liquid-glass-subtle rounded-xl p-3 flex items-center justify-between"
            >
              <span className="text-xs font-medium text-zinc-200">{lang.name}</span>
              <span className="font-mono text-[11px] text-warm-400/90">{lang.extension}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
