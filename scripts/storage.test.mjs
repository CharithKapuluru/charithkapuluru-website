import { test } from "node:test";
import assert from "node:assert/strict";
import { safeParse, readJson } from "../src/lib/storage.ts";

test("safeParse returns the fallback for malformed, empty, null and 'null' input", () => {
  assert.deepEqual(safeParse("{not json", []), []);
  assert.deepEqual(safeParse("", { a: 1 }), { a: 1 });
  assert.deepEqual(safeParse(null, 0), 0);
  assert.deepEqual(safeParse("null", "x"), "x");
});

test("safeParse returns parsed values", () => {
  assert.deepEqual(safeParse('{"phase":2,"scroll":900}', null), { phase: 2, scroll: 900 });
});

test("readJson falls back when localStorage does not exist (node, private mode)", () => {
  assert.deepEqual(readJson("anything", ["fallback"]), ["fallback"]);
});
