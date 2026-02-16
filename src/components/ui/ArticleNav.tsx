"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Section {
  id: number;
  label: string;
}

interface ArticleNavProps {
  currentSection: number;
  onSectionClick: (sectionId: number) => void;
  sections: Section[];
  backHref?: string;
  backLabel?: string;
}

const ArticleNav = ({
  currentSection,
  onSectionClick,
  sections,
  backHref = "/fundamentals",
  backLabel = "Fundamentals",
}: ArticleNavProps) => {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-bg-paper/95 backdrop-blur-sm border-b border-text-charcoal/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-12">
          {/* Left: Back + Section tabs */}
          <div className="flex items-center min-w-0">
            <Link
              href={backHref}
              className="flex-shrink-0 flex items-center gap-1.5 pr-4 mr-4 border-r border-text-charcoal/10 text-sm font-serif text-text-olive hover:text-accent-moss transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:inline">{backLabel}</span>
            </Link>

            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {sections.map((section) => {
                const isCurrent = currentSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => onSectionClick(section.id)}
                    className={`
                      flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-serif transition-all
                      ${
                        isCurrent
                          ? "bg-accent-moss text-white"
                          : "text-text-olive hover:bg-bg-cream"
                      }
                    `}
                  >
                    {section.label}
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
                  <span className="hidden sm:inline">
                    {user.displayName?.split(" ")[0]}
                  </span>
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-bg-paper border border-text-charcoal/10 rounded-lg shadow-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-text-charcoal/10">
                        <p className="font-serif text-sm text-text-charcoal truncate">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-text-olive truncate">
                          {user.email}
                        </p>
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
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
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

export default ArticleNav;
