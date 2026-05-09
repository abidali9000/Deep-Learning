import Image from "next/image";
import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { GitHubLink } from "@/components/GitHubLink";
import {
  GROUP_LABEL,
  CONDITION_LABEL,
  gradCamGroupSummary,
  interventionOverall,
  interventionSubgroup,
  pct,
  testMetrics,
  trainHistory,
} from "@/lib/results";
import { GALLERY } from "@/lib/gallery";

export default function ReportPage() {
  const fg = interventionOverall.find((r) => r.condition === "foreground_mask");
  const bg = interventionOverall.find((r) => r.condition === "background_mask");
  const original = interventionOverall.find((r) => r.condition === "original");
  return (
    <article className="mx-auto max-w-4xl px-6 py-10 prose-academic">
      <div className="no-print mb-6 flex items-center justify-between gap-3">
        <Link href="/" className="text-sm text-ink-400 hover:text-ink-100">
          ← Back to website
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm text-ink-400">
            Use your browser's print dialog → "Save as PDF".
          </span>
          <PrintButton />
        </div>
      </div>

      {/* Title block */}
      <header className="mb-10">
        <div className="text-xs uppercase tracking-widest text-accent">
          Project 18 · Advanced Deep Learning
        </div>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
          Saliency-based Analysis of Shortcut Learning in CNNs
        </h1>
        <p className="mt-3 text-ink-400">
          A printable summary generated from <code>outputs/</code>. Repository:{" "}
          <GitHubLink path="" label="abidali9000/Deep-Learning" />
        </p>
      </header>

      <Section title="1. Abstract">
        <p>
          We train a ResNet18 on the Waterbirds dataset, where background and
          bird type are spuriously correlated, and use Grad-CAM together with a
          foreground / background attention-bias score to test whether the
          model relies on background cues. The CNN reaches{" "}
          <strong>{pct(testMetrics.overall_accuracy)}</strong> overall
          accuracy on the balanced test split but only{" "}
          <strong>{pct(testMetrics.worst_group_accuracy)}</strong> on the
          worst (waterbird-on-land) subgroup. Four inference-time interventions
          provide direct causal evidence that background cues drive predictions
          on the conflict subgroups: foreground masking flips{" "}
          <strong>{fg ? pct(fg.prediction_flip_rate) : ""}</strong> of
          predictions, and background masking actually <em>raises</em> overall
          accuracy to <strong>{bg ? pct(bg.accuracy) : ""}</strong>. We
          conclude that the model has partially internalised the shortcut
          background → bird type.
        </p>
      </Section>

      <Section title="2. Method">
        <p>
          The pipeline is implemented in eight Python files inside{" "}
          <code>src/</code> (<GitHubLink path="src/train.py" />,{" "}
          <GitHubLink path="src/evaluate.py" />,{" "}
          <GitHubLink path="src/gradcam_analysis.py" />,{" "}
          <GitHubLink path="src/interventions.py" />, etc.). The full model
          configuration lives in <GitHubLink path="config.yaml" />.
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Backbone: ImageNet-pretrained ResNet18, FC replaced with 2 logits.</li>
          <li>Optim: Adam, lr 1e-4, weight-decay 1e-4, batch 32, 15 epochs, 224×224.</li>
          <li>Best checkpoint by validation worst-group accuracy.</li>
          <li>Grad-CAM target layer: <code>model.layer4[-1]</code>, predicted-class target.</li>
          <li>Foreground heuristic: 60% center crop. Bias score = bg saliency / total.</li>
          <li>
            Interventions: background blur (Gaussian k=31), background mask
            (grey 0.5), background patch shuffle (16×16), foreground mask
            (grey 0.5).
          </li>
        </ul>
      </Section>

      <Section title="3. Test classification metrics">
        <ul className="list-disc pl-5 space-y-0.5">
          <li>Overall accuracy: <strong>{pct(testMetrics.overall_accuracy)}</strong></li>
          <li>Macro precision: <strong>{pct(testMetrics.precision_macro)}</strong></li>
          <li>Macro recall: <strong>{pct(testMetrics.recall_macro)}</strong></li>
          <li>Macro F1: <strong>{pct(testMetrics.f1_macro)}</strong></li>
          <li>Worst-group accuracy: <strong>{pct(testMetrics.worst_group_accuracy)}</strong></li>
        </ul>

        <h3 className="mt-4 font-semibold">Subgroup metrics</h3>
        <table className="results-table">
          <thead>
            <tr>
              <th>Subgroup</th>
              <th>Count</th>
              <th>Accuracy</th>
              <th>Avg confidence</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(testMetrics.subgroup_metrics).map(([k, v]) => (
              <tr key={k}>
                <td>{GROUP_LABEL[k] ?? k}</td>
                <td>{v.count}</td>
                <td>{pct(v.accuracy)}</td>
                <td>{pct(v.avg_confidence)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Image
            src="/figures/test_confusion_matrix.png"
            alt="Confusion matrix"
            width={800}
            height={600}
            className="rounded border bg-white"
            unoptimized
          />
        </div>
      </Section>

      <Section title="4. Training history (selected epochs)">
        <table className="results-table">
          <thead>
            <tr>
              <th>Epoch</th>
              <th>Train acc</th>
              <th>Val acc</th>
              <th>Worst-group acc</th>
              <th>WB-land</th>
              <th>LB-water</th>
            </tr>
          </thead>
          <tbody>
            {trainHistory
              .filter((_, i) => i % 2 === 0 || i === trainHistory.length - 1)
              .map((r) => (
                <tr key={r.epoch}>
                  <td>{r.epoch}</td>
                  <td>{pct(r.train_acc)}</td>
                  <td>{pct(r.val_acc)}</td>
                  <td>{pct(r.val_worst_group_acc)}</td>
                  <td>{pct(r.val_acc_waterbird_land)}</td>
                  <td>{pct(r.val_acc_landbird_water)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Section>

      <Section title="5. Grad-CAM saliency by subgroup">
        <table className="results-table">
          <thead>
            <tr>
              <th>Subgroup</th>
              <th>Foreground</th>
              <th>Background (bias)</th>
              <th>Sample acc.</th>
            </tr>
          </thead>
          <tbody>
            {gradCamGroupSummary.map((g) => (
              <tr key={g.group_name}>
                <td>{GROUP_LABEL[g.group_name] ?? g.group_name}</td>
                <td>{pct(g.foreground_ratio)}</td>
                <td>{pct(g.background_ratio)}</td>
                <td>{pct(g.correct)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="mt-4 font-semibold">Representative shortcut failures</h3>
        <div className="grid grid-cols-1 gap-3">
          {GALLERY.filter((g) => !g.correct)
            .slice(0, 3)
            .map((g) => (
              <Image
                key={g.file}
                src={`/gradcam/${g.file}`}
                alt={g.caption}
                width={1200}
                height={400}
                className="rounded border bg-white"
                unoptimized
              />
            ))}
        </div>
      </Section>

      <Section title="6. Intervention results">
        <table className="results-table">
          <thead>
            <tr>
              <th>Condition</th>
              <th>Accuracy</th>
              <th>Flip rate</th>
              <th>Avg BG saliency</th>
            </tr>
          </thead>
          <tbody>
            {interventionOverall.map((r) => (
              <tr key={r.condition}>
                <td>{CONDITION_LABEL[r.condition] ?? r.condition}</td>
                <td>{pct(r.accuracy)}</td>
                <td>{pct(r.prediction_flip_rate)}</td>
                <td>{pct(r.avg_background_ratio)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Image
            src="/figures/intervention_accuracy.png"
            alt="Accuracy by intervention"
            width={1000}
            height={500}
            className="rounded border bg-white"
            unoptimized
          />
          <Image
            src="/figures/intervention_background_saliency.png"
            alt="Background saliency by intervention"
            width={1000}
            height={500}
            className="rounded border bg-white"
            unoptimized
          />
        </div>

        <h3 className="mt-4 font-semibold">Per subgroup × condition (selected)</h3>
        <table className="results-table">
          <thead>
            <tr>
              <th>Condition</th>
              <th>Subgroup</th>
              <th>Acc</th>
              <th>Flip</th>
              <th>BG sal.</th>
            </tr>
          </thead>
          <tbody>
            {interventionSubgroup
              .filter(
                (r) =>
                  r.group_name === "waterbird-land" ||
                  r.group_name === "landbird-water",
              )
              .map((r, i) => (
                <tr key={i}>
                  <td>{CONDITION_LABEL[r.condition] ?? r.condition}</td>
                  <td>{GROUP_LABEL[r.group_name] ?? r.group_name}</td>
                  <td>{pct(r.accuracy)}</td>
                  <td>{pct(r.prediction_flip_rate)}</td>
                  <td>{pct(r.avg_background_ratio)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Section>

      <Section title="7. Conclusion">
        <p>
          The CNN's overall accuracy hides a {pct(
            (original?.accuracy ?? testMetrics.overall_accuracy) -
              testMetrics.worst_group_accuracy,
          )}{" "}
          gap to its worst subgroup. Saliency analysis shows the model's
          attention drifts onto the background, and inference-time
          interventions confirm a causal role for the background:
          foreground-mask collapses accuracy to{" "}
          <strong>{fg ? pct(fg.accuracy) : ""}</strong> with{" "}
          <strong>{fg ? pct(fg.prediction_flip_rate) : ""}</strong> flips,
          while background-mask raises overall accuracy to{" "}
          <strong>{bg ? pct(bg.accuracy) : ""}</strong>. This is consistent
          with shortcut learning: the model uses the bird, but it also relies
          on the background to a degree that hurts minority-subgroup
          generalisation.
        </p>
      </Section>

      <Section title="8. References">
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          <li>Sagawa et al., 2019. Distributionally Robust Neural Networks for Group Shifts. arXiv:1911.08731.</li>
          <li>Geirhos et al., 2020. Shortcut Learning in Deep Neural Networks. Nature MI.</li>
          <li>Selvaraju et al., 2017. Grad-CAM. ICCV.</li>
          <li>Wah et al., 2011. CUB-200-2011 Dataset.</li>
          <li>Zhou et al., 2017. Places: A 10M Image Database for Scene Recognition.</li>
        </ol>
      </Section>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10 page-break-avoid">
      <h2 className="text-2xl font-semibold tracking-tight mb-3">{title}</h2>
      {children}
    </section>
  );
}
