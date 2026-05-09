import { GROUP_LABEL, pct, testMetrics } from "@/lib/results";

export function SubgroupTable() {
  const rows = Object.entries(testMetrics.subgroup_metrics).sort(
    ([, a], [, b]) => a.accuracy - b.accuracy,
  );
  const worst = testMetrics.worst_group_accuracy;
  return (
    <table className="results-table">
      <thead>
        <tr>
          <th>Subgroup</th>
          <th className="text-right">Count</th>
          <th className="text-right">Accuracy</th>
          <th className="text-right">Avg confidence</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, m]) => {
          const isWorst = m.accuracy === worst;
          const isConflict = name === "waterbird-land" || name === "landbird-water";
          return (
            <tr key={name}>
              <td>
                <div className="font-medium">{GROUP_LABEL[name] ?? name}</div>
                <div className="font-mono text-xs text-ink-400">{name}</div>
              </td>
              <td className="text-right tabular-nums">{m.count}</td>
              <td
                className={`text-right tabular-nums font-semibold ${
                  isWorst ? "text-rose-400" : "text-ink-100"
                }`}
              >
                {pct(m.accuracy)}
              </td>
              <td className="text-right tabular-nums text-ink-300">
                {pct(m.avg_confidence)}
              </td>
              <td className="text-ink-400 text-xs">
                {isWorst && <span className="text-rose-400">worst group · </span>}
                {isConflict ? "shortcut conflict" : "majority group"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
