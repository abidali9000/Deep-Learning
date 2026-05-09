import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { InterventionBars } from "@/components/InterventionBars";
import { InterventionTable } from "@/components/InterventionTable";
import { GitHubLink } from "@/components/GitHubLink";
import { ComparisonGallery } from "@/components/ComparisonGallery";
import {
  CONDITION_LABEL,
  interventionOverall,
  interventionSubgroup,
  pct,
} from "@/lib/results";

const CONDITIONS = [
  {
    key: "background_blur",
    title: "Background blur",
    body: "Gaussian blur (σ from kernel 31) outside the center crop. Removes high-frequency background detail without changing colour.",
  },
  {
    key: "background_mask",
    title: "Background mask",
    body: "Replace the background with a flat 0.5 grey. Removes essentially all background information.",
  },
  {
    key: "background_patch_shuffle",
    title: "Background patch shuffle",
    body: "Permute 16×16 background patches. Keeps the colour distribution but destroys structure.",
  },
  {
    key: "foreground_mask",
    title: "Foreground mask",
    body: "Replace the center crop with grey — i.e. erase the bird while keeping the background untouched. The hardest test for shortcut reliance.",
  },
];

export default function InterventionsPage() {
  return (
    <article className="section prose-academic">
      <SectionHeader
        eyebrow="07 · Interventions"
        title="Causal evidence: edit the image, watch the prediction"
        lead="The brief asks for at least two interventions. We implement four — three that erase the background in different ways, plus one that erases the foreground. We re-run inference and Grad-CAM under each condition."
        sourceFiles={[
          { path: "src/interventions.py" },
          { path: "outputs/interventions/intervention_overall_metrics.csv" },
          { path: "outputs/interventions/intervention_metrics.csv" },
        ]}
      />

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {CONDITIONS.map((c) => (
          <div key={c.key} className="card">
            <div className="font-medium text-ink-100">
              {CONDITION_LABEL[c.key] ?? c.title}
            </div>
            <div className="text-sm text-ink-400 mt-1">{c.body}</div>
          </div>
        ))}
      </div>

      <h2 className="h2 mb-3">Overall effect</h2>
      <InterventionBars data={interventionOverall} />

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="h3 mb-2">Reading the bars</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Foreground mask drops accuracy from{" "}
                {pct(
                  interventionOverall.find((r) => r.condition === "original")
                    ?.accuracy ?? 0,
                )}{" "}
                to{" "}
                {pct(
                  interventionOverall.find(
                    (r) => r.condition === "foreground_mask",
                  )?.accuracy ?? 0,
                )}{" "}
                with a {pct(
                  interventionOverall.find(
                    (r) => r.condition === "foreground_mask",
                  )?.prediction_flip_rate ?? 0,
                )}{" "}
                flip rate
              </strong>{" "}
              — the bird matters, a lot. The model is not a pure
              background classifier.
            </li>
            <li>
              <strong>Background mask actually <em>increases</em> overall
              accuracy</strong> ({pct(
                interventionOverall.find(
                  (r) => r.condition === "background_mask",
                )?.accuracy ?? 0,
              )}). When we delete the background, predictions on the conflict
              groups improve — direct evidence that the background was
              <em> misleading</em> the model on those subgroups.
            </li>
            <li>
              <strong>Background patch shuffle</strong> is the most disruptive
              of the three background ablations for prediction flips, even
              though average colour is preserved — meaning structural
              background features (water vs. land texture) were carrying signal.
            </li>
          </ul>
        </div>
        <div className="card">
          <h3 className="h3 mb-2">Pre-rendered figures</h3>
          <p className="text-sm text-ink-400 mb-3">
            These come straight from{" "}
            <GitHubLink path="src/interventions.py" />.
          </p>
          <div className="grid grid-cols-1 gap-3">
            <Image
              src="/figures/intervention_accuracy.png"
              alt="Accuracy by intervention"
              width={1200}
              height={600}
              className="rounded-lg border border-ink-800 bg-white p-2"
              unoptimized
            />
            <Image
              src="/figures/intervention_background_saliency.png"
              alt="Background saliency by intervention"
              width={1200}
              height={600}
              className="rounded-lg border border-ink-800 bg-white p-2"
              unoptimized
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="h2 mb-3">Side-by-side Grad-CAM comparison</h2>
        <p className="text-ink-400 mb-4 max-w-3xl">
          For each conflict-group sample, we render the original image and
          its four intervened versions, each with the Grad-CAM overlay for
          the model's predicted class. Generated by{" "}
          <GitHubLink path="src/comparison_plates.py" />.
        </p>
        <ComparisonGallery />
      </div>

      <div className="mt-10">
        <h2 className="h2 mb-3">Subgroup breakdown</h2>
        <p className="text-ink-400 mb-4 max-w-3xl">
          Drilling into the 4 × 5 grid is where the story really lands. Note
          how foreground masking devastates the conflict groups
          (waterbird-land drops to ~7% accuracy) while leaving the majority
          group nearly untouched.
        </p>
        <InterventionTable rows={interventionSubgroup} />
      </div>

      <Nav />
    </article>
  );
}

function Nav() {
  return (
    <div className="mt-10 flex justify-between text-sm">
      <Link href="/gradcam" className="text-ink-400 hover:text-ink-100">
        ← Grad-CAM
      </Link>
      <Link href="/results" className="text-accent hover:underline">
        Next: Results dashboard →
      </Link>
    </div>
  );
}
