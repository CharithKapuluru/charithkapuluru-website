"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Phase {
  id: number;
  label: string;
}

const defaultPhases: Phase[] = [
  { id: 0, label: "Setup" },
  { id: 1, label: "API" },
  { id: 2, label: "Tests" },
  { id: 3, label: "Lint" },
  { id: 4, label: "Docker" },
  { id: 5, label: "CI/CD" },
  { id: 6, label: "SAST" },
  { id: 7, label: "Trivy" },
];

interface PhaseTimelineProps {
  currentPhase: number;
  onPhaseClick: (phaseId: number) => void;
  phases?: Phase[];
}

const PhaseTimeline = ({ currentPhase, onPhaseClick, phases = defaultPhases }: PhaseTimelineProps) => {
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("userCompletedPhases");
    if (saved) {
      setCompletedPhases(JSON.parse(saved));
    }

    const handleStorageChange = () => {
      const updated = localStorage.getItem("userCompletedPhases");
      if (updated) {
        setCompletedPhases(JSON.parse(updated));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(() => {
      const current = localStorage.getItem("userCompletedPhases");
      if (current) {
        setCompletedPhases(JSON.parse(current));
      }
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-bg-paper/95 backdrop-blur-sm border-b border-text-charcoal/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-12">
          {/* Left: Back + Phase tabs */}
          <div className="flex items-center min-w-0">
            {/* Back button */}
            <Link
              href="/#projects"
              className="flex-shrink-0 flex items-center gap-1.5 pr-4 mr-4 border-r border-text-charcoal/10 text-sm font-serif text-text-olive hover:text-accent-moss transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </Link>

            {/* Phase tabs */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {phases.map((phase) => {
                const isCompleted = completedPhases.includes(phase.id);
                const isCurrent = currentPhase === phase.id;

                return (
                  <button
                    key={phase.id}
                    onClick={() => onPhaseClick(phase.id)}
                    className={`
                      flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-serif transition-all
                      ${isCurrent
                        ? "bg-accent-moss text-white"
                        : isCompleted
                          ? "bg-accent-moss/10 text-accent-moss"
                          : "text-text-olive hover:bg-bg-cream"
                      }
                    `}
                  >
                    <span className="flex items-center gap-1.5">
                      {isCompleted && !isCurrent && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {phase.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: User/Login */}
          <div className="flex-shrink-0 ml-4 relative">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-bg-cream animate-pulse" />
            ) : user ? (
              <>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-serif text-text-olive hover:bg-bg-cream transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-accent-moss/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-accent-moss">
                      {user.displayName?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="hidden sm:inline">{user.displayName?.split(" ")[0]}</span>
                </button>

                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-bg-paper border border-text-charcoal/10 rounded-lg shadow-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-text-charcoal/10">
                        <p className="font-serif text-sm text-text-charcoal truncate">{user.displayName}</p>
                        <p className="text-xs text-text-olive truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm font-serif text-text-olive hover:bg-bg-cream transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-serif text-text-olive hover:bg-bg-cream transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <span className="hidden sm:inline">Sign in</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseTimeline;
