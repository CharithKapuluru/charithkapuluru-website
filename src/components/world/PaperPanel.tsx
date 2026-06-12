import { ReactNode } from "react";

/** Readable white surface that floats over scene art. */
export default function PaperPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-bg-paper paper-shadow ${className}`}>
      {children}
    </div>
  );
}
