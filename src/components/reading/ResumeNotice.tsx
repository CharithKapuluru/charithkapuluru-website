"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

/**
 * Inline "welcome back" notice. It offers the position that was stored when the page loaded, and saves the current one when the tab hides,
 * the page unloads or the reader navigates away (no polling). The stored position is read exactly once, on mount, and that frozen value is
 * what the notice offers and what save() protects until the reader answers; later renders and later saves never change it.
 */
export default function ResumeNotice({ slug, progressKey }: { slug: string; progressKey: string }) {
  const { user } = useAuth();
  const key = `readingPosition_${slug}`;
  // The stored position at page load: undefined until it has been read, null when there is nothing worth offering. The page remounts for another slug, so one read per instance is one read per page load.
  const offered = useRef<Position | null | undefined>(undefined);
  // Set by Resume and Start fresh. Until then the stored position is waiting for an answer and save() must not overwrite it.
  const answered = useRef(false);
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    if (offered.current !== undefined) return; // a Strict Mode re-run or a later render must not read again
    const stored = readJson<Position | null>(key, null);
    offered.current = stored && typeof stored.scroll === "number" && stored.scroll > 200 ? stored : null;
    // localStorage only exists after mount, so the notice appears from here (the one read per page load) and not from render.
    if (offered.current) setPosition(offered.current);
  }, [key]);

  // A layout effect, so the cleanup runs while the page being left is still mounted and scrolled: a client-side navigation fires neither pagehide nor visibilitychange.
  useLayoutEffect(() => {
    const save = () => {
      if (offered.current === undefined) return; // storage not read yet, so nothing is known about what is stored
      if (offered.current && !answered.current) return; // the stored position is on offer: leave it alone
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
    answered.current = true;
    window.scrollTo({ top: Math.max(0, position.scroll - 72), behavior: scrollBehavior(prefersReducedMotion()) });
    setPosition(null);
    removeKey(key);
  };

  const startFresh = async () => {
    answered.current = true;
    // Jump to the top instantly first, so the active section is 0 before any write and auto-complete cannot re-save a partial list after the delete.
    window.scrollTo({ top: 0, behavior: "instant" });
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
