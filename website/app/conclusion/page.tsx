import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { interventionOverall, pct, testMetrics } from "@/lib/results";

export default function ConclusionPage() {
  const original = interventionOverall.find((r) => r.condition === "original");
  const fg = interventionOverall.find((r) => r.condition === "foreground_mask");
  const bg = interventionOverall.find((r) => r.condition === "background_mask");
  return (
    <article className="section prose-academic">
      <SectionHeader
        eyebrow="09 · Conclusion"
        title="The model uses both — but it leans on the background more than it should"
        lead="Three independent lines of evidence converge on the same diagnosis."
      />

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Pill
          n="1"
          title="Subgroup gap"
          body={`Overall accuracy ${pct(testMetrics.overall_accuracy)} vs. worst-group ${pct(testMetrics.worst_group_accuracy)} — a ${pct(testMetrics.overall_accuracy - testMetrics.worst_group_accuracy)} drop on the conflict subgroup.`}
        />
        <Pill
          n="2"
          title="Saliency outside the bird"
          body="Across all four subgroups, 30–48% of Grad-CAM mass lies outside the 60% center crop, peaking on the conflict groups."
        />
        <Pill
          n="3"
          title="Causal interventions"
          body={
            fg && bg && original
              ? `Masking the bird drops accuracy from ${pct(original.accuracy)} to ${pct(fg.accuracy)} (${pct(fg.prediction_flip_rate)} flips). Conversely, masking the background raises accuracy to ${pct(bg.accuracy)} — the background was misleading the model on conflict cases.`
              : ""
          }
        />
      </div>

      <div className="card">
        <h3 className="h3 mb-2">Final statement (data-supported)</h3>
        <p>
          The CNN reaches{" "}
          <strong>{pct(testMetrics.overall_accuracy)}</strong> overall test
          accuracy on Waterbirds, but only{" "}
          <strong className="text-rose-300">
            {pct(testMetrics.worst_group_accuracy)}
          </strong>{" "}
          on the worst (waterbird-on-land) subgroup. Grad-CAM analysis
          confirms that a substantial share of the model's attention falls on
          the background even when its prediction is correct, and the four
          inference-time interventions provide direct causal evidence that
          background cues influence predictions: foreground masking flips{" "}
          <strong>
            {fg ? pct(fg.prediction_flip_rate) : "31.8%"}
          </strong>{" "}
          of predictions and crashes accuracy to{" "}
          <strong>{fg ? pct(fg.accuracy) : "53.4%"}</strong>, while background
          masking raises overall accuracy to{" "}
          <strong>{bg ? pct(bg.accuracy) : "86.0%"}</strong> by removing a
          misleading signal. We therefore conclude that the model has
          partially internalised the background → bird-type shortcut that the
          training distribution induced.
        </p>
        <p className="mt-3 text-ink-400 text-sm">
          The model is not <em>only</em> a background classifier — it does use
          the bird (foreground masking still hurts a lot) — but the background
          is doing more work than a fair model should allow.
        </p>
      </div>

      <Nav />
    </article>
  );
}

function Pill({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="card">
      <div className="text-xs text-ink-400 uppercase tracking-widest">
        Evidence #{n}
      </div>
      <div className="mt-1 font-semibold text-ink-50">{title}</div>
      <p className="mt-2 text-ink-300 text-sm">{body}</p>
    </div>
  );
}

function Nav() {
  return (
    <div className="mt-10 flex justify-between text-sm">
      <Link href="/results" className="text-ink-400 hover:text-ink-100">
        ← Results
      </Link>
      <Link href="/limitations" className="text-accent hover:underline">
        Next: Limitations →
      </Link>
    </div>
  );
}
