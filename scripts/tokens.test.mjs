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
