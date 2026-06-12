"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { useWorld } from "./WorldProvider";
import { AvatarHead } from "./Avatar";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/fundamentals", label: "Fundamentals" },
  { href: "/contact", label: "Contact" },
];

export default function WorldNav() {
  const pathname = usePathname();
  const { soundOn, toggleSound, boop } = useWorld();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-text-charcoal/5 bg-bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <AvatarHead width={44} />
          <span className="font-serif text-lg font-semibold text-text-charcoal">
            charith.dev
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-5">
          {LINKS.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3 py-1.5 font-sans text-sm transition-colors ${
                  active
                    ? "bg-bg-stone font-bold text-text-charcoal"
                    : "text-text-olive hover:text-accent-moss"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <a
            href="/ck.pdf"
            download="Charith_Kapuluru_Resume.pdf"
            className="hidden rounded-full bg-text-charcoal px-4 py-2 font-sans text-sm font-bold text-white transition-colors hover:bg-accent-moss active:scale-[0.98] md:block"
          >
            Resume
          </a>
          <button
            onClick={() => {
              toggleSound();
              boop();
            }}
            aria-label={soundOn ? "Mute sounds" : "Enable sounds"}
            className="rounded-full p-2 text-text-olive transition-colors hover:bg-bg-stone hover:text-text-charcoal"
          >
            {soundOn ? <SpeakerHigh size={18} weight="bold" /> : <SpeakerSlash size={18} weight="bold" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
