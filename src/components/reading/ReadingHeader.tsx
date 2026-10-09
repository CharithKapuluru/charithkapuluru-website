import type { ReactNode } from "react";

interface ReadingHeaderProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  meta?: { label: string; value: string }[];
  aside?: ReactNode;
}

export default function ReadingHeader({ eyebrow, title, lede, meta, aside }: ReadingHeaderProps) {
  return (
    <header className="mb-10 border-b border-border pb-8 md:mb-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          {eyebrow && <p className="mb-3 text-caption font-medium text-fg-3">{eyebrow}</p>}
          <h1 className="text-display-lg text-fg">{title}</h1>
          {lede && <p className="mt-4 max-w-[60ch] text-lede text-fg-2">{lede}</p>}
          {meta && meta.length > 0 && (
            <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-small text-fg-3">
              {meta.map((m) => (
                <div key={m.label} className="flex gap-1.5">
                  <dt>{m.label}</dt>
                  <dd className="font-medium text-fg-2 tabular">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {aside && <div className="shrink-0 lg:pl-6">{aside}</div>}
      </div>
    </header>
  );
}
