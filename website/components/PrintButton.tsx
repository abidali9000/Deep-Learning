"use client";

export function PrintButton({ label = "Save as PDF" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark"
    >
      {label}
    </button>
  );
}
