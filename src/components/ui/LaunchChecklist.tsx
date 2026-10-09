import { Check, Code, RocketLaunch, Timer, Warning, Wrench } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

interface LaunchChecklistProps {
  items: { label: string; value: string; icon?: "rocket" | "clock" | "code" | "warning" | "check" | "tool" }[];
  variant?: "default" | "minimal";
}

const icons: Record<NonNullable<LaunchChecklistProps["items"][number]["icon"]>, Icon> = {
  rocket: RocketLaunch,
  clock: Timer,
  code: Code,
  warning: Warning,
  check: Check,
  tool: Wrench,
};

export default function LaunchChecklist({ items, variant = "default" }: LaunchChecklistProps) {
  if (variant === "minimal") {
    return (
      <ul className="my-6 flex flex-wrap gap-2">
        {items.map((item, i) => {
          const IconCmp = icons[item.icon ?? "check"];
          return (
            <li key={i} className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2 text-small">
              <IconCmp size={16} aria-hidden className="text-fg-3" />
              <span className="text-fg-3">{item.label}</span>
              <span className="font-medium text-fg">{item.value}</span>
            </li>
          );
        })}
      </ul>
    );
  }
  return (
    <div className="my-8 rounded-lg border border-border bg-surface-2 p-5">
      <p className="mb-4 text-caption font-medium text-fg-3">Before you start</p>
      <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item, i) => {
          const IconCmp = icons[item.icon ?? "check"];
          return (
            <div key={i}>
              <dt className="flex items-center gap-1.5 text-caption text-fg-3">
                <IconCmp size={14} aria-hidden /> {item.label}
              </dt>
              <dd className="mt-1 text-small font-medium text-fg">{item.value}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
