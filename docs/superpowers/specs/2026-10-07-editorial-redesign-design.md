# Website Redesign: Editorial Portfolio with the Avatar as Mascot

**Date:** 2026-10-07
**Status:** Design approved in conversation (three rounds), pending written review
**Supersedes:** `docs/superpowers/specs/2026-06-12-website-redesign-design.md` ("Charith's World")
**Mode:** Redesign, overhaul. New visual language and page shells; all content, routes and Firebase behaviour preserved.

## 1. Goal

Rebuild charithkapuluru.com as a premium, editorial developer portfolio for recruiters, hiring managers and learners. The site must say "cloud and DevOps engineer" in the first seven seconds, then make the three project walkthroughs and ten Fundamentals guides a pleasure to read. The cartoon avatar stays as the one recognisably-Charith signature; the illustrated storybook scenes retire.

### Design read

Redesign (overhaul) of a developer portfolio and technical learning site, for recruiters, hiring managers and learners, in an editorial-tech language: confident type, calm surfaces, one warm accent, the avatar as the signature. Foundation: Tailwind v4 semantic tokens, next/font Google fonts, framer-motion with restraint, Phosphor icons.

Dials: `DESIGN_VARIANCE 7`, `MOTION_INTENSITY 6`, `VISUAL_DENSITY 4` (3 on reading pages).

### Decisions log (approved 2026-10-07)

| Decision | Choice |
| --- | --- |
| Direction | Editorial portfolio, avatar as mascot (over "polish the world" and "pure dark-tech minimal") |
| Depth | Shell plus rebuilt content system (option 2). MDX migration out of scope |
| Type | Bricolage Grotesque display, Geist body/UI, Geist Mono code |
| Color | Cool-neutral zinc ramp, one burnt-amber accent, dark and light from day one |
| Flagged changes | Wordmark becomes "Charith Kapuluru"; Projects nav link and `/projects` index added; sound toggle removed; scenes retire except on the 404 |
| Proof strip | Kept (four real resume figures under the hero) |
| Avatar presence | Minimal: nav mark, hero, About photo corner, one margin line per article, 404, contact success |
| SEO extras | Kept (Open Graph image, JSON-LD, sitemap, robots) |

## 2. Audit of the current site (baseline, 2026-10-07)

Measured on the live site with Playwright at 1440 and 390 px, plus a throttled mobile lab run (1.6 Mbps, 150 ms RTT, 4x CPU).

| Page (mobile, throttled) | LCP | Approx. blocking time | Transfer | LCP element |
| --- | --- | --- | --- | --- |
| Home | 4.5 s | 554 ms | 786 KB | H1 (after fonts) |
| Article (Computing Basics) | 3.6 s | 22 ms | 753 KB | 1920 px library scene |
| Project (DevSecOps) | 3.3 s | 0 ms | 729 KB | 1920 px workshop scene |

Structural problems found:

- Two H1s on every article and project page (scene header plus body title).
- The fixed site nav and the sticky section nav both sit at `top-0 z-50`; the logo and Resume button overlap the section tabs after scrolling. The progress sidebar floats over the header art.
- Project cards and topic cards start at opacity 0 behind `whileInView`; in headless renders they never appeared.
- Hero subtext sits directly on the sky illustration and fails AA contrast.
- Design debt by grep: 47 distinct hardcoded Tailwind palette colors across 183 uses, 215 emoji in 24 files, 74 hand-rolled `<svg>`, 40 uppercase eyebrow labels, 473 em-dashes (mostly in tutorial prose), 11 `h-screen`, 3 `setInterval` localStorage pollers, 65 of 75 components are client components, no skip link, light-only, 10 copy-pasted `Section` wrappers with gradient backgrounds in the article files.
- Duplicate CTA intents: Resume in nav and About; "Visit the mailbox" shown on the mailbox page.
- Back links in project navs point to `/#projects`, an anchor that does not exist.

## 3. Information architecture and navigation

All existing routes and slugs are preserved exactly. One route is added.

| Route | Status | Page |
| --- | --- | --- |
| `/` | rebuilt | Home |
| `/projects` | **new** | Projects index |
| `/projects/[slug]` (3) | rebuilt shell, content preserved | Project walkthrough |
| `/fundamentals` | rebuilt | Fundamentals index |
| `/fundamentals/[slug]` (10) | rebuilt shell, content preserved | Guide |
| `/contact` | rebuilt | Contact |
| 404 | restyled | Not found (woods scene kept) |

### Site nav (`SiteNav`)

