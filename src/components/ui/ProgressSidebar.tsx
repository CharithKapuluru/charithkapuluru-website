"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

interface Phase {
  id: number;
  label: string;
  title: string;
}

const phases: Phase[] = [
  { id: 0, label: "Setup", title: "Repository Setup and Project Structure" },
  { id: 1, label: "API", title: "Build FastAPI Microservice MVP" },
  { id: 2, label: "Tests", title: "Add Automated Tests with Pytest" },
  { id: 3, label: "Lint", title: "Add Linting and Code Formatting" },
  { id: 4, label: "Docker", title: "Dockerize the Application" },
  { id: 5, label: "CI/CD", title: "CI/CD with GitHub Actions" },
  { id: 6, label: "SAST", title: "SAST Security Scanning with Semgrep" },
  { id: 7, label: "Trivy", title: "Container Scanning with Trivy" },
];

interface ProgressSidebarProps {
  currentPhase: number;
  onPhaseClick: (phaseId: number) => void;
}

const ProgressSidebar = ({ currentPhase, onPhaseClick }: ProgressSidebarProps) => {
  const { user, loading } = useAuth();
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const previousUserRef = useRef(user);

  // Effect 1: Handle auth state changes (login/logout)
  useEffect(() => {
    if (loading) return;

    const wasLoggedIn = previousUserRef.current !== null;
    const isNowLoggedIn = user !== null;

    // User just logged out
    if (wasLoggedIn && !isNowLoggedIn) {
      // Clear everything on logout
      setCompletedPhases([]);
      localStorage.removeItem("userCompletedPhases");
    }

    // User just logged in
    if (!wasLoggedIn && isNowLoggedIn) {
      // Clear localStorage (will use Firestore now)
      localStorage.removeItem("userCompletedPhases");
    }

    previousUserRef.current = user;
  }, [user, loading]);

  // Effect 2: Load progress from storage
  useEffect(() => {
    if (loading) return;

    if (user) {
      // Logged in: Listen to Firestore
      const progressRef = doc(db, "users", user.uid, "progress", "completedPhases");
      const unsubscribe = onSnapshot(
        progressRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setCompletedPhases(data.phases || []);
          } else {
            setCompletedPhases([]);
          }
        },
        (error) => {
          console.error("Error loading progress from Firestore:", error);
          setCompletedPhases([]);
        }
      );
      return () => unsubscribe();
    } else {
      // Not logged in: Load from localStorage
      const saved = localStorage.getItem("userCompletedPhases");
      if (saved) {
        try {
          setCompletedPhases(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing localStorage:", e);
          setCompletedPhases([]);
        }
      }
    }
  }, [user, loading]);

  // Effect 3: Auto-complete phases based on scroll position
  useEffect(() => {
    if (loading) return;

    setCompletedPhases((prev) => {
      const newCompleted = new Set(prev);

      // Add all phases from 0 to (currentPhase - 1) as completed
      for (let i = 0; i < currentPhase; i++) {
        newCompleted.add(i);
      }

      const updated = Array.from(newCompleted);

      // Only save if something changed
      if (JSON.stringify(prev.sort()) === JSON.stringify(updated.sort())) {
        return prev;
      }

      // Save to appropriate storage
      saveProgress(updated);

      return updated;
    });
  }, [currentPhase]); // Only run when currentPhase changes!

  // Helper function to save progress to the right storage
  const saveProgress = (phases: number[]) => {
    if (user) {
      // Logged in: Save to Firestore
      const progressRef = doc(db, "users", user.uid, "progress", "completedPhases");
      setDoc(progressRef, { phases }, { merge: true }).catch((error) => {
        console.error("Error saving to Firestore:", error);
      });
    } else {
      // Not logged in: Save to localStorage
      try {
        localStorage.setItem("userCompletedPhases", JSON.stringify(phases));
      } catch (e) {
        console.error("Error saving to localStorage:", e);
      }
    }
  };

  // Toggle phase completion - manual checkbox only
  const togglePhase = (phaseId: number) => {
    setCompletedPhases((prev) => {
      const newCompleted = prev.includes(phaseId)
        ? prev.filter((id) => id !== phaseId)
        : [...prev, phaseId];

      saveProgress(newCompleted);

      return newCompleted;
    });
  };

  const progressPercentage = Math.round(
    (completedPhases.length / phases.length) * 100
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 p-4 bg-accent-moss text-white rounded-full shadow-lg"
      >
        <span className="text-sm font-mono">{progressPercentage}%</span>
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed right-0 top-1/2 -translate-y-1/2 z-40
          w-64 bg-bg-paper border border-text-charcoal/10 rounded-l-lg shadow-lg
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          hidden lg:block
        `}
      >
        <div className="p-4">
          <h3 className="font-serif text-lg text-text-charcoal mb-4">
            Your Progress
          </h3>

          <div className="space-y-2">
            {phases.map((phase) => {
              const isCompleted = completedPhases.includes(phase.id);
              const isCurrent = currentPhase === phase.id;

              return (
                <div
                  key={phase.id}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                    isCurrent
                      ? "bg-accent-moss/10"
                      : "hover:bg-bg-cream"
                  }`}
                  onClick={() => onPhaseClick(phase.id)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePhase(phase.id);
                    }}
                    className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? "bg-accent-moss border-accent-moss text-white"
                        : "border-text-charcoal/30"
                    }`}
                  >
                    {isCompleted && (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                  <span
                    className={`text-sm ${
                      isCurrent
                        ? "text-accent-moss font-medium"
                        : isCompleted
                        ? "text-text-olive line-through"
                        : "text-text-taupe"
                    }`}
                  >
                    Phase {phase.id}: {phase.label}
                  </span>
                  {isCurrent && (
                    <span className="text-xs text-accent-moss ml-auto">←</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-6 pt-4 border-t border-text-charcoal/10">
            <div className="flex justify-between text-xs font-mono text-text-olive mb-2">
              <span>{progressPercentage}% Complete</span>
              <span>{completedPhases.length}/{phases.length}</span>
            </div>
            <div className="h-2 bg-bg-cream rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-moss transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`
          lg:hidden fixed right-0 top-0 bottom-0 z-40
          w-72 bg-bg-paper shadow-lg
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-4 pt-16">
          <h3 className="font-serif text-lg text-text-charcoal mb-4">
            Your Progress
          </h3>

          <div className="space-y-2">
            {phases.map((phase) => {
              const isCompleted = completedPhases.includes(phase.id);
              const isCurrent = currentPhase === phase.id;

              return (
                <div
                  key={phase.id}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                    isCurrent ? "bg-accent-moss/10" : ""
                  }`}
                  onClick={() => {
                    onPhaseClick(phase.id);
                    setIsOpen(false);
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePhase(phase.id);
                    }}
                    className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? "bg-accent-moss border-accent-moss text-white"
                        : "border-text-charcoal/30"
                    }`}
                  >
                    {isCompleted && (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                  <span
                    className={`text-sm ${
                      isCurrent ? "text-accent-moss font-medium" : "text-text-taupe"
                    }`}
                  >
                    Phase {phase.id}: {phase.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-6 pt-4 border-t border-text-charcoal/10">
            <div className="flex justify-between text-xs font-mono text-text-olive mb-2">
              <span>{progressPercentage}% Complete</span>
            </div>
            <div className="h-2 bg-bg-cream rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-moss transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressSidebar;
