"use client";

import { useState, useRef, useEffect } from "react";
import PhaseTimeline from "@/components/ui/PhaseTimeline";
import Flashcards from "@/components/ui/Flashcards";
import KeyTakeaway from "@/components/ui/KeyTakeaway";
import BeforeAfterComparison from "@/components/ui/BeforeAfterComparison";
import DifficultyIndicator from "@/components/ui/DifficultyIndicator";
import ConceptCards from "@/components/ui/ConceptCards";
import Collapsible from "@/components/ui/Collapsible";
import ProgressSidebar from "@/components/ui/ProgressSidebar";
import Quiz from "@/components/ui/Quiz";
import Terminal from "@/components/ui/Terminal";
import AnimatedDiagram, {
  cicdPipelineSteps,
  dockerFlowSteps,
} from "@/components/ui/AnimatedDiagram";
import Confetti, { CelebrationMessage } from "@/components/ui/Confetti";
import BookmarkButton from "@/components/ui/BookmarkButton";
import ShareButtons from "@/components/ui/ShareButtons";
import PersonalNotes from "@/components/ui/PersonalNotes";
import SearchBar from "@/components/ui/SearchBar";
import { ReadingPositionTracker } from "@/components/ui/BookmarkButton";
import { AllNotesViewer as NotesViewer } from "@/components/ui/PersonalNotes";

const phaseNames = [
  "Repository Setup",
  "FastAPI MVP",
  "Automated Tests",
  "Linting & Formatting",
  "Docker",
  "CI/CD",
  "SAST with Semgrep",
  "Trivy Container Scanning",
];

