"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "@phosphor-icons/react/dist/ssr";

const ORDER = ["system", "light", "dark"] as const;
type Mode = (typeof ORDER)[number];

// Nothing to subscribe to: the snapshot only tells the client render from the server render.
const subscribeNever = () => () => {};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribeNever, () => true, () => false);

  // Before hydration the server and client both render "system", so markup matches.
  const current: Mode = mounted && ORDER.includes(theme as Mode) ? (theme as Mode) : "system";
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
  const Icon = current === "light" ? Sun : current === "dark" ? Moon : Monitor;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${current}, switch to ${next}`}
      title={`Theme: ${current}`}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md text-fg-2 transition-colors duration-150 hover:bg-surface-2 hover:text-fg"
    >
      <Icon size={20} weight="regular" aria-hidden />
    </button>
  );
}
