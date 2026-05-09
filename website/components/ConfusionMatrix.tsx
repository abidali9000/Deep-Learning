import { testMetrics } from "@/lib/results";

export function ConfusionMatrix() {
  const cm = testMetrics.confusion_matrix; // [[TN, FP], [FN, TP]] for label 0 first
  const labels = ["landbird", "waterbird"];
  const totals = cm.map((row) => row.reduce((a, b) => a + b, 0));
  const max = Math.max(...cm.flat());
  return (
    <div className="card">
      <div className="mb-3">
        <div className="font-medium text-ink-100">Confusion matrix · test split</div>
        <div className="text-sm text-ink-400">
          Rows = true class, columns = predicted class. Cell intensity is
          proportional to count.
        </div>
      </div>
      <div className="grid grid-cols-[auto_1fr_1fr] gap-2 text-sm">
        <div></div>
        <div className="text-center text-ink-400">Pred: landbird</div>
        <div className="text-center text-ink-400">Pred: waterbird</div>
        {cm.map((row, i) => (
          <Row
            key={i}
            label={`True: ${labels[i]}`}
            row={row}
            total={totals[i]}
            max={max}
          />
        ))}
      </div>
    </div>
  );
}

function Row({
  label,
  row,
  total,
  max,
}: {
  label: string;
  row: number[];
  total: number;
  max: number;
}) {
  return (
    <>
      <div className="flex items-center text-ink-300">{label}</div>
      {row.map((v, i) => {
        const intensity = max ? v / max : 0;
        const bg = `rgba(99, 102, 241, ${0.15 + intensity * 0.65})`;
        return (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-lg px-2 py-4 text-ink-50"
            style={{ background: bg }}
          >
            <div className="text-xl font-semibold tabular-nums">{v}</div>
            <div className="text-xs text-ink-300">
              {((v / total) * 100).toFixed(1)}% of true row
            </div>
          </div>
        );
      })}
    </>
  );
}
