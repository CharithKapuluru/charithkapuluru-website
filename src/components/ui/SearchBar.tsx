"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import Button from "./Button";
import Tag from "./Tag";
import { prefersReducedMotion, scrollBehavior } from "@/lib/scroll";

interface SearchResult {
  phaseId: number;
  phaseName: string;
  matchText: string;
  context: string;
}

// Content index for searching - based on Project.docx content
const searchableContent = [
  {
    phaseId: 0,
    phaseName: "Phase 0: Repository Setup",
    keywords: ["git", "github", "repository", "project structure", "folder", "commit", "gitignore", "readme", "version control", "branch", "main"],
    content: "Phase 0 is about setting up the foundation of your project before writing any code. We create the project folder structure, set up version control with Git, and connect it to GitHub. Git is a time machine for your code. GitHub is like Google Drive for code."
  },
  {
    phaseId: 1,
    phaseName: "Phase 1: FastAPI MVP",
    keywords: ["fastapi", "api", "rest", "endpoint", "pydantic", "validation", "logging", "error handling", "python", "uvicorn"],
    content: "Phase 1 is where we actually start coding! We build a working REST API using FastAPI - a modern Python web framework. FastAPI is a Python framework that developers use to build an API that follows REST principles."
  },
  {
    phaseId: 2,
    phaseName: "Phase 2: Automated Tests",
    keywords: ["pytest", "testing", "test", "automated", "unit test", "assert", "fixture"],
    content: "Phase 2 adds automated testing to your API. Pytest is Python's most popular testing framework. No tests = No job offer. Every professional software team requires tests before merging code."
  },
  {
    phaseId: 3,
    phaseName: "Phase 3: Linting & Formatting",
    keywords: ["ruff", "linting", "formatting", "code quality", "style", "flake8", "black"],
    content: "Phase 3 adds automatic code quality checks. Ruff is a modern Python tool that does BOTH linting and formatting. Linting catches bugs BEFORE you run the code."
  },
  {
    phaseId: 4,
    phaseName: "Phase 4: Docker",
    keywords: ["docker", "container", "image", "dockerfile", "kubernetes", "deployment", "scale"],
    content: "Phase 4 packages your application into a Docker container. A Docker image is a packaged template. A Docker container is a running instance. Kubernetes manages containers at scale."
  },
  {
    phaseId: 5,
    phaseName: "Phase 5: CI/CD",
    keywords: ["ci", "cd", "github actions", "pipeline", "continuous integration", "continuous deployment", "automation", "workflow"],
    content: "Phase 5 sets up CI/CD - a system that automatically tests, checks, and builds your code every time you push to GitHub. CI means Continuous Integration. CD means Continuous Deployment."
  },
  {
    phaseId: 6,
    phaseName: "Phase 6: SAST with Semgrep",
    keywords: ["sast", "semgrep", "security", "vulnerability", "scanning", "static analysis"],
    content: "Phase 6 adds security scanning. SAST means Static Application Security Testing. Semgrep scans source code for security vulnerabilities without running the application."
  },
  {
    phaseId: 7,
    phaseName: "Phase 7: Trivy",
    keywords: ["trivy", "container scanning", "cve", "vulnerability", "dependencies", "security"],
    content: "Phase 7 adds container vulnerability scanning with Trivy. It checks your Docker image for known vulnerabilities. CVE means Common Vulnerabilities and Exposures."
  },
];

export default function SearchBar({ trigger = false }: { trigger?: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const open = () => {
    dialogRef.current?.showModal();
    requestAnimationFrame(() => inputRef.current?.focus());
  };
  const close = () => {
    dialogRef.current?.close();
    setQuery("");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        const el = dialogRef.current;
        if (!el || (!el.open && !(el.parentElement?.checkVisibility?.() ?? true))) return;
        e.preventDefault();
        if (el.open) close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    if (query.length < 2) {
      return [];
    }
    const term = query.toLowerCase();
    const matches: SearchResult[] = [];
    for (const item of searchableContent) {
      const keyword = item.keywords.find((kw) => kw.includes(term) || term.includes(kw));
      const contentIndex = item.content.toLowerCase().indexOf(term);
      if (!keyword && contentIndex === -1) continue;
      let context = item.content.slice(0, 80) + "...";
      if (contentIndex !== -1) {
        const start = Math.max(0, contentIndex - 30);
        const end = Math.min(item.content.length, contentIndex + term.length + 50);
        context = (start > 0 ? "..." : "") + item.content.slice(start, end) + (end < item.content.length ? "..." : "");
      }
      matches.push({ phaseId: item.phaseId, phaseName: item.phaseName, matchText: keyword ?? term, context });
    }
    return matches;
  }, [query]);

  const go = (phaseId: number) => {
    close();
    document.querySelector(`[data-phase="${phaseId}"]`)?.scrollIntoView({ behavior: scrollBehavior(prefersReducedMotion()), block: "start" });
  };

  return (
    <>
      {trigger && (
        <Button variant="secondary" size="sm" onClick={open} aria-haspopup="dialog">
          <MagnifyingGlass size={16} weight="regular" aria-hidden />
          Search
          <kbd className="ml-1 rounded-sm border border-border bg-surface-2 px-1.5 font-mono text-[11px] text-fg-3">⌘K</kbd>
        </Button>
      )}
      <dialog
        ref={dialogRef}
        aria-label="Search this project"
        className="m-auto mt-[10vh] w-[calc(100%-2rem)] max-w-xl rounded-lg border border-border bg-surface p-0 text-fg shadow-float"
        onClick={(e) => e.target === dialogRef.current && close()}
        onClose={() => setQuery("")}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <MagnifyingGlass size={18} weight="regular" aria-hidden className="text-fg-3" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phases, concepts, tools"
            aria-label="Search"
            className="flex-1 bg-transparent text-body text-fg outline-none placeholder:text-fg-3"
          />
          <kbd className="rounded-sm border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-fg-3">Esc</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {query.length < 2 ? (
            <p className="p-4 text-center text-small text-fg-3">Type at least two characters.</p>
          ) : results.length === 0 ? (
            <p className="p-4 text-center text-small text-fg-3">No results for &ldquo;{query}&rdquo;.</p>
          ) : (
            <ul className="py-2">
              {results.map((r) => (
                <li key={r.phaseId}>
                  <button type="button" onClick={() => go(r.phaseId)} className="w-full px-4 py-3 text-left hover:bg-surface-2">
                    <span className="flex items-center gap-2">
                      <Tag>Phase {r.phaseId}</Tag>
                      <span className="text-small font-medium text-fg">{r.phaseName}</span>
                    </span>
                    <span className="mt-1 line-clamp-2 text-caption text-fg-3">{r.context}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border bg-surface-2 px-4 py-2 text-caption text-fg-3">
          <span>
            {results.length} result{results.length !== 1 ? "s" : ""}
          </span>
          <span>Esc to close</span>
        </div>
      </dialog>
    </>
  );
}
