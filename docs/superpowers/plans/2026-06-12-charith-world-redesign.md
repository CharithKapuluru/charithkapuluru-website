# Charith's World Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild charithkapuluru.com as an immersive illustrated "world" with a cartoon avatar guide, per the spec in `docs/superpowers/specs/2026-06-12-website-redesign-design.md`.

**Architecture:** Keep the existing Next.js 16 static-export + Firebase stack and all content components. Re-theme the 12k+ lines of tutorial content by redefining the existing CSS token VALUES (names stay: `--bg-paper`, `--accent-moss`, `--font-serif`...), then hand-build the new "world" layer: scenes, avatar rig, speech bubbles, transitions, and rebuilt page shells.

**Tech Stack:** Next.js 16, Tailwind v4 (`@theme inline` tokens), framer-motion 12 (already installed), Lenis, Phosphor icons, sharp + rembg (build-time asset processing only).

**Deviations from spec (justified):**
- **No GSAP.** Final scope contains no pin/scrub scroll-hijack patterns; framer-motion's `useScroll`/`useInView` covers every animation we ship, avoids Lenis/ScrollTrigger sync work, and follows the taste-skill rule "save GSAP for actual pin/scrub work."
- **Testing:** the repo has zero test infrastructure. Verification gates are `npx tsc --noEmit`, `npm run build` (which statically renders every route), `npm run lint`, plus visual checks in the dev server. Adding a test harness for a visual redesign is out of scope (YAGNI).

**Verify after every task:** `npx tsc --noEmit && npm run build` must pass before each commit.

---

### Task 1: Baseline commit of pre-existing work

**Files:**
- Commit (already modified/untracked): `src/components/projects/LinuxSysAdminProject.tsx`, `src/app/contact/page.tsx`, `src/lib/projectsData.ts`, `src/app/projects/[slug]/page.tsx`, `avatar-art/`
- Move: `Mypic.PNG` → `avatar-art/photo.png`
- Delete: `public/Charith_Kapuluru_Resume.pdf` (superseded by `ck.pdf`)

- [ ] **Step 1: Verify current state builds**

Run: `npm run build`
Expected: build succeeds (if it fails, fix nothing else until it does; report).

- [ ] **Step 2: Move photo, delete stale resume**

```bash
git mv Mypic.PNG avatar-art/photo.png 2>/dev/null || mv Mypic.PNG avatar-art/photo.png
git rm --cached public/Charith_Kapuluru_Resume.pdf 2>/dev/null; rm -f public/Charith_Kapuluru_Resume.pdf
```

- [ ] **Step 3: Commit baseline**

```bash
git add -A
git commit -m "feat: baseline before world redesign (Linux project page, contact page, avatar art)"
```

---

### Task 2: Install dependencies

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Install runtime + build deps**

```bash
npm install @phosphor-icons/react
npm install -D sharp
```

- [ ] **Step 2: Verify**

Run: `node -e "require('sharp'); console.log('sharp ok')"`
Expected: `sharp ok`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add phosphor icons and sharp"
```

---

### Task 3: Asset pipeline (background removal + WebP)

**Files:**
- Create: `scripts/process-art.mjs`
- Output (generated, committed): `public/world/poses/*.webp`, `public/world/scenes/*.webp`, `public/world/charith-photo.webp`

- [ ] **Step 1: Remove backgrounds from the 9 pose images with rembg**

rembg is a Python CLI. Use uvx (install uv via `brew install uv` if missing):

```bash
mkdir -p avatar-art/cut
for f in master wave laptop peek point read bored lost head; do
  uvx --from "rembg[cli]" rembg i "avatar-art/$f.png" "avatar-art/cut/$f.png"
done
```

Expected: 9 files in `avatar-art/cut/`, each with transparent background. Open `avatar-art/cut/wave.png` with the Read tool and confirm: subject intact, background gone, no missing limbs. If rembg clips the white shirt, retry that file with `uvx --from "rembg[cli]" rembg i -m isnet-general-use ...`.

- [ ] **Step 2: Write the conversion script**

```js
// scripts/process-art.mjs
// One-time art pipeline: poses (transparent) -> trimmed webp,
// scenes -> 3 responsive webp sizes, photo -> webp.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const POSES = ["master", "wave", "laptop", "peek", "point", "read", "bored", "lost", "head"];
const SCENES = ["hill", "workshop", "library", "mailbox", "woods"];
const SCENE_WIDTHS = [1920, 1280, 768];

await mkdir("public/world/poses", { recursive: true });
await mkdir("public/world/scenes", { recursive: true });

for (const name of POSES) {
  await sharp(`avatar-art/cut/${name}.png`)
    .trim()
    .resize({ width: name === "head" ? 800 : 600, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(`public/world/poses/${name}.webp`);
  console.log("pose:", name);
}

for (const name of SCENES) {
  for (const w of SCENE_WIDTHS) {
    await sharp(`avatar-art/scene-${name}.png`)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(`public/world/scenes/${name}-${w}.webp`);
  }
  console.log("scene:", name);
}

await sharp("avatar-art/photo.png")
  .resize({ width: 800, withoutEnlargement: true })
  .webp({ quality: 85 })
  .toFile("public/world/charith-photo.webp");
console.log("photo done");
```

- [ ] **Step 3: Run it and verify sizes**

```bash
node scripts/process-art.mjs && du -sh public/world && ls public/world/poses public/world/scenes
```

Expected: 9 pose webp + 15 scene webp + photo. `public/world` total under ~4 MB; each pose under 100 KB; each 1920 scene under 400 KB.

- [ ] **Step 4: Commit**

```bash
git add scripts/process-art.mjs public/world avatar-art/cut
git commit -m "feat: world art pipeline and processed webp assets"
```

---

### Task 4: New design tokens and fonts

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Swap fonts in `src/app/layout.tsx`**

Replace the font imports/instances (lines 1-25) so the file header becomes:

```tsx
import type { Metadata } from "next";
import { Fredoka, Nunito, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Charith Kapuluru | Cloud & DevOps Engineer",
  description:
    "Charith builds cloud infrastructure, DevSecOps pipelines, and friendly explanations of how computers actually work. Come say hi to the cartoon version of him.",
  keywords: ["DevOps", "Cloud", "AWS", "Linux", "Software Engineer", "Portfolio"],
};
```

And update the `<html>` className to `${fredoka.variable} ${nunito.variable} ${jetbrainsMono.variable}`. Keep AuthProvider/ThemeProvider/SmoothScroll/noise-overlay structure as is for now (noise overlay is removed in step 2 CSS).

- [ ] **Step 2: Rewrite token values in `src/app/globals.css`**

Replace the `@theme inline` block, `:root`, and `.dark` blocks (lines 3-52) with:

```css
@theme inline {
  /* Daylight palette. Token NAMES preserved so existing components re-theme automatically. */
  --color-bg-paper: #ffffff;   /* paper panels */
  --color-bg-cream: #f0f9ff;   /* sky-tinted section bg */
  --color-bg-stone: #e0f2fe;   /* deeper sky tint */

  --color-text-charcoal: #0f172a;
  --color-text-taupe: #334155;
  --color-text-olive: #475569;

  --color-accent-moss: #15803d;        /* THE interactive accent (grass green) */
  --color-accent-terracotta: #dc2626;  /* errors/warnings only */
  --color-accent-sand: #eab308;        /* sun yellow, decorative badges */
  --color-accent-sage: #86efac;        /* light grass, decorative */

  --font-sans: var(--font-nunito);
  --font-serif: var(--font-fredoka); /* display font; old font-serif headings become Fredoka */
  --font-mono: var(--font-jetbrains);
}

