import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--bg-base)",
        foreground: "var(--fg-base)",
        charcoal: {
          950: "#08080a",
          900: "#0d0d10",
          850: "#121216",
          800: "#17171d",
          700: "#22222a",
          600: "#2d2d38",
          500: "#454553",
        },
        warm: {
          50: "#fff8f5",
          100: "#ffede5",
          200: "#ffd8c7",
          300: "#ffb89a",
          400: "#ff8c5a",
          500: "#f97316", // Warm signature accent
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        glass: {
          surface: "var(--glass-surface)",
          border: "var(--glass-border)",
          highlight: "var(--glass-highlight)",
        },
        severity: {
          critical: "#f43f5e",
          high: "#f97316",
          medium: "#eab308",
          low: "#38bdf8",
          info: "#94a3b8",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'SF Pro Text'",
          "'SF Pro Display'",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "'JetBrains Mono'",
          "'SF Mono'",
          "Fira Code",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        "glass-sm": "0 2px 8px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
        "glass-md": "0 8px 30px 0 rgba(0, 0, 0, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
        "glass-lg": "0 20px 60px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)",
        "warm-glow": "0 0 40px -10px rgba(249, 115, 22, 0.35)",
        "warm-glow-lg": "0 0 80px -15px rgba(249, 115, 22, 0.25)",
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
