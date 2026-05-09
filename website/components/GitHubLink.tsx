import { ghFile } from "@/lib/github";

type Props = {
  path: string;
  line?: number;
  label?: string;
};

export function GitHubLink({ path, line, label }: Props) {
  return (
    <a
      href={ghFile(path, line)}
      target="_blank"
      rel="noreferrer"
      className="code-chip hover:bg-accent/10 hover:border-accent hover:text-accent transition-colors"
      title={`Open ${path} on GitHub`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5 fill-current"
        aria-hidden="true"
      >
        <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.7-1.4-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A12 12 0 0 0 12 .3z" />
      </svg>
      <span>{label ?? path}</span>
      {line ? <span className="text-ink-400">:L{line}</span> : null}
    </a>
  );
}
