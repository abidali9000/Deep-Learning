import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { MetricCard } from "@/components/MetricCard";
import { SubgroupTable } from "@/components/SubgroupTable";
import { ConfusionMatrix } from "@/components/ConfusionMatrix";
import { GitHubLink } from "@/components/GitHubLink";
import { pct, testMetrics } from "@/lib/results";

export default function EvaluationPage() {
  return (
    <article className="section prose-academic">
      <SectionHeader
        eyebrow="05 · Subgroup evaluation"
        title="Strong on average, weak where it counts"
        lead="Standard classification metrics are computed on the balanced test split, then broken down across the four (bird × background) subgroups."
        sourceFiles={[
          { path: "src/evaluate.py" },
          { path: "outputs/metrics/test_metrics.json" },
        ]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Overall accuracy"
          value={pct(testMetrics.overall_accuracy)}
          tone="good"
        />
        <MetricCard
          label="Macro F1"
          value={pct(testMetrics.f1_macro)}
        />
        <MetricCard
          label="Macro precision"
          value={pct(testMetrics.precision_macro)}
        />
        <MetricCard
          label="Worst-group accuracy"
          value={pct(testMetrics.worst_group_accuracy)}
          tone="bad"
        />
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="h3 mb-3">Per-subgroup accuracy</h3>
          <SubgroupTable />
          <p className="mt-4 text-sm text-ink-400">
            The two minority / conflict groups (
            <span className="text-rose-300">waterbird-land</span> and{" "}
            <span className="text-rose-300">landbird-water</span>) drop sharply
            below the majority groups. The gap between overall accuracy
            ({pct(testMetrics.overall_accuracy)}) and worst-group accuracy
            ({pct(testMetrics.worst_group_accuracy)}) is the signature of
            shortcut learning.
          </p>
        </div>
        <div>
          <ConfusionMatrix />
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="h3 mb-2">What the confusion matrix tells us</h3>
          <p>
            Errors are asymmetric: the model over-predicts <em>landbird</em>{" "}
            (the more frequent class). This matches the bias direction of the
            training set and is consistent with the model leaning on background
            features that correlate with class frequency.
          </p>
        </div>
        <div className="card">
          <h3 className="h3 mb-2">Where to look in the repo</h3>
          <p className="mb-2">
            The CSV with one row per test image:
          </p>
          <GitHubLink path="outputs/metrics/test_predictions.csv" />
          <p className="mt-3 mb-2">The raw JSON with subgroup metrics:</p>
          <GitHubLink path="outputs/metrics/test_metrics.json" />
          <p className="mt-3 mb-2">Confusion matrix figure:</p>
          <GitHubLink path="outputs/figures/test_confusion_matrix.png" />
        </div>
      </div>

      <Nav />
    </article>
  );
}

function Nav() {
  return (
    <div className="mt-10 flex justify-between text-sm">
      <Link href="/training" className="text-ink-400 hover:text-ink-100">
        ← Training
      </Link>
      <Link href="/gradcam" className="text-accent hover:underline">
        Next: Grad-CAM saliency analysis →
      </Link>
    </div>
  );
}