:root {
  --bg-paper: #ffffff;
  --bg-cream: #f0f9ff;
  --bg-stone: #e0f2fe;

  --text-charcoal: #0f172a;
  --text-taupe: #334155;
  --text-olive: #475569;

  --accent-moss: #15803d;
  --accent-terracotta: #dc2626;
  --accent-sand: #eab308;
  --accent-sage: #86efac;

  --sky-top: #bfdbfe;
  --sky-bottom: #dbeafe;
  --grass: #bbf7d0;
}

/* Theme lock: dark mode deferred until the day/night toggle ships.
   .dark intentionally mirrors daylight so any lingering toggle is a no-op. */
.dark {
  --bg-paper: #ffffff;
  --bg-cream: #f0f9ff;
  --bg-stone: #e0f2fe;
  --text-charcoal: #0f172a;
  --text-taupe: #334155;
  --text-olive: #475569;
  --accent-moss: #15803d;
  --accent-terracotta: #dc2626;
  --accent-sand: #eab308;
  --accent-sage: #86efac;
}
```

Then, further down the file:
1. Delete the `.noise-overlay` utility block entirely (the grain texture fights the flat cartoon style), and delete `.text-gradient-earth` and `.organic-blur` (unused in the new world; verify with `grep -rn "text-gradient-earth\|organic-blur" src/` and remove usages if any appear).
2. Add new utilities inside `@layer utilities`:

```css
  .sky-gradient {
    background: linear-gradient(180deg, var(--sky-top) 0%, var(--sky-bottom) 60%, var(--grass) 100%);
  }
  .paper-shadow {
    box-shadow: 0 8px 30px -8px rgb(15 23 42 / 0.12);
  }
```

3. Add a reduced-motion guard at the end of the file:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Remove the noise overlay div from `src/app/layout.tsx`**

Delete the line `<div className="noise-overlay" />`.

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit && npm run build
```
Expected: PASS. Then `npm run dev`, open http://localhost:3000/fundamentals/cron-jobs — the article should render with new colors (white/ sky tints, green accent) and Fredoka headings. Content fully readable.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: daylight design tokens, Fredoka/Nunito fonts"
```

---

### Task 5: World core - provider, avatar rig, speech bubble, paper panel

**Files:**
- Create: `src/components/world/WorldProvider.tsx`
- Create: `src/components/world/Avatar.tsx`
- Create: `src/components/world/SpeechBubble.tsx`
- Create: `src/components/world/PaperPanel.tsx`
- Create: `src/lib/avatarLines.ts`
- Modify: `src/app/layout.tsx` (mount WorldProvider)

- [ ] **Step 1: Create `src/components/world/WorldProvider.tsx`**

```tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

interface WorldContextType {
  soundOn: boolean;
  toggleSound: () => void;
  boop: (freq?: number) => void;
  wheee: () => void;
}

const WorldContext = createContext<WorldContextType | null>(null);

export const useWorld = () => {
  const ctx = useContext(WorldContext);
  if (!ctx) throw new Error("useWorld must be used within WorldProvider");
  return ctx;
};

export const WorldProvider = ({ children }: { children: ReactNode }) => {
  const [soundOn, setSoundOn] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => {
    setSoundOn(localStorage.getItem("world-sound") === "on");
  }, []);

  const getCtx = () => {
    if (!audioCtx.current) {
      audioCtx.current = new AudioContext();
    }
    return audioCtx.current;
  };

  const playTone = useCallback(
    (freq: number, duration: number, type: OscillatorType = "sine") => {
      if (!soundOn) return;
      try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        /* audio blocked; stay silent */
      }
    },
    [soundOn]
  );

  const boop = useCallback((freq = 520) => playTone(freq, 0.15), [playTone]);

  const wheee = useCallback(() => {
    if (!soundOn) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      /* silent */
    }
  }, [soundOn]);

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev;
      localStorage.setItem("world-sound", next ? "on" : "off");
      return next;
    });
  }, []);

  return (
    <WorldContext.Provider value={{ soundOn, toggleSound, boop, wheee }}>
      {children}
    </WorldContext.Provider>
  );
};
```

- [ ] **Step 2: Create `src/components/world/Avatar.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useWorld } from "./WorldProvider";

export type PoseName =
  | "master"
  | "wave"
  | "laptop"
  | "peek"
  | "point"
  | "read"
  | "bored"
  | "lost";

const POSE_ALT: Record<PoseName, string> = {
  master: "Cartoon Charith standing and smiling",
  wave: "Cartoon Charith waving hello",
  laptop: "Cartoon Charith sitting cross-legged, typing on a laptop",
  peek: "Cartoon Charith leaning over curiously",
  point: "Cartoon Charith pointing to the side",
  read: "Cartoon Charith in reading glasses holding a book",
  bored: "Cartoon Charith looking at his phone, bored",
  lost: "Cartoon Charith holding a map upside down, confused",
};

const POKE_LINES = [
  "hi!",
  "that tickles",
  "yes?",
  "still me",
  "ok ok stop poking me",
];

interface AvatarProps {
  pose?: PoseName;
  width?: number;
  flip?: boolean;
  className?: string;
  /** Tilt the whole sprite toward the cursor. */
  track?: boolean;
  /** Show poke speech lines when clicked. */
  pokeable?: boolean;
}

export default function Avatar({
  pose = "master",
  width = 220,
  flip = false,
  className = "",
  track = false,
  pokeable = true,
}: AvatarProps) {
  const reduce = useReducedMotion();
  const { boop } = useWorld();
  const ref = useRef<HTMLDivElement>(null);
  const [pokeCount, setPokeCount] = useState(0);
  const [pokeLine, setPokeLine] = useState<string | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotate = useSpring(useTransform(mx, [-1, 1], [-7, 7]), {
    stiffness: 120,
    damping: 14,
  });
  const tiltY = useSpring(useTransform(my, [-1, 1], [-4, 6]), {
    stiffness: 120,
    damping: 14,
  });

  useEffect(() => {
    if (!track || reduce) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mx.set(Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2))));
      my.set(Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2))));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [track, reduce, mx, my]);

  const handlePoke = () => {
    if (!pokeable) return;
    boop(420 + pokeCount * 80);
    const next = Math.min(pokeCount + 1, POKE_LINES.length);
    setPokeCount(next);
    setPokeLine(POKE_LINES[next - 1]);
    setTimeout(() => setPokeLine(null), 1800);
  };

  return (
    <motion.div
      ref={ref}
      onClick={handlePoke}
      style={track && !reduce ? { rotate, y: tiltY } : undefined}
      whileTap={pokeable ? { scale: 0.96 } : undefined}
      className={`relative inline-block select-none ${pokeable ? "cursor-pointer" : ""} ${className}`}
    >
      {pokeLine && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-bg-paper px-3 py-1.5 font-serif text-sm text-text-charcoal paper-shadow"
        >
          {pokeLine}
        </motion.div>
      )}
      <Image
        src={`/world/poses/${pose}.webp`}
        alt={POSE_ALT[pose]}
        width={width}
        height={Math.round(width * 1.4)}
        className={flip ? "-scale-x-100" : ""}
        priority={false}
      />
    </motion.div>
  );
}

