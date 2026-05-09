import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";

const ITEMS = [
  {
    title: "Coarse foreground heuristic",
    body: "Birds aren't always at the geometric center, so a fixed 60% center crop will mis-attribute saliency for non-centered birds. The brief explicitly allows this approximation, but a tighter heuristic (segmentation mask from CUB or saliency-based bounding boxes) would sharpen the bias score.",
  },
  {
    title: "Single seed, single architecture",
    body: "Results are reported for one ResNet18 run with one random seed. Re-running across seeds and reporting confidence intervals would tighten the claims.",
  },
  {
    title: "Patch shuffle is non-deterministic",
    body: "background_patch_shuffle uses a single permutation per image rather than averaging over multiple shuffles. The reported flip rate is therefore noisier than the other interventions.",
  },
  {
    title: "No GroupDRO or reweighting baseline",
    body: "We adopt one DRO-flavoured choice (model selection by worst-group accuracy) but don't train an actual GroupDRO model (Sagawa et al. 2019). Comparing standard ERM vs. GroupDRO on the same metrics would directly test whether our shortcut diagnosis can be mitigated.",
  },
  {
    title: "Grad-CAM is only one saliency method",
    body: "Different attribution methods (Integrated Gradients, SHAP, RISE) can disagree. Cross-checking the bias score with at least one other method would strengthen the saliency-based claims.",
  },
  {
    title: "Class label semantics in the HF mirror",
    body: "We follow the convention used by grodino/waterbirds (label 0 = landbird, label 1 = waterbird, place 0 = land, place 1 = water). If a different mirror reverses these, the subgroup names need to be re-verified before re-running.",
  },
];

export default function LimitationsPage() {
  return (
    <article className="section prose-academic">
      <SectionHeader
        eyebrow="10 · Limitations"
        title="What this study does not claim"
        lead="Honest accounting of the limits of the design — and concrete suggestions for what a follow-up should add."
      />
      <div className="grid md:grid-cols-2 gap-4">
        {ITEMS.map((it) => (
          <div key={it.title} className="card">
            <div className="font-semibold text-ink-100">{it.title}</div>
            <p className="mt-2 text-ink-300 text-sm">{it.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 card">
        <h3 className="h3 mb-2">Future work</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Replace center-crop heuristic with the CUB segmentation masks where available.</li>
          <li>Train a GroupDRO baseline and recompute every saliency / intervention metric.</li>
          <li>Average background_patch_shuffle over N permutations.</li>
          <li>Add a saliency-method comparison (Integrated Gradients vs. Grad-CAM vs. RISE).</li>
          <li>Try a different backbone (ConvNeXt-Tiny or a small ViT) to test whether the shortcut is architecture-specific.</li>
        </ul>
      </div>

      <div className="mt-10 flex justify-between text-sm">
        <Link href="/conclusion" className="text-ink-400 hover:text-ink-100">
          ← Conclusion
        </Link>
        <Link href="/code-walkthrough" className="text-accent hover:underline">
          Next: Code walkthrough →
        </Link>
      </div>
    </article>
  );
}
