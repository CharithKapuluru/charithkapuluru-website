"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { completeThrough, percentComplete, toggleIndex } from "@/lib/progress";

const NONE: number[] = [];

/** Firestore-backed phase progress for signed-in readers. Document: users/{uid}/progress/{progressKey} = { phases: number[] }. */
export function useProgress(progressKey: string, total: number) {
  const { user, loading } = useAuth();
  // The phases the listener last delivered, tagged with the (user, key) pair they belong to. Anything tagged for another pair counts as not loaded,
  // so `ready` is false again the moment the user or key changes, and no write can replace the stored document before that document has been read.
  // Signed out there is nothing to load: no progress, and ready as soon as auth has settled.
  const [remote, setRemote] = useState<{ scope: string; phases: number[] } | null>(null);
  const scope = user ? `${user.uid}:${progressKey}` : null;
  const synced = scope !== null && remote?.scope === scope;
  const completed = synced ? remote.phases : NONE;
  const ready = !loading && (!user || synced);

  useEffect(() => {
    if (loading || !user) return;
    const mine = `${user.uid}:${progressKey}`;
    const ref = doc(db, "users", user.uid, "progress", progressKey);
    // Metadata changes are included so the server's answer still arrives when a cached "no document" was skipped below.
    const unsubscribe = onSnapshot(
      ref,
      { includeMetadataChanges: true },
      (snapshot) => {
        // Offline with nothing cached says nothing about what is stored, and a write now would replace it: wait for the server.
        if (snapshot.metadata.fromCache && !snapshot.exists()) return;
        const data = snapshot.exists() ? snapshot.data() : null;
        setRemote({ scope: mine, phases: Array.isArray(data?.phases) ? (data!.phases as number[]) : [] });
      },
      (error) => {
        console.error("Error loading progress:", error);
        setRemote({ scope: mine, phases: [] });
      },
    );
    return () => {
      unsubscribe();
      // Forget what this listener delivered: a sign-out followed by a sign-in as the same user has the same scope, and must not look ready with the old phases before the new listener answers.
      setRemote(null);
    };
  }, [user, loading, progressKey]);

  const save = useCallback(
    (phases: number[]) => {
      if (!user) return;
      setDoc(doc(db, "users", user.uid, "progress", progressKey), { phases }, { merge: true }).catch((error) => console.error("Error saving progress:", error));
    },
    [user, progressKey],
  );

  const toggle = useCallback(
    (index: number) => {
      if (!user || !scope || !ready) return;
      setRemote((prev) => {
        const next = toggleIndex(prev?.scope === scope ? prev.phases : NONE, index);
        save(next);
        return { scope, phases: next };
      });
    },
    [user, scope, ready, save],
  );

  const markBefore = useCallback(
    (current: number) => {
      if (!user || !scope || !ready) return;
      setRemote((prev) => {
        const base = prev?.scope === scope ? prev.phases : NONE;
        const next = completeThrough(base, current, total);
        if (next.length === base.length) return prev;
        save(next);
        return { scope, phases: next };
      });
    },
    [user, scope, ready, save, total],
  );

  const reset = useCallback(async () => {
    if (!user || !scope) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "progress", progressKey));
      setRemote({ scope, phases: [] });
    } catch (error) {
      console.error("Error resetting progress:", error);
    }
  }, [user, scope, progressKey]);

  return { completed, toggle, markBefore, reset, ready, loading, signedIn: !!user, percent: percentComplete(completed, total) };
}
