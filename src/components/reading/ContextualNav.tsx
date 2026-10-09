import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { FileText } from "@phosphor-icons/react/dist/ssr";
import Wordmark from "@/components/brand/Wordmark";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/layout/ThemeToggle";
import ProgressLine from "./ProgressLine";
import SectionsSheet from "./SectionsSheet";

export interface Crumb {
  label: string;
  href?: string;
}

export default function ContextualNav({ crumbs, sheetLabel, sheetContent }: { crumbs: Crumb[]; sheetLabel: "Sections" | "Phases"; sheetContent?: ReactNode }) {
  const lastIndex = crumbs.length - 1;
  return (
    <header data-print-hide className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Wordmark compact />
          <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-2 text-small text-fg-3 sm:flex">
            {crumbs.map((c, i) => (
              <Fragment key={`${c.label}-${i}`}>
                {i > 0 && <span aria-hidden>/</span>}
                {c.href ? (
                  <Link href={c.href} aria-current={i === lastIndex ? "page" : undefined} className="shrink-0 hover:text-fg">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current={i === lastIndex ? "page" : undefined} className="truncate text-fg-2">{c.label}</span>
                )}
              </Fragment>
            ))}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <SectionsSheet label={sheetLabel} content={sheetContent} className="xl:hidden" />
          <ThemeToggle />
          {/* Phones get the icon, md and up get the labelled button, so the resume is one tap away at every width. */}
          <a
            href="/ck.pdf"
            download="Charith_Kapuluru_Resume.pdf"
            aria-label="Resume"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-fg-2 hover:bg-surface-2 hover:text-fg md:hidden"
          >
            <FileText size={20} weight="regular" aria-hidden />
            <span className="sr-only">Resume</span>
          </a>
          <Button href="/ck.pdf" download="Charith_Kapuluru_Resume.pdf" size="sm" className="hidden md:inline-flex">
            Resume
          </Button>
        </div>
      </div>
      <ProgressLine />
    </header>
  );
}
