"use client";

import Link from "next/link";
import { useState } from "react";
import { SECTIONS } from "@/lib/sections";

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b border-ink-800/60 bg-ink-950/80 backdrop-blur-md no-print">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-ink-50 font-semibold tracking-tight"
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
          <span>Shortcut Learning · Waterbirds</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {SECTIONS.slice(0, 10).map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded px-2 py-1 text-ink-300 hover:bg-ink-800 hover:text-ink-50"
            >
              {s.shortTitle}
            </Link>
          ))}
          <Link
            href="/code-walkthrough"
            className="ml-2 rounded px-2 py-1 text-ink-300 hover:bg-ink-800 hover:text-ink-50"
          >
            Code
          </Link>
          <Link
            href="/demo"
            className="ml-2 rounded-md bg-accent px-3 py-1.5 text-white hover:bg-accent-dark"
          >
            Live demo
          </Link>
        </nav>
        <button
          aria-label="Open navigation"
          className="md:hidden rounded p-2 text-ink-200 hover:bg-ink-800"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-ink-800 bg-ink-950 px-4 py-3 grid grid-cols-2 gap-1 text-sm">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              onClick={() => setOpen(false)}
              className="rounded px-2 py-1 text-ink-200 hover:bg-ink-800"
            >
              {s.shortTitle}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
