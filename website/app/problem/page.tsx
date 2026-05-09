import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";

export default function ProblemPage() {
  return (
    <article className="section prose-academic">
      <SectionHeader
        eyebrow="01 · Problem & motivation"
        title="What is shortcut learning, and why does it matter?"
        lead="Deep neural networks frequently solve a task using superficial cues that happen to correlate with the label in the training set, instead of the features humans would use. These shortcuts can hide behind very high average accuracy and only fail when the spurious correlation breaks."
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="h3 mb-2">A working definition</h3>
          <p>
            Geirhos et al. (2020) describe a <em>shortcut</em> as a decision
            rule that performs well on standard benchmarks but transfers poorly
            because it relies on features that are predictive in the training
            distribution but not causally related to the target.
          </p>
          <p className="mt-3">
            On Waterbirds the most obvious candidate shortcut is{" "}
            <span className="code-chip">background → bird type</span>: in
            training, water is almost always paired with waterbirds and land
            with landbirds. A model that learns this rule looks great on the
            i.i.d. validation split but breaks when the test set deliberately
            reverses the correlation.
          </p>
        </div>
        <div className="card">
          <h3 className="h3 mb-2">Why this is more than a curiosity</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Reliability:</strong> spurious-feature reliance produces
              silent failures on minority subgroups (Sagawa et al. 2019).
            </li>
            <li>
              <strong>Fairness:</strong> when subgroups correlate with
              protected attributes, average metrics mask discriminatory
              behaviour.
            </li>
            <li>
              <strong>Generalisation:</strong> high test accuracy is no longer
              evidence that the model is solving the intended task.
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 card">
        <h3 className="h3 mb-2">What this project investigates</h3>
        <p>
          Following the project brief, we ask three concrete questions:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-3">
          <li>
            Does standard accuracy hide subgroup failures on a CNN trained on
            the biased Waterbirds split?
          </li>
          <li>
            When the model gets the right answer, is it actually looking at the
            bird, or at the background? We measure this with Grad-CAM and a
            simple foreground/background <em>attention-bias score</em>.
          </li>
          <li>
            If we intervene on the image — blur or mask the background, mask
            the foreground, shuffle background patches — how do classification
            and saliency change? Causal evidence of shortcut reliance.
          </li>
        </ol>
        <p className="mt-3 text-ink-400 text-sm">
          References:{" "}
          <Link href="/references" className="text-accent hover:underline">
            Sagawa et al. 2019 · Geirhos et al. 2020 · Selvaraju et al. 2017
          </Link>
        </p>
      </div>

      <Nav />
    </article>
  );
}

function Nav() {
  return (
    <div className="mt-10 flex justify-between text-sm">
      <Link href="/" className="text-ink-400 hover:text-ink-100">
        ← Home
      </Link>
      <Link href="/dataset" className="text-accent hover:underline">
        Next: Waterbirds dataset bias →
      </Link>
    </div>
  );
}
