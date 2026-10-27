"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { Books, Note as NoteIcon, Trash, X } from "@phosphor-icons/react/dist/ssr";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { readJson, writeJson } from "@/lib/storage";
import { useBackdropClose } from "@/hooks/useBackdropClose";
import Button from "./Button";
import Tag from "./Tag";

interface Note {
  id: string;
  phaseId: number;
  projectSlug?: string;
  content: string;
  timestamp: number;
}

interface PersonalNotesProps {
  phaseId: number;
  phaseName: string;
  projectSlug?: string;
}

export default function PersonalNotes({ phaseId, phaseName, projectSlug = "devsecops-pipeline" }: PersonalNotesProps) {
  const { user } = useAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const storageKey = `personalNotes_${projectSlug}`;
  const backdrop = useBackdropClose(dialogRef, () => dialogRef.current?.close());

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "users", user.uid, "notes"), where("phaseId", "==", phaseId), where("projectSlug", "==", projectSlug));
      return onSnapshot(q, (snapshot) => {
        const data: Note[] = [];
        snapshot.forEach((d) => data.push(d.data() as Note));
        setNotes(data.sort((a, b) => a.timestamp - b.timestamp));
      });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- signed-out notes live in localStorage, which only exists after mount; the same effect owns the Firestore listener
    setNotes(readJson<Note[]>(storageKey, []).filter((n) => n.phaseId === phaseId));
  }, [phaseId, user, projectSlug, storageKey]);

  const saveNote = useCallback(async () => {
    const content = draft.trim();
    if (!content) return;
    const note = { id: Date.now().toString(), phaseId, projectSlug, content, timestamp: Date.now() };
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid, "notes", note.id), note);
      } catch (error) {
        console.error("Error saving note:", error);
        return;
      }
    } else {
      writeJson(storageKey, [...readJson<Note[]>(storageKey, []), note]);
      setNotes((prev) => [...prev, note]);
    }
    setDraft("");
  }, [draft, phaseId, user, projectSlug, storageKey]);

  const deleteNote = useCallback(
    async (id: string) => {
      if (user) {
        try {
          await deleteDoc(doc(db, "users", user.uid, "notes", id));
        } catch (error) {
          console.error("Error deleting note:", error);
        }
      } else {
        writeJson(storageKey, readJson<Note[]>(storageKey, []).filter((n) => n.id !== id));
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    },
    [user, storageKey],
  );

  const formatDate = (t: number) => new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <Button variant="secondary" size="sm" data-print-hide onClick={() => dialogRef.current?.showModal()} aria-haspopup="dialog">
        <NoteIcon size={16} weight="regular" aria-hidden />
        Notes{notes.length > 0 ? ` (${notes.length})` : ""}
      </Button>
      <dialog
        ref={dialogRef}
        aria-label={`Notes for ${phaseName}`}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-border bg-surface p-0 text-fg shadow-float"
        {...backdrop}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h4 className="font-display text-body font-semibold">Notes for {phaseName}</h4>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close" className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-2 hover:bg-surface-2">
            <X size={18} weight="regular" aria-hidden />
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {notes.length === 0 ? (
            <p className="p-4 text-center text-small text-fg-3">No notes yet. Write the first one below.</p>
          ) : (
            <ul className="divide-y divide-border">
              {notes.map((n) => (
                <li key={n.id} className="p-4">
                  <p className="whitespace-pre-wrap text-small text-fg-2">{n.content}</p>
                  <div className="mt-2 flex items-center justify-between text-caption text-fg-3">
                    <span>{formatDate(n.timestamp)}</span>
                    <button type="button" onClick={() => deleteNote(n.id)} aria-label={`Delete note from ${formatDate(n.timestamp)} for ${phaseName}`} className="inline-flex items-center gap-1 text-danger hover:underline">
                      <Trash size={14} weight="regular" aria-hidden /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-border bg-surface-2 p-3">
          <label htmlFor={`note-${phaseId}`} className="sr-only">
            New note
          </label>
          <textarea
            id={`note-${phaseId}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a note"
            rows={3}
            className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-small text-fg outline-none placeholder:text-fg-3 focus:border-accent"
          />
          <div className="mt-2 flex justify-end">
            <Button size="sm" onClick={saveNote} disabled={!draft.trim()}>
              Save note
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}

export const AllNotesViewer = ({ variant = "inline" }: { variant?: "inline" | "fab" }) => {
  const { user } = useAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const backdrop = useBackdropClose(dialogRef, () => dialogRef.current?.close());

  useEffect(() => {
    if (!open) return;
    if (user) {
      return onSnapshot(collection(db, "users", user.uid, "notes"), (snapshot) => {
        const data: Note[] = [];
        snapshot.forEach((d) => data.push(d.data() as Note));
        setAllNotes(data.sort((a, b) => b.timestamp - a.timestamp));
      });
    }
    const merged: Note[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("personalNotes_") || key === "personalNotes")) {
          const notes = readJson<Note[]>(key, []);
          merged.push(...notes);
        }
      }
    } catch {
      // Storage unavailable
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- signed-out notes are gathered from localStorage when the dialog opens; the same effect owns the Firestore listener
    setAllNotes(merged.sort((a, b) => b.timestamp - a.timestamp));
  }, [open, user]);

  const show = () => {
    setOpen(true);
    dialogRef.current?.showModal();
  };

  return (
    <>
      <Button variant="secondary" size="sm" onClick={show} aria-haspopup="dialog" className={variant === "fab" ? "fixed bottom-4 left-4 z-30 shadow-float" : undefined}>
        <Books size={16} weight="regular" aria-hidden />
        All notes
      </Button>
      <dialog
        ref={dialogRef}
        aria-label="All your notes"
        className="m-auto w-[calc(100%-2rem)] max-w-2xl rounded-lg border border-border bg-surface p-0 text-fg shadow-float"
        {...backdrop}
        onClose={() => setOpen(false)}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h3 className="font-display text-h3">All your notes</h3>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close" className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-2 hover:bg-surface-2">
            <X size={18} weight="regular" aria-hidden />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {allNotes.length === 0 ? (
            <p className="py-8 text-center text-small text-fg-3">No notes yet. Open Notes on any phase to add one.</p>
          ) : (
            <ul className="space-y-3">
              {allNotes.map((n) => (
                <li key={n.id} className="rounded-md border border-border bg-bg p-4">
                  <Tag>{n.projectSlug ?? "project"} · Phase {n.phaseId}</Tag>
                  <p className="mt-2 whitespace-pre-wrap text-small text-fg-2">{n.content}</p>
                  <p className="mt-2 text-caption text-fg-3">{new Date(n.timestamp).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </dialog>
    </>
  );
};
