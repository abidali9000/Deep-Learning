"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CONDITION_LABEL } from "@/lib/display";

type Row = {
  condition: string;
  accuracy: number;
  prediction_flip_rate: number;
  avg_background_ratio: number;
};

const fmtPct = (v: number) => `${(v * 100).toFixed(0)}%`;
const fmtPct1 = (v: number) => `${(v * 100).toFixed(1)}%`;

const COLORS: Record<string, string> = {
  original: "#94a3b8",
  background_blur: "#22d3ee",
  background_mask: "#06b6d4",
  background_patch_shuffle: "#a78bfa",
  foreground_mask: "#f43f5e",
};

export function InterventionBars({ data }: { data: Row[] }) {
  const ordered = [...data].sort((a, b) => {
    const order = [
      "original",
      "background_blur",
      "background_mask",
      "background_patch_shuffle",
      "foreground_mask",
    ];
    return order.indexOf(a.condition) - order.indexOf(b.condition);
  });

  const charts: {
    title: string;
    description: string;
    key: keyof Row;
    yMax: number;
    fmt: (v: number) => string;
  }[] = [
    {
      title: "Accuracy by intervention",
      description:
        "What happens to test accuracy when we modify the image at inference time?",
      key: "accuracy",
      yMax: 1,
      fmt: fmtPct,
    },
    {
      title: "Prediction flip rate vs. original",
      description:
        "Fraction of samples where the predicted class changes after the intervention.",
      key: "prediction_flip_rate",
      yMax: 0.5,
      fmt: fmtPct1,
    },
    {
      title: "Average background saliency ratio",
      description:
        "How much of the Grad-CAM heat sits outside the center foreground box?",
      key: "avg_background_ratio",
      yMax: 1,
      fmt: fmtPct1,
    },
  ];

  const labelled = ordered.map((d) => ({
    ...d,
    label: CONDITION_LABEL[d.condition] ?? d.condition,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {charts.map((c) => (
        <div className="card" key={c.title}>
          <div className="mb-2">
            <div className="font-medium text-ink-100">{c.title}</div>
            <div className="text-sm text-ink-400">{c.description}</div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart
                data={labelled}
                margin={{ top: 8, right: 8, left: 0, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  stroke="#64748b"
                  tickFormatter={c.fmt}
                  domain={[0, c.yMax]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    color: "#f1f5f9",
                  }}
                  formatter={(v: number) => c.fmt(v)}
                />
                <Legend
                  wrapperStyle={{ display: "none" }}
                />
                <Bar dataKey={c.key} radius={[6, 6, 0, 0]}>
                  {labelled.map((d, i) => (
                    <Cell key={i} fill={COLORS[d.condition] ?? "#6366f1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}
