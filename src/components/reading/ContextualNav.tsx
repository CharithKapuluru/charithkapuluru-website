import { Fragment } from "react";
import Link from "next/link";
import Wordmark from "@/components/brand/Wordmark";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/layout/ThemeToggle";
import ProgressLine from "./ProgressLine";
import SectionsSheet from "./SectionsSheet";

export interface Crumb {
  label: string;
  href?: string;
}

export default function ContextualNav({ crumbs, sheetLabel }: { crumbs: Crumb[]; sheetLabel: "Sections" | "Phases" }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Wordmark compact />
          <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-2 text-small text-fg-3 sm:flex">
            {crumbs.map((c, i) => (
              <Fragment key={`${c.label}-${i}`}>
                {i > 0 && <span aria-hidden>/</span>}
                {c.href ? (
                  <Link href={c.href} className="shrink-0 hover:text-fg">
                    {c.label}
                  </Link>
                ) : (
                  <span className="truncate text-fg-2">{c.label}</span>
                )}
              </Fragment>
            ))}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <SectionsSheet label={sheetLabel} className="xl:hidden" />
          <ThemeToggle />
          <Button href="/ck.pdf" download="Charith_Kapuluru_Resume.pdf" size="sm" className="hidden md:inline-flex">
            Resume
          </Button>
        </div>
      </div>
      <ProgressLine />
    </header>
  );
}
