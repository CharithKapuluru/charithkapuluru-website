"use client";

import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function SignInControl({ className }: { className?: string }) {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  if (loading) return null;
  if (!user) {
    return (
      <Button variant="secondary" size="sm" onClick={signInWithGoogle} className={className}>
        Sign in with Google
      </Button>
    );
  }
  return (
    <div className={cn("flex items-center justify-between gap-2 text-caption text-fg-3", className)}>
      <span className="truncate">Signed in as {user.displayName?.split(" ")[0] || user.email}</span>
      <button type="button" onClick={logout} className="shrink-0 px-1 py-1 text-fg-2 underline-offset-2 hover:underline">
        Sign out
      </button>
    </div>
  );
}
