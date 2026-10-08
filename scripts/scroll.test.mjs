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
