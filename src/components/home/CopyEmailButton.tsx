"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react/dist/ssr";
import Button from "@/components/ui/Button";

export default function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(t.current);
      t.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <>
      <Button variant="secondary" size="lg" onClick={copy}>
        {copied ? <Check size={18} weight="regular" aria-hidden /> : <Copy size={18} weight="regular" aria-hidden />}
        {copied ? "Copied" : email}
      </Button>
      {/* A live region that is always mounted, so the result is announced when it appears. */}
      <span role="status" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </>
  );
}
