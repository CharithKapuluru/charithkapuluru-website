import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TagTone = "neutral" | "tip" | "info" | "success" | "danger";

const tones: Record<TagTone, string> = {
  neutral: "border-border bg-surface-2 text-fg-2",
  tip: "border-tip/30 bg-tip-soft text-fg",
  info: "border-info/30 bg-info-soft text-fg",
  success: "border-success/30 bg-success-soft text-fg",
  danger: "border-danger/30 bg-danger-soft text-fg",
};

export default function Tag({
  children,
  tone = "neutral",
  mono = true,
  className,
}: {
  children: ReactNode;
  tone?: TagTone;
  mono?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-sm border px-2 py-0.5 text-caption", mono && "font-mono", tones[tone], className)}>
      {children}
    </span>
  );
}
