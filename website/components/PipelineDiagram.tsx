type Step = {
  num: string;
  title: string;
  blurb: string;
  color: string;
};

const STEPS: Step[] = [
  {
    num: "01",
    title: "Load Waterbirds",
    blurb: "HF grodino/waterbirds · 4 subgroups",
    color: "#6366f1",
  },
  {
    num: "02",
    title: "Train ResNet18",
    blurb: "Save best by worst-group acc",
    color: "#8b5cf6",
  },
  {
    num: "03",
    title: "Subgroup eval",
    blurb: "Acc · P · R · F1 · CM · WG",
    color: "#a855f7",
  },
  {
    num: "04",
    title: "Grad-CAM",
    blurb: "Class-conditional saliency on layer4[-1]",
    color: "#ec4899",
  },
  {
    num: "05",
    title: "Bias score",
    blurb: "BG saliency / total · 60% center crop",
    color: "#f43f5e",
  },
  {
    num: "06",
    title: "Interventions",
    blurb: "Blur · mask · shuffle · FG mask",
    color: "#fb923c",
  },
  {
    num: "07",
    title: "Compare",
    blurb: "Δ accuracy · Δ flips · Δ saliency",
    color: "#22c55e",
  },
];

export function PipelineDiagram() {
  return (
    <div className="card overflow-x-auto">
      <div className="flex min-w-[820px] items-stretch gap-3">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex flex-1 items-stretch">
            <div
              className="flex flex-1 flex-col rounded-xl border p-4"
              style={{
                borderColor: `${s.color}55`,
                background: `linear-gradient(180deg, ${s.color}18, ${s.color}06)`,
              }}
            >
              <div
                className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold text-white"
                style={{ background: s.color }}
              >
                {s.num}
              </div>
              <div className="text-ink-50 font-semibold">{s.title}</div>
              <div className="mt-1 text-xs text-ink-400">{s.blurb}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex items-center px-1 text-ink-500">→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
