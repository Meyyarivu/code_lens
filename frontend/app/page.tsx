import Link from "next/link";
import {
  ArrowUpRight,
  Bug,
  Code2,
  Cpu,
  History,
  Lock,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  SplitSquareVertical,
  Terminal,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const capabilities = [
    {
      title: "Bug & Logic Detection",
      icon: Bug,
      badge: "Logic Errors",
      description:
        "Detect off-by-one errors, null dereferences, memory leaks, unhandled exceptions, and edge-case control flow hazards before pull request merge.",
    },
    {
      title: "Security & OWASP Audit",
      icon: ShieldAlert,
      badge: "Vulnerability Scan",
      description:
        "Deep static audit against SQL injections, command injection, path traversal, hardcoded secrets, and OWASP Top 10 security risks.",
    },
    {
      title: "Performance & Memory",
      icon: Zap,
      badge: "Complexity Analysis",
      description:
        "Uncover computational bottlenecks, O(n²) algorithmic hotspots, redundant memory copies, unindexed queries, and blocking asynchronous operations.",
    },
    {
      title: "Actionable Refactored Diffs",
      icon: SplitSquareVertical,
      badge: "Side-by-Side Diff",
      description:
        "Receive complete idiomatic replacements with a side-by-side Monaco diff comparison. Review, accept, or reject automated refactors in one click.",
    },
  ];

  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 pt-6 pb-20 sm:px-6 sm:pt-12">
      {/* ── Hero Section ── */}
      <section className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Release Pill Badge */}
        <div className="liquid-glass-subtle mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium text-zinc-300">
          <span className="h-1.5 w-1.5 rounded-full bg-warm-500 shadow-[0_0_8px_rgba(249,115,22,0.9)]" />
          <span>Groq Cloud Powered</span>
          <span className="text-zinc-600">·</span>
          <span className="text-warm-300">Llama & Qwen Models</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100 sm:text-6xl sm:leading-[1.12]">
          Intelligent code reviews, <br />
          without the <span className="text-gradient-warm">blind spots</span>.
        </h1>

        {/* Subtitle */}
        <p className="mt-5 max-w-2xl text-base text-zinc-400 sm:text-lg sm:leading-relaxed">
          Audit code for critical bugs, security vulnerabilities, and performance
          bottlenecks in milliseconds. Powered by Groq Cloud and delivered through
          an Apple-grade liquid glass workspace.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/review"
            className="btn-warm group flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold tracking-tight"
          >
            <Code2 className="h-4 w-4" />
            <span>Launch Code Reviewer</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <Link
            href="/settings"
            className="btn-glass flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-zinc-300"
          >
            <Settings className="h-4 w-4 text-zinc-400" />
            <span>AI Diagnostics</span>
          </Link>
        </div>

        {/* Trust bar */}
        <div className="mt-6 flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-warm-400" /> Server-side API key isolation
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-emerald-400" /> Sub-second Groq inference
          </span>
          <span>•</span>
          <span>Zero telemetry</span>
        </div>
      </section>

      {/* ── Interactive Workspace Preview Card ── */}
      <section className="mt-14 w-full">
        <div className="liquid-glass relative overflow-hidden rounded-3xl p-3 sm:p-5 shadow-2xl">
          {/* Mock Window Top Bar */}
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 px-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 font-mono text-xs text-zinc-400">
                auth_service.py — CodeLens Security Audit
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="liquid-glass-subtle inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] text-warm-300">
                <Sparkles className="h-3 w-3 text-warm-400" /> Score: 55/100
              </span>
              <span className="liquid-glass-subtle hidden sm:inline-flex rounded-lg px-2 py-1 text-[11px] text-zinc-400 font-mono">
                3 Issues Found
              </span>
            </div>
          </div>

          {/* Mock Workspace Split View */}
          <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Left Mock Code Preview */}
            <div className="liquid-glass-subtle rounded-2xl p-4 font-mono text-xs text-zinc-300 lg:col-span-7 overflow-x-auto">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.05] text-[11px] text-zinc-500">
                <span>Source Preview</span>
                <span className="text-warm-400">Python 3.12</span>
              </div>
              <div className="pt-3 space-y-1.5 leading-relaxed">
                <p className="text-zinc-600">1  import sqlite3, hashlib</p>
                <p className="text-zinc-600">2</p>
                <p className="text-zinc-400">3  def query_user(user_id):</p>
                <p className="bg-rose-500/15 border-l-2 border-rose-500 text-rose-200 pl-2 py-0.5 rounded-r">
                  4      # [CRITICAL] SQL Injection Hazard
                </p>
                <p className="bg-rose-500/15 text-rose-200 pl-2 py-0.5 rounded-r">
                  5      query = f&quot;SELECT * FROM accounts WHERE id = &apos;&#123;user_id&#125;&apos;&quot;
                </p>
                <p className="text-zinc-400">6      conn = sqlite3.connect(&quot;db.sqlite3&quot;)</p>
                <p className="text-zinc-400">7      cursor = conn.cursor()</p>
                <p className="text-zinc-400">8      cursor.execute(query)</p>
                <p className="bg-amber-500/15 border-l-2 border-amber-500 text-amber-200 pl-2 py-0.5 rounded-r">
                  9      # [PERFORMANCE] Unclosed resource leak
                </p>
                <p className="text-zinc-400">10     return cursor.fetchall()</p>
              </div>
            </div>

            {/* Right Mock Finding Panel */}
            <div className="liquid-glass-subtle rounded-2xl p-4 lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Live Diagnostics
                  </span>
                  <span className="rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 text-[10px] font-semibold">
                    1 Critical
                  </span>
                </div>

                <div className="mt-3 space-y-2.5">
                  <div className="liquid-glass-interactive rounded-xl p-3 border-l-2 border-l-rose-500">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-200">
                        SQL Injection Vulnerability
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">Lines 4–5</span>
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-400 leading-normal">
                      Raw string interpolation into SQL query allows unauthorized database execution.
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-warm-300 bg-warm-950/40 p-1.5 rounded border border-warm-800/40">
                      Fix: cursor.execute(&quot;SELECT * FROM accounts WHERE id = ?&quot;, (user_id,))
                    </div>
                  </div>

                  <div className="liquid-glass-subtle rounded-xl p-3 border-l-2 border-l-amber-500 opacity-90">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-200">
                        Resource Leak (Unclosed Connection)
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">Line 9</span>
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-400 leading-normal">
                      SQLite connection is never closed. Wrap with context manager or call conn.close().
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">Ready to audit?</span>
                <Link
                  href="/review"
                  className="btn-warm rounded-lg px-3 py-1.5 text-xs font-medium inline-flex items-center gap-1.5"
                >
                  <span>Open Full Reviewer</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Cards Grid ── */}
      <section className="mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
            Everything you need to audit modern codebases
          </h2>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            From deep security analysis to performance optimizations, CodeLens acts
            as your automated principal reviewer on every commit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="liquid-glass-interactive rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warm-500/15 border border-warm-500/25 text-warm-400 shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-white/[0.05] border border-white/[0.08] px-2.5 py-1 text-[11px] font-mono text-zinc-400">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-zinc-100 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center gap-1.5 text-xs text-warm-400 font-medium">
                  <Link href="/review" className="hover:underline flex items-center gap-1">
                    Try in workspace <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Quick Jump Routes Bar ── */}
      <section className="mt-16 liquid-glass rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-zinc-100">
            Audit history & AI settings at your fingertips
          </h3>
          <p className="mt-1 text-xs text-zinc-400 max-w-xl">
            Code audits are saved automatically to your private SQLite database. Switch
            models, inspect latency, or review past findings anytime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/history"
            className="btn-glass flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium text-zinc-200"
          >
            <History className="h-4 w-4 text-warm-400" />
            <span>Past Reviews</span>
          </Link>
          <Link
            href="/settings"
            className="btn-glass flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium text-zinc-200"
          >
            <Settings className="h-4 w-4 text-warm-400" />
            <span>AI Diagnostics</span>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-20 border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-warm-500/20 text-warm-400 font-bold text-[10px]">
            CL
          </div>
          <span>CodeLens — Liquid Glass AI Review Platform</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/review" className="hover:text-zinc-300 transition">
            Reviewer
          </Link>
          <Link href="/history" className="hover:text-zinc-300 transition">
            Audit History
          </Link>
          <Link href="/settings" className="hover:text-zinc-300 transition">
            Settings
          </Link>
        </div>
      </footer>
    </div>
  );
}
