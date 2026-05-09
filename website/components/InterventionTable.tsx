import { CONDITION_LABEL, GROUP_LABEL, pct, type InterventionSubgroupRow } from "@/lib/results";

export function InterventionTable({ rows }: { rows: InterventionSubgroupRow[] }) {
  const conditionOrder = [
    "original",
    "background_blur",
    "background_mask",
    "background_patch_shuffle",
    "foreground_mask",
  ];
  const sorted = [...rows].sort((a, b) => {
    const c = conditionOrder.indexOf(a.condition) - conditionOrder.indexOf(b.condition);
    if (c !== 0) return c;
    return a.group_name.localeCompare(b.group_name);
  });
  return (
    <div className="overflow-x-auto">
      <table className="results-table min-w-[900px]">
        <thead>
          <tr>
            <th>Condition</th>
            <th>Subgroup</th>
            <th className="text-right">N</th>
            <th className="text-right">Accuracy</th>
            <th className="text-right">Flip rate</th>
            <th className="text-right">Conf. drop</th>
            <th className="text-right">FG saliency</th>
            <th className="text-right">BG saliency</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, i) => (
            <tr key={i}>
              <td className="text-ink-200">
                {CONDITION_LABEL[r.condition] ?? r.condition}
              </td>
              <td className="text-ink-300">
                {GROUP_LABEL[r.group_name] ?? r.group_name}
              </td>
              <td className="text-right tabular-nums">{r.count}</td>
              <td className="text-right tabular-nums">{pct(r.accuracy)}</td>
              <td className="text-right tabular-nums">{pct(r.prediction_flip_rate)}</td>
              <td className="text-right tabular-nums">
                {(r.avg_confidence_drop * 100).toFixed(1)}%
              </td>
              <td className="text-right tabular-nums text-emerald-300">
                {pct(r.avg_foreground_ratio)}
              </td>
              <td className="text-right tabular-nums text-rose-300">
                {pct(r.avg_background_ratio)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
