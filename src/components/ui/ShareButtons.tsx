"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, EnvelopeSimple, LinkedinLogo, ShareNetwork, XLogo } from "@phosphor-icons/react/dist/ssr";
import Button from "./Button";

interface ShareButtonsProps {
  title: string;
  phaseId?: number;
}

export default function ShareButtons({ title, phaseId }: ShareButtonsProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const closeMenu = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    const onClick = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && closeMenu();
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const url = () => {
    const base = window.location.origin + window.location.pathname;
    return phaseId !== undefined ? `${base}#phase-${phaseId}` : base;
  };
  const text = () => `${title}. ${document.title}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
    closeMenu();
  };
  const popup = (href: string) => {
    window.open(href, "_blank", "width=550,height=420,noopener");
    closeMenu();
  };

  const items = [
    { label: copied ? "Copied" : "Copy link", icon: Copy, onClick: copy },
    { label: "X", icon: XLogo, onClick: () => popup(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text())}&url=${encodeURIComponent(url())}`) },
    { label: "LinkedIn", icon: LinkedinLogo, onClick: () => popup(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url())}`) },
    { label: "Email", icon: EnvelopeSimple, onClick: () => { window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text()}\n\n${url()}`)}`; setOpen(false); } },
  ];

  return (
    <div ref={wrap} className="relative inline-block">
      <Button ref={triggerRef} variant="secondary" size="sm" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <ShareNetwork size={16} weight="regular" aria-hidden />
        {copied ? "Copied" : "Share"}
      </Button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied" : ""}
      </span>
      {open && (
        <ul aria-label="Share options" className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-float">
          {items.map((item) => (
            <li key={item.label}>
              <button type="button" onClick={item.onClick} className="flex w-full items-center gap-3 px-3 py-2 text-left text-small text-fg hover:bg-surface-2">
                <item.icon size={16} weight="regular" aria-hidden className="text-fg-3" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
