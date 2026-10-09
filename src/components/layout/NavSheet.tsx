"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { NAV_LINKS, type NavKey } from "./nav-links";
import ThemeToggle from "./ThemeToggle";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Mobile menu. A native <dialog> gives focus trapping, Escape handling and a backdrop for free. */
export default function NavSheet({ active }: { active?: NavKey }) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = () => ref.current?.showModal();
  const close = () => ref.current?.close();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 48rem)");
    const onChange = () => ref.current?.close();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={open}
        aria-label="Open menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-fg-2 hover:bg-surface-2 hover:text-fg"
      >
        <List size={22} weight="regular" aria-hidden />
      </button>
      <dialog
        ref={ref}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-fg backdrop:bg-transparent"
      >
        <div className="flex h-full flex-col px-4 py-3">
          <div className="flex h-10 items-center justify-between">
            <span className="font-display text-body font-semibold">Menu</span>
            <button type="button" onClick={close} aria-label="Close menu" className="inline-flex h-10 w-10 items-center justify-center rounded-md text-fg-2 hover:bg-surface-2 hover:text-fg">
              <X size={22} weight="regular" aria-hidden />
            </button>
          </div>
          <ul className="mt-6 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.key}>
                <Link
                  href={l.href}
                  onClick={close}
                  aria-current={active === l.key ? "page" : undefined}
                  className={cn("flex h-12 items-center rounded-md px-3 font-display text-h3 text-fg-2 hover:bg-surface-2 hover:text-fg", active === l.key && "text-fg")}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
            <a href="/ck.pdf" download="Charith_Kapuluru_Resume.pdf" onClick={close} className={buttonClasses("primary", "md")}>
              Resume
            </a>
            <ThemeToggle />
          </div>
        </div>
      </dialog>
    </div>
  );
}