/** Head-only sprite that leans toward the cursor. Used in nav / hero corners. */
export function AvatarHead({ width = 90, className = "" }: { width?: number; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotate = useSpring(useTransform(mx, [-1, 1], [-14, 14]), {
    stiffness: 150,
    damping: 12,
  });
  const ty = useSpring(useTransform(my, [-1, 1], [-5, 5]), {
    stiffness: 150,
    damping: 12,
  });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mx.set(Math.max(-1, Math.min(1, (e.clientX - cx) / 500)));
      my.set(Math.max(-1, Math.min(1, (e.clientY - cy) / 500)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  return (
    <motion.div ref={ref} style={reduce ? undefined : { rotate, y: ty }} className={`inline-block ${className}`}>
      <Image
        src="/world/poses/head.webp"
        alt="Cartoon Charith's head, watching the cursor"
        width={width}
        height={width}
      />
    </motion.div>
  );
}
```

- [ ] **Step 3: Create `src/components/world/SpeechBubble.tsx`**

```tsx
"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SpeechBubbleProps {
  children: ReactNode;
  /** Which side the tail points toward (where the avatar is). */
  tail?: "left" | "right" | "bottom";
  className?: string;
  delay?: number;
}

export default function SpeechBubble({
  children,
  tail = "bottom",
  className = "",
  delay = 0,
}: SpeechBubbleProps) {
  const reduce = useReducedMotion();
  const tailClasses = {
    left: "left-[-7px] top-1/2 -translate-y-1/2",
    right: "right-[-7px] top-1/2 -translate-y-1/2",
    bottom: "bottom-[-7px] left-1/2 -translate-x-1/2",
  }[tail];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.85, y: 8 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay }}
      className={`relative inline-block rounded-2xl bg-bg-paper px-4 py-2.5 font-serif text-text-charcoal paper-shadow ${className}`}
    >
      {children}
      <span
        aria-hidden
        className={`absolute h-3.5 w-3.5 rotate-45 bg-bg-paper ${tailClasses}`}
      />
    </motion.div>
  );
}
```

- [ ] **Step 4: Create `src/components/world/PaperPanel.tsx`**

```tsx
import { ReactNode } from "react";

/** Readable white surface that floats over scene art. */
export default function PaperPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-bg-paper paper-shadow ${className}`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Create `src/lib/avatarLines.ts`**

```ts
/** Goofy one-liners the avatar says in article/project margins. */
export const avatarLines: Record<string, string> = {
  // fundamentals
  "computing-basics": "a VM is just a computer wearing a costume",
  "networking-basics": "NAT is why your router lies about your address",
  "linux-filesystem": "everything is a file. yes, everything",
  "file-permissions": "chmod 777 is how you summon a security engineer",
  "linux-environment": "$PATH is just a list of places to look. relatable",
  "systemd-and-boot": "PID 1 is the boss. do not anger PID 1",
  "linux-directories": "/etc: where config files go to multiply",
  "ports-firewalls-security": "port 22 is where everyone knocks first",
  "cron-jobs": "cron runs while you sleep. cron never sleeps",
  "docker-and-nginx": "'works on my machine' is now a shipping strategy",
  // projects
  "devsecops-pipeline": "this pipeline rejects my own bad code too",
  "terraform-ecs-deployment": "I described a server in text and it appeared",
  "linux-sysadmin-deep-dive": "I broke this server so you do not have to",
};
```

- [ ] **Step 6: Mount WorldProvider in `src/app/layout.tsx`**

Wrap inside ThemeProvider:

```tsx
<AuthProvider>
  <ThemeProvider>
    <WorldProvider>
      <SmoothScroll />
      {children}
    </WorldProvider>
  </ThemeProvider>
</AuthProvider>
```

Add `import { WorldProvider } from "@/components/world/WorldProvider";`.

- [ ] **Step 7: Verify and commit**

```bash
npx tsc --noEmit && npm run build
git add src/components/world src/lib/avatarLines.ts src/app/layout.tsx
git commit -m "feat: world core (provider, avatar rig, speech bubble, paper panel)"
```

---

### Task 6: WorldNav and CloudTransition

**Files:**
- Create: `src/components/world/WorldNav.tsx`
- Create: `src/app/template.tsx` (cloud sweep on every navigation)

- [ ] **Step 1: Create `src/components/world/WorldNav.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { useWorld } from "./WorldProvider";
import { AvatarHead } from "./Avatar";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/fundamentals", label: "Fundamentals" },
  { href: "/contact", label: "Contact" },
];

export default function WorldNav() {
  const pathname = usePathname();
  const { soundOn, toggleSound, boop } = useWorld();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-text-charcoal/5 bg-bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <AvatarHead width={44} />
          <span className="font-serif text-lg font-semibold text-text-charcoal">
            charith.dev
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-5">
          {LINKS.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3 py-1.5 font-sans text-sm transition-colors ${
                  active
                    ? "bg-bg-stone font-bold text-text-charcoal"
                    : "text-text-olive hover:text-accent-moss"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <a
            href="/ck.pdf"
            download="Charith_Kapuluru_Resume.pdf"
            className="hidden rounded-full bg-text-charcoal px-4 py-2 font-sans text-sm font-bold text-white transition-colors hover:bg-accent-moss active:scale-[0.98] md:block"
          >
            Resume
          </a>
          <button
            onClick={() => {
              toggleSound();
              boop();
            }}
            aria-label={soundOn ? "Mute sounds" : "Enable sounds"}
            className="rounded-full p-2 text-text-olive transition-colors hover:bg-bg-stone hover:text-text-charcoal"
          >
            {soundOn ? <SpeakerHigh size={18} weight="bold" /> : <SpeakerSlash size={18} weight="bold" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
```

Note: nav fits on one line at `lg` (4 items + logo), height 64px (cap is 80px). The "straightens his tie" resume-hover gag from the spec is cut for nav simplicity; the hero Resume link keeps it via title text (Task 7).

- [ ] **Step 2: Create `src/app/template.tsx`**

App Router remounts `template.tsx` on every navigation, giving us the cloud sweep:

```tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 900);
    return () => clearTimeout(t);
  }, []);

  if (reduce) return <>{children}</>;

  return (
    <>
      {!done && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ x: "0%" }}
              animate={{ x: "130vw" }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: [0.6, 0, 0.3, 1] }}
              className="absolute rounded-full bg-white"
              style={{
                width: "70vw",
                height: "45vh",
                left: `-${75 + i * 10}vw`,
                top: `${i * 30}vh`,
                filter: "blur(8px)",
              }}
            />
          ))}
        </div>
      )}
      {children}
    </>
  );
}
```

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit && npm run build
```
Then in `npm run dev`: navigate between / and /fundamentals — soft clouds sweep across on each navigation; with macOS "Reduce Motion" enabled, no clouds.

```bash
git add src/components/world/WorldNav.tsx src/app/template.tsx
git commit -m "feat: world nav and cloud page transition"
```

---

### Task 7: The Hill (homepage rewrite)

