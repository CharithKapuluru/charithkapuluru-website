"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { BookmarkSimple } from "@phosphor-icons/react/dist/ssr";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { readJson, writeJson } from "@/lib/storage";
import Button from "./Button";

interface BookmarkButtonProps {
  phaseId: number;
  phaseName: string;
  projectSlug?: string;
}

export default function BookmarkButton({ phaseId, phaseName, projectSlug = "devsecops-pipeline" }: BookmarkButtonProps) {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [announce, setAnnounce] = useState("");
  const bookmarkId = `${projectSlug}_phase${phaseId}`;
  const storageKey = `bookmarkedPhases_${projectSlug}`;

  useEffect(() => {
    if (user) {
      return onSnapshot(doc(db, "users", user.uid, "bookmarks", bookmarkId), (snap) => setBookmarked(snap.exists()));
    }
    setBookmarked(readJson<number[]>(storageKey, []).includes(phaseId));
  }, [phaseId, user, bookmarkId, storageKey]);

  const toggle = useCallback(async () => {
    const next = !bookmarked;
    if (user) {
      const ref = doc(db, "users", user.uid, "bookmarks", bookmarkId);
      try {
        if (next) await setDoc(ref, { phaseId, phaseName, projectSlug, timestamp: Date.now() });
        else await deleteDoc(ref);
      } catch (error) {
        console.error("Error toggling bookmark:", error);
        return;
      }
    } else {
      const ids = readJson<number[]>(storageKey, []);
      writeJson(storageKey, next ? [...ids, phaseId] : ids.filter((id) => id !== phaseId));
      setBookmarked(next);
    }
    setAnnounce(next ? `Bookmarked ${phaseName}` : `Removed bookmark for ${phaseName}`);
  }, [bookmarked, user, bookmarkId, phaseId, phaseName, projectSlug, storageKey]);

  return (
    <>
      <Button variant="secondary" size="sm" onClick={toggle} aria-pressed={bookmarked} title={bookmarked ? "Remove bookmark" : "Bookmark this phase"}>
        <BookmarkSimple size={16} weight={bookmarked ? "fill" : "regular"} aria-hidden className={bookmarked ? "text-accent" : undefined} />
        {bookmarked ? "Bookmarked" : "Bookmark"}
      </Button>
      <span className="sr-only" aria-live="polite">
        {announce}
      </span>
    </>
  );
}

/** @deprecated Replaced by reading/ResumeNotice. Kept as a no-op until the codemod removes its usages (Task 10); deleted in Task 16. */
export const ReadingPositionTracker = (_props: { projectSlug?: string; onClearProgress?: () => void }) => null;
