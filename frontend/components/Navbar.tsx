"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  History,
  Settings,
  ShieldCheck,
  Cpu,
  Sun,
  Moon,
  LogIn,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { fetchHealth } from "@/lib/api";
import { HealthResponse } from "@/types";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, openAuthModal } = useAuth();

  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const checkStatus = async () => {
    try {
      const data = await fetchHealth();
      setHealth(data);
    } catch {
      setHealth({
        status: "error",
        groq_connected: false,
        configured_model: "qwen/qwen3.8-27b",
        model_available: false,
        error_message: "Groq API unavailable",
      });
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 20000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { label: "Reviewer", href: "/review", icon: Code2 },
    { label: "History", href: "/history", icon: History },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <header className="sticky top-2 z-40 mx-auto w-[calc(100%-1.5rem)] max-w-7xl pt-2 pb-1 transition-all">
      <div className="liquid-glass flex h-14 items-center justify-between rounded-2xl px-3.5 sm:px-5">
        {/* Brand & Navigation */}
        <div className="flex items-center gap-2 sm:gap-6">
          <Link href="/" className="group flex items-center gap-2.5 focus:outline-none">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-warm-400 via-warm-500 to-warm-600 text-white shadow-md shadow-warm-600/25 transition-transform duration-200 group-hover:scale-105">
              <ShieldCheck className="h-4 w-4 stroke-[2.2]" />
              <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-warm-300 ring-2 ring-charcoal-900" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-[15px] font-semibold tracking-tight text-zinc-100">
                Code<span className="text-gradient-warm font-bold">Lens</span>
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1 pl-1 sm:pl-2" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white/[0.08] text-warm-300 shadow-sm border border-white/[0.08]"
                      : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-warm-400" : "text-zinc-400"}`} />
                  <span className="hidden sm:inline">{item.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-warm-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side controls: AI Engine Pill, Theme, Auth */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Groq Engine Status Pill */}
          <Link
            href="/settings"
            className="liquid-glass-subtle group flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs transition-all hover:border-warm-500/30"
            title="AI Engine Status: Click to configure"
          >
            <Cpu className="h-3.5 w-3.5 text-zinc-400 group-hover:text-warm-400 transition-colors" />
            {loadingHealth ? (
              <span className="hidden font-mono text-[11px] text-zinc-500 md:inline">
                Connecting...
              </span>
            ) : health?.groq_connected ? (
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="hidden font-mono text-[11px] font-medium text-zinc-300 md:inline max-w-[130px] truncate">
                  {health.configured_model}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="hidden text-[11px] font-medium text-rose-400 md:inline">
                  Groq Offline
                </span>
              </div>
            )}
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="liquid-glass-subtle flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-100 transition-colors"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-3.5 w-3.5 text-warm-300" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-zinc-700" />
            )}
          </button>

          {/* User Auth Button / Dropdown */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="liquid-glass-subtle flex items-center gap-2 rounded-xl py-1 pl-1.5 pr-2.5 text-xs font-medium text-zinc-200 transition-all hover:border-warm-500/30"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-warm-500 to-warm-600 font-bold text-white text-[11px] shadow-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[90px] truncate hidden sm:inline-block text-zinc-200">
                  {user.name}
                </span>
                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </button>

              {userMenuOpen && (
                <div className="liquid-glass absolute right-0 mt-2 w-48 rounded-2xl p-1.5 shadow-2xl z-50 animate-fade-in border border-white/[0.1]">
                  <div className="px-3 py-2 border-b border-white/[0.06]">
                    <p className="text-xs font-semibold text-zinc-200 truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/history"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-white/[0.06] hover:text-zinc-100 transition"
                    >
                      <History className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Review History</span>
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-950/30 transition text-left"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal("login")}
              className="btn-warm flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium shadow-sm"
              title="Sign in to sync reviews"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
