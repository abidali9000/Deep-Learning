import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { GitHubLink } from "@/components/GitHubLink";

type Step = {
  num: string;
  title: string;
  blurb: string;
  files: { path: string; label?: string; line?: number }[];
  commands?: string[];
  outputs?: string[];
};

const STEPS: Step[] = [
  {
    num: "01",
    title: "Load Waterbirds",
    blurb:
      "Wraps the HF grodino/waterbirds split as a torch Dataset. Returns image, label, place, group, idx.",
    files: [
      { path: "src/dataset.py" },
      { path: "src/utils.py", label: "src/utils.py · group ids" },
    ],
  },
  {
    num: "02",
    title: "Build the model",
    blurb:
      "ResNet18 (or 50) with ImageNet weights and a 2-class head. Architecture set in config.yaml.",
    files: [
      { path: "src/model.py" },
      { path: "config.yaml" },
    ],
  },
  {
    num: "03",
    title: "Train with worst-group selection",
    blurb:
      "15 epochs of Adam, lr 1e-4. Best checkpoint is the one with the highest validation worst-group accuracy.",
    files: [{ path: "src/train.py" }],
    commands: ["python -m src.train --config config.yaml"],
    outputs: [
      "outputs/checkpoints/best_model.pt",
      "outputs/metrics/train_history.csv",
    ],
  },
  {
    num: "04",
    title: "Subgroup evaluation",
    blurb:
      "Computes overall accuracy + macro P/R/F1, the confusion matrix, per-subgroup accuracy and worst-group accuracy.",
    files: [{ path: "src/evaluate.py" }],
    commands: [
      "python -m src.evaluate --config config.yaml --checkpoint outputs/checkpoints/best_model.pt --split test",
    ],
    outputs: [
      "outputs/metrics/test_metrics.json",
      "outputs/metrics/test_predictions.csv",
      "outputs/figures/test_confusion_matrix.png",
    ],
  },
  {
    num: "05",
    title: "Grad-CAM saliency analysis",
    blurb:
      "Selvaraju et al. Grad-CAM on layer4[-1]. 30 representative test samples per subgroup; each generates a 3-panel plate.",
    files: [{ path: "src/gradcam_analysis.py" }],
    commands: [
      "python -m src.gradcam_analysis --config config.yaml --checkpoint outputs/checkpoints/best_model.pt",
    ],
    outputs: [
      "outputs/gradcam/gradcam_results.csv",
      "outputs/gradcam/gradcam_group_summary.csv",
      "outputs/gradcam/*.png  (122 plates)",
    ],
  },
  {
    num: "06",
    title: "Foreground / background score",
    blurb:
      "60% center crop = foreground proxy. attention_bias_score = sum(saliency outside) / total. Implemented as saliency_ratios() inside gradcam_analysis.py.",
    files: [
      {
        path: "src/gradcam_analysis.py",
        label: "src/gradcam_analysis.py · saliency_ratios",
      },
    ],
  },
  {
    num: "07",
    title: "Interventions",
    blurb:
      "Four edits — background_blur, background_mask, background_patch_shuffle, foreground_mask — re-run inference + Grad-CAM under each.",
    files: [{ path: "src/interventions.py" }],
    commands: [
      "python -m src.interventions --config config.yaml --checkpoint outputs/checkpoints/best_model.pt --max-samples 1000",
    ],
    outputs: [
      "outputs/interventions/intervention_predictions.csv",
      "outputs/interventions/intervention_metrics.csv",
      "outputs/interventions/intervention_overall_metrics.csv",
      "outputs/figures/intervention_accuracy.png",
      "outputs/figures/intervention_background_saliency.png",
    ],
  },
  {
    num: "08",
    title: "Generate the project summary",
    blurb:
      "Aggregates everything into a single markdown file. The website also reads the same CSV/JSON files at build time.",
    files: [{ path: "src/report_summary.py" }],
    commands: ["python -m src.report_summary"],
    outputs: ["outputs/PROJECT_RESULTS_SUMMARY.md"],
  },
];

export default function WalkthroughPage() {
  return (
    <article className="section prose-academic">
      <SectionHeader
        eyebrow="Code walkthrough"
        title="Each methodology step → the file that implements it"
        lead="Click any chip to jump straight to the file on GitHub. The full pipeline runs end-to-end with bash run_all.sh."
        sourceFiles={[{ path: "run_all.sh" }, { path: "config.yaml" }]}
      />

      <div className="space-y-5">
        {STEPS.map((s) => (
          <div key={s.num} className="card">
            <div className="flex items-start gap-4">
              <div className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent text-white text-sm font-semibold">
                {s.num}
              </div>
              <div className="flex-1">
                <div className="text-ink-50 font-semibold text-lg">
                  {s.title}
                </div>
                <p className="mt-1 text-ink-300">{s.blurb}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {s.files.map((f) => (
                    <GitHubLink
                      key={f.path + (f.label ?? "")}
                      path={f.path}
                      line={f.line}
                      label={f.label}
                    />
                  ))}
                </div>

                {s.commands && (
                  <pre className="mt-4 rounded-lg bg-ink-950 p-3 text-xs overflow-x-auto text-ink-100">
                    {s.commands.join("\n")}
                  </pre>
                )}

                {s.outputs && (
                  <div className="mt-3">
                    <div className="text-xs uppercase tracking-widest text-ink-400 mb-1">
                      Outputs
                    </div>
                    <ul className="text-sm text-ink-300 font-mono space-y-0.5">
                      {s.outputs.map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 card">
        <h3 className="h3 mb-2">One-shot reproducibility</h3>
        <pre className="rounded-lg bg-ink-950 p-4 text-sm overflow-x-auto text-ink-100">
{`pip install -r requirements.txt
bash run_all.sh`}
        </pre>
      </div>

      <div className="mt-10 flex justify-between text-sm">
        <Link href="/limitations" className="text-ink-400 hover:text-ink-100">
          ← Limitations
        </Link>
        <Link href="/demo" className="text-accent hover:underline">
          Next: Live demo →
        </Link>
      </div>
    </article>
  );
}
