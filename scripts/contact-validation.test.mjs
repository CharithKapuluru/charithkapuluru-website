import { test } from "node:test";
import assert from "node:assert/strict";
import { validateContact, isValid, MESSAGE_MAX } from "../src/lib/contact-validation.ts";

const good = { name: "Priya", email: "priya@example.com", projectType: "A job opportunity", message: "Hello there" };

test("a complete form is valid", () => {
  assert.equal(isValid(validateContact(good)), true);
});

test("whitespace-only name and message are rejected", () => {
  const errors = validateContact({ ...good, name: "   ", message: "\n\t" });
  assert.equal(errors.name, "Enter your name.");
  assert.equal(errors.message, "Write a message.");
});

test("invalid and missing emails are rejected", () => {
  assert.equal(validateContact({ ...good, email: "not-an-email" }).email, "Enter a valid email address.");
  assert.equal(validateContact({ ...good, email: "" }).email, "Enter your email address.");
});

test("messages over the limit are rejected", () => {
  assert.equal(validateContact({ ...good, message: "x".repeat(MESSAGE_MAX + 1) }).message, `Keep the message under ${MESSAGE_MAX} characters.`);
  assert.equal(isValid(validateContact({ ...good, message: "x".repeat(MESSAGE_MAX) })), true);
});
