"use client";

import React, { useEffect, useState } from "react";
import {
  ScanSearch,
  Bug,
  ShieldAlert,
  Zap,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";

interface Step {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const STEPS: Step[] = [
  {
    id: "scanning",
    label: "Scanning code structure",
    description: "Parsing AST and language syntax patterns",
    icon: ScanSearch,
  },
  {
    id: "bugs",
    label: "Checking bugs & logic flaws",
    description: "Inspecting edge cases, null hazards, and control flow",
    icon: Bug,
  },
  {
    id: "security",
    label: "Analyzing security vulnerabilities",
    description: "Auditing against OWASP, injection hazards, and sanitization gaps",
    icon: ShieldAlert,
  },
  {
    id: "performance",
    label: "Evaluating performance & memory",
    description: "Checking computational bottlenecks, algorithmic hotspots, and leaks",
    icon: Zap,
  },
  {
    id: "fixes",
    label: "Synthesizing actionable fixes",
    description: "Generating clean refactored code and direct suggestions",
    icon: Sparkles,
  },
];

interface ReviewLoadingProps {
  modelName?: string;
}

export default function ReviewLoading({ modelName = "qwen/qwen3.8-27b" }: ReviewLoadingProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* Central Pulsing Liquid Warm Glow Radar */}
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-warm-500/20 animate-ping" />
        <div className="absolute inset-1.5 rounded-full bg-warm-500/10 animate-pulse" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl liquid-glass border border-warm-500/40 shadow-warm-glow">
          <Loader2 className="h-6 w-6 text-warm-400 animate-spin" />
        </div>
      </div>

      <h3 className="text-lg font-bold tracking-tight text-zinc-100">
        Reviewing your source code...
      </h3>
      <p className="mt-1 text-xs text-zinc-400 max-w-sm">
        Running inference through Groq Cloud using{" "}
        <span className="font-mono text-warm-300 font-semibold">{modelName}</span>.
      </p>

      {/* Progress Steps Timeline */}
      <div className="mt-8 w-full max-w-md space-y-2.5">
        {STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 rounded-xl p-2.5 transition-all duration-300 ${
                isCurrent
                  ? "liquid-glass border-warm-500/40 shadow-warm-glow translate-x-1"
                  : isDone
                  ? "liquid-glass-subtle opacity-90"
                  : "liquid-glass-subtle opacity-35"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  isDone
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : isCurrent
                    ? "bg-warm-500/20 text-warm-300 border border-warm-500/40"
                    : "bg-white/[0.05] text-zinc-500"
                }`}
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5" />
                ) : isCurrent ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-warm-400" />
                ) : (
                  <StepIcon className="h-3.5 w-3.5" />
                )}
              </div>

              <div className="text-left flex-1 min-w-0">
                <div
                  className={`text-xs font-semibold ${
                    isCurrent
                      ? "text-warm-300"
                      : isDone
                      ? "text-zinc-200"
                      : "text-zinc-500"
                  }`}
                >
                  {step.label}
                </div>
                <div className="text-[11px] text-zinc-400 truncate">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
