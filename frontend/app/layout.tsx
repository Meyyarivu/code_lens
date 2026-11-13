import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeLens — AI Code Reviewer & Security Auditor",
  description:
    "Liquid-glass developer platform powered by Groq Cloud and Llama models. Automated auditing for bugs, security vulnerabilities, performance, and code quality.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="min-h-screen bg-charcoal-950 text-zinc-100 antialiased selection:bg-warm-500/25 selection:text-warm-200">
        <ThemeProvider>
          <AuthProvider>
            {/* Ambient Background Mesh */}
            <div className="ambient-glow-mesh" aria-hidden="true">
              <div className="ambient-glow-orb-1" />
              <div className="ambient-glow-orb-2" />
            </div>

            <div className="relative z-10 flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>

            <AuthModal />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
