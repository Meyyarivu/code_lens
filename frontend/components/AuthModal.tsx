"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Loader2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, setAuthModalMode, login, register } =
    useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name.trim()) {
          throw new Error("Please enter your name.");
        }
        await register(name, email, password);
      }
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      {/* Modal Dialog */}
      <div
        className="liquid-glass relative w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/[0.12]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="liquid-glass-subtle absolute top-5 right-5 p-1.5 rounded-xl text-zinc-400 hover:text-zinc-200 transition"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-warm-500/15 border border-warm-500/30 text-warm-400 shadow-warm-glow">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100">
            {isLogin ? "Welcome back" : "Create CodeLens account"}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {isLogin
              ? "Sign in to access your synchronized code audit history."
              : "Sign up to persist reviews and sync across sessions."}
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="input-glass w-full rounded-xl pl-10 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="input-glass w-full rounded-xl pl-10 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-glass w-full rounded-xl pl-10 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-warm w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-semibold shadow-md mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>{isLogin ? "Sign In" : "Create Account"}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch mode */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] text-center text-xs text-zinc-400">
          {isLogin ? (
            <p>
              Don&apos;t have an account yet?{" "}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setAuthModalMode("register");
                }}
                className="font-semibold text-warm-400 hover:text-warm-300 transition"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setAuthModalMode("login");
                }}
                className="font-semibold text-warm-400 hover:text-warm-300 transition"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
