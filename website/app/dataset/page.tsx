import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { GitHubLink } from "@/components/GitHubLink";

const TRAIN = [
  { group: "waterbird-water (majority)", pct: "≈ 95%", color: "#06b6d4" },
  { group: "waterbird-land (minority)", pct: "≈ 5%", color: "#f97316" },
  { group: "landbird-land (majority)", pct: "≈ 95%", color: "#22c55e" },
  { group: "landbird-water (minority)", pct: "≈ 5%", color: "#facc15" },
];
const TEST = [
  { group: "waterbird-water", pct: "50%", color: "#06b6d4" },
  { group: "waterbird-land (conflict)", pct: "50%", color: "#f97316" },
  { group: "landbird-land", pct: "50%", color: "#22c55e" },
  { group: "landbird-water (conflict)", pct: "50%", color: "#facc15" },
];

export default function DatasetPage() {
  return (
    <article className="section prose-academic">
      <SectionHeader
        eyebrow="02 · Waterbirds dataset"
        title="A dataset engineered to expose background bias"
        lead="Waterbirds (Sagawa et al., 2019) crops birds from CUB and pastes them onto land or water backgrounds from Places. The training split makes background highly predictive of bird type; the test split removes that correlation."
        sourceFiles={[
          { path: "src/dataset.py" },
          { path: "config.yaml" },
        ]}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <SplitCard title="Train split (skewed)" rows={TRAIN} />
        <SplitCard title="Test split (balanced)" rows={TEST} />
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="h3 mb-2">Why this design exposes shortcuts</h3>
          <p>
            In the train split, predicting the bird type from the background
            alone would already get ~95% accuracy — so a model that takes that
            shortcut looks perfectly competent during training. In the test
            split, that same shortcut now scores only ~50%, so subgroup
            evaluation surfaces the failure mode immediately.
          </p>
        </div>
        <div className="card">
          <h3 className="h3 mb-2">Subgroup definitions</h3>
          <p className="mb-3">
            We use the four standard subgroups defined in{" "}
            <GitHubLink path="src/utils.py" label="src/utils.py" />:
          </p>
          <ul className="text-sm space-y-1 font-mono">
            <li>0 · waterbird-water</li>
            <li>1 · waterbird-land <span className="text-rose-300">(conflict)</span></li>
            <li>2 · landbird-land</li>
            <li>3 · landbird-water <span className="text-rose-300">(conflict)</span></li>
          </ul>
        </div>
      </div>

      <div className="mt-8 card">
        <h3 className="h3 mb-2">How we load it</h3>
        <p>
          We load the public mirror{" "}
          <a
            href="https://huggingface.co/datasets/grodino/waterbirds"
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            grodino/waterbirds
          </a>{" "}
          via Hugging Face Datasets and wrap it in a small{" "}
          <span className="code-chip">torch.utils.data.Dataset</span> that
          exposes (image tensor, label, place, group, index). All transforms
          are deterministic at evaluation time.
        </p>
      </div>

      <Footer />
    </article>
  );
}

function SplitCard({
  title,
  rows,
}: {
  title: string;
  rows: { group: string; pct: string; color: string }[];
}) {
  return (
    <div className="card">
      <div className="font-medium text-ink-100 mb-3">{title}</div>
      <ul className="space-y-2 text-sm">
        {rows.map((r) => (
          <li key={r.group} className="flex items-center gap-3">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ background: r.color }}
            />
            <span className="flex-1 text-ink-200">{r.group}</span>
            <span className="font-mono text-ink-300">{r.pct}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <div className="mt-10 flex justify-between text-sm">
      <Link href="/problem" className="text-ink-400 hover:text-ink-100">
        ← Problem
      </Link>
      <Link href="/methodology" className="text-accent hover:underline">
        Next: Methodology pipeline →
      </Link>
    </div>
  );
}