**Files:**
- Create: `src/components/world/scenes/HillScene.tsx`
- Create: `src/components/home/WorkshopSection.tsx`
- Create: `src/components/home/LibrarySection.tsx`
- Create: `src/components/home/AboutSection.tsx`
- Create: `src/components/home/GrassFooter.tsx`
- Modify: `src/app/page.tsx`
- Delete: `src/components/sections/Projects.tsx`, `src/components/sections/Contact.tsx`, `src/components/sections/Footer.tsx` (after page.tsx stops importing them)

- [ ] **Step 1: Create `src/components/world/scenes/HillScene.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import Avatar from "@/components/world/Avatar";
import SpeechBubble from "@/components/world/SpeechBubble";

export default function HillScene() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      {/* Scene art */}
      <img
        src="/world/scenes/hill-1920.webp"
        srcSet="/world/scenes/hill-768.webp 768w, /world/scenes/hill-1280.webp 1280w, /world/scenes/hill-1920.webp 1920w"
        sizes="100vw"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-bottom"
        fetchPriority="high"
      />
      {/* Drifting bonus clouds */}
      {!reduce &&
        [0, 1].map((i) => (
          <motion.div
            key={i}
            aria-hidden
            initial={{ x: "-20vw" }}
            animate={{ x: "120vw" }}
            transition={{ duration: 70 + i * 25, repeat: Infinity, ease: "linear", delay: i * 18 }}
            className="absolute rounded-full bg-white/80 blur-[2px]"
            style={{ width: 120 + i * 60, height: 36 + i * 14, top: `${10 + i * 9}%` }}
          />
        ))}

      {/* Copy: sits on the upper sky area (light blue, AA contrast with ink text) */}
      <div className="relative mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-center px-5 pt-24 md:px-8">
        <div className="max-w-xl">
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl font-semibold tracking-tight text-text-charcoal md:text-6xl"
            style={{ textWrap: "balance" }}
          >
            Hi, I&apos;m Charith. I build cloud things.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-md font-sans text-lg text-text-taupe"
          >
            DevOps engineer, Linux tinkerer, and your guide to this little world.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <a
              href="#workshop"
              className="inline-block rounded-full bg-text-charcoal px-7 py-3.5 font-sans text-base font-bold text-white transition-colors hover:bg-accent-moss active:scale-[0.98]"
            >
              See my work
            </a>
          </motion.div>
        </div>
      </div>

      {/* Avatar under the tree (right side, bottom) */}
      <div className="absolute bottom-[4%] right-[6%] hidden items-end gap-3 md:flex">
        <SpeechBubble tail="right" delay={0.8} className="mb-24">
          oh hey, you found me
        </SpeechBubble>
        <Avatar pose="wave" width={210} track />
      </div>
      {/* Mobile avatar, smaller, centered low */}
      <div className="absolute bottom-2 right-3 md:hidden">
        <Avatar pose="wave" width={120} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/home/WorkshopSection.tsx`**

Asymmetric project cards (NOT 3 equal columns: first project spans wide, two stack beside it). Uses existing `projects` data.

```tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Wrench } from "@phosphor-icons/react";
import { projects } from "@/lib/projectsData";
import Avatar from "@/components/world/Avatar";
import SpeechBubble from "@/components/world/SpeechBubble";

export default function WorkshopSection() {
  const reduce = useReducedMotion();
  const [first, ...rest] = projects;

  const card = (p: (typeof projects)[number], big: boolean) => (
    <motion.div
      key={p.id}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link
        href={`/projects/${p.slug}`}
        className="group flex h-full flex-col rounded-2xl bg-bg-paper p-6 paper-shadow transition-transform hover:-translate-y-1 md:p-8"
      >
        <div className="mb-3 flex items-center gap-2 text-accent-moss">
          <Wrench size={20} weight="bold" />
          <span className="font-sans text-xs font-bold uppercase tracking-wide">
            {p.phaseCount} phases
          </span>
        </div>
        <h3
          className={`font-serif font-semibold text-text-charcoal group-hover:text-accent-moss ${
            big ? "text-3xl md:text-4xl" : "text-2xl"
          }`}
        >
          {p.title}
        </h3>
        <p className="mt-3 grow font-sans text-text-taupe">{p.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {p.technologies.slice(0, big ? 8 : 4).map((t) => (
            <span
              key={t}
              className="rounded-full bg-bg-stone px-3 py-1 font-mono text-xs text-text-olive"
            >
              {t}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );

  return (
    <section id="workshop" className="bg-bg-cream py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 flex items-end justify-between gap-6">
          <h2 className="font-serif text-4xl font-semibold text-text-charcoal md:text-5xl">
            The Workshop
          </h2>
          <div className="hidden items-end gap-2 md:flex">
            <SpeechBubble tail="right">things I actually built</SpeechBubble>
            <Avatar pose="point" width={110} flip pokeable={false} />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3">{card(first, true)}</div>
          <div className="flex flex-col gap-6 md:col-span-2">
            {rest.map((p) => card(p, false))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `src/components/home/LibrarySection.tsx`**

```tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { topics } from "@/lib/fundamentalsData";

const SPINE_COLORS = [
  "#15803d", "#0369a1", "#b45309", "#7c3aed", "#be185d",
  "#0f766e", "#a16207", "#1d4ed8", "#c2410c", "#4d7c0f",
];

export default function LibrarySection() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-bg-paper py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <h2 className="font-serif text-4xl font-semibold text-text-charcoal md:text-5xl">
          The Library
        </h2>
        <p className="mt-3 max-w-[65ch] font-sans text-lg text-text-taupe">
          {topics.length} plain-language guides to how computers actually work.
          Zero assumptions, real analogies, occasional jokes.
        </p>

        {/* Bookshelf: spines lean out on hover */}
        <Link href="/fundamentals" className="mt-10 block" aria-label="Browse all Fundamentals articles">
          <div className="flex items-end gap-1.5 overflow-x-auto rounded-2xl bg-bg-stone p-6 pb-0">
            {topics.map((t, i) => (
              <motion.div
                key={t.id}
                whileHover={reduce ? undefined : { y: -14 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex h-44 w-12 shrink-0 items-end justify-center rounded-t-md pb-3 md:w-14"
                style={{ backgroundColor: SPINE_COLORS[i % SPINE_COLORS.length] }}
                title={t.title}
              >
                <span
                  className="font-sans text-[11px] font-bold text-white"
                  style={{ writingMode: "vertical-rl" }}
                >
                  {t.title}
                </span>
              </motion.div>
            ))}
            <div className="h-3 w-full" />
          </div>
          <div className="rounded-b-2xl bg-[#a16207]/80 py-2 text-center font-sans text-sm font-bold text-white">
            browse the shelf
          </div>
        </Link>
      </div>
    </section>
  );
}
```

(Vertical book-spine text here is bookshelf realism, an explicit composition reason, not the banned decorative rotated-label pattern.)

- [ ] **Step 4: Create `src/components/home/AboutSection.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import Avatar from "@/components/world/Avatar";
import SpeechBubble from "@/components/world/SpeechBubble";

