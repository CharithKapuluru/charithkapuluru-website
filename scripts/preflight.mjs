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
const CONTENT_DIRS = ["src/components/fundamentals", "src/components/projects"];
const DIAGRAMS = new Set(["AnimatedDiagram.tsx", "ArchitectureDiagram.tsx", "LayerDiagram.tsx", "TrafficFlowAnimation.tsx", "TerraformResourceTree.tsx", "ResourceAllocator.tsx", "CIDRCalculator.tsx"]);

// Pictographs and symbols, matching the codemod ranges (U+1F100-1FAFF, U+2600-27BF, U+23E9-23FA, and U+25B6 only as the emoji form).
// U+2713 and U+2717 (check and ballot marks) are plain typography and stay allowed.
const EMOJI = /(?![\u2713\u2717])[\u{1F100}-\u{1FAFF}\u{2600}-\u{27BF}\u{23E9}-\u{23FA}]|\u25B6(?=\uFE0F)/gu;

const shell = SHELL_DIRS.flatMap((d) => walk(d, CODE));
const content = CONTENT_DIRS.flatMap((d) => walk(d, CODE));
const all = walk("src", CODE);
const base = (f) => f.split("/").pop();
const count = (files, re) => files.reduce((n, f) => n + (readFileSync(f, "utf8").match(re) || []).length, 0);

const checks = [
  { name: "em or en dashes in shell code", value: count(shell, /[\u2013\u2014]/g), max: 0 },
  { name: "emoji in shell code", value: count(shell, EMOJI), max: 0 },
  { name: "inline <svg outside diagram components", value: count(shell.filter((f) => !DIAGRAMS.has(base(f))), /<svg/g), max: 0 },
  { name: "inline <svg in content components", value: count(content.filter((f) => !DIAGRAMS.has(base(f))), /<svg/g), max: 0 },
  { name: "hardcoded palette classes in src", value: count(all, /\b(bg|text|border|from|via|to|ring|fill|stroke)-(amber|blue|emerald|green|red|orange|purple|violet|pink|rose|sky|indigo|yellow|teal|cyan|lime|gray|slate|zinc|neutral|stone)-\d{2,3}\b/g), max: 0 },
  { name: "old alias tokens in src", value: count(all, /\b(bg-paper|bg-cream|bg-stone|text-charcoal|text-taupe|text-olive|accent-moss|accent-terracotta|accent-sand|accent-sage|font-serif)\b/g), max: 0 },
  { name: "uppercase-tracking eyebrows in home components", value: count(walk("src/components/home", CODE), /uppercase tracking/g), max: 2 },
  { name: "h-screen", value: count(all, /\bh-screen\b/g), max: 0 },
  { name: "scroll listeners", value: count(all, /addEventListener\(\s*["']scroll["']/g), max: 0 },
  { name: "setInterval (AnimatedDiagram step player excepted)", value: count(all.filter((f) => base(f) !== "AnimatedDiagram.tsx"), /\bsetInterval\(/g), max: 0 },
  { name: "window.alert (bash `alert() {` in code samples excepted)", value: count(all, /(?<![\w$.])(?:(?:window|globalThis)\.)?alert\((?!\s*\)\s*\{)/g), max: 0 },
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
  console.log(`ok   ${pages.length} rendered pages checked for a single <h1>`);

  // Server-rendered markup must be visible without JavaScript: no framer entrance may leave inline `opacity:0` in any page, the 404 included.
  const rendered = walk("out", /(?:^|\/)(?:index|404)\.html$/);
  const hidden = rendered.filter((f) => /style="(?:[^"]*;)?\s*opacity:\s*0\s*(?:;|")/.test(readFileSync(f, "utf8")));
  for (const f of hidden) {
    console.log(`FAIL ${f}: inline style opacity:0 in the rendered HTML`);
    failures.push(f);
  }
  console.log(`${hidden.length ? "FAIL" : "ok  "} ${hidden.length} of ${rendered.length} rendered pages contain inline opacity:0`);

  const home = readFileSync("out/index.html", "utf8");
  for (const needle of ['id="projects"', 'id="workshop"', 'id="main"', 'application/ld+json']) {
    if (!home.includes(needle)) {
      console.log(`FAIL out/index.html missing ${needle}`);
      failures.push(needle);
    }
  }
} else {
  console.log("skip rendered-page checks (no out/ folder; run the build first)");
}

if (failures.length && strict) {
  console.error(`\n${failures.length} pre-flight check(s) failed`);
  process.exit(1);
}
console.log(failures.length ? `\n${failures.length} failure(s)` : "\nPre-flight clean.");
