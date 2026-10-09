export interface ContactValues {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export const MESSAGE_MAX = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(v: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!v.name.trim()) errors.name = "Enter your name.";
  if (!v.email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = "Enter a valid email address.";
  if (!v.message.trim()) errors.message = "Write a message.";
  else if (v.message.length > MESSAGE_MAX) errors.message = `Keep the message to ${MESSAGE_MAX} characters or fewer.`;
  return errors;
}

export function isValid(errors: ContactErrors): boolean {
  return Object.keys(errors).length === 0;
}