- One 64 px bar, sticky, surface background with hairline bottom border, backdrop blur only when scrolled.
- Left: avatar head mark (36 px, follows the cursor with the existing spring rig, static under reduced motion) plus wordmark "Charith Kapuluru" in the display font.
- Links: Projects, Fundamentals, Contact. Active link gets a 2 px accent underline and `aria-current="page"`.
- Right: theme toggle (icon button cycling system, light, dark in that order; Phosphor `Monitor`, `Sun`, `Moon`; accessible label "Theme: {current}, switch to {next}") and the Resume button (ink/off-white primary, downloads `/ck.pdf` as `Charith_Kapuluru_Resume.pdf`).
- Below 768 px: mark plus a menu button opening a full-height sheet (links, Resume, theme toggle) with focus trap and Escape to close.

### Contextual nav (reading pages)

The same bar, same height. The three links give way to a breadcrumb ("Fundamentals / Computing Basics", "Projects / Building a DevSecOps Pipeline"). A 2 px reading-progress line runs along the bar's bottom edge, driven by framer `useScroll`. Below 1280 px a "Sections" (guides) or "Phases" (projects) button opens a bottom sheet listing the sections with the active one marked. The Resume button and theme toggle stay.

### Footer

Name and role on one line ("Charith Kapuluru. Cloud and DevOps engineer."), two link groups (Site: Projects, Fundamentals, Contact. Elsewhere: GitHub, LinkedIn, Email), small print "© 2026 Charith Kapuluru" and "Built with Next.js. Hosted on Firebase." Year rendered at build time, no hydration warning suppression.

## 4. Design system

### 4.1 Typography (next/font/google, all verified available)

| Role | Family | CSS variable | Notes |
| --- | --- | --- | --- |
| Display | Bricolage Grotesque (variable, axes `opsz`, `wdth`) | `--font-display` | Weights 500 to 700 only |
| Body and UI | Geist (variable) | `--font-sans` | `font-variant-numeric: tabular-nums` on meta and figures |
| Code | Geist Mono (variable) | `--font-mono` | Replaces JetBrains Mono |

During migration `--font-serif` is aliased to `--font-display` so existing `font-serif` headings render correctly; the codemod (Section 8) then renames them.

Fluid scale (all `clamp()`):

| Token | Size | Line height | Tracking | Use |
| --- | --- | --- | --- | --- |
| `text-display-xl` | clamp(2.5rem, 1.5rem + 4.2vw, 4.75rem) | 1.02 | -0.025em | Home H1 |
| `text-display-lg` | clamp(2.125rem, 1.4rem + 3vw, 3.5rem) | 1.05 | -0.02em | Page H1 |
| `text-h2` | clamp(1.625rem, 1.25rem + 1.5vw, 2.25rem) | 1.15 | -0.015em | Section H2 |
| `text-h3` | clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem) | 1.25 | -0.01em | H3 |
| `text-figure` | clamp(2rem, 1.5rem + 2vw, 3rem) | 1 | -0.02em | Proof strip numerals |
| `text-lede` | 1.25rem | 1.5 | 0 | Hero subtext, page intros |
| `text-body-read` | 1.0625rem | 1.7 | 0 | Article and project prose |
| `text-body` | 1rem | 1.6 | 0 | UI |
| `text-small` | 0.875rem | 1.5 | 0 | Meta, tags |
| `text-caption` | 0.8125rem | 1.4 | 0 | Captions, labels |

Reading measure: `max-w-[70ch]` for prose. Headlines use `text-wrap: balance`, paragraphs `text-wrap: pretty`. No all-caps labels except at most one eyebrow per three sections.

### 4.2 Color

One cool-neutral ramp, no pure `#000`/`#fff`. Theme switched by `next-themes` with `attribute="class"` (`.dark`) and `color-scheme` set on `html`.

| Token | Light | Dark |
| --- | --- | --- |
| `--color-bg` | `#f7f7f8` | `#0b0b0d` |
| `--color-surface` | `#fcfcfd` | `#131316` |
| `--color-surface-2` | `#efeff1` | `#1b1b1f` |
| `--color-border` | `#e4e4e7` | `#26262b` |
| `--color-border-strong` | `#d4d4d8` | `#35353b` |
| `--color-fg` | `#18181b` | `#f2f2f4` |
| `--color-fg-2` | `#52525b` | `#a7a7b0` |
| `--color-fg-3` | `#6b6b74` | `#86868f` |
| `--color-accent` | `#a84d18` | `#eb9b63` |
| `--color-accent-strong` (hover) | `#8f3f12` | `#f4b07f` |
| `--color-accent-soft` (tint) | `#f9e8dc` | `rgb(235 155 99 / 0.12)` |
| `--color-primary` (solid button bg) | `#18181b` | `#f2f2f4` |
| `--color-primary-fg` | `#fafafa` | `#0b0b0d` |

Contrast floor: `fg-3` on `bg` is at least 4.5:1 in both themes; `accent` on `bg` is 5.2:1 light and above 9:1 dark. A script checks every text/background token pair (Section 10).

