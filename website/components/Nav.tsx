"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV } from "@/lib/sections";

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-ink-800/60 bg-ink-950/85 backdrop-blur-md no-print">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-ink-50 font-semibold tracking-tight"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-accent" />
          <span>Shortcut Learning · Waterbirds</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-3 py-1.5 transition-colors ${
                  active ? "text-ink-50" : "text-ink-400 hover:text-ink-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/demo"
            className="ml-2 rounded-md bg-accent px-3.5 py-1.5 font-medium text-white hover:bg-accent-dark"
          >
            Demo
          </Link>
        </nav>

        <button
          aria-label="Toggle navigation"
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
        <div className="md:hidden border-t border-ink-800 bg-ink-950 px-5 py-3 flex flex-col gap-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded px-2 py-2 text-ink-200 hover:bg-ink-800"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/demo"
            onClick={() => setOpen(false)}
            className="rounded px-2 py-2 text-accent hover:bg-ink-800"
          >
            Demo
          </Link>
        </div>
      )}
    </header>
  );
}
