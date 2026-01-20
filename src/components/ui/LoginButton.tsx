"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const LoginButton = () => {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <div className="w-6 h-6 rounded-full bg-bg-stone/50 animate-pulse" />
    );
  }

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-serif text-text-olive hover:text-accent-moss transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-accent-moss/20 flex items-center justify-center">
            <span className="text-xs font-medium font-serif text-accent-moss">
              {user.displayName?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <span className="hidden sm:inline">
            {user.displayName?.split(" ")[0] || "User"}
          </span>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-56 bg-bg-paper border border-text-charcoal/10 rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 bg-bg-cream/50 border-b border-text-charcoal/10">
                <p className="font-medium font-serif text-text-charcoal text-sm truncate">
                  {user.displayName || "User"}
                </p>
                <p className="text-xs font-serif text-text-olive truncate">{user.email}</p>
              </div>
              <div className="p-2">
                <p className="px-3 py-2 text-xs font-serif text-text-olive">
                  Notes and bookmarks synced
                </p>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm font-serif text-accent-terracotta hover:bg-bg-cream rounded transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="flex items-center gap-2 text-sm font-serif text-text-olive hover:text-accent-moss transition-colors group"
    >
      <div className="w-7 h-7 rounded-full bg-bg-stone/50 group-hover:bg-accent-moss/10 flex items-center justify-center transition-colors">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      </div>
      <span className="hidden sm:inline">Sign in</span>
    </button>
  );
};

export default LoginButton;
