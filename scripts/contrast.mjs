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
  { fg: "success", bg: "surface", min: 4.5 },
  { fg: "danger", bg: "surface", min: 4.5 },
  { fg: "success", bg: "success-soft", min: 3 },
  { fg: "danger", bg: "danger-soft", min: 3 },
  { fg: "info", bg: "info-soft", min: 3 },
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
