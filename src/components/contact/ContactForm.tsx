"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Button from "@/components/ui/Button";
import Avatar from "@/components/brand/Avatar";
import { validateContact, isValid, MESSAGE_MAX, type ContactErrors, type ContactValues } from "@/lib/contact-validation";
import { cn } from "@/lib/utils";

const TOPICS = ["Just saying hi", "A job opportunity", "A project or collaboration", "Something else"];
const EMPTY: ContactValues = { name: "", email: "", projectType: TOPICS[0], message: "" };

const inputClass = "w-full rounded-md border border-border bg-bg px-3.5 py-2.5 text-body text-fg outline-none placeholder:text-fg-3 focus:border-accent";

export default function ContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sentTo, setSentTo] = useState("");

  const set = (field: keyof ContactValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = { ...values, [field]: e.target.value };
    setValues(next);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: validateContact(next)[field] }));
  };

  const validateField = (field: keyof ContactValues) => () => setErrors((prev) => ({ ...prev, [field]: validateContact(values)[field] }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    if (!isValid(nextErrors)) {
      const first = (["name", "email", "message"] as const).find((k) => nextErrors[k]);
      if (first) requestAnimationFrame(() => document.getElementById(first)?.focus());
      return;
    }
    setStatus("sending");
    try {
      await addDoc(collection(db, "contacts"), { ...values, createdAt: serverTimestamp(), read: false });
      setSentTo(values.email);
      setStatus("sent");
      setValues(EMPTY);
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    }
  };

  const announce = (
    <span className="sr-only" aria-live="polite">
      {status === "sent" ? `Message sent. I'll reply to ${sentTo} soon.` : ""}
    </span>
  );

  if (status === "sent") {
    return (
      <>
        {announce}
        <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-surface p-8 text-center">
          <Avatar pose="wave" width={140} pokeable={false} />
          <p className="text-h3 font-display text-fg">Message sent.</p>
          <p className="text-body text-fg-2">I&apos;ll reply to {sentTo} soon.</p>
        </div>
      </>
    );
  }

  const field = (name: keyof ContactValues, label: string, control: React.ReactNode) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-small font-medium text-fg">
        {label}
      </label>
      {control}
      {errors[name] && (
        <p id={`${name}-error`} className="text-caption text-danger">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <>
    {announce}
    <form onSubmit={submit} noValidate className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6 md:p-8">
      <div className="grid gap-5 lg:grid-cols-2">
        {field("name", "Name", <input id="name" name="name" type="text" required autoComplete="name" value={values.name} onChange={set("name")} onBlur={validateField("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} className={cn(inputClass, errors.name && "border-danger")} />)}
        {field("email", "Email", <input id="email" name="email" type="email" required autoComplete="email" value={values.email} onChange={set("email")} onBlur={validateField("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className={cn(inputClass, errors.email && "border-danger")} />)}
      </div>
      {field(
        "projectType",
        "This is about",
        <select id="projectType" name="projectType" value={values.projectType} onChange={set("projectType")} className={inputClass}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>,
      )}
      {field(
        "message",
        "Message",
        <textarea id="message" name="message" required rows={5} maxLength={MESSAGE_MAX} value={values.message} onChange={set("message")} onBlur={validateField("message")} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} className={cn(inputClass, "resize-y", errors.message && "border-danger")} />,
      )}
      {status === "error" && (
        <p role="alert" className="rounded-md border border-danger/40 bg-danger-soft px-3.5 py-2.5 text-small text-fg">
          Sending failed. Try again or email me directly.
        </p>
      )}
      <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto sm:self-start">
        {status === "sending" ? "Sending" : "Send message"}
      </Button>
    </form>
    </>
  );
}
