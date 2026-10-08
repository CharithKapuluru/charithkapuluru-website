import type { ReactNode } from "react";

export default function PullQuote({ children, attribution }: { children: ReactNode; attribution?: string }) {
  return (
    <figure className="my-10 border-l-2 border-accent pl-5">
      <blockquote className="font-display text-h3 font-medium text-fg">{children}</blockquote>
      {attribution && <figcaption className="mt-3 text-small text-fg-3">{attribution}</figcaption>}
    </figure>
  );
}