const DevSecOpsProject = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedPhase, setCelebratedPhase] = useState<number | null>(null);

  const scrollToPhase = (phaseId: number) => {
    phaseRefs.current[phaseId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = phaseRefs.current.length - 1; i >= 0; i--) {
        const ref = phaseRefs.current[i];
        if (ref && ref.offsetTop <= scrollPosition) {
          setCurrentPhase(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerCelebration = (phaseId: number) => {
    if (celebratedPhase !== phaseId) {
      setCelebratedPhase(phaseId);
      setShowConfetti(true);
      setShowCelebration(true);
    }
  };

  return (
    <div className="bg-bg-paper">
      {/* Global Components */}
      <SearchBar />
      <NotesViewer />
      <ReadingPositionTracker />
      <Confetti
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
      <CelebrationMessage
        isVisible={showCelebration}
        phaseName={
          celebratedPhase !== null
            ? `Phase ${celebratedPhase}: ${phaseNames[celebratedPhase]}`
            : ""
        }
        onClose={() => setShowCelebration(false)}
      />

      {/* Phase Timeline - Sticky at top */}
      <PhaseTimeline currentPhase={currentPhase} onPhaseClick={scrollToPhase} />

      {/* Progress Sidebar - Desktop only */}
      <ProgressSidebar
        currentPhase={currentPhase}
        onPhaseClick={scrollToPhase}
      />

      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-6xl py-16 lg:mr-64">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif text-text-charcoal mb-8">
          FastAPI DevSecOps Demo: A Production-Ready Microservice from Zero to
          Deployment
        </h1>

        {/* Main Before/After Comparison */}
        <BeforeAfterComparison
          title="What Makes This Project Different?"
          rows={[
            {
              before: "No project structure",
              after: "Professional folder organization",
            },
            { before: "No tests", after: "Automated test suite with Pytest" },
            {
              before: "No input validation",
              after: "Pydantic models for data validation",
            },
            { before: "No logging", after: "Comprehensive logging system" },
            {
              before: "Manual deployment",
              after: "CI/CD with GitHub Actions",
            },
            {
              before: "No security scanning",
              after: "SAST with Semgrep + Trivy",
            },
            {
              before: "Works on my machine",
              after: "Dockerized for consistency",
            },
            { before: "No documentation", after: "Auto-generated API docs" },
          ]}
        />

        {/* GitHub Repository Link */}
        <div className="my-16 p-8 bg-bg-cream/50 border border-text-charcoal/10 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <svg
              className="w-8 h-8 text-text-charcoal"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <h3 className="text-2xl font-serif text-text-charcoal">
              View Source Code
            </h3>
          </div>
          <p className="text-text-taupe mb-4">
            Explore the complete source code, documentation, and implementation
            details on GitHub.
          </p>
          <a
            href="https://github.com/CharithKapuluru/fastapi-devsecops-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-text-charcoal text-bg-paper rounded-lg hover:bg-accent-moss transition-colors font-mono text-sm"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View on GitHub
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        {/* Tech Stack Concept Cards */}
        <ConceptCards onCardClick={scrollToPhase} />

        {/* Flashcards Section */}
        <Flashcards />

        {/* Key Concepts Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif text-text-charcoal mb-6">
            Key Concepts in this Project
          </h2>

          {/* What is DevOps */}
          <Collapsible title="What is DevOps?" defaultOpen={true}>
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              DevOps is a way of working where software developers (Dev) and
              IT/operations teams (Ops) work together to build, test, release,
              and run software faster and more reliably. DevOps bridges the gap
              between these teams by introducing automation, continuous
              integration, continuous deployment, and shared responsibility,
              allowing applications to be updated frequently while remaining
              stable and reliable in production.
            </p>

            <h4 className="text-xl font-serif text-text-charcoal mb-3">
              Real-life example (Instagram-style app)
            </h4>
            <div className="mb-4">
              <p className="text-lg text-text-taupe mb-2">
                <strong>Who are Developers:</strong>
              </p>
              <ul className="list-disc list-inside text-text-taupe ml-4">
                <li>Build login page</li>
                <li>Create photo upload feature</li>
                <li>Write recommendation logic</li>
              </ul>
            </div>
            <div className="mb-4">
              <p className="text-lg text-text-taupe mb-2">
                <strong>What does it mean by Operations:</strong>
              </p>
              <ul className="list-disc list-inside text-text-taupe ml-4">
                <li>Deploy app on cloud</li>
                <li>Ensure app works 24/7</li>
                <li>Scale servers when traffic increases</li>
                <li>Monitor crashes</li>
                <li>Secure user data</li>
              </ul>
            </div>
            <p className="text-lg text-text-taupe">Both are equally important.</p>
          </Collapsible>

          {/* REST API */}
          <Collapsible title="REST API">
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              A REST API (Representational State Transfer Application
              Programming Interface) is a way for applications to communicate
              with servers over the internet using standard HTTP methods. In a
              REST API, the client (such as a web or mobile app) sends requests
              using methods like GET, POST, PUT, and DELETE to specific URLs,
              and the server responds with data, usually in JSON format. REST
              APIs do not handle user interfaces; they only transfer data. The
              client application then uses this data to display information or
              perform actions. REST APIs are widely used because they are
              simple, scalable, language-independent, and work efficiently over
              the web.
            </p>
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              When I open an app like Instagram and view a user&apos;s profile,
              the app sends a request to Instagram&apos;s backend using an API
              (REST-style). This API is part of Instagram&apos;s server and is
              responsible for fetching the required data, such as the
              user&apos;s profile details, from the database. The server returns
              this data in a structured format (like JSON), and the app then
              displays it in a user-friendly interface. The API itself does not
              show anything to the user; it only transfers data between the app
              and the server.
            </p>
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              When I open a food delivery app like Uber Eats and search for a
              restaurant, the app sends a request to the backend using a REST
              API. This API is part of the server and handles the request using
              an HTTP method such as GET to retrieve the restaurant&apos;s
              details from the database. The server then returns the data in a
              structured format like JSON, and the app displays this information
              on the screen. The REST API does not show anything by itself; it
              simply acts as a communication layer that transfers data between
              the app and the server.
            </p>
            <p className="text-lg text-text-taupe leading-relaxed">
              A REST API is a server-side interface that receives requests from
              an app, fetches or updates data, and sends the data back for the
              app to display.
            </p>
          </Collapsible>

          {/* FastAPI */}
          <Collapsible title="FastAPI">
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              A REST API is not a separate program or service that fetches data
              on its own; instead, it is an architectural style that defines
              rules and best practices for how communication between a client
              and a server should happen over the internet. These rules include
              using HTTP methods such as GET for reading data, POST for creating
              data, PUT for updating data, and DELETE for removing data, along
              with structured URLs and data formats like JSON.
            </p>
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              FastAPI is a Python framework that developers use to build an API
              that follows these REST principles. When a client application,
              such as a mobile or web app, sends a request (for example,
              searching for a restaurant or viewing a user profile), FastAPI
              receives the request on the server, interprets the HTTP method and
              URL according to REST rules, executes the backend logic, interacts
              with the database or other services to fetch or modify data, and
              then sends the response back to the client in a REST-compliant
              format. In simple terms, REST defines how an API should behave,
              while FastAPI is the actual tool that implements those rules and
              performs the real work of handling requests, processing data, and
              returning responses.
            </p>
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              REST API should be understood as an architectural blueprint or a
              set of rules rather than something that actually runs or executes
              code. REST defines how communication between an application and a
              server should happen, such as using URLs to represent resources,
              using HTTP methods like GET, POST, PUT, and DELETE to perform
              actions, exchanging data in formats like JSON, and keeping
              interactions stateless. REST itself does not fetch data, does not
              execute logic, and does not exist as a software component; it is
              simply a set of guidelines.
            </p>
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              FastAPI, on the other hand, is a real Python framework that runs
              on a server and is responsible for implementing these REST
              principles. When a user searches for something like
              &quot;Chipotle&quot; in an app, the app sends a REST-style request
              such as GET /restaurants?name=chipotle. FastAPI receives this
              request, identifies the HTTP method, endpoint, and parameters,
              executes the backend Python code, queries the database, and
              retrieves the relevant data. FastAPI then sends the response back
              to the client in a REST-compliant format, typically JSON,
              following REST rules such as stateless communication and clear
              resource-based responses.
            </p>
            <p className="text-lg text-text-taupe leading-relaxed">
              Therefore, the correct mental model is that FastAPI is the actual
              API that performs all the work, while REST simply describes how
              that API should behave. In real-world usage, when people say terms
              like &quot;Instagram REST API&quot; or &quot;Uber Eats REST
              API,&quot; they are referring to an API built using REST
              principles, not a separate REST component.
            </p>
          </Collapsible>

          {/* Docker */}
          <Collapsible title="Docker Image, Container and Kubernetes">
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              Consider a real-world food delivery application where the backend
              order service is built using FastAPI and needs to run reliably on
              different machines such as developer laptops, testing servers, and
              cloud production servers. To solve the problem of environment
              differences, the development team creates a Docker image, which is
              a packaged, read-only template containing the application code,
              the required Python runtime, all necessary libraries, and
              instructions on how to start the service. This Docker image itself
              does not run; it simply represents the standardized version of the
              application.
            </p>
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              When this image is executed on a server, it creates a Docker
              container, which is a running instance of the application capable
              of handling real user requests. During peak usage, such as a busy
              evening when many users place food orders, the same Docker image
              can be run multiple times to create several containers of the
              order service, allowing traffic to be distributed across them.
              Each container runs independently while using the same image,
              ensuring consistency, scalability, and reliability. In this setup,
              the image acts as the blueprint for the application, while
              containers are the actual running copies that keep the service
              responsive and stable in real-world production environments.
            </p>
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              Traditionally, applications handled increased traffic by adding
              more servers, which is known as horizontal scaling, or by
              upgrading a single server&apos;s resources, which is called
              vertical scaling. With containers, scaling happens at the
              application level rather than immediately at the server level.
              When traffic increases, such as on a Friday night for a food
              delivery app like Uber Eats, the system can start additional
              containers of the same application on existing servers, allowing
              requests to be distributed across them. This approach is still
              horizontal scaling, but it focuses on scaling the application
              using containers instead of directly adding servers. New servers
              are only added when existing servers reach their capacity, making
              container-based scaling more efficient, faster, and cost-effective.
            </p>
            <p className="text-lg text-text-taupe leading-relaxed">
              Kubernetes is a container orchestration platform that manages how
              containerized applications run at scale across multiple servers.
              While Docker is responsible for packaging an application into an
              image and running it as containers, Kubernetes takes over the
              responsibility of controlling those containers in production. In a
              real-world scenario like a food delivery app experiencing heavy
              traffic on a Friday night, Kubernetes automatically monitors
              application load and starts additional containers when demand
              increases, distributing them across available servers. If a
              container crashes or a server goes down, Kubernetes detects the
              failure and replaces the container automatically, ensuring the
              application remains available. When traffic decreases, Kubernetes
              scales the containers back down to save resources. In this way,
              Kubernetes provides automated scaling, self-healing, load
              balancing, and efficient resource management, allowing
              applications to run reliably and smoothly without manual
              intervention.
            </p>
          </Collapsible>
        </div>

        {/* Phase 0 */}
        <div
          ref={(el) => {
            phaseRefs.current[0] = el;
          }}
          data-phase="0"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <h2 className="text-3xl font-serif text-text-charcoal">
              Phase 0: Repository Setup and Project Structure
            </h2>
            <div className="flex flex-wrap gap-2">
              <BookmarkButton phaseId={0} phaseName="Phase 0: Repository Setup" />
              <ShareButtons title="Phase 0: Repository Setup" phaseId={0} />
              <PersonalNotes phaseId={0} phaseName="Phase 0" />
            </div>
          </div>

          <DifficultyIndicator
            readingTime={8}
            difficulty="Beginner"
            handsOn={true}
            prerequisites="Git installed"
          />

          <h3 className="text-xl font-serif text-text-charcoal mb-4">
            What is Phase 0 About?
          </h3>
          <p className="text-lg text-text-taupe leading-relaxed mb-6">
            Phase 0 is about setting up the foundation of your project before
            writing any code. In this phase, we create the project folder
            structure, set up version control with Git, and connect it to
            GitHub. This might seem basic, but doing it right from the start is
            what separates professional projects from beginner projects.
          </p>

          <h3 className="text-xl font-serif text-text-charcoal mb-4">
            Why is This Important?
          </h3>
          <p className="text-lg text-text-taupe leading-relaxed mb-4">
            <strong>For Your Career:</strong> When recruiters look at your
            GitHub, the first thing they notice is project organization. A messy
            project with no structure screams &quot;beginner.&quot; A
            well-organized project with proper Git history shows
            professionalism.
          </p>

          <h3 className="text-xl font-serif text-text-charcoal mb-4">
            Project Structure
          </h3>
          <pre className="bg-bg-cream p-4 rounded-sm text-sm font-mono mb-4 overflow-x-auto">
            {`fastapi-devsecops-demo/
├── app/                    # Your application code will go here
├── tests/                  # Your test code will go here
├── .github/
│   └── workflows/          # CI/CD automation will go here
└── docs/                   # Documentation will go here`}
          </pre>

          <KeyTakeaway variant="green">
            Phase 0 establishes the foundation. Professional projects start with
            proper structure, version control, and documentation. Your GitHub
            organization is the first thing recruiters evaluate.
          </KeyTakeaway>

          {/* Terminal Simulation */}
          <Terminal
            title="Setting Up Your Project"
            lines={[
              { type: "comment", content: "Create project directory" },
              { type: "command", content: "mkdir fastapi-devsecops-demo" },
              { type: "command", content: "cd fastapi-devsecops-demo" },
              { type: "comment", content: "Create folder structure" },
              {
                type: "command",
                content: "mkdir app tests docs .github/workflows",
              },
              {
                type: "output",
                content: "Created: app/ tests/ docs/ .github/workflows/",
              },
              { type: "comment", content: "Initialize Git repository" },
              { type: "command", content: "git init" },
              { type: "output", content: "Initialized empty Git repository" },
              { type: "command", content: "git branch -M main" },
              { type: "comment", content: "Create initial commit" },
              { type: "command", content: "git add ." },
              {
                type: "command",
                content: 'git commit -m "Initial project structure"',
              },
              {
                type: "output",
                content: "[main (root-commit)] Initial project structure",
              },
            ]}
          />

          {/* Quiz */}
          <Quiz
            title="Phase 0 Quiz"
            questions={[
              {
                question: "What is Git?",
                options: [
                  "A programming language",
                  "A version control system that tracks code changes",
                  "A cloud storage service",
                  "A code editor",
                ],
                correctIndex: 1,
                explanation:
                  "Git is a version control system - like a time machine for your code. It tracks every change you make so you can go back to any previous version.",
              },
              {
                question: "What is a .gitignore file used for?",
                options: [
                  "To store Git configuration",
                  "To list files that Git should NOT track",
                  "To ignore Git commands",
                  "To delete files from the repository",
                ],
                correctIndex: 1,
                explanation:
                  ".gitignore tells Git which files to NOT track - like a 'Do Not Disturb' sign for sensitive files like passwords or large dependencies.",
              },
              {
                question:
                  "Why is project structure important for your career?",
                options: [
                  "It makes the code run faster",
                  "Recruiters evaluate your GitHub organization first",
                  "It reduces file size",
                  "It's required by Python",
                ],
                correctIndex: 1,
                explanation:
                  "When recruiters look at your GitHub, the first thing they notice is project organization. A well-organized project shows professionalism.",
              },
            ]}
            onComplete={(score, total) => {
              if (score / total >= 0.8) triggerCelebration(0);
            }}
          />
        </div>

        {/* Phase 1 */}
        <div
          ref={(el) => {
            phaseRefs.current[1] = el;
          }}
          data-phase="1"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <h2 className="text-3xl font-serif text-text-charcoal">
              Phase 1: Build FastAPI Microservice MVP
            </h2>
            <div className="flex flex-wrap gap-2">
              <BookmarkButton phaseId={1} phaseName="Phase 1: FastAPI MVP" />
              <ShareButtons title="Phase 1: FastAPI MVP" phaseId={1} />
              <PersonalNotes phaseId={1} phaseName="Phase 1" />
            </div>
          </div>

          <DifficultyIndicator
            readingTime={15}
            difficulty="Intermediate"
            handsOn={true}
            prerequisites="Phase 0, Python basics"
          />

          <h3 className="text-xl font-serif text-text-charcoal mb-4">
            What is Phase 1 About?
          </h3>
          <p className="text-lg text-text-taupe leading-relaxed mb-4">
            Phase 1 is where we actually start coding! We build a working REST
            API using FastAPI - a modern Python web framework. But we&apos;re
            not just building &quot;any&quot; API. We&apos;re building it the
            way professional companies do - with proper configuration, data
            validation, logging, and error handling from day one.
          </p>

          <BeforeAfterComparison
            title="API Comparison"
            rows={[
              {
                before: "No input validation",
                after: "Pydantic models validate all input",
              },
              { before: "No logging", after: "Comprehensive logging system" },
              { before: "Crashes on errors", after: "Graceful error handling" },
              {
                before: "No documentation",
                after: "Auto-generated OpenAPI docs",
              },
            ]}
          />

          <h3 className="text-xl font-serif text-text-charcoal mb-4">
            What We Built
          </h3>
          <ol className="list-decimal list-inside text-text-taupe ml-4 mb-6">
            <li>app/__init__.py - Package Marker</li>
            <li>app/config.py - Configuration &amp; Logging</li>
            <li>app/models.py - Data Models</li>
            <li>app/main.py - The Actual API</li>
            <li>requirements.txt - Dependencies</li>
            <li>Makefile - Helper Commands</li>
          </ol>

          <KeyTakeaway variant="blue">
            Phase 1 isn&apos;t just &quot;build an API&quot; - it&apos;s
            &quot;build an API the way professionals do.&quot; The foundation of
            validation + logging + error handling is what companies look for.
          </KeyTakeaway>

          {/* Terminal Simulation */}
          <Terminal
            title="Building Your FastAPI App"
            lines={[
              { type: "comment", content: "Install dependencies" },
              {
                type: "command",
                content: "pip install fastapi uvicorn pydantic python-dotenv",
              },
              {
                type: "output",
                content:
                  "Successfully installed fastapi-0.109.0 uvicorn-0.27.0...",
              },
              { type: "comment", content: "Create the application files" },
              {
                type: "command",
                content:
                  "touch app/__init__.py app/config.py app/models.py app/main.py",
              },
              {
                type: "output",
                content: "Created: __init__.py, config.py, models.py, main.py",
              },
              { type: "comment", content: "Run the API server" },
              { type: "command", content: "uvicorn app.main:app --reload" },
              {
                type: "output",
                content: "INFO:     Uvicorn running on http://127.0.0.1:8000",
              },
              { type: "output", content: "INFO:     Started reloader process" },
              {
                type: "output",
                content: "INFO:     Application startup complete.",
              },
              { type: "comment", content: "Test the health endpoint" },
              { type: "command", content: "curl http://localhost:8000/health" },
              {
                type: "output",
                content:
                  '{"status": "healthy", "timestamp": "2024-01-15T10:30:00"}',
              },
            ]}
          />
        </div>

        {/* Phase 2 */}
        <div
          ref={(el) => {
            phaseRefs.current[2] = el;
          }}
          data-phase="2"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <h2 className="text-3xl font-serif text-text-charcoal">
              Phase 2: Add Automated Tests with Pytest
            </h2>
            <div className="flex flex-wrap gap-2">
              <BookmarkButton
                phaseId={2}
                phaseName="Phase 2: Automated Tests"
              />
              <ShareButtons title="Phase 2: Automated Tests" phaseId={2} />
              <PersonalNotes phaseId={2} phaseName="Phase 2" />
            </div>
          </div>

          <DifficultyIndicator
            readingTime={12}
            difficulty="Intermediate"
            handsOn={true}
            prerequisites="Phase 1"
          />

          <h3 className="text-xl font-serif text-text-charcoal mb-4">
            What is Phase 2 About?
          </h3>
          <p className="text-lg text-text-taupe leading-relaxed mb-6">
            Phase 2 adds automated testing to your API. Instead of manually
            testing your endpoints by running curl commands, you write code that
            tests your code automatically.
          </p>

          <BeforeAfterComparison
            title="Testing Comparison"
            rows={[
              {
                before: "Manual testing takes 30+ minutes",
                after: "Automated tests run in seconds",
              },
              {
                before: "Easy to forget test cases",
                after: "Never forgets a test case",
              },
              {
                before: "Inconsistent testing",
                after: "Runs the same way every time",
              },
              {
                before: "No proof code works",
                after: "Documented test coverage",
              },
            ]}
          />

          <h3 className="text-xl font-serif text-text-charcoal mb-4">
            What is Pytest?
          </h3>
          <p className="text-lg text-text-taupe leading-relaxed mb-4">
            Pytest is Python&apos;s most popular testing framework. It&apos;s:
          </p>
          <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
            <li>
              <strong>Simple</strong> - Write tests as regular functions
            </li>
            <li>
              <strong>Powerful</strong> - Fixtures, parameterization, plugins
            </li>
            <li>
              <strong>Industry standard</strong> - Used by almost every Python
              project
            </li>
          </ul>

          <pre className="bg-bg-cream p-4 rounded-sm text-sm font-mono mb-4 overflow-x-auto">
            {`def test_addition():
    result = 1 + 1
    assert result == 2  # If true, test passes. If false, test fails.`}
          </pre>

          <KeyTakeaway variant="yellow">
            No tests = No job offer. Every professional software team requires
            tests before merging code. Automated testing is non-negotiable in
            production environments.
          </KeyTakeaway>

          {/* Terminal Simulation */}
          <Terminal
            title="Running Pytest"
            lines={[
              { type: "comment", content: "Install pytest and httpx for testing" },
              { type: "command", content: "pip install pytest httpx pytest-cov" },
              {
                type: "output",
                content: "Successfully installed pytest-7.4.0 httpx-0.26.0...",
              },
              { type: "comment", content: "Create test file" },
              {
                type: "command",
                content: "touch tests/__init__.py tests/test_main.py",
              },
              { type: "comment", content: "Run the tests" },
              { type: "command", content: "pytest tests/ -v" },
              {
                type: "output",
                content:
                  "======================== test session starts ========================",
              },
              { type: "output", content: "collected 5 items" },
              {
                type: "output",
                content: "tests/test_main.py::test_health_endpoint PASSED",
              },
              {
                type: "output",
                content: "tests/test_main.py::test_create_item PASSED",
              },
              {
                type: "output",
                content: "tests/test_main.py::test_get_item PASSED",
              },
              {
                type: "output",
                content: "tests/test_main.py::test_invalid_input PASSED",
              },
              {
                type: "output",
                content: "tests/test_main.py::test_not_found PASSED",
              },
              {
                type: "output",
                content:
                  "======================== 5 passed in 0.42s ========================",
              },
            ]}
          />
        </div>

        {/* Phase 3 */}
        <div
          ref={(el) => {
            phaseRefs.current[3] = el;
          }}
          data-phase="3"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <h2 className="text-3xl font-serif text-text-charcoal">
              Phase 3: Add Linting and Code Formatting
            </h2>
            <div className="flex flex-wrap gap-2">
              <BookmarkButton phaseId={3} phaseName="Phase 3: Linting" />
              <ShareButtons
                title="Phase 3: Linting & Formatting"
                phaseId={3}
              />
              <PersonalNotes phaseId={3} phaseName="Phase 3" />
            </div>
          </div>

          <DifficultyIndicator
            readingTime={10}
            difficulty="Beginner"
            handsOn={true}
            prerequisites="Phase 2"
          />

          <h3 className="text-xl font-serif text-text-charcoal mb-4">
            What is Phase 3 About?
          </h3>
          <p className="text-lg text-text-taupe leading-relaxed mb-6">
            Phase 3 adds automatic code quality checks. Linting finds bugs and
            bad practices. Formatting ensures consistent code style across the
            team.
          </p>

          <h3 className="text-xl font-serif text-text-charcoal mb-4">
            What is Ruff?
          </h3>
          <p className="text-lg text-text-taupe leading-relaxed mb-4">
            Ruff is a modern Python tool that does BOTH linting and formatting:
          </p>
          <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
            <li>
              <strong>Fast</strong> - Written in Rust, 10-100x faster than older
              tools
            </li>
            <li>
              <strong>All-in-one</strong> - Replaces flake8, isort, black,
              pyupgrade
            </li>
            <li>
              <strong>Modern</strong> - New standard in Python community
            </li>
          </ul>

          <KeyTakeaway variant="green">
            Linting catches bugs BEFORE you run the code. Formatting makes code
            consistent without changing what it does. Ruff combines both into
            one fast tool.
          </KeyTakeaway>

          {/* Terminal Simulation */}
          <Terminal
            title="Using Ruff for Linting & Formatting"
            lines={[
              { type: "comment", content: "Install Ruff" },
              { type: "command", content: "pip install ruff" },
              { type: "output", content: "Successfully installed ruff-0.1.9" },
              { type: "comment", content: "Check for linting errors" },
              { type: "command", content: "ruff check app/" },
              {
                type: "output",
                content: "app/main.py:15:1: F401 'os' imported but unused",
              },
              {
                type: "output",
                content: "app/main.py:42:80: E501 Line too long (95 > 88)",
              },
              { type: "output", content: "Found 2 errors." },
              { type: "comment", content: "Auto-fix the errors" },
              { type: "command", content: "ruff check app/ --fix" },
              {
                type: "output",
                content: "Found 2 errors (2 fixed, 0 remaining).",
              },
              { type: "comment", content: "Format the code" },
              { type: "command", content: "ruff format app/" },
              { type: "output", content: "2 files reformatted" },
              { type: "comment", content: "Verify - no more issues" },
              { type: "command", content: "ruff check app/" },
              { type: "output", content: "All checks passed!" },
            ]}
          />
        </div>

        {/* Phase 4 */}
        <div
          ref={(el) => {
            phaseRefs.current[4] = el;
          }}
          data-phase="4"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <h2 className="text-3xl font-serif text-text-charcoal">
              Phase 4: Dockerize the Application
            </h2>
            <div className="flex flex-wrap gap-2">
              <BookmarkButton phaseId={4} phaseName="Phase 4: Docker" />
              <ShareButtons title="Phase 4: Docker" phaseId={4} />
              <PersonalNotes phaseId={4} phaseName="Phase 4" />
            </div>
          </div>

          <DifficultyIndicator
            readingTime={12}
            difficulty="Intermediate"
            handsOn={true}
            prerequisites="Phase 3, Docker installed"
          />

          <h3 className="text-xl font-serif text-text-charcoal mb-4">
            What is Phase 4 About?
          </h3>
          <p className="text-lg text-text-taupe leading-relaxed mb-6">
            Phase 4 packages your application into a Docker container - a
            portable box that includes your app and everything it needs to run.
          </p>

          <BeforeAfterComparison
            title="Docker Comparison"
            rows={[
              {
                before: '"Works on my machine" problems',
                after: "Runs the same everywhere",
              },
              {
                before: "Manual dependency installation",
                after: "All dependencies packaged",
              },
              {
                before: "Environment inconsistencies",
                after: "Identical dev and prod environments",
              },
              { before: "Complex deployment", after: "Single container to deploy" },
            ]}
          />

          <h3 className="text-xl font-serif text-text-charcoal mb-4">
            Dockerfile
          </h3>
          <pre className="bg-bg-cream p-4 rounded-sm text-sm font-mono mb-6 overflow-x-auto">
            {`FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app/ ./app/
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`}
          </pre>

          <KeyTakeaway variant="blue">
            Docker solves the &quot;works on my machine&quot; problem. The same
            image runs in development AND production with no surprises.
          </KeyTakeaway>

          {/* Docker Flow Diagram */}
          <AnimatedDiagram
            title="Docker Workflow"
            steps={dockerFlowSteps}
            type="flow"
          />

          {/* Terminal Simulation */}
          <Terminal
            title="Docker Commands"
            lines={[
              { type: "comment", content: "Build the Docker image" },
              { type: "command", content: "docker build -t fastapi-demo ." },
              { type: "output", content: "Step 1/7 : FROM python:3.12-slim" },
              { type: "output", content: "Step 2/7 : WORKDIR /app" },
              { type: "output", content: "..." },
              { type: "output", content: "Successfully built fastapi-demo" },
              { type: "comment", content: "Run the container" },
              { type: "command", content: "docker run -p 8000:8000 fastapi-demo" },
              {
                type: "output",
                content: "INFO: Uvicorn running on http://0.0.0.0:8000",
              },
              { type: "output", content: "INFO: Application startup complete." },
            ]}
          />

          {/* Quiz */}
          <Quiz
            title="Phase 4 Quiz"
            questions={[
              {
                question: "What is a Docker image?",
                options: [
                  "A running application",
                  "A packaged template containing code, runtime, and libraries",
                  "A virtual machine",
                  "A configuration file",
                ],
                correctIndex: 1,
                explanation:
                  "A Docker image is a packaged, read-only template containing everything needed to run an application - it's like a blueprint.",
              },
              {
                question: "What is a Docker container?",
                options: [
                  "A blueprint for applications",
                  "A running instance of a Docker image",
                  "A type of virtual machine",
                  "A cloud server",
                ],
                correctIndex: 1,
                explanation:
                  "A container is a running instance of a Docker image, capable of handling real user requests.",
              },
              {
                question: "What problem does Docker solve?",
                options: [
                  "Makes code run faster",
                  "Works on my machine problems",
                  "Reduces file size",
                  "Adds security features",
                ],
                correctIndex: 1,
                explanation:
                  "Docker solves the 'works on my machine' problem by ensuring the same image runs identically in development and production.",
              },
            ]}
            onComplete={(score, total) => {
              if (score / total >= 0.8) triggerCelebration(4);
            }}
          />
        </div>

        {/* Phase 5 */}
        <div
          ref={(el) => {
            phaseRefs.current[5] = el;
          }}
          data-phase="5"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <h2 className="text-3xl font-serif text-text-charcoal">
              Phase 5: CI/CD with GitHub Actions
            </h2>
            <div className="flex flex-wrap gap-2">
              <BookmarkButton phaseId={5} phaseName="Phase 5: CI/CD" />
              <ShareButtons title="Phase 5: CI/CD" phaseId={5} />
              <PersonalNotes phaseId={5} phaseName="Phase 5" />
            </div>
          </div>

          <DifficultyIndicator
            readingTime={15}
            difficulty="Intermediate"
            handsOn={true}
            prerequisites="Phase 4, GitHub account"
          />

          <h3 className="text-xl font-serif text-text-charcoal mb-4">
            What is Phase 5 About?
          </h3>
          <p className="text-lg text-text-taupe leading-relaxed mb-6">
            Phase 5 sets up CI/CD - a system that automatically tests, checks,
            and builds your code every time you push to GitHub. No more manual
            checking.
          </p>

          <BeforeAfterComparison
            title="CI/CD Comparison"
            rows={[
              {
                before: "Manually run tests",
                after: "Tests run automatically on push",
              },
              {
                before: "Easy to forget steps",
                after: "Same steps every time",
              },
              { before: "Slow releases", after: "Fast, confident releases" },
              {
                before: "Errors reach production",
                after: "Errors caught in pipeline",
              },
            ]}
          />

          <h3 className="text-xl font-serif text-text-charcoal mb-4">
            CI/CD in One Line
          </h3>
          <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
            <li>
              <strong>CI (Continuous Integration)</strong> → Automatically test
              code when it changes
            </li>
            <li>
              <strong>CD (Continuous Deployment/Delivery)</strong> →
              Automatically deploy code after it passes tests
            </li>
          </ul>

          <KeyTakeaway variant="yellow">
            GitHub Actions automates your entire workflow. Push code → tests run
            → security scans → Docker builds → deployment. All automatic, every
            time.
          </KeyTakeaway>

          {/* CI/CD Pipeline Diagram */}
          <AnimatedDiagram
            title="CI/CD Pipeline Flow"
            steps={cicdPipelineSteps}
            type="pipeline"
          />

          {/* Terminal Simulation */}
          <Terminal
            title="Setting Up GitHub Actions CI/CD"
            lines={[
              { type: "comment", content: "Create the workflows directory" },
              { type: "command", content: "mkdir -p .github/workflows" },
              { type: "comment", content: "Create the CI workflow file" },
              { type: "command", content: "touch .github/workflows/ci.yml" },
              { type: "output", content: "Created: .github/workflows/ci.yml" },
              { type: "comment", content: "Stage and commit the workflow" },
              { type: "command", content: "git add .github/workflows/ci.yml" },
              {
                type: "command",
                content: 'git commit -m "Add CI/CD pipeline"',
              },
              { type: "output", content: "[main abc1234] Add CI/CD pipeline" },
              { type: "comment", content: "Push to trigger the pipeline" },
              { type: "command", content: "git push origin main" },
              { type: "output", content: "Enumerating objects: 5, done." },
              { type: "output", content: "Writing objects: 100% (5/5), done." },
              {
                type: "output",
                content: "To github.com:user/fastapi-devsecops-demo.git",
              },
              { type: "output", content: "   main -> main" },
              { type: "output", content: "GitHub Actions workflow triggered!" },
            ]}
          />

          {/* Quiz */}
          <Quiz
            title="Phase 5 Quiz"
            questions={[
              {
                question: "What does CI stand for?",
                options: [
                  "Code Integration",
                  "Continuous Integration",
                  "Container Infrastructure",
                  "Cloud Instance",
                ],
                correctIndex: 1,
                explanation:
                  "CI stands for Continuous Integration - automatically testing code when it changes.",
              },
              {
                question: "What triggers a GitHub Actions workflow?",
                options: [
                  "Only manual button clicks",
                  "Events like pushing code or opening a pull request",
                  "Only at scheduled times",
                  "Only when the server restarts",
                ],
                correctIndex: 1,
                explanation:
                  "GitHub Actions workflows are triggered by events like pushing code, opening pull requests, merging code, or releasing a version.",
              },
              {
                question: "What is the main benefit of CI/CD?",
                options: [
                  "Faster code execution",
                  "Automatic, consistent processes that catch errors early",
                  "Reduced file sizes",
                  "Better syntax highlighting",
                ],
                correctIndex: 1,
                explanation:
                  "CI/CD ensures the same steps run every time, catching errors before they reach production and enabling fast, confident releases.",
              },
            ]}
            onComplete={(score, total) => {
              if (score / total >= 0.8) triggerCelebration(5);
            }}
          />
        </div>

        {/* Phase 6 */}
        <div
          ref={(el) => {
            phaseRefs.current[6] = el;
          }}
          data-phase="6"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <h2 className="text-3xl font-serif text-text-charcoal">
              Phase 6: SAST Security Scanning with Semgrep
            </h2>
            <div className="flex flex-wrap gap-2">
              <BookmarkButton phaseId={6} phaseName="Phase 6: SAST" />
              <ShareButtons title="Phase 6: SAST with Semgrep" phaseId={6} />
              <PersonalNotes phaseId={6} phaseName="Phase 6" />
            </div>
          </div>

          <DifficultyIndicator
            readingTime={10}
            difficulty="Intermediate"
            handsOn={true}
            prerequisites="Phase 5"
          />

          <h3 className="text-xl font-serif text-text-charcoal mb-4">
            What is SAST?
          </h3>
          <p className="text-lg text-text-taupe leading-relaxed mb-4">
            <strong>SAST = Static Application Security Testing</strong> -
            analyzes your source code for security vulnerabilities without
            running the application. Think of it like a spell checker, but for
            security flaws.
          </p>

          <h3 className="text-xl font-serif text-text-charcoal mb-4">
            The Cost of Security Bugs
          </h3>
          <table className="w-full mb-6 text-text-taupe">
            <thead>
              <tr className="border-b border-text-charcoal/20">
                <th className="text-left py-2">When Found</th>
                <th className="text-left py-2">Cost to Fix</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-text-charcoal/10">
                <td className="py-2">During coding</td>
                <td className="py-2">$100</td>
              </tr>
              <tr className="border-b border-text-charcoal/10">
                <td className="py-2">During code review</td>
                <td className="py-2">$1,000</td>
              </tr>
              <tr className="border-b border-text-charcoal/10">
                <td className="py-2">During testing</td>
                <td className="py-2">$10,000</td>
              </tr>
              <tr>
                <td className="py-2">In production</td>
                <td className="py-2">$100,000+</td>
              </tr>
            </tbody>
          </table>

          <KeyTakeaway variant="green">
            Semgrep scans your source code for security vulnerabilities. Finding
            bugs early saves money and reputation. The Equifax breach cost $1.4
            billion - all from a known, unpatched vulnerability.
          </KeyTakeaway>

          {/* Terminal Simulation */}
          <Terminal
            title="Running Semgrep Security Scan"
            lines={[
              { type: "comment", content: "Install Semgrep" },
              { type: "command", content: "pip install semgrep" },
              { type: "output", content: "Successfully installed semgrep-1.45.0" },
              { type: "comment", content: "Run security scan on your code" },
              { type: "command", content: "semgrep scan --config auto app/" },
              {
                type: "output",
                content: "Running 1500+ rules from semgrep-rules...",
              },
              { type: "output", content: "" },
              { type: "output", content: "Findings:" },
              { type: "output", content: "app/main.py" },
              {
                type: "output",
                content: "  python.lang.security.audit.hardcoded-password",
              },
              { type: "output", content: "    Line 42: password = 'admin123'" },
              { type: "output", content: "    Severity: HIGH" },
              { type: "output", content: "" },
              {
                type: "output",
                content: "Ran 1523 rules on 4 files: 1 finding.",
              },
              { type: "comment", content: "Fix the issue and re-scan" },
              { type: "command", content: "semgrep scan --config auto app/" },
              { type: "output", content: "Ran 1523 rules on 4 files: 0 findings." },
              { type: "output", content: "No security issues found!" },
            ]}
          />
        </div>

        {/* Phase 7 */}
        <div
          ref={(el) => {
            phaseRefs.current[7] = el;
          }}
          data-phase="7"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <h2 className="text-3xl font-serif text-text-charcoal">
              Phase 7: Container Scanning with Trivy
            </h2>
            <div className="flex flex-wrap gap-2">
              <BookmarkButton phaseId={7} phaseName="Phase 7: Trivy" />
              <ShareButtons title="Phase 7: Trivy" phaseId={7} />
              <PersonalNotes phaseId={7} phaseName="Phase 7" />
            </div>
          </div>

          <DifficultyIndicator
            readingTime={10}
            difficulty="Intermediate"
            handsOn={true}
            prerequisites="Phase 6"
          />

          <h3 className="text-xl font-serif text-text-charcoal mb-4">
            Semgrep vs Trivy
          </h3>
          <table className="w-full mb-6 text-text-taupe">
            <thead>
              <tr className="border-b border-text-charcoal/20">
                <th className="text-left py-2">Semgrep (Phase 6)</th>
                <th className="text-left py-2">Trivy (Phase 7)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-text-charcoal/10">
                <td className="py-2">
                  Scans your <strong>source code</strong>
                </td>
                <td className="py-2">
                  Scans your <strong>Docker image</strong>
                </td>
              </tr>
              <tr className="border-b border-text-charcoal/10">
                <td className="py-2">Finds bugs you wrote</td>
                <td className="py-2">Finds vulnerabilities in dependencies</td>
              </tr>
              <tr>
                <td className="py-2">Catches coding mistakes</td>
                <td className="py-2">Catches outdated packages</td>
              </tr>
            </tbody>
          </table>

          <h3 className="text-xl font-serif text-text-charcoal mb-4">
            Your Code Can Be Perfect, But Still Vulnerable
          </h3>
          <p className="text-lg text-text-taupe leading-relaxed mb-4">
            You write perfect code, but use an old version of FastAPI with a
            security bug, or a Python library that got hacked. Your app is now
            vulnerable - even though YOUR code is fine.
          </p>

          <KeyTakeaway variant="blue">
            You need BOTH: Semgrep ensures your code is secure. Trivy ensures
            your dependencies are secure. The Log4j disaster proved that even
            perfect code can be vulnerable through dependencies.
          </KeyTakeaway>

          {/* Terminal Simulation */}
          <Terminal
            title="Running Trivy Container Scan"
            lines={[
              { type: "comment", content: "Install Trivy (macOS)" },
              { type: "command", content: "brew install trivy" },
              { type: "output", content: "==> Installing trivy" },
              {
                type: "output",
                content:
                  "==> Pouring trivy--0.48.0.arm64_monterey.bottle.tar.gz",
              },
              { type: "comment", content: "Build the Docker image first" },
              { type: "command", content: "docker build -t fastapi-demo ." },
              { type: "output", content: "Successfully built fastapi-demo" },
              {
                type: "comment",
                content: "Scan the Docker image for vulnerabilities",
              },
              { type: "command", content: "trivy image fastapi-demo" },
              {
                type: "output",
                content: "2024-01-15T10:30:00 INFO Vulnerability scanning...",
              },
              { type: "output", content: "" },
              { type: "output", content: "fastapi-demo (python 3.12-slim)" },
              { type: "output", content: "Total: 3 (HIGH: 1, MEDIUM: 2)" },
              { type: "output", content: "" },
              {
                type: "output",
                content:
                  "┌──────────────┬────────────┬──────────┬─────────────────┐",
              },
              {
                type: "output",
                content:
                  "│ Library      │ CVE        │ Severity │ Fixed Version   │",
              },
              {
                type: "output",
                content:
                  "├──────────────┼────────────┼──────────┼─────────────────┤",
              },
              {
                type: "output",
                content:
                  "│ urllib3      │ CVE-2023-X │ HIGH     │ 2.0.7           │",
              },
              {
                type: "output",
                content:
                  "│ requests     │ CVE-2023-Y │ MEDIUM   │ 2.31.0          │",
              },
              {
                type: "output",
                content:
                  "└──────────────┴────────────┴──────────┴─────────────────┘",
              },
              { type: "comment", content: "Update dependencies and rebuild" },
              { type: "command", content: "trivy image fastapi-demo" },
              { type: "output", content: "Total: 0 vulnerabilities" },
              { type: "output", content: "No vulnerabilities found!" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default DevSecOpsProject;
