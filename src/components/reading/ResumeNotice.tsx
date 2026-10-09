"use client";

import { useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { removeKey, safeParse, writeJson } from "@/lib/storage";
import { prefersReducedMotion, scrollBehavior } from "@/lib/scroll";

interface Position {
  phase: number;
  scroll: number;
  timestamp: number;
}

// The saved position is read once per page load and nothing else writes it while the notice is on screen, so there is nothing to subscribe to.
const subscribeNever = () => () => {};

function readSaved(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null; // no window, private mode, or blocked storage
  }
}

/** Inline "welcome back" notice. Saves the reading position when the tab hides, the page unloads or the reader navigates away (no polling). */
export default function ResumeNotice({ slug, progressKey }: { slug: string; progressKey: string }) {
  const { user } = useAuth();
  const key = `readingPosition_${slug}`;
  const raw = useSyncExternalStore(subscribeNever, () => readSaved(key), () => null);
  const [dismissed, setDismissed] = useState(false);
  const saved = useMemo(() => safeParse<Position | null>(raw, null), [raw]);
  const position = !dismissed && saved && typeof saved.scroll === "number" && saved.scroll > 200 ? saved : null;

  // While the notice waits for an answer the stored position is the one it offers, so nothing may overwrite it.
  const pending = useRef(false);
  useLayoutEffect(() => {
    pending.current = position !== null;
  }, [position]);

  // A layout effect, so the cleanup runs while the page being left is still mounted and scrolled: a client-side navigation fires neither pagehide nor visibilitychange.
  useLayoutEffect(() => {
    const save = () => {
      if (pending.current) return;
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
      save();
    };
  }, [key]);

  const resume = () => {
    if (!position) return;
    window.scrollTo({ top: Math.max(0, position.scroll - 72), behavior: scrollBehavior(prefersReducedMotion()) });
    setDismissed(true);
    removeKey(key);
  };

  const startFresh = async () => {
    // Jump to the top instantly first, so the active section is 0 before any write and auto-complete cannot re-save a partial list after the delete.
    window.scrollTo({ top: 0, behavior: "instant" });
    removeKey(key);
    setDismissed(true);
    if (user) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "progress", progressKey));
      } catch (error) {
        console.error("Could not clear progress:", error);
      }
    }
  };

  // The live region stays mounted so the notice is announced when it appears.
  return (
    <div role="status">
      {position && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface-2 px-4 py-3">
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
      )}
    </div>
  );
}