export default function AboutSection() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-bg-cream py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
        <div className="flex items-center justify-center gap-4">
          <motion.div
            initial={reduce ? false : { opacity: 0, rotate: -6 }}
            whileInView={{ opacity: 1, rotate: -3 }}
            viewport={{ once: true }}
            className="w-64 rounded-md bg-white p-3 pb-10 paper-shadow"
          >
            <img
              src="/world/charith-photo.webp"
              alt="Charith Kapuluru, the real one, in a navy suit"
              className="w-full rounded-sm"
            />
            <p className="mt-3 text-center font-serif text-sm text-text-taupe">
              the real one
            </p>
          </motion.div>
          <div className="hidden flex-col items-center gap-2 md:flex">
            <SpeechBubble tail="bottom">that&apos;s me, allegedly</SpeechBubble>
            <Avatar pose="point" width={130} />
          </div>
        </div>

        <div>
          <h2 className="font-serif text-4xl font-semibold text-text-charcoal md:text-5xl">
            About the human
          </h2>
          <div className="mt-5 space-y-4 font-sans text-lg text-text-taupe">
            <p>
              I&apos;m a software engineer doing my Master&apos;s in Computer Science at the
              University of North Texas. Before that I spent three years at KANsolv
              Technologies breaking monoliths into microservices on AWS and building
              the pipelines that kept them honest.
            </p>
            <p>
              I like Linux, Terraform, and explaining hard things simply. I won a
              cybersecurity hackathon once and have been insufferable about it since.
            </p>
          </div>
          <a
            href="/ck.pdf"
            download="Charith_Kapuluru_Resume.pdf"
            title="he straightens his tie when you hover this"
            className="mt-8 inline-block rounded-full bg-text-charcoal px-7 py-3.5 font-sans text-base font-bold text-white transition-colors hover:bg-accent-moss active:scale-[0.98]"
          >
            Grab my resume
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create `src/components/home/GrassFooter.tsx`**

```tsx
import Link from "next/link";

export default function GrassFooter() {
  return (
    <footer className="sky-gradient relative pt-20">
      <div className="mx-auto max-w-7xl px-5 pb-10 md:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="font-serif text-2xl font-semibold text-text-charcoal">
            Want to talk? <Link href="/contact" className="text-accent-moss underline underline-offset-4 hover:no-underline">Visit the mailbox</Link>
          </p>
          <div className="flex gap-8 font-sans text-sm font-bold text-text-olive">
            <a href="https://github.com/CharithKapuluru" target="_blank" rel="noopener noreferrer" className="hover:text-accent-moss">GitHub</a>
            <a href="https://www.linkedin.com/in/charith-kapuluru-159456329/" target="_blank" rel="noopener noreferrer" className="hover:text-accent-moss">LinkedIn</a>
            <a href="mailto:kapulurucharith@gmail.com" className="hover:text-accent-moss">Email</a>
          </div>
          <p className="font-sans text-xs text-text-olive" suppressHydrationWarning>
            built with too many tabs open. {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Rewrite `src/app/page.tsx`**

```tsx
import WorldNav from "@/components/world/WorldNav";
import HillScene from "@/components/world/scenes/HillScene";
import WorkshopSection from "@/components/home/WorkshopSection";
import LibrarySection from "@/components/home/LibrarySection";
import AboutSection from "@/components/home/AboutSection";
import GrassFooter from "@/components/home/GrassFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-paper">
      <WorldNav />
      <HillScene />
      <WorkshopSection />
      <LibrarySection />
      <AboutSection />
      <GrassFooter />
    </main>
  );
}
```

- [ ] **Step 7: Delete the old section components**

```bash
grep -rn "sections/Projects\|sections/Contact\|sections/Footer" src/ 
```
Expected: no matches outside the deleted page version. Then:

```bash
git rm src/components/sections/Projects.tsx src/components/sections/Contact.tsx src/components/sections/Footer.tsx
```

(`ResumeButton`, `ProjectCard`, `LoginButton` etc. stay; some may now be unused - leave cleanup for Task 13.)

- [ ] **Step 8: Verify and commit**

```bash
npx tsc --noEmit && npm run build
```
Dev-server check at /: hill scene fills the viewport, headline 2 lines max, single CTA visible without scrolling, avatar waves bottom-right and tilts toward cursor, workshop cards asymmetric, bookshelf hover works, polaroid + about strip, grass footer.

```bash
git add -A
git commit -m "feat: homepage rebuilt as The Hill with workshop, library, about, footer"
```

---

### Task 8: The Library (fundamentals index + article shells)

**Files:**
- Modify: `src/app/fundamentals/page.tsx` (full rewrite of hero; keep topic grid data-driven)
- Create: `src/components/world/scenes/LibraryHeader.tsx`
- Modify: `src/app/fundamentals/[slug]/page.tsx` (wrap with header + margin avatar)

- [ ] **Step 1: Create `src/components/world/scenes/LibraryHeader.tsx`**

```tsx
import Avatar from "@/components/world/Avatar";
import SpeechBubble from "@/components/world/SpeechBubble";

interface LibraryHeaderProps {
  title: string;
  subtitle?: string;
  avatarLine?: string;
}

