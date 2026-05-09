type Tone = "default" | "good" | "warn" | "bad";

const toneClass: Record<Tone, string> = {
  default: "text-ink-50",
  good: "text-emerald-400",
  warn: "text-amber-400",
  bad: "text-rose-400",
};

export function MetricCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
}) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-widest text-ink-400">
        {label}
      </div>
      <div className={`mt-2 text-3xl font-bold tabular-nums ${toneClass[tone]}`}>
        {value}
      </div>
      {hint && <div className="mt-1 text-sm text-ink-400">{hint}</div>}
    </div>
  );
}
