import { test } from "node:test";
import assert from "node:assert/strict";
import { RESUME_THRESHOLD, shouldBlockSave } from "../src/lib/resume.ts";

test("with no offer a save is never blocked", () => {
  for (const answered of [false, true]) {
    for (const scrollY of [0, 150, RESUME_THRESHOLD, RESUME_THRESHOLD + 1, 600, 12000]) {
      assert.equal(shouldBlockSave({ offered: false, answered, scrollY }), false, `answered=${answered} scrollY=${scrollY}`);
    }
  }
});

test("an offered, unanswered position blocks the save while the reader is still at the top", () => {
  assert.equal(shouldBlockSave({ offered: true, answered: false, scrollY: 0 }), true);
  assert.equal(shouldBlockSave({ offered: true, answered: false, scrollY: 120 }), true);
  assert.equal(shouldBlockSave({ offered: true, answered: false, scrollY: RESUME_THRESHOLD }), true);
});

test("an offered, unanswered position does not block once the reader has scrolled past the threshold", () => {
  assert.equal(shouldBlockSave({ offered: true, answered: false, scrollY: RESUME_THRESHOLD + 1 }), false);
  assert.equal(shouldBlockSave({ offered: true, answered: false, scrollY: 600 }), false);
  assert.equal(shouldBlockSave({ offered: true, answered: false, scrollY: 12000 }), false);
});

test("once the offer is answered a save is never blocked, wherever the reader is", () => {
  for (const scrollY of [0, 150, RESUME_THRESHOLD, 600]) {
    assert.equal(shouldBlockSave({ offered: true, answered: true, scrollY }), false, `scrollY=${scrollY}`);
  }
});

test("the threshold matches the 200 px the notice has always used", () => {
  assert.equal(RESUME_THRESHOLD, 200);
});
