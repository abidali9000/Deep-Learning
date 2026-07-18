import { SectionHeader } from "@/components/SectionHeader";
import { GitHubLink } from "@/components/GitHubLink";

const HF_SPACE_URL = process.env.NEXT_PUBLIC_HF_SPACE_URL ?? "";
const HF_EMBED_URL = HF_SPACE_URL ? `${HF_SPACE_URL}?embed=true` : "";

export default function DemoPage() {
  return (
    <article className="section prose-academic">
      <SectionHeader
        eyebrow="Live demo"
        title="Run the model on your own image"
        lead="The trained ResNet18 runs on a Hugging Face Space, embedded below. Upload a bird image to see the prediction, the Grad-CAM map, and the foreground / background attention-bias score."
        sourceFiles={[{ path: "huggingface_space/app.py" }]}
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

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="h3 mb-2">What it reports</h3>
          <ul className="list-disc pl-5 space-y-1 text-ink-300 text-sm">
            <li>Predicted class and confidence.</li>
            <li>Grad-CAM heatmap over the uploaded image.</li>
            <li>The 60% centre-crop foreground box.</li>
            <li>Foreground / background saliency split.</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="h3 mb-2">Images worth trying</h3>
          <ul className="list-disc pl-5 space-y-1 text-ink-300 text-sm">
            <li>A landbird on grass, and a duck on water.</li>
            <li>A waterbird on a forest background.</li>
            <li>A landbird against strong blue water.</li>
          </ul>
          <p className="mt-2 text-xs text-ink-400">
            The conflict cases are where the background bias tends to surface.
          </p>
        </div>
      </div>
    </article>
  );
}

function SetupInstructions() {
  return (
    <div className="card">
      <h3 className="h3 mb-2">Demo not configured</h3>
      <p className="text-ink-300 mb-2 text-sm">
        Set the <span className="code-chip">NEXT_PUBLIC_HF_SPACE_URL</span>{" "}
        environment variable in Vercel to the Hugging Face Space URL and
        redeploy — the demo will appear here. The Space source is in{" "}
        <GitHubLink path="huggingface_space" label="huggingface_space/" />.
      </p>
    </div>
  );
}
