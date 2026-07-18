import Image from "next/image";
import Link from "next/link";
import { MetricCard } from "@/components/MetricCard";
import { PipelineDiagram } from "@/components/PipelineDiagram";
import { interventionOverall, pct, testMetrics } from "@/lib/results";

const HERO_IMAGE =
  "idx20_group-waterbird-land_true-waterbird_pred-landbird.png";

export default function HomePage() {
  const fgMask = interventionOverall.find(
    (r) => r.condition === "foreground_mask",
  );
  const bgMask = interventionOverall.find(
    (r) => r.condition === "background_mask",
  );
  const gap =
    testMetrics.overall_accuracy - testMetrics.worst_group_accuracy;

  return (
    <>
      <section className="section pb-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <div className="eyebrow mb-3">Project 18 · Advanced Deep Learning</div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink-50">
              Saliency-based Analysis of Shortcut Learning in CNNs
            </h1>
            <p className="lead mt-5 max-w-2xl">
              A ResNet18 trained on the Waterbirds dataset reaches{" "}
              {pct(testMetrics.overall_accuracy, 0)} accuracy overall but only{" "}
              {pct(testMetrics.worst_group_accuracy, 0)} on its worst subgroup.
              We use Grad-CAM and inference-time interventions to show that the
              gap comes from the model relying on the background rather than the
              bird.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/method"
                className="rounded-md bg-accent px-5 py-2.5 font-medium text-white hover:bg-accent-dark"
              >
                Read the method
              </Link>
              <Link
                href="/results"
                className="rounded-md border border-ink-700 px-5 py-2.5 font-medium text-ink-100 hover:bg-ink-800"
              >
                See the results
              </Link>
            </div>
          </div>

          <figure className="card p-3">
            <div className="relative w-full" style={{ aspectRatio: "12/4" }}>
              <Image
                src={`/gradcam/${HERO_IMAGE}`}
                alt="Grad-CAM for a waterbird on land that the model misclassifies as a landbird."
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
                unoptimized
              />
            </div>
            <figcaption className="mt-3 text-sm text-ink-400">
              A waterbird photographed on land. The model predicts{" "}
              <span className="text-rose-300">landbird</span> — its Grad-CAM
              attention sits on the land background, not the bird.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section pt-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Overall test accuracy"
            value={pct(testMetrics.overall_accuracy, 1)}
            tone="good"
            hint="Balanced test split"
          />
          <MetricCard
            label="Worst-group accuracy"
            value={pct(testMetrics.worst_group_accuracy, 1)}
            tone="bad"
            hint="Waterbird on land"
          />
          <MetricCard
            label="Overall − worst-group gap"
            value={pct(gap, 1)}
            tone="warn"
            hint="Hidden by the headline number"
          />
          <MetricCard
            label="Accuracy after background mask"
            value={bgMask ? pct(bgMask.accuracy, 1) : "—"}
            tone="good"
            hint="Removing the background helps"
          />
        </div>
      </section>

      <section className="section pt-0">
        <h2 className="h2 mb-2">Pipeline</h2>
        <p className="text-ink-400 mb-6 max-w-2xl">
          Train, evaluate by subgroup, run Grad-CAM, score foreground vs.
          background attention, intervene at inference time, then compare.
        </p>
        <PipelineDiagram />
      </section>

      <section className="section pt-0">
        <div className="grid gap-4 md:grid-cols-3">
          <NavCard
            href="/method"
            title="Method"
            body="Dataset bias, training setup, and how the saliency and intervention experiments are defined."
          />
          <NavCard
            href="/results"
            title="Results"
            body="Subgroup accuracy, confusion matrix, Grad-CAM gallery, and the four intervention experiments."
          />
          <NavCard
            href="/demo"
            title="Live demo"
            body="Upload a bird image and see the prediction, Grad-CAM, and background-bias score."
          />
        </div>
      </section>
    </>
  );
}

function NavCard({
  href,
  title,
  body,
}: {
  href: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="card transition-colors hover:border-accent hover:bg-ink-900/80"
    >
      <div className="text-ink-50 font-semibold">{title}</div>
      <div className="mt-2 text-sm text-ink-400">{body}</div>
      <div className="mt-4 text-sm text-accent">Open →</div>
    </Link>
  );
}
