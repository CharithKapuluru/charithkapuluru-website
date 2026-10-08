import { ChartBar, ClipboardText, Timer, Wrench } from "@phosphor-icons/react/dist/ssr";
import Tag, { type TagTone } from "./Tag";

interface DifficultyIndicatorProps {
  readingTime: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  handsOn: boolean;
  prerequisites?: string;
}

const tone: Record<DifficultyIndicatorProps["difficulty"], TagTone> = { Beginner: "success", Intermediate: "tip", Advanced: "danger" };

export default function DifficultyIndicator({ readingTime, difficulty, handsOn, prerequisites }: DifficultyIndicatorProps) {
  const items = [
    { icon: Timer, label: "Reading", value: `${readingTime} min` },
    { icon: ChartBar, label: "Level", value: <Tag tone={tone[difficulty]} mono={false}>{difficulty}</Tag> },
    { icon: Wrench, label: "Hands-on", value: handsOn ? "Yes" : "No" },
    ...(prerequisites ? [{ icon: ClipboardText, label: "Prerequisites", value: prerequisites }] : []),
  ];
  return (
    <dl className="mb-8 flex flex-wrap gap-x-8 gap-y-4 rounded-md border border-border bg-surface-2 px-5 py-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-2">
          <item.icon size={18} aria-hidden className="mt-0.5 text-fg-3" />
          <div>
            <dt className="text-caption text-fg-3">{item.label}</dt>
            <dd className="text-small font-medium text-fg">{item.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
