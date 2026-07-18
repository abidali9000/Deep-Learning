type Step = {
  num: string;
  title: string;
  blurb: string;
};

const STEPS: Step[] = [
  { num: "01", title: "Load Waterbirds", blurb: "grodino/waterbirds · 4 subgroups" },
  { num: "02", title: "Train ResNet18", blurb: "Select best by worst-group acc." },
  { num: "03", title: "Subgroup eval", blurb: "Accuracy · P · R · F1 · confusion" },
  { num: "04", title: "Grad-CAM", blurb: "Saliency on layer4[-1]" },
  { num: "05", title: "Bias score", blurb: "Background saliency / total" },
  { num: "06", title: "Interventions", blurb: "Blur · mask · shuffle" },
  { num: "07", title: "Compare", blurb: "Δ accuracy · Δ flips · Δ saliency" },
];

export function PipelineDiagram() {
  return (
    <div className="card overflow-x-auto">
      <ol className="flex min-w-[820px] items-stretch gap-3">
        {STEPS.map((s, i) => (
          <li key={s.num} className="flex flex-1 items-stretch">
            <div className="flex flex-1 flex-col rounded-lg border border-ink-800 bg-ink-950/40 p-4">
              <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 font-mono text-xs font-semibold text-accent-dark">
                {s.num}
              </div>
              <div className="text-ink-50 font-medium">{s.title}</div>
              <div className="mt-1 text-xs text-ink-400">{s.blurb}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex items-center px-1 text-ink-600">→</div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
