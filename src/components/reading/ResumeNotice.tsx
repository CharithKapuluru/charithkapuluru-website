"use client";

import { useEffect, useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { readJson, removeKey, writeJson } from "@/lib/storage";
import { prefersReducedMotion, scrollBehavior } from "@/lib/scroll";

interface Position {
  phase: number;
  scroll: number;
  timestamp: number;
}

/** Inline "welcome back" notice. Saves the reading position when the tab hides or unloads (no polling). */
export default function ResumeNotice({ slug, progressKey }: { slug: string; progressKey: string }) {
  const { user } = useAuth();
  const key = `readingPosition_${slug}`;
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    const saved = readJson<Position | null>(key, null);
    if (saved && typeof saved.scroll === "number" && saved.scroll > 200) setPosition(saved);

    const save = () => {
      let phase = 0;
      document.querySelectorAll<HTMLElement>("[data-phase]").forEach((el, i) => {
        if (el.getBoundingClientRect().top <= 200) phase = i;
      });
      writeJson(key, { phase, scroll: window.scrollY, timestamp: Date.now() });
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") save();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", save);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", save);
    };
  }, [key]);

  if (!position) return null;

  const resume = () => {
    window.scrollTo({ top: Math.max(0, position.scroll - 72), behavior: scrollBehavior(prefersReducedMotion()) });
    setPosition(null);
    removeKey(key);
  };

  const startFresh = async () => {
    // Jump to the top instantly first, so the active section is 0 before any write and auto-complete cannot re-save a partial list after the delete.
    window.scrollTo({ top: 0, behavior: "auto" });
    removeKey(key);
    setPosition(null);
    if (user) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "progress", progressKey));
      } catch (error) {
        console.error("Could not clear progress:", error);
      }
    }
  };

  return (
    <div role="status" className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface-2 px-4 py-3">
      <p className="text-small text-fg-2">Welcome back. Resume where you left off?</p>
      <div className="flex gap-2">
        <Button size="sm" onClick={resume}>
          Resume
        </Button>
        <Button size="sm" variant="ghost" onClick={startFresh}>
          Start fresh
        </Button>
      </div>
    </div>
  );
}
