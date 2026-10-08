import { Check, X } from "@phosphor-icons/react/dist/ssr";

interface ComparisonRow {
  before: string;
  after: string;
}

interface BeforeAfterComparisonProps {
  title?: string;
  rows: ComparisonRow[];
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterComparison({
  title,
  rows,
  beforeLabel = "Basic student project",
  afterLabel = "Production-ready project",
}: BeforeAfterComparisonProps) {
  return (
    <div className="my-8 overflow-hidden rounded-lg border border-border">
      {title && <h4 className="border-b border-border bg-surface-2 px-5 py-3 text-body font-medium text-fg">{title}</h4>}
      <div className="grid md:grid-cols-2">
        <div className="hidden items-center gap-2 border-b border-border px-5 py-3 text-caption font-medium text-danger md:flex md:border-r">
          <X size={14} aria-hidden /> {beforeLabel}
        </div>
        <div className="hidden items-center gap-2 border-b border-border px-5 py-3 text-caption font-medium text-success md:flex">
          <Check size={14} aria-hidden /> {afterLabel}
        </div>
        {rows.map((row, i) => (
          <div key={i} className="contents">
            <div className="flex items-start gap-2 border-b border-border px-5 py-3 text-small text-fg-2 md:border-r">
              <X size={16} aria-label={beforeLabel} className="mt-0.5 shrink-0 text-danger" />
              {row.before}
            </div>
            <div className="flex items-start gap-2 border-b border-border px-5 py-3 text-small text-fg-2">
              <Check size={16} aria-label={afterLabel} className="mt-0.5 shrink-0 text-success" />
              {row.after}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
