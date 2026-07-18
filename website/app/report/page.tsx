import Link from "next/link";

const PDF = "/Shortcut-Learning-Report.pdf";
const DOWNLOAD_NAME = "Anwar-Ali-Shortcut-Learning-Report.pdf";

export default function ReportPage() {
  return (
    <article className="section">
      <div className="eyebrow mb-2">Project report</div>
      <h1 className="h1 mb-3">Saliency-based Analysis of Shortcut Learning in CNNs</h1>
      <p className="lead max-w-3xl">
        The full write-up in the module report format — introduction, model,
        dataset, training procedure, and experimental results.
      </p>
      <p className="mt-3 text-sm text-ink-400">
        Rohma Anwar · Abid Ali — Advanced Deep Learning Module, University of
        Catania (UNICT)
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={PDF}
          download={DOWNLOAD_NAME}
          className="rounded-md bg-accent px-5 py-2.5 font-medium text-white hover:bg-accent-dark"
        >
          Download PDF
        </a>
        <a
          href={PDF}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-ink-700 px-5 py-2.5 font-medium text-ink-100 hover:bg-ink-800"
        >
          Open in new tab
        </a>
        <Link
          href="/results"
          className="text-sm text-ink-400 hover:text-ink-100"
        >
          Back to results →
        </Link>
      </div>

      <div className="mt-8 card p-0 overflow-hidden">
        <object data={PDF} type="application/pdf" className="block w-full" style={{ height: "900px" }}>
          <div className="p-6 text-sm text-ink-300">
            Your browser can&apos;t preview the PDF inline.{" "}
            <a href={PDF} download={DOWNLOAD_NAME} className="text-accent hover:underline">
              Download it instead
            </a>
            .
          </div>
        </object>
      </div>
    </article>
  );
}
