"use client";

interface ComparisonRow {
  before: string;
  after: string;
}

interface BeforeAfterComparisonProps {
  title?: string;
  rows: ComparisonRow[];
}

const BeforeAfterComparison = ({ title, rows }: BeforeAfterComparisonProps) => {
  return (
    <div className="my-8 overflow-hidden rounded-lg border border-text-charcoal/10">
      {title && (
        <div className="bg-bg-cream px-6 py-3 border-b border-text-charcoal/10">
          <h4 className="font-serif text-lg text-text-charcoal">{title}</h4>
        </div>
      )}

      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="grid grid-cols-2">
          {/* Headers */}
          <div className="bg-red-50 px-6 py-4 border-b border-r border-text-charcoal/10">
            <h5 className="font-mono text-sm uppercase tracking-wider text-red-700 font-medium">
              ❌ Basic Student Project
            </h5>
          </div>
          <div className="bg-green-50 px-6 py-4 border-b border-text-charcoal/10">
            <h5 className="font-mono text-sm uppercase tracking-wider text-green-700 font-medium">
              ✅ Production-Ready Project
            </h5>
          </div>

          {/* Rows */}
          {rows.map((row, index) => (
            <div key={index} className="contents">
              <div
                className={`px-6 py-4 border-r border-text-charcoal/10 ${
                  index % 2 === 0 ? "bg-white" : "bg-bg-paper"
                } ${index < rows.length - 1 ? "border-b border-text-charcoal/5" : ""}`}
              >
                <p className="text-text-taupe flex items-start gap-2">
                  <span className="text-red-500 flex-shrink-0">✗</span>
                  {row.before}
                </p>
              </div>
              <div
                className={`px-6 py-4 ${
                  index % 2 === 0 ? "bg-white" : "bg-bg-paper"
                } ${index < rows.length - 1 ? "border-b border-text-charcoal/5" : ""}`}
              >
                <p className="text-text-taupe flex items-start gap-2">
                  <span className="text-green-500 flex-shrink-0">✓</span>
                  {row.after}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile view - stacked */}
      <div className="md:hidden">
        {rows.map((row, index) => (
          <div
            key={index}
            className={`${index < rows.length - 1 ? "border-b border-text-charcoal/10" : ""}`}
          >
            <div className="bg-red-50 px-4 py-3">
              <p className="text-sm text-text-taupe flex items-start gap-2">
                <span className="text-red-500 flex-shrink-0">✗</span>
                {row.before}
              </p>
            </div>
            <div className="bg-green-50 px-4 py-3">
              <p className="text-sm text-text-taupe flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                {row.after}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BeforeAfterComparison;