export default function LibraryHeader({ title, subtitle, avatarLine }: LibraryHeaderProps) {
  return (
    <header className="relative overflow-hidden">
      <img
        src="/world/scenes/library-1920.webp"
        srcSet="/world/scenes/library-768.webp 768w, /world/scenes/library-1280.webp 1280w, /world/scenes/library-1920.webp 1920w"
        sizes="100vw"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-text-charcoal/10 to-text-charcoal/45" />
      <div className="relative mx-auto flex min-h-[320px] max-w-5xl items-end justify-between gap-6 px-5 pb-8 pt-28 md:px-8">
        <div className="max-w-2xl rounded-2xl bg-bg-paper/95 p-6 paper-shadow">
          <h1 className="font-serif text-3xl font-semibold text-text-charcoal md:text-5xl" style={{ textWrap: "balance" }}>
            {title}
          </h1>
          {subtitle && <p className="mt-2 font-sans text-text-taupe">{subtitle}</p>}
        </div>
        {avatarLine && (
          <div className="hidden flex-col items-center gap-2 lg:flex">
            <SpeechBubble tail="bottom">{avatarLine}</SpeechBubble>
            <Avatar pose="read" width={140} />
          </div>
        )}
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Rewrite the hero of `src/app/fundamentals/page.tsx`**

Replace the existing hero `<section>` (the gradient/grid-pattern block with the "9 sections / ~35 min" stats row) and the top nav block with:

```tsx
<WorldNav />
<LibraryHeader
  title="The Library"
  subtitle="Plain-language guides to how computers actually work. Pick a book."
  avatarLine="I read all of these. wrote them too"
/>
```

Add imports `import WorldNav from "@/components/world/WorldNav";` and `import LibraryHeader from "@/components/world/scenes/LibraryHeader";`. Delete the now-unused emoji stats row entirely (it has the stale "9 sections" copy and banned emoji icons). Keep the existing topic-card grid below (it is data-driven from `topics`), but check it for `font-mono uppercase tracking` eyebrow labels: the page may keep at most ONE such label total (taste-skill eyebrow budget); remove the rest.

- [ ] **Step 3: Wrap article pages in `src/app/fundamentals/[slug]/page.tsx`**

Replace the returned JSX with:

```tsx
return (
  <main className="min-h-screen bg-bg-cream">
    <WorldNav />
    <LibraryHeader title={topic.title} subtitle={topic.subtitle} avatarLine={avatarLines[slug]} />
    <div className="relative mx-auto max-w-5xl px-0 py-8 md:px-8">
      <div className="rounded-none bg-bg-paper paper-shadow md:rounded-2xl">
        {slug === "computing-basics" && <ComputingBasics />}
        {/* ...keep all 10 existing slug conditionals exactly as they are... */}
        {slug === "docker-and-nginx" && <DockerAndNginx />}
      </div>
    </div>
  </main>
);
```

Add imports for `WorldNav`, `LibraryHeader`, and `avatarLines` from `@/lib/avatarLines`. Keep ALL existing slug conditionals and the generateStaticParams/metadata functions untouched.

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit && npm run build
```
Dev check: /fundamentals shows library scene header + book grid; /fundamentals/cron-jobs shows scene header, avatar with "cron never sleeps" line, article content readable on the white panel.

```bash
git add src/app/fundamentals src/components/world/scenes/LibraryHeader.tsx
git commit -m "feat: fundamentals as The Library with scene headers and avatar lines"
```

---

### Task 9: Replace scroll listeners in project components

**Files:**
- Create: `src/hooks/useActivePhase.ts`
- Modify: `src/components/projects/DevSecOpsProject.tsx`
- Modify: `src/components/projects/TerraformECSProject.tsx`
- Modify: `src/components/projects/LinuxSysAdminProject.tsx`

All three components contain this banned pattern (verbatim in LinuxSysAdminProject.tsx lines 53-68; near-identical in the other two — locate with `grep -n "addEventListener(\"scroll\"" src/components/projects/*.tsx`):

```tsx
useEffect(() => {
  const handleScroll = () => {
    const scrollPosition = window.scrollY + 200;
    for (let i = phaseRefs.current.length - 1; i >= 0; i--) {
      const ref = phaseRefs.current[i];
      if (ref && ref.offsetTop <= scrollPosition) {
        setCurrentPhase(i);
        break;
      }
    }
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

- [ ] **Step 1: Create `src/hooks/useActivePhase.ts`**

```ts
"use client";

import { useEffect, MutableRefObject } from "react";

/**
 * Scroll-spy via IntersectionObserver (replaces window scroll listeners).
 * Marks the phase whose section currently crosses the upper viewport band.
 */
export function useActivePhase(
  refs: MutableRefObject<(HTMLDivElement | null)[]>,
  setCurrent: (i: number) => void
) {
  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLDivElement[];
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = refs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setCurrent(idx);
          }
        }
      },
      // A thin band near the top of the viewport: a section "activates"
      // when its top edge crosses ~20% from the top.
      { rootMargin: "-15% 0px -75% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [refs, setCurrent]);
}
```

- [ ] **Step 2: Swap the listener in each of the 3 project files**

In each file: add `import { useActivePhase } from "@/hooks/useActivePhase";`, delete the whole `useEffect(() => { const handleScroll = ... }, [])` block shown above, and add in its place:

```tsx
useActivePhase(phaseRefs, setCurrentPhase);
```

(The variable names `phaseRefs`/`setCurrentPhase` match all three files; verify per file and adapt if one differs.)

- [ ] **Step 3: Verify and commit**

```bash
grep -rn "addEventListener(\"scroll\"" src/components/projects/
```
Expected: no matches.

```bash
npx tsc --noEmit && npm run build
```
Dev check: open /projects/linux-sysadmin-deep-dive, scroll; the phase timeline highlights phases as sections pass. Same for the other two projects.

```bash
git add src/hooks/useActivePhase.ts src/components/projects
git commit -m "refactor: scroll-spy via IntersectionObserver in project pages"
```

---

### Task 10: The Workshop (project page shells)

**Files:**
- Create: `src/components/world/scenes/WorkshopHeader.tsx`
- Modify: `src/app/projects/[slug]/page.tsx`

- [ ] **Step 1: Create `src/components/world/scenes/WorkshopHeader.tsx`**

```tsx
import Avatar from "@/components/world/Avatar";
import SpeechBubble from "@/components/world/SpeechBubble";

interface WorkshopHeaderProps {
  title: string;
  subtitle?: string;
  avatarLine?: string;
}

