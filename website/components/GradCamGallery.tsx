"use client";

import Image from "next/image";
import { useState } from "react";
import { GALLERY, type GalleryItem } from "@/lib/gallery";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "shortcut", label: "Shortcut failures only" },
  { key: "waterbird-water", label: "Waterbird · water" },
  { key: "waterbird-land", label: "Waterbird · land (conflict)" },
  { key: "landbird-land", label: "Landbird · land" },
  { key: "landbird-water", label: "Landbird · water (conflict)" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function matches(item: GalleryItem, key: FilterKey): boolean {
  if (key === "all") return true;
  if (key === "shortcut") return !item.correct;
  return item.group === key;
}

export function GradCamGallery() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const items = GALLERY.filter((g) => matches(g, filter));
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? "border-accent bg-accent text-white"
                  : "border-ink-700 bg-ink-900 text-ink-300 hover:border-accent hover:text-ink-50"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <figure
            key={item.file}
            className={`card overflow-hidden p-3 ${
              item.correct ? "" : "ring-1 ring-rose-500/40"
            }`}
          >
            <div className="relative w-full" style={{ aspectRatio: "12/4" }}>
              <Image
                src={`/gradcam/${item.file}`}
                alt={item.caption}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                unoptimized
              />
            </div>
            <figcaption className="mt-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded px-2 py-0.5 text-xs font-semibold ${
                    item.correct
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-rose-500/20 text-rose-300"
                  }`}
                >
                  {item.correct ? "Correct" : "SHORTCUT FAILURE"}
                </span>
                <span className="rounded bg-ink-800 px-2 py-0.5 text-xs text-ink-300">
                  {item.group}
                </span>
                <span className="text-xs text-ink-400">
                  true: <span className="text-ink-200">{item.truth}</span> · pred:{" "}
                  <span
                    className={
                      item.correct ? "text-emerald-300" : "text-rose-300"
                    }
                  >
                    {item.prediction}
                  </span>
                </span>
              </div>
              <p className="mt-2 text-ink-300">{item.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-ink-400 text-sm py-12 text-center">
          No images match this filter.
        </div>
      )}
    </div>
  );
}
