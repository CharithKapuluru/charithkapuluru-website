"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, deleteDoc, query, where, onSnapshot } from "firebase/firestore";

interface Note {
  id: string;
  phaseId: number;
  content: string;
  timestamp: number;
}

interface PersonalNotesProps {
  phaseId: number;
  phaseName: string;
}

const PersonalNotes = ({ phaseId, phaseName }: PersonalNotesProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

  // Load notes from Firestore or localStorage
  useEffect(() => {
    if (user) {
      // Listen to Firestore for real-time updates
      const notesRef = collection(db, "users", user.uid, "notes");
      const q = query(notesRef, where("phaseId", "==", phaseId));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notesData: Note[] = [];
        snapshot.forEach((doc) => {
          notesData.push(doc.data() as Note);
        });
        setNotes(notesData.sort((a, b) => a.timestamp - b.timestamp));
      });

      return () => unsubscribe();
    } else {
      // Fall back to localStorage for non-logged-in users
      const savedNotes = JSON.parse(localStorage.getItem("personalNotes") || "[]");
      const phaseNotes = savedNotes.filter((note: Note) => note.phaseId === phaseId);
      setNotes(phaseNotes);
    }
  }, [phaseId, user]);

  const saveNote = useCallback(async () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      phaseId,
      content: newNote.trim(),
      timestamp: Date.now(),
    };

    if (user) {
      // Save to Firestore
      try {
        await setDoc(doc(db, "users", user.uid, "notes", note.id), note);
      } catch (error) {
        console.error("Error saving note:", error);
      }
    } else {
      // Save to localStorage
      const allNotes = JSON.parse(localStorage.getItem("personalNotes") || "[]");
      const updatedNotes = [...allNotes, note];
      localStorage.setItem("personalNotes", JSON.stringify(updatedNotes));
      setNotes((prev) => [...prev, note]);
    }

    setNewNote("");
  }, [newNote, phaseId, user]);

  const deleteNote = useCallback(async (noteId: string) => {
    if (user) {
      // Delete from Firestore
      try {
        await deleteDoc(doc(db, "users", user.uid, "notes", noteId));
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    } else {
      // Delete from localStorage
      const allNotes = JSON.parse(localStorage.getItem("personalNotes") || "[]");
      const updatedNotes = allNotes.filter((note: Note) => note.id !== noteId);
      localStorage.setItem("personalNotes", JSON.stringify(updatedNotes));
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    }
  }, [user]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-mono transition-all ${
          notes.length > 0
            ? "bg-accent-sage/20 text-accent-moss border border-accent-moss"
            : "bg-bg-cream text-text-olive border border-text-charcoal/10 hover:border-accent-moss/50"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Notes {notes.length > 0 && `(${notes.length})`}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Notes panel */}
          <div className="absolute right-0 mt-2 w-80 bg-bg-paper border border-text-charcoal/10 rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 bg-bg-cream border-b border-text-charcoal/10">
              <h4 className="font-serif text-text-charcoal">
                Notes for {phaseName}
              </h4>
            </div>

            {/* Existing notes */}
            <div className="max-h-60 overflow-y-auto">
              {notes.length === 0 ? (
                <p className="p-4 text-sm text-text-olive text-center">
                  No notes yet. Add your thoughts below!
                </p>
              ) : (
                <div className="divide-y divide-text-charcoal/5">
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 hover:bg-bg-cream/50 group">
                      <p className="text-sm text-text-taupe whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-text-olive">
                          {formatDate(note.timestamp)}
                        </span>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-xs text-accent-terracotta opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add note form */}
            <div className="p-3 border-t border-text-charcoal/10 bg-bg-cream/30">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a personal note..."
                className="w-full p-2 text-sm bg-bg-paper border border-text-charcoal/10 rounded resize-none focus:outline-none focus:border-accent-moss"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={saveNote}
                  disabled={!newNote.trim()}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    newNote.trim()
                      ? "bg-accent-moss text-white hover:bg-accent-moss/90"
                      : "bg-text-charcoal/10 text-text-olive cursor-not-allowed"
                  }`}
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Export all notes viewer component
export const AllNotesViewer = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [allNotes, setAllNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    if (user) {
      // Listen to all notes from Firestore
      const notesRef = collection(db, "users", user.uid, "notes");
      const unsubscribe = onSnapshot(notesRef, (snapshot) => {
        const notesData: Note[] = [];
        snapshot.forEach((doc) => {
          notesData.push(doc.data() as Note);
        });
        setAllNotes(notesData.sort((a, b) => b.timestamp - a.timestamp));
      });

      return () => unsubscribe();
    } else {
      const notes = JSON.parse(localStorage.getItem("personalNotes") || "[]");
      setAllNotes(notes.sort((a: Note, b: Note) => b.timestamp - a.timestamp));
    }
  }, [isOpen, user]);

  const phaseNames: Record<number, string> = {
    0: "Phase 0: Repository Setup",
    1: "Phase 1: FastAPI MVP",
    2: "Phase 2: Automated Tests",
    3: "Phase 3: Linting & Formatting",
    4: "Phase 4: Docker",
    5: "Phase 5: CI/CD",
    6: "Phase 6: SAST",
    7: "Phase 7: Trivy",
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40 p-3 bg-accent-sage text-white rounded-full shadow-lg hover:bg-accent-moss transition-colors"
        title="View all notes"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-bg-paper rounded-lg shadow-2xl max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-text-charcoal/10 flex items-center justify-between">
              <h3 className="text-xl font-serif text-text-charcoal">All Your Notes</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-olive hover:text-text-charcoal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {allNotes.length === 0 ? (
                <p className="text-center text-text-olive py-8">
                  You haven&apos;t added any notes yet.<br />
                  Click the Notes button on any phase to get started!
                </p>
              ) : (
                <div className="space-y-4">
                  {allNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 bg-bg-cream rounded-lg border border-text-charcoal/10"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-accent-moss bg-accent-moss/10 px-2 py-0.5 rounded">
                          {phaseNames[note.phaseId]}
                        </span>
                      </div>
                      <p className="text-text-taupe whitespace-pre-wrap">{note.content}</p>
                      <p className="text-xs text-text-olive mt-2">
                        {new Date(note.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalNotes;
