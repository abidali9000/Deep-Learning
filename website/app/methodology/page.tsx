import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { PipelineDiagram } from "@/components/PipelineDiagram";
import { GitHubLink } from "@/components/GitHubLink";

export default function MethodologyPage() {
  return (
    <article className="section prose-academic">
      <SectionHeader
        eyebrow="03 · Methodology"
        title="The full pipeline"
        lead="Each box below corresponds to one source file in the repo. The website's later sections drill into each step."
        sourceFiles={[
          { path: "run_all.sh" },
          { path: "config.yaml" },
        ]}
      />

      <PipelineDiagram />

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <Step
          n="1"
          title="Data loading"
          file="src/dataset.py"
          body="Wrap the HF grodino/waterbirds split in a torch Dataset that returns (image, label, place, group, idx). Train transforms add a horizontal flip."
        />
        <Step
          n="2"
          title="Model"
          file="src/model.py"
          body="ResNet18 (or ResNet50) initialised with ImageNet weights; final FC replaced with 2 logits."
        />
        <Step
          n="3"
          title="Training"
          file="src/train.py"
          body="Adam, 15 epochs, batch 32, lr 1e-4. Best checkpoint selected by validation worst-group accuracy — a DRO-style criterion that explicitly fights the shortcut."
        />
        <Step
          n="4"
          title="Subgroup evaluation"
          file="src/evaluate.py"
          body="Overall accuracy, macro precision/recall/F1, full confusion matrix, per-subgroup accuracy and confidence, and worst-group accuracy."
        />
        <Step
          n="5"
          title="Grad-CAM analysis"
          file="src/gradcam_analysis.py"
          body="Selvaraju et al. Grad-CAM on layer4[-1]. Up to 30 representative test samples per subgroup. Each sample produces a 3-panel image (original / Grad-CAM overlay / center-crop heuristic)."
        />
        <Step
          n="6"
          title="Foreground / background score"
          file="src/gradcam_analysis.py"
          body="A 60% center crop approximates the foreground. attention_bias_score = sum(saliency outside crop) / total. This is exactly the score requested by the brief."
        />
        <Step
          n="7"
          title="Interventions"
          file="src/interventions.py"
          body="Four inference-time edits — background blur, background mask, background patch shuffle, and foreground mask. We re-run inference + Grad-CAM under each and log accuracy, prediction-flip rate, confidence drop, and saliency."
        />
        <Step
          n="8"
          title="Summary report"
          file="src/report_summary.py"
          body="Aggregates everything into outputs/PROJECT_RESULTS_SUMMARY.md, which this website also reads at build time."
        />
      </div>

      <div className="mt-10 card">
        <h3 className="h3 mb-2">Reproducing it</h3>
        <pre className="rounded-lg bg-ink-950 p-4 text-sm overflow-x-auto text-ink-100">
{`pip install -r requirements.txt
bash run_all.sh    # train -> evaluate -> Grad-CAM -> interventions -> summary`}
        </pre>
        <p className="text-sm text-ink-400 mt-2">
          The full pipeline lives in <GitHubLink path="run_all.sh" />.
        </p>
      </div>

      <Nav />
    </article>
  );
}

function Step({
  n,
  title,
  file,
  body,
}: {
  n: string;
  title: string;
  file: string;
  body: string;
}) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent text-white text-sm font-semibold">
          {n}
        </span>
        <h3 className="h3 m-0">{title}</h3>
      </div>
      <p className="text-ink-300 mb-3">{body}</p>
      <GitHubLink path={file} />
    </div>
  );
}

function Nav() {
  return (
    <div className="mt-10 flex justify-between text-sm">
      <Link href="/dataset" className="text-ink-400 hover:text-ink-100">
        ← Dataset
      </Link>
      <Link href="/training" className="text-accent hover:underline">
        Next: CNN training →
      </Link>
    </div>
  );
}
