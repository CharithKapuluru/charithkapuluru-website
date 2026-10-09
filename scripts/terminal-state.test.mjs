import { test } from "node:test";
import assert from "node:assert/strict";
import { initialTerminalState } from "../src/lib/terminal-state.ts";

test("terminal shows the full transcript by default", () => {
  assert.deepEqual(initialTerminalState(false, 7), { visibleLines: 7, playing: false, complete: true });
});

test("autoPlay starts from an empty transcript", () => {
  assert.deepEqual(initialTerminalState(true, 7), { visibleLines: 0, playing: true, complete: false });
});

test("an empty line list is complete immediately", () => {
  assert.deepEqual(initialTerminalState(true, 0), { visibleLines: 0, playing: false, complete: true });
});