export default function WorkshopHeader({ title, subtitle, avatarLine }: WorkshopHeaderProps) {
  return (
    <header className="relative overflow-hidden">
      <img
        src="/world/scenes/workshop-1920.webp"
        srcSet="/world/scenes/workshop-768.webp 768w, /world/scenes/workshop-1280.webp 1280w, /world/scenes/workshop-1920.webp 1920w"
        sizes="100vw"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-text-charcoal/10 to-text-charcoal/50" />
      <div className="relative mx-auto flex min-h-[320px] max-w-6xl items-end justify-between gap-6 px-5 pb-8 pt-28 md:px-8">
        <div className="max-w-2xl rounded-2xl bg-bg-paper/95 p-6 paper-shadow">
          <h1 className="font-serif text-3xl font-semibold text-text-charcoal md:text-5xl" style={{ textWrap: "balance" }}>
            {title}
          </h1>
          {subtitle && <p className="mt-2 font-sans text-text-taupe">{subtitle}</p>}
        </div>
        {avatarLine && (
          <div className="hidden flex-col items-center gap-2 lg:flex">
            <SpeechBubble tail="bottom">{avatarLine}</SpeechBubble>
            <Avatar pose="laptop" width={150} />
          </div>
        )}
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Update `src/app/projects/[slug]/page.tsx`**

Wrap the rendered project component:

```tsx
return (
  <main className="min-h-screen bg-bg-cream">
    <WorldNav />
    <WorkshopHeader
      title={project.title}
      subtitle={project.subtitle}
      avatarLine={avatarLines[slug]}
    />
    <div className="bg-bg-paper">
      {slug === "devsecops-pipeline" && <DevSecOpsProject />}
      {slug === "terraform-ecs-deployment" && <TerraformECSProject />}
      {slug === "linux-sysadmin-deep-dive" && <LinuxSysAdminProject />}
    </div>
    {/* keep the existing fallback block for unknown future slugs */}
  </main>
);
```

Add imports for `WorldNav`, `WorkshopHeader`, `avatarLines`. Each project component already renders its own internal hero; check each component's top section in the dev server. If a project's internal hero now duplicates the WorkshopHeader title, that is acceptable for this task (hero says the title big inside the content); flag visual redundancy in the task report if severe.

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit && npm run build
```
Dev check: all three project URLs render with workshop header + content + working phase timeline.

```bash
git add src/components/world/scenes/WorkshopHeader.tsx "src/app/projects/[slug]/page.tsx"
git commit -m "feat: project pages framed as The Workshop"
```

---

### Task 11: The Mailbox (contact rewrite)

**Files:**
- Rewrite: `src/app/contact/page.tsx`

- [ ] **Step 1: Rewrite `src/app/contact/page.tsx`**

Full replacement (keeps the Firestore `contacts` collection contract: name, email, projectType, message, createdAt, read):

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import WorldNav from "@/components/world/WorldNav";
import GrassFooter from "@/components/home/GrassFooter";
import Avatar from "@/components/world/Avatar";
import SpeechBubble from "@/components/world/SpeechBubble";
import { useWorld } from "@/components/world/WorldProvider";

export default function ContactPage() {
  const reduce = useReducedMotion();
  const { wheee } = useWorld();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    projectType: "Just saying hi",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "delivering" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await addDoc(collection(db, "contacts"), {
        ...formState,
        createdAt: serverTimestamp(),
        read: false,
      });
      wheee();
      setStatus(reduce ? "sent" : "delivering");
      if (!reduce) setTimeout(() => setStatus("sent"), 1600);
      setFormState({ name: "", email: "", projectType: "Just saying hi", message: "" });
    } catch (err) {
      console.error("Error submitting form:", err);
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border-2 border-bg-stone bg-white px-4 py-3 font-sans text-text-charcoal placeholder:text-text-olive/50 focus:border-accent-moss focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-bg-cream">
      <WorldNav />

      {/* Mailbox scene */}
      <section className="relative overflow-hidden pt-16">
        <img
          src="/world/scenes/mailbox-1920.webp"
          srcSet="/world/scenes/mailbox-768.webp 768w, /world/scenes/mailbox-1280.webp 1280w, /world/scenes/mailbox-1920.webp 1920w"
          sizes="100vw"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative mx-auto grid min-h-[85dvh] max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8">
          {/* Left: pitch */}
          <div className="rounded-2xl bg-bg-paper/95 p-8 paper-shadow">
            <h1 className="font-serif text-4xl font-semibold text-text-charcoal md:text-5xl" style={{ textWrap: "balance" }}>
              Drop a postcard in the mailbox
            </h1>
            <p className="mt-4 max-w-[50ch] font-sans text-lg text-text-taupe">
              Recruiters, collaborators, and people who just read all ten Library
              articles: I answer everything.
            </p>
            <div className="mt-8 space-y-2 font-sans text-text-taupe">
              <p>
                <a href="mailto:kapulurucharith@gmail.com" className="font-bold text-accent-moss underline underline-offset-4 hover:no-underline">
                  kapulurucharith@gmail.com
                </a>
              </p>
              <p>Denton, Texas</p>
              <p className="flex gap-5 pt-2 text-sm font-bold">
                <a href="https://github.com/CharithKapuluru" target="_blank" rel="noopener noreferrer" className="hover:text-accent-moss">GitHub</a>
                <a href="https://www.linkedin.com/in/charith-kapuluru-159456329/" target="_blank" rel="noopener noreferrer" className="hover:text-accent-moss">LinkedIn</a>
              </p>
            </div>
          </div>

          {/* Right: postcard form */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24, rotate: 1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 1.5 }}
            className="relative rounded-md bg-white p-7 paper-shadow md:p-9"
          >
            {/* stamp */}
            <div aria-hidden className="absolute right-5 top-5 flex h-14 w-12 items-center justify-center rounded-sm border-2 border-dashed border-accent-moss/40 bg-bg-cream font-serif text-[10px] font-bold text-accent-moss">
              CK
            </div>
            <h2 className="font-serif text-2xl font-semibold text-text-charcoal">Postcard</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block font-sans text-sm font-bold text-text-taupe">From</label>
                  <input id="name" type="text" required value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Your name" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block font-sans text-sm font-bold text-text-taupe">Reply address</label>
                  <input id="email" type="email" required value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="you@example.com" className={inputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="projectType" className="mb-1.5 block font-sans text-sm font-bold text-text-taupe">This is about</label>
                <select id="projectType" value={formState.projectType}
                  onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                  className={inputClass}>
                  <option>Just saying hi</option>
                  <option>A job opportunity</option>
                  <option>A project or collaboration</option>
                  <option>Something else</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block font-sans text-sm font-bold text-text-taupe">Message</label>
                <textarea id="message" required rows={4} maxLength={5000} value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Write your postcard" className={`${inputClass} resize-none`} />
              </div>
              {status === "error" && (
                <p role="alert" className="font-sans text-sm font-bold text-accent-terracotta">
                  Sending failed. Please try again, or email me directly.
                </p>
              )}
              <button type="submit" disabled={status === "sending" || status === "delivering" || status === "sent"}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-text-charcoal py-4 font-sans text-base font-bold text-white transition-colors hover:bg-accent-moss active:scale-[0.98] disabled:opacity-60">
                <PaperPlaneTilt size={18} weight="bold" />
                {status === "sending" ? "Stamping..." : status === "delivering" ? "Delivering..." : status === "sent" ? "Delivered" : "Send postcard"}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Envelope delivery run */}
        <AnimatePresence>
          {status === "delivering" && (
            <motion.div
              key="runner"
              initial={{ x: "100vw" }}
              animate={{ x: "-30vw" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="pointer-events-none fixed bottom-6 left-0 z-[80]"
              aria-hidden
            >
              <div className="relative">
                <span className="absolute -top-6 left-10 text-3xl">✉️</span>
                <Avatar pose="peek" width={130} flip pokeable={false} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {status === "sent" && (
          <div className="pointer-events-none fixed bottom-8 left-1/2 z-[80] -translate-x-1/2">
            <SpeechBubble tail="bottom">delivered. I will reply, promise</SpeechBubble>
          </div>
        )}
      </section>

      <GrassFooter />
    </div>
  );
}
```

Note: GrassFooter contains a "Visit the mailbox" link; on /contact that is self-referential but harmless (it IS the mailbox). If it reads oddly in dev, conditionally hide that line via prop later; do not block this task.

- [ ] **Step 2: Verify and commit**

```bash
npx tsc --noEmit && npm run build
```
Dev check: /contact renders the mailbox scene + tilted postcard; submit with Firestore emulator unavailable should hit the error state inline (no `alert()`); with prod Firebase, submission triggers the avatar envelope run, then "Delivered".

```bash
git add src/app/contact/page.tsx
git commit -m "feat: contact page as The Mailbox with postcard form"
```

---

### Task 12: The Woods (404) and Firebase 404 fix

**Files:**
- Create: `src/app/not-found.tsx`
- Modify: `firebase.json` (remove the SPA rewrite so real 404s serve 404.html)

- [ ] **Step 1: Create `src/app/not-found.tsx`**

```tsx
import Link from "next/link";
import WorldNav from "@/components/world/WorldNav";
import Avatar from "@/components/world/Avatar";
import SpeechBubble from "@/components/world/SpeechBubble";

export default function NotFound() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <WorldNav />
      <img
        src="/world/scenes/woods-1920.webp"
        srcSet="/world/scenes/woods-768.webp 768w, /world/scenes/woods-1280.webp 1280w, /world/scenes/woods-1920.webp 1920w"
        sizes="100vw"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative mx-auto flex min-h-[100dvh] max-w-4xl flex-col items-center justify-center gap-6 px-5 text-center">
        <div className="rounded-2xl bg-bg-paper/95 px-8 py-6 paper-shadow">
          <h1 className="font-serif text-5xl font-semibold text-text-charcoal">404</h1>
          <p className="mt-2 font-sans text-lg text-text-taupe">
            This page does not exist. We are both lost now.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-text-charcoal px-7 py-3.5 font-sans text-base font-bold text-white transition-colors hover:bg-accent-moss active:scale-[0.98]"
          >
            Take me back
          </Link>
        </div>
        <div className="flex items-end gap-2">
          <SpeechBubble tail="right">this is fine</SpeechBubble>
          <Avatar pose="lost" width={170} />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Remove the SPA rewrite from `firebase.json`**

Delete the whole `"rewrites": [...]` block from `hosting`. Static export emits a real file per route plus `404.html`; Firebase Hosting automatically serves `404.html` for missing paths once no catch-all rewrite exists.

- [ ] **Step 3: Verify and commit**

```bash
npm run build && ls out/404.html
```
Expected: build passes, `out/404.html` exists. Dev check: visit /nonsense in `npm run dev`, see the woods.

```bash
git add src/app/not-found.tsx firebase.json
git commit -m "feat: 404 as The Woods; serve real 404s on Firebase"
```

---

### Task 13: Easter eggs and idle behavior

**Files:**
- Create: `src/hooks/useKonami.ts`
- Create: `src/components/world/EasterEggs.tsx`
- Modify: `src/app/layout.tsx` (mount EasterEggs inside WorldProvider)
- Cleanup: delete now-unused homepage-era components

- [ ] **Step 1: Create `src/hooks/useKonami.ts`**

```ts
"use client";

import { useEffect } from "react";

const SEQUENCE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export function useKonami(onTrigger: () => void) {
  useEffect(() => {
    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQUENCE[progress]) {
        progress += 1;
        if (progress === SEQUENCE.length) {
          progress = 0;
          onTrigger();
        }
      } else {
        progress = key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onTrigger]);
}
```

- [ ] **Step 2: Create `src/components/world/EasterEggs.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Avatar from "./Avatar";
import SpeechBubble from "./SpeechBubble";
import { useWorld } from "./WorldProvider";
import { useKonami } from "@/hooks/useKonami";

const IDLE_MS = 30000;

export default function EasterEggs() {
  const reduce = useReducedMotion();
  const { boop } = useWorld();
  const [dancing, setDancing] = useState(false);
  const [idle, setIdle] = useState(false);

  useKonami(
    useCallback(() => {
      if (reduce) return;
      boop(700);
      setDancing(true);
      setTimeout(() => setDancing(false), 3200);
    }, [reduce, boop])
  );

  // Idle watcher: avatar gets bored after 30s of no input.
  useEffect(() => {
    let timer = setTimeout(() => setIdle(true), IDLE_MS);
    const reset = () => {
      setIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIdle(true), IDLE_MS);
    };
    const events: (keyof WindowEventMap)[] = ["pointermove", "keydown", "touchstart"];
    events.forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
    return () => {
      clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, []);

  return (
    <AnimatePresence>
      {dancing && (
        <motion.div
          key="dance"
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1, rotate: [0, 360, 720] }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="pointer-events-none fixed bottom-8 left-1/2 z-[85] -translate-x-1/2"
          aria-hidden
        >
          <Avatar pose="wave" width={150} pokeable={false} />
        </motion.div>
      )}
      {idle && !dancing && (
        <motion.div
          key="idle"
          initial={{ x: 160, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 160, opacity: 0 }}
          className="fixed bottom-5 right-4 z-[85] flex flex-col items-center gap-1.5"
        >
          <SpeechBubble tail="bottom">you still there?</SpeechBubble>
          <Avatar pose="bored" width={110} pokeable={false} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Mount in `src/app/layout.tsx`** (inside WorldProvider, after `{children}`):

```tsx
<WorldProvider>
  <SmoothScroll />
  {children}
  <EasterEggs />
</WorldProvider>
```

- [ ] **Step 4: Delete now-unused components**

```bash
for c in ResumeButton ProjectCard LoginButton ThemeToggle; do echo "== $c"; grep -rln "$c" src/ --include="*.tsx" | grep -v "ui/$c.tsx"; done
```
For each component with NO remaining importers, `git rm src/components/ui/<C>.tsx`. Keep anything still imported (several fundamentals articles import ThemeToggle or BookmarkButton; leave those).

- [ ] **Step 5: Verify and commit**

```bash
npx tsc --noEmit && npm run build
```
Dev check: Konami code triggers the spin cameo + boop (sound on); 30s idle shows bored avatar in corner; any input dismisses it.

```bash
git add -A
git commit -m "feat: konami cameo, idle avatar, cleanup unused components"
```

---

### Task 14: Pre-flight, Lighthouse, deploy

**Files:**
- Possibly small fixes anywhere flagged below.

- [ ] **Step 1: Taste-skill pre-flight sweep (mechanical checks)**

```bash
# em-dash ban (zero allowed in user-visible strings)
grep -rn "—\|–" src/ --include="*.tsx" --include="*.ts" | grep -v "// " || echo "CLEAN"
# scroll listener ban
grep -rn 'addEventListener("scroll"' src/ || echo "CLEAN"
# h-screen ban (must be min-h-[100dvh])
grep -rn "h-screen" src/ --include="*.tsx" | grep -v "min-h-screen" || echo "CLEAN"
# eyebrow budget: count uppercase-tracking micro labels on NEW pages only
grep -rn "uppercase tracking" src/components/home src/components/world src/app/page.tsx src/app/contact || echo "CLEAN"
```
Fix every hit on new-world surfaces (old article internals are content, lower priority; fix if quick).

- [ ] **Step 2: Manual checklist (dev server, desktop + mobile width)**

- Hero: headline ≤ 2 lines, sub ≤ 20 words, CTA visible without scroll
- One contact intent label ("Visit the mailbox" footer + nav "Contact" is navigation, OK; no third)
- Avatar tracks cursor; macOS Reduce Motion ON → everything static, pages still usable
- All 10 articles + 3 projects render readable on paper panels; phase timelines work
- Contact submits to Firestore (verify a doc appears in console, then delete it)
- 375px width: every page collapses to single column, avatar shrinks, no horizontal scroll
- Keyboard: tab through nav + postcard form, visible focus rings throughout

- [ ] **Step 3: Lighthouse**

```bash
npm run build && npx serve out -l 5054 &
npx lighthouse http://localhost:5054 --only-categories=performance,accessibility --chrome-flags="--headless" --output=json --output-path=/tmp/lh.json
node -e "const r=require('/tmp/lh.json');console.log('perf',r.categories.performance.score,'a11y',r.categories.accessibility.score)"
```
Expected: performance ≥ 0.85, accessibility ≥ 0.95. If perf is low, check the hill scene LCP (must be the preloaded 1920 webp, < 400 KB).

- [ ] **Step 4: Final commit and deploy**

```bash
git add -A && git commit -m "polish: pre-flight fixes for world redesign" 
git push origin main
```
Push to main triggers the existing GitHub Actions deploy to Firebase Hosting. Watch the run:
```bash
gh run watch
```
Then verify the live site (charithkapuluru.com or charith-c014a.web.app): homepage, one article, one project, contact, and a /nonsense 404.

---

## Self-review notes

- Spec section 5 "avatar straightens tie on Resume hover": shipped as a title-text gag only (Task 7); full sprite animation needs a dedicated pose asset that does not exist. Acceptable degradation, documented here.
- Spec "celebrate at phase completions" inside project tutorials: the existing Confetti/CelebrationMessage components already provide this; re-themed automatically by tokens. No new work.
- Spec day/night, mini-game, celebrate.png: explicitly out of scope (spec section 8).
- Types check: `PoseName` excludes "celebrate" (asset missing) — consistent across Avatar/usages. `avatarLines` keys match all 13 real slugs from `projectsData.ts`/`fundamentalsData.ts`.
- All commits avoid AI co-author trailers per CLAUDE.md.
