import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { GradCamGallery } from "@/components/GradCamGallery";
import { SaliencyBars } from "@/components/SaliencyBars";
import { GitHubLink } from "@/components/GitHubLink";
import { gradCamGroupSummary, GROUP_LABEL, pct } from "@/lib/results";

export default function GradCamPage() {
  return (
    <article className="section prose-academic">
      <SectionHeader
        eyebrow="06 · Grad-CAM"
        title="What is the model looking at?"
        lead="Grad-CAM (Selvaraju et al. 2017) projects gradient-weighted activations from the last convolutional layer back onto the image. We compute it for the predicted class on a balanced sample of the test set — 30 images per subgroup."
        sourceFiles={[
          { path: "src/gradcam_analysis.py" },
          { path: "outputs/gradcam/gradcam_results.csv" },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <SaliencyBars data={gradCamGroupSummary} />
        <div className="card">
          <h3 className="h3 mb-2">Per-subgroup attention bias</h3>
          <table className="results-table">
            <thead>
              <tr>
                <th>Subgroup</th>
                <th className="text-right">Foreground</th>
                <th className="text-right">Background (bias)</th>
                <th className="text-right">Acc</th>
              </tr>
            </thead>
            <tbody>
              {gradCamGroupSummary.map((g) => (
                <tr key={g.group_name}>
                  <td>{GROUP_LABEL[g.group_name] ?? g.group_name}</td>
                  <td className="text-right tabular-nums text-emerald-300">
                    {pct(g.foreground_ratio)}
                  </td>
                  <td className="text-right tabular-nums text-rose-300">
                    {pct(g.background_ratio)}
                  </td>
                  <td className="text-right tabular-nums">{pct(g.correct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm text-ink-400 mt-3">
            Even when correct, ~30–48% of the model's attention falls outside
            the bird in the center crop. The two majority groups carry the
            highest "background" share — exactly the failure mode the brief
            asks us to detect.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="h2 mb-1">Visual gallery</h2>
        <p className="text-ink-400 max-w-3xl">
          Each image is a three-panel plate produced by{" "}
          <GitHubLink path="src/gradcam_analysis.py" />: the original image,
          the Grad-CAM overlay for the predicted class, and the white box
          showing the 60% center crop used as the foreground heuristic.
          Shortcut failures are highlighted in red.
        </p>
      </div>

      <GradCamGallery />

      <div className="mt-10 card">
        <h3 className="h3 mb-2">Caveat: the heuristic is coarse</h3>
        <p>
          Birds are not always perfectly centered, so the 60% center crop is a
          coarse foreground proxy. We discuss this honestly in{" "}
          <Link href="/limitations" className="text-accent hover:underline">
            Limitations
          </Link>
          . What matters here is the <em>relative</em> change in background
          attention across subgroups and across interventions.
        </p>
      </div>

      <Nav />
    </article>
  );
}

function Nav() {
  return (
    <div className="mt-10 flex justify-between text-sm">
      <Link href="/evaluation" className="text-ink-400 hover:text-ink-100">
        ← Evaluation
      </Link>
      <Link href="/interventions" className="text-accent hover:underline">
        Next: Interventions →
      </Link>
    </div>
  );
}
