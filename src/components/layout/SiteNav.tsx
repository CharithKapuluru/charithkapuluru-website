import Link from "next/link";
import Wordmark from "@/components/brand/Wordmark";
import Button from "@/components/ui/Button";
import ThemeToggle from "./ThemeToggle";
import NavSheet from "./NavSheet";
import { NAV_LINKS, type NavKey } from "./nav-links";
import { cn } from "@/lib/utils";

export default function SiteNav({ active }: { active?: NavKey }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Wordmark />
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.key;
            return (
              <li key={l.key}>
                <Link
                  href={l.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-small font-medium text-fg-2 transition-colors duration-150 hover:text-fg",
                    isActive && "text-fg after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:rounded-full after:bg-accent",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button href="/ck.pdf" download="Charith_Kapuluru_Resume.pdf" size="sm" className="hidden md:inline-flex">
            Resume
          </Button>
          <NavSheet active={active} />
        </div>
      </nav>
    </header>
  );
}
