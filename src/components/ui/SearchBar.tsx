"use client";

import { useState, useEffect, useRef } from "react";

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

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const matches: SearchResult[] = [];

    searchableContent.forEach((item) => {
      // Check keywords
      const keywordMatch = item.keywords.some((kw) =>
        kw.includes(searchTerm) || searchTerm.includes(kw)
      );

      // Check content
      const contentMatch = item.content.toLowerCase().includes(searchTerm);

      if (keywordMatch || contentMatch) {
        // Find context around the match
        const contentLower = item.content.toLowerCase();
        const matchIndex = contentLower.indexOf(searchTerm);
        let context = "";

        if (matchIndex !== -1) {
          const start = Math.max(0, matchIndex - 30);
          const end = Math.min(item.content.length, matchIndex + searchTerm.length + 50);
          context = (start > 0 ? "..." : "") + item.content.slice(start, end) + (end < item.content.length ? "..." : "");
        } else {
          context = item.content.slice(0, 80) + "...";
        }

        matches.push({
          phaseId: item.phaseId,
          phaseName: item.phaseName,
          matchText: keywordMatch ? item.keywords.find((kw) => kw.includes(searchTerm) || searchTerm.includes(kw)) || searchTerm : searchTerm,
          context,
        });
      }
    });

    setResults(matches);
  }, [query]);

  const handleResultClick = (phaseId: number) => {
    const phaseElement = document.querySelector(`[data-phase="${phaseId}"]`);
    if (phaseElement) {
      phaseElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      {/* Search trigger button - hidden, use keyboard shortcut ⌘K */}
      <div className="hidden" />

      {/* Search modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Search panel */}
          <div className="relative w-full max-w-xl bg-bg-paper rounded-lg shadow-2xl overflow-hidden">
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-text-charcoal/10">
              <svg className="w-5 h-5 text-text-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search phases, concepts, tools..."
                className="flex-1 bg-transparent text-text-charcoal placeholder-text-olive outline-none"
              />
              <kbd className="px-2 py-1 text-xs text-text-olive bg-bg-cream rounded border border-text-charcoal/10">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {query.length < 2 ? (
                <div className="p-4 text-center text-text-olive text-sm">
                  Type at least 2 characters to search...
                </div>
              ) : results.length === 0 ? (
                <div className="p-4 text-center text-text-olive text-sm">
                  No results found for &quot;{query}&quot;
                </div>
              ) : (
                <div className="py-2">
                  {results.map((result) => (
                    <button
                      key={result.phaseId}
                      onClick={() => handleResultClick(result.phaseId)}
                      className="w-full px-4 py-3 text-left hover:bg-bg-cream transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-accent-moss bg-accent-moss/10 px-2 py-0.5 rounded">
                          Phase {result.phaseId}
                        </span>
                        <span className="text-sm font-medium text-text-charcoal">
                          {result.phaseName}
                        </span>
                      </div>
                      <p className="text-xs text-text-olive line-clamp-2">
                        {result.context}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-text-charcoal/10 bg-bg-cream/50 flex items-center justify-between text-xs text-text-olive">
              <span>{results.length} result{results.length !== 1 ? "s" : ""}</span>
              <div className="flex items-center gap-2">
                <span>↵ to select</span>
                <span>ESC to close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
