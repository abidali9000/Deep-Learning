import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { MetricCard } from "@/components/MetricCard";
import { SubgroupTable } from "@/components/SubgroupTable";
import { ConfusionMatrix } from "@/components/ConfusionMatrix";
import { TrainingChart } from "@/components/TrainingChart";
import { InterventionBars } from "@/components/InterventionBars";
import { SaliencyBars } from "@/components/SaliencyBars";
import { InterventionTable } from "@/components/InterventionTable";
import { GitHubLink } from "@/components/GitHubLink";
import {
  gradCamGroupSummary,
  interventionOverall,
  interventionSubgroup,
  pct,
  testMetrics,
  trainHistory,
} from "@/lib/results";

export default function ResultsPage() {
  const fg = interventionOverall.find((r) => r.condition === "foreground_mask");
  const bg = interventionOverall.find((r) => r.condition === "background_mask");
  return (
    <article className="section prose-academic">
      <SectionHeader
        eyebrow="08 · Results dashboard"
        title="All numbers in one place"
        lead="The full project results assembled into one scrollable view, suitable for live presentation."
        sourceFiles={[
          { path: "outputs/PROJECT_RESULTS_SUMMARY.md", label: "PROJECT_RESULTS_SUMMARY.md" },
        ]}
      />

      <h2 className="h2 mb-3">Headline metrics</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Overall test acc"
          value={pct(testMetrics.overall_accuracy)}
          tone="good"
        />
        <MetricCard
          label="Worst-group acc"
          value={pct(testMetrics.worst_group_accuracy)}
          tone="bad"
          hint="waterbird-land"
        />
        <MetricCard
          label="Foreground-mask acc"
          value={fg ? pct(fg.accuracy) : "—"}
          tone="warn"
          hint={fg ? `${pct(fg.prediction_flip_rate)} flips` : ""}
        />
        <MetricCard
          label="Background-mask acc"
          value={bg ? pct(bg.accuracy) : "—"}
          tone="good"
          hint="bg removal helps"
        />
      </div>

      <h2 className="h2 mt-10 mb-3">Subgroup metrics</h2>
      <div className="card">
        <SubgroupTable />
      </div>

      <h2 className="h2 mt-10 mb-3">Confusion matrix</h2>
      <ConfusionMatrix />

      <h2 className="h2 mt-10 mb-3">Training dynamics</h2>
      <TrainingChart data={trainHistory} />

      <h2 className="h2 mt-10 mb-3">Grad-CAM saliency</h2>
      <SaliencyBars data={gradCamGroupSummary} />

      <h2 className="h2 mt-10 mb-3">Interventions</h2>
      <InterventionBars data={interventionOverall} />

      <h2 className="h2 mt-10 mb-3">Intervention × subgroup table</h2>
      <InterventionTable rows={interventionSubgroup} />

      <div className="mt-10 card">
        <h3 className="h3 mb-2">Source files</h3>
        <div className="flex flex-wrap gap-2">
          <GitHubLink path="outputs/metrics/test_metrics.json" />
          <GitHubLink path="outputs/metrics/test_predictions.csv" />
          <GitHubLink path="outputs/metrics/train_history.csv" />
          <GitHubLink path="outputs/gradcam/gradcam_results.csv" />
          <GitHubLink path="outputs/gradcam/gradcam_group_summary.csv" />
          <GitHubLink path="outputs/interventions/intervention_metrics.csv" />
          <GitHubLink path="outputs/interventions/intervention_overall_metrics.csv" />
          <GitHubLink path="outputs/interventions/intervention_predictions.csv" />
          <GitHubLink path="outputs/PROJECT_RESULTS_SUMMARY.md" />
        </div>
      </div>

      <Nav />
    </article>
  );
}

function Nav() {
  return (
    <div className="mt-10 flex justify-between text-sm">
      <Link href="/interventions" className="text-ink-400 hover:text-ink-100">
        ← Interventions
      </Link>
      <Link href="/conclusion" className="text-accent hover:underline">
        Next: Conclusion →
      </Link>
    </div>
  );
}
