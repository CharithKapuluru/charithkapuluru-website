"use client";

interface ConceptCard {
  icon: string;
  name: string;
  phase: number;
}

const concepts: ConceptCard[] = [
  { icon: "🐍", name: "Python", phase: 1 },
  { icon: "⚡", name: "FastAPI", phase: 1 },
  { icon: "🧪", name: "Pytest", phase: 2 },
  { icon: "🧹", name: "Ruff", phase: 3 },
  { icon: "🐳", name: "Docker", phase: 4 },
  { icon: "⚙️", name: "GitHub Actions", phase: 5 },
  { icon: "🔒", name: "Semgrep", phase: 6 },
  { icon: "🛡️", name: "Trivy", phase: 7 },
];

interface ConceptCardsProps {
  onCardClick?: (phase: number) => void;
}

const ConceptCards = ({ onCardClick }: ConceptCardsProps) => {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-serif text-text-charcoal mb-6">Tech Stack</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {concepts.map((concept) => (
          <button
            key={concept.name}
            onClick={() => onCardClick?.(concept.phase)}
            className="group flex flex-col items-center justify-center p-4 bg-bg-cream rounded-lg border border-text-charcoal/10 hover:border-accent-moss/30 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
              {concept.icon}
            </span>
            <span className="text-sm font-mono text-text-charcoal">
              {concept.name}
            </span>
            <span className="text-xs text-text-olive mt-1">Phase {concept.phase}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConceptCards;
