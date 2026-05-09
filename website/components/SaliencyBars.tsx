"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { GROUP_LABEL } from "@/lib/display";

type Row = {
  group_name: string;
  foreground_ratio: number;
  background_ratio: number;
  attention_bias_score: number;
  correct: number;
};

const fmtPct = (v: number) => `${(v * 100).toFixed(0)}%`;

export function SaliencyBars({ data }: { data: Row[] }) {
  const labelled = data.map((d) => ({
    ...d,
    label: GROUP_LABEL[d.group_name] ?? d.group_name,
  }));
  return (
    <div className="card">
      <div className="mb-2">
        <div className="font-medium text-ink-100">
          Foreground vs. background saliency by subgroup
        </div>
        <div className="text-sm text-ink-400">
          Fraction of Grad-CAM heat that falls inside the 60% center crop
          (foreground heuristic) vs. outside (background).
        </div>
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
              angle={-12}
              textAnchor="end"
              height={50}
            />
            <YAxis stroke="#64748b" tickFormatter={fmtPct} domain={[0, 1]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 8,
                color: "#f1f5f9",
              }}
              formatter={(v: number) => fmtPct(v)}
            />
            <Legend wrapperStyle={{ color: "#cbd5e1" }} />
            <Bar
              dataKey="foreground_ratio"
              name="Foreground"
              stackId="a"
              fill="#22c55e"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="background_ratio"
              name="Background (bias score)"
              stackId="a"
              fill="#f43f5e"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