Semantic tints exist only inside tutorial callouts and status UI:

| Tone | Border/icon light | Tint light | Border/icon dark | Tint dark | Used by |
| --- | --- | --- | --- | --- | --- |
| `tip` | accent | accent-soft | accent | accent-soft | Key takeaway |
| `info` | `#4f7fd9` | `#e9f0fb` | `#8fb0ee` | `rgb(79 127 217 / 0.14)` | Analogy, info notes |
| `success` | `#2f9e6a` | `#e4f5ec` | `#6fcb9b` | `rgb(47 158 106 / 0.16)` | Did you know, correct answers |
| `danger` | `#d1483f` | `#fbe7e5` | `#ef8a83` | `rgb(209 72 63 / 0.16)` | Warning, wrong answers, form errors |
| `neutral` | border-strong | surface-2 | border-strong | surface-2 | Real talk |

Token names: `--color-{tone}` for the border and icon color and `--color-{tone}-soft` for the tint, where tone is `tip`, `info`, `success` or `danger`; `neutral` reuses `border-strong` and `surface-2`.

Code blocks follow the theme (surface-2 with border). The Terminal component is always dark (`#0f0f12` background, `#e4e4e7` text, accent prompt) in both themes, as a deliberate exception.

Color Consistency Lock: the accent is the only non-neutral color outside callouts and status states.

### 4.3 Shape, depth, spacing

- Radius: `--radius-lg 14px` panels and cards, `--radius-md 10px` buttons, inputs, code blocks, `--radius-sm 6px` tags and inline code, images 12 px. Avatar hero tile 14 px.
- Depth: 1 px hairline borders on light; on dark, surface steps. Shadows only on floating menus, sheets and toasts: `0 12px 32px -12px rgb(24 24 27 / 0.18)` light, `0 12px 32px -12px rgb(0 0 0 / 0.6)` dark.
- Spacing: 4 px base. Home sections `py-20 md:py-28`. Reading pages `py-10 md:py-14`. Containers `max-w-6xl` (home, indexes, contact) and a reading grid of `minmax(0, 1fr) minmax(0, 70ch) 272px` at `xl`.
- Z-index scale, documented in `src/lib/z.ts`: 10 raised, 20 nav, 30 rail, 40 sheet and backdrop, 50 toast, 60 skip link.

### 4.4 Motion

- Durations 150 ms (hover), 220 ms (state), 320 ms (enter). Easing `cubic-bezier(0.16, 1, 0.3, 1)`.
- Hero: headline, subtext, buttons and avatar stagger in once on mount (60 ms apart). Nothing else on the page animates in on scroll except decorative tiles, which start at opacity 0.6 (never 0) so content is always visible.
- Hover: cards translate -1 px and change border color; nav links grow an underline; buttons press to `scale(0.98)`.
- Avatar: head mark follows the cursor (existing spring rig). Hero avatar reacts to clicks with the existing poke lines. No default speech bubble.
- Kept because they give feedback: confetti and the celebration toast on quiz and phase completion, Terminal typing with a Replay button, the Konami breakdance.
- Removed: Lenis smooth scroll, cloud page wipe (`template.tsx`), idle "you still there" avatar, drifting clouds, spring wiggles on callouts and collapsibles, the sound system.
- `prefers-reduced-motion`: the global 0.01 ms rule stays; framer components check `useReducedMotion` and render static.

### 4.5 Icons and imagery

- Phosphor only (`@phosphor-icons/react`), weight `regular`, size 20 in UI and 16 in meta. The `lucide-react` dependency is removed. All 74 hand-rolled `<svg>` paths and all 215 emoji are replaced or removed.
- Avatar poses stay in `public/world/poses/`. Used: `head` (nav), `laptop` (hero), `peek` (About photo corner), `read` (article header), `wave` (contact success), `lost` (404). Unused poses stay on disk.
- Scenes: only `woods-*.webp` remains referenced (404). The hill, library, workshop and mailbox scenes are deleted from `public/world/scenes/` and `avatar-art/` keeps the sources.
- Photo: `public/world/charith-photo.webp` at 4:5, radius 12 px, in About.
- One generated Open Graph image `public/og.png` (1200 by 630, avatar head plus name and role on the dark surface) produced by extending `scripts/process-art.mjs`.

### 4.6 Copy register

Plain, confident, first person, sentence case, no jokes in headings, no exclamation marks, no em-dashes or en-dashes in any shell or UI string. Personality lives in the avatar poke lines, the per-page avatar lines in `src/lib/avatarLines.ts` (kept as is) and the About paragraphs. Tutorial prose inside the 13 content files is preserved verbatim, including its punctuation; only headings that contain emoji are edited.

