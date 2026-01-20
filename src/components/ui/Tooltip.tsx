"use client";

import { useState, useRef, useEffect } from "react";

interface TooltipProps {
  term: string;
  definition: string;
  children?: React.ReactNode;
}

const Tooltip = ({ term, definition, children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;

      if (spaceAbove < 150 && spaceBelow > spaceAbove) {
        setPosition("bottom");
      } else {
        setPosition("top");
      }
    }
  }, [isVisible]);

  return (
    <span className="relative inline-block">
      <span
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="border-b border-dashed border-accent-moss text-accent-moss cursor-help hover:text-accent-moss/80 transition-colors"
      >
        {children || term}
      </span>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 w-64 p-3 bg-text-charcoal text-white text-sm rounded-lg shadow-xl transition-opacity duration-200 ${
            position === "top"
              ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
              : "top-full mt-2 left-1/2 -translate-x-1/2"
          }`}
        >
          <div className="font-medium text-accent-sage mb-1">{term}</div>
          <div className="text-gray-300 leading-relaxed">{definition}</div>
          <div
            className={`absolute w-3 h-3 bg-text-charcoal rotate-45 left-1/2 -translate-x-1/2 ${
              position === "top" ? "-bottom-1.5" : "-top-1.5"
            }`}
          />
        </div>
      )}
    </span>
  );
};

// Common technical terms with definitions from Project.docx
export const definitions: Record<string, string> = {
  "REST API":
    "A way for applications to communicate with servers over the internet using standard HTTP methods like GET, POST, PUT, and DELETE.",
  FastAPI:
    "A Python framework that developers use to build an API that follows REST principles.",
  Docker:
    "A platform that packages applications into containers - portable boxes that include the app and everything it needs to run.",
  "Docker Image":
    "A packaged, read-only template containing the application code, runtime, libraries, and instructions on how to start the service.",
  "Docker Container":
    "A running instance of a Docker image, capable of handling real user requests.",
  Kubernetes:
    "A container orchestration platform that manages how containerized applications run at scale across multiple servers.",
  CI:
    "Continuous Integration - automatically tests code when it changes.",
  CD:
    "Continuous Deployment/Delivery - automatically deploys code after it passes tests.",
  SAST:
    "Static Application Security Testing - analyzes source code for security vulnerabilities without running the application.",
  Semgrep:
    "A fast, open-source security scanner that scans code for security vulnerabilities and finds bugs.",
  Trivy:
    "An open-source security scanner that scans Docker images for known vulnerabilities in dependencies.",
  CVE:
    "Common Vulnerabilities and Exposures - a unique ID for each known security vulnerability.",
  Pytest:
    "Python's most popular testing framework - simple, powerful, and industry standard.",
  Ruff:
    "A modern Python tool that does both linting and formatting, written in Rust for speed.",
  Linting:
    "Scanning code to find bugs, bad practices, and style issues before running the code.",
  Formatting:
    "Automatically fixing code style to be consistent - handling spacing, indentation, and quotes.",
  Git:
    "A version control system that tracks every change you make to code, like a time machine.",
  Commit:
    "A snapshot of your project at a specific moment, like taking a photo of your code.",
  GitHub:
    "Cloud storage and collaboration platform for code - your portfolio that recruiters visit.",
  ".gitignore":
    "A file that tells Git which files to NOT track, like a 'Do Not Disturb' sign for certain files.",
  Pydantic:
    "A Python library for data validation using type annotations.",
  Uvicorn:
    "A lightning-fast ASGI server for running FastAPI applications.",
  "GitHub Actions":
    "A built-in automation tool in GitHub that tests, builds, and deploys code automatically.",
};

export default Tooltip;
