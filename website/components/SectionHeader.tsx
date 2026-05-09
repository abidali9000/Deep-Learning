import Link from "next/link";
import { GitHubLink } from "./GitHubLink";

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  sourceFiles?: { path: string; label?: string }[];
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
};

export function SectionHeader({
  eyebrow,
  title,
  lead,
  sourceFiles,
  prev,
  next,
}: Props) {
  return (
    <header className="mb-10">
      {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
      <h1 className="h1 mb-4">{title}</h1>
      {lead && <p className="lead max-w-3xl">{lead}</p>}
      {sourceFiles && sourceFiles.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-ink-400 mr-1">Source:</span>
          {sourceFiles.map((f) => (
            <GitHubLink key={f.path} path={f.path} label={f.label} />
          ))}
        </div>
      )}
      {(prev || next) && (
        <div className="mt-6 flex items-center gap-3 text-sm text-ink-400">
          {prev && (
            <Link href={prev.href} className="hover:text-ink-100">
              ← {prev.label}
            </Link>
          )}
          {prev && next && <span>·</span>}
          {next && (
            <Link href={next.href} className="hover:text-ink-100">
              {next.label} →
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
