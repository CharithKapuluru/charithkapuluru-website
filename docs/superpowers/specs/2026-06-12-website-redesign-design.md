# Website Redesign: "Charith's World"

**Date:** 2026-06-12
**Status:** Approved direction, pending final user review
**Mode:** Full redesign (overhaul) following the taste-skill (`design-taste-frontend`) and redesign-skill rules, adopted fully.

## 1. Goal

Rebuild charithkapuluru.com as a fully immersive, playful, illustrated "world" where a
cartoon avatar of Charith guides visitors. Visitors should feel special and entertained
(full-goofy humor level) while the technical content (project tutorials, Fundamentals
articles) stays clean and readable. Audience: recruiters, hiring managers, and learners.

### Decisions log (user-approved)
| Decision | Choice |
| --- | --- |
| Skill adoption | Full (new visual identity, not a polish pass) |
| Avatar form | Cartoon illustrated character (user-generated art, done: 14/15 assets in `avatar-art/`) |
| Color mood | Daylight & friendly (sky blue, grass green, sun yellow) |
| Humor level | Full goofy (jokes, easter eggs, silly reactions) |
| Scope | Approach 2: fully immersive world across ALL pages |
| 3D | No Three.js. 2D layered parallax (lighter, fits illustration style) |
| Animation | GSAP + ScrollTrigger for scroll/scenes, Motion (framer-motion) for UI physics |

## 2. The World (information architecture)

One continuous illustrated daylight world. Every route is a "place." All existing URLs
and slugs are preserved exactly (SEO, bookmarks).

| Route | Place | Scene asset | Description |
| --- | --- | --- | --- |
| `/` | The Hill | `scene-hill.png` | Avatar under the tree with laptop, waves at visitors. Hero + doorways to other places. |
| `/projects/[slug]` | The Workshop | `scene-workshop.png` | Projects are contraptions Charith built. Scene frames the header; tutorial content on paper panels. |
| `/fundamentals` | The Library | `scene-library.png` | 10 articles as books on illustrated shelves. |
| `/fundamentals/[slug]` | Library reading desk | `scene-library.png` (header) | Article on clean white paper panel; avatar comments in margin. |
| `/contact` | The Mailbox | `scene-mailbox.png` | Contact form styled as a postcard; submit = avatar runs the envelope to the mailbox. |
| `/404` | The Woods | `scene-woods.png` | Avatar lost with upside-down map; signpost art already includes the joke. |

**Transitions:** cloud-sweep page transition between places (client-side transition
layer; clouds wipe across, new scene revealed). Honors reduced motion (instant swap).

## 3. The Avatar System

### Rig
- Layered sprite: full-body pose PNGs + separate head sprite (`head.png`) for the
  cursor-tracking widget.
- Head tilts/rotates toward cursor via Motion `useMotionValue`/`useTransform` with
  spring physics (never `useState` per-frame, never `window.addEventListener("scroll")`).
- Fast cursor movement triggers a "double-take" wobble.
- Mobile: no cursor, so avatar reacts to taps and device tilt (gyroscope, permission-gated
  on iOS); falls back to idle animations.

### Pose inventory (assets in `avatar-art/`, backgrounds to be removed in build)
`master` (reference), `wave`, `laptop`, `peek`, `point`, `read`, `bored`, `lost`, `head`.
Missing: `celebrate` (use `wave` as stand-in until generated).

### Reaction map (full goofy)
| Trigger | Reaction |
| --- | --- |
| Land on Hill | Wave + bubble "oh hey, you found me" |
| Hover project card | `peek` lean toward the card |
| Hover Resume button | Straightens tie (CSS micro-animation on `master`) |
| Idle 30s | `bored` pose, taps foot |
| Enter Library | `read` pose, glasses on |
| Submit contact form | Avatar runs across screen with envelope to mailbox |
| 404 | `lost` pose + "this is fine" bubble |
| Konami code (up up down down left right left right B A) | Breakdance spin (CSS transform sequence) |
| Click avatar 5x | Bubble: "ok ok stop poking me" |

