import { test } from "node:test";
import assert from "node:assert/strict";
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
