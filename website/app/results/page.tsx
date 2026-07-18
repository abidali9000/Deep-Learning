import { SectionHeader } from "@/components/SectionHeader";
import { MetricCard } from "@/components/MetricCard";
import { SubgroupTable } from "@/components/SubgroupTable";
import { ConfusionMatrix } from "@/components/ConfusionMatrix";
import { SaliencyBars } from "@/components/SaliencyBars";
import { GradCamGallery } from "@/components/GradCamGallery";
import { InterventionBars } from "@/components/InterventionBars";
import { InterventionTable } from "@/components/InterventionTable";
import { ComparisonGallery } from "@/components/ComparisonGallery";
import {
  gradCamGroupSummary,
  interventionOverall,
  interventionSubgroup,
  pct,
  testMetrics,
} from "@/lib/results";

export default function ResultsPage() {
  const fgMask = interventionOverall.find(
    (r) => r.condition === "foreground_mask",
  );
  const bgMask = interventionOverall.find(
    (r) => r.condition === "background_mask",
  );

  return (
    <article className="section prose-academic">
      <SectionHeader
        eyebrow="Results"
        title="Evaluation, saliency, and intervention experiments"
        lead="The headline accuracy looks strong, but subgroup metrics, Grad-CAM, and inference-time interventions all point to the same conclusion: the model leans on the background."
        sourceFiles={[
          { path: "src/evaluate.py" },
          { path: "src/gradcam_analysis.py" },
          { path: "src/interventions.py" },
        ]}
      />

      <section className="mb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Overall accuracy"
            value={pct(testMetrics.overall_accuracy, 1)}
            tone="good"
          />
          <MetricCard
            label="Worst-group accuracy"
            value={pct(testMetrics.worst_group_accuracy, 1)}
            tone="bad"
            hint="Waterbird on land"
          />
          <MetricCard
            label="Foreground mask"
            value={fgMask ? pct(fgMask.accuracy, 1) : "—"}
            tone="bad"
            hint={fgMask ? `${pct(fgMask.prediction_flip_rate, 1)} of predictions flip` : ""}
          />
          <MetricCard
            label="Background mask"
            value={bgMask ? pct(bgMask.accuracy, 1) : "—"}
            tone="good"
            hint="Higher than the original"
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="h2 mb-4">Subgroup accuracy</h2>
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="card overflow-x-auto">
            <SubgroupTable />
          </div>
          <ConfusionMatrix />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="h2 mb-2">Grad-CAM saliency</h2>
        <p className="text-ink-400 mb-4 max-w-3xl">
          For every subgroup, a large share of the model&apos;s attention falls
          on the background. The conflict groups are where that reliance turns
          into misclassifications.
        </p>
        <div className="mb-6">
          <SaliencyBars data={gradCamGroupSummary} />
        </div>
        <GradCamGallery />
      </section>

      <section className="mb-12">
        <h2 className="h2 mb-2">Intervention experiments</h2>
        <p className="text-ink-400 mb-4 max-w-3xl">
          Editing the image at inference time isolates the background&apos;s
          causal role. Masking the foreground collapses accuracy and flips many
          predictions; changing only the background leaves accuracy intact or
          even improves it.
        </p>
        <div className="mb-6">
          <InterventionBars data={interventionOverall} />
        </div>
        <div className="card overflow-x-auto mb-6">
          <InterventionTable rows={interventionSubgroup} />
        </div>
        <ComparisonGallery />
      </section>

      <section>
        <h2 className="h2 mb-3">Conclusion</h2>
        <div className="card max-w-3xl">
          <p className="text-ink-300">
            The {pct(testMetrics.overall_accuracy - testMetrics.worst_group_accuracy, 1)}{" "}
            gap between overall and worst-group accuracy, the high background
            saliency in every subgroup, and the intervention results together
            show that the CNN has partially learned the shortcut{" "}
            <em>background → bird type</em>. It still uses the bird, but it
            relies on the background enough to hurt minority-subgroup
            generalisation. The main limitations are that the foreground proxy
            is a fixed centre crop rather than a true segmentation mask, and
            that results come from a single ResNet18 run.
          </p>
        </div>
      </section>
    </article>
  );
}
