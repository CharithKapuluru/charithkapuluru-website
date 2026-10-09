import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

interface NextUpProps {
  label: string;
  title: string;
  href: string;
  meta?: string;
  backHref: string;
  backLabel: string;
}

export default function NextUp({ label, title, href, meta, backHref, backLabel }: NextUpProps) {
  return (
    <div className="mt-16 border-t border-border pt-8">
      <Link href={href} className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-surface p-5 transition-colors duration-150 hover:border-fg-3">
        <div className="min-w-0">
          <p className="text-caption text-fg-3">{label}</p>
          <p className="mt-1 font-display text-h3 text-fg group-hover:text-accent">{title}</p>
          {meta && <p className="mt-1 text-small text-fg-3">{meta}</p>}
        </div>
        <ArrowRight size={20} weight="regular" aria-hidden className="shrink-0 text-fg-3 transition-transform duration-150 group-hover:translate-x-0.5" />
      </Link>
      <Link href={backHref} className="mt-4 inline-flex items-center gap-1.5 text-small text-fg-2 hover:text-fg">
        <ArrowLeft size={16} weight="regular" aria-hidden />
        {backLabel}
      </Link>
    </div>
  );
}
