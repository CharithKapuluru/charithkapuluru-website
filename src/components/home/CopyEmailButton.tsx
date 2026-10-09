"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react/dist/ssr";
import Button from "@/components/ui/Button";

export default function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <Button variant="secondary" size="lg" onClick={copy} aria-live="polite">
      {copied ? <Check size={18} weight="regular" aria-hidden /> : <Copy size={18} weight="regular" aria-hidden />}
      {copied ? "Copied" : email}
    </Button>
  );
}
