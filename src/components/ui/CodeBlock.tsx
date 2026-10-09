"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react/dist/ssr";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({ code, language = "bash", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable; the text stays selectable */
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <figure className="my-6 overflow-hidden rounded-md border border-border bg-surface-2">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <span className="font-mono text-caption text-fg-3">{filename ?? language}</span>
        <button data-print-hide
          type="button"
          onClick={copy}
          aria-live="polite"
          className="inline-flex h-8 items-center gap-1.5 rounded-sm px-2 font-mono text-caption text-fg-2 hover:bg-surface hover:text-fg"
        >
          {copied ? <Check size={14} weight="regular" aria-hidden /> : <Copy size={14} weight="regular" aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-small leading-relaxed text-fg">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