### Speech bubbles
All goofy copy lives in bubbles (component with collision-safe positioning). Content
panels stay professional. Bubble copy follows taste-skill content rules: no em-dashes,
no AI cliche verbs, sentence case.

### Sound
Tiny cartoon boops + "wheee" on envelope run. **Muted by default**, obvious toggle in
nav. Persisted in `localStorage`.

## 4. Design System

### Palette (Daylight, locked per taste-skill Color Consistency Lock)
- Sky: `#BFDBFE` to `#DBEAFE` gradients
- Grass: `#BBF7D0` / `#86EFAC`
- Sun/primary accent: `#FDE047` family, with **one** interactive accent: deep ink
  `#0F172A` for buttons/links on light surfaces
- Paper surfaces: `#FFFFFF` with soft tinted shadows (slate-tinted, never pure black)
- Text: `#0F172A` headings, `#475569` body secondary
- No cream/beige family, no Fraunces, no purple gradients (banned AI tells)

### Typography
- Display: **Fredoka** (rounded, chunky, playful, fits cartoon world)
- Body: **Nunito** (rounded sans, readable at length)
- Code: **JetBrains Mono** (kept; already in use for terminal blocks)
- All via `next/font`. Negative tracking on display sizes, `max-w-[65ch]` body,
  `text-wrap: balance` headlines.

### Components
- Corner radius system: soft (16px cards / 12px inputs / full-pill buttons) applied
  consistently (Shape Consistency Lock).
- Icons: **Phosphor** (`@phosphor-icons/react`), replacing Lucide and all emoji icons.
- Buttons: tactile (`active:scale-[0.98]`), one primary intent label per page.
- Existing rich UI components (Quiz, Flashcards, Terminal, CodeBlock, etc.) are
  restyled to the new system, not rewritten.

## 5. Page Designs

### The Hill (homepage)
- Full-viewport (`min-h-[100dvh]`) layered parallax scene: sky, clouds (drifting),
  sun, city skyline, grass, tree. Avatar sits with laptop, waves on load.
- Headline: "Hi, I'm Charith. I build cloud things." + one-line sub + single CTA
  ("See my work"). Hero stack discipline: max 4 text elements.
- Below: paths/doorways to Workshop, Library, Mailbox as illustrated cards (asymmetric
  layout, not 3 equal columns), with avatar `point` pose introducing them.
- Quick "about me" strip: real photo (`Mypic.PNG`) framed as a polaroid next to
  cartoon avatar pointing at it, bubble: "that's the real me, allegedly". Resume button.
- Footer: minimal, in-world (grass strip), GitHub/LinkedIn/email links.

### The Workshop (projects)
- Workshop scene header. Three project "contraptions" with brass nameplate cards.
- Project detail pages: scene frames top; existing tutorial content (DevSecOps 1.4k
  lines, Terraform 1.3k, LinuxSysAdmin 2.8k) on white paper panels with the new design
  system. Phase timeline/sidebar restyled. Avatar appears at phase completions
  (celebration) and occasionally in margins.
- Existing `window.addEventListener("scroll")` scroll-spy logic replaced with
  IntersectionObserver / Motion `useScroll`.

### The Library (fundamentals)
- Shelf scene; 10 articles as book spines (color-coded by category) pulled from
  `fundamentalsData.ts`. Hover: book slides out.
- Article pages: reading-desk header, content on paper panel, avatar `read` pose in
  margin with per-article one-liner comments. Existing article components preserved.

### The Mailbox (contact)
- Form as postcard (rotated slightly, stamp graphic). Fields: name, email, message
  (+ keep `projectType`). Firestore submission flow unchanged. Inline validation,
  inline error states (no `window.alert`).
- Success: envelope-run animation + confetti.

