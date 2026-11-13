# CodeLens — AI Code Reviewer

CodeLens is a modern, full-stack AI code reviewer built with **Next.js 14**, **TypeScript**, and **Groq Cloud API** running open-weights **Llama 3.3 70B**.

Paste or upload any source code file to automatically detect bugs, security vulnerabilities, performance bottlenecks, and code quality issues. Review actionable suggestions and inspect a full refactored rewrite in a side-by-side Monaco diff viewer.

---

## Features

- **Blazing Fast AI Inference**: Powered by the official [Groq Cloud SDK](https://console.groq.com) using `llama-3.3-70b-versatile` (or your preferred Llama model).
- **100% Next.js & TypeScript**: Zero Python, zero Docker, zero external microservices. All backend functionality is executed via Next.js Route Handlers (`app/api/`).
- **Interactive Monaco Code Editor**: Line numbers, syntax highlighting, problem glyph markers, and line highlighting mapped directly to detected issues.
- **Side-by-Side Diff Viewer**: Compare your original code against the LLM's refactored suggestions with one-click **Accept Fix** or **Reject Fix**.
- **Audit History**: Locally persisted in SQLite via `better-sqlite3`. Review, reload, or delete past code audits.
- **Multi-Language Support**: Python, TypeScript, JavaScript, Go, Rust, Java, C, C++, HTML, CSS, JSON, and more with automatic extension detection.
- **Optional User Accounts**: Secure JWT authentication with bcrypt password hashing. Works completely anonymously or with signed-in user history sync.
- **Dark & Light Mode**: Seamless theme switching with system preference support.

---

## Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │               Browser Client                 │
                    │   Next.js React Server & Client Components   │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼ Internal /api routes
                    ┌──────────────────────────────────────────────┐
                    │          Next.js Route Handlers              │
                    │                                              │
                    │   /api/review        /api/reviews            │
                    │   /api/review/upload /api/reviews/[id]       │
                    │   /api/health        /api/auth/*             │
                    └──────────────┬───────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
       ┌────────────────────────┐    ┌────────────────────────┐
       │     Groq Cloud API     │    │     SQLite Database    │
       │  Llama 3.3 70B Model   │    │     better-sqlite3     │
       │ (fast cloud inference) │    │  (local persistence)   │
       └────────────────────────┘    └────────────────────────┘
```

---

## Prerequisites

- **Node.js**: v18.17.0 or newer (v20+ recommended)
- **npm**: v9+ or newer
- **Groq API Key**: Free API key from [console.groq.com/keys](https://console.groq.com/keys)

---

## Quick Start

### 1. Install Dependencies

From the project root:

```bash
npm install
```

Or navigate to the `frontend/` directory:

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file inside the `frontend/` directory (or copy from `.env.example`):

```bash
cp frontend/.env.example frontend/.env.local
```

Edit `frontend/.env.local` and add your Groq API key:

```env
# Required: Free API key from https://console.groq.com/keys
GROQ_API_KEY=gsk_your_groq_api_key_here

# Groq Model (default: llama-3.3-70b-versatile)
# Supported alternatives: llama-3.1-70b-versatile, llama3-70b-8192, llama3-8b-8192
GROQ_MODEL=llama-3.3-70b-versatile

# Maximum upload file size in megabytes
MAX_UPLOAD_SIZE_MB=5

# Secret key for signing JWT tokens (change in production)
JWT_SECRET_KEY=codelens-super-secret-jwt-key-change-in-prod-2026

# JWT token expiration in minutes (default: 7 days)
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

### 3. Start the Development Server

From the root:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

To create an optimized production build:

```bash
npm run build
npm start
```

---

## Project Structure

```text
code_lens/
├── frontend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts       # POST /api/auth/login
│   │   │   │   ├── me/route.ts          # GET  /api/auth/me
│   │   │   │   └── register/route.ts    # POST /api/auth/register
│   │   │   ├── health/route.ts          # GET  /api/health (Groq API diagnostic)
│   │   │   ├── review/
│   │   │   │   ├── route.ts             # POST /api/review (JSON code analysis)
│   │   │   │   └── upload/route.ts      # POST /api/review/upload (multipart file)
│   │   │   └── reviews/
│   │   │       ├── route.ts             # GET  /api/reviews (list history)
│   │   │       └── [id]/route.ts        # GET, DELETE /api/reviews/:id
│   │   ├── history/page.tsx             # Past review audit log
│   │   ├── review/page.tsx              # Main review workspace
│   │   ├── settings/page.tsx            # AI diagnostics & model configuration
│   │   ├── layout.tsx                   # Root layout, Navbar, Auth modal
│   │   ├── page.tsx                     # Landing page
│   │   └── globals.css                  # Tailwind styles + Monaco line highlighting
│   ├── components/
│   │   ├── AuthModal.tsx                # Sign In / Sign Up modal
│   │   ├── CodeEditor.tsx               # Monaco editor with issue line markers
│   │   ├── DiffViewer.tsx               # Side-by-side Monaco diff comparison
│   │   ├── GroqAlert.tsx                # Groq setup and error notice banner
│   │   ├── IssuePanel.tsx               # Filterable issue checklist
│   │   ├── Navbar.tsx                   # Top navigation with live Groq health pill
│   │   ├── ReviewDashboard.tsx          # Health score card & issue breakdown
│   │   └── ReviewLoading.tsx            # Multi-step progress animation
│   ├── context/
│   │   ├── AuthContext.tsx              # User state & JWT persistence
│   │   └── ThemeContext.tsx             # Dark/Light theme provider
│   ├── data/
│   │   └── reviews.db                   # SQLite database (auto-created on first run)
│   ├── lib/
│   │   ├── ai/
│   │   │   └── groq-review.ts           # Groq API prompt builder & JSON parser
│   │   ├── auth.ts                      # Password hashing (bcrypt) & JWT (jose)
│   │   ├── db.ts                        # better-sqlite3 connection & migrations
│   │   ├── groq.ts                      # Reusable Groq SDK client instance
│   │   ├── utils.ts                     # Client utility functions
│   │   └── utils-server.ts              # File validation, language detection
│   ├── types/
│   │   └── index.ts                     # TypeScript interfaces
│   ├── .env.example
│   ├── .env.local
│   ├── next.config.js
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── package.json                         # Root package.json with dev/build scripts
└── README.md
```

---

## API Reference

All endpoints run on the same origin (no CORS or separate backend process required):

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/health` | Diagnostic check for Groq Cloud API connectivity and configured model |
| `POST` | `/api/review` | Analyze raw source code via Groq API; saves result to SQLite |
| `POST` | `/api/review/upload` | Upload source file (multipart/form-data) for analysis |
| `GET` | `/api/reviews` | List recent reviews (supports pagination via `?limit=50`) |
| `GET` | `/api/reviews/:id` | Fetch full review details including code diff and issues |
| `DELETE` | `/api/reviews/:id` | Delete a review from SQLite history |
| `POST` | `/api/auth/register` | Create a new user account |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT access token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |

---

## Vercel Deployment

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the **Root Directory** to `frontend`.
4. Add the following **Environment Variables** in the Vercel dashboard:
   - `GROQ_API_KEY`: Your Groq Cloud API key
   - `GROQ_MODEL`: `llama-3.3-70b-versatile`
   - `JWT_SECRET_KEY`: A strong random secret
5. Deploy.

> **Note for SQLite on Serverless/Vercel**: Because Vercel functions have an ephemeral filesystem, database writes to `reviews.db` will reset on cold starts. For persistent multi-user production deployments on Vercel, replace `better-sqlite3` with a cloud database like Turso (libSQL), Neon (Postgres), or Supabase.

---

## License

MIT License.
