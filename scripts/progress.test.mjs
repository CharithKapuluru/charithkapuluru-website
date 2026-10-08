import { test } from "node:test";
import assert from "node:assert/strict";
import { completeThrough, toggleIndex, percentComplete } from "../src/lib/progress.ts";

test("scrolling to phase 3 completes phases 0 to 2", () => {
  assert.deepEqual(completeThrough([], 3, 8), [0, 1, 2]);
});

test("reaching the last phase completes it too", () => {
  assert.deepEqual(completeThrough([0, 1], 7, 8), [0, 1, 2, 3, 4, 5, 6, 7]);
});

test("completeThrough keeps earlier manual completions and never duplicates", () => {
  assert.deepEqual(completeThrough([5, 1], 2, 8), [0, 1, 5]);
});

test("toggleIndex adds and removes and stays sorted", () => {
  assert.deepEqual(toggleIndex([0, 2], 1), [0, 1, 2]);
  assert.deepEqual(toggleIndex([0, 1, 2], 1), [0, 2]);
});

test("percentComplete rounds and handles zero", () => {
  assert.equal(percentComplete([0, 1, 2], 8), 38);
  assert.equal(percentComplete([], 0), 0);
});
