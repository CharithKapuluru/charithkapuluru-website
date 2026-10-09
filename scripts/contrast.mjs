#!/usr/bin/env node
// WCAG 2.x contrast check over the design tokens in src/app/globals.css.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

function readBlock(selector) {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`contrast: the ${selector} token block is missing from globals.css`);
  const end = css.indexOf("\n}", start);
  if (end === -1) throw new Error(`contrast: the ${selector} token block in globals.css is not closed`);
  const vars = {};
  for (const m of css.slice(start, end).matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
  if (Object.keys(vars).length === 0) throw new Error(`contrast: the ${selector} token block in globals.css declares no variables`);
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
  // Body text on the four callout tints
  { fg: "fg", bg: "tip-soft", min: 4.5 },
  { fg: "fg-2", bg: "tip-soft", min: 4.5 },
  { fg: "fg", bg: "info-soft", min: 4.5 },
  { fg: "fg-2", bg: "info-soft", min: 4.5 },
  { fg: "fg", bg: "success-soft", min: 4.5 },
  { fg: "fg-2", bg: "success-soft", min: 4.5 },
  { fg: "fg", bg: "danger-soft", min: 4.5 },
  { fg: "fg-2", bg: "danger-soft", min: 4.5 },
];

/** Tints can sit on the page or on a card, so a translucent background is checked over both and the worse result counts. */
const BACKDROPS = ["bg", "surface"];

/** Parses "#rgb", "#rrggbb", "rgb(r g b)", "rgb(r g b / a)" and "rgba(r, g, b, a)" into [r, g, b, alpha]. */
export function parseColor(value) {
  const v = String(value).trim();
  if (v.startsWith("#")) {
    const h = v.slice(1);
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`contrast: cannot parse color ${value}`);
    const n = parseInt(full, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  const m = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[/,]\s*([\d.]+)(%?))?\s*\)$/i);
  if (!m) throw new Error(`contrast: cannot parse color ${value}`);
  const alpha = m[4] === undefined ? 1 : m[5] ? Number(m[4]) / 100 : Number(m[4]);
  return [Number(m[1]), Number(m[2]), Number(m[3]), alpha];
}

/** Flattens a possibly translucent color onto an opaque backdrop. */
export function compositeOver(color, backdrop) {
  const [r, g, b, a] = parseColor(color);
  const [br, bgc, bb] = parseColor(backdrop);
  return [r * a + br * (1 - a), g * a + bgc * (1 - a), b * a + bb * (1 - a)];
}

function luminance([r, g, b]) {
  const lin = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function ratio(rgbA, rgbB) {
  const la = luminance(rgbA);
  const lb = luminance(rgbB);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Contrast of two opaque colors, as hex strings or rgb() values. */
export function contrast(a, b) {
  return ratio(parseColor(a).slice(0, 3), parseColor(b).slice(0, 3));
}

function token(vars, theme, name) {
  const value = vars[`--${name}`];
  if (!value) throw new Error(`contrast: --${name} is not defined in the ${theme} token block`);
  return value;
}

/** Every pair in both themes, with tints composited. Throws when a token is missing or the evaluated count is off. */
export function evaluatePairs() {
  const results = [];
  for (const [theme, vars] of Object.entries(THEMES)) {
    for (const p of PAIRS) {
      const fg = token(vars, theme, p.fg);
      const bg = token(vars, theme, p.bg);
      const [, , , bgAlpha] = parseColor(bg);
      const backdrops = bgAlpha < 1 ? BACKDROPS : [null];
      let worst = null;
      for (const backdrop of backdrops) {
        const flatBg = backdrop ? compositeOver(bg, token(vars, theme, backdrop)) : parseColor(bg).slice(0, 3);
        const flatFg = compositeOver(fg, `rgb(${flatBg.join(" ")})`);
        const r = ratio(flatFg, flatBg);
        if (!worst || r < worst.ratio) worst = { theme, fg: p.fg, bg: p.bg, backdrop, ratio: r, min: p.min };
      }
      results.push(worst);
    }
  }
  const expected = PAIRS.length * Object.keys(THEMES).length;
  if (results.length !== expected) throw new Error(`contrast: evaluated ${results.length} pairs, expected ${expected}`);
  return results;
}

export function checkPairs() {
  return evaluatePairs().filter((r) => r.ratio < r.min);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const results = evaluatePairs();
  for (const r of results) {
    const over = r.backdrop ? ` over ${r.backdrop}` : "";
    console.log(`${r.theme.padEnd(5)} ${r.fg.padEnd(10)} on ${(r.bg + over).padEnd(22)} ${r.ratio.toFixed(2)} (min ${r.min})`);
  }
  console.log(`\n${results.length} pairs evaluated (${PAIRS.length} per theme).`);
  const failures = results.filter((r) => r.ratio < r.min);
  if (failures.length) { console.error(`\n${failures.length} pair(s) below the floor`); process.exit(1); }
  console.log("All token pairs pass.");
}
