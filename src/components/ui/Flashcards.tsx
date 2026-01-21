"use client";

import { useState } from "react";

interface Flashcard {
  id: number;
  front: string;
  back: string;
}

// All content extracted directly from Project.docx
const flashcardsData: Flashcard[] = [
  {
    id: 1,
    front: "What is DevOps?",
    back: "DevOps is a way of working where software developers (Dev) and IT/operations teams (Ops) work together to build, test, release, and run software faster and more reliably through automation, continuous integration, continuous deployment, and shared responsibility.",
  },
  {
    id: 2,
    front: "What is a REST API?",
    back: "A REST API is a way for applications to communicate with servers over the internet using standard HTTP methods. The client sends requests using GET, POST, PUT, DELETE to specific URLs, and the server responds with data in JSON format. REST APIs only transfer data, not user interfaces.",
  },
  {
    id: 3,
    front: "What is FastAPI?",
    back: "FastAPI is a Python framework that developers use to build an API that follows REST principles. It receives requests, interprets the HTTP method and URL, executes backend logic, interacts with databases, and sends responses back in REST-compliant format.",
  },
  {
    id: 4,
    front: "What is a Docker Image?",
    back: "A Docker image is a packaged, read-only template containing the application code, the required Python runtime, all necessary libraries, and instructions on how to start the service. The image itself does not run; it represents the standardized version of the application.",
  },
  {
    id: 5,
    front: "What is a Docker Container?",
    back: "A Docker container is a running instance of a Docker image, capable of handling real user requests. Multiple containers can be created from the same image, each running independently while ensuring consistency, scalability, and reliability.",
  },
  {
    id: 6,
    front: "What is Kubernetes?",
    back: "Kubernetes is a container orchestration platform that manages how containerized applications run at scale across multiple servers. It automatically monitors load, starts additional containers when demand increases, and replaces crashed containers automatically.",
  },
  {
    id: 7,
    front: "What is Git?",
    back: "Git is a time machine for your code. It tracks every change you make, so you can go back to any previous version, see what you changed and when, and collaborate with others without conflicts.",
  },
  {
    id: 8,
    front: "What is a commit?",
    back: "A commit is a snapshot of your project at a specific moment. It's like taking a photo of your code. Good commit messages show communication skills, organized thinking, and professional habits.",
  },
  {
    id: 9,
    front: "What is GitHub?",
    back: "GitHub is like Google Drive for code. It backs up your code in the cloud, makes it accessible from anywhere, showcases your work to recruiters, and enables collaboration. Your GitHub is your portfolio - recruiters visit it more than your resume.",
  },
  {
    id: 10,
    front: "What is .gitignore?",
    back: "A .gitignore file tells Git which files to NOT track. Think of it like a \"Do Not Disturb\" sign for certain files. Recruiters check if you have .gitignore - not having one shows you don't understand security basics.",
  },
  {
    id: 11,
    front: "What is Pytest?",
    back: "Pytest is Python's most popular testing framework. It's simple (write tests as regular functions), powerful (fixtures, parameterization, plugins), and industry standard (used by almost every Python project). No tests = No job offer.",
  },
  {
    id: 12,
    front: "What is Linting?",
    back: "A linter scans your code and says: \"Hey, this might be a bug!\" or \"This is bad practice!\" It catches unused variables, undefined variables, unused imports, and wrong comparisons. Linting finds bugs BEFORE you run the code.",
  },
  {
    id: 13,
    front: "What is Code Formatting?",
    back: "A formatter automatically fixes your code style to be consistent. It handles spacing, indentation, and quotes. Formatting makes code consistent without changing what it does.",
  },
  {
    id: 14,
    front: "What is Ruff?",
    back: "Ruff is a modern Python tool that does BOTH linting and formatting. It's fast (written in Rust, 10-100x faster than older tools), all-in-one (replaces flake8, isort, black, pyupgrade), and the new standard in Python community.",
  },
  {
    id: 15,
    front: "What is CI/CD?",
    back: "CI (Continuous Integration) automatically tests code when it changes. CD (Continuous Deployment/Delivery) automatically deploys code after it passes tests. GitHub Actions does both - everything is automatic, same steps every time, faster releases, fewer bugs.",
  },
  {
    id: 16,
    front: "What is GitHub Actions?",
    back: "GitHub Actions is a built-in automation tool in GitHub that lets you automatically test, build, and deploy your code whenever something happens in your repository - like pushing code, opening a pull request, merging code, or releasing a version.",
  },
  {
    id: 17,
    front: "What is SAST?",
    back: "SAST (Static Application Security Testing) analyzes your source code for security vulnerabilities without running the application. Think of it like a spell checker, but for security flaws. Finding bugs early saves money - $100 during coding vs $100,000+ in production.",
  },
  {
    id: 18,
    front: "What is Semgrep?",
    back: "Semgrep is a fast, open-source security scanner that scans code for security vulnerabilities, finds bugs and anti-patterns, supports many languages (Python, JavaScript, Go, etc.), and has thousands of pre-built rules.",
  },
  {
    id: 19,
    front: "What is Trivy?",
    back: "Trivy is an open-source security scanner by Aqua Security that scans Docker images for known vulnerabilities in OS packages and application dependencies. It finds CVEs in your dependencies, not bugs in your own code.",
  },
  {
    id: 20,
    front: "What is a CVE?",
    back: "CVE (Common Vulnerabilities and Exposures) is a unique ID for each known security vulnerability. Example: CVE-2021-44228 (Log4j vulnerability). When a vulnerability is discovered, it gets assigned a CVE ID and added to databases that scanners like Trivy can detect.",
  },
];

interface FlashcardsProps {
  cards?: { front: string; back: string }[];
  title?: string;
}

const Flashcards = ({ cards, title }: FlashcardsProps = {}) => {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // Convert incoming cards to internal format or use defaults
  const displayCards: Flashcard[] = cards
    ? cards.map((card, index) => ({ id: index + 1, front: card.front, back: card.back }))
    : flashcardsData;

  const toggleCard = (id: number) => {
    setFlippedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  return (
    <div className="my-16">
      <h2 className="text-3xl font-serif text-text-charcoal mb-8">
        {title || "Key Concepts Flashcards"}
      </h2>
      <p className="text-text-taupe mb-8">
        Click any card to flip and reveal the definition.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCards.map((card) => {
          const isFlipped = flippedCards.includes(card.id);

          return (
            <div
              key={card.id}
              onClick={() => toggleCard(card.id)}
              className={`perspective-1000 cursor-pointer h-[220px] ${isFlipped ? "z-10" : "z-0"}`}
              style={{ perspective: "1000px" }}
            >
              <div
                className="relative w-full h-full transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 bg-bg-cream rounded-lg shadow-md border border-text-charcoal/10 p-6 flex items-center justify-center overflow-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <p className="text-lg font-serif text-text-charcoal text-center">
                    {card.front}
                  </p>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 bg-accent-moss/10 rounded-lg shadow-md border border-accent-moss/20 p-4 flex items-center justify-center overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <p className="text-xs text-text-taupe leading-relaxed text-center overflow-y-auto max-h-full">
                    {card.back}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Flashcards;