### The Woods (404)
- `scene-woods.png` full-bleed, avatar `lost`, button "Take me back" (to Hill).

## 6. Technical Architecture

### Stack (unchanged core)
- Next.js 16 App Router, `output: "export"` static export, Firebase Hosting deploy via
  existing GitHub Actions workflow. Firebase Auth/Firestore features preserved.

### New dependencies
- `gsap` (ScrollTrigger) for scroll-driven scenes and pinned sections
- `@phosphor-icons/react` icon family
- Build-time only: background removal for avatar PNGs (rembg or manual chroma removal,
  one-time script), `sharp` for WebP conversion + responsive sizes

### Asset pipeline
- `avatar-art/*.png` processed to `public/world/` as WebP: poses ~400-600px wide
  (transparent), scenes 1920w + 1280w + 768w variants. Total budget: < 1.5 MB initial
  load on homepage; scenes lazy-loaded per route.

### Component structure (new)
```
src/components/world/
  WorldProvider.tsx      // sound prefs, reduced-motion, avatar state context
  Avatar.tsx             // pose renderer + head-tracking rig (client leaf)
  SpeechBubble.tsx
  CloudTransition.tsx    // route transition layer
  scenes/HillScene.tsx, WorkshopScene.tsx, LibraryScene.tsx,
         MailboxScene.tsx, WoodsScene.tsx
  PaperPanel.tsx         // readable content surface
```
- GSAP isolated in client leaf components with `useEffect` cleanup (`ctx.revert()`).
- Motion and GSAP never mixed in the same component tree.

### Performance & accessibility guardrails
- `prefers-reduced-motion`: all world motion collapses to static; transitions become
  instant; avatar shows static pose.
- LCP < 2.5s: hero scene image priority-loaded; INP < 200ms; CLS < 0.1 (reserved
  space for all art).
- WCAG AA contrast for all text on scene backgrounds (text sits on paper panels or
  scrims, never raw on busy art).
- Focus states, keyboard nav, alt text on all images. Skip-to-content link.
- Lighthouse run before launch.

## 7. What Is Preserved (never changes silently)
- All URL slugs and routes; nav labels (Projects, Fundamentals, Contact)
- All tutorial/article content and interactive learning components
- Firebase: contact form Firestore flow, auth, user notes/bookmarks/progress
- Resume download (`ck.pdf`)
- Metadata/SEO titles and descriptions (updated copy only where voice changes)

## 8. Out of Scope / Future
- `celebrate.png` pose (user to generate later; `wave` stands in)
- Day/night toggle (option C, deferred; world is daylight-only at launch)
- Mini-game easter egg (idea parked; Konami breakdance ships instead)
- Dark mode: deferred with the day/night toggle. The taste-skill prefers dual-mode,
  but the illustrated daylight world is a single deliberate theme (Page Theme Lock);
  night mode arrives with the toggle later.

## 9. Pre-build housekeeping
1. Commit existing uncommitted work first as a baseline (LinuxSysAdminProject,
   contact page, projectsData changes) so the redesign diff is clean.
2. Keep `basics.docx` and `avatar-art/` out of the deployed site; `avatar-art/`
   source PNGs stay in repo, processed copies go to `public/world/`.
3. Old `Charith_Kapuluru_Resume.pdf` in `public/` removed (superseded by `ck.pdf`).

## 10. Build order (high level, detailed plan to follow)
1. Asset pipeline (background removal, WebP, `public/world/`)
2. Design tokens + fonts + global styles (new palette, Fredoka/Nunito)
3. World core: WorldProvider, Avatar rig, SpeechBubble, PaperPanel
4. The Hill (homepage) end to end
5. CloudTransition + nav
6. The Library (index + article restyle)
7. The Workshop (index + 3 project pages restyle)
8. The Mailbox + The Woods (404)
9. Easter eggs, sounds, idle behaviors
10. Pre-flight check (taste-skill Section 14), Lighthouse, both-OS mobile pass, deploy
