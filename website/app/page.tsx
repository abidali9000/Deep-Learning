import Link from "next/link";
import { MetricCard } from "@/components/MetricCard";
import { PipelineDiagram } from "@/components/PipelineDiagram";
import { SECTIONS } from "@/lib/sections";
import { interventionOverall, pct, testMetrics } from "@/lib/results";

export default function HomePage() {
  const fgMask = interventionOverall.find((r) => r.condition === "foreground_mask");
  const bgMask = interventionOverall.find((r) => r.condition === "background_mask");
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="section">
          <div className="eyebrow mb-3">Project 18 · Advanced Deep Learning</div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-ink-50">
            Saliency-based Analysis of <br />
            <span className="bg-gradient-to-r from-accent via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
              Shortcut Learning in CNNs
            </span>
          </h1>
          <p className="lead mt-6 max-w-3xl">
            We train a CNN on the deliberately biased <strong>Waterbirds</strong>{" "}
            dataset and use Grad-CAM, a foreground/background attention-bias
            score, and four inference-time interventions to test whether the
            model is actually looking at the bird — or just at the background.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/methodology"
              className="rounded-md bg-accent px-5 py-2.5 font-medium text-white hover:bg-accent-dark"
            >
              See the methodology →
            </Link>
            <Link
              href="/results"
              className="rounded-md border border-ink-700 px-5 py-2.5 font-medium text-ink-100 hover:bg-ink-800"
            >
              Jump to results
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-accent px-5 py-2.5 font-medium text-accent hover:bg-accent/10"
            >
              Try the live demo
            </Link>
          </div>
        </div>
      </section>

      {/* Headline metrics */}
      <section className="section pt-0">
        <h2 className="h2 mb-2">The shortcut, in one screen</h2>
        <p className="text-ink-400 mb-6 max-w-3xl">
          The model looks excellent on average — but the gap to worst-group
          accuracy and the dramatic effect of intervening on the image make the
          shortcut undeniable.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Overall test accuracy"
            value={pct(testMetrics.overall_accuracy)}
            tone="good"
            hint="ResNet18, balanced test split"
          />
          <MetricCard
            label="Worst-group accuracy"
            value={pct(testMetrics.worst_group_accuracy)}
            tone="bad"
            hint="Waterbird on land · the conflict case"
          />
          <MetricCard
            label="Accuracy after foreground mask"
            value={fgMask ? pct(fgMask.accuracy) : "—"}
            tone="warn"
            hint={
              fgMask
                ? `${pct(fgMask.prediction_flip_rate)} of predictions flip`
                : ""
            }
          />
          <MetricCard
            label="Accuracy after background mask"
            value={bgMask ? pct(bgMask.accuracy) : "—"}
            tone="good"
            hint="Removing the background helps — bias confirmed"
          />
        </div>
      </section>

      {/* Pipeline */}
      <section className="section pt-0">
        <h2 className="h2 mb-2">The pipeline</h2>
        <p className="text-ink-400 mb-6 max-w-3xl">
          Following the project brief: train, evaluate by subgroup, run
          Grad-CAM, score foreground vs. background attention, intervene at
          inference time, then compare classification and saliency-based
          metrics.
        </p>
        <PipelineDiagram />
      </section>

      {/* Section index */}
      <section className="section pt-0">
        <h2 className="h2 mb-2">Browse the project</h2>
        <p className="text-ink-400 mb-6 max-w-3xl">
          Ten sections walk through the project end-to-end, plus a code
          walkthrough and a live demo.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="card hover:border-accent hover:bg-ink-900/80 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs text-ink-400">
                {s.number && <span className="font-mono text-accent">{s.number}</span>}
                <span>{s.shortTitle}</span>
              </div>
              <div className="mt-1 text-ink-100 font-semibold">{s.title}</div>
              <div className="mt-2 text-sm text-ink-400">{s.blurb}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
