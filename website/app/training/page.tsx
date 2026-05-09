import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { TrainingChart } from "@/components/TrainingChart";
import { trainHistory } from "@/lib/results";

export default function TrainingPage() {
  const last = trainHistory[trainHistory.length - 1];
  const bestVal = trainHistory.reduce((a, b) => (b.val_acc > a.val_acc ? b : a));
  const bestWorst = trainHistory.reduce((a, b) =>
    b.val_worst_group_acc > a.val_worst_group_acc ? b : a,
  );
  return (
    <article className="section prose-academic">
      <SectionHeader
        eyebrow="04 · CNN training"
        title="Fine-tuning ResNet18 with worst-group selection"
        lead="The model is selected by validation worst-group accuracy, not validation overall accuracy — this is the DRO-style criterion that makes the shortcut harder to ignore. The chart below shows why that matters."
        sourceFiles={[
          { path: "src/train.py" },
          { path: "src/model.py" },
          { path: "config.yaml" },
        ]}
      />

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Stat label="Architecture" value="ResNet18" hint="ImageNet pretrained" />
        <Stat label="Optimizer" value="Adam" hint="lr 1e-4 · wd 1e-4" />
        <Stat label="Epochs" value="15" hint="batch 32 · 224×224" />
      </div>

      <TrainingChart data={trainHistory} />

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <Stat
          label="Best val accuracy"
          value={`${(bestVal.val_acc * 100).toFixed(1)}%`}
          hint={`epoch ${bestVal.epoch}`}
        />
        <Stat
          label="Best val worst-group acc"
          value={`${(bestWorst.val_worst_group_acc * 100).toFixed(1)}%`}
          hint={`epoch ${bestWorst.epoch} · checkpoint kept here`}
        />
        <Stat
          label="Final-epoch train acc"
          value={`${(last.train_acc * 100).toFixed(1)}%`}
          hint="strong fit on biased train split"
        />
      </div>

      <div className="mt-8 card">
        <h3 className="h3 mb-2">Why the chart matters</h3>
        <p>
          The blue line (overall validation accuracy) plateaus around 80–86%.
          The pink line (worst-group accuracy) jumps from 17% to 56% across
          epochs and never catches up. This volatility is the smoking gun:
          the model is learning at different speeds on different subgroups
          because it is leaning on a feature (background) that conflicts with
          the label in the minority groups.
        </p>
        <p className="mt-3">
          By saving the checkpoint at the epoch with the highest{" "}
          <span className="code-chip">val_worst_group_acc</span>, we get the
          fairest available model from this single training run — without
          adding GroupDRO or reweighting (those would be the next step; see{" "}
          <Link href="/limitations" className="text-accent hover:underline">
            Limitations
          </Link>
          ).
        </p>
      </div>

      <Nav />
    </article>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-widest text-ink-400">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-ink-50">{value}</div>
      {hint && <div className="text-sm text-ink-400">{hint}</div>}
    </div>
  );
}

function Nav() {
  return (
    <div className="mt-10 flex justify-between text-sm">
      <Link href="/methodology" className="text-ink-400 hover:text-ink-100">
        ← Methodology
      </Link>
      <Link href="/evaluation" className="text-accent hover:underline">
        Next: Subgroup evaluation →
      </Link>
    </div>
  );
}
