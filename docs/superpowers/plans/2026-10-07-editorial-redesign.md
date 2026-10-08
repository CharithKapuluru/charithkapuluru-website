# Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild charithkapuluru.com as a premium editorial developer portfolio (dark and light, Bricolage Grotesque + Geist, one burnt-amber accent, avatar as mascot) while preserving every route, all 13 tutorial content files, and every Firebase flow.

**Architecture:** Keep the Next.js 16 static-export + Firebase Hosting stack. Replace the design tokens behind the existing class names first (with an alias layer so 12,000 lines of tutorials re-theme and gain dark mode immediately), rebuild the shared UI primitives and page shells as server-first components with small client leaves, introduce one reading layout (contextual nav, rails, section wrappers) that replaces four overlapping sticky navs, then run a reviewed codemod over the 13 content files and delete the cartoon-world layer.

**Tech Stack:** Next.js 16.0.8 (App Router, `output: "export"`), React 19, Tailwind v4 (`@theme inline` tokens, class-based dark variant), framer-motion 12, `@phosphor-icons/react` 2.1, `next-themes`, Firebase 12 (Auth + Firestore), next/font (Bricolage Grotesque, Geist, Geist Mono), Node 22 (`node --test` for script and data tests), Playwright MCP for visual and lab checks.

**Spec:** `docs/superpowers/specs/2026-10-07-editorial-redesign-design.md` (read it first; this plan argues from it).

## Global Constraints

- Branch is `editorial-redesign`; `main` is the live site and only receives a merge at the very end.
- Every route and slug stays identical: `/`, `/projects/[slug]` (3), `/fundamentals`, `/fundamentals/[slug]` (10), `/contact`, 404. One route is added: `/projects`.
- Primary nav labels: Projects, Fundamentals, Contact. Wordmark text: `Charith Kapuluru`. Resume button downloads `/ck.pdf` as `Charith_Kapuluru_Resume.pdf`.
- Firestore document shapes are frozen: `contacts` (fields `name`, `email`, `projectType`, `message`, `createdAt`, `read`), `users/{uid}/progress/{key}` with `{ phases: number[] }` where the key for the Linux project is `linux-sysadmin` (not the route slug), `users/{uid}/notes/{id}`, `users/{uid}/bookmarks/{id}`.
- Tutorial prose inside `src/components/fundamentals/*` and `src/components/projects/*` is preserved verbatim except: emoji removal, heading class changes, and the structural edits listed in Task 10. Em-dashes inside that prose stay.
- Shell and UI copy (everything outside those 13 files): no em-dash (U+2014) or en-dash (U+2013), no emoji, sentence case, no exclamation marks. Copy strings are fixed in spec section 4.6 and reproduced in the tasks below; use them verbatim.
- Fonts only via `next/font/google`: `Bricolage_Grotesque` (variable, `axes: ["opsz", "wdth"]`) as `--font-bricolage`, `Geist` as `--font-geist`, `Geist_Mono` as `--font-geist-mono`.
- Color tokens and their exact hex values are in spec section 4.2 and copied into Task 2. The accent is the only non-neutral color outside callouts, status states and the Terminal component.
- Icons: `@phosphor-icons/react` only, `weight="regular"`, no hand-written `<svg>` icons. Inline `<svg>` is allowed only for connectors and shapes inside the seven diagram components (AnimatedDiagram, ArchitectureDiagram, LayerDiagram, TrafficFlowAnimation, TerraformResourceTree, ResourceAllocator, CIDRCalculator).
- Motion: durations 150 to 320 ms, easing `cubic-bezier(0.16, 1, 0.3, 1)`, every framer component checks `useReducedMotion()`. No `window.addEventListener("scroll")`, no `setInterval`, no `h-screen`, no `window.alert`.
- Dependencies: add `next-themes`; remove `lenis` and `lucide-react`. Nothing else is added. Check `package.json` before every import.
- Builds on this Mac are slow and stall when launched in the background. Always run `NEXT_TELEMETRY_DISABLED=1 npm run build` in the foreground with a 600000 ms timeout, one build at a time, and never run `tsc` and `next build` concurrently. A healthy build takes about 6 minutes.
- Commit after every task with a plain `git commit -m "<type>: <summary>"`. Never add a Co-Authored-By or any AI attribution trailer (project rule in `CLAUDE.md`).

## Review Focus

Inputs the spec implies but no feature test would otherwise exercise, most likely to bite first. Each one has its pinning test in the task named.

1. **Old deep links to `/#projects` and `/#workshop`** (the project navs linked there; recruiters may have bookmarks). Expected: both anchors land on the home projects section. Pinned in Task 11 (section carries `id="projects"` and a hidden `id="workshop"` anchor) and checked by `scripts/preflight.mjs` against `out/index.html`.
2. **Malformed or missing `localStorage` JSON** for reading position, bookmarks and notes (private mode, cleared storage, old shapes). Expected: feature degrades to "nothing saved", never a crash. Pinned by `safeParse` tests in Task 8.
3. **The Linux project's Firestore progress key** must stay `linux-sysadmin` or every signed-in reader loses their saved phases. Pinned by the data test in Task 9.
4. **Reduced-motion users** must get instant scrolling from the rail and a static Terminal transcript. Pinned by the `scrollBehavior()` test in Task 7 and the Terminal default-state test in Task 4.
5. **Contact form input edge cases**: whitespace-only name, invalid email, message over 5000 characters. Expected: inline errors, no Firestore write. Pinned by `validateContact()` tests in Task 14.

## Testing approach

The repository has no component test harness and adding one for a visual redesign is out of scope. Tests exist at three levels:

1. **Pure logic under `node --test`** for scripts and data: token consistency, contrast math, codemod rules, data validation, storage parsing, form validation. Run with `npm test` (added in Task 1) which expands to `node --experimental-strip-types --test "scripts/**/*.test.mjs"`.
2. **`next build`** as the type-check and static-render gate for every route (every page renders at build time).
3. **Playwright MCP** screenshots and a throttled lab run against the built `out/` folder (Task 16), plus `scripts/preflight.mjs` and `scripts/contrast.mjs`.

Write the test first where a pure function exists. For components, the "test" step is the build plus a dev-server or screenshot check, written out explicitly.

## File structure

```
src/app/
  layout.tsx            fonts, metadata, Providers, SkipLink, Konami
  providers.tsx         next-themes + AuthProvider (client)
  page.tsx              home
  projects/page.tsx     NEW index
  projects/[slug]/page.tsx
  fundamentals/page.tsx, fundamentals/[slug]/page.tsx, fundamentals/layout.tsx
  contact/page.tsx, not-found.tsx, sitemap.ts, robots.ts, globals.css
src/components/layout/  SkipLink, ThemeToggle, SiteNav, NavSheet, Footer
src/components/brand/   Avatar, AvatarHead, Wordmark, Konami
src/components/home/    Hero, ProofStrip, ProjectRows, FundamentalsIndex, AboutSection, ContactBand, PersonJsonLd
src/components/reading/ ReadingNavContext, ReadingLayout, ContextualNav, ProgressLine, OnThisPage,
                        PhaseRail, SectionsSheet, ArticleSection, ReadingHeader, FactsPanel,
                        ResumeNotice, NextUp, AvatarNote, ProjectTools
src/components/fundamentals/  GuidesGrid (client filter) + 10 content files (codemod)
src/components/ui/      Button, Tag, Callout, Collapsible, CodeBlock, SectionHeader, PhaseHeader (wrapper),
                        Skeleton, PullQuote, Terminal, Quiz, Flashcards, ComparisonTable,
                        BeforeAfterComparison, ConceptCards, DifficultyIndicator, LaunchChecklist,
                        Confetti, SearchBar, PersonalNotes, BookmarkButton, ShareButtons, icons.tsx,
                        KeyTakeaway/AnalogyBox/DidYouKnow/WarningBox/RealTalk (Callout wrappers),
                        + 7 diagram components (re-themed by codemod)
src/hooks/              useReadingNav, useProgress, useKonami (existing)
src/lib/                projectsData, fundamentalsData, avatarLines, storage, contact-validation, utils, firebase
scripts/                preflight.mjs, contrast.mjs, codemod-redesign.mjs, lib/codemod-rules.mjs,
                        make-og.mjs, *.test.mjs, playwright/shots.js, playwright/lab.js
```

Deleted in Task 16 (kept until then so the build passes at every step): `src/components/world/*`, `src/components/home/{GrassFooter,LibrarySection,WorkshopSection}.tsx`, `src/components/ui/{ArticleNav,PhaseTimeline,ProgressSidebar,ArticleTableOfContents,ThemeProvider,ThemeToggle,Tooltip,OrganicDivider,DropCap}.tsx`, `src/hooks/useActivePhase.ts`, `public/world/scenes/{hill,library,workshop,mailbox}-*.webp`.

---

### Task 1: Dependencies, test runner, Lenis and cloud-wipe removal

**Files:**
- Modify: `package.json`
- Delete: `src/app/template.tsx`, `src/components/SmoothScroll.tsx`
- Modify: `src/app/layout.tsx` (remove the SmoothScroll import and element)
- Modify: `src/app/globals.css` (remove the Lenis block)

**Interfaces:**
- Produces: `npm test` script; `next-themes` available for Task 2.

- [ ] **Step 1: Install and remove dependencies**

```bash
cd /Users/charithkapuluru/Desktop/charithkapuluru-website
npm install next-themes@^0.4.6
npm uninstall lenis lucide-react
node -e "require('next-themes'); console.log('next-themes ok')"
```

Expected: `next-themes ok`. `package.json` no longer lists `lenis` or `lucide-react`.

- [ ] **Step 2: Add the test script**

Edit `package.json` scripts to:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "node --experimental-strip-types --test \"scripts/**/*.test.mjs\""
}
```

- [ ] **Step 3: Remove the smooth scroll and cloud wipe**

```bash
git rm -q src/app/template.tsx src/components/SmoothScroll.tsx
```

In `src/app/layout.tsx` delete the line `import SmoothScroll from "@/components/SmoothScroll";` and the `<SmoothScroll />` element.

In `src/app/globals.css` delete everything from the comment `/* Lenis Scroll */` through the `.lenis.lenis-scrolling iframe { pointer-events: none; }` rule (six rules).

- [ ] **Step 4: Verify**

```bash
grep -rn "lenis\|SmoothScroll\|lucide" src package.json; echo "exit=$?"
```

Expected: no matches, `exit=1`. Then run the build gate:

```bash
NEXT_TELEMETRY_DISABLED=1 npm run build
```

Expected: build succeeds, all routes listed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: add next-themes and test script, remove lenis and cloud wipe"
```

---

### Task 2: Design tokens, fonts, theme provider, contrast and token tests

**Files:**
- Rewrite: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/app/providers.tsx`, `src/lib/z.ts`, `scripts/contrast.mjs`, `scripts/tokens.test.mjs`, `scripts/contrast.test.mjs`

**Interfaces:**
- Produces: Tailwind utilities `bg-bg`, `bg-surface`, `bg-surface-2`, `border-border`, `border-border-strong`, `text-fg`, `text-fg-2`, `text-fg-3`, `text-accent`, `bg-accent-soft`, `bg-primary`, `text-primary-fg`, `text-tip`/`bg-tip-soft` (and `info`, `success`, `danger`), `bg-terminal`, `text-terminal-fg`, `text-terminal-accent`, `text-terminal-ok`, `text-terminal-info`, `text-terminal-danger`; font utilities `font-display`, `font-sans`, `font-mono`; type utilities `text-display-xl`, `text-display-lg`, `text-h2`, `text-h3`, `text-figure`, `text-lede`, `text-body-read`, `text-body`, `text-small`, `text-caption`; `rounded-sm` 6px, `rounded-md` 10px, `rounded-lg` and larger 14px; `ease-out-quint`; `shadow-float`. Alias utilities for the old names (`bg-bg-paper` and so on) keep working until Task 16.
- Produces: `contrast(hexA, hexB): number` exported from `scripts/contrast.mjs`.

- [ ] **Step 1: Write the failing token test**

Create `scripts/tokens.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

function block(selector) {
  const start = css.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `${selector} block missing`);
  const end = css.indexOf("\n}", start);
  return css.slice(start, end);
}

test("every themed color token in @theme points at a variable defined for both themes", () => {
  const theme = block("@theme inline");
  const light = block(":root");
  const dark = block(".dark");
  const refs = [...theme.matchAll(/--color-[a-z0-9-]+:\s*var\((--[a-z0-9-]+)\)/g)].map((m) => m[1]);
  assert.ok(refs.length >= 20, "expected at least 20 themed color tokens");
  for (const v of refs) {
    assert.match(light, new RegExp(`${v}:`), `${v} missing in :root`);
    assert.match(dark, new RegExp(`${v}:`), `${v} missing in .dark`);
  }
});

test("no pure black or pure white literals", () => {
  assert.doesNotMatch(css, /#000000\b|#000\b|#ffffff\b|#fff\b/i);
});

test("migration aliases exist until the cleanup task removes them", () => {
  const theme = block("@theme inline");
  for (const alias of ["--color-bg-paper", "--color-text-charcoal", "--color-accent-moss", "--font-serif"]) {
    assert.match(theme, new RegExp(alias), `${alias} alias missing`);
  }
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test
```

Expected: FAIL (`@theme inline` block content does not contain `--color-bg:` tokens yet; the "no pure white" test also fails on the current `#ffffff`).

- [ ] **Step 3: Rewrite `src/app/globals.css`**

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  /* Semantic colors (values live on :root and .dark below) */
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-fg: var(--fg);
  --color-fg-2: var(--fg-2);
  --color-fg-3: var(--fg-3);
  --color-accent: var(--accent);
  --color-accent-strong: var(--accent-strong);
  --color-accent-soft: var(--accent-soft);
  --color-primary: var(--primary);
  --color-primary-fg: var(--primary-fg);

  --color-tip: var(--tip);
  --color-tip-soft: var(--tip-soft);
  --color-info: var(--info);
  --color-info-soft: var(--info-soft);
  --color-success: var(--success);
  --color-success-soft: var(--success-soft);
  --color-danger: var(--danger);
  --color-danger-soft: var(--danger-soft);

  /* Terminal surfaces are always dark, in both themes */
  --color-terminal: #0f0f12;
  --color-terminal-fg: #e4e4e7;
  --color-terminal-accent: #eb9b63;
  --color-terminal-ok: #6fcb9b;
  --color-terminal-info: #8fb0ee;
  --color-terminal-danger: #ef8a83;

  /* MIGRATION ALIASES: removed in the cleanup task */
  --color-bg-paper: var(--surface);
  --color-bg-cream: var(--bg);
  --color-bg-stone: var(--surface-2);
  --color-text-charcoal: var(--fg);
  --color-text-taupe: var(--fg-2);
  --color-text-olive: var(--fg-3);
  --color-accent-moss: var(--accent);
  --color-accent-terracotta: var(--danger);
  --color-accent-sand: var(--accent);
  --color-accent-sage: var(--success);
  --font-serif: var(--font-bricolage);

  --font-display: var(--font-bricolage);
  --font-sans: var(--font-geist);
  --font-mono: var(--font-geist-mono);

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 14px;
  --radius-2xl: 14px;
  --radius-3xl: 14px;
  --radius-4xl: 14px;

  --text-display-xl: clamp(2.5rem, 1.5rem + 4.2vw, 4.75rem);
  --text-display-xl--line-height: 1.02;
  --text-display-xl--letter-spacing: -0.025em;
  --text-display-xl--font-weight: 600;
  --text-display-lg: clamp(2.125rem, 1.4rem + 3vw, 3.5rem);
  --text-display-lg--line-height: 1.05;
  --text-display-lg--letter-spacing: -0.02em;
  --text-display-lg--font-weight: 600;
  --text-h2: clamp(1.625rem, 1.25rem + 1.5vw, 2.25rem);
  --text-h2--line-height: 1.15;
  --text-h2--letter-spacing: -0.015em;
  --text-h2--font-weight: 600;
  --text-h3: clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem);
  --text-h3--line-height: 1.25;
  --text-h3--letter-spacing: -0.01em;
  --text-h3--font-weight: 600;
  --text-figure: clamp(2rem, 1.5rem + 2vw, 3rem);
  --text-figure--line-height: 1;
  --text-figure--letter-spacing: -0.02em;
  --text-figure--font-weight: 600;
  --text-lede: 1.25rem;
  --text-lede--line-height: 1.5;
  --text-body-read: 1.0625rem;
  --text-body-read--line-height: 1.7;
  --text-body: 1rem;
  --text-body--line-height: 1.6;
  --text-small: 0.875rem;
  --text-small--line-height: 1.5;
  --text-caption: 0.8125rem;
  --text-caption--line-height: 1.4;

  --ease-out-quint: cubic-bezier(0.16, 1, 0.3, 1);
  --shadow-float: var(--shadow-float-value);
}

:root {
  color-scheme: light;
  --bg: #f7f7f8;
  --surface: #fcfcfd;
  --surface-2: #efeff1;
  --border: #e4e4e7;
  --border-strong: #d4d4d8;
  --fg: #18181b;
  --fg-2: #52525b;
  --fg-3: #6b6b74;
  --accent: #a84d18;
  --accent-strong: #8f3f12;
  --accent-soft: #f9e8dc;
  --primary: #18181b;
  --primary-fg: #fafafa;
  --tip: #a84d18;
  --tip-soft: #f9e8dc;
  --info: #4f7fd9;
  --info-soft: #e9f0fb;
  --success: #1f7a50;
  --success-soft: #e4f5ec;
  --danger: #bf3a31;
  --danger-soft: #fbe7e5;
  --shadow-float-value: 0 12px 32px -12px rgb(24 24 27 / 0.18);
}

.dark {
  color-scheme: dark;
  --bg: #0b0b0d;
  --surface: #131316;
  --surface-2: #1b1b1f;
  --border: #26262b;
  --border-strong: #35353b;
  --fg: #f2f2f4;
  --fg-2: #a7a7b0;
  --fg-3: #86868f;
  --accent: #eb9b63;
  --accent-strong: #f4b07f;
  --accent-soft: rgb(235 155 99 / 0.12);
  --primary: #f2f2f4;
  --primary-fg: #0b0b0d;
  --tip: #eb9b63;
  --tip-soft: rgb(235 155 99 / 0.12);
  --info: #8fb0ee;
  --info-soft: rgb(79 127 217 / 0.14);
  --success: #6fcb9b;
  --success-soft: rgb(47 158 106 / 0.16);
  --danger: #ef8a83;
  --danger-soft: rgb(209 72 63 / 0.16);
  --shadow-float-value: 0 12px 32px -12px rgb(0 0 0 / 0.6);
}

@layer base {
  html {
    scroll-padding-top: 5rem;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: var(--bg);
    color: var(--fg);
    font-family: var(--font-sans);
    overflow-x: hidden;
  }

  h1, h2, h3, h4 {
    font-family: var(--font-display);
    text-wrap: balance;
  }

  p {
    text-wrap: pretty;
  }

  *, *::before, *::after {
    border-color: var(--border);
  }

  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: 4px;
  }

  ::selection {
    background-color: var(--accent-soft);
    color: var(--fg);
  }

  svg {
    color: inherit;
  }

  /* Native dialogs used for the nav sheet, sections sheet and tool dialogs */
  dialog::backdrop {
    background-color: rgb(11 11 13 / 0.5);
  }
}

@layer utilities {
  .reading-body p,
  .reading-body li {
    max-width: 70ch;
  }
  .tabular {
    font-variant-numeric: tabular-nums;
  }
}

