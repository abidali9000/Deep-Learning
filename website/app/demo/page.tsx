import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { GitHubLink } from "@/components/GitHubLink";

// Set this to your real Hugging Face Space URL once it is created.
// Example: "https://huggingface.co/spaces/abidali90/waterbirds-shortcut".
// If empty, the page shows deploy instructions instead of an iframe.
const HF_SPACE_URL = process.env.NEXT_PUBLIC_HF_SPACE_URL ?? "";
const HF_EMBED_URL = HF_SPACE_URL ? `${HF_SPACE_URL}?embed=true` : "";

export default function DemoPage() {
  return (
    <article className="section prose-academic">
      <SectionHeader
        eyebrow="Live demo"
        title="Upload a bird photo, watch the model decide"
        lead="The trained ResNet18 checkpoint is too large to ship with this static site, so the live demo runs on a free Hugging Face Space and is embedded below."
      />

      {HF_EMBED_URL ? (
        <div className="card overflow-hidden p-0">
          <iframe
            src={HF_EMBED_URL}
            title="Waterbirds shortcut demo"
            className="block w-full"
            style={{ height: "780px", border: 0 }}
            allow="camera; microphone; clipboard-read; clipboard-write"
          />
        </div>
      ) : (
        <SetupInstructions />
      )}

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="h3 mb-2">What the demo shows</h3>
          <ul className="list-disc pl-5 space-y-1 text-ink-300 text-sm">
            <li>Predicted class (landbird vs. waterbird) and confidence.</li>
            <li>The Grad-CAM heatmap overlaid on the uploaded image.</li>
            <li>The 60% center-crop foreground heuristic as a white box.</li>
            <li>The foreground / background saliency split (= attention bias).</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="h3 mb-2">Helpful test images</h3>
          <p className="text-sm text-ink-300">
            For the most informative demo, try:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-ink-300 text-sm mt-2">
            <li>A photo of a landbird perched on grass.</li>
            <li>A photo of a duck on water.</li>
            <li>A waterbird photoshopped onto a forest background.</li>
            <li>A landbird with a strong blue background — to surface the shortcut.</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex justify-between text-sm">
        <Link href="/code-walkthrough" className="text-ink-400 hover:text-ink-100">
          ← Code walkthrough
        </Link>
        <Link href="/references" className="text-accent hover:underline">
          References →
        </Link>
      </div>
    </article>
  );
}

function SetupInstructions() {
  return (
    <div className="card">
      <h3 className="h3 mb-2">Deploying the demo (one-time, ~10 minutes)</h3>
      <p className="text-ink-300 mb-4">
        The Space lives in{" "}
        <GitHubLink path="huggingface_space" label="huggingface_space/" /> in
        this repo. Follow these steps once, then set the{" "}
        <span className="code-chip">NEXT_PUBLIC_HF_SPACE_URL</span> environment
        variable in Vercel and redeploy — the iframe will appear above.
      </p>
      <ol className="list-decimal pl-5 space-y-3 text-ink-300">
        <li>
          Create a new Space at{" "}
          <a
            href="https://huggingface.co/new-space"
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            huggingface.co/new-space
          </a>{" "}
          (SDK: <span className="code-chip">Gradio</span>, hardware: free CPU).
        </li>
        <li>
          Clone it locally and copy the contents of{" "}
          <span className="code-chip">huggingface_space/</span> into the Space
          repo.
        </li>
        <li>
          Add your trained checkpoint via Git LFS:
          <pre className="mt-2 rounded-lg bg-ink-950 p-3 text-xs overflow-x-auto text-ink-100">
{`git lfs install
git lfs track "*.pt"
cp /path/to/Deep-Learning/outputs/checkpoints/best_model.pt .
git add .gitattributes best_model.pt app.py requirements.txt README.md
git commit -m "Initial Waterbirds shortcut demo"
git push`}
          </pre>
        </li>
        <li>
          Wait for the build (~3 min). Open the Space — you can already upload
          images.
        </li>
        <li>
          On Vercel, set{" "}
          <span className="code-chip">
            NEXT_PUBLIC_HF_SPACE_URL=https://huggingface.co/spaces/&lt;you&gt;/&lt;name&gt;
          </span>{" "}
          and redeploy. This page will embed the Space automatically.
        </li>
      </ol>
      <p className="text-xs text-ink-400 mt-4">
        The trained checkpoint is excluded from this GitHub repository on
        purpose (it would exceed GitHub's regular file limit). The Space is
        the canonical home for the model.
      </p>
    </div>
  );
}
