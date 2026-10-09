import { cn } from "@/lib/utils";

export default function SectionHeader({
  eyebrow,
  title,
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={cn("mb-6", className)}>
      {eyebrow && <p className="mb-2 text-caption text-fg-3">{eyebrow}</p>}
      <Heading className={Heading === "h2" ? "text-h2 text-fg" : "text-h3 text-fg"}>{title}</Heading>
    </div>
  );
}
