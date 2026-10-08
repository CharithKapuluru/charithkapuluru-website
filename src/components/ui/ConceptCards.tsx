import { iconFor, type IconName } from "./icons";

interface ConceptCard {
  icon: IconName;
  name: string;
  phase: number;
}

const concepts: ConceptCard[] = [
  { icon: "code", name: "Python", phase: 1 },
  { icon: "lightning", name: "FastAPI", phase: 1 },
  { icon: "flask", name: "Pytest", phase: 2 },
  { icon: "broom", name: "Ruff", phase: 3 },
  { icon: "package", name: "Docker", phase: 4 },
  { icon: "gear", name: "GitHub Actions", phase: 5 },
  { icon: "lock", name: "Semgrep", phase: 6 },
  { icon: "shield-check", name: "Trivy", phase: 7 },
];

export default function ConceptCards({ onCardClick }: { onCardClick?: (phase: number) => void }) {
  return (
    <div className="my-12">
      <h3 className="text-h3 text-fg">Tech stack</h3>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {concepts.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => onCardClick?.(c.phase)}
            className="flex flex-col items-center justify-center gap-2 rounded-md border border-border bg-surface p-4 text-fg-2 transition-colors duration-150 hover:border-fg-3 hover:text-fg"
          >
            {iconFor(c.icon, { size: 24 })}
            <span className="font-mono text-caption text-fg">{c.name}</span>
            <span className="text-caption text-fg-3">Phase {c.phase}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
