"use client";

import Image from "next/image";
import { useState } from "react";

type Item = {
  file: string;
  caption: string;
  group: string;
};

export const COMPARISON_PLATES: Item[] = [
  {
    file: "comparison_idx20_group-waterbird-land.png",
    caption: "Waterbird on land — shortcut failure case under each intervention.",
    group: "waterbird-land",
  },
  {
    file: "comparison_idx24_group-waterbird-land.png",
    caption: "Another waterbird-on-land sample.",
    group: "waterbird-land",
  },
  {
    file: "comparison_idx102_group-landbird-water.png",
    caption: "Landbird on water — note how the bias persists across blur and shuffle.",
    group: "landbird-water",
  },
  {
    file: "comparison_idx105_group-landbird-water.png",
    caption: "Landbird on water — foreground-mask still over-predicts waterbird.",
    group: "landbird-water",
  },
  {
    file: "comparison_idx10_group-waterbird-land.png",
    caption: "Conflict-group success case — for contrast.",
    group: "waterbird-land",
  },
  {
    file: "comparison_idx101_group-landbird-water.png",
    caption: "Landbird-on-water success — used as a control.",
    group: "landbird-water",
  },
];

export function ComparisonGallery() {
  const [missing, setMissing] = useState<Set<string>>(new Set());
  const visible = COMPARISON_PLATES.filter((p) => !missing.has(p.file));

  if (visible.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {visible.map((p) => (
        <figure key={p.file} className="card p-3">
          <div className="relative w-full" style={{ aspectRatio: "16/4" }}>
            <Image
              src={`/comparisons/${p.file}`}
              alt={p.caption}
              fill
              sizes="100vw"
              className="object-contain"
              unoptimized
              onError={() =>
                setMissing((prev) => new Set(prev).add(p.file))
              }
            />
          </div>
          <figcaption className="mt-2 text-sm text-ink-300">
            <span className="rounded bg-ink-800 px-2 py-0.5 text-xs text-ink-300 mr-2">
              {p.group}
            </span>
            {p.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
