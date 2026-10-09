import type { ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type CalloutTone = "tip" | "info" | "success" | "danger" | "neutral";

const tones: Record<CalloutTone, { wrap: string; icon: string }> = {
  tip: { wrap: "border-l-tip bg-tip-soft", icon: "text-tip" },
  info: { wrap: "border-l-info bg-info-soft", icon: "text-info" },
  success: { wrap: "border-l-success bg-success-soft", icon: "text-success" },
  danger: { wrap: "border-l-danger bg-danger-soft", icon: "text-danger" },
  neutral: { wrap: "border-l-border-strong bg-surface-2", icon: "text-fg-2" },
};

export default function Callout({
  tone = "neutral",
  icon: IconCmp,
  label,
  children,
  className,
}: {
  tone?: CalloutTone;
  icon: Icon;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const t = tones[tone];
  return (
    <aside className={cn("my-8 rounded-md border-l-2 py-4 pl-5 pr-5", t.wrap, className)}>
      <div className="mb-2 flex items-center gap-2">
        <IconCmp size={18} weight="regular" className={t.icon} aria-hidden />
        <span className="text-caption font-medium text-fg-2">{label}</span>
      </div>
      <div className="leading-relaxed text-fg-2 [&_code]:text-fg [&_strong]:text-fg">{children}</div>
    </aside>
  );
}
