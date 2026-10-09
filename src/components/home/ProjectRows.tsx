import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { projects } from "@/lib/projectsData";
import { iconFor } from "@/components/ui/icons";
import Tag from "@/components/ui/Tag";
import { cn } from "@/lib/utils";

export default function ProjectRows({ detailed = false, headingLevel: Heading = "h3", className }: { detailed?: boolean; headingLevel?: "h2" | "h3"; className?: string }) {
  return (
    <ol className={cn("divide-y divide-border border-y border-border", className)}>
      {projects.map((p) => (
        <li key={p.slug}>
          <Link href={`/projects/${p.slug}`} aria-labelledby={`project-title-${p.slug}`} className="group grid gap-4 py-6 transition-colors duration-150 hover:bg-surface md:grid-cols-12 md:gap-8 md:py-8">
            <div className="flex items-center gap-3 text-fg-3 md:col-span-3 md:flex-col md:items-start md:gap-2">
              <span className="text-fg-2">{iconFor(p.icon, { size: 24 })}</span>
              <span className="text-caption tabular">{p.phaseCount} phases</span>
              {detailed && <span className="text-caption">{p.estimatedTime}</span>}
            </div>
            <div className="md:col-span-9">
              <Heading id={`project-title-${p.slug}`} className="font-display text-h3 text-fg group-hover:text-accent">{p.title}</Heading>
              <p className="mt-2 max-w-[60ch] text-body text-fg-2">{detailed ? p.lede : p.outcome}</p>
              {detailed && (
                <p className="mt-2 max-w-[60ch] text-small text-fg-3">
                  <span className="font-medium text-fg-2">What you will build: </span>
                  {p.whatYouBuild}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.technologies.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-small font-medium text-fg-2 group-hover:text-fg">
                {detailed ? "Open the walkthrough" : "Read the walkthrough"}
                <ArrowRight size={16} weight="regular" aria-hidden className="transition-transform duration-150 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