@media print {
  button, .fixed, nav, header, aside, dialog, [data-print-hide] { display: none !important; }
  body { background: #f7f7f8 !important; color: #18181b !important; }
  a[href]::after { content: " (" attr(href) ")"; font-size: 0.8em; color: #52525b; }
  h2, h3 { page-break-after: avoid; }
  pre, blockquote { page-break-inside: avoid; }
  @page { margin: 2cm; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Create `src/app/providers.tsx`**

```tsx
"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
```

- [ ] **Step 5: Rewrite `src/app/layout.tsx`**

The old `WorldProvider` and `EasterEggs` stay mounted for now because the old pages still use them; Task 16 removes them.

```tsx
import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { WorldProvider } from "@/components/world/WorldProvider";
import EasterEggs from "@/components/world/EasterEggs";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["opsz", "wdth"],
});

const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const SITE = "https://charithkapuluru.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Charith Kapuluru | Cloud & DevOps Engineer",
    template: "%s | Charith Kapuluru",
  },
  description:
    "Cloud and DevOps engineer. Project walkthroughs on DevSecOps pipelines, AWS ECS with Terraform and Linux administration, plus plain-language guides to how servers actually work.",
  keywords: ["DevOps", "Cloud", "AWS", "Terraform", "Linux", "Docker", "Portfolio"],
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Charith Kapuluru",
    title: "Charith Kapuluru | Cloud & DevOps Engineer",
    description:
      "Cloud and DevOps engineer. Project walkthroughs and plain-language guides to how servers actually work.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Charith Kapuluru, Cloud and DevOps engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Charith Kapuluru | Cloud & DevOps Engineer",
    description:
      "Cloud and DevOps engineer. Project walkthroughs and plain-language guides to how servers actually work.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="bg-bg font-sans text-fg antialiased">
        <Providers>
          <WorldProvider>
            {children}
            <EasterEggs />
          </WorldProvider>
        </Providers>
      </body>
    </html>
  );
}
```

`public/og.png` does not exist until Task 15; a missing OG image does not break the build.

- [ ] **Step 6: Create `src/lib/z.ts`**

```ts
/** Z-index scale. Use the matching Tailwind class; never invent other values. */
export const Z = {
  raised: 10, // z-10: hover-lifted cards, inline popovers
  nav: 20, // z-20: sticky site and contextual nav
  rail: 30, // z-30: sticky reading rails
  sheet: 40, // z-40: dialogs, sheets and their backdrops
  toast: 50, // z-50: toasts, confetti overlay
  skip: 60, // z-[60]: skip link when focused
} as const;
```

- [ ] **Step 7: Write the failing contrast test and the contrast script**

Create `scripts/contrast.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { contrast, PAIRS, checkPairs } from "./contrast.mjs";

test("contrast of black on white is 21", () => {
  assert.equal(Math.round(contrast("#000000", "#ffffff")), 21);
});

test("contrast is symmetric", () => {
  assert.equal(contrast("#b4541c", "#f7f7f8"), contrast("#f7f7f8", "#b4541c"));
});

test("every text/background pair meets its floor in both themes", () => {
  const failures = checkPairs();
  assert.deepEqual(failures, [], failures.map((f) => `${f.theme} ${f.fg} on ${f.bg}: ${f.ratio.toFixed(2)} < ${f.min}`).join("\n"));
});

test("the pair table covers the accent and all three text levels on both surfaces", () => {
  const names = PAIRS.map((p) => `${p.fg}/${p.bg}`);
  for (const needed of ["fg/bg", "fg-2/bg", "fg-3/bg", "accent/bg", "fg/surface", "fg-3/surface", "fg-3/surface-2", "accent/accent-soft", "primary-fg/primary"]) {
    assert.ok(names.includes(needed), `missing pair ${needed}`);
  }
});
```

Create `scripts/contrast.mjs`:

```js
#!/usr/bin/env node
// WCAG 2.x contrast check over the design tokens in src/app/globals.css.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

function readBlock(selector) {
  const start = css.indexOf(`${selector} {`);
  const end = css.indexOf("\n}", start);
  const body = css.slice(start, end);
  const vars = {};
  for (const m of body.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
  return vars;
}

export const THEMES = { light: readBlock(":root"), dark: readBlock(".dark") };

/** Pairs as token names without the leading dashes; min is the WCAG floor. */
export const PAIRS = [
  { fg: "fg", bg: "bg", min: 4.5 },
  { fg: "fg-2", bg: "bg", min: 4.5 },
  { fg: "fg-3", bg: "bg", min: 4.5 },
  { fg: "accent", bg: "bg", min: 4.5 },
  { fg: "fg", bg: "surface", min: 4.5 },
  { fg: "fg-2", bg: "surface", min: 4.5 },
  { fg: "fg-3", bg: "surface", min: 4.5 },
  { fg: "accent", bg: "surface", min: 4.5 },
  { fg: "fg-3", bg: "surface-2", min: 4.5 },
  { fg: "accent", bg: "surface-2", min: 4.5 },
  { fg: "accent", bg: "accent-soft", min: 4.5 },
  { fg: "fg", bg: "surface-2", min: 4.5 },
  { fg: "fg-2", bg: "surface-2", min: 4.5 },
  { fg: "primary-fg", bg: "primary", min: 4.5 },
  { fg: "tip", bg: "bg", min: 3 },
  { fg: "info", bg: "bg", min: 3 },
  { fg: "success", bg: "bg", min: 3 },
  { fg: "danger", bg: "bg", min: 3 },
];

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance([r, g, b]) {
  const lin = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

export function contrast(a, b) {
  const la = luminance(hexToRgb(a));
  const lb = luminance(hexToRgb(b));
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export function checkPairs() {
  const failures = [];
  for (const [theme, vars] of Object.entries(THEMES)) {
    for (const p of PAIRS) {
      const fg = vars[`--${p.fg}`];
      const bg = vars[`--${p.bg}`];
      if (!fg || !bg || !fg.startsWith("#") || !bg.startsWith("#")) continue; // rgb() tints are backgrounds only
      const ratio = contrast(fg, bg);
      if (ratio < p.min) failures.push({ theme, fg: p.fg, bg: p.bg, ratio, min: p.min });
    }
  }
  return failures;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const failures = checkPairs();
  for (const [theme, vars] of Object.entries(THEMES)) {
    for (const p of PAIRS) {
      const fg = vars[`--${p.fg}`], bg = vars[`--${p.bg}`];
      if (fg?.startsWith("#") && bg?.startsWith("#")) console.log(`${theme.padEnd(5)} ${p.fg.padEnd(10)} on ${p.bg.padEnd(9)} ${contrast(fg, bg).toFixed(2)} (min ${p.min})`);
    }
  }
  if (failures.length) { console.error(`\n${failures.length} pair(s) below the floor`); process.exit(1); }
  console.log("\nAll token pairs pass.");
}
```

- [ ] **Step 8: Run the tests and the build**

```bash
npm test
node scripts/contrast.mjs
NEXT_TELEMETRY_DISABLED=1 npm run build
```

Expected: all `node --test` tests pass; the contrast script prints every pair with ratios above the floor and "All token pairs pass."; the build succeeds. The site now renders in Bricolage/Geist with the new palette through the alias layer, and `prefers-color-scheme: dark` already shows the dark values.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: semantic design tokens, Bricolage/Geist fonts, next-themes provider"
```

---

### Task 3: UI primitives, part 1 (button, tag, icons, callouts, collapsible, code block, headers)

**Files:**
- Create: `src/components/ui/Button.tsx`, `src/components/ui/Tag.tsx`, `src/components/ui/icons.tsx`, `src/components/ui/Skeleton.tsx`, `src/components/ui/Callout.tsx`, `src/components/ui/SectionHeader.tsx`
- Rewrite: `src/components/ui/KeyTakeaway.tsx`, `src/components/ui/AnalogyBox.tsx`, `src/components/ui/DidYouKnow.tsx`, `src/components/ui/WarningBox.tsx`, `src/components/ui/RealTalk.tsx`, `src/components/ui/Collapsible.tsx`, `src/components/ui/CodeBlock.tsx`, `src/components/ui/PullQuote.tsx`, `src/components/ui/PhaseHeader.tsx`

**Interfaces:**
- Consumes: tokens and utilities from Task 2; `cn()` from `src/lib/utils.ts`.
- Produces: `Button({ href?, variant?: "primary"|"secondary"|"ghost", size?: "sm"|"md"|"lg", ...rest })` and `buttonClasses(variant, size, className)`; `Tag({ tone?, mono?, children })`; `ICONS` map, `IconName`, `iconFor(name, props)`; `Skeleton({ className })`; `Callout({ tone, icon, label, children })`; `SectionHeader({ eyebrow?, title, as? })`. The five callout wrappers keep their existing prop names so the 13 content files compile unchanged.
- Import Phosphor icons from `@phosphor-icons/react/dist/ssr` in every new file (server-safe build of the same icons; works in client components too).

- [ ] **Step 1: Create `src/components/ui/Button.tsx`**

```tsx
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[background-color,border-color,color,opacity,transform] duration-150 ease-out-quint active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-fg hover:opacity-90",
  secondary: "border border-border-strong bg-surface text-fg hover:border-fg-3 hover:bg-surface-2",
  ghost: "text-fg-2 hover:bg-surface-2 hover:text-fg",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-small",
  md: "h-11 px-5 text-body",
  lg: "h-12 px-6 text-body",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; className?: string; children: ReactNode };
type AsLink = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export default function Button(props: AsLink | AsButton) {
  const classes = buttonClasses(props.variant, props.size, props.className);
  if (props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { href, variant, size, className, children, ...rest } = props;
    const internal = href.startsWith("/") && !href.endsWith(".pdf");
    if (internal) {
      return (
        <Link href={href} className={classes} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { href, variant, size, className, children, ...rest } = props;
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Create `src/components/ui/Tag.tsx`**

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TagTone = "neutral" | "tip" | "info" | "success" | "danger";

const tones: Record<TagTone, string> = {
  neutral: "border-border bg-surface-2 text-fg-2",
  tip: "border-tip/30 bg-tip-soft text-fg",
  info: "border-info/30 bg-info-soft text-fg",
  success: "border-success/30 bg-success-soft text-fg",
  danger: "border-danger/30 bg-danger-soft text-fg",
};

export default function Tag({
  children,
  tone = "neutral",
  mono = true,
  className,
}: {
  children: ReactNode;
  tone?: TagTone;
  mono?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-sm border px-2 py-0.5 text-caption", mono && "font-mono", tones[tone], className)}>
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Create `src/components/ui/icons.tsx`**

The registry maps kebab-case names (used in data files and by the codemod) to Phosphor components. Add names here when a later task needs one; never draw an icon by hand.

```tsx
import type { ReactElement } from "react";
import type { Icon, IconProps } from "@phosphor-icons/react";
import {
  AppleLogo, AppWindow, ArrowCounterClockwise, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen,
  BookmarkSimple, Books, Broadcast, Broom, Buildings, Car, CaretDown, CaretRight, CastleTurret,
  ChartBar, ChatCenteredText, ChatCircleText, Check, CheckCircle, ClipboardText, Clock, CloudArrowUp,
  Code, Confetti, CookingPot, Copy, Cpu, Database, Desktop, DeviceMobile, EnvelopeSimple, Export, Eye,
  FileText, Flame, Flask, FloppyDisk, Folder, ForkKnife, Gear, GitBranch, GithubLogo, Globe, Hammer,
  Handshake, HardDrives, House, HouseLine, Info, Key, Laptop, Lightbulb, Lightning, LinkedinLogo,
  LinuxLogo, List, Lock, MagnifyingGlass, Monitor, Moon, Note, Package, PencilSimple, Play, Plugs,
  PushPin, Question, RocketLaunch, Scales, Scroll, ShareNetwork, ShieldCheck, ShoppingCart, Shuffle,
  SkipForward, Sparkle, Storefront, Sun, Tag, Target, Television, Terminal, Ticket, Timer, Trash, Tree,
  TrendUp, Truck, User, Users, Warning, Wrench, X, XCircle, XLogo,
} from "@phosphor-icons/react/dist/ssr";

export const ICONS = {
  "apple-logo": AppleLogo, "app-window": AppWindow, "arrow-counter-clockwise": ArrowCounterClockwise,
  "arrow-left": ArrowLeft, "arrow-right": ArrowRight, "arrow-up-right": ArrowUpRight, "book-open": BookOpen,
  bookmark: BookmarkSimple, books: Books, broadcast: Broadcast, broom: Broom, buildings: Buildings, car: Car,
  "caret-down": CaretDown, "caret-right": CaretRight, castle: CastleTurret, "chart-bar": ChartBar,
  "chat-centered": ChatCenteredText, "chat-circle": ChatCircleText, check: Check, "check-circle": CheckCircle,
  "clipboard-text": ClipboardText, clock: Clock, "cloud-arrow-up": CloudArrowUp, code: Code, confetti: Confetti,
  "cooking-pot": CookingPot, copy: Copy, cpu: Cpu, database: Database, desktop: Desktop,
  "device-mobile": DeviceMobile, envelope: EnvelopeSimple, export: Export, eye: Eye, "file-text": FileText,
  flame: Flame, flask: Flask, "floppy-disk": FloppyDisk, folder: Folder, "fork-knife": ForkKnife, gear: Gear,
  "git-branch": GitBranch, github: GithubLogo, globe: Globe, hammer: Hammer, handshake: Handshake,
  "hard-drives": HardDrives, house: House, "house-line": HouseLine, info: Info, key: Key, laptop: Laptop,
  lightbulb: Lightbulb, lightning: Lightning, linkedin: LinkedinLogo, linux: LinuxLogo, list: List, lock: Lock,
  search: MagnifyingGlass, monitor: Monitor, moon: Moon, note: Note, package: Package, pencil: PencilSimple,
  play: Play, plugs: Plugs, pin: PushPin, question: Question, "rocket-launch": RocketLaunch, scales: Scales,
  scroll: Scroll, share: ShareNetwork, "shield-check": ShieldCheck, "shopping-cart": ShoppingCart,
  shuffle: Shuffle, "skip-forward": SkipForward, sparkle: Sparkle, storefront: Storefront, sun: Sun, tag: Tag,
  target: Target, television: Television, terminal: Terminal, ticket: Ticket, timer: Timer, trash: Trash,
  tree: Tree, "trend-up": TrendUp, truck: Truck, user: User, users: Users, warning: Warning, wrench: Wrench,
  x: X, "x-circle": XCircle, "x-logo": XLogo,
} satisfies Record<string, Icon>;

export type IconName = keyof typeof ICONS;

export function isIconName(name: string | undefined): name is IconName {
  return !!name && Object.prototype.hasOwnProperty.call(ICONS, name);
}

/** Render a registry icon by name. Unknown names render the Info icon so nothing ever renders as text. */
export function iconFor(name: string | undefined, props: IconProps = {}): ReactElement {
  const Cmp: Icon = isIconName(name) ? ICONS[name] : Info;
  return <Cmp size={20} weight="regular" aria-hidden {...props} />;
}
```

- [ ] **Step 4: Create `src/components/ui/Skeleton.tsx` and `src/components/ui/Callout.tsx`**

```tsx
// src/components/ui/Skeleton.tsx
import { cn } from "@/lib/utils";

export default function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-md bg-surface-2", className)} />;
}
```

```tsx
// src/components/ui/Callout.tsx
import type { ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type CalloutTone = "tip" | "info" | "success" | "danger" | "neutral";

const tones: Record<CalloutTone, { wrap: string; icon: string }> = {
  tip: { wrap: "border-l-tip bg-tip-soft", icon: "text-tip" },
  info: { wrap: "border-l-info bg-info-soft", icon: "text-info" },
  success: { wrap: "border-l-success bg-success-soft", icon: "text-success" },
  danger: { wrap: "border-l-danger bg-danger-soft", icon: "text-danger" },
  neutral: { wrap: "border-l-border-strong bg-surface-2", icon: "text-fg-2" },
};

export default function Callout({
  tone = "neutral",
  icon: IconCmp,
  label,
  children,
  className,
}: {
  tone?: CalloutTone;
  icon: Icon;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const t = tones[tone];
  return (
    <aside className={cn("my-8 rounded-md border-l-2 py-4 pl-5 pr-5", t.wrap, className)}>
      <div className="mb-2 flex items-center gap-2">
        <IconCmp size={18} weight="regular" className={t.icon} aria-hidden />
        <span className="text-caption font-medium text-fg-2">{label}</span>
      </div>
      <div className="leading-relaxed text-fg-2 [&_code]:text-fg [&_strong]:text-fg">{children}</div>
    </aside>
  );
}
```

- [ ] **Step 5: Rewrite the five callout wrappers**

```tsx
// src/components/ui/KeyTakeaway.tsx
import type { ReactNode } from "react";
import { Lightbulb } from "@phosphor-icons/react/dist/ssr";
import Callout from "./Callout";

export default function KeyTakeaway({ children }: { children: ReactNode; variant?: "yellow" | "blue" | "green" }) {
  return (
    <Callout tone="tip" icon={Lightbulb} label="Key takeaway">
      {children}
    </Callout>
  );
}
```

```tsx
// src/components/ui/AnalogyBox.tsx
import type { ReactNode } from "react";
import { ChatCircleText } from "@phosphor-icons/react/dist/ssr";
import Callout from "./Callout";

export default function AnalogyBox({ children }: { children: ReactNode; icon?: string }) {
  return (
    <Callout tone="info" icon={ChatCircleText} label="Think of it this way">
      {children}
    </Callout>
  );
}
```

```tsx
// src/components/ui/DidYouKnow.tsx
import type { ReactNode } from "react";
import { Sparkle } from "@phosphor-icons/react/dist/ssr";
import Callout from "./Callout";

export default function DidYouKnow({ children }: { children: ReactNode }) {
  return (
    <Callout tone="success" icon={Sparkle} label="Did you know">
      {children}
    </Callout>
  );
}
```

```tsx
// src/components/ui/WarningBox.tsx
import type { ReactNode } from "react";
import { Warning } from "@phosphor-icons/react/dist/ssr";
import Callout from "./Callout";

export default function WarningBox({ children }: { children: ReactNode }) {
  return (
    <Callout tone="danger" icon={Warning} label="Warning">
      {children}
    </Callout>
  );
}
```

```tsx
// src/components/ui/RealTalk.tsx
import type { ReactNode } from "react";
import { ChatCenteredText } from "@phosphor-icons/react/dist/ssr";
import Callout from "./Callout";

export default function RealTalk({ children }: { children: ReactNode }) {
  return (
    <Callout tone="neutral" icon={ChatCenteredText} label="Real talk" className="italic">
      {children}
    </Callout>
  );
}
```

- [ ] **Step 6: Rewrite `src/components/ui/Collapsible.tsx`**

```tsx
"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

interface CollapsibleProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  index?: number;
}

export default function Collapsible({ title, children, defaultOpen = false }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const reduce = useReducedMotion();

  return (
    <div className="my-6 rounded-md border border-border bg-surface">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 rounded-md px-4 py-3 text-left text-body font-medium text-fg hover:bg-surface-2"
      >
        <span>{title}</span>
        <CaretDown size={18} aria-hidden className={cn("shrink-0 text-fg-3 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-4 py-4 leading-relaxed text-fg-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 7: Rewrite `src/components/ui/CodeBlock.tsx` and `src/components/ui/PullQuote.tsx`**

```tsx
// src/components/ui/CodeBlock.tsx
"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react/dist/ssr";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({ code, language = "bash", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable; the text stays selectable */
    }
  };

  return (
    <figure className="my-6 overflow-hidden rounded-md border border-border bg-surface-2">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <span className="font-mono text-caption text-fg-3">{filename ?? language}</span>
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          className="inline-flex h-8 items-center gap-1.5 rounded-sm px-2 font-mono text-caption text-fg-2 hover:bg-surface hover:text-fg"
        >
          {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-small leading-relaxed text-fg">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
```

```tsx
// src/components/ui/PullQuote.tsx
import type { ReactNode } from "react";

export default function PullQuote({ children, attribution }: { children: ReactNode; attribution?: string }) {
  return (
    <figure className="my-10 border-l-2 border-accent pl-5">
      <blockquote className="font-display text-h3 font-medium text-fg">{children}</blockquote>
      {attribution && <figcaption className="mt-3 text-small text-fg-3">{attribution}</figcaption>}
    </figure>
  );
}
```

- [ ] **Step 8: Create `src/components/ui/SectionHeader.tsx` and turn `PhaseHeader.tsx` into a wrapper**

```tsx
// src/components/ui/SectionHeader.tsx
import { cn } from "@/lib/utils";

export default function SectionHeader({
  eyebrow,
  title,
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={cn("mb-6", className)}>
      {eyebrow && <p className="mb-2 text-caption text-fg-3">{eyebrow}</p>}
      <Heading className={Heading === "h2" ? "text-h2 text-fg" : "text-h3 text-fg"}>{title}</Heading>
    </div>
  );
}
```

```tsx
// src/components/ui/PhaseHeader.tsx
import SectionHeader from "./SectionHeader";

export default function PhaseHeader({
  phaseNumber,
  title,
}: {
  phaseNumber: number | string;
  title: string;
  accentColor?: "terracotta" | "moss" | "sage" | "sand" | "olive";
}) {
  return <SectionHeader eyebrow={`Phase ${phaseNumber}`} title={title} />;
}
```

- [ ] **Step 9: Build gate and visual check**

```bash
NEXT_TELEMETRY_DISABLED=1 npm run build
```

Expected: success. Then start the dev server and open an article (`/fundamentals/computing-basics/`) and a project (`/projects/devsecops-pipeline/`): callouts show a 2 px left border, tinted surface, a Phosphor icon and a lowercase label; collapsibles open with a caret; no emoji remain in those components. If the sandbox blocks the dev server port, skip to the screenshots in Task 16.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: rebuild core UI primitives on the new token system"
```

---

### Task 4: UI primitives, part 2 (terminal, quiz, flashcards, tables, cards, checklist, confetti, diagram icons)

**Files:**
- Create: `src/lib/terminal-state.ts`, `scripts/terminal-state.test.mjs`
- Rewrite: `src/components/ui/Terminal.tsx`, `src/components/ui/Quiz.tsx`, `src/components/ui/Flashcards.tsx`, `src/components/ui/ComparisonTable.tsx`, `src/components/ui/BeforeAfterComparison.tsx`, `src/components/ui/ConceptCards.tsx`, `src/components/ui/DifficultyIndicator.tsx`, `src/components/ui/LaunchChecklist.tsx`, `src/components/ui/Confetti.tsx`
- Modify: `src/components/ui/AnimatedDiagram.tsx` (step icons only)

**Interfaces:**
- Consumes: `Tag`, `Button`, `iconFor` from Task 3.
- Produces: unchanged public props for every component listed (the 13 content files keep compiling), plus `initialTerminalState(autoPlay, lineCount)` in `src/lib/terminal-state.ts`. `Flashcards` default data and `ConceptCards` default data are unchanged apart from icon names.

- [ ] **Step 1: Write the failing terminal-state test**

Create `scripts/terminal-state.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { initialTerminalState } from "../src/lib/terminal-state.ts";

test("terminal shows the full transcript by default", () => {
  assert.deepEqual(initialTerminalState(false, 7), { visibleLines: 7, playing: false, complete: true });
});

test("autoPlay starts from an empty transcript", () => {
  assert.deepEqual(initialTerminalState(true, 7), { visibleLines: 0, playing: true, complete: false });
});

test("an empty line list is complete immediately", () => {
  assert.deepEqual(initialTerminalState(true, 0), { visibleLines: 0, playing: false, complete: true });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test
```

Expected: FAIL with "Cannot find module .../src/lib/terminal-state.ts".

- [ ] **Step 3: Create `src/lib/terminal-state.ts`**

```ts
export interface TerminalInitialState {
  visibleLines: number;
  playing: boolean;
  complete: boolean;
}

/** Static transcript by default; typing animation only when autoPlay is requested (or on Replay). */
export function initialTerminalState(autoPlay: boolean, lineCount: number): TerminalInitialState {
  if (lineCount === 0) return { visibleLines: 0, playing: false, complete: true };
  if (autoPlay) return { visibleLines: 0, playing: true, complete: false };
  return { visibleLines: lineCount, playing: false, complete: true };
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test
```

Expected: PASS (3 new tests).

- [ ] **Step 5: Rewrite `src/components/ui/Terminal.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowCounterClockwise, SkipForward } from "@phosphor-icons/react/dist/ssr";
import { initialTerminalState } from "@/lib/terminal-state";

interface TerminalLine {
  type: "command" | "output" | "comment";
  content: string;
  delay?: number;
}

interface TerminalProps {
  title?: string;
  lines: TerminalLine[];
  autoPlay?: boolean;
}

const typingDelay = (char: string, base: number) => {
  if (char === " ") return base + Math.random() * 30 + 20;
  if (char === "." || char === ",") return base + Math.random() * 50 + 40;
  return base + (Math.random() * 20 - 10);
};

export default function Terminal({ title = "Terminal", lines, autoPlay = false }: TerminalProps) {
  const init = initialTerminalState(autoPlay, lines.length);
  const [visibleLines, setVisibleLines] = useState(init.visibleLines);
  const [playing, setPlaying] = useState(init.playing);
  const [complete, setComplete] = useState(init.complete);
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    if (visibleLines >= lines.length) {
      setComplete(true);
      setPlaying(false);
      return;
    }
    const line = lines[visibleLines];
    const base = line.delay ?? 40;
    let timeout: ReturnType<typeof setTimeout>;

    if (line.type === "command") {
      setTyping(true);
      let i = 0;
      const step = () => {
        if (i <= line.content.length) {
          setTyped(line.content.slice(0, i));
          timeout = setTimeout(step, typingDelay(line.content[i] ?? "", base));
          i += 1;
        } else {
          setTyping(false);
          timeout = setTimeout(() => {
            setVisibleLines((v) => v + 1);
            setTyped("");
          }, 250);
        }
      };
      step();
    } else {
      timeout = setTimeout(() => setVisibleLines((v) => v + 1), line.type === "output" ? 90 : 60);
    }
    return () => clearTimeout(timeout);
  }, [playing, visibleLines, lines]);

  useEffect(() => {
    if (playing && bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [visibleLines, typed, playing]);

  const replay = () => {
    setVisibleLines(0);
    setTyped("");
    setComplete(false);
    setPlaying(true);
  };

  const skip = () => {
    setVisibleLines(lines.length);
    setTyped("");
    setTyping(false);
    setComplete(true);
    setPlaying(false);
  };

  return (
    <div className="my-6 overflow-hidden rounded-md border border-border-strong bg-terminal text-terminal-fg">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
        <span className="font-mono text-caption text-terminal-fg/70">{title}</span>
        {playing ? (
          <button type="button" onClick={skip} className="inline-flex h-8 items-center gap-1.5 rounded-sm px-2 font-mono text-caption text-terminal-fg/80 hover:bg-white/10 hover:text-terminal-fg">
            <SkipForward size={14} aria-hidden /> Skip
          </button>
        ) : (
          <button type="button" onClick={replay} className="inline-flex h-8 items-center gap-1.5 rounded-sm px-2 font-mono text-caption text-terminal-fg/80 hover:bg-white/10 hover:text-terminal-fg">
            <ArrowCounterClockwise size={14} aria-hidden /> {complete ? "Replay" : "Play"}
          </button>
        )}
      </div>
      <div ref={bodyRef} className="max-h-[400px] overflow-y-auto p-4 font-mono text-small leading-relaxed">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="mb-1">
            {line.type === "command" ? (
              <div className="flex">
                <span className="mr-2 text-terminal-accent">$</span>
                <span>{line.content}</span>
              </div>
            ) : line.type === "comment" ? (
              <div className="italic text-terminal-fg/50"># {line.content}</div>
            ) : (
              <div className="pl-4 text-terminal-fg/80">{line.content}</div>
            )}
          </div>
        ))}
        {typing && (
          <div className="flex">
            <span className="mr-2 text-terminal-accent">$</span>
            <span>{typed}</span>
            <span className="animate-pulse" aria-hidden>▊</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Rewrite `src/components/ui/Quiz.tsx`**

```tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Lightning, X } from "@phosphor-icons/react/dist/ssr";
import Button from "./Button";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizProps {
  title: string;
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

const correctLines = ["Correct.", "Exactly right.", "You got it.", "Spot on."];
const incorrectLines = ["Not quite.", "Close, but no.", "Not this one."];

export default function Quiz({ title, questions, onComplete }: QuizProps) {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>(() => new Array(questions.length).fill(false));
  const [feedback, setFeedback] = useState<{ text: string; correct: boolean } | null>(null);

  const question = questions[current];
  const isAnswered = answered[current];

  const choose = (index: number) => {
    if (isAnswered) return;
    setSelected(index);
    const correct = index === question.correctIndex;
    const pool = correct ? correctLines : incorrectLines;
    setFeedback({ text: pool[Math.floor(Math.random() * pool.length)], correct });
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    setAnswered((prev) => prev.map((a, i) => (i === current ? true : a)));
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setFeedback(null);
    } else {
      setShowResult(true);
      onComplete?.(score, questions.length);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setAnswered(new Array(questions.length).fill(false));
  };

  if (showResult) {
    const pct = Math.round((score / questions.length) * 100);
    const line = pct >= 80 ? "Strong understanding of this section." : pct >= 60 ? "Good. Review the questions you missed." : "Worth a second read before moving on.";
    return (
      <section aria-label={`${title} results`} className="my-8 rounded-lg border border-border bg-surface p-6 md:p-8">
        <h3 className="text-h3 text-fg">{title}</h3>
        <p className="mt-6 font-display text-figure tabular text-accent">{pct}%</p>
        <p className="mt-2 text-body text-fg-2">
          {score} of {questions.length} correct. {line}
        </p>
        <Button variant="secondary" size="sm" onClick={restart} className="mt-6">
          Try again
        </Button>
      </section>
    );
  }

  return (
    <section aria-label={title} className="my-8 rounded-lg border border-border bg-surface p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-h3 text-fg">{title}</h3>
        <div className="flex items-center gap-3 font-mono text-caption text-fg-3 tabular">
          {streak >= 2 && (
            <span className="inline-flex items-center gap-1 text-accent">
              <Lightning size={14} weight="fill" aria-hidden /> {streak}
            </span>
          )}
          <span>
            {current + 1} / {questions.length}
          </span>
        </div>
      </div>

      <p className="mt-5 text-body text-fg">{question.question}</p>

      <div className="mt-4 space-y-2" role="group" aria-label="Answers">
        {question.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = index === question.correctIndex;
          const showCorrect = isAnswered && isCorrect;
          const showWrong = isAnswered && isSelected && !isCorrect;
          return (
            <button
              key={index}
              type="button"
              onClick={() => choose(index)}
              disabled={isAnswered}
              aria-pressed={isSelected}
              className={cn(
                "flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-body transition-colors duration-150",
                showCorrect && "border-success bg-success-soft text-fg",
                showWrong && "border-danger bg-danger-soft text-fg",
                !isAnswered && "border-border bg-bg text-fg-2 hover:border-fg-3 hover:text-fg",
                isAnswered && !showCorrect && !showWrong && "border-border bg-bg text-fg-3",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border font-mono text-caption",
                  showCorrect ? "border-success text-success" : showWrong ? "border-danger text-danger" : "border-border-strong",
                )}
                aria-hidden
              >
                {showCorrect ? <Check size={14} /> : showWrong ? <X size={14} /> : String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.p
            role="status"
            initial={reduce ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn("mt-4 text-small font-medium", feedback.correct ? "text-success" : "text-danger")}
          >
            {feedback.text}
          </motion.p>
        )}
      </AnimatePresence>

      {isAnswered && (
        <p className="mt-3 rounded-md border border-border bg-bg p-4 text-small leading-relaxed text-fg-2">
          <strong className="text-fg">Why: </strong>
          {question.explanation}
        </p>
      )}

      <div className="mt-5 flex justify-end">
        <Button size="sm" onClick={next} disabled={!isAnswered}>
          {current < questions.length - 1 ? "Next question" : "See results"}
        </Button>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Rewrite `src/components/ui/Flashcards.tsx`**

Keep the `flashcardsData` array exactly as it is today (20 DevSecOps cards; copy it from the current file) and replace everything after it with:

```tsx
interface FlashcardsProps {
  cards?: { front: string; back: string }[];
  title?: string;
}

export default function Flashcards({ cards, title }: FlashcardsProps = {}) {
  const [flipped, setFlipped] = useState<number[]>([]);
  const deck: Flashcard[] = cards ? cards.map((c, i) => ({ id: i + 1, front: c.front, back: c.back })) : flashcardsData;
  const toggle = (id: number) => setFlipped((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <section className="my-12" aria-label={title || "Flashcards"}>
      <h3 className="text-h3 text-fg">{title || "Key concepts"}</h3>
      <p className="mt-2 text-small text-fg-3">Select a card to flip it.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {deck.map((card) => {
          const isFlipped = flipped.includes(card.id);
          return (
            <button
              key={card.id}
              type="button"
              aria-pressed={isFlipped}
              onClick={() => toggle(card.id)}
              className="h-[200px] text-left [perspective:1000px]"
            >
              <div
                className="relative h-full w-full transition-transform duration-300 ease-out-quint motion-reduce:transition-none [transform-style:preserve-3d]"
                style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                <div className="absolute inset-0 flex items-center justify-center rounded-lg border border-border bg-surface p-5 [backface-visibility:hidden]">
                  <p className="text-center font-display text-body font-medium text-fg">{card.front}</p>
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center overflow-y-auto rounded-lg border border-accent/30 bg-accent-soft p-4 [backface-visibility:hidden]"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <p className="text-center text-caption leading-relaxed text-fg-2">{card.back}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
```

The file keeps `"use client";`, `import { useState } from "react";` and the `Flashcard` interface at the top.

- [ ] **Step 8: Rewrite `ComparisonTable.tsx`, `BeforeAfterComparison.tsx`, `ConceptCards.tsx`, `DifficultyIndicator.tsx`, `LaunchChecklist.tsx`**

```tsx
// src/components/ui/ComparisonTable.tsx
interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export default function ComparisonTable({ headers, rows, caption }: ComparisonTableProps) {
  return (
    <div className="my-8 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-small">
        {caption && <caption className="bg-surface-2 px-4 py-3 text-left font-medium text-fg">{caption}</caption>}
        <thead>
          <tr className="bg-surface-2">
            {headers.map((h, i) => (
              <th key={i} scope="col" className={i === 0 ? "sticky left-0 bg-surface-2 px-4 py-3 text-left font-medium text-fg" : "px-4 py-3 text-left font-medium text-fg"}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, r) => (
            <tr key={r} className="bg-surface">
              {row.map((cell, c) => (
                <td key={c} className={c === 0 ? "sticky left-0 bg-surface px-4 py-3 font-medium text-fg" : "px-4 py-3 text-fg-2"}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

```tsx
// src/components/ui/BeforeAfterComparison.tsx
import { Check, X } from "@phosphor-icons/react/dist/ssr";

interface ComparisonRow {
  before: string;
  after: string;
}

interface BeforeAfterComparisonProps {
  title?: string;
  rows: ComparisonRow[];
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterComparison({
  title,
  rows,
  beforeLabel = "Basic student project",
  afterLabel = "Production-ready project",
}: BeforeAfterComparisonProps) {
  return (
    <div className="my-8 overflow-hidden rounded-lg border border-border">
      {title && <h4 className="border-b border-border bg-surface-2 px-5 py-3 text-body font-medium text-fg">{title}</h4>}
      <div className="grid md:grid-cols-2">
        <div className="hidden items-center gap-2 border-b border-border px-5 py-3 text-caption font-medium text-danger md:flex md:border-r">
          <X size={14} aria-hidden /> {beforeLabel}
        </div>
        <div className="hidden items-center gap-2 border-b border-border px-5 py-3 text-caption font-medium text-success md:flex">
          <Check size={14} aria-hidden /> {afterLabel}
        </div>
        {rows.map((row, i) => (
          <div key={i} className="contents">
            <div className="flex items-start gap-2 border-b border-border px-5 py-3 text-small text-fg-2 md:border-r">
              <X size={16} aria-label={beforeLabel} className="mt-0.5 shrink-0 text-danger" />
              {row.before}
            </div>
            <div className="flex items-start gap-2 border-b border-border px-5 py-3 text-small text-fg-2">
              <Check size={16} aria-label={afterLabel} className="mt-0.5 shrink-0 text-success" />
              {row.after}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

```tsx
// src/components/ui/ConceptCards.tsx
import { iconFor, type IconName } from "./icons";

interface ConceptCard {
  icon: IconName;
  name: string;
  phase: number;
}

const concepts: ConceptCard[] = [
  { icon: "code", name: "Python", phase: 1 },
  { icon: "lightning", name: "FastAPI", phase: 1 },
  { icon: "flask", name: "Pytest", phase: 2 },
  { icon: "broom", name: "Ruff", phase: 3 },
  { icon: "package", name: "Docker", phase: 4 },
  { icon: "gear", name: "GitHub Actions", phase: 5 },
  { icon: "lock", name: "Semgrep", phase: 6 },
  { icon: "shield-check", name: "Trivy", phase: 7 },
];

export default function ConceptCards({ onCardClick }: { onCardClick?: (phase: number) => void }) {
  return (
    <div className="my-12">
      <h3 className="text-h3 text-fg">Tech stack</h3>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {concepts.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => onCardClick?.(c.phase)}
            className="flex flex-col items-center justify-center gap-2 rounded-md border border-border bg-surface p-4 text-fg-2 transition-colors duration-150 hover:border-fg-3 hover:text-fg"
          >
            {iconFor(c.icon, { size: 24 })}
            <span className="font-mono text-caption text-fg">{c.name}</span>
            <span className="text-caption text-fg-3">Phase {c.phase}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

```tsx
// src/components/ui/DifficultyIndicator.tsx
import { ChartBar, ClipboardText, Timer, Wrench } from "@phosphor-icons/react/dist/ssr";
import Tag, { type TagTone } from "./Tag";

interface DifficultyIndicatorProps {
  readingTime: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  handsOn: boolean;
  prerequisites?: string;
}

const tone: Record<DifficultyIndicatorProps["difficulty"], TagTone> = { Beginner: "success", Intermediate: "tip", Advanced: "danger" };

export default function DifficultyIndicator({ readingTime, difficulty, handsOn, prerequisites }: DifficultyIndicatorProps) {
  const items = [
    { icon: Timer, label: "Reading", value: `${readingTime} min` },
    { icon: ChartBar, label: "Level", value: <Tag tone={tone[difficulty]} mono={false}>{difficulty}</Tag> },
    { icon: Wrench, label: "Hands-on", value: handsOn ? "Yes" : "No" },
    ...(prerequisites ? [{ icon: ClipboardText, label: "Prerequisites", value: prerequisites }] : []),
  ];
  return (
    <dl className="mb-8 flex flex-wrap gap-x-8 gap-y-4 rounded-md border border-border bg-surface-2 px-5 py-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-2">
          <item.icon size={18} aria-hidden className="mt-0.5 text-fg-3" />
          <div>
            <dt className="text-caption text-fg-3">{item.label}</dt>
            <dd className="text-small font-medium text-fg">{item.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
```

```tsx
// src/components/ui/LaunchChecklist.tsx
import { Check, Code, RocketLaunch, Timer, Warning, Wrench, type Icon } from "@phosphor-icons/react/dist/ssr";

interface LaunchChecklistProps {
  items: { label: string; value: string; icon?: "rocket" | "clock" | "code" | "warning" | "check" | "tool" }[];
  variant?: "default" | "minimal";
}

const icons: Record<NonNullable<LaunchChecklistProps["items"][number]["icon"]>, Icon> = {
  rocket: RocketLaunch,
  clock: Timer,
  code: Code,
  warning: Warning,
  check: Check,
  tool: Wrench,
};

export default function LaunchChecklist({ items, variant = "default" }: LaunchChecklistProps) {
  if (variant === "minimal") {
    return (
      <ul className="my-6 flex flex-wrap gap-2">
        {items.map((item, i) => {
          const IconCmp = icons[item.icon ?? "check"];
          return (
            <li key={i} className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2 text-small">
              <IconCmp size={16} aria-hidden className="text-fg-3" />
              <span className="text-fg-3">{item.label}</span>
              <span className="font-medium text-fg">{item.value}</span>
            </li>
          );
        })}
      </ul>
    );
  }
  return (
    <div className="my-8 rounded-lg border border-border bg-surface-2 p-5">
      <p className="mb-4 text-caption font-medium text-fg-3">Before you start</p>
      <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item, i) => {
          const IconCmp = icons[item.icon ?? "check"];
          return (
            <div key={i}>
              <dt className="flex items-center gap-1.5 text-caption text-fg-3">
                <IconCmp size={14} aria-hidden /> {item.label}
              </dt>
              <dd className="mt-1 text-small font-medium text-fg">{item.value}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
```

- [ ] **Step 9: Rewrite `src/components/ui/Confetti.tsx`**

Keep the `ConfettiPiece`, `ConfettiProps` interfaces and the piece-generation logic; change the color list and the celebration message:

```tsx
const colors = ["#eb9b63", "#a84d18", "#2f9e6a", "#4f7fd9", "#a7a7b0"];
```

```tsx
export const CelebrationMessage = ({ isVisible, phaseName, onClose }: { isVisible: boolean; phaseName: string; onClose: () => void }) => {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!isVisible) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="celebration-title"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-[rgb(11_11_13_/_0.5)] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={reduce ? false : { y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md rounded-lg border border-border bg-surface p-8 text-center shadow-float"
            onClick={(e) => e.stopPropagation()}
          >
            <ConfettiIcon size={40} aria-hidden className="mx-auto text-accent" />
            <h3 id="celebration-title" className="mt-4 text-h3 text-fg">Phase complete</h3>
            <p className="mt-2 text-body text-fg-2">
              You finished <strong className="text-fg">{phaseName}</strong>.
            </p>
            <Button onClick={onClose} className="mt-6" autoFocus>
              Continue
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

Imports at the top of the file become:

```tsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Confetti as ConfettiIcon } from "@phosphor-icons/react/dist/ssr";
import Button from "./Button";
```

Change the confetti container's class from `z-[100]` to `z-50`.

- [ ] **Step 10: Swap emoji step icons in `src/components/ui/AnimatedDiagram.tsx`**

Replace the `icon` values in the exported `cicdPipelineSteps` and `dockerFlowSteps` arrays using this table (left is the current emoji, right is the registry name): 📤 `export`, 🧹 `broom`, 🧪 `flask`, 🔒 `lock`, 🐳 `package`, 🛡️ `shield-check`, 📝 `file-text`, 🔨 `hammer`, 📦 `package`, 📈 `trend-up`.

Find the JSX that renders `{step.icon}` (a `<span>` with a large text size) and replace it with `{step.icon ? iconFor(step.icon, { size: 22 }) : null}`, adding `import { iconFor } from "./icons";` at the top. Remove the text-size classes that only existed for the emoji.

- [ ] **Step 11: Build gate and commit**

```bash
grep -nP "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" src/components/ui/*.tsx; echo "exit=$?"
NEXT_TELEMETRY_DISABLED=1 npm run build
```

Expected: the grep prints nothing for the rewritten files (`exit=1` when no emoji remain anywhere in `ui/`; if diagram components still hold emoji they are handled by the codemod in Task 10), and the build succeeds.

```bash
git add -A
git commit -m "feat: rebuild tutorial primitives (terminal, quiz, flashcards, tables, checklist, confetti)"
```

---

### Task 5: Brand components (avatar, head mark, wordmark, Konami egg)

**Files:**
- Create: `src/components/brand/Avatar.tsx`, `src/components/brand/AvatarHead.tsx`, `src/components/brand/Wordmark.tsx`, `src/components/brand/Konami.tsx`

**Interfaces:**
- Consumes: `useKonami` from `src/hooks/useKonami.ts` (existing), pose images in `public/world/poses/`.
- Produces: `Avatar({ pose, width, flip?, className?, track?, pokeable?, priority? })` with `PoseName` type; `AvatarHead({ width?, className? })`; `Wordmark({ compact? })`; `Konami()`.
- The old `src/components/world/Avatar.tsx` stays untouched until Task 16 (old pages import it).

- [ ] **Step 1: Create `src/components/brand/Avatar.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export type PoseName = "master" | "wave" | "laptop" | "peek" | "point" | "read" | "bored" | "lost";

const POSE_ALT: Record<PoseName, string> = {
  master: "Cartoon Charith standing and smiling",
  wave: "Cartoon Charith waving hello",
  laptop: "Cartoon Charith sitting cross-legged, typing on a laptop",
  peek: "Cartoon Charith leaning over curiously",
  point: "Cartoon Charith pointing to the side",
  read: "Cartoon Charith in reading glasses holding a book",
  bored: "Cartoon Charith looking at his phone",
  lost: "Cartoon Charith holding a map upside down",
};

const POKE_LINES = ["hi!", "that tickles", "yes?", "still me", "ok ok stop poking me"];

interface AvatarProps {
  pose?: PoseName;
  width?: number;
  flip?: boolean;
  className?: string;
  /** Tilt the sprite toward the cursor (hero only). */
  track?: boolean;
  /** Show the poke lines when clicked. */
  pokeable?: boolean;
  /** Eager-load for the LCP candidate in the hero. */
  priority?: boolean;
}

export default function Avatar({ pose = "master", width = 220, flip = false, className, track = false, pokeable = true, priority = false }: AvatarProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [pokeCount, setPokeCount] = useState(0);
  const [pokeLine, setPokeLine] = useState<string | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotate = useSpring(useTransform(mx, [-1, 1], [-6, 6]), { stiffness: 120, damping: 14 });
  const tiltY = useSpring(useTransform(my, [-1, 1], [-3, 5]), { stiffness: 120, damping: 14 });

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

  const poke = () => {
    if (!pokeable) return;
    const next = Math.min(pokeCount + 1, POKE_LINES.length);
    setPokeCount(next);
    setPokeLine(POKE_LINES[next - 1]);
    setTimeout(() => setPokeLine(null), 1800);
  };

  const height = Math.round(width * 1.4);

  return (
    <motion.div
      ref={ref}
      onClick={poke}
      style={track && !reduce ? { rotate, y: tiltY } : undefined}
      whileTap={pokeable && !reduce ? { scale: 0.97 } : undefined}
      className={cn("relative inline-block select-none", pokeable && "cursor-pointer", className)}
      aria-live={pokeable ? "polite" : undefined}
    >
      {pokeLine && (
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-3 py-1.5 font-display text-small text-fg shadow-float">
          {pokeLine}
        </span>
      )}
      {/* Plain img: images are unoptimized in static export, and explicit dimensions prevent layout shift. */}
      <img
        src={`/world/poses/${pose}.webp`}
        alt={POSE_ALT[pose]}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={cn("h-auto", flip && "-scale-x-100")}
        style={{ width, maxWidth: "100%" }}
      />
    </motion.div>
  );
}
```

- [ ] **Step 2: Create `src/components/brand/AvatarHead.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/** Head-only sprite that leans toward the cursor. Used as the wordmark mark. */
export default function AvatarHead({ width = 36, className }: { width?: number; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotate = useSpring(useTransform(mx, [-1, 1], [-12, 12]), { stiffness: 150, damping: 12 });
  const ty = useSpring(useTransform(my, [-1, 1], [-3, 3]), { stiffness: 150, damping: 12 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mx.set(Math.max(-1, Math.min(1, (e.clientX - (rect.left + rect.width / 2)) / 500)));
      my.set(Math.max(-1, Math.min(1, (e.clientY - (rect.top + rect.height / 2)) / 500)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  return (
    <motion.div ref={ref} style={reduce ? undefined : { rotate, y: ty }} className={cn("inline-block shrink-0", className)}>
      <img src="/world/poses/head.webp" alt="" aria-hidden width={width} height={width} decoding="async" style={{ width, height: width }} />
    </motion.div>
  );
}
```

- [ ] **Step 3: Create `src/components/brand/Wordmark.tsx` and `src/components/brand/Konami.tsx`**

```tsx
// src/components/brand/Wordmark.tsx
import Link from "next/link";
import AvatarHead from "./AvatarHead";
import { cn } from "@/lib/utils";

export default function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-md" aria-label="Charith Kapuluru, home">
      <AvatarHead width={36} />
      <span className={cn("font-display text-[1.0625rem] font-semibold tracking-tight text-fg", compact && "hidden sm:inline")}>
        Charith Kapuluru
      </span>
    </Link>
  );
}
```

```tsx
// src/components/brand/Konami.tsx
"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Avatar from "./Avatar";
import { useKonami } from "@/hooks/useKonami";

/** Up, up, down, down, left, right, left, right, B, A: the avatar spins across the bottom of the screen. */
export default function Konami() {
  const reduce = useReducedMotion();
  const [dancing, setDancing] = useState(false);

  useKonami(
    useCallback(() => {
      if (reduce || dancing) return;
      setDancing(true);
      setTimeout(() => setDancing(false), 3200);
    }, [reduce, dancing]),
  );

  return (
    <AnimatePresence>
      {dancing && (
        <motion.div
          key="dance"
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1, rotate: [0, 360, 720] }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2"
          aria-hidden
        >
          <Avatar pose="wave" width={150} pokeable={false} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Build gate and commit**

```bash
NEXT_TELEMETRY_DISABLED=1 npm run build
git add -A
git commit -m "feat: brand components (avatar, head mark, wordmark, konami)"
```

---

### Task 6: Layout (skip link, theme toggle, site nav with sheet, footer) wired into the root layout

**Files:**
- Create: `src/components/layout/SkipLink.tsx`, `src/components/layout/ThemeToggle.tsx`, `src/components/layout/SiteNav.tsx`, `src/components/layout/NavSheet.tsx`, `src/components/layout/Footer.tsx`
- Modify: `src/app/layout.tsx` (mount `SkipLink` and `Konami`)

**Interfaces:**
- Consumes: `Button`, `Wordmark`, `Konami`, `ThemeToggle`.
- Produces: `SiteNav({ active?: "home" | "projects" | "fundamentals" | "contact" })`, `NAV_LINKS`, `Footer()`, `ThemeToggle()`, `SkipLink()`. Every page renders `<main id="main">` so the skip link has a target.

- [ ] **Step 1: Create `SkipLink.tsx` and `ThemeToggle.tsx`**

```tsx
// src/components/layout/SkipLink.tsx
export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-small focus:font-medium focus:text-primary-fg"
    >
      Skip to content
    </a>
  );
}
```

```tsx
// src/components/layout/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "@phosphor-icons/react/dist/ssr";

const ORDER = ["system", "light", "dark"] as const;
type Mode = (typeof ORDER)[number];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
      <Icon size={20} aria-hidden />
    </button>
  );
}
```

- [ ] **Step 2: Create `SiteNav.tsx` and `NavSheet.tsx`**

```tsx
// src/components/layout/SiteNav.tsx
import Link from "next/link";
import Wordmark from "@/components/brand/Wordmark";
import Button from "@/components/ui/Button";
import ThemeToggle from "./ThemeToggle";
import NavSheet from "./NavSheet";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { key: "projects", href: "/projects", label: "Projects" },
  { key: "fundamentals", href: "/fundamentals", label: "Fundamentals" },
  { key: "contact", href: "/contact", label: "Contact" },
] as const;

export type NavKey = (typeof NAV_LINKS)[number]["key"] | "home";

export default function SiteNav({ active }: { active?: NavKey }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Wordmark />
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.key;
            return (
              <li key={l.key}>
                <Link
                  href={l.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-small font-medium text-fg-2 transition-colors duration-150 hover:text-fg",
                    isActive && "text-fg after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:rounded-full after:bg-accent",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button href="/ck.pdf" download="Charith_Kapuluru_Resume.pdf" size="sm" className="hidden md:inline-flex">
            Resume
          </Button>
          <NavSheet active={active} />
        </div>
      </nav>
    </header>
  );
}
```

```tsx
// src/components/layout/NavSheet.tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { NAV_LINKS, type NavKey } from "./SiteNav";
import ThemeToggle from "./ThemeToggle";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Mobile menu. A native <dialog> gives focus trapping, Escape handling and a backdrop for free. */
export default function NavSheet({ active }: { active?: NavKey }) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = () => ref.current?.showModal();
  const close = () => ref.current?.close();

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={open}
        aria-label="Open menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-fg-2 hover:bg-surface-2 hover:text-fg"
      >
        <List size={22} aria-hidden />
      </button>
      <dialog
        ref={ref}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-fg backdrop:bg-transparent"
        onClick={(e) => e.target === ref.current && close()}
      >
        <div className="flex h-full flex-col px-4 py-3">
          <div className="flex h-10 items-center justify-between">
            <span className="font-display text-body font-semibold">Menu</span>
            <button type="button" onClick={close} aria-label="Close menu" className="inline-flex h-10 w-10 items-center justify-center rounded-md text-fg-2 hover:bg-surface-2 hover:text-fg">
              <X size={22} aria-hidden />
            </button>
          </div>
          <ul className="mt-6 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.key}>
                <Link
                  href={l.href}
                  onClick={close}
                  aria-current={active === l.key ? "page" : undefined}
                  className={cn("flex h-12 items-center rounded-md px-3 font-display text-h3 text-fg-2 hover:bg-surface-2 hover:text-fg", active === l.key && "text-fg")}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
            <a href="/ck.pdf" download="Charith_Kapuluru_Resume.pdf" className={buttonClasses("primary", "md")}>
              Resume
            </a>
            <ThemeToggle />
          </div>
        </div>
      </dialog>
    </div>
  );
}
```

- [ ] **Step 3: Create `Footer.tsx`**

```tsx
// src/components/layout/Footer.tsx
import Link from "next/link";

const SITE_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/fundamentals", label: "Fundamentals" },
  { href: "/contact", label: "Contact" },
];

const ELSEWHERE = [
  { href: "https://github.com/CharithKapuluru", label: "GitHub" },
  { href: "https://www.linkedin.com/in/charith-kapuluru-159456329/", label: "LinkedIn" },
  { href: "mailto:kapulurucharith@gmail.com", label: "Email" },
];

const YEAR = new Date().getFullYear(); // evaluated at build time (static export)

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-body font-semibold text-fg">Charith Kapuluru</p>
          <p className="mt-1 text-small text-fg-3">Cloud and DevOps engineer</p>
        </div>
        <div className="flex gap-16">
          <div>
            <p className="text-caption font-medium text-fg-3">Site</p>
            <ul className="mt-3 space-y-2">
              {SITE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-small text-fg-2 hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-caption font-medium text-fg-3">Elsewhere</p>
            <ul className="mt-3 space-y-2">
              {ELSEWHERE.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined} className="text-small text-fg-2 hover:text-fg">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-caption text-fg-3 sm:flex-row sm:justify-between sm:px-6">
          <p>© {YEAR} Charith Kapuluru</p>
          <p>Built with Next.js. Hosted on Firebase.</p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Mount `SkipLink` and `Konami` in `src/app/layout.tsx`**

Add the imports `import SkipLink from "@/components/layout/SkipLink";` and `import Konami from "@/components/brand/Konami";`, then change the body to:

```tsx
<body className="bg-bg font-sans text-fg antialiased">
  <Providers>
    <SkipLink />
    <WorldProvider>
      {children}
      <EasterEggs />
    </WorldProvider>
    <Konami />
  </Providers>
</body>
```

- [ ] **Step 5: Build gate and commit**

```bash
NEXT_TELEMETRY_DISABLED=1 npm run build
git add -A
git commit -m "feat: site nav, mobile sheet, theme toggle, footer, skip link"
```

The new nav is not yet rendered by any page (pages still use `WorldNav`); Tasks 11 to 14 switch them over.

---

### Task 7: Reading system (context, hooks, contextual nav, rails, section wrapper, header, facts, resume notice, next-up)

**Files:**
- Create: `src/lib/storage.ts`, `src/lib/scroll.ts`, `src/lib/progress.ts`, `scripts/storage.test.mjs`, `scripts/scroll.test.mjs`, `scripts/progress.test.mjs`
- Create: `src/components/reading/ReadingNavContext.tsx`, `src/hooks/useReadingNav.ts`, `src/hooks/useProgress.ts`, `src/components/reading/ProgressLine.tsx`, `src/components/reading/SectionsSheet.tsx`, `src/components/reading/ContextualNav.tsx`, `src/components/reading/ReadingLayout.tsx`, `src/components/reading/SignInControl.tsx`, `src/components/reading/OnThisPage.tsx`, `src/components/reading/PhaseRail.tsx`, `src/components/reading/ArticleSection.tsx`, `src/components/reading/ReadingHeader.tsx`, `src/components/reading/FactsPanel.tsx`, `src/components/reading/ResumeNotice.tsx`, `src/components/reading/NextUp.tsx`, `src/components/reading/AvatarNote.tsx`

**Interfaces:**
- Consumes: `Button`, `Tag`, `Skeleton`, `Wordmark`, `ThemeToggle`, `Avatar`, `useAuth`, `db`.
- Produces:
  - `useReadingNav(sections, refs, setCurrent?)` where `sections: { id: number | string; label: string }[]` must be a module-level constant, `refs` is the content file's existing `useRef<(HTMLElement | null)[]>([])`, and `setCurrent` is its existing state setter. It owns the IntersectionObserver and publishes into `ReadingNavContext`. Works without a provider (no-op publish).
  - `useProgress(progressKey, total)` returning `{ completed, toggle, markBefore, reset, ready, loading, signedIn, percent }`.
  - `ReadingLayout({ crumbs, sheetLabel, header, rail, after?, children })`, `OnThisPage({ children? })`, `PhaseRail({ progressKey, actions? })`, `ArticleSection({ id, ref, children })`, `ReadingHeader({ eyebrow?, title, lede?, meta?, aside? })`, `FactsPanel({ repo, stack, phaseCount, estimatedTime, outcome })`, `ResumeNotice({ slug, progressKey })`, `NextUp({ label, title, href, meta?, backHref, backLabel })`, `AvatarNote({ pose?, line?, width? })`, `SignInControl({ className? })`.
  - `safeParse`, `readJson`, `writeJson`, `removeKey` in `src/lib/storage.ts`; `scrollBehavior`, `prefersReducedMotion` in `src/lib/scroll.ts`; `completeThrough`, `toggleIndex`, `percentComplete` in `src/lib/progress.ts`.
- Phase wrappers in project files keep `data-phase="N"` (search results and the resume notice query it) and gain `id="phase-N"` in Task 10.

- [ ] **Step 1: Write the failing tests for the three pure modules**

`scripts/storage.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { safeParse, readJson } from "../src/lib/storage.ts";

test("safeParse returns the fallback for malformed, empty, null and 'null' input", () => {
  assert.deepEqual(safeParse("{not json", []), []);
  assert.deepEqual(safeParse("", { a: 1 }), { a: 1 });
  assert.deepEqual(safeParse(null, 0), 0);
  assert.deepEqual(safeParse("null", "x"), "x");
});

test("safeParse returns parsed values", () => {
  assert.deepEqual(safeParse('{"phase":2,"scroll":900}', null), { phase: 2, scroll: 900 });
});

test("readJson falls back when localStorage does not exist (node, private mode)", () => {
  assert.deepEqual(readJson("anything", ["fallback"]), ["fallback"]);
});
```

`scripts/scroll.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { scrollBehavior, prefersReducedMotion } from "../src/lib/scroll.ts";

test("reduced motion scrolls instantly, otherwise smoothly", () => {
  assert.equal(scrollBehavior(true), "auto");
  assert.equal(scrollBehavior(false), "smooth");
});

test("prefersReducedMotion is false outside a browser", () => {
  assert.equal(prefersReducedMotion(), false);
});
```

`scripts/progress.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { completeThrough, toggleIndex, percentComplete } from "../src/lib/progress.ts";

test("scrolling to phase 3 completes phases 0 to 2", () => {
  assert.deepEqual(completeThrough([], 3, 8), [0, 1, 2]);
});

test("reaching the last phase completes it too", () => {
  assert.deepEqual(completeThrough([0, 1], 7, 8), [0, 1, 2, 3, 4, 5, 6, 7]);
});

test("completeThrough keeps earlier manual completions and never duplicates", () => {
  assert.deepEqual(completeThrough([5, 1], 2, 8), [0, 1, 5]);
});

test("toggleIndex adds and removes and stays sorted", () => {
  assert.deepEqual(toggleIndex([0, 2], 1), [0, 1, 2]);
  assert.deepEqual(toggleIndex([0, 1, 2], 1), [0, 2]);
});

test("percentComplete rounds and handles zero", () => {
  assert.equal(percentComplete([0, 1, 2], 8), 38);
  assert.equal(percentComplete([], 0), 0);
});
```

- [ ] **Step 2: Run them to verify they fail**

```bash
npm test
```

Expected: FAIL, three "Cannot find module" errors for `storage.ts`, `scroll.ts`, `progress.ts`.

- [ ] **Step 3: Create the three pure modules**

```ts
// src/lib/storage.ts
/** JSON.parse that never throws and never returns null/undefined. */
export function safeParse<T>(raw: string | null | undefined, fallback: T): T {
  if (raw == null || raw === "") return fallback;
  try {
    const value = JSON.parse(raw);
    return value === null || value === undefined ? fallback : (value as T);
  } catch {
    return fallback;
  }
}

export function readJson<T>(key: string, fallback: T): T {
  try {
    return safeParse(localStorage.getItem(key), fallback);
  } catch {
    return fallback; // no window, private mode, or blocked storage
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* storage unavailable */
  }
}
```

```ts
// src/lib/scroll.ts
export function scrollBehavior(prefersReducedMotion: boolean): ScrollBehavior {
  return prefersReducedMotion ? "auto" : "smooth";
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
}
```

```ts
// src/lib/progress.ts
/** Auto-completion rule carried over from the old ProgressSidebar: everything before the current phase is done; the last phase completes itself. */
export function completeThrough(prev: number[], current: number, total: number): number[] {
  const set = new Set(prev);
  for (let i = 0; i < current; i++) set.add(i);
  if (total > 0 && current === total - 1) set.add(current);
  return [...set].sort((a, b) => a - b);
}

export function toggleIndex(prev: number[], index: number): number[] {
  return prev.includes(index) ? prev.filter((x) => x !== index) : [...prev, index].sort((a, b) => a - b);
}

export function percentComplete(completed: number[], total: number): number {
  return total === 0 ? 0 : Math.round((completed.length / total) * 100);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 5: Create the reading nav context and the two hooks**

```tsx
// src/components/reading/ReadingNavContext.tsx
"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { prefersReducedMotion, scrollBehavior } from "@/lib/scroll";

export interface ReadingSection {
  id: number | string;
  label: string;
}

export type SectionRefs = RefObject<(HTMLElement | null)[]>;

interface ReadingNavValue {
  sections: ReadingSection[];
  activeIndex: number;
  register: (sections: ReadingSection[], refs: SectionRefs) => void;
  setActive: (index: number) => void;
  scrollTo: (index: number) => void;
}

const ReadingNavContext = createContext<ReadingNavValue | null>(null);

export function useReadingNavContext() {
  return useContext(ReadingNavContext);
}

export function ReadingNavProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<ReadingSection[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const refsRef = useRef<SectionRefs | null>(null);

  const register = useCallback((s: ReadingSection[], refs: SectionRefs) => {
    setSections(s);
    refsRef.current = refs;
  }, []);

  const setActive = useCallback((index: number) => setActiveIndex((prev) => (prev === index ? prev : index)), []);

  const scrollTo = useCallback((index: number) => {
    refsRef.current?.current[index]?.scrollIntoView({ behavior: scrollBehavior(prefersReducedMotion()), block: "start" });
  }, []);

  const value = useMemo(() => ({ sections, activeIndex, register, setActive, scrollTo }), [sections, activeIndex, register, setActive, scrollTo]);

  return <ReadingNavContext.Provider value={value}>{children}</ReadingNavContext.Provider>;
}
```

```ts
// src/hooks/useReadingNav.ts
"use client";

import { useEffect, type RefObject } from "react";
import { useReadingNavContext, type ReadingSection, type SectionRefs } from "@/components/reading/ReadingNavContext";

/**
 * Scroll-spy for tutorial sections. Replaces useActivePhase: same IntersectionObserver band,
 * plus it publishes sections and the active index to the reading rails when a provider exists.
 * `sections` must be a module-level constant so the effect does not re-run every render.
 */
export function useReadingNav<T extends HTMLElement>(
  sections: ReadingSection[],
  refs: RefObject<(T | null)[]>,
  setCurrent?: (index: number) => void,
) {
  const ctx = useReadingNavContext();
  const register = ctx?.register;
  const setActive = ctx?.setActive;

  useEffect(() => {
    register?.(sections, refs as unknown as SectionRefs);
  }, [register, sections, refs]);

  useEffect(() => {
    const els = refs.current.filter(Boolean) as T[];
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = refs.current.indexOf(entry.target as T);
          if (idx !== -1) {
            setCurrent?.(idx);
            setActive?.(idx);
          }
        }
      },
      { rootMargin: "-15% 0px -75% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [refs, setCurrent, setActive]);
}
```

```ts
// src/hooks/useProgress.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { completeThrough, percentComplete, toggleIndex } from "@/lib/progress";

/** Firestore-backed phase progress for signed-in readers. Document: users/{uid}/progress/{progressKey} = { phases: number[] }. */
export function useProgress(progressKey: string, total: number) {
  const { user, loading } = useAuth();
  const [completed, setCompleted] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setCompleted([]);
      setReady(true);
      return;
    }
    const ref = doc(db, "users", user.uid, "progress", progressKey);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const data = snapshot.exists() ? snapshot.data() : null;
        setCompleted(Array.isArray(data?.phases) ? (data!.phases as number[]) : []);
        setReady(true);
      },
      (error) => {
        console.error("Error loading progress:", error);
        setCompleted([]);
        setReady(true);
      },
    );
    return () => unsubscribe();
  }, [user, loading, progressKey]);

  const save = useCallback(
    (phases: number[]) => {
      if (!user) return;
      setDoc(doc(db, "users", user.uid, "progress", progressKey), { phases }, { merge: true }).catch((error) => console.error("Error saving progress:", error));
    },
    [user, progressKey],
  );

  const toggle = useCallback(
    (index: number) => {
      if (!user) return;
      setCompleted((prev) => {
        const next = toggleIndex(prev, index);
        save(next);
        return next;
      });
    },
    [user, save],
  );

  const markBefore = useCallback(
    (current: number) => {
      if (!user) return;
      setCompleted((prev) => {
        const next = completeThrough(prev, current, total);
        if (next.length === prev.length) return prev;
        save(next);
        return next;
      });
    },
    [user, save, total],
  );

  const reset = useCallback(async () => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "progress", progressKey));
    setCompleted([]);
  }, [user, progressKey]);

  return { completed, toggle, markBefore, reset, ready, loading, signedIn: !!user, percent: percentComplete(completed, total) };
}
```

- [ ] **Step 6: Create the contextual nav pieces**

```tsx
// src/components/reading/ProgressLine.tsx
"use client";

import { motion, useScroll } from "framer-motion";

export default function ProgressLine() {
  const { scrollYProgress } = useScroll();
  return <motion.div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent" style={{ scaleX: scrollYProgress }} />;
}
```

```tsx
// src/components/reading/SectionsSheet.tsx
"use client";

import { useRef } from "react";
import { CaretDown, X } from "@phosphor-icons/react/dist/ssr";
import { useReadingNavContext } from "./ReadingNavContext";
import { cn } from "@/lib/utils";

export default function SectionsSheet({ label, className }: { label: "Sections" | "Phases"; className?: string }) {
  const ctx = useReadingNavContext();
  const ref = useRef<HTMLDialogElement>(null);
  if (!ctx || ctx.sections.length === 0) return null;
  const open = () => ref.current?.showModal();
  const close = () => ref.current?.close();

  return (
    <div className={className}>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-small font-medium text-fg-2 hover:bg-surface-2 hover:text-fg"
      >
        {label}
        <CaretDown size={16} aria-hidden />
      </button>
      <dialog
        ref={ref}
        aria-label={label}
        className="m-0 mt-auto max-h-[80dvh] w-full max-w-none rounded-t-lg border border-border bg-surface p-0 text-fg sm:m-auto sm:max-w-md sm:rounded-lg"
        onClick={(e) => e.target === ref.current && close()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="font-display text-body font-semibold">{label}</span>
          <button type="button" onClick={close} aria-label="Close" className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-2 hover:bg-surface-2">
            <X size={20} aria-hidden />
          </button>
        </div>
        <ol className="max-h-[60dvh] overflow-y-auto p-2">
          {ctx.sections.map((s, i) => (
            <li key={String(s.id)}>
              <button
                type="button"
                onClick={() => {
                  close();
                  ctx.scrollTo(i);
                }}
                aria-current={i === ctx.activeIndex ? "true" : undefined}
                className={cn(
                  "flex h-11 w-full items-center rounded-md px-3 text-left text-small text-fg-2 hover:bg-surface-2 hover:text-fg",
                  i === ctx.activeIndex && "bg-accent-soft font-medium text-accent",
                )}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ol>
      </dialog>
    </div>
  );
}
```

```tsx
// src/components/reading/ContextualNav.tsx
import { Fragment } from "react";
import Link from "next/link";
import Wordmark from "@/components/brand/Wordmark";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/layout/ThemeToggle";
import ProgressLine from "./ProgressLine";
import SectionsSheet from "./SectionsSheet";

export interface Crumb {
  label: string;
  href?: string;
}

export default function ContextualNav({ crumbs, sheetLabel }: { crumbs: Crumb[]; sheetLabel: "Sections" | "Phases" }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Wordmark compact />
          <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-2 text-small text-fg-3 sm:flex">
            {crumbs.map((c, i) => (
              <Fragment key={`${c.label}-${i}`}>
                {i > 0 && <span aria-hidden>/</span>}
                {c.href ? (
                  <Link href={c.href} className="shrink-0 hover:text-fg">
                    {c.label}
                  </Link>
                ) : (
                  <span className="truncate text-fg-2">{c.label}</span>
                )}
              </Fragment>
            ))}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <SectionsSheet label={sheetLabel} className="xl:hidden" />
          <ThemeToggle />
          <Button href="/ck.pdf" download="Charith_Kapuluru_Resume.pdf" size="sm" className="hidden md:inline-flex">
            Resume
          </Button>
        </div>
      </div>
      <ProgressLine />
    </header>
  );
}
```

```tsx
// src/components/reading/ReadingLayout.tsx
"use client";

import type { ReactNode } from "react";
import { ReadingNavProvider } from "./ReadingNavContext";
import ContextualNav, { type Crumb } from "./ContextualNav";

interface ReadingLayoutProps {
  crumbs: Crumb[];
  sheetLabel: "Sections" | "Phases";
  header: ReactNode;
  rail: ReactNode;
  after?: ReactNode;
  children: ReactNode;
}

/** Contextual nav + three-column reading grid (gutter, 44rem column, 272px rail) that collapses to one column below xl. */
export default function ReadingLayout({ crumbs, sheetLabel, header, rail, after, children }: ReadingLayoutProps) {
  return (
    <ReadingNavProvider>
      <ContextualNav crumbs={crumbs} sheetLabel={sheetLabel} />
      <main id="main" className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <div className="grid gap-10 py-10 md:py-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,44rem)_272px] xl:gap-12">
          <div className="hidden xl:block" aria-hidden />
          <div className="mx-auto w-full min-w-0 max-w-[44rem] xl:mx-0 xl:max-w-none">
            {header}
            <div className="reading-body">{children}</div>
            {after}
          </div>
          <aside className="hidden xl:block">
            <div className="sticky top-24">{rail}</div>
          </aside>
        </div>
      </main>
    </ReadingNavProvider>
  );
}
```

- [ ] **Step 7: Create the rails and the sign-in control**

```tsx
// src/components/reading/SignInControl.tsx
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
      <span className="truncate">Signed in as {user.displayName?.split(" ")[0] ?? user.email}</span>
      <button type="button" onClick={logout} className="shrink-0 text-fg-2 underline-offset-2 hover:underline">
        Sign out
      </button>
    </div>
  );
}
```

```tsx
// src/components/reading/OnThisPage.tsx
"use client";

import { useState, type ReactNode } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useReadingNavContext } from "./ReadingNavContext";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

function PercentRead() {
  const { scrollYProgress } = useScroll();
  const [pct, setPct] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const p = Math.round(v * 100);
    setPct((prev) => (prev === p ? prev : p));
  });
  return <span className="tabular">{pct}%</span>;
}

export default function OnThisPage({ children }: { children?: ReactNode }) {
  const ctx = useReadingNavContext();
  return (
    <nav aria-label="On this page" className="text-small">
      <p className="mb-3 text-caption font-medium text-fg-3">On this page</p>
      {ctx && ctx.sections.length > 0 ? (
        <ol className="border-l border-border">
          {ctx.sections.map((s, i) => {
            const active = i === ctx.activeIndex;
            return (
              <li key={String(s.id)}>
                <button
                  type="button"
                  onClick={() => ctx.scrollTo(i)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "-ml-px block w-full border-l-2 py-1.5 pl-3 text-left text-fg-3 transition-colors duration-150 hover:text-fg",
                    active ? "border-accent text-fg" : "border-transparent",
                  )}
                >
                  {s.label}
                </button>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )}
      <p className="mt-4 text-caption text-fg-3">
        <PercentRead /> read
      </p>
      {children}
    </nav>
  );
}
```

```tsx
// src/components/reading/PhaseRail.tsx
"use client";

import { useEffect, type ReactNode } from "react";
import { useReadingNavContext } from "./ReadingNavContext";
import { useProgress } from "@/hooks/useProgress";
import SignInControl from "./SignInControl";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export default function PhaseRail({ progressKey, actions }: { progressKey: string; actions?: ReactNode }) {
  const ctx = useReadingNavContext();
  const total = ctx?.sections.length ?? 0;
  const activeIndex = ctx?.activeIndex ?? 0;
  const progress = useProgress(progressKey, total);
  const { markBefore } = progress;

  useEffect(() => {
    if (total > 0) markBefore(activeIndex);
  }, [activeIndex, total, markBefore]);

  return (
    <nav aria-label="Phases" className="text-small">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-caption font-medium text-fg-3">Phases</p>
        {progress.signedIn && <p className="text-caption text-fg-3 tabular">{progress.percent}%</p>}
      </div>
      {progress.signedIn && (
        <div className="mb-3 h-px w-full bg-border">
          <div className="h-px bg-accent transition-[width] duration-300" style={{ width: `${progress.percent}%` }} />
        </div>
      )}
      {!ctx || total === 0 ? (
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      ) : (
        <ol className="space-y-0.5">
          {ctx.sections.map((s, i) => {
            const active = i === activeIndex;
            const done = progress.completed.includes(i);
            return (
              <li key={String(s.id)} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={done}
                  disabled={!progress.signedIn || !progress.ready}
                  onChange={() => progress.toggle(i)}
                  aria-label={`Mark ${s.label} complete`}
                  className="h-4 w-4 shrink-0 accent-accent disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => ctx.scrollTo(i)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "flex h-8 min-w-0 flex-1 items-center rounded-md px-2 text-left text-fg-3 hover:text-fg",
                    active && "bg-accent-soft font-medium text-accent",
                    done && !active && "line-through",
                  )}
                >
                  {s.label}
                </button>
              </li>
            );
          })}
        </ol>
      )}
      {progress.loading ? (
        <Skeleton className="mt-4 h-9 w-full" />
      ) : progress.signedIn ? (
        <SignInControl className="mt-4" />
      ) : (
        <div className="mt-4 rounded-md border border-border bg-surface-2 p-3">
          <p className="text-caption text-fg-2">Sign in to save progress across devices.</p>
          <SignInControl className="mt-2" />
        </div>
      )}
      {actions && <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">{actions}</div>}
    </nav>
  );
}
```

- [ ] **Step 8: Create the section wrapper, header, facts panel, resume notice, next-up and avatar note**

```tsx
// src/components/reading/ArticleSection.tsx
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Replaces the per-file Section wrappers: calm surface, hairline between sections, anchor-safe offset. */
const ArticleSection = forwardRef<HTMLElement, { id: string; children: ReactNode; className?: string }>(function ArticleSection(
  { id, children, className },
  ref,
) {
  return (
    <section id={id} ref={ref} className={cn("scroll-mt-24 border-t border-border py-10 first:border-t-0 first:pt-0 md:py-14", className)}>
      {children}
    </section>
  );
});

export default ArticleSection;
```

```tsx
// src/components/reading/ReadingHeader.tsx
import type { ReactNode } from "react";

interface ReadingHeaderProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  meta?: { label: string; value: string }[];
  aside?: ReactNode;
}

export default function ReadingHeader({ eyebrow, title, lede, meta, aside }: ReadingHeaderProps) {
  return (
    <header className="mb-10 border-b border-border pb-8 md:mb-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          {eyebrow && <p className="mb-3 text-caption font-medium text-fg-3">{eyebrow}</p>}
          <h1 className="text-display-lg text-fg">{title}</h1>
          {lede && <p className="mt-4 max-w-[60ch] text-lede text-fg-2">{lede}</p>}
          {meta && meta.length > 0 && (
            <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-small text-fg-3">
              {meta.map((m) => (
                <div key={m.label} className="flex gap-1.5">
                  <dt>{m.label}</dt>
                  <dd className="font-medium text-fg-2 tabular">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {aside && <div className="shrink-0 lg:pl-6">{aside}</div>}
      </div>
    </header>
  );
}
```

```tsx
// src/components/reading/FactsPanel.tsx
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import Tag from "@/components/ui/Tag";

interface FactsPanelProps {
  repo: string;
  stack: string[];
  phaseCount: number;
  estimatedTime: string;
  outcome: string;
}

export default function FactsPanel({ repo, stack, phaseCount, estimatedTime, outcome }: FactsPanelProps) {
  const repoName = repo.replace("https://github.com/", "");
  return (
    <dl className="mb-10 grid gap-5 rounded-lg border border-border bg-surface p-5 sm:grid-cols-2 md:p-6">
      <div className="sm:col-span-2">
        <dt className="text-caption text-fg-3">Repository</dt>
        <dd className="mt-1">
          <a href={repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-small font-medium text-accent hover:text-accent-strong">
            <GithubLogo size={16} aria-hidden />
            {repoName}
            <ArrowUpRight size={14} aria-hidden />
          </a>
        </dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="text-caption text-fg-3">Stack</dt>
        <dd className="mt-1.5 flex flex-wrap gap-1.5">
          {stack.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </dd>
      </div>
      <div>
        <dt className="text-caption text-fg-3">Phases</dt>
        <dd className="mt-1 text-small font-medium text-fg tabular">{phaseCount}</dd>
      </div>
      <div>
        <dt className="text-caption text-fg-3">Estimated time</dt>
        <dd className="mt-1 text-small font-medium text-fg">{estimatedTime}</dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="text-caption text-fg-3">Outcome</dt>
        <dd className="mt-1 text-small text-fg-2">{outcome}</dd>
      </div>
    </dl>
  );
}
```

```tsx
// src/components/reading/ResumeNotice.tsx
"use client";

import { useEffect, useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { readJson, removeKey, writeJson } from "@/lib/storage";
import { prefersReducedMotion, scrollBehavior } from "@/lib/scroll";

interface Position {
  phase: number;
  scroll: number;
  timestamp: number;
}

/** Inline "welcome back" notice. Saves the reading position when the tab hides or unloads (no polling). */
export default function ResumeNotice({ slug, progressKey }: { slug: string; progressKey: string }) {
  const { user } = useAuth();
  const key = `readingPosition_${slug}`;
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    const saved = readJson<Position | null>(key, null);
    if (saved && typeof saved.scroll === "number" && saved.scroll > 200) setPosition(saved);

    const save = () => {
      let phase = 0;
      document.querySelectorAll<HTMLElement>("[data-phase]").forEach((el, i) => {
        if (el.getBoundingClientRect().top <= 200) phase = i;
      });
      writeJson(key, { phase, scroll: window.scrollY, timestamp: Date.now() });
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") save();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", save);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", save);
    };
  }, [key]);

  if (!position) return null;

  const resume = () => {
    window.scrollTo({ top: Math.max(0, position.scroll - 72), behavior: scrollBehavior(prefersReducedMotion()) });
    setPosition(null);
    removeKey(key);
  };

  const startFresh = async () => {
    removeKey(key);
    setPosition(null);
    if (user) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "progress", progressKey));
      } catch (error) {
        console.error("Could not clear progress:", error);
      }
    }
    window.scrollTo({ top: 0, behavior: scrollBehavior(prefersReducedMotion()) });
  };

  return (
    <div role="status" className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface-2 px-4 py-3">
      <p className="text-small text-fg-2">Welcome back. Resume where you left off?</p>
      <div className="flex gap-2">
        <Button size="sm" onClick={resume}>
          Resume
        </Button>
        <Button size="sm" variant="ghost" onClick={startFresh}>
          Start fresh
        </Button>
      </div>
    </div>
  );
}
```

```tsx
// src/components/reading/NextUp.tsx
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

interface NextUpProps {
  label: string;
  title: string;
  href: string;
  meta?: string;
  backHref: string;
  backLabel: string;
}

export default function NextUp({ label, title, href, meta, backHref, backLabel }: NextUpProps) {
  return (
    <div className="mt-16 border-t border-border pt-8">
      <Link href={href} className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-surface p-5 transition-colors duration-150 hover:border-fg-3">
        <div className="min-w-0">
          <p className="text-caption text-fg-3">{label}</p>
          <p className="mt-1 font-display text-h3 text-fg group-hover:text-accent">{title}</p>
          {meta && <p className="mt-1 text-small text-fg-3">{meta}</p>}
        </div>
        <ArrowRight size={20} aria-hidden className="shrink-0 text-fg-3 transition-transform duration-150 group-hover:translate-x-0.5" />
      </Link>
      <Link href={backHref} className="mt-4 inline-flex items-center gap-1.5 text-small text-fg-2 hover:text-fg">
        <ArrowLeft size={16} aria-hidden />
        {backLabel}
      </Link>
    </div>
  );
}
```

```tsx
// src/components/reading/AvatarNote.tsx
import Avatar, { type PoseName } from "@/components/brand/Avatar";

/** The one avatar moment on a reading page: a small pose with the page's one-liner as a muted caption. */
export default function AvatarNote({ pose = "read", line, width = 120 }: { pose?: PoseName; line?: string; width?: number }) {
  return (
    <figure className="flex flex-col items-center gap-2 lg:w-[160px]">
      <Avatar pose={pose} width={width} pokeable={false} />
      {line && <figcaption className="max-w-[22ch] text-center text-caption text-fg-3">{line}</figcaption>}
    </figure>
  );
}
```

- [ ] **Step 9: Build gate and commit**

```bash
npm test
NEXT_TELEMETRY_DISABLED=1 npm run build
git add -A
git commit -m "feat: reading system (contextual nav, rails, section wrapper, progress hook)"
```

Nothing renders these yet; Tasks 10, 12 and 13 wire them in.

---

### Task 8: Project tools restyle (search, notes, bookmark, share)

**Files:**
- Rewrite: `src/components/ui/SearchBar.tsx`, `src/components/ui/PersonalNotes.tsx`, `src/components/ui/BookmarkButton.tsx`, `src/components/ui/ShareButtons.tsx`
- Create: `src/components/reading/ProjectTools.tsx`

**Interfaces:**
- Consumes: `storage.ts` helpers, `Button`, `useAuth`, Firestore.
- Produces: `SearchBar({ trigger?: boolean })` (the dialog with the Cmd/Ctrl+K shortcut; `trigger` renders a visible rail button), `PersonalNotes({ phaseId, phaseName, projectSlug? })` unchanged props, `AllNotesViewer({ variant?: "inline" | "fab" })` (default `inline`), `BookmarkButton({ phaseId, phaseName, projectSlug? })` unchanged props, a deprecated `ReadingPositionTracker` export that renders nothing (deleted in Task 16 after the codemod removes its usages), `ShareButtons({ title, phaseId? })` unchanged props, `ProjectTools()` for the rail.
- Firestore paths and localStorage keys are unchanged: `users/{uid}/bookmarks/{slug}_phase{n}`, `bookmarkedPhases_{slug}`, `users/{uid}/notes/{id}`, `personalNotes_{slug}`.

- [ ] **Step 1: Rewrite `src/components/ui/SearchBar.tsx`**

Keep the existing `SearchResult` interface and the `searchableContent` array exactly as they are (they index the DevSecOps phases; the other two projects used the same index before, so behaviour is unchanged). Replace the component with:

```tsx
export default function SearchBar({ trigger = false }: { trigger?: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const open = () => {
    dialogRef.current?.showModal();
    requestAnimationFrame(() => inputRef.current?.focus());
  };
  const close = () => {
    dialogRef.current?.close();
    setQuery("");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const term = query.toLowerCase();
    const matches: SearchResult[] = [];
    for (const item of searchableContent) {
      const keyword = item.keywords.find((kw) => kw.includes(term) || term.includes(kw));
      const contentIndex = item.content.toLowerCase().indexOf(term);
      if (!keyword && contentIndex === -1) continue;
      let context = item.content.slice(0, 80) + "...";
      if (contentIndex !== -1) {
        const start = Math.max(0, contentIndex - 30);
        const end = Math.min(item.content.length, contentIndex + term.length + 50);
        context = (start > 0 ? "..." : "") + item.content.slice(start, end) + (end < item.content.length ? "..." : "");
      }
      matches.push({ phaseId: item.phaseId, phaseName: item.phaseName, matchText: keyword ?? term, context });
    }
    setResults(matches);
  }, [query]);

  const go = (phaseId: number) => {
    close();
    document.querySelector(`[data-phase="${phaseId}"]`)?.scrollIntoView({ behavior: scrollBehavior(prefersReducedMotion()), block: "start" });
  };

  return (
    <>
      {trigger && (
        <Button variant="secondary" size="sm" onClick={open} aria-haspopup="dialog">
          <MagnifyingGlass size={16} aria-hidden />
          Search
          <kbd className="ml-1 rounded-sm border border-border bg-surface-2 px-1.5 font-mono text-[11px] text-fg-3">⌘K</kbd>
        </Button>
      )}
      <dialog
        ref={dialogRef}
        aria-label="Search this project"
        className="m-auto mt-[10vh] w-full max-w-xl rounded-lg border border-border bg-surface p-0 text-fg shadow-float"
        onClick={(e) => e.target === dialogRef.current && close()}
        onClose={() => setQuery("")}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <MagnifyingGlass size={18} aria-hidden className="text-fg-3" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phases, concepts, tools"
            aria-label="Search"
            className="flex-1 bg-transparent text-body text-fg outline-none placeholder:text-fg-3"
          />
          <kbd className="rounded-sm border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-fg-3">Esc</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {query.length < 2 ? (
            <p className="p-4 text-center text-small text-fg-3">Type at least two characters.</p>
          ) : results.length === 0 ? (
            <p className="p-4 text-center text-small text-fg-3">No results for &ldquo;{query}&rdquo;.</p>
          ) : (
            <ul className="py-2">
              {results.map((r) => (
                <li key={r.phaseId}>
                  <button type="button" onClick={() => go(r.phaseId)} className="w-full px-4 py-3 text-left hover:bg-surface-2">
                    <span className="flex items-center gap-2">
                      <Tag>Phase {r.phaseId}</Tag>
                      <span className="text-small font-medium text-fg">{r.phaseName}</span>
                    </span>
                    <span className="mt-1 line-clamp-2 block text-caption text-fg-3">{r.context}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border bg-surface-2 px-4 py-2 text-caption text-fg-3">
          <span>
            {results.length} result{results.length !== 1 ? "s" : ""}
          </span>
          <span>Esc to close</span>
        </div>
      </dialog>
    </>
  );
}
```

Imports at the top of the file:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import Button from "./Button";
import Tag from "./Tag";
import { prefersReducedMotion, scrollBehavior } from "@/lib/scroll";
```

- [ ] **Step 2: Rewrite `src/components/ui/PersonalNotes.tsx`**

Keep the `Note` interface and the Firestore/localStorage logic (`saveNote`, `deleteNote`, the loading effect) but route all localStorage access through `readJson`/`writeJson`. Replace the markup of both components:

```tsx
export default function PersonalNotes({ phaseId, phaseName, projectSlug = "devsecops-pipeline" }: PersonalNotesProps) {
  const { user } = useAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const storageKey = `personalNotes_${projectSlug}`;

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "users", user.uid, "notes"), where("phaseId", "==", phaseId), where("projectSlug", "==", projectSlug));
      return onSnapshot(q, (snapshot) => {
        const data: Note[] = [];
        snapshot.forEach((d) => data.push(d.data() as Note));
        setNotes(data.sort((a, b) => a.timestamp - b.timestamp));
      });
    }
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
      <Button variant="secondary" size="sm" onClick={() => dialogRef.current?.showModal()} aria-haspopup="dialog">
        <Note size={16} aria-hidden />
        Notes{notes.length > 0 ? ` (${notes.length})` : ""}
      </Button>
      <dialog
        ref={dialogRef}
        aria-label={`Notes for ${phaseName}`}
        className="m-auto w-full max-w-md rounded-lg border border-border bg-surface p-0 text-fg shadow-float"
        onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h4 className="font-display text-body font-semibold">Notes for {phaseName}</h4>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close" className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-2 hover:bg-surface-2">
            <X size={18} aria-hidden />
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
                    <button type="button" onClick={() => deleteNote(n.id)} className="inline-flex items-center gap-1 text-danger hover:underline">
                      <Trash size={14} aria-hidden /> Delete
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

  useEffect(() => {
    if (!open) return;
    if (user) {
      return onSnapshot(collection(db, "users", user.uid, "notes"), (snapshot) => {
        const data: Note[] = [];
        snapshot.forEach((d) => data.push(d.data() as Note));
        setAllNotes(data.sort((a, b) => b.timestamp - a.timestamp));
      });
    }
    setAllNotes(readJson<Note[]>("personalNotes", []).sort((a, b) => b.timestamp - a.timestamp));
  }, [open, user]);

  const show = () => {
    setOpen(true);
    dialogRef.current?.showModal();
  };

  return (
    <>
      <Button variant="secondary" size="sm" onClick={show} aria-haspopup="dialog" className={variant === "fab" ? "fixed bottom-4 left-4 z-30 shadow-float" : undefined}>
        <Books size={16} aria-hidden />
        All notes
      </Button>
      <dialog
        ref={dialogRef}
        aria-label="All your notes"
        className="m-auto w-full max-w-2xl rounded-lg border border-border bg-surface p-0 text-fg shadow-float"
        onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}
        onClose={() => setOpen(false)}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h3 className="font-display text-h3">All your notes</h3>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close" className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-2 hover:bg-surface-2">
            <X size={18} aria-hidden />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {allNotes.length === 0 ? (
            <p className="py-8 text-center text-small text-fg-3">No notes yet. Open Notes on any phase to add one.</p>
          ) : (
            <ul className="space-y-3">
              {allNotes.map((n) => (
                <li key={n.id} className="rounded-md border border-border bg-bg p-4">
                  <Tag>Phase {n.phaseId}</Tag>
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
```

Imports for the file:

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { Books, Note, Trash, X } from "@phosphor-icons/react/dist/ssr";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { readJson, writeJson } from "@/lib/storage";
import Button from "./Button";
import Tag from "./Tag";
```

The `Note` interface gains `projectSlug?: string`.

- [ ] **Step 3: Rewrite `src/components/ui/BookmarkButton.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { BookmarkSimple } from "@phosphor-icons/react/dist/ssr";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { readJson, writeJson } from "@/lib/storage";
import Button from "./Button";

interface BookmarkButtonProps {
  phaseId: number;
  phaseName: string;
  projectSlug?: string;
}

export default function BookmarkButton({ phaseId, phaseName, projectSlug = "devsecops-pipeline" }: BookmarkButtonProps) {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [announce, setAnnounce] = useState("");
  const bookmarkId = `${projectSlug}_phase${phaseId}`;
  const storageKey = `bookmarkedPhases_${projectSlug}`;

  useEffect(() => {
    if (user) {
      return onSnapshot(doc(db, "users", user.uid, "bookmarks", bookmarkId), (snap) => setBookmarked(snap.exists()));
    }
    setBookmarked(readJson<number[]>(storageKey, []).includes(phaseId));
  }, [phaseId, user, bookmarkId, storageKey]);

  const toggle = useCallback(async () => {
    const next = !bookmarked;
    if (user) {
      const ref = doc(db, "users", user.uid, "bookmarks", bookmarkId);
      try {
        if (next) await setDoc(ref, { phaseId, phaseName, projectSlug, timestamp: Date.now() });
        else await deleteDoc(ref);
      } catch (error) {
        console.error("Error toggling bookmark:", error);
        return;
      }
    } else {
      const ids = readJson<number[]>(storageKey, []);
      writeJson(storageKey, next ? [...ids, phaseId] : ids.filter((id) => id !== phaseId));
      setBookmarked(next);
    }
    setAnnounce(next ? `Bookmarked ${phaseName}` : `Removed bookmark for ${phaseName}`);
  }, [bookmarked, user, bookmarkId, phaseId, phaseName, projectSlug, storageKey]);

  return (
    <>
      <Button variant="secondary" size="sm" onClick={toggle} aria-pressed={bookmarked} title={bookmarked ? "Remove bookmark" : "Bookmark this phase"}>
        <BookmarkSimple size={16} weight={bookmarked ? "fill" : "regular"} aria-hidden className={bookmarked ? "text-accent" : undefined} />
        {bookmarked ? "Bookmarked" : "Bookmark"}
      </Button>
      <span className="sr-only" aria-live="polite">
        {announce}
      </span>
    </>
  );
}

/** @deprecated Replaced by reading/ResumeNotice. Kept as a no-op until the codemod removes its usages (Task 10); deleted in Task 16. */
export const ReadingPositionTracker = (_props: { projectSlug?: string; onClearProgress?: () => void }) => null;
```

- [ ] **Step 4: Rewrite `src/components/ui/ShareButtons.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, EnvelopeSimple, LinkedinLogo, ShareNetwork, XLogo } from "@phosphor-icons/react/dist/ssr";
import Button from "./Button";

interface ShareButtonsProps {
  title: string;
  phaseId?: number;
}

export default function ShareButtons({ title, phaseId }: ShareButtonsProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const url = () => {
    const base = window.location.origin + window.location.pathname;
    return phaseId !== undefined ? `${base}#phase-${phaseId}` : base;
  };
  const text = () => `${title}. ${document.title}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
    setOpen(false);
  };
  const popup = (href: string) => {
    window.open(href, "_blank", "width=550,height=420,noopener");
    setOpen(false);
  };

  const items = [
    { label: copied ? "Copied" : "Copy link", icon: Copy, onClick: copy },
    { label: "X", icon: XLogo, onClick: () => popup(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text())}&url=${encodeURIComponent(url())}`) },
    { label: "LinkedIn", icon: LinkedinLogo, onClick: () => popup(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url())}`) },
    { label: "Email", icon: EnvelopeSimple, onClick: () => { window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text()}\n\n${url()}`)}`; setOpen(false); } },
  ];

  return (
    <div ref={wrap} className="relative inline-block">
      <Button variant="secondary" size="sm" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        <ShareNetwork size={16} aria-hidden />
        Share
      </Button>
      {open && (
        <ul role="menu" className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-float">
          {items.map((item) => (
            <li key={item.label} role="none">
              <button type="button" role="menuitem" onClick={item.onClick} className="flex w-full items-center gap-3 px-3 py-2 text-left text-small text-fg hover:bg-surface-2">
                <item.icon size={16} aria-hidden className="text-fg-3" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create `src/components/reading/ProjectTools.tsx`**

```tsx
"use client";

import SearchBar from "@/components/ui/SearchBar";
import { AllNotesViewer } from "@/components/ui/PersonalNotes";

/** Rail actions for project walkthroughs: in-page search and the all-notes dialog. */
export default function ProjectTools() {
  return (
    <>
      <SearchBar trigger />
      <AllNotesViewer />
    </>
  );
}
```

- [ ] **Step 6: Build gate and commit**

```bash
NEXT_TELEMETRY_DISABLED=1 npm run build
git add -A
git commit -m "feat: restyle project tools (search, notes, bookmark, share) on native dialogs"
```

---

### Task 9: Data additions (projects, guides) with validation tests

**Files:**
- Modify: `src/lib/projectsData.ts`, `src/lib/fundamentalsData.ts`
- Create: `scripts/data.test.mjs`

**Interfaces:**
- Produces: `Project` gains `repo`, `lede`, `outcome`, `estimatedTime`, `whatYouBuild`, `icon: "git-branch" | "cloud-arrow-up" | "terminal"`, optional `progressKey`; loses `gradient`. `FundamentalsTopic` gains `lede`; loses `gradient` and `icon`. `categories` unchanged. New helper `getProjectProgressKey(project)` and `getNextTopic(slug)` / `getNextProject(slug)`.

- [ ] **Step 1: Write the failing data test**

Create `scripts/data.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { projects, getProjectProgressKey, getNextProject } from "../src/lib/projectsData.ts";
import { topics, categories, getNextTopic } from "../src/lib/fundamentalsData.ts";

test("every project has a GitHub repo, a lede, an outcome, a time estimate and an icon", () => {
  for (const p of projects) {
    assert.match(p.repo, /^https:\/\/github\.com\/CharithKapuluru\/[\w-]+$/, p.slug);
    for (const field of ["lede", "outcome", "estimatedTime", "whatYouBuild"]) assert.ok(p[field]?.length > 10, `${p.slug}.${field}`);
    assert.ok(["git-branch", "cloud-arrow-up", "terminal"].includes(p.icon), p.slug);
    assert.equal("gradient" in p, false, "gradient removed");
  }
});

test("the Linux project keeps its historical Firestore progress key", () => {
  const linux = projects.find((p) => p.slug === "linux-sysadmin-deep-dive");
  assert.equal(getProjectProgressKey(linux), "linux-sysadmin");
  assert.equal(getProjectProgressKey(projects.find((p) => p.slug === "devsecops-pipeline")), "devsecops-pipeline");
});

test("every topic has a lede, belongs to a known category and has no gradient or icon", () => {
  const ids = new Set(categories.map((c) => c.id));
  for (const t of topics) {
    assert.ok(t.lede.length > 20, t.slug);
    assert.ok(ids.has(t.category), `${t.slug} category`);
    assert.equal("gradient" in t, false);
    assert.equal("icon" in t, false);
  }
});

test("no shell copy in the data files contains an em-dash or en-dash", () => {
  for (const t of topics) assert.doesNotMatch(t.lede + t.description, /[\u2013\u2014]/, t.slug);
  for (const p of projects) assert.doesNotMatch(p.lede + p.outcome + p.whatYouBuild + p.description, /[\u2013\u2014]/, p.slug);
});

test("next helpers wrap around", () => {
  assert.equal(getNextTopic(topics[topics.length - 1].slug).slug, topics[0].slug);
  assert.equal(getNextProject(projects[projects.length - 1].slug).slug, projects[0].slug);
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test
```

Expected: FAIL (missing exports and fields).

- [ ] **Step 3: Rewrite `src/lib/projectsData.ts`**

```ts
export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  /** One sentence under the H1 (the former in-content title). */
  lede: string;
  description: string;
  technologies: string[];
  phaseCount: number;
  repo: string;
  outcome: string;
  estimatedTime: string;
  whatYouBuild: string;
  icon: "git-branch" | "cloud-arrow-up" | "terminal";
  /** Firestore progress document id when it differs from the slug (historical data). */
  progressKey?: string;
}

export const projects: Project[] = [
  {
    id: "1",
    slug: "devsecops-pipeline",
    title: "Building a DevSecOps Pipeline",
    subtitle: "From Zero to Production",
    lede: "A FastAPI microservice taken from an empty folder to a production-style pipeline with tests, linting, Docker and two security gates.",
    description: "Learn to build a secure CI/CD pipeline with automated testing, security scanning, and containerization.",
    technologies: ["FastAPI", "Docker", "GitHub Actions", "Semgrep", "Trivy"],
    phaseCount: 8,
    repo: "https://github.com/CharithKapuluru/fastapi-devsecops-demo",
    outcome: "18 automated tests, 700+ lint rules, and Semgrep and Trivy security gates on every merge.",
    estimatedTime: "2 to 3 hours",
    whatYouBuild: "A containerized FastAPI service with tests, linting, GitHub Actions CI/CD and two security scanners in the pipeline.",
    icon: "git-branch",
  },
  {
    id: "2",
    slug: "terraform-ecs-deployment",
    title: "AWS ECS Fargate with Terraform",
    subtitle: "Infrastructure as Code",
    lede: "A Flask app deployed to AWS ECS Fargate with every piece of infrastructure written in Terraform, then wired to CodePipeline and CloudWatch.",
    description: "Deploy containerized applications to AWS ECS Fargate using Terraform, with CI/CD pipelines, monitoring, and auto-scaling.",
    technologies: ["Flask", "Terraform", "AWS", "Docker", "CodePipeline"],
    phaseCount: 8,
    repo: "https://github.com/CharithKapuluru/proj2-ecs-fargate",
    outcome: "About 70% lower compute cost with Fargate Spot and autoscaling, with CloudWatch alarms and SNS alerts in place.",
    estimatedTime: "3 to 4 hours",
    whatYouBuild: "A VPC, ALB, ECS Fargate cluster and ECR registry defined in Terraform, deployed by CodePipeline and monitored in CloudWatch.",
    icon: "cloud-arrow-up",
  },
  {
    id: "3",
    slug: "linux-sysadmin-deep-dive",
    title: "Linux SysAdmin Deep Dive",
    subtitle: "From Zero to Production Server",
    lede: "An Ubuntu VM taken from a blank install to a monitored, hardened, Dockerized server, with real scripts and real mistakes along the way.",
    description: "A hands-on Linux system administration project: building real scripts, hardening a server, and automating everything from scratch on an Ubuntu VM.",
    technologies: ["Linux", "Bash", "systemd", "Docker", "ufw", "fail2ban", "cron", "LVM"],
    phaseCount: 7,
    repo: "https://github.com/CharithKapuluru/linux-sysadmin-deep-dive",
    outcome: "A hardened Ubuntu server with ufw, fail2ban, systemd services, cron jobs and LVM storage you can expand live.",
    estimatedTime: "4 to 5 hours",
    whatYouBuild: "Your own Bash tooling, hardened SSH, a firewall, scheduled jobs, flexible storage and a Docker-based monitoring stack.",
    icon: "terminal",
    progressKey: "linux-sysadmin",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectProgressKey(project: Project): string {
  return project.progressKey ?? project.slug;
}

export function getNextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length];
}
```

The DevSecOps `description` is unchanged; the Linux `description` replaces its em-dash with a colon (shell copy).

- [ ] **Step 4: Edit `src/lib/fundamentalsData.ts`**

Remove `gradient` and `icon` from the `FundamentalsTopic` interface and from all ten topic objects. Add `lede: string` to the interface and these ledes (each is the article's former internal intro paragraph with dashes replaced):

| slug | lede |
| --- | --- |
| computing-basics | Virtual machines, operating systems, Linux, servers, kernels, SSH and terminal commands, explained with real-world analogies and zero assumptions. |
| networking-basics | How computers talk to each other: IP addresses, DHCP, NAT, SSH tunnels, SCP file transfers and VM networking. The concepts every engineer needs. |
| linux-filesystem | What Bash actually is, how files and directories work, the Linux filesystem structure, the root user, switching users with su, and the ls command family. |
| file-permissions | chmod demystified: who can read, write and execute files, how permission numbers work, reading ls -l output, SSH key requirements, and SUID, SGID and sticky bits. |
| linux-environment | Ever wonder why typing ls works but your own script doesn't? It all comes down to $PATH, Linux's address book for finding programs. |
| systemd-and-boot | From the moment you press power on to a ready login prompt: what actually happens, step by step, and who is in charge of it all. |
| linux-directories | What's in /bin vs /sbin? What is /etc? What's an inode? And how does Linux expand disk space without shutting down? |
| ports-firewalls-security | How attackers see your server. What ports are. How firewalls work. How to harden SSH. And how DNS turns google.com into an IP address in 20 milliseconds. |
| cron-jobs | How Linux runs backups at 2am without anyone touching a keyboard. The scheduler behind every production server's automation. |
| docker-and-nginx | Why "it works on my machine" killed careers. What containers actually are. And how nginx quietly powers a third of the internet. |

Also replace the em-dashes inside the existing `description` strings with commas or colons (these render in the index cards), and append:

```ts
export function getNextTopic(slug: string): FundamentalsTopic {
  const index = topics.findIndex((t) => t.slug === slug);
  return topics[(index + 1) % topics.length];
}

export function getTopicsByCategory(categoryId: string): FundamentalsTopic[] {
  return topics.filter((t) => t.category === categoryId);
}
```

- [ ] **Step 5: Run the tests, fix the remaining references, build**

```bash
npm test
```

Expected: PASS. Then fix the two places that still read the removed fields: `src/components/home/WorkshopSection.tsx` (uses `p.gradient`? it does not; it uses `phaseCount`), and `src/app/fundamentals/page.tsx` (uses `topic.gradient` and `topic.icon`). Delete the `topic.gradient` class interpolation and the icon switch block there (that page is rewritten in Task 13; for now just remove the two references so the build passes).

```bash
NEXT_TELEMETRY_DISABLED=1 npm run build
git add -A
git commit -m "feat: project and guide data for the new shells, with validation tests"
```

---

### Task 10: Codemod over the 13 content files and the diagram components

**Files:**
- Create: `scripts/lib/codemod-rules.mjs`, `scripts/lib/codemod-rules.test.mjs`, `scripts/codemod-redesign.mjs`
- Modify (by script, then by hand): `src/components/fundamentals/*.tsx` (10), `src/components/projects/*.tsx` (3), `src/components/ui/{AnimatedDiagram,ArchitectureDiagram,LayerDiagram,TrafficFlowAnimation,TerraformResourceTree,ResourceAllocator,CIDRCalculator}.tsx`

**Interfaces:**
- Consumes: `useReadingNav`, `ArticleSection`, `iconFor` (Tasks 3 and 7).
- Produces: content files that render no nav of their own, register their sections with the reading context, use semantic tokens only, carry no emoji, and expose phase wrappers with `id="phase-N"` and `data-phase="N"`.

**Deviation from spec section 8, item 2, justified by inspection:** the 21 `text-orange-300`, 18 `text-green-400`, 5 `text-yellow-300`, 5 `text-red-400`, 4 `text-blue-300` and 3 `text-purple-300` uses all sit on always-dark panels (`bg-gray-900`, `bg-text-charcoal`) inside diagrams and content. Mapping them to theme-dependent tones would make them unreadable in light mode, so text shades 50 to 400 map to the fixed `terminal-*` tokens and gray `bg-*-700+` panels map to `terminal`. Everything else follows the spec table.

- [ ] **Step 1: Write the failing codemod rule tests**

Create `scripts/lib/codemod-rules.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mapAliasClasses, mapAliasVars, paletteReplacement, mapPaletteClasses, stripEmoji,
  transformFontSerif, transformPhaseWrappers, transformSectionTags, transformMisc, transformSource,
} from "./codemod-rules.mjs";

test("alias classes map to semantic tokens and keep variants and opacity", () => {
  assert.equal(
    mapAliasClasses('className="bg-bg-paper text-text-charcoal/80 hover:text-accent-moss border-text-charcoal/10 border-l-accent-sand divide-text-charcoal/5"'),
    'className="bg-surface text-fg/80 hover:text-accent border-fg/10 border-l-accent divide-fg/5"',
  );
});

test("alias css variables map too", () => {
  assert.equal(mapAliasVars("radial-gradient(circle, var(--color-text-charcoal) 1px, transparent 1px)"), "radial-gradient(circle, var(--color-fg) 1px, transparent 1px)");
});

test("palette replacement follows the tone table and the terminal rule", () => {
  assert.equal(paletteReplacement("text", "orange", 300), "terminal-accent");
  assert.equal(paletteReplacement("text", "green", 400), "terminal-ok");
  assert.equal(paletteReplacement("text", "red", 600), "danger");
  assert.equal(paletteReplacement("bg", "amber", 50), "tip-soft");
  assert.equal(paletteReplacement("bg", "blue", 500), "info");
  assert.equal(paletteReplacement("bg", "gray", 900), "terminal");
  assert.equal(paletteReplacement("text", "gray", 400), "terminal-fg/70");
  assert.equal(paletteReplacement("text", "gray", 500), "fg-3");
  assert.equal(paletteReplacement("border", "purple", 300), "accent");
  assert.equal(paletteReplacement("from", "amber", 50), "tip-soft");
  assert.equal(paletteReplacement("border", "lime", 300), null);
});

test("palette classes rewrite in place, dropping a computed opacity when one already exists", () => {
  assert.equal(
    mapPaletteClasses('className="bg-amber-50 text-amber-700 border-amber-200/60 text-gray-400/50 hover:bg-purple-700"'),
    'className="bg-tip-soft text-tip border-tip/60 text-terminal-fg/70 hover:bg-accent"',
  );
});

test("emoji are stripped from text but check marks stay, and icon props map to registry names", () => {
  assert.equal(stripEmoji("<h3>🏠 Home directory</h3>"), "<h3>Home directory</h3>");
  assert.equal(stripEmoji("<span>✓ Tests</span>"), "<span>✓ Tests</span>");
  assert.equal(stripEmoji('{ icon: "🐳", title: "Docker" }'), '{ icon: "package", title: "Docker" }');
  assert.equal(stripEmoji('{ icon: "🪟", title: "Windows" }'), '{ icon: "app-window", title: "Windows" }');
  assert.equal(stripEmoji('{ icon: "🫠", title: "Unknown" }'), '{ icon: "info", title: "Unknown" }');
});

test("font-serif becomes font-display on headings and disappears elsewhere", () => {
  const src = ['<h2 className="text-3xl font-serif text-fg">', '<div className="min-h-screen bg-surface font-serif">', "<motion.h1", '  className="text-5xl font-serif leading-tight"', ">"].join("\n");
  assert.equal(
    transformFontSerif(src),
    ['<h2 className="text-3xl font-display text-fg">', '<div className="min-h-screen bg-surface">', "<motion.h1", '  className="text-5xl font-display leading-tight"', ">"].join("\n"),
  );
});

test("phase wrappers gain an id and the shared section classes", () => {
  const src = '<div\n  ref={(el) => { phaseRefs.current[3] = el; }}\n  data-phase="3"\n  className="mb-16 scroll-mt-32"\n>';
  assert.equal(transformPhaseWrappers(src), '<div\n  ref={(el) => { phaseRefs.current[3] = el; }}\n  data-phase="3" id="phase-3"\n  className="scroll-mt-24 border-t border-border py-12 first:border-t-0 first:pt-0"\n>');
});

test("article Section tags become ArticleSection", () => {
  const src = '<Section id="s0" index={0} sectionRef={el => { sectionRefs.current[0] = el; }}>\n</Section>';
  assert.equal(transformSectionTags(src), '<ArticleSection id="s0" ref={el => { sectionRefs.current[0] = el; }}>\n</ArticleSection>');
});

test("misc rules: scroll margins, ref types, old container", () => {
  assert.equal(transformMisc("scroll-mt-14 scroll-mt-32 useRef<(HTMLDivElement | null)[]>([])"), "scroll-mt-24 scroll-mt-24 useRef<(HTMLElement | null)[]>([])");
  assert.equal(transformMisc('className="container mx-auto px-6 md:px-12 lg:px-16 max-w-6xl py-16 lg:mr-64"'), 'className="min-w-0"');
});

test("transformSource applies everything", () => {
  const out = transformSource('<h2 className="font-serif text-text-charcoal">🔒 Title</h2><div className="bg-amber-50 scroll-mt-14">');
  assert.equal(out, '<h2 className="font-display text-fg">Title</h2><div className="bg-tip-soft scroll-mt-24">');
});
```

- [ ] **Step 2: Run them to verify they fail**

```bash
npm test
```

Expected: FAIL with "Cannot find module './codemod-rules.mjs'".

- [ ] **Step 3: Create `scripts/lib/codemod-rules.mjs`**

```js
// Pure, testable rewrite rules for the redesign codemod. No file IO here.

export const ALIAS_MAP = {
  "bg-paper": "surface",
  "bg-cream": "bg",
  "bg-stone": "surface-2",
  "text-charcoal": "fg",
  "text-taupe": "fg-2",
  "text-olive": "fg-3",
  "accent-moss": "accent",
  "accent-terracotta": "danger",
  "accent-sand": "accent",
  "accent-sage": "success",
};

const VARIANT = "((?:[a-z-]+:)*)";
const UTIL = "(bg|text|border(?:-[xytrbls]|-[se])?|from|via|to|ring|fill|stroke|divide(?:-[xy])?|outline|shadow|placeholder|decoration|accent|caret)";
const ALIAS_TOKENS = Object.keys(ALIAS_MAP).join("|");

export function mapAliasClasses(src) {
  const re = new RegExp(`\\b${VARIANT}${UTIL}-(${ALIAS_TOKENS})(?![\\w-])`, "g");
  return src.replace(re, (_, variant, util, token) => `${variant}${util}-${ALIAS_MAP[token]}`);
}

export function mapAliasVars(src) {
  return src.replace(new RegExp(`--color-(${ALIAS_TOKENS})\\b`, "g"), (_, token) => `--color-${ALIAS_MAP[token]}`);
}

const FAMILY_TONE = {
  amber: "tip", yellow: "tip", orange: "tip",
  blue: "info", sky: "info", indigo: "info",
  purple: "accent", violet: "accent", pink: "accent",
  emerald: "success", green: "success", teal: "success",
  red: "danger", rose: "danger",
};
const GRAYS = new Set(["gray", "slate", "zinc", "neutral", "stone"]);
const TERMINAL = { tip: "terminal-accent", accent: "terminal-accent", info: "terminal-info", success: "terminal-ok", danger: "terminal-danger" };

/** Returns the semantic replacement for `<util>-<family>-<shade>`, or null for unknown families. */
export function paletteReplacement(util, family, shade) {
  const base = util.replace(/^(border|divide)-.*$/, "$1");
  if (GRAYS.has(family)) {
    if (base === "bg") return shade >= 700 ? "terminal" : "surface-2";
    if (base === "text") return shade <= 300 ? "terminal-fg" : shade === 400 ? "terminal-fg/70" : "fg-3";
    return "border";
  }
  const tone = FAMILY_TONE[family];
  if (!tone) return null;
  switch (base) {
    case "bg":
      return shade <= 200 ? `${tone}-soft` : tone;
    case "text":
      return shade <= 400 ? TERMINAL[tone] : tone;
    case "from":
    case "via":
    case "to":
      return shade <= 200 ? `${tone}-soft` : tone;
    default:
      return tone;
  }
}

const FAMILIES = [...Object.keys(FAMILY_TONE), ...GRAYS].join("|");

export function mapPaletteClasses(src) {
  const re = new RegExp(`\\b${VARIANT}${UTIL}-(${FAMILIES})-(\\d{2,3})(/\\d+)?(?![\\w-])`, "g");
  return src.replace(re, (whole, variant, util, family, shade, opacity) => {
    const replacement = paletteReplacement(util, family, Number(shade));
    if (!replacement) return whole;
    const hasOwnOpacity = replacement.includes("/");
    return `${variant}${util}-${replacement}${hasOwnOpacity ? "" : opacity ?? ""}`;
  });
}

export const EMOJI_ICON = {
  "🏢": "buildings", "🏠": "house", "📋": "clipboard-text", "📦": "package", "💾": "floppy-disk", "🎉": "confetti",
  "⚡": "lightning", "🚗": "car", "🔧": "wrench", "🔒": "lock", "🔑": "key", "📄": "file-text", "💡": "lightbulb",
  "🐳": "package", "🏨": "buildings", "🌍": "globe", "🧹": "broom", "🧪": "flask", "🛡️": "shield-check", "🛡": "shield-check",
  "🚀": "rocket-launch", "😱": "warning", "🔥": "flame", "🔌": "plugs", "📜": "scroll", "📚": "books", "📖": "book-open",
  "📊": "chart-bar", "📁": "folder", "💻": "laptop", "💥": "lightning", "👥": "users", "👤": "user", "🏷️": "tag",
  "🏙️": "buildings", "🎯": "target", "🌙": "moon", "🌐": "globe", "✨": "sparkle", "🪟": "app-window", "🤯": "sparkle",
  "🤝": "handshake", "🤔": "question", "🛒": "shopping-cart", "🚛": "truck", "🗣️": "chat-circle", "🗑️": "trash",
  "🖥️": "desktop", "🔨": "hammer", "🔐": "lock", "🔀": "shuffle", "📺": "television", "📱": "device-mobile",
  "📤": "export", "📡": "broadcast", "📝": "file-text", "📌": "pin", "📈": "trend-up", "💽": "hard-drives",
  "💯": "check-circle", "💭": "chat-circle", "💬": "chat-circle", "💪": "lightning", "👨": "user", "👔": "user",
  "👏": "check-circle", "👍": "check-circle", "👁️": "eye", "🐧": "linux", "🐍": "code", "🏰": "castle",
  "🏪": "storefront", "🏘️": "house-line", "🏗️": "buildings", "🎫": "ticket", "🍽️": "fork-knife", "🍳": "cooking-pot",
  "🍎": "apple-logo", "🌳": "tree", "✏️": "pencil", "✉️": "envelope", "⚠️": "warning", "⚖️": "scales", "☀️": "sun",
  "⚙️": "gear", "✅": "check-circle", "❌": "x-circle",
};

// Pictographs and symbols, with optional variation selector / ZWJ sequences. U+2713 and U+2717 (check and ballot marks) are kept.
const EMOJI_SEQ = "(?:[\\u{1F300}-\\u{1FAFF}]|[\\u{2600}-\\u{27BF}](?<![\\u2713\\u2717]))(?:\\uFE0F|\\u200D[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}])*";

export function stripEmoji(src) {
  const iconProp = new RegExp(`icon:\\s*"(${EMOJI_SEQ})"`, "gu");
  const withIcons = src.replace(iconProp, (_, emoji) => `icon: "${EMOJI_ICON[emoji] ?? EMOJI_ICON[emoji.replace(/️/g, "")] ?? "info"}"`);
  return withIcons.replace(new RegExp(`\\s?${EMOJI_SEQ}\\s?`, "gu"), (m) => (m.startsWith(" ") && m.endsWith(" ") ? " " : ""));
}

export function transformFontSerif(src) {
  const lines = src.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].includes("font-serif")) continue;
    let tag = null;
    for (let j = i; j >= Math.max(0, i - 8); j--) {
      const m = lines[j].match(/<(motion\.)?([a-zA-Z][\w.]*)\b/);
      if (m) {
        tag = m[2];
        break;
      }
    }
    const heading = tag !== null && /^h[1-4]$/.test(tag);
    lines[i] = heading ? lines[i].replace(/\bfont-serif\b/g, "font-display") : lines[i].replace(/ ?\bfont-serif\b/g, "").replace(/className=" /g, 'className="');
  }
  return lines.join("\n");
}

export function transformPhaseWrappers(src) {
  return src.replace(/data-phase="(\d+)"(\s*)className="mb-16 scroll-mt-32"/g, 'data-phase="$1" id="phase-$1"$2className="scroll-mt-24 border-t border-border py-12 first:border-t-0 first:pt-0"');
}

export function transformSectionTags(src) {
  return src.replace(/<Section id="([^"]+)" index=\{\d+\} sectionRef=/g, '<ArticleSection id="$1" ref=').replace(/<\/Section>/g, "</ArticleSection>");
}

export function transformMisc(src) {
  return src
    .replace(/scroll-mt-(?:14|32)/g, "scroll-mt-24")
    .replace(/useRef<\(HTMLDivElement \| null\)\[\]>/g, "useRef<(HTMLElement | null)[]>")
    .replace(/className="container mx-auto px-6 md:px-12 lg:px-16 max-w-6xl py-16 lg:mr-64"/g, 'className="min-w-0"');
}

export function transformSource(src) {
  return [mapAliasClasses, mapAliasVars, mapPaletteClasses, stripEmoji, transformFontSerif, transformPhaseWrappers, transformSectionTags, transformMisc].reduce((acc, fn) => fn(acc), src);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
npm test
```

Expected: PASS. If the `stripEmoji` lookbehind assertion fails on this Node version, replace `EMOJI_SEQ` with the two-range alternative `(?:[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{2712}\u{2714}-\u{2716}\u{2718}-\u{27BF}])` and re-run.

- [ ] **Step 5: Create `scripts/codemod-redesign.mjs`**

```js
#!/usr/bin/env node
// Applies the redesign rewrite rules to the given files or directories, in place.
// Usage: node scripts/codemod-redesign.mjs src/components/fundamentals src/components/projects src/components/ui/ArchitectureDiagram.tsx
import { readFileSync, writeFileSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { transformSource } from "./lib/codemod-rules.mjs";

function collect(target) {
  const st = statSync(target);
  if (st.isFile()) return target.endsWith(".tsx") ? [target] : [];
  return readdirSync(target).flatMap((name) => collect(join(target, name)));
}

const files = process.argv.slice(2).flatMap(collect);
if (files.length === 0) {
  console.error("No .tsx files given");
  process.exit(1);
}

let changed = 0;
for (const file of files) {
  const before = readFileSync(file, "utf8");
  const after = transformSource(before);
  if (after !== before) {
    writeFileSync(file, after);
    changed += 1;
    console.log(`rewrote ${file}`);
  }
}
console.log(`${changed} of ${files.length} files changed`);
```

- [ ] **Step 6: Run the codemod over the diagram components and build**

```bash
node scripts/codemod-redesign.mjs src/components/ui/AnimatedDiagram.tsx src/components/ui/ArchitectureDiagram.tsx src/components/ui/LayerDiagram.tsx src/components/ui/TrafficFlowAnimation.tsx src/components/ui/TerraformResourceTree.tsx src/components/ui/ResourceAllocator.tsx src/components/ui/CIDRCalculator.tsx
git diff --stat
grep -nE "(bg|text|border|from|via|to)-(amber|blue|emerald|green|red|orange|purple|violet|pink|sky|indigo|yellow|teal|gray)-[0-9]" src/components/ui/*.tsx; echo "exit=$?"
NEXT_TELEMETRY_DISABLED=1 npm run build
```

Expected: the grep prints nothing (`exit=1`), the build passes. Open the DevSecOps project page and the Terraform page in the dev server and eyeball the architecture diagram, the traffic flow animation and the resource tree in both themes: dark panels keep light text, light panels keep dark text. Commit:

```bash
git add -A
git commit -m "refactor: re-theme diagram components with the codemod"
```

- [ ] **Step 7: Run the codemod over the 13 content files**

```bash
node scripts/codemod-redesign.mjs src/components/fundamentals src/components/projects
git diff --stat
```

Expected: 13 files rewritten. Do not build yet; the manual edits below are needed first (the files still import deleted-in-spirit components, but those files exist so the build would pass; the edits are about behaviour).

- [ ] **Step 8: Manual edits in each of the 10 article files**

Apply to `ComputingBasics`, `NetworkingBasics`, `LinuxFilesystem`, `FilePermissions`, `LinuxEnvironment`, `SystemdAndBoot`, `LinuxDirectories`, `PortsFirewallsSecurity`, `CronJobs`, `DockerAndNginx`:

1. Imports: delete `import ArticleNav from "@/components/ui/ArticleNav";`, `import DropCap from "@/components/ui/DropCap";`, `import OrganicDivider from "@/components/ui/OrganicDivider";` (where present) and `import { useActivePhase } from "@/hooks/useActivePhase";`. Add `import { useReadingNav } from "@/hooks/useReadingNav";` and `import ArticleSection from "@/components/reading/ArticleSection";`. If `useScroll` from framer-motion is only used for the deleted progress bar, remove it from the import.
2. Delete the local `const sectionStyles = [...]` array and the local `const Section = (...) => (...)` component (the codemod already renamed its usages to `ArticleSection`). Delete `accentLineColors` and `accentColors` if nothing else uses them; where `SectionTitle` uses `accentLineColors[accent]`, replace that expression with the string `"bg-accent"` and drop the `accent` prop from `SectionTitle` and its call sites.
3. Delete the scroll-progress bar: the `<motion.div className="fixed top-0 left-0 right-0 h-0.5 ... origin-left" style={{ scaleX: scrollYProgress }} />` element (or the `<div className="fixed top-0 left-0 right-0 z-[60] h-0.5">...</div>` block) and the `const { scrollYProgress } = useScroll();` line.
4. Delete the `<ArticleNav ... />` element.
5. Delete the internal hero: from the `{/* Hero */}` (or `{/* ═══ HERO` ) comment through the closing `</section>` or `</header>` immediately before the first `<ArticleSection`. Its intro paragraph already lives in `fundamentalsData.lede` (Task 9).
6. Replace `useActivePhase(sectionRefs, setCurrentSection);` with `useReadingNav(navSections, sectionRefs, setCurrentSection);`. In `ComputingBasics`, `NetworkingBasics`, `LinuxFilesystem` and `FilePermissions` the `navSections` constant is module-level already; confirm it is in the other six (it is, as `const navSections = sectionNames.map(...)`).
7. Delete the now-unused `scrollToSection` function.
8. Replace the root wrapper `<div className="min-h-screen bg-surface">` or `<div className="bg-surface">` returned by the component with `<article>` and its closing `</div>` with `</article>`.
9. Replace each `<DropCap accentColor="...">TEXT</DropCap>` with `<p className="mb-6 text-lede leading-relaxed text-fg-2">TEXT</p>`.
10. Delete each `<OrganicDivider variant="..." />`.
11. Where a data array passes `icon: "..."` registry names (the codemod converted emoji there) and the render site prints `{item.icon}` as text, change the render site to `{iconFor(item.icon, { size: 22 })}` and add `import { iconFor } from "@/components/ui/icons";`. Find them with `grep -n '{[a-z]*\.icon}' <file>`.
12. Search the file for any remaining `<h1` and remove it (there should be none after step 5).

- [ ] **Step 9: Manual edits in the 3 project files**

`DevSecOpsProject.tsx`, `TerraformECSProject.tsx`, `LinuxSysAdminProject.tsx`:

1. Imports: delete `PhaseTimeline`, `ProgressSidebar`, `SearchBar`, `ReadingPositionTracker`, `AllNotesViewer as NotesViewer` (or `NotesViewer`), `DropCap`, `OrganicDivider`, `useActivePhase`. Add `import { useReadingNav } from "@/hooks/useReadingNav";`. Keep `BookmarkButton`, `ShareButtons`, `PersonalNotes`, `Confetti`, `CelebrationMessage`.
2. Delete the JSX for `<SearchBar />`, `<NotesViewer />`, `<ReadingPositionTracker ... />`, `<PhaseTimeline ... />`, `<ProgressSidebar ... />`.
3. In `DevSecOpsProject.tsx` add after `phaseNames`: `const phases = ["Setup", "API", "Tests", "Lint", "Docker", "CI/CD", "SAST", "Trivy"].map((label, id) => ({ id, label }));` (these are the labels the old PhaseTimeline defaulted to). `TerraformECSProject.tsx` and `LinuxSysAdminProject.tsx` already have a module-level `phases`.
4. Replace `useActivePhase(phaseRefs, setCurrentPhase);` with `useReadingNav(phases, phaseRefs, setCurrentPhase);`.
5. Delete the body title block: in `DevSecOpsProject.tsx` the `<h1 className="text-4xl ...">FastAPI DevSecOps Demo: ...</h1>`; in `TerraformECSProject.tsx` the eyebrow `<span className="text-sm uppercase ...">CI/CD Pipeline and CloudWatch Monitoring</span>` and the `<h1>`; in `LinuxSysAdminProject.tsx` the `<h1>` and the italic `<p className="text-xl ... italic">` subtitle directly under it (both now live in `projectsData`). Keep everything else in those hero blocks.
6. Delete `scrollToPhase` if nothing else calls it (`ConceptCards onCardClick={scrollToPhase}` in DevSecOps still uses it; keep it there).
7. `TerraformECSProject.tsx`: delete `handleClearProgress` and its `useAuth`, `doc`, `deleteDoc`, `db`, `useCallback` imports if now unused (the resume notice owns that behaviour); replace the `<DropCap accentColor="moss">` in the introduction with `<p className="mb-6 text-lede leading-relaxed text-fg-2">`; delete the five `<OrganicDivider ... />` elements.
8. Replace the root wrapper `<div className="bg-surface">` with `<article>` and its closing tag.
9. Phase wrappers already carry `id="phase-N"` from the codemod; verify with `grep -c 'id="phase-' <file>` equals the phase count (8, 10, 7).

- [ ] **Step 10: Build gate, checks and commit**

```bash
grep -rn "ArticleNav\|PhaseTimeline\|ProgressSidebar\|ReadingPositionTracker\|useActivePhase\|DropCap\|OrganicDivider\|<h1" src/components/fundamentals src/components/projects; echo "exit=$?"
grep -rnP "[\x{1F300}-\x{1FAFF}]" src/components/fundamentals src/components/projects | head; echo "emoji-exit=$?"
NEXT_TELEMETRY_DISABLED=1 npm run build
```

Expected: the first grep finds nothing (`exit=1`), the emoji grep finds nothing, the build passes. Open `/fundamentals/cron-jobs/` and `/projects/terraform-ecs-deployment/` in the dev server: content renders without its own nav or hero, sections are separated by hairlines, the old world header still sits above (replaced in Tasks 12 and 13).

```bash
git add -A
git commit -m "refactor: codemod content files onto the reading system and semantic tokens"
```

---

### Task 11: Home page

**Files:**
- Create: `src/components/home/Hero.tsx`, `src/components/home/ProofStrip.tsx`, `src/components/home/ProjectRows.tsx`, `src/components/home/FundamentalsIndex.tsx`, `src/components/home/ContactBand.tsx`, `src/components/home/CopyEmailButton.tsx`, `src/components/home/PersonJsonLd.tsx`
- Rewrite: `src/components/home/AboutSection.tsx`, `src/app/page.tsx`

**Interfaces:**
- Consumes: `SiteNav`, `Footer`, `Button`, `Tag`, `Avatar`, `iconFor`, `projects`, `categories`, `getTopicsByCategory`.
- Produces: `ProjectRows({ detailed?, className? })` reused by the projects index in Task 12. The home projects section carries `id="projects"` plus a hidden `id="workshop"` anchor so old deep links still land (Review Focus 1).

- [ ] **Step 1: Create `src/components/home/Hero.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";
import Avatar from "@/components/brand/Avatar";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Hero() {
  const reduce = useReducedMotion();
  const enter = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.32, delay: i * 0.06, ease },
  });

  return (
    <section className="mx-auto grid min-h-[min(calc(100dvh_-_4rem),820px)] max-w-6xl items-center gap-10 px-4 pb-16 pt-16 sm:px-6 md:grid-cols-12 md:pb-24 md:pt-24">
      <div className="order-2 md:order-1 md:col-span-7">
        <motion.h1 {...enter(0)} className="text-display-xl text-fg">
          I build cloud infrastructure and explain how it works.
        </motion.h1>
        <motion.p {...enter(1)} className="mt-5 max-w-[36ch] text-lede text-fg-2">
          Cloud and DevOps engineer. Three years shipping microservices on AWS, now finishing an MS in Computer Science at UNT.
        </motion.p>
        <motion.div {...enter(2)} className="mt-8 flex flex-wrap gap-3">
          <Button href="/projects" size="lg">
            View projects
          </Button>
          <Button href="/fundamentals" variant="secondary" size="lg">
            Read the guides
          </Button>
        </motion.div>
      </div>
      <motion.div {...enter(1)} className="order-1 md:order-2 md:col-span-5">
        <div className="relative mx-auto flex w-full max-w-[420px] items-end justify-center overflow-hidden rounded-lg bg-surface-2 px-6 pt-6" style={{ aspectRatio: "5 / 6" }}>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_30%,var(--accent-soft),transparent_70%)] opacity-70" />
          <Avatar pose="laptop" width={380} priority className="relative" />
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Create `ProofStrip.tsx`, `ProjectRows.tsx`, `FundamentalsIndex.tsx`**

```tsx
// src/components/home/ProofStrip.tsx
const FIGURES = [
  { value: "3", label: "client migrations led from on-prem monoliths to AWS microservices, cutting hosting costs 35%" },
  { value: "~70%", label: "lower compute cost on ECS with Fargate Spot and autoscaling" },
  { value: "30%", label: "faster API responses after query and data-layer optimisation" },
  { value: "1st", label: "place, UNT Cybersecurity Hackathon 2024" },
];

export default function ProofStrip() {
  return (
    <section aria-label="Highlights" className="border-y border-border bg-surface">
      <dl className="mx-auto grid max-w-6xl divide-y divide-border px-4 sm:px-6 md:grid-cols-4 md:divide-x md:divide-y-0">
        {FIGURES.map((f) => (
          <div key={f.value} className="py-6 md:px-6 md:first:pl-0 md:last:pr-0">
            <dt className="font-display text-figure tabular text-fg">{f.value}</dt>
            <dd className="mt-2 max-w-[28ch] text-small text-fg-2">{f.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

```tsx
// src/components/home/ProjectRows.tsx
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { projects } from "@/lib/projectsData";
import { iconFor } from "@/components/ui/icons";
import Tag from "@/components/ui/Tag";
import { cn } from "@/lib/utils";

export default function ProjectRows({ detailed = false, className }: { detailed?: boolean; className?: string }) {
  return (
    <ol className={cn("divide-y divide-border border-y border-border", className)}>
      {projects.map((p) => (
        <li key={p.slug}>
          <Link href={`/projects/${p.slug}`} className="group grid gap-4 py-6 transition-colors duration-150 hover:bg-surface md:grid-cols-12 md:gap-8 md:py-8">
            <div className="flex items-center gap-3 text-fg-3 md:col-span-3 md:flex-col md:items-start md:gap-2">
              <span className="text-fg-2">{iconFor(p.icon, { size: 24 })}</span>
              <span className="text-caption tabular">{p.phaseCount} phases</span>
              {detailed && <span className="text-caption">{p.estimatedTime}</span>}
            </div>
            <div className="md:col-span-9">
              <h3 className="font-display text-h3 text-fg group-hover:text-accent">{p.title}</h3>
              <p className="mt-2 max-w-[60ch] text-body text-fg-2">{detailed ? p.lede : p.outcome}</p>
              {detailed && (
                <p className="mt-2 max-w-[60ch] text-small text-fg-3">
                  <span className="font-medium text-fg-2">What you will build: </span>
                  {p.whatYouBuild}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.technologies.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-small font-medium text-fg-2 group-hover:text-fg">
                {detailed ? "Open the walkthrough" : "Read the walkthrough"}
                <ArrowRight size={16} aria-hidden className="transition-transform duration-150 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
```

```tsx
// src/components/home/FundamentalsIndex.tsx
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { categories, getTopicsByCategory } from "@/lib/fundamentalsData";

export default function FundamentalsIndex() {
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <h2 className="text-h2 text-fg">Fundamentals</h2>
        <p className="mt-3 max-w-[60ch] text-lede text-fg-2">Ten plain-language guides to how servers, Linux and networks actually work.</p>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-x-16">
          {categories.map((c) => {
            const items = getTopicsByCategory(c.id);
            if (items.length === 0) return null;
            return (
              <div key={c.id}>
                <h3 className="text-small font-medium text-fg-3">{c.label}</h3>
                <ul className="mt-3 divide-y divide-border border-t border-border">
                  {items.map((t) => (
                    <li key={t.slug}>
                      <Link href={`/fundamentals/${t.slug}`} className="flex items-baseline justify-between gap-4 py-3 text-body text-fg-2 hover:text-fg">
                        <span>{t.title}</span>
                        <span className="shrink-0 text-caption text-fg-3 tabular">{t.readingTime}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <Link href="/fundamentals" className="mt-8 inline-flex items-center gap-1.5 text-small font-medium text-fg-2 hover:text-fg">
          All 10 guides
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Rewrite `AboutSection.tsx`, create `ContactBand.tsx`, `CopyEmailButton.tsx`, `PersonJsonLd.tsx`**

```tsx
// src/components/home/AboutSection.tsx
import Avatar from "@/components/brand/Avatar";
import Tag from "@/components/ui/Tag";

const TIMELINE = [
  { when: "2024 to 2026", what: "MS Computer Science, University of North Texas" },
  { when: "2022 to 2024", what: "Software Engineer, KANsolv Technologies, Hyderabad" },
  { when: "2021 to 2022", what: "Software Engineering Intern, KANsolv Technologies" },
];

const AWARDS = "Star Performer (Q2 2023) and Code Quality Champion (Q4 2023) at KANsolv. First place, UNT Cybersecurity Hackathon 2024.";

const STACK = [
  { group: "Cloud", items: ["AWS ECS", "ECR", "Lambda", "ALB", "VPC", "S3", "CloudWatch", "IAM"] },
  { group: "IaC and CI/CD", items: ["Terraform", "CloudFormation", "GitHub Actions", "CodePipeline", "Jenkins"] },
  { group: "Containers", items: ["Docker", "Kubernetes"] },
  { group: "Observability", items: ["Splunk", "Datadog", "Dynatrace", "Grafana", "PagerDuty"] },
  { group: "Languages", items: ["Python", "Java", "TypeScript", "Bash", "HCL", "SQL"] },
];

export default function AboutSection() {
  return (
    <section id="about" className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-12 md:py-28">
      <div className="md:col-span-5">
        <div className="relative mx-auto max-w-[360px]">
          <img src="/world/charith-photo.webp" alt="Charith Kapuluru" width={800} height={1000} loading="lazy" decoding="async" className="aspect-[4/5] w-full rounded-xl object-cover" />
          <div className="absolute -right-4 -top-10 hidden sm:block" aria-hidden>
            <Avatar pose="peek" width={150} pokeable={false} />
          </div>
        </div>
      </div>
      <div className="md:col-span-7">
        <h2 className="text-h2 text-fg">About</h2>
        <div className="mt-5 space-y-4 text-body-read text-fg-2">
          <p>
            I&apos;m a software engineer finishing my Master&apos;s in Computer Science at the University of North Texas. Before UNT I spent three years at KANsolv
            Technologies in Hyderabad, breaking monoliths into containerized microservices on AWS and building the CI/CD, auth and observability around them.
          </p>
          <p>I care about infrastructure that stays boring in production, and about explaining it clearly. The guides on this site started as the notes I wished I had when I began.</p>
        </div>
        <ol className="mt-8 divide-y divide-border border-y border-border">
          {TIMELINE.map((t) => (
            <li key={t.when} className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
              <span className="text-caption text-fg-3 tabular">{t.when}</span>
              <span className="text-small text-fg">{t.what}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-small text-fg-2">{AWARDS}</p>
        <div className="mt-8 space-y-4">
          {STACK.map((s) => (
            <div key={s.group}>
              <p className="text-caption font-medium text-fg-3">{s.group}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {s.items.map((i) => (
                  <Tag key={i}>{i}</Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 flex gap-5 text-small font-medium">
          <a href="https://github.com/CharithKapuluru" target="_blank" rel="noopener noreferrer" className="text-fg-2 hover:text-fg">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/charith-kapuluru-159456329/" target="_blank" rel="noopener noreferrer" className="text-fg-2 hover:text-fg">
            LinkedIn
          </a>
        </p>
      </div>
    </section>
  );
}
```

```tsx
// src/components/home/CopyEmailButton.tsx
"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react/dist/ssr";
import Button from "@/components/ui/Button";

export default function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <Button variant="secondary" size="lg" onClick={copy} aria-live="polite">
      {copied ? <Check size={18} aria-hidden /> : <Copy size={18} aria-hidden />}
      {copied ? "Copied" : email}
    </Button>
  );
}
```

```tsx
// src/components/home/ContactBand.tsx
import Button from "@/components/ui/Button";
import CopyEmailButton from "./CopyEmailButton";

export default function ContactBand() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-28">
      <div className="rounded-lg border border-border bg-surface px-6 py-12 text-center md:py-16">
        <h2 className="text-h2 text-fg">Open to Cloud and DevOps roles.</h2>
        <p className="mx-auto mt-3 max-w-[50ch] text-lede text-fg-2">Based in Denton, Texas. Happy to talk about infrastructure, pipelines or the guides.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <CopyEmailButton email="kapulurucharith@gmail.com" />
          <Button href="/contact" size="lg">
            Contact
          </Button>
        </div>
      </div>
    </section>
  );
}
```

```tsx
// src/components/home/PersonJsonLd.tsx
export default function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Charith Kapuluru",
    url: "https://charithkapuluru.com",
    jobTitle: "Cloud and DevOps Engineer",
    email: "mailto:kapulurucharith@gmail.com",
    sameAs: ["https://github.com/CharithKapuluru", "https://www.linkedin.com/in/charith-kapuluru-159456329/"],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```

- [ ] **Step 4: Rewrite `src/app/page.tsx`**

```tsx
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import SiteNav from "@/components/layout/SiteNav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ProofStrip from "@/components/home/ProofStrip";
import ProjectRows from "@/components/home/ProjectRows";
import FundamentalsIndex from "@/components/home/FundamentalsIndex";
import AboutSection from "@/components/home/AboutSection";
import ContactBand from "@/components/home/ContactBand";
import PersonJsonLd from "@/components/home/PersonJsonLd";

export default function Home() {
  return (
    <>
      <SiteNav active="home" />
      <main id="main">
        <Hero />
        <ProofStrip />
        <section id="projects" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <span id="workshop" className="sr-only" aria-hidden />
          <h2 className="text-h2 text-fg">Selected projects</h2>
          <p className="mt-3 max-w-[60ch] text-lede text-fg-2">Three production-style walkthroughs, built and documented end to end.</p>
          <ProjectRows className="mt-10" />
          <Link href="/projects" className="mt-6 inline-flex items-center gap-1.5 text-small font-medium text-fg-2 hover:text-fg">
            All projects
            <ArrowRight size={16} aria-hidden />
          </Link>
        </section>
        <FundamentalsIndex />
        <AboutSection />
        <ContactBand />
      </main>
      <Footer />
      <PersonJsonLd />
    </>
  );
}
```

- [ ] **Step 5: Build gate, visual check, commit**

```bash
NEXT_TELEMETRY_DISABLED=1 npm run build
grep -c 'id="projects"' out/index.html; grep -c 'id="workshop"' out/index.html; grep -c "<h1" out/index.html
```

Expected: build passes; the three greps print `1`, `1`, `1`. In the dev server, check the home page at 390 and 1440 px in both themes: hero fits the viewport with the CTA visible, the proof strip reads as four figures, project rows and the grouped guide index render, the avatar peeks over the photo, the contact band copies the email.

```bash
git add -A
git commit -m "feat: editorial home page"
```

---

### Task 12: Projects index and walkthrough shells

**Files:**
- Create: `src/app/projects/page.tsx`
- Rewrite: `src/app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `ProjectRows`, `ReadingLayout`, `ReadingHeader`, `FactsPanel`, `ResumeNotice`, `PhaseRail`, `ProjectTools`, `NextUp`, project data helpers.

- [ ] **Step 1: Create `src/app/projects/page.tsx`**

```tsx
import type { Metadata } from "next";
import SiteNav from "@/components/layout/SiteNav";
import Footer from "@/components/layout/Footer";
import ProjectRows from "@/components/home/ProjectRows";

export const metadata: Metadata = {
  title: "Projects",
  description: "Three production-style walkthroughs: a DevSecOps pipeline, AWS ECS Fargate with Terraform, and a Linux server built from scratch.",
};

export default function ProjectsPage() {
  return (
    <>
      <SiteNav active="projects" />
      <main id="main" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <h1 className="text-display-lg text-fg">Projects</h1>
        <p className="mt-4 max-w-[60ch] text-lede text-fg-2">Three production-style walkthroughs. Each one is a real repository, documented phase by phase.</p>
        <ProjectRows detailed className="mt-12" />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Rewrite `src/app/projects/[slug]/page.tsx`**

```tsx
import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug, getProjectProgressKey, getNextProject } from "@/lib/projectsData";
import DevSecOpsProject from "@/components/projects/DevSecOpsProject";
import TerraformECSProject from "@/components/projects/TerraformECSProject";
import LinuxSysAdminProject from "@/components/projects/LinuxSysAdminProject";
import ReadingLayout from "@/components/reading/ReadingLayout";
import ReadingHeader from "@/components/reading/ReadingHeader";
import FactsPanel from "@/components/reading/FactsPanel";
import ResumeNotice from "@/components/reading/ResumeNotice";
import PhaseRail from "@/components/reading/PhaseRail";
import ProjectTools from "@/components/reading/ProjectTools";
import NextUp from "@/components/reading/NextUp";
import Footer from "@/components/layout/Footer";

const CONTENT: Record<string, ComponentType> = {
  "devsecops-pipeline": DevSecOpsProject,
  "terraform-ecs-deployment": TerraformECSProject,
  "linux-sysadmin-deep-dive": LinuxSysAdminProject,
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.description };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const Content = CONTENT[slug];
  const progressKey = getProjectProgressKey(project);
  const next = getNextProject(slug);

  return (
    <>
      <ReadingLayout
        crumbs={[{ label: "Projects", href: "/projects" }, { label: project.title }]}
        sheetLabel="Phases"
        header={
          <>
            <ReadingHeader
              eyebrow="Project walkthrough"
              title={project.title}
              lede={project.lede}
              meta={[
                { label: "Phases", value: String(project.phaseCount) },
                { label: "Time", value: project.estimatedTime },
              ]}
            />
            <FactsPanel repo={project.repo} stack={project.technologies} phaseCount={project.phaseCount} estimatedTime={project.estimatedTime} outcome={project.outcome} />
            <ResumeNotice slug={project.slug} progressKey={progressKey} />
          </>
        }
        rail={<PhaseRail progressKey={progressKey} actions={<ProjectTools />} />}
        after={<NextUp label="Next project" title={next.title} href={`/projects/${next.slug}`} meta={`${next.phaseCount} phases`} backHref="/projects" backLabel="All projects" />}
      >
        {Content ? <Content /> : <p className="text-fg-2">Content coming soon.</p>}
      </ReadingLayout>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Build gate, checks, commit**

```bash
NEXT_TELEMETRY_DISABLED=1 npm run build
for s in devsecops-pipeline terraform-ecs-deployment linux-sysadmin-deep-dive; do echo "$s h1=$(grep -c '<h1' out/projects/$s/index.html) phases=$(grep -o 'id="phase-' out/projects/$s/index.html | wc -l | tr -d ' ')"; done
```

Expected: build passes; each page has exactly one `<h1` and the phase counts print 8, 10 and 7. In the dev server at 1440 px: one bar at the top with the breadcrumb and progress line, the facts panel with the repository link, the rail with checkboxes (disabled until signed in), search and all-notes buttons in the rail. At 390 px: the Phases button opens the sheet. Sign in, scroll, and confirm a checkbox ticks and the Firestore document updates (same document shape as before).

```bash
git add -A
git commit -m "feat: projects index and walkthrough shells on the reading layout"
```

---

### Task 13: Fundamentals index and guide shells

**Files:**
- Create: `src/components/fundamentals/GuidesGrid.tsx`
- Rewrite: `src/app/fundamentals/page.tsx`, `src/app/fundamentals/[slug]/page.tsx`
- Modify: `src/app/fundamentals/layout.tsx` (description without the em-dash)

- [ ] **Step 1: Create `src/components/fundamentals/GuidesGrid.tsx`**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import type { FundamentalsCategory, FundamentalsTopic } from "@/lib/fundamentalsData";
import { cn } from "@/lib/utils";

export default function GuidesGrid({ topics, categories }: { topics: FundamentalsTopic[]; categories: FundamentalsCategory[] }) {
  const [active, setActive] = useState("all");
  const visible = active === "all" ? topics : topics.filter((t) => t.category === active);
  const labelById = Object.fromEntries(categories.map((c) => [c.id, c.label]));

  return (
    <div>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {[{ id: "all", label: "All" }, ...categories].map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={active === c.id}
            onClick={() => setActive(c.id)}
            className={cn(
              "h-9 rounded-md border px-3 text-small font-medium transition-colors duration-150",
              active === c.id ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface text-fg-2 hover:border-fg-3 hover:text-fg",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      <ul className="mt-8 grid gap-4 md:grid-cols-2" aria-live="polite">
        {visible.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/fundamentals/${t.slug}`}
              className="group flex h-full flex-col rounded-lg border border-border bg-surface p-6 transition-[border-color,transform] duration-150 hover:-translate-y-px hover:border-accent/50"
            >
              <span className="text-caption text-fg-3">{labelById[t.category]}</span>
              <h2 className="mt-2 font-display text-h3 text-fg group-hover:text-accent">{t.title}</h2>
              <p className="mt-2 line-clamp-2 text-small text-fg-2">{t.description}</p>
              <p className="mt-auto pt-5 text-caption text-fg-3 tabular">
                {t.readingTime} · {t.sectionCount} sections
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `src/app/fundamentals/page.tsx` and fix the layout description**

```tsx
import Link from "next/link";
import SiteNav from "@/components/layout/SiteNav";
import Footer from "@/components/layout/Footer";
import GuidesGrid from "@/components/fundamentals/GuidesGrid";
import { categories, topics } from "@/lib/fundamentalsData";

export default function FundamentalsPage() {
  return (
    <>
      <SiteNav active="fundamentals" />
      <main id="main" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <h1 className="text-display-lg text-fg">Fundamentals</h1>
        <p className="mt-4 max-w-[60ch] text-lede text-fg-2">Plain-language guides to how servers, Linux and networks actually work. Zero assumptions, real analogies.</p>
        <div className="mt-10">
          <GuidesGrid topics={topics} categories={categories} />
        </div>
        <p className="mt-12 text-small text-fg-2">
          Not sure where to start?{" "}
          <Link href="/fundamentals/computing-basics" className="font-medium text-accent hover:text-accent-strong">
            Begin with Computing Basics
          </Link>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
```

In `src/app/fundamentals/layout.tsx` set the description to: `"Plain-language guides to computing fundamentals: virtual machines, Linux, operating systems, servers, SSH and more. Built for beginners and for professionals refreshing the basics."`

- [ ] **Step 3: Rewrite `src/app/fundamentals/[slug]/page.tsx`**

```tsx
import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { topics, categories, getTopicBySlug, getNextTopic } from "@/lib/fundamentalsData";
import { avatarLines } from "@/lib/avatarLines";
import ComputingBasics from "@/components/fundamentals/ComputingBasics";
import NetworkingBasics from "@/components/fundamentals/NetworkingBasics";
import LinuxFilesystem from "@/components/fundamentals/LinuxFilesystem";
import FilePermissions from "@/components/fundamentals/FilePermissions";
import LinuxEnvironment from "@/components/fundamentals/LinuxEnvironment";
import SystemdAndBoot from "@/components/fundamentals/SystemdAndBoot";
import LinuxDirectories from "@/components/fundamentals/LinuxDirectories";
import PortsFirewallsSecurity from "@/components/fundamentals/PortsFirewallsSecurity";
import CronJobs from "@/components/fundamentals/CronJobs";
import DockerAndNginx from "@/components/fundamentals/DockerAndNginx";
import ReadingLayout from "@/components/reading/ReadingLayout";
import ReadingHeader from "@/components/reading/ReadingHeader";
import OnThisPage from "@/components/reading/OnThisPage";
import SignInControl from "@/components/reading/SignInControl";
import AvatarNote from "@/components/reading/AvatarNote";
import NextUp from "@/components/reading/NextUp";
import Footer from "@/components/layout/Footer";

const CONTENT: Record<string, ComponentType> = {
  "computing-basics": ComputingBasics,
  "networking-basics": NetworkingBasics,
  "linux-filesystem": LinuxFilesystem,
  "file-permissions": FilePermissions,
  "linux-environment": LinuxEnvironment,
  "systemd-and-boot": SystemdAndBoot,
  "linux-directories": LinuxDirectories,
  "ports-firewalls-security": PortsFirewallsSecurity,
  "cron-jobs": CronJobs,
  "docker-and-nginx": DockerAndNginx,
};

export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return { title: "Topic not found" };
  return { title: `${topic.title} | Fundamentals`, description: topic.description };
}

export default async function FundamentalsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();
  const Content = CONTENT[slug];
  const category = categories.find((c) => c.id === topic.category)?.label;
  const next = getNextTopic(slug);

  return (
    <>
      <ReadingLayout
        crumbs={[{ label: "Fundamentals", href: "/fundamentals" }, { label: topic.title }]}
        sheetLabel="Sections"
        header={
          <ReadingHeader
            eyebrow={category}
            title={topic.title}
            lede={topic.lede}
            meta={[
              { label: "Reading time", value: topic.readingTime },
              { label: "Sections", value: String(topic.sectionCount) },
            ]}
            aside={<AvatarNote pose="read" line={avatarLines[slug]} />}
          />
        }
        rail={
          <OnThisPage>
            <SignInControl className="mt-6" />
          </OnThisPage>
        }
        after={<NextUp label="Next guide" title={next.title} href={`/fundamentals/${next.slug}`} meta={next.readingTime} backHref="/fundamentals" backLabel="All guides" />}
      >
        {Content ? <Content /> : null}
      </ReadingLayout>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Build gate, checks, commit**

```bash
NEXT_TELEMETRY_DISABLED=1 npm run build
for d in out/fundamentals/*/; do echo "$d h1=$(grep -c '<h1' $d/index.html)"; done
```

Expected: build passes; every guide page has exactly one `<h1`. In the dev server: the index filters by category; a guide shows the single header with the reading avatar and its one-liner, the "On this page" rail tracks the active section, the Sections sheet works at 390 px, and the next-guide card appears at the bottom.

```bash
git add -A
git commit -m "feat: fundamentals index with filters and guide shells on the reading layout"
```

---

### Task 14: Contact page and 404

**Files:**
- Create: `src/lib/contact-validation.ts`, `scripts/contact-validation.test.mjs`, `src/components/contact/ContactForm.tsx`
- Rewrite: `src/app/contact/page.tsx`, `src/app/not-found.tsx`

- [ ] **Step 1: Write the failing validation test**

`scripts/contact-validation.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateContact, isValid, MESSAGE_MAX } from "../src/lib/contact-validation.ts";

const good = { name: "Priya", email: "priya@example.com", projectType: "A job opportunity", message: "Hello there" };

test("a complete form is valid", () => {
  assert.equal(isValid(validateContact(good)), true);
});

test("whitespace-only name and message are rejected", () => {
  const errors = validateContact({ ...good, name: "   ", message: "\n\t" });
  assert.equal(errors.name, "Enter your name.");
  assert.equal(errors.message, "Write a message.");
});

test("invalid and missing emails are rejected", () => {
  assert.equal(validateContact({ ...good, email: "not-an-email" }).email, "Enter a valid email address.");
  assert.equal(validateContact({ ...good, email: "" }).email, "Enter your email address.");
});

test("messages over the limit are rejected", () => {
  assert.equal(validateContact({ ...good, message: "x".repeat(MESSAGE_MAX + 1) }).message, `Keep the message under ${MESSAGE_MAX} characters.`);
  assert.equal(isValid(validateContact({ ...good, message: "x".repeat(MESSAGE_MAX) })), true);
});
```

- [ ] **Step 2: Run it to verify it fails, then create `src/lib/contact-validation.ts`**

```bash
npm test
```

Expected: FAIL ("Cannot find module").

```ts
export interface ContactValues {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export const MESSAGE_MAX = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(v: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!v.name.trim()) errors.name = "Enter your name.";
  if (!v.email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = "Enter a valid email address.";
  if (!v.message.trim()) errors.message = "Write a message.";
  else if (v.message.length > MESSAGE_MAX) errors.message = `Keep the message under ${MESSAGE_MAX} characters.`;
  return errors;
}

export function isValid(errors: ContactErrors): boolean {
  return Object.keys(errors).length === 0;
}
```

```bash
npm test
```

Expected: PASS.

- [ ] **Step 3: Create `src/components/contact/ContactForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Button from "@/components/ui/Button";
import Avatar from "@/components/brand/Avatar";
import { validateContact, isValid, MESSAGE_MAX, type ContactErrors, type ContactValues } from "@/lib/contact-validation";
import { cn } from "@/lib/utils";

const TOPICS = ["Just saying hi", "A job opportunity", "A project or collaboration", "Something else"];
const EMPTY: ContactValues = { name: "", email: "", projectType: TOPICS[0], message: "" };

const inputClass = "w-full rounded-md border border-border bg-bg px-3.5 py-2.5 text-body text-fg outline-none placeholder:text-fg-3 focus:border-accent";

export default function ContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sentTo, setSentTo] = useState("");

  const set = (field: keyof ContactValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const validateField = (field: keyof ContactValues) => () => setErrors((prev) => ({ ...prev, [field]: validateContact(values)[field] }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    if (!isValid(nextErrors)) return;
    setStatus("sending");
    try {
      await addDoc(collection(db, "contacts"), { ...values, createdAt: serverTimestamp(), read: false });
      setSentTo(values.email);
      setStatus("sent");
      setValues(EMPTY);
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col items-center gap-4 rounded-lg border border-border bg-surface p-8 text-center">
        <Avatar pose="wave" width={140} pokeable={false} />
        <p className="text-h3 font-display text-fg">Message sent.</p>
        <p className="text-body text-fg-2">I&apos;ll reply to {sentTo} soon.</p>
      </div>
    );
  }

  const field = (name: keyof ContactValues, label: string, control: React.ReactNode) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-small font-medium text-fg">
        {label}
      </label>
      {control}
      {errors[name] && (
        <p id={`${name}-error`} className="text-caption text-danger">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", "Name", <input id="name" name="name" type="text" autoComplete="name" value={values.name} onChange={set("name")} onBlur={validateField("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} className={cn(inputClass, errors.name && "border-danger")} />)}
        {field("email", "Email", <input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={set("email")} onBlur={validateField("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className={cn(inputClass, errors.email && "border-danger")} />)}
      </div>
      {field(
        "projectType",
        "This is about",
        <select id="projectType" name="projectType" value={values.projectType} onChange={set("projectType")} className={inputClass}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>,
      )}
      {field(
        "message",
        "Message",
        <textarea id="message" name="message" rows={5} maxLength={MESSAGE_MAX} value={values.message} onChange={set("message")} onBlur={validateField("message")} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} className={cn(inputClass, "resize-y", errors.message && "border-danger")} />,
      )}
      {status === "error" && (
        <p role="alert" className="rounded-md border border-danger/40 bg-danger-soft px-3.5 py-2.5 text-small text-fg">
          Sending failed. Try again or email me directly.
        </p>
      )}
      <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto sm:self-start">
        {status === "sending" ? "Sending" : "Send message"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 4: Rewrite `src/app/contact/page.tsx` and `src/app/not-found.tsx`**

```tsx
// src/app/contact/page.tsx
import type { Metadata } from "next";
import SiteNav from "@/components/layout/SiteNav";
import Footer from "@/components/layout/Footer";
import CopyEmailButton from "@/components/home/CopyEmailButton";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Charith Kapuluru about Cloud and DevOps roles, collaborations, or the guides.",
};

export default function ContactPage() {
  return (
    <>
      <SiteNav active="contact" />
      <main id="main" className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <h1 className="text-display-lg text-fg">Contact</h1>
          <p className="mt-4 max-w-[40ch] text-lede text-fg-2">I read every message and reply to all of them.</p>
          <div className="mt-8">
            <CopyEmailButton email="kapulurucharith@gmail.com" />
          </div>
          <p className="mt-6 text-small text-fg-2">Denton, Texas</p>
          <p className="mt-2 flex gap-5 text-small font-medium">
            <a href="https://github.com/CharithKapuluru" target="_blank" rel="noopener noreferrer" className="text-fg-2 hover:text-fg">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/charith-kapuluru-159456329/" target="_blank" rel="noopener noreferrer" className="text-fg-2 hover:text-fg">
              LinkedIn
            </a>
          </p>
        </div>
        <div className="md:col-span-7">
          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
```

```tsx
// src/app/not-found.tsx
import SiteNav from "@/components/layout/SiteNav";
import Button from "@/components/ui/Button";
import Avatar from "@/components/brand/Avatar";

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main id="main" className="relative min-h-[calc(100dvh_-_4rem)] overflow-hidden">
        <img
          src="/world/scenes/woods-1920.webp"
          srcSet="/world/scenes/woods-768.webp 768w, /world/scenes/woods-1280.webp 1280w, /world/scenes/woods-1920.webp 1920w"
          sizes="100vw"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,rgb(11_11_13_/_0.4))]" />
        <div className="relative mx-auto flex min-h-[calc(100dvh_-_4rem)] max-w-4xl flex-col items-center justify-center gap-6 px-4 py-16 text-center">
          <div className="rounded-lg border border-border bg-surface px-8 py-6 shadow-float">
            <p className="font-display text-display-lg text-fg">404</p>
            <p className="mt-2 text-body text-fg-2">This page does not exist.</p>
            <Button href="/" className="mt-6">
              Back to home
            </Button>
          </div>
          <Avatar pose="lost" width={170} pokeable={false} />
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 5: Build gate, checks, commit**

```bash
npm test
NEXT_TELEMETRY_DISABLED=1 npm run build
grep -c '<h1' out/contact/index.html; grep -c 'name="projectType"' out/contact/index.html
```

Expected: tests pass, build passes, both greps print `1`. In the dev server: submit the empty form and see three inline errors; submit a real message and confirm the success panel and a new `contacts` document in Firestore; load `/does-not-exist/` and see the woods 404.

```bash
git add -A
git commit -m "feat: contact page with inline validation, restyled 404"
```

---

### Task 15: SEO (sitemap, robots, Open Graph image, cache headers)

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`, `scripts/make-og.mjs`, `public/og.png` (generated, committed)
- Modify: `firebase.json`

- [ ] **Step 1: Create `src/app/sitemap.ts` and `src/app/robots.ts`**

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { projects } from "@/lib/projectsData";
import { topics } from "@/lib/fundamentalsData";

export const dynamic = "force-static";

const BASE = "https://charithkapuluru.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, priority: 1 },
    { url: `${BASE}/projects/`, lastModified: now, priority: 0.9 },
    { url: `${BASE}/fundamentals/`, lastModified: now, priority: 0.9 },
    { url: `${BASE}/contact/`, lastModified: now, priority: 0.5 },
    ...projects.map((p) => ({ url: `${BASE}/projects/${p.slug}/`, lastModified: now, priority: 0.8 })),
    ...topics.map((t) => ({ url: `${BASE}/fundamentals/${t.slug}/`, lastModified: now, priority: 0.7 })),
  ];
}
```

```ts
// src/app/robots.ts
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://charithkapuluru.com/sitemap.xml",
  };
}
```

If `next build` rejects either file under `output: "export"`, delete them and instead add `public/sitemap.xml` (the same URL list in XML) and `public/robots.txt` (`User-agent: *`, `Allow: /`, `Sitemap: https://charithkapuluru.com/sitemap.xml`).

- [ ] **Step 2: Create `scripts/make-og.mjs` and generate the image**

```js
// scripts/make-og.mjs
// Generates public/og.png (1200x630): dark surface, avatar head, name and role. Run once; commit the output.
import sharp from "sharp";

const W = 1200;
const H = 630;
const font = "Helvetica Neue, Helvetica, Arial, sans-serif";

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0b0b0d"/>
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="#eb9b63"/>
  <text x="520" y="285" font-family="${font}" font-size="64" font-weight="700" fill="#f2f2f4">Charith Kapuluru</text>
  <text x="520" y="345" font-family="${font}" font-size="30" fill="#a7a7b0">Cloud and DevOps engineer</text>
  <text x="520" y="405" font-family="${font}" font-size="24" fill="#7c7c86">charithkapuluru.com</text>
</svg>`;

const head = await sharp("public/world/poses/head.webp").resize({ width: 340, withoutEnlargement: true }).png().toBuffer();
const meta = await sharp(head).metadata();

await sharp(Buffer.from(svg))
  .composite([{ input: head, left: 120, top: Math.round((H - (meta.height ?? 340)) / 2) }])
  .png({ compressionLevel: 9 })
  .toFile("public/og.png");

console.log("wrote public/og.png");
```

```bash
node scripts/make-og.mjs
ls -la public/og.png
```

Expected: `public/og.png` exists, under 200 KB. Open it with the Read tool and confirm the head sits left of the text and nothing is clipped.

- [ ] **Step 3: Add long-cache headers for static assets in `firebase.json`**

Add a second entry to `hosting.headers`:

```json
{
  "source": "**/*.@(webp|png|svg|woff2)",
  "headers": [{ "key": "Cache-Control", "value": "max-age=31536000" }]
}
```

- [ ] **Step 4: Build gate, checks, commit**

```bash
NEXT_TELEMETRY_DISABLED=1 npm run build
ls out/sitemap.xml out/robots.txt out/og.png && grep -c "<loc>" out/sitemap.xml && grep -o 'property="og:image" content="[^"]*"' out/index.html
```

Expected: the three files exist, the sitemap lists 17 URLs, and the home page's `og:image` points at `https://charithkapuluru.com/og.png`.

```bash
git add -A
git commit -m "feat: sitemap, robots, open graph image, asset cache headers"
```

---

### Task 16: Cleanup, alias removal, pre-flight, screenshots, lab run

**Files:**
- Delete: `src/components/world/` (all), `src/components/home/GrassFooter.tsx`, `src/components/home/LibrarySection.tsx`, `src/components/home/WorkshopSection.tsx`, `src/components/ui/ArticleNav.tsx`, `src/components/ui/PhaseTimeline.tsx`, `src/components/ui/ProgressSidebar.tsx`, `src/components/ui/ArticleTableOfContents.tsx`, `src/components/ui/ThemeProvider.tsx`, `src/components/ui/ThemeToggle.tsx`, `src/components/ui/Tooltip.tsx`, `src/components/ui/OrganicDivider.tsx`, `src/components/ui/DropCap.tsx`, `src/hooks/useActivePhase.ts`, `public/world/scenes/{hill,library,workshop,mailbox}-{768,1280,1920}.webp`
- Modify: `src/app/layout.tsx`, `src/app/globals.css`, `src/components/ui/BookmarkButton.tsx`, `scripts/process-art.mjs`, `scripts/tokens.test.mjs`
- Create: `scripts/preflight.mjs`, `scripts/playwright/shots.js`, `scripts/playwright/lab.js`

- [ ] **Step 1: Delete the cartoon-world layer and dead components**

```bash
git rm -rq src/components/world src/components/home/GrassFooter.tsx src/components/home/LibrarySection.tsx src/components/home/WorkshopSection.tsx \
  src/components/ui/ArticleNav.tsx src/components/ui/PhaseTimeline.tsx src/components/ui/ProgressSidebar.tsx src/components/ui/ArticleTableOfContents.tsx \
  src/components/ui/ThemeProvider.tsx src/components/ui/ThemeToggle.tsx src/components/ui/Tooltip.tsx src/components/ui/OrganicDivider.tsx src/components/ui/DropCap.tsx \
  src/hooks/useActivePhase.ts
git rm -q public/world/scenes/hill-*.webp public/world/scenes/library-*.webp public/world/scenes/workshop-*.webp public/world/scenes/mailbox-*.webp
grep -rn "components/world\|GrassFooter\|LibrarySection\|WorkshopSection\|useActivePhase\|ThemeProvider\"" src; echo "exit=$?"
```

Expected: the grep prints only the two lines in `src/app/layout.tsx` (fixed next) or nothing.

In `src/app/layout.tsx` remove the `WorldProvider` and `EasterEggs` imports and unwrap `{children}`:

```tsx
<body className="bg-bg font-sans text-fg antialiased">
  <Providers>
    <SkipLink />
    {children}
    <Konami />
  </Providers>
</body>
```

In `src/components/ui/BookmarkButton.tsx` delete the deprecated `ReadingPositionTracker` export. In `scripts/process-art.mjs` set `const SCENES = ["woods"];` so a re-run never regenerates the deleted scenes.

- [ ] **Step 2: Remove the alias layer and convert any remaining alias usages**

Delete the block between `/* MIGRATION ALIASES: removed in the cleanup task */` and the `--font-serif` line (inclusive) in `src/app/globals.css`. Then:

```bash
node scripts/codemod-redesign.mjs src/app src/components
grep -rnE "\b(bg-paper|bg-cream|bg-stone|text-charcoal|text-taupe|text-olive|accent-moss|accent-terracotta|accent-sand|accent-sage|font-serif)\b" src; echo "exit=$?"
```

Expected: `exit=1` (no matches). Flip the alias test in `scripts/tokens.test.mjs` to assert absence:

```js
test("migration aliases are gone", () => {
  const theme = block("@theme inline");
  for (const alias of ["--color-bg-paper", "--color-text-charcoal", "--color-accent-moss", "--font-serif"]) {
    assert.doesNotMatch(theme, new RegExp(alias), `${alias} alias still present`);
  }
});
```

- [ ] **Step 3: Create `scripts/preflight.mjs`**

```js
#!/usr/bin/env node
// Mechanical pre-flight checks from the spec (section 10, gate 2).
// `node scripts/preflight.mjs` reports; `node scripts/preflight.mjs --strict` exits 1 on any failure.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const strict = process.argv.includes("--strict");

function walk(dir, re) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p, re) : re.test(p) ? [p] : [];
  });
}

const CODE = /\.(tsx?|css)$/;
const SHELL_DIRS = ["src/app", "src/components/layout", "src/components/brand", "src/components/home", "src/components/reading", "src/components/ui", "src/components/contact", "src/lib", "src/hooks"];
const DIAGRAMS = new Set(["AnimatedDiagram.tsx", "ArchitectureDiagram.tsx", "LayerDiagram.tsx", "TrafficFlowAnimation.tsx", "TerraformResourceTree.tsx", "ResourceAllocator.tsx", "CIDRCalculator.tsx"]);

const shell = SHELL_DIRS.flatMap((d) => walk(d, CODE));
const all = walk("src", CODE);
const base = (f) => f.split("/").pop();
const count = (files, re) => files.reduce((n, f) => n + (readFileSync(f, "utf8").match(re) || []).length, 0);

const checks = [
  { name: "em or en dashes in shell code", value: count(shell, /[\u2013\u2014]/g), max: 0 },
  { name: "emoji in shell code", value: count(shell, /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu), max: 0 },
  { name: "inline <svg outside diagram components", value: count(shell.filter((f) => !DIAGRAMS.has(base(f))), /<svg/g), max: 0 },
  { name: "hardcoded palette classes in src", value: count(all, /\b(bg|text|border|from|via|to|ring|fill|stroke)-(amber|blue|emerald|green|red|orange|purple|violet|pink|rose|sky|indigo|yellow|teal|cyan|lime|gray|slate|zinc|neutral|stone)-\d{2,3}\b/g), max: 0 },
  { name: "old alias tokens in src", value: count(all, /\b(bg-paper|bg-cream|bg-stone|text-charcoal|text-taupe|text-olive|accent-moss|accent-terracotta|accent-sand|accent-sage|font-serif)\b/g), max: 0 },
  { name: "uppercase-tracking eyebrows in home components", value: count(walk("src/components/home", CODE), /uppercase tracking/g), max: 2 },
  { name: "h-screen", value: count(all, /\bh-screen\b/g), max: 0 },
  { name: "scroll listeners", value: count(all, /addEventListener\(\s*["']scroll["']/g), max: 0 },
  { name: "setInterval (AnimatedDiagram step player excepted)", value: count(all.filter((f) => base(f) !== "AnimatedDiagram.tsx"), /\bsetInterval\(/g), max: 0 },
  { name: "window.alert", value: count(all, /\balert\(/g), max: 0 },
];

const failures = [];
for (const c of checks) {
  const ok = c.value <= c.max;
  console.log(`${ok ? "ok  " : "FAIL"} ${c.name}: ${c.value} (max ${c.max})`);
  if (!ok) failures.push(c.name);
}

if (existsSync("out")) {
  const pages = walk("out", /index\.html$/).filter((f) => !f.includes("/404"));
  for (const f of pages) {
    const n = (readFileSync(f, "utf8").match(/<h1[\s>]/g) || []).length;
    if (n !== 1) {
      console.log(`FAIL ${f}: ${n} <h1> elements`);
      failures.push(f);
    }
  }
  const home = readFileSync("out/index.html", "utf8");
  for (const needle of ['id="projects"', 'id="workshop"', 'id="main"', 'application/ld+json']) {
    if (!home.includes(needle)) {
      console.log(`FAIL out/index.html missing ${needle}`);
      failures.push(needle);
    }
  }
  console.log(`ok   ${pages.length} rendered pages checked for a single <h1>`);
} else {
  console.log("skip rendered-page checks (no out/ folder; run the build first)");
}

if (failures.length && strict) {
  console.error(`\n${failures.length} pre-flight check(s) failed`);
  process.exit(1);
}
console.log(failures.length ? `\n${failures.length} failure(s)` : "\nPre-flight clean.");
```

- [ ] **Step 4: Run every gate**

```bash
npm test
node scripts/contrast.mjs
NEXT_TELEMETRY_DISABLED=1 npm run build
node scripts/preflight.mjs --strict
du -sh out && ls out/world/scenes
```

Expected: tests pass, contrast passes, build passes, pre-flight prints every line as `ok` and "Pre-flight clean.", and `out/world/scenes` contains only the three woods files. If an eyebrow or dash count fails, fix the offending string and re-run.

- [ ] **Step 5: Serve the build and take the screenshot pass**

Create `scripts/playwright/shots.js` (loaded by the Playwright MCP `browser_run_code_unsafe` tool through its `filename` parameter):

```js
async (page) => {
  const base = "http://localhost:4173";
  const routes = ["/", "/projects/", "/projects/devsecops-pipeline/", "/projects/terraform-ecs-deployment/", "/projects/linux-sysadmin-deep-dive/", "/fundamentals/", "/fundamentals/computing-basics/", "/fundamentals/cron-jobs/", "/contact/", "/this-page-does-not-exist/"];
  const sizes = [[390, 844], [768, 1024], [1440, 900]];
  const saved = [];
  for (const theme of ["light", "dark"]) {
    for (const [width, height] of sizes) {
      await page.setViewportSize({ width, height });
      for (const route of routes) {
        await page.goto(base + route, { waitUntil: "load" });
        await page.evaluate((t) => localStorage.setItem("theme", t), theme);
        await page.reload({ waitUntil: "load" });
        await page.waitForTimeout(500);
        const long = route.startsWith("/projects/") && route !== "/projects/";
        const name = `${theme}-${width}${route === "/" ? "-home" : route.replace(/\/$/, "").replace(/\//g, "-")}`;
        await page.screenshot({ path: `.playwright-mcp/final/${name}.jpg`, type: "jpeg", quality: 70, fullPage: !long });
        if (long) {
          await page.evaluate(() => window.scrollTo(0, 2200));
          await page.waitForTimeout(400);
          await page.screenshot({ path: `.playwright-mcp/final/${name}-mid.jpg`, type: "jpeg", quality: 70 });
        }
        saved.push(name);
      }
    }
  }
  return saved.join("\n");
}
```

Run:

```bash
mkdir -p .playwright-mcp/final
npx --yes serve out -l 4173
```

(Run `serve` as a background Bash task. If the sandbox refuses to bind the port, enable `sandbox.network.allowLocalBinding` in settings or start it outside the sandbox; a `file://` URL cannot serve the `_next` assets.) Then call the Playwright MCP tool `browser_run_code_unsafe` with `filename: "scripts/playwright/shots.js"`, and review every screenshot with the Read tool for: blank sections, overlapping bars, clipped or wrapped buttons, missing images, unreadable text on either theme, a hero that overflows the first viewport at 390 or 1440. Fix anything found, rebuild, and re-shoot the affected routes.

- [ ] **Step 6: Throttled lab run against the build**

Create `scripts/playwright/lab.js`:

```js
async (page) => {
  const base = "http://localhost:4173";
  const client = await page.context().newCDPSession(page);
  await client.send("Network.enable");
  await client.send("Network.setCacheDisabled", { cacheDisabled: true });
  await client.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.setViewportSize({ width: 390, height: 844 });
  const results = {};
  for (const [name, route] of [["home", "/"], ["article", "/fundamentals/computing-basics/"], ["project", "/projects/devsecops-pipeline/"]]) {
    await page.goto("about:blank");
    await page.goto(base + route, { waitUntil: "load", timeout: 90000 }).catch(() => {});
    await page.waitForTimeout(4000);
    results[name] = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      const res = performance.getEntriesByType("resource");
      const totalKB = Math.round((res.reduce((a, r) => a + (r.transferSize || 0), 0) + (nav?.transferSize || 0)) / 1024);
      const fcp = performance.getEntriesByType("paint").find((p) => p.name === "first-contentful-paint");
      let lcp = null;
      let cls = 0;
      const long = [];
      try {
        const po = new PerformanceObserver(() => {});
        po.observe({ type: "largest-contentful-paint", buffered: true });
        const e = po.takeRecords();
        if (e.length) lcp = Math.round(e[e.length - 1].startTime);
        const po2 = new PerformanceObserver(() => {});
        po2.observe({ type: "layout-shift", buffered: true });
        for (const s of po2.takeRecords()) if (!s.hadRecentInput) cls += s.value;
        const po3 = new PerformanceObserver(() => {});
        po3.observe({ type: "longtask", buffered: true });
        for (const t of po3.takeRecords()) long.push(t.duration);
      } catch {}
      return { totalKB, fcpMs: fcp ? Math.round(fcp.startTime) : null, lcpMs: lcp, cls: Math.round(cls * 1000) / 1000, tbtMs: Math.round(long.reduce((a, d) => a + Math.max(0, d - 50), 0)) };
    });
  }
  await client.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  await client.send("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  return JSON.stringify(results, null, 1);
}
```

Call `browser_run_code_unsafe` with `filename: "scripts/playwright/lab.js"`. Expected on the home page: `lcpMs` under 2500, `tbtMs` under 200, `totalKB` under 350, `cls` under 0.1. If LCP misses, confirm the hero image carries `fetchpriority="high"` and no scene image loads; if TBT misses, check the bundle for the three project content files being pulled into the home page (they must not be). Record the numbers in the final report.

- [ ] **Step 7: Manual checks**

In the dev server or the served build, both themes:
1. Keyboard only: Tab from the top reaches the skip link first, then the wordmark, nav links, theme toggle, Resume; the mobile sheet and the sections sheet trap focus and close on Escape; the quiz and the flashcards are operable; the contact form announces errors.
2. Theme toggle cycles system, light, dark without a flash on reload.
3. Contact form: empty submit shows inline errors, a real submit writes to `contacts` and shows the success panel.
4. Project page: sign in, scroll to phase 2, confirm phases 0 and 1 tick in the rail and the Firestore document `users/{uid}/progress/devsecops-pipeline` reads `{ phases: [0, 1] }`; open the Linux project and confirm its document id is `linux-sysadmin`.
5. Old anchors: `/#workshop` and `/#projects` land on the projects section.

- [ ] **Step 8: Commit and hand over for merge**

```bash
git add -A
git commit -m "chore: remove the cartoon-world layer, alias tokens and dead components; add pre-flight and lab scripts"
git log --oneline main..HEAD
```

Report the lab numbers, the screenshot folder and anything deferred. Merging `editorial-redesign` into `main` pushes to the live site through GitHub Actions, so it waits for Charith's explicit go:

```bash
git checkout main && git merge --no-ff editorial-redesign -m "feat: editorial redesign" && git push origin main
```

---

## Self-review notes

**Spec coverage.** Sections 3 (routes, nav, footer): Tasks 6, 11 to 14. Section 4.1 type: Task 2. 4.2 color: Task 2 plus the contrast script. 4.3 shape and depth: Task 2 radii and shadows. 4.4 motion: Tasks 1, 3, 4, 5, 11 (Lenis and cloud wipe removed in Task 1, idle avatar and sound removed with the world layer in Task 16, Konami kept in Task 5). 4.5 icons and imagery: Tasks 3, 4, 10, 15, 16. 4.6 copy: Tasks 9, 11, 14. 5.1 home: Task 11. 5.2 and 5.3 projects: Task 12. 5.4 and 5.5 guides: Task 13. 5.6 contact and 5.7 404: Task 14. 5.8 states: Tasks 7, 8, 14. 6.2 tokens and alias migration: Tasks 2, 10, 16. 6.3 structure: Tasks 3 to 8, 16. 6.4 reading model: Task 7. 6.5 server/client split: every page task. 6.6 data: Task 9. 6.7 SEO: Tasks 2 and 15. Section 7 budgets: Task 16 gates. Section 8 codemods: Task 10. Section 10 verification: Task 16.

**Deliberate deviations from the spec, each visible in the task that makes it:**
- `PhaseSection` (spec 6.3) is not a component; the codemod applies its classes and `id="phase-N"` to the existing phase wrappers (Task 10), which avoids re-matching closing tags across 5,600 lines of project content.
- Per-phase Bookmark, Share and Notes buttons stay in each phase header because they are phase-specific; the rail holds Search and All notes (Task 8, Task 12). The spec listed all four in the rail.
- The reading column is 44rem wide with paragraphs capped at 70ch through `.reading-body p` (Task 2, Task 7), because the diagrams and three-column flashcard grids inside the content need more than 70ch.
- Text shades 50 to 400 on palette classes map to fixed `terminal-*` tokens (Task 10) because every such use sits on an always-dark panel.
- The ten guide ledes and three project ledes move into the data files with their dashes replaced (Task 9); everything else in the content files keeps its punctuation.

**Review Focus coverage:** 1 Task 11 and the preflight script; 2 Task 7 storage tests; 3 Task 9 data test; 4 Task 4 terminal-state test and Task 7 scroll test; 5 Task 14 validation tests.
