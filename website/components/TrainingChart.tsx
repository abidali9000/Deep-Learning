"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Row = {
  epoch: number;
  train_acc: number;
  val_acc: number;
  val_worst_group_acc: number;
  val_acc_waterbird_water: number;
  val_acc_waterbird_land: number;
  val_acc_landbird_land: number;
  val_acc_landbird_water: number;
};

const fmtPct = (v: number) => `${(v * 100).toFixed(0)}%`;

export function TrainingChart({ data }: { data: Row[] }) {
  return (
    <div className="card">
      <div className="mb-3">
        <div className="eyebrow">Training history</div>
        <div className="text-ink-200 font-medium">
          Validation accuracy by subgroup, per epoch
        </div>
        <div className="text-ink-400 text-sm">
          Notice how overall validation accuracy stays high (~83%) while
          worst-group accuracy oscillates between 16% and 56% — this gap is
          the shortcut signal the project investigates.
        </div>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 10, right: 24, left: 0, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="epoch" stroke="#64748b" />
            <YAxis stroke="#64748b" tickFormatter={fmtPct} domain={[0, 1]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 8,
                color: "#f1f5f9",
              }}
              formatter={(v: number) => fmtPct(v)}
              labelFormatter={(l) => `Epoch ${l}`}
            />
            <Legend wrapperStyle={{ color: "#cbd5e1" }} />
            <Line
              type="monotone"
              dataKey="train_acc"
              name="Train acc"
              stroke="#94a3b8"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="val_acc"
              name="Val acc (overall)"
              stroke="#6366f1"
              dot={{ r: 3 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="val_worst_group_acc"
              name="Worst-group acc"
              stroke="#f43f5e"
              dot={{ r: 3 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="val_acc_waterbird_land"
              name="Waterbird-land (conflict)"
              stroke="#fb923c"
              dot={false}
              strokeDasharray="4 4"
            />
            <Line
              type="monotone"
              dataKey="val_acc_landbird_water"
              name="Landbird-water (conflict)"
              stroke="#facc15"
              dot={false}
              strokeDasharray="4 4"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
