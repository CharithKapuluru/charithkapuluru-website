"use client";

interface DifficultyIndicatorProps {
  readingTime: number; // in minutes
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  handsOn: boolean;
  prerequisites?: string;
}

const DifficultyIndicator = ({
  readingTime,
  difficulty,
  handsOn,
  prerequisites,
}: DifficultyIndicatorProps) => {
  const difficultyColors = {
    Beginner: "text-green-600 bg-green-50",
    Intermediate: "text-amber-600 bg-amber-50",
    Advanced: "text-red-600 bg-red-50",
  };

  return (
    <div className="flex flex-wrap gap-4 md:gap-6 py-4 px-5 bg-bg-cream/50 rounded-lg border border-text-charcoal/10 mb-8">
      {/* Reading Time */}
      <div className="flex items-center gap-2">
        <span className="text-lg">⏱️</span>
        <div>
          <span className="text-xs font-mono text-text-olive uppercase tracking-wider block">
            Reading
          </span>
          <span className="text-sm text-text-charcoal font-medium">
            {readingTime} mins
          </span>
        </div>
      </div>

      {/* Difficulty */}
      <div className="flex items-center gap-2">
        <span className="text-lg">📊</span>
        <div>
          <span className="text-xs font-mono text-text-olive uppercase tracking-wider block">
            Difficulty
          </span>
          <span
            className={`text-sm font-medium px-2 py-0.5 rounded ${difficultyColors[difficulty]}`}
          >
            {difficulty}
          </span>
        </div>
      </div>

      {/* Hands-on */}
      <div className="flex items-center gap-2">
        <span className="text-lg">🔧</span>
        <div>
          <span className="text-xs font-mono text-text-olive uppercase tracking-wider block">
            Hands-on
          </span>
          <span className="text-sm text-text-charcoal font-medium">
            {handsOn ? "Yes" : "No"}
          </span>
        </div>
      </div>

      {/* Prerequisites */}
      {prerequisites && (
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <div>
            <span className="text-xs font-mono text-text-olive uppercase tracking-wider block">
              Prerequisites
            </span>
            <span className="text-sm text-text-charcoal font-medium">
              {prerequisites}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DifficultyIndicator;
