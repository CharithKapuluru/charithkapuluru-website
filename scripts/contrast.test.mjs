import { test } from "node:test";
import assert from "node:assert/strict";
import { contrast, compositeOver, evaluatePairs, PAIRS, checkPairs } from "./contrast.mjs";

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

test("every pair is evaluated in both themes, none skipped", () => {
  assert.equal(evaluatePairs().length, PAIRS.length * 2);
});

test("translucent tints are flattened onto the backdrop before measuring", () => {
  assert.deepEqual(compositeOver("rgb(255 255 255 / 0.5)", "#000000"), [127.5, 127.5, 127.5]);
  assert.deepEqual(compositeOver("#336699", "#ffffff"), [51, 102, 153]);
  const tint = evaluatePairs().find((r) => r.theme === "dark" && r.bg === "accent-soft");
  assert.ok(tint && tint.backdrop, "the dark accent-soft tint should be composited over a backdrop");
});

test("body text is checked on the four callout tints", () => {
  const names = PAIRS.map((p) => `${p.fg}/${p.bg}`);
  for (const tint of ["tip-soft", "info-soft", "success-soft", "danger-soft"]) {
    for (const text of ["fg", "fg-2"]) assert.ok(names.includes(`${text}/${tint}`), `missing pair ${text}/${tint}`);
  }
});

test("the pair table covers the accent and all three text levels on both surfaces", () => {
  const names = PAIRS.map((p) => `${p.fg}/${p.bg}`);
  for (const needed of ["fg/bg", "fg-2/bg", "fg-3/bg", "accent/bg", "fg/surface", "fg-3/surface", "fg-3/surface-2", "accent/accent-soft", "primary-fg/primary"]) {
    assert.ok(names.includes(needed), `missing pair ${needed}`);
  }
});
