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
  assert.equal(paletteReplacement("border", "amber", 200), "tip/30");
});

test("palette classes rewrite in place, dropping a computed opacity when one already exists", () => {
  assert.equal(
    mapPaletteClasses('className="bg-amber-50 text-amber-700 border-amber-200/60 text-gray-400/50 hover:bg-purple-700"'),
    'className="bg-tip-soft text-tip border-tip/60 text-terminal-fg/70 hover:bg-accent"',
  );
});

test("pale borders and rings soften to 30% unless the source class carries its own opacity", () => {
  assert.equal(
    mapPaletteClasses('className="border-amber-200 ring-blue-100 divide-gray-200 border-amber-200/60 border-purple-300"'),
    'className="border-tip/30 ring-info/30 divide-border border-tip/60 border-accent"',
  );
});

test("emoji are stripped from text but check marks stay, and icon props map to registry names", () => {
  assert.equal(stripEmoji("<h3>🏠 Home directory</h3>"), "<h3>Home directory</h3>");
  assert.equal(stripEmoji("<span>✓ Tests</span>"), "<span>✓ Tests</span>");
  assert.equal(stripEmoji('{ icon: "🐳", title: "Docker" }'), '{ icon: "package", title: "Docker" }');
  assert.equal(stripEmoji('{ icon: "🪟", title: "Windows" }'), '{ icon: "app-window", title: "Windows" }');
  assert.equal(stripEmoji('{ icon: "🫠", title: "Unknown" }'), '{ icon: "info", title: "Unknown" }');
  assert.equal(stripEmoji('{ icon: "⏰", title: "Cron" }'), '{ icon: "clock", title: "Cron" }');
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
