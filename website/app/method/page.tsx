import { SectionHeader } from "@/components/SectionHeader";
import { TrainingChart } from "@/components/TrainingChart";
import { GROUP_LABEL, testMetrics, trainHistory } from "@/lib/results";

type Cell = {
  group: string;
  bird: string;
  background: string;
  kind: "Majority" | "Conflict";
};

const MATRIX: Cell[] = [
  { group: "waterbird-water", bird: "Waterbird", background: "Water", kind: "Majority" },
  { group: "waterbird-land", bird: "Waterbird", background: "Land", kind: "Conflict" },
  { group: "landbird-water", bird: "Landbird", background: "Water", kind: "Conflict" },
  { group: "landbird-land", bird: "Landbird", background: "Land", kind: "Majority" },
];

export default function MethodPage() {
  return (
    <article className="section prose-academic">
      <SectionHeader
        eyebrow="Method"
        title="Dataset bias, training, and the saliency experiments"
        lead="Waterbirds pairs a bird type with a background that is correlated during training and decorrelated at test time. That design lets us measure whether a CNN learns the bird or the background."
        sourceFiles={[
          { path: "src/dataset.py" },
          { path: "src/train.py" },
          { path: "src/gradcam_analysis.py" },
          { path: "src/interventions.py" },
          { path: "config.yaml" },
        ]}
      />

      <section className="mb-12">
        <h2 className="h2 mb-3">The engineered shortcut</h2>
        <p className="max-w-3xl">
          In the training split, background predicts bird type roughly 95% of
          the time: waterbirds mostly appear on water, landbirds mostly on land.
          The test split breaks that correlation, so a model that has learned
          the background as a proxy for the bird will fail on the two conflict
          groups.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
          {MATRIX.map((c) => {
            const count = testMetrics.subgroup_metrics[c.group]?.count ?? 0;
            const conflict = c.kind === "Conflict";
            return (
              <div
                key={c.group}
                className={`card ${conflict ? "border-rose-500/40" : "border-ink-800"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-ink-100">
                    {c.bird} on {c.background.toLowerCase()}
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold ${
                      conflict
                        ? "bg-rose-500/15 text-rose-300"
                        : "bg-emerald-500/15 text-emerald-300"
                    }`}
                  >
                    {c.kind}
                  </span>
                </div>
                <div className="mt-2 font-mono text-xs text-ink-400">
                  {c.group}
                </div>
                <div className="mt-3 text-sm text-ink-400">
                  {count} test images
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="h2 mb-3">Training setup</h2>
        <ul className="list-disc pl-5 space-y-1.5 max-w-3xl text-ink-300">
          <li>ImageNet-pretrained ResNet18 with the final layer replaced by two logits.</li>
          <li>Adam optimiser, learning rate 1e-4, weight decay 1e-4, batch size 32.</li>
          <li>15 epochs at 224×224, standard ImageNet normalisation.</li>
          <li>
            The checkpoint is selected by validation{" "}
            <strong>worst-group accuracy</strong>, not overall accuracy, so the
            model is judged on the subgroup it handles least well.
          </li>
        </ul>
        <div className="mt-6">
          <TrainingChart data={trainHistory} />
        </div>
      </section>

      <section>
        <h2 className="h2 mb-3">Measuring where the model looks</h2>
        <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
          <div className="card">
            <h3 className="h3 mb-2">Grad-CAM and the bias score</h3>
            <p className="text-sm text-ink-300">
              Grad-CAM produces a class-conditional saliency map from the last
              convolutional block (<code>layer4[-1]</code>). We take a 60% centre
              crop as a foreground proxy and define the attention-bias score as
              the fraction of saliency that falls outside it — i.e. on the
              background.
            </p>
          </div>
          <div className="card">
            <h3 className="h3 mb-2">Inference-time interventions</h3>
            <p className="text-sm text-ink-300">
              We edit each test image and re-run the model to test the
              background's causal role: background blur, background mask (grey),
              background patch shuffle, and foreground mask. If accuracy holds
              when the background changes but collapses when the bird is hidden,
              the model is reading the bird; the opposite pattern indicates a
              shortcut.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