Shell copy (final unless Charith edits it):

- Home H1: "I build cloud infrastructure and explain how it works."
- Home subtext: "Cloud and DevOps engineer. Three years shipping microservices on AWS, now finishing an MS in Computer Science at UNT."
- Home CTAs: "View projects" (primary, `/projects`), "Read the guides" (secondary, `/fundamentals`).
- Proof strip: "3" with "client migrations led from on-prem monoliths to AWS microservices, cutting hosting costs 35%"; "~70%" with "lower compute cost on ECS with Fargate Spot and autoscaling"; "30%" with "faster API responses after query and data-layer optimisation"; "1st" with "place, UNT Cybersecurity Hackathon 2024".
- Projects section: "Selected projects" and "Three production-style walkthroughs, built and documented end to end."
- Fundamentals section: "Fundamentals" and "Ten plain-language guides to how servers, Linux and networks actually work."
- About: "About". Paragraph 1: "I'm a software engineer finishing my Master's in Computer Science at the University of North Texas. Before UNT I spent three years at KANsolv Technologies in Hyderabad, breaking monoliths into containerized microservices on AWS and building the CI/CD, auth and observability around them." Paragraph 2: "I care about infrastructure that stays boring in production, and about explaining it clearly. The guides on this site started as the notes I wished I had when I began."
- Contact band: "Open to Cloud and DevOps roles." and "Based in Denton, Texas. Happy to talk about infrastructure, pipelines or the guides." Button "Contact".
- Contact page: H1 "Contact", intro "I read every message and reply to all of them." Labels: Name, Email, This is about, Message. Button "Send message". Sending: "Sending". Success panel: "Message sent. I'll reply to {email} soon." Error: "Sending failed. Try again or email me directly."
- 404: "404", "This page does not exist.", button "Back to home".

## 5. Page designs

### 5.1 Home

Seven sections, each a different layout family. Eyebrow budget: at most 2 on the page.

1. **Hero (asymmetric split, `min-h-[calc(100dvh-4rem)]` capped at 820 px, `pt-16 md:pt-24`).** Left column (7/12): H1 at `text-display-xl`, subtext at `text-lede` and `max-w-[36ch]`, two buttons. Right column (5/12): the `laptop` pose at 380 px wide on a `surface-2` tile with radius 14 and a faint radial accent glow (`accent-soft`, 40% opacity), tile height matched to the image to avoid layout shift. Image has explicit width and height and `fetchpriority="high"`. Mobile: single column, avatar 220 px above the headline.
2. **Proof strip.** Four columns at `md`, two at `sm`, one below, separated by hairlines (`divide-x` at md, `divide-y` otherwise). Each: figure in `text-figure` display font with tabular numerals, one line of context in `fg-2`. No filled track bars.
3. **Selected projects.** Heading plus sub. Three rows, `divide-y`. Each row is a 12-column grid at `md`: icon and meta (phase count, reading time) in 3 columns, title (`text-h3`, link), one-sentence outcome and stack tags in 9 columns. Icons: `GitBranch` (DevSecOps), `CloudArrowUp` (ECS Fargate), `Terminal` (Linux). Row hover: background `surface` and title in accent. Link "All projects" to `/projects`.
4. **Fundamentals index.** Heading plus sub. Two columns at `md`, grouped by the four categories in `fundamentalsData.ts`; each group has a `text-small` category heading (not uppercase) and its guides as rows with title left and reading time right in tabular numerals. Link "All 10 guides".
5. **About and experience (split).** Left (5/12): photo at 4:5, radius 12, with the `peek` pose (150 px) overlapping the top-right corner, `aria-hidden`. Right (7/12): heading "About", two paragraphs at `text-body-read`, a compact timeline list (UNT MS Computer Science 2024 to 2026; KANsolv Software Engineer 2022 to 2024; KANsolv Software Engineering Intern 2021 to 2022), an awards line (Star Performer Q2 2023, Code Quality Champion Q4 2023, 1st place UNT Cybersecurity Hackathon 2024), stack tags grouped under Cloud, IaC and CI/CD, Containers, Observability, Languages, and text links to GitHub and LinkedIn. Mobile: photo first, single column.
6. **Contact band.** Centered `surface` panel with radius 14: heading, one line, email as a button that copies to clipboard (label changes to "Copied" for 1.5 s, with `aria-live`), and the "Contact" button to `/contact`.
7. **Footer.**

### 5.2 Projects index (`/projects`, new)

H1 "Projects", intro "Three production-style walkthroughs. Each one is a real repository, documented phase by phase." The same three rows as home, plus a "What you will build" line per project taken from `projectsData.ts`.

### 5.3 Project walkthrough (`/projects/[slug]`)

