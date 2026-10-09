import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { cn } from "../src/lib/utils.ts";

test("cn preserves custom text utility classes", () => {
  const result = cn("bg-primary text-primary-fg", "text-small");
  assert(result.includes("bg-primary"), "should preserve bg-primary");
  assert(result.includes("text-primary-fg"), "should preserve text-primary-fg");
  assert(result.includes("text-small"), "should preserve text-small");
});

test("cn resolves real class conflicts correctly", () => {
  const result1 = cn("text-small", "text-body");
  assert.equal(result1, "text-body", "text-body should override text-small");

  const result2 = cn("text-fg", "text-fg-2");
  assert.equal(result2, "text-fg-2", "text-fg-2 should override text-fg");
});

test("cn keeps every --text-* size from globals.css next to a text color", () => {
  const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
  // Size tokens only: `--text-small: 0.875rem;` counts, `--text-small--line-height: 1.5;` does not.
  const names = [...css.matchAll(/--text-([a-z0-9]+(?:-[a-z0-9]+)*):/g)].map((m) => m[1]);
  assert.ok(names.length >= 10, `expected at least 10 --text-* sizes, found ${names.length}`);
  for (const name of names) {
    const result = cn("text-fg", `text-${name}`);
    assert(result.includes("text-fg"), `text-${name} dropped text-fg; add "${name}" to the text list in src/lib/utils.ts`);
    assert(result.includes(`text-${name}`), `text-${name} was dropped; add "${name}" to the text list in src/lib/utils.ts`);
  }
});
