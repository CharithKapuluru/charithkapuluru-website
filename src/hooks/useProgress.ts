"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { completeThrough, percentComplete, toggleIndex } from "@/lib/progress";

/** Firestore-backed phase progress for signed-in readers. Document: users/{uid}/progress/{progressKey} = { phases: number[] }. */
export function useProgress(progressKey: string, total: number) {
  const { user, loading } = useAuth();
  const [completed, setCompleted] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setCompleted([]);
      setReady(true);
      return;
    }
    const ref = doc(db, "users", user.uid, "progress", progressKey);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const data = snapshot.exists() ? snapshot.data() : null;
        setCompleted(Array.isArray(data?.phases) ? (data!.phases as number[]) : []);
        setReady(true);
      },
      (error) => {
        console.error("Error loading progress:", error);
        setCompleted([]);
        setReady(true);
      },
    );
    return () => unsubscribe();
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
      if (!user) return;
      setCompleted((prev) => {
        const next = toggleIndex(prev, index);
        save(next);
        return next;
      });
    },
    [user, save],
  );

  const markBefore = useCallback(
    (current: number) => {
      if (!user) return;
      setCompleted((prev) => {
        const next = completeThrough(prev, current, total);
        if (next.length === prev.length) return prev;
        save(next);
        return next;
      });
    },
    [user, save, total],
  );

  const reset = useCallback(async () => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "progress", progressKey));
    setCompleted([]);
  }, [user, progressKey]);

  return { completed, toggle, markBefore, reset, ready, loading, signedIn: !!user, percent: percentComplete(completed, total) };
}
