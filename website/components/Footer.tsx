import Link from "next/link";
import { GITHUB_REPO } from "@/lib/github";

export function Footer() {
  return (
    <footer className="border-t border-ink-800/60 bg-ink-950/60 py-8 text-ink-400 no-print">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm">
        <div>
          Project 18 · Advanced Deep Learning ·{" "}
          <span className="text-ink-300">
            Saliency-based Analysis of Shortcut Learning in CNNs
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/code-walkthrough" className="hover:text-ink-100">
            Code walkthrough
          </Link>
          <Link href="/references" className="hover:text-ink-100">
            References
          </Link>
          <Link href="/report" className="hover:text-ink-100">
            Report (PDF)
          </Link>
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink-100"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