- Contextual nav with breadcrumb and progress line.
- Header (reading grid, center column): eyebrow "Project walkthrough" (the page's one eyebrow), H1 from `projectsData.title` at `text-display-lg`, lede from a new `lede` field (the former body title text), then a facts panel (`surface`, radius 14, two columns): Repository (Phosphor `GithubLogo`, external link), Stack (tags), Phases (count), Estimated time, Outcome. Facts come from new fields in `projectsData.ts`: `repo`, `lede`, `outcome`, `estimatedTime`, `whatYouBuild`.
- Right rail at `xl` (`PhaseRail`, sticky below the nav): phase list with checkboxes reflecting completion (Firestore `users/{uid}/progress/{slug}.phases`, same document shape as today), progress bar without a filled track (thin accent line on a hairline), signed-out prompt "Sign in to save progress" with a Google sign-in button, and an actions row: Notes, Bookmark, Share, Search (icon buttons with labels, opening the existing panels restyled).
- Below `xl`: the rail's content lives in the "Phases" sheet; progress is the nav line.
- "Resume where you left off" renders as an inline notice under the facts panel (Resume and Start fresh buttons), never as a floating toast.
- Body: existing phase content inside `PhaseSection` wrappers (anchor id `phase-{n}`, `scroll-mt-20`), rebuilt primitives. Confetti and celebration toast stay on phase completion.
- Bottom: prev/next project card and "All projects".

### 5.4 Fundamentals index (`/fundamentals`)

H1 "Fundamentals", intro, filter pills (All, Computing Basics, Linux & Command Line, Networking & Security, DevOps Tools) as a client leaf with `aria-pressed`, then a two-column grid of cards (`surface`, hairline border, radius 14): category label in `text-caption` `fg-3`, title `text-h3`, two-line description (`line-clamp-2`), meta row (reading time, section count). Hover lifts 1 px and tints the border toward the accent. The gradient header, blurred circles, icon tile, "Beginner Friendly" badge, "Start Reading" arrow and the dashed "coming soon" card are removed. Closing line: "Not sure where to start? Begin with Computing Basics." as a text link. `fundamentalsData.ts` loses `gradient` and `icon`.

### 5.5 Guide (`/fundamentals/[slug]`)

- Contextual nav with breadcrumb and progress line.
- Header (center column): category label, H1 (`text-display-lg`, the only H1), subtitle at `text-lede`, meta row (reading time, section count). To the right of the header at `lg` and above: the `read` pose at 120 px with the page's `avatarLines` entry as a `text-caption` `fg-3` caption underneath. Below `lg` the avatar and caption sit under the meta row at 88 px.
- Right rail at `xl` (`OnThisPage`): "On this page" list of sections with scroll-spy (IntersectionObserver, the existing `useActivePhase` logic generalised), active item in accent with `aria-current="true"`, percentage read, and the sign-in control. Below `xl`: the "Sections" sheet.
- Body: each of the ten article components renders its sections inside the shared `ArticleSection` (anchor id, `scroll-mt-20`, `py-10 md:py-14`, hairline top border between sections, plain `bg` surface). No dotted grids, no per-section gradients, no giant display title, no drop caps, no organic dividers.
- Bottom: "Next guide" card (title, reading time) following the order in `fundamentalsData.topics`, and "All guides".

### 5.6 Contact (`/contact`)

Split at `md` (5/12 and 7/12). Left: H1 "Contact", intro, email copy button, "Denton, Texas", GitHub and LinkedIn text links. Right: form in a `surface` panel (radius 14). Fields in order with unchanged names: `name` (Name), `email` (Email), `projectType` (This is about, select with the existing four options), `message` (Message, textarea, `maxLength` 5000). Labels above fields, `gap-2`, helper text slot present, inline error text below the field in `danger` with `aria-describedby`. Client validation: required fields and email format, checked on blur and on submit. States: idle, sending (button disabled, label "Sending"), sent (form replaced by a success panel with the `wave` pose at 140 px and the success copy), error (inline alert, form stays filled). Firestore write to `contacts` unchanged (`createdAt: serverTimestamp()`, `read: false`).

### 5.7 Not found

`woods-*.webp` full-bleed with a bottom scrim of `rgb(11 11 13 / 0.4)` in both themes for contrast. Centered `surface` panel (radius 14): "404" in `text-display-lg`, the line, the "Back to home" primary button. The `lost` pose at 170 px beside the panel, no bubble.

### 5.8 States and responsive rules

- Loading: skeleton rows (surface-2 blocks, 1.6 s shimmer) for Firebase-backed progress, notes and bookmarks while auth and Firestore resolve.
- Empty: notes panel shows "No notes yet. Select text in a phase to add one." with the existing add flow.
- Errors: inline, in `danger`, never `window.alert`. The one existing `alert(` call is replaced.
- Every multi-column layout collapses to one column below 768 px with 16 px gutters. Interactive targets are at least 24 by 24 px; nav and sheet items 44 px tall.
- Viewport units: `min-h-[100dvh]` only, never `h-screen`.

## 6. Technical architecture

### 6.1 Stack

Unchanged: Next.js 16.0.8 App Router with `output: "export"` and `trailingSlash`, React 19, Tailwind v4 (`@tailwindcss/postcss`), framer-motion 12, `@phosphor-icons/react`, Firebase 12 (Auth, Firestore), Firebase Hosting via `.github/workflows/firebase-hosting-merge.yml`.

Added: `next-themes` (theme class, system preference, no flash). Removed: `lenis`, `lucide-react`. Fonts via `next/font/google` only.

### 6.2 Token strategy

`src/app/globals.css` defines the semantic tokens in `@theme inline` and the light/dark values on `:root` and `.dark`. For the migration window the old names (`--color-bg-paper`, `--color-bg-cream`, `--color-bg-stone`, `--color-text-charcoal`, `--color-text-taupe`, `--color-text-olive`, `--color-accent-moss`, `--color-accent-terracotta`, `--color-accent-sand`, `--color-accent-sage`, `--font-serif`) are aliases of the new tokens so every existing class re-themes immediately and works in dark mode. The codemod in Section 8 renames usages; the aliases are deleted in the final task and the build must pass without them.

Alias map: `bg-paper` to `surface`, `bg-cream` to `bg`, `bg-stone` to `surface-2`, `text-charcoal` to `fg`, `text-taupe` to `fg-2`, `text-olive` to `fg-3`, `accent-moss` to `accent`, `accent-terracotta` to `danger`, `accent-sand` to `accent`, `accent-sage` to `success`, `font-serif` to `font-display`.

### 6.3 Component structure

```
src/components/
  layout/    SiteNav, ContextualNav, NavSheet, Footer, Container, SkipLink, ThemeToggle
  brand/     Avatar (poses, poke lines), AvatarHead (cursor rig), Wordmark, Konami (egg)
  home/      Hero, ProofStrip, SelectedProjects, FundamentalsIndex, AboutSection, ContactBand
  reading/   ReadingLayout (grid + ReadingNavProvider), OnThisPage, PhaseRail, SectionsSheet,
             ArticleSection, PhaseSection, ReadingHeader, FactsPanel, ResumeNotice, NextUp
  ui/        Button, Tag, Callout, Collapsible, CodeBlock, Terminal, Quiz, Flashcards,
             ComparisonTable, BeforeAfterComparison, ConceptCards, DifficultyIndicator,
             LaunchChecklist, SectionHeader (was PhaseHeader), PullQuote, Confetti,
             SearchBar, BookmarkButton, PersonalNotes, ShareButtons, Skeleton,
             AnimatedDiagram, ArchitectureDiagram, LayerDiagram, TrafficFlowAnimation,
             TerraformResourceTree, ResourceAllocator, CIDRCalculator
  fundamentals/  (10 content files, edited by codemod)
  projects/      (3 content files, edited by codemod)
src/hooks/   useReadingNav (replaces useActivePhase usage), useProgress (Firestore logic
             extracted from ProgressSidebar), useKonami
src/lib/     projectsData, fundamentalsData, avatarLines, z, utils, firebase
```

Deleted: `components/world/*` (WorldProvider, WorldNav, SpeechBubble, PaperPanel, EasterEggs, scenes), `components/home/GrassFooter`, `components/home/LibrarySection`, `components/home/WorkshopSection`, `components/SmoothScroll`, `app/template.tsx`, `ui/ArticleNav`, `ui/PhaseTimeline`, `ui/ProgressSidebar`, `ui/ArticleTableOfContents`, `ui/ThemeProvider`, `ui/ThemeToggle` (replaced in layout/), `ui/Tooltip`, `ui/OrganicDivider`, `ui/DropCap`.

Callout wrappers: `KeyTakeaway`, `AnalogyBox`, `DidYouKnow`, `WarningBox` and `RealTalk` keep their file names and props as thin wrappers over `Callout` with fixed tone, icon and label, so the 13 content files keep their imports.

### 6.4 Reading navigation model

`ReadingLayout` is a client component wrapping the center column and rail. It provides `ReadingNavContext` with `sections`, `activeId`, `setActive`, `scrollTo`. Content files call `useReadingNav(sections)` (which owns the IntersectionObserver that `useActivePhase` has today) and render `ArticleSection`/`PhaseSection` with the section ids. `OnThisPage`, `PhaseRail`, `SectionsSheet` and the progress line read the context. Content files no longer render any nav component.

`useProgress(slug)` holds the Firestore subscription, auto-completion rule and save logic lifted from `ProgressSidebar`; `PhaseRail` and the sheet consume it. The three `setInterval` localStorage pollers are replaced: `PhaseTimeline` is deleted, `ReadingPositionTracker` saves on `visibilitychange` and `pagehide` instead of every 5 s, and cross-tab sync uses the `storage` event.

### 6.5 Server and client split

`layout.tsx`, every `page.tsx`, `SiteNav` shell, `Footer`, `Hero` markup, `ProofStrip`, `SelectedProjects`, `FundamentalsIndex`, `AboutSection`, `ContactBand`, `FactsPanel`, `NextUp` are Server Components. Client leaves: `ThemeToggle`, `NavSheet`, `AvatarHead`, `Avatar` (poke), `ContextualNav` progress line, `ReadingLayout` and rails, the contact form, filter pills, `Konami`, and every interactive content primitive. The 13 content files stay `"use client"`; their HTML is still statically rendered at build.

### 6.6 Data additions

`projectsData.ts` gains `repo`, `lede`, `outcome`, `estimatedTime`, `whatYouBuild`, `icon` (Phosphor name) and drops `gradient`:

| Slug | Repo | Outcome |
| --- | --- | --- |
| `devsecops-pipeline` | `https://github.com/CharithKapuluru/fastapi-devsecops-demo` | 18 automated tests, 700+ lint rules, Semgrep and Trivy gates on every merge |
| `terraform-ecs-deployment` | `https://github.com/CharithKapuluru/proj2-ecs-fargate` | About 70% lower compute cost with Fargate Spot and autoscaling |
| `linux-sysadmin-deep-dive` | `https://github.com/CharithKapuluru/linux-sysadmin-deep-dive` | A hardened Ubuntu server with ufw, fail2ban, systemd services, cron and LVM |

`fundamentalsData.ts` drops `gradient` and `icon`; the four categories stay.

### 6.7 SEO and metadata

- Titles and descriptions preserved per route. Root layout description rewritten to the new register (no "cartoon version of him").
- `metadataBase` set to `https://charithkapuluru.com`; Open Graph and Twitter card metadata on every page using `public/og.png`.
- JSON-LD `Person` (name, url, jobTitle, sameAs GitHub and LinkedIn) injected on the home page.
- `app/sitemap.ts` and `app/robots.ts` with `dynamic = "force-static"`; if static export rejects them, equivalent static files go in `public/`.
- `firebase.json` adds a one-year cache header for `**/*.@(webp|png|woff2)`.

## 7. Performance and accessibility budgets

| Budget | Target |
| --- | --- |
| Home transfer (cold, mobile) | under 350 KB |
| Home LCP (throttled lab) | under 2.5 s |
| Home blocking time (throttled lab) | under 200 ms |
| CLS, every page | under 0.1 (explicit dimensions on every image, tile heights reserved) |
| Fonts | 3 variable families, latin subset, `display: swap`, next/font fallback metrics |
| Scene images | loaded only on the 404 |
| Scroll handling | no `addEventListener("scroll")`, no `setInterval` polling |

Accessibility: skip link as the first focusable element; `main`, `nav`, `header`, `footer`, `aside` landmarks; one H1 per page; `:focus-visible` ring 2 px accent with 2 px offset; targets at least 24 px; AA contrast for every token pair in both themes (script); `aria-current` on nav, rail and pills; sheets trap focus, close on Escape and restore focus; forms wire errors with `aria-describedby` and announce status with `aria-live="polite"`; every meaningful image has alt text and decorative art is `aria-hidden`; reduced motion honoured everywhere.

## 8. Codemods (scripted, then reviewed by hand)

Run as `node scripts/codemod-redesign.mjs` over `src/components/fundamentals`, `src/components/projects` and `src/components/ui`, then diffed and reviewed before commit:

1. Token renames per the alias map in 6.2, including `/opacity` suffixes.
2. Hardcoded palette classes to semantic tokens: `amber-*`, `yellow-*` and `orange-*` to `tip`, `blue-*`, `sky-*` and `indigo-*` to `info`, `emerald-*`, `green-*` and `teal-*` to `success`, `red-*` and `rose-*` to `danger`, `purple-*`, `violet-*` and `pink-*` to `accent`. Shades 50 to 200 map to the `-soft` tint token; shades 300 to 900 map to the border/icon token.
3. `font-serif` to `font-display` when the element is `h1` to `h4`, otherwise removed.
4. Emoji: removed from headings and strings; emoji passed as `icon` props to `AnalogyBox`, `ConceptCards`, `AnimatedDiagram` and `Quiz` feedback replaced by Phosphor icon names through a lookup table (`💡 Lightbulb`, `📖 BookOpen`, `⚠️ Warning`, `🔒 Lock`, `🌐 Globe`, `🐧 LinuxLogo`, `🐳 Package`, `⚙️ Gear`, `🔑 Key`, `📁 Folder`, `🚀 RocketLaunch`, `✅ CheckCircle`, `❌ XCircle`, `🤔 Question`, default `Info`).
5. Remove `DropCap` and `OrganicDivider` usages (unwrap children, delete dividers).
6. Replace each local `Section` wrapper and `sectionStyles`/`accentColors` arrays with `ArticleSection`; replace `ArticleNav`, `PhaseTimeline`, `ProgressSidebar` JSX and `useActivePhase` calls with `useReadingNav`.
7. Leave all prose text nodes untouched (em-dashes in tutorial prose are preserved).

The build is the gate after each codemod step.

## 9. What is preserved (never changes silently)

- Every route and slug; the nav label "Fundamentals"; anchor ids for phases and sections (`phase-{n}`, existing section ids).
- All tutorial and guide content, interactive components and prose.
- Firebase: Firestore collections and document shapes (`contacts`, `users/{uid}/progress/{slug}`, `users/{uid}/notes`, `users/{uid}/bookmarks`), Google sign-in, security rules, the deploy workflow and its environment variables.
- Contact form field names and option values.
- `public/ck.pdf` and the Resume download filename.
- Avatar poses and the per-page avatar lines.

## 10. Verification gates

1. `NEXT_TELEMETRY_DISABLED=1 npm run build` passes (type-check plus static render of every route). One build at a time; renice if launched in the background (see project memory on slow builds).
2. `node scripts/preflight.mjs` passes: zero em-dashes (U+2014) or en-dashes (U+2013) in `src/app`, `src/components/{layout,brand,home,reading,ui}` and `src/lib`; zero emoji in those folders; zero `<svg` in those folders except inside the seven diagram components (AnimatedDiagram, ArchitectureDiagram, LayerDiagram, TrafficFlowAnimation, TerraformResourceTree, ResourceAllocator, CIDRCalculator), which may draw connectors and shapes but not icons; zero hardcoded palette classes anywhere in `src`; `uppercase tracking` count on the home components at most 2; zero `h-screen`; zero `addEventListener("scroll"`; zero `setInterval`; zero `alert(`; exactly one `<h1` rendered per route in `out/**/index.html`.
3. `node scripts/contrast.mjs` passes: every text token on every background token it is used with is at least 4.5:1 in both themes (3:1 for `text-figure` and larger).
4. Playwright pass (MCP, against `out/` served locally): every route at 390, 768 and 1440 px in light and dark, full-page screenshots reviewed for blank sections, overlapping bars, clipped text, wrapped buttons and missing images.
5. Throttled mobile lab run (same CDP script as the baseline) against the built output: home LCP under 2.5 s, blocking time under 200 ms, transfer under 350 KB. PageSpeed Insights when its rate limit allows.
6. Manual checks: keyboard-only pass through nav, sheet, rail, form and quiz; theme toggle without flash; contact form end to end against Firestore; sign-in and progress save on a project page.

## 11. Out of scope

MDX migration, rewriting tutorial prose, new avatar artwork (the missing `celebrate` pose), project screenshots, analytics, blog or RSS, the day-night scene toggle, the mini-game, and any change to Firebase security rules.

## 12. Build order

1. Tokens, fonts, theme provider, base styles, alias layer; delete Lenis, cloud wipe, sound, idle avatar.
2. Layout: SkipLink, SiteNav, NavSheet, ThemeToggle, Footer, Container; brand: Avatar, AvatarHead, Wordmark, Konami.
3. UI primitives: Button, Tag, Callout and wrappers, Collapsible, CodeBlock, Terminal, SectionHeader, Skeleton, PullQuote; restyle Quiz, Flashcards, ComparisonTable, BeforeAfterComparison, ConceptCards, DifficultyIndicator, LaunchChecklist, Confetti, SearchBar, BookmarkButton, PersonalNotes, ShareButtons.
4. Reading system: ReadingLayout, useReadingNav, useProgress, OnThisPage, PhaseRail, SectionsSheet, ArticleSection, PhaseSection, ReadingHeader, FactsPanel, ResumeNotice, NextUp, ContextualNav.
5. Codemods over the 13 content files and diagrams; build gate after each step.
6. Home sections and `page.tsx`.
7. Projects: data additions, `/projects` index, detail page shell.
8. Fundamentals: data cleanup, index, guide page shell.
9. Contact and 404.
10. SEO: metadata, OG image, JSON-LD, sitemap, robots, cache headers.
11. Remove the alias layer and dead files; preflight, contrast, screenshots, lab run; deploy by merging to `main`.
