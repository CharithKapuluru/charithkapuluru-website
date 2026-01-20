"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";

interface BookmarkButtonProps {
  phaseId: number;
  phaseName: string;
}

const BookmarkButton = ({ phaseId, phaseName }: BookmarkButtonProps) => {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (user) {
      // Listen to Firestore for real-time updates
      const bookmarkRef = doc(db, "users", user.uid, "bookmarks", phaseId.toString());
      const unsubscribe = onSnapshot(bookmarkRef, (doc) => {
        setIsBookmarked(doc.exists());
      });
      return () => unsubscribe();
    } else {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarkedPhases") || "[]");
      setIsBookmarked(bookmarks.includes(phaseId));
    }
  }, [phaseId, user]);

  const toggleBookmark = useCallback(async () => {
    if (user) {
      // Use Firestore
      const bookmarkRef = doc(db, "users", user.uid, "bookmarks", phaseId.toString());
      try {
        if (isBookmarked) {
          await deleteDoc(bookmarkRef);
        } else {
          await setDoc(bookmarkRef, { phaseId, phaseName, timestamp: Date.now() });
        }
      } catch (error) {
        console.error("Error toggling bookmark:", error);
      }
    } else {
      // Use localStorage
      const bookmarks = JSON.parse(localStorage.getItem("bookmarkedPhases") || "[]");
      let newBookmarks;
      if (isBookmarked) {
        newBookmarks = bookmarks.filter((id: number) => id !== phaseId);
      } else {
        newBookmarks = [...bookmarks, phaseId];
      }
      localStorage.setItem("bookmarkedPhases", JSON.stringify(newBookmarks));
      setIsBookmarked(!isBookmarked);
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }, [user, phaseId, phaseName, isBookmarked]);

  return (
    <>
      <button
        onClick={toggleBookmark}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-mono transition-all ${
          isBookmarked
            ? "bg-accent-sand/20 text-accent-sand border border-accent-sand"
            : "bg-bg-cream text-text-olive border border-text-charcoal/10 hover:border-accent-sand/50"
        }`}
        title={isBookmarked ? "Remove bookmark" : "Bookmark this phase"}
      >
        <svg
          className="w-4 h-4"
          fill={isBookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        {isBookmarked ? "Bookmarked" : "Bookmark"}
      </button>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-text-charcoal text-white text-sm rounded-lg shadow-lg animate-fade-in">
          {isBookmarked ? `Bookmarked: ${phaseName}` : `Removed bookmark: ${phaseName}`}
        </div>
      )}
    </>
  );
};

// Reading position tracker
export const ReadingPositionTracker = () => {
  const [lastPosition, setLastPosition] = useState<{ phase: number; scroll: number } | null>(null);
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    // Load last position
    const saved = localStorage.getItem("readingPosition");
    if (saved) {
      const position = JSON.parse(saved);
      // Only show resume if user left mid-reading (not at top)
      if (position.scroll > 200) {
        setLastPosition(position);
        setShowResume(true);
      }
    }

    // Save position periodically
    const savePosition = () => {
      const position = {
        phase: getCurrentPhase(),
        scroll: window.scrollY,
        timestamp: Date.now(),
      };
      localStorage.setItem("readingPosition", JSON.stringify(position));
    };

    const getCurrentPhase = () => {
      const phases = document.querySelectorAll("[data-phase]");
      let currentPhase = 0;
      phases.forEach((phase, index) => {
        const rect = phase.getBoundingClientRect();
        if (rect.top <= 200) {
          currentPhase = index;
        }
      });
      return currentPhase;
    };

    const interval = setInterval(savePosition, 5000);
    window.addEventListener("beforeunload", savePosition);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", savePosition);
    };
  }, []);

  const handleResume = () => {
    if (lastPosition) {
      window.scrollTo({ top: lastPosition.scroll, behavior: "smooth" });
    }
    setShowResume(false);
  };

  const handleDismiss = () => {
    setShowResume(false);
    localStorage.removeItem("readingPosition");
  };

  if (!showResume) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-bg-paper border border-text-charcoal/10 rounded-lg shadow-lg max-w-xs">
      <p className="text-sm text-text-charcoal mb-3">
        Welcome back! Resume where you left off?
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleResume}
          className="px-3 py-1.5 text-sm bg-accent-moss text-white rounded hover:bg-accent-moss/90 transition-colors"
        >
          Resume
        </button>
        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 text-sm text-text-olive hover:text-text-charcoal transition-colors"
        >
          Start Fresh
        </button>
      </div>
    </div>
  );
};

export default BookmarkButton;
