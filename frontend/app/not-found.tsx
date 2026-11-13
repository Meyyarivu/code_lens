import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="liquid-glass flex flex-col items-center rounded-3xl p-8 sm:p-10 max-w-md shadow-2xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warm-500/15 border border-warm-500/25 text-warm-400 mb-4 shadow-warm-glow">
          <FileQuestion className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
          Page Not Found
        </h2>
        <p className="mt-2 text-xs text-zinc-400 max-w-sm leading-relaxed">
          The requested route or review does not exist, or has been archived.
        </p>
        <Link
          href="/"
          className="btn-warm mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
