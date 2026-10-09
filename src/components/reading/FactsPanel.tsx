import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import Tag from "@/components/ui/Tag";

interface FactsPanelProps {
  repo: string;
  stack: string[];
  phaseCount: number;
  estimatedTime: string;
  outcome: string;
}

export default function FactsPanel({ repo, stack, phaseCount, estimatedTime, outcome }: FactsPanelProps) {
  const repoName = repo.replace("https://github.com/", "");
  return (
    <dl className="mb-10 grid gap-5 rounded-lg border border-border bg-surface p-5 sm:grid-cols-2 md:p-6">
      <div className="sm:col-span-2">
        <dt className="text-caption text-fg-3">Repository</dt>
        <dd className="mt-1">
          <a href={repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-small font-medium text-accent hover:text-accent-strong">
            <GithubLogo size={16} weight="regular" aria-hidden />
            {repoName}
            <span className="sr-only"> (opens in a new tab)</span>
            <ArrowUpRight size={14} weight="regular" aria-hidden />
          </a>
        </dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="text-caption text-fg-3">Stack</dt>
        <dd className="mt-1.5 flex flex-wrap gap-1.5">
          {stack.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </dd>
      </div>
      <div>
        <dt className="text-caption text-fg-3">Phases</dt>
        <dd className="mt-1 text-small font-medium text-fg tabular">{phaseCount}</dd>
      </div>
      <div>
        <dt className="text-caption text-fg-3">Estimated time</dt>
        <dd className="mt-1 text-small font-medium text-fg">{estimatedTime}</dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="text-caption text-fg-3">Outcome</dt>
        <dd className="mt-1 text-small text-fg-2">{outcome}</dd>
      </div>
    </dl>
  );
}
