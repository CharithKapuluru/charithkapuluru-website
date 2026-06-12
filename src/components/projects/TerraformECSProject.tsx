"use client";

import { useState, useRef, useCallback } from "react";
import { useActivePhase } from "@/hooks/useActivePhase";
import PhaseTimeline from "@/components/ui/PhaseTimeline";
import Flashcards from "@/components/ui/Flashcards";
import KeyTakeaway from "@/components/ui/KeyTakeaway";
import BeforeAfterComparison from "@/components/ui/BeforeAfterComparison";
import Collapsible from "@/components/ui/Collapsible";
import ProgressSidebar from "@/components/ui/ProgressSidebar";
import Quiz from "@/components/ui/Quiz";
import Terminal from "@/components/ui/Terminal";
import Confetti, { CelebrationMessage } from "@/components/ui/Confetti";
import BookmarkButton from "@/components/ui/BookmarkButton";
import ShareButtons from "@/components/ui/ShareButtons";
import PersonalNotes from "@/components/ui/PersonalNotes";
import SearchBar from "@/components/ui/SearchBar";
import { ReadingPositionTracker } from "@/components/ui/BookmarkButton";
import { AllNotesViewer as NotesViewer } from "@/components/ui/PersonalNotes";
import CIDRCalculator from "@/components/ui/CIDRCalculator";
import ArchitectureDiagram from "@/components/ui/ArchitectureDiagram";
import TrafficFlowAnimation from "@/components/ui/TrafficFlowAnimation";
import TerraformResourceTree from "@/components/ui/TerraformResourceTree";
import LaunchChecklist from "@/components/ui/LaunchChecklist";
import OrganicDivider from "@/components/ui/OrganicDivider";
import RealTalk from "@/components/ui/RealTalk";
import CodeBlock from "@/components/ui/CodeBlock";
import PhaseHeader from "@/components/ui/PhaseHeader";
import DropCap from "@/components/ui/DropCap";
import PullQuote from "@/components/ui/PullQuote";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

const phaseLabels = [
  "Intro",
  "Fundamentals",
  "Flask & Docker",
  "AWS CLI",
  "ECR",
  "VPC & ALB",
  "ECS",
  "Monitoring",
  "CI/CD",
  "Auto-Scale",
];

const phases = phaseLabels.map((label, index) => ({ id: index, label }));

const ecsFlashcards = [
  {
    front: "What is Terraform?",
    back: "A tool that lets you create, change, and manage infrastructure using code instead of manual clicks. It allows you to define your cloud infrastructure in code and automatically provision it across platforms like AWS, Azure, and GCP.",
  },
  {
    front: "What is a VPC?",
    back: "A Virtual Private Cloud - your own private network inside AWS where you control IP addresses, subnets, routing, and security. Think of it as your own isolated data-center network in the cloud.",
  },
  {
    front: "What is the difference between Public and Private Subnets?",
    back: "A public subnet has a route to the Internet Gateway (0.0.0.0/0 -> IGW) and can reach the internet directly. A private subnet has no route to IGW and cannot be reached directly from the internet.",
  },
  {
    front: "What is ECS Fargate?",
    back: "AWS's serverless container service. You tell ECS what to run (container image, CPU, memory) and AWS handles all the underlying infrastructure. You never see or manage EC2 instances.",
  },
  {
    front: "What is an Application Load Balancer (ALB)?",
    back: "A service that receives HTTP/HTTPS traffic from users and intelligently distributes it to backend services (EC2/ECS tasks) based on rules. It acts as the 'front door' to your application.",
  },
  {
    front: "What is a CIDR block?",
    back: "A CIDR block defines a range of IP addresses. For example, 10.0.0.0/16 means 65,536 IP addresses starting from 10.0.0.0. The number after / indicates how many bits identify the network.",
  },
  {
    front: "How many IPs does AWS reserve per subnet?",
    back: "AWS reserves 5 IPs in every subnet: Network address, VPC router, DNS server, Future use, and Broadcast address. So a /24 subnet (256 IPs) only has 251 usable IPs.",
  },
  {
    front: "What is the difference between ECR and ECS?",
    back: "ECR (Elastic Container Registry) stores Docker images - it's like Docker Hub but private and inside AWS. ECS (Elastic Container Service) runs containers - it pulls images from ECR and runs them.",
  },
];

const PROJECT_SLUG = "terraform-ecs-deployment";

const TerraformECSProject = () => {
  const { user } = useAuth();
  const [currentPhase, setCurrentPhase] = useState(0);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedPhase, setCelebratedPhase] = useState<number | null>(null);

  // Clear all progress (called by "Start Fresh" button)
  const handleClearProgress = useCallback(async () => {
    if (user) {
      // Clear from Firestore
      try {
        const progressRef = doc(db, "users", user.uid, "progress", PROJECT_SLUG);
        await deleteDoc(progressRef);
      } catch (error) {
        console.error("Error clearing progress:", error);
      }
    }
    // Reset current phase to 0
    setCurrentPhase(0);
    // Force page reload to reset all state
    window.location.reload();
  }, [user]);

  const scrollToPhase = (phaseId: number) => {
    phaseRefs.current[phaseId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useActivePhase(phaseRefs, setCurrentPhase);

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
      <ReadingPositionTracker
        projectSlug={PROJECT_SLUG}
        onClearProgress={handleClearProgress}
      />
      <Confetti
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
      <CelebrationMessage
        isVisible={showCelebration}
        phaseName={
          celebratedPhase !== null
            ? `Phase ${celebratedPhase}: ${phaseLabels[celebratedPhase]}`
            : ""
        }
        onClose={() => setShowCelebration(false)}
      />

      {/* Phase Timeline */}
      <PhaseTimeline
        currentPhase={currentPhase}
        onPhaseClick={scrollToPhase}
        phases={phases}
      />

      {/* Progress Sidebar */}
      <ProgressSidebar
        currentPhase={currentPhase}
        onPhaseClick={scrollToPhase}
        phases={phases}
        projectSlug="terraform-ecs-deployment"
      />

      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-6xl py-16 lg:mr-64">
        {/* Title */}
        <span className="text-sm uppercase tracking-wider font-serif text-accent-moss mb-3 block">
          CI/CD Pipeline and CloudWatch Monitoring
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-text-charcoal mb-8">
          AWS ECS Fargate Deployment with Terraform
        </h1>

        {/* Main Before/After Comparison */}
        <BeforeAfterComparison
          title="What You&apos;ll Build"
          rows={[
            { before: "Manual AWS Console clicks", after: "Infrastructure as Code with Terraform" },
            { before: "No networking knowledge", after: "VPC, Subnets, CIDR mastery" },
            { before: "Docker on localhost only", after: "Containers running in AWS ECS" },
            { before: "No CI/CD pipeline", after: "Automated deployments with CodePipeline" },
            { before: "No monitoring", after: "CloudWatch alerts and dashboards" },
            { before: "Fixed capacity", after: "Auto-scaling with Fargate Spot" },
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
            Explore the complete Terraform configurations, Flask application, and CI/CD setup on GitHub.
          </p>
          <a
            href="https://github.com/CharithKapuluru/proj2-ecs-fargate"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-text-charcoal text-bg-paper rounded-lg hover:bg-accent-moss transition-colors font-mono text-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View on GitHub
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Flashcards Section */}
        <Flashcards cards={ecsFlashcards} title="Key Concepts Flashcards" />

        {/* ============================================ */}
        {/* PHASE 0: INTRODUCTION */}
        {/* ============================================ */}
        <div
          ref={(el) => { phaseRefs.current[0] = el; }}
          data-phase="0"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <PhaseHeader phaseNumber="0" title="Introduction" accentColor="moss" />
            <div className="flex flex-wrap gap-2">
              <BookmarkButton phaseId={0} phaseName="Introduction" projectSlug="terraform-ecs-deployment" />
              <ShareButtons title="Introduction" phaseId={0} />
              <PersonalNotes phaseId={0} phaseName="Introduction" projectSlug="terraform-ecs-deployment" />
            </div>
          </div>

          <LaunchChecklist
            items={[
              { label: "Time", value: "~5 min read", icon: "clock" },
              { label: "Level", value: "Just getting started", icon: "rocket" },
              { label: "You'll need", value: "Curiosity, that's it", icon: "check" },
            ]}
            variant="minimal"
          />

          {/* REWRITTEN INTRODUCTION - Only this paragraph is rewritten */}
          <DropCap accentColor="moss">
            In this project, we&apos;re going to deploy a Flask app to AWS using ECS Fargate and Terraform. I&apos;ll walk you through the whole thing - setting up a VPC, understanding CIDR blocks, configuring security groups, and building a CI/CD pipeline with CodePipeline. If you&apos;re trying to get into DevOps or just want to actually understand how AWS infrastructure works instead of just clicking around the console, this is what you need.
          </DropCap>

          <RealTalk>
            I want students like me to go through this project so that they get to know the basics, they get to know how things work at enterprise level, and also to get jobs in DevOps with Terraform and AWS services. My main motto is not to showcase my projects, I want others to grasp the fundamentals of the topics.
          </RealTalk>

          <p className="text-lg text-text-taupe leading-relaxed mb-6">
            Mainly there are IP networking fundamentals here like IP addresses, CIDR and all that - stuff that can help you in cybersecurity too.
          </p>

          <KeyTakeaway variant="blue">
            This project is divided into 8 phases (A through H). We&apos;ll cover fundamentals first, then build the entire infrastructure step by step.
          </KeyTakeaway>

          {/* Architecture Diagram */}
          <ArchitectureDiagram />
        </div>

        <OrganicDivider variant="branch" />

        {/* ============================================ */}
        {/* PHASE 1: FUNDAMENTALS */}
        {/* ============================================ */}
        <div
          ref={(el) => { phaseRefs.current[1] = el; }}
          data-phase="1"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <PhaseHeader phaseNumber="1" title="Fundamentals" accentColor="sage" />
            <div className="flex flex-wrap gap-2">
              <BookmarkButton phaseId={1} phaseName="Fundamentals" projectSlug="terraform-ecs-deployment" />
              <ShareButtons title="Fundamentals" phaseId={1} />
              <PersonalNotes phaseId={1} phaseName="Fundamentals" projectSlug="terraform-ecs-deployment" />
            </div>
          </div>

          <LaunchChecklist
            items={[
              { label: "Time", value: "~20 min", icon: "clock" },
              { label: "Vibe", value: "Theory first, code later", icon: "code" },
              { label: "Bring", value: "Basic programming know-how", icon: "tool" },
              { label: "Coffee", value: "Recommended", icon: "check" },
            ]}
          />

          {/* REST API vs Flask - from PDF */}
          <Collapsible title="REST API vs Flask API" defaultOpen={true}>
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              Imagine you are building the backend for a <strong>food delivery app</strong> (like Uber Eats).
            </p>

            <h4 className="text-xl font-serif text-text-charcoal mb-3">REST API = The Rulebook (First)</h4>
            <p className="text-text-taupe mb-4">REST says:</p>
            <table className="w-full mb-6 text-text-taupe">
              <thead>
                <tr className="border-b border-text-charcoal/20">
                  <th className="text-left py-2">Action</th>
                  <th className="text-left py-2">REST Rule</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-text-charcoal/10">
                  <td className="py-2">View all restaurants</td>
                  <td className="py-2 font-mono text-accent-moss">GET /restaurants</td>
                </tr>
                <tr className="border-b border-text-charcoal/10">
                  <td className="py-2">View one restaurant</td>
                  <td className="py-2 font-mono text-accent-moss">GET /restaurants/12</td>
                </tr>
                <tr className="border-b border-text-charcoal/10">
                  <td className="py-2">Add a restaurant</td>
                  <td className="py-2 font-mono text-accent-moss">POST /restaurants</td>
                </tr>
                <tr className="border-b border-text-charcoal/10">
                  <td className="py-2">Update a restaurant</td>
                  <td className="py-2 font-mono text-accent-moss">PUT /restaurants/12</td>
                </tr>
                <tr>
                  <td className="py-2">Delete a restaurant</td>
                  <td className="py-2 font-mono text-accent-moss">DELETE /restaurants/12</td>
                </tr>
              </tbody>
            </table>
            <p className="text-text-taupe mb-4">These rules <strong>exist before Flask or FastAPI</strong>. They are framework-independent.</p>

            <h4 className="text-xl font-serif text-text-charcoal mb-3">Flask&apos;s Role (Executor)</h4>
            <p className="text-text-taupe mb-4">When Flask receives this request:</p>
            <ol className="list-decimal list-inside text-text-taupe ml-4 mb-4">
              <li>Flask <strong>listens</strong> for incoming HTTP requests</li>
              <li>It checks: Path: /restaurants/12, Method: GET</li>
              <li>Flask finds: &quot;Ah, this matches the rule for fetching a restaurant&quot;</li>
              <li>Flask runs <strong>Python logic</strong> that: Reads 12, Fetches restaurant data from database</li>
              <li>Flask <strong>wraps the result</strong> into: JSON response</li>
              <li>Flask sends it back to the client</li>
            </ol>
            <p className="text-text-taupe mb-4">Flask does <strong>not invent rules</strong>. Flask <strong>executes REST rules</strong>.</p>

            <KeyTakeaway variant="green">
              REST does not care which framework you use. REST = Rules & structure. Flask = Executes rules manually. FastAPI = Executes rules with automation.
            </KeyTakeaway>
          </Collapsible>

          {/* Terraform / IaC - from PDF */}
          <Collapsible title="What is Terraform / Infrastructure as Code (IaC)?">
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              <strong>Infrastructure as Code (IaC)</strong> means: You define your cloud infrastructure using code, and a tool automatically creates, updates, or deletes that infrastructure for you.
            </p>
            <p className="text-text-taupe mb-4">So instead of:</p>
            <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
              <li>Clicking buttons in the AWS Console</li>
              <li>Manually creating VPCs, subnets, security groups, etc.</li>
            </ul>
            <p className="text-text-taupe mb-4">You:</p>
            <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
              <li><strong>Write code</strong></li>
              <li><strong>Run a command</strong></li>
              <li><strong>Infrastructure appears exactly as described</strong></li>
            </ul>
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              <strong>Terraform</strong> is a tool that lets you create, change, and manage infrastructure using code instead of manual clicks.
            </p>
            <p className="text-text-taupe mb-4">In one sentence:</p>
            <blockquote className="border-l-4 border-accent-moss pl-4 text-text-charcoal italic mb-4">
              Terraform allows you to define your cloud infrastructure in code and automatically provision it across platforms like AWS, Azure, and GCP.
            </blockquote>
            <p className="text-text-taupe">
              Terraform is built by <strong>HashiCorp</strong> and is one of the most widely used IaC tools in real companies.
            </p>
          </Collapsible>

          {/* AWS CLI - from PDF */}
          <Collapsible title="What is AWS CLI?">
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              <strong>AWS CLI (Command Line Interface)</strong> is a tool that lets you talk to AWS services by typing commands instead of clicking in the AWS Console.
            </p>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">List your S3 buckets</h4>
            <CodeBlock code="aws s3 ls" language="bash" />
            <p className="text-text-taupe mb-4">This does the same thing as: AWS Console → S3 → View buckets</p>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">Example with EC2</h4>
            <CodeBlock code="aws ec2 describe-instances" language="bash" />
            <CodeBlock code="aws ec2 stop-instances --instance-ids i-0123456789abcdef" language="bash" />

            <h4 className="text-lg font-serif text-text-charcoal mb-2">Example with ECS</h4>
            <CodeBlock code="aws ecs list-clusters" language="bash" />
          </Collapsible>

          {/* VPC - from PDF */}
          <Collapsible title="What is a VPC?">
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              A <strong>VPC (Virtual Private Cloud)</strong> is your own private network inside AWS.
            </p>
            <p className="text-text-taupe mb-4">Think of it like: A <strong>virtual data center network</strong> where you control:</p>
            <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
              <li>IP address ranges</li>
              <li>Subnets</li>
              <li>Routing</li>
              <li>Security</li>
            </ul>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">Why VPC exists</h4>
            <p className="text-text-taupe mb-4">AWS doesn&apos;t just drop servers on the internet. A VPC lets you decide:</p>
            <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
              <li>Who can access what</li>
              <li>Which resources are public vs private</li>
              <li>How traffic flows</li>
            </ul>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">Simple example (realistic)</h4>
            <p className="text-text-taupe mb-2">You create a VPC:</p>
            <CodeBlock code="VPC CIDR: 10.0.0.0/16" />
            <p className="text-text-taupe mb-4">Inside it:</p>
            <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
              <li><strong>Public subnet</strong>: 10.0.1.0/24 (Load Balancer)</li>
              <li><strong>Private subnet</strong>: 10.0.101.0/24 (App, DB)</li>
            </ul>

            <KeyTakeaway variant="yellow">
              AWS resources belong to the AWS account, not to IAM users. IAM users are just identities and permission holders. They do not own infrastructure.
            </KeyTakeaway>
          </Collapsible>

          {/* CIDR - from PDF */}
          <Collapsible title="What is a CIDR block?">
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              A <strong>CIDR block</strong> defines a range of IP addresses.
            </p>
            <p className="text-text-taupe mb-2">Example:</p>
            <CodeBlock code="10.0.0.0/16" />
            <p className="text-text-taupe mb-4">Means: &quot;I am reserving a block of IP addresses starting from 10.0.0.0.&quot;</p>
            <p className="text-text-taupe mb-4">CIDR answers <strong>one question</strong>: &quot;How many IP addresses do I have to use?&quot;</p>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">VPC CIDR (Big Network)</h4>
            <p className="text-text-taupe mb-2">Example VPC:</p>
            <CodeBlock code="VPC CIDR: 10.0.0.0/16" />
            <p className="text-text-taupe mb-4">This means:</p>
            <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
              <li>Total IPs: <strong>65,536</strong></li>
              <li>Range: 10.0.0.0 → 10.0.255.255</li>
            </ul>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">Why /16 for VPC?</h4>
            <p className="text-text-taupe mb-4">/16 means:</p>
            <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
              <li>First <strong>16 bits</strong> identify the VPC (network)</li>
              <li>Remaining <strong>16 bits</strong> are available inside</li>
            </ul>
            <p className="text-text-taupe mb-4">Practically:</p>
            <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
              <li>Large enough to create many subnets</li>
              <li>Industry standard</li>
              <li>Easy to manage</li>
            </ul>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">Subnets = smaller CIDR blocks inside VPC</h4>
            <p className="text-text-taupe mb-4">Important rule:</p>
            <blockquote className="border-l-4 border-accent-moss pl-4 text-text-charcoal italic mb-4">
              Subnet CIDRs must be inside the VPC CIDR and must NOT overlap.
            </blockquote>
          </Collapsible>

          {/* CIDR Calculator */}
          <CIDRCalculator />

          {/* Public vs Private Subnets - from PDF */}
          <Collapsible title="Public vs Private Subnets">
            <h4 className="text-lg font-serif text-text-charcoal mb-2">Public Subnet (Simple)</h4>
            <p className="text-text-taupe mb-4">A <strong>public subnet</strong> is a subnet that <strong>can reach the internet directly</strong>.</p>
            <p className="text-text-taupe mb-2">Why? Because its route table has:</p>
            <CodeBlock code="0.0.0.0/0 → Internet Gateway (IGW)" />
            <p className="text-text-taupe mb-4">Typical use:</p>
            <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
              <li>Load Balancer (ALB)</li>
              <li>NAT Gateway</li>
              <li>Bastion host</li>
            </ul>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">Private Subnet (Simple)</h4>
            <p className="text-text-taupe mb-4">A <strong>private subnet</strong> is a subnet that <strong>cannot be reached directly from the internet</strong>.</p>
            <p className="text-text-taupe mb-2">Why? Because it has <strong>no route to IGW</strong>. It may have:</p>
            <CodeBlock code="0.0.0.0/0 → NAT Gateway" />
            <p className="text-text-taupe mb-4">(for outbound only)</p>
            <p className="text-text-taupe mb-4">Typical use:</p>
            <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
              <li>App servers</li>
              <li>ECS tasks</li>
              <li>Databases (RDS)</li>
            </ul>

            <KeyTakeaway variant="green">
              Public subnet contains: Internet-facing Load Balancer (ALB), NAT Gateway. Private subnet contains: App servers / ECS tasks (backend), Database (RDS). This reduces hacking surface, port scanning exposure, accidental public access.
            </KeyTakeaway>
          </Collapsible>

          {/* Traffic Flow Animation */}
          <TrafficFlowAnimation />

          <Quiz
            title="Fundamentals Quiz"
            questions={[
              {
                question: "What is Terraform?",
                options: [
                  "A cloud provider like AWS",
                  "An Infrastructure as Code tool that provisions resources",
                  "A container orchestration platform",
                  "A monitoring service",
                ],
                correctIndex: 1,
                explanation: "Terraform is an IaC tool by HashiCorp that lets you define and provision infrastructure using code.",
              },
              {
                question: "What does a /16 CIDR block give you?",
                options: [
                  "16 IP addresses",
                  "256 IP addresses",
                  "65,536 IP addresses",
                  "16 million IP addresses",
                ],
                correctIndex: 2,
                explanation: "/16 means 2^(32-16) = 2^16 = 65,536 IP addresses.",
              },
              {
                question: "How many IPs does AWS reserve per subnet?",
                options: ["2", "3", "5", "10"],
                correctIndex: 2,
                explanation: "AWS reserves 5 IPs: Network address, VPC router, DNS server, Future use, and Broadcast.",
              },
            ]}
            onComplete={(score, total) => {
              if (score / total >= 0.8) triggerCelebration(1);
            }}
          />
        </div>

        <OrganicDivider variant="wave" />

        {/* ============================================ */}
        {/* PHASE 2: PHASE A - Flask & Docker */}
        {/* ============================================ */}
        <div
          ref={(el) => { phaseRefs.current[2] = el; }}
          data-phase="2"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <PhaseHeader phaseNumber="A" title="Create Flask Application and Docker Image" accentColor="terracotta" />
            <div className="flex flex-wrap gap-2">
              <BookmarkButton phaseId={2} phaseName="Phase A" projectSlug="terraform-ecs-deployment" />
              <ShareButtons title="Phase A: Flask & Docker" phaseId={2} />
              <PersonalNotes phaseId={2} phaseName="Phase A" projectSlug="terraform-ecs-deployment" />
            </div>
          </div>

          <LaunchChecklist
            items={[
              { label: "Time", value: "~15 min", icon: "clock" },
              { label: "Mode", value: "Hands-on coding", icon: "code" },
              { label: "Need", value: "Docker running on your machine", icon: "tool" },
              { label: "Outcome", value: "Your first container", icon: "rocket" },
            ]}
          />

          {/* Content from PDF - verbatim */}
          <div className="mb-6">
            <h3 className="text-xl font-serif text-text-charcoal mb-4">Goal</h3>
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              Create a simple web application and package it into a Docker container that can run anywhere - on your laptop, in AWS, or any cloud provider.
            </p>

            <h3 className="text-xl font-serif text-text-charcoal mb-4">What We&apos;re Building</h3>
            <p className="text-text-taupe mb-4">A minimal Flask web application with:</p>
            <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
              <li>Homepage endpoint (/) that returns a JSON greeting</li>
              <li>Health check endpoint (/health) for AWS to monitor the app</li>
              <li>Request logging with timing data (observability)</li>
            </ul>
          </div>

          <Terminal
            title="Create Project Structure"
            lines={[
              { type: "comment", content: "Create project directories" },
              { type: "command", content: "mkdir -p proj2-ecs-fargate/app" },
              { type: "command", content: "mkdir -p proj2-ecs-fargate/terraform" },
              { type: "command", content: "cd proj2-ecs-fargate" },
              { type: "output", content: "" },
              { type: "comment", content: "What This Does: Creates the directory structure for our project." },
              { type: "comment", content: "Why This Structure? Separation of concerns:" },
              { type: "comment", content: "- app/ = Application code (what the app does)" },
              { type: "comment", content: "- terraform/ = Infrastructure code (how to deploy it)" },
            ]}
          />

          <h3 className="text-xl font-serif text-text-charcoal mb-4">Docker Commands</h3>

          <Terminal
            title="Build and Run Docker Container"
            lines={[
              { type: "comment", content: "BUILD IMAGE:" },
              { type: "command", content: "docker build -t proj2-app:local ./app" },
              { type: "output", content: "-t proj2-app:local    Tag the image with name:version" },
              { type: "output", content: "./app                 Build from ./app directory (where Dockerfile is)" },
              { type: "comment", content: "" },
              { type: "comment", content: "RUN CONTAINER:" },
              { type: "command", content: "docker run -d -p 8080:8080 --name proj2-test proj2-app:local" },
              { type: "output", content: "-d                    Run in background (detached)" },
              { type: "output", content: "-p 8080:8080          Map host port 8080 to container port 8080" },
              { type: "output", content: "--name proj2-test     Name the container" },
            ]}
          />

          <Terminal
            title="Test Endpoints"
            lines={[
              { type: "command", content: "curl http://localhost:8080/" },
              { type: "output", content: '{"message":"Hello from ECS Fargate!","service":"proj2-app"}' },
              { type: "command", content: "curl http://localhost:8080/health" },
              { type: "output", content: '{"status":"ok","timestamp":"2026-01-16T21:20:18.962999"}' },
            ]}
          />

          <Terminal
            title="View Logs and Cleanup"
            lines={[
              { type: "comment", content: "VIEW LOGS:" },
              { type: "command", content: "docker logs proj2-test" },
              { type: "output", content: "# Shows gunicorn startup + request logs:" },
              { type: "output", content: "# GET / - 200 - 0.6ms" },
              { type: "output", content: "# GET /health - 200 - 0.1ms" },
              { type: "comment", content: "" },
              { type: "comment", content: "CLEANUP:" },
              { type: "command", content: "docker stop proj2-test" },
              { type: "command", content: "docker rm proj2-test" },
              { type: "comment", content: "" },
              { type: "comment", content: "OTHER USEFUL COMMANDS:" },
              { type: "command", content: "docker ps              # List running containers" },
              { type: "command", content: "docker images | grep proj2   # List images" },
              { type: "command", content: "docker logs -f proj2-test    # Follow logs in real-time" },
            ]}
          />

          <KeyTakeaway variant="blue">
            This is a professional standard - keeps code organized and maintainable. The app/ folder contains application code. The terraform/ folder contains infrastructure code.
          </KeyTakeaway>

          <RealTalk>
            Docker can feel intimidating at first, but once you get your first container running, it clicks. You just packaged your app into something that runs identically everywhere - that&apos;s powerful.
          </RealTalk>
        </div>

        <OrganicDivider variant="terrain" />

        {/* ============================================ */}
        {/* PHASE 3: PHASE B - AWS CLI Setup */}
        {/* ============================================ */}
        <div
          ref={(el) => { phaseRefs.current[3] = el; }}
          data-phase="3"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <PhaseHeader phaseNumber="B" title="AWS CLI Setup + IAM + Budget Alert" accentColor="sand" />
            <div className="flex flex-wrap gap-2">
              <BookmarkButton phaseId={3} phaseName="Phase B" projectSlug="terraform-ecs-deployment" />
              <ShareButtons title="Phase B: AWS CLI Setup" phaseId={3} />
              <PersonalNotes phaseId={3} phaseName="Phase B" projectSlug="terraform-ecs-deployment" />
            </div>
          </div>

          <LaunchChecklist
            items={[
              { label: "Time", value: "~10 min", icon: "clock" },
              { label: "Mode", value: "AWS Console + Terminal", icon: "code" },
              { label: "Need", value: "An AWS account (Free Tier works)", icon: "tool" },
              { label: "Watch out", value: "Don't skip the budget alert!", icon: "warning" },
            ]}
          />

          {/* Content from PDF - verbatim */}
          <p className="text-lg text-text-taupe leading-relaxed mb-6">
            In Phase B, we verified our AWS setup before creating any resources. We confirmed that the AWS CLI was properly configured and authenticated as the test_user IAM user by running aws sts get-caller-identity. We verified the default region was set to us-east-1 (the cheapest and most feature-complete AWS region). We created a budget alert called proj2-cost-guardrail with a $10/month limit that sends an email notification when spending exceeds 80% ($8) — this acts as a safety net to prevent surprise bills. Finally, we tested that we had the necessary permissions to access ECR, ECS, and VPC services by running describe/list commands and confirming no &quot;Access Denied&quot; errors. This phase was all about preparation and safety checks — no infrastructure was built yet, just making sure we had the keys, knew where we were going, and had cost protection in place.
          </p>

          <Terminal
            title="Verify AWS CLI Setup"
            lines={[
              { type: "comment", content: "Verify AWS identity" },
              { type: "command", content: "aws sts get-caller-identity" },
              { type: "output", content: '{"UserId": "...", "Account": "...", "Arn": "arn:aws:iam::..."}' },
              { type: "comment", content: "" },
              { type: "comment", content: "Check default region" },
              { type: "command", content: "aws configure get region" },
              { type: "output", content: "us-east-1" },
              { type: "comment", content: "" },
              { type: "comment", content: "Test ECR access" },
              { type: "command", content: "aws ecr describe-repositories" },
              { type: "comment", content: "Test ECS access" },
              { type: "command", content: "aws ecs list-clusters" },
              { type: "comment", content: "Test VPC access" },
              { type: "command", content: "aws ec2 describe-vpcs" },
            ]}
          />

          <KeyTakeaway variant="yellow">
            This phase was all about preparation and safety checks — no infrastructure was built yet, just making sure we had the keys, knew where we were going, and had cost protection in place.
          </KeyTakeaway>
        </div>

        <OrganicDivider variant="branch" />

        {/* ============================================ */}
        {/* PHASE 4: PHASE C - ECR Repository */}
        {/* ============================================ */}
        <div
          ref={(el) => { phaseRefs.current[4] = el; }}
          data-phase="4"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <PhaseHeader phaseNumber="C" title="ECR Repository + Push Image" accentColor="olive" />
            <div className="flex flex-wrap gap-2">
              <BookmarkButton phaseId={4} phaseName="Phase C" projectSlug="terraform-ecs-deployment" />
              <ShareButtons title="Phase C: ECR Repository" phaseId={4} />
              <PersonalNotes phaseId={4} phaseName="Phase C" projectSlug="terraform-ecs-deployment" />
            </div>
          </div>

          <LaunchChecklist
            items={[
              { label: "Time", value: "~12 min", icon: "clock" },
              { label: "Mode", value: "Terminal commands", icon: "code" },
              { label: "Need", value: "Phases A & B done", icon: "check" },
              { label: "Result", value: "Image in the cloud", icon: "rocket" },
            ]}
          />

          {/* Content from PDF - verbatim */}
          <div className="mb-6">
            <h3 className="text-xl font-serif text-text-charcoal mb-4">Goal</h3>
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              Upload your Docker image from your Mac to AWS ECR so that ECS can later download it and run it in the cloud.
            </p>

            <h3 className="text-xl font-serif text-text-charcoal mb-4">What We&apos;re Doing</h3>
            <ol className="list-decimal list-inside text-text-taupe ml-4 mb-4">
              <li>Create a &quot;repository&quot; in ECR (like creating an album in iCloud)</li>
              <li>Log Docker into ECR (authenticate)</li>
              <li>Tag image with ECR address (rename for upload)</li>
              <li>Push image to ECR (upload)</li>
              <li>Verify it uploaded correctly</li>
            </ol>

            <h3 className="text-xl font-serif text-text-charcoal mb-4">After This Phase</h3>
            <p className="text-text-taupe mb-4">Your Docker image will be:</p>
            <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
              <li>Stored in AWS</li>
              <li>Accessible to ECS</li>
              <li>Scanned for vulnerabilities</li>
              <li>Encrypted at rest</li>
              <li>Ready for deployment</li>
            </ul>
          </div>

          <Collapsible title="ECR — Amazon Elastic Container Registry" defaultOpen={true}>
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              <strong>What it is (simple):</strong> ECR is <strong>AWS&apos;s Docker image storage</strong>. It stores your built container images securely.
            </p>
            <blockquote className="border-l-4 border-accent-moss pl-4 text-text-charcoal italic mb-4">
              Think: ECR = Docker Hub, but private and inside AWS.
            </blockquote>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">What goes into ECR?</h4>
            <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
              <li>Docker images (myapp:latest, myapp:v1)</li>
              <li>Image layers + metadata</li>
            </ul>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">What ECR does NOT do</h4>
            <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
              <li>It does <strong>not</strong> run containers</li>
              <li>It only <strong>stores</strong> images</li>
            </ul>
          </Collapsible>

          <Terminal
            title="Push Image to ECR"
            lines={[
              { type: "comment", content: "Create ECR repository" },
              { type: "command", content: "aws ecr create-repository --repository-name proj2-app" },
              { type: "comment", content: "" },
              { type: "comment", content: "Login to ECR" },
              { type: "command", content: "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com" },
              { type: "output", content: "Login Succeeded" },
              { type: "comment", content: "" },
              { type: "comment", content: "Tag image for ECR" },
              { type: "command", content: "docker tag proj2-app:local <account>.dkr.ecr.us-east-1.amazonaws.com/proj2-app:v1" },
              { type: "comment", content: "" },
              { type: "comment", content: "Push to ECR" },
              { type: "command", content: "docker push <account>.dkr.ecr.us-east-1.amazonaws.com/proj2-app:v1" },
              { type: "output", content: "The push refers to repository [...]" },
              { type: "output", content: "v1: digest: sha256:... size: 1234" },
            ]}
          />

          <KeyTakeaway variant="green">
            Now the image lives in ECR. ECS will pull this image when it needs to start a container.
          </KeyTakeaway>
        </div>

        <OrganicDivider variant="wave" />

        {/* ============================================ */}
        {/* PHASE 5: PHASE D - VPC & ALB */}
        {/* ============================================ */}
        <div
          ref={(el) => { phaseRefs.current[5] = el; }}
          data-phase="5"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <PhaseHeader phaseNumber="D" title="Terraform VPC + ALB Infrastructure" accentColor="moss" />
            <div className="flex flex-wrap gap-2">
              <BookmarkButton phaseId={5} phaseName="Phase D" projectSlug="terraform-ecs-deployment" />
              <ShareButtons title="Phase D: VPC & ALB" phaseId={5} />
              <PersonalNotes phaseId={5} phaseName="Phase D" projectSlug="terraform-ecs-deployment" />
            </div>
          </div>

          <LaunchChecklist
            items={[
              { label: "Time", value: "~20 min", icon: "clock" },
              { label: "Mode", value: "Terraform all the way", icon: "code" },
              { label: "Need", value: "Phase C done + Terraform installed", icon: "tool" },
              { label: "This is", value: "Where it gets real", icon: "rocket" },
            ]}
          />

          {/* Content from PDF - verbatim */}
          <p className="text-lg text-text-taupe leading-relaxed mb-6">
            In Phase D, we used Terraform to provision the core AWS networking infrastructure as code. Instead of manually clicking through the AWS Console, we wrote Terraform configuration files (.tf files) that define our desired infrastructure declaratively. We created a VPC with CIDR block 10.0.0.0/16, two public subnets across different availability zones (us-east-1a and us-east-1b) for high availability, an Internet Gateway to allow internet access, route tables to direct traffic, and two security groups — one for the ALB (allowing HTTP port 80 from the internet) and one for ECS tasks (allowing traffic only from the ALB). We also set up an Application Load Balancer (ALB) with a target group and HTTP listener. Running terraform init, terraform plan, and terraform apply created all 12 resources automatically. At this point, the ALB returns a 503 error because there are no targets yet — the ECS tasks haven&apos;t been deployed. This phase established the network foundation that our containers will run on.
          </p>

          <Collapsible title="What is an ALB? (Simple)" defaultOpen={true}>
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              An <strong>Application Load Balancer (ALB)</strong> is a service that:
            </p>
            <blockquote className="border-l-4 border-accent-moss pl-4 text-text-charcoal italic mb-4">
              Receives HTTP/HTTPS traffic from users and intelligently distributes it to backend services (EC2/ECS tasks) based on rules.
            </blockquote>
          </Collapsible>

          {/* Terraform Resource Tree */}
          <TerraformResourceTree />

          <Collapsible title="Terraform Commands">
            <h4 className="text-lg font-serif text-text-charcoal mb-2">terraform init</h4>
            <p className="text-text-taupe mb-4">
              Downloads and installs the required provider plugins (like the AWS provider) and sets up the working directory. Think of it like npm install — it fetches the dependencies Terraform needs to talk to AWS. You run this once when starting a project or when you add new providers.
            </p>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">terraform plan</h4>
            <p className="text-text-taupe mb-4">
              Shows you a preview of what Terraform will do without actually doing it. It compares your .tf files (what you want) against the current state (what exists) and outputs a diff: resources to create (+), modify (~), or destroy (-). This is your safety check — review the plan before applying.
            </p>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">terraform apply</h4>
            <p className="text-text-taupe mb-4">
              Actually executes the changes. It creates, modifies, or destroys resources in AWS to match what&apos;s defined in your .tf files. After running, it updates the state file (terraform.tfstate) to track what exists. You&apos;ll be prompted to type yes to confirm (or use -auto-approve to skip).
            </p>

            <p className="text-text-taupe mb-4">Other useful commands:</p>
            <ul className="list-disc list-inside text-text-taupe ml-4">
              <li><code className="font-mono text-accent-moss">terraform destroy</code> — Tears down all resources defined in your .tf files</li>
              <li><code className="font-mono text-accent-moss">terraform validate</code> — Checks syntax without connecting to AWS</li>
              <li><code className="font-mono text-accent-moss">terraform fmt</code> — Auto-formats your .tf files</li>
            </ul>
          </Collapsible>

          <Terminal
            title="Terraform Commands"
            lines={[
              { type: "comment", content: "Initialize Terraform" },
              { type: "command", content: "terraform init" },
              { type: "output", content: "Initializing the backend..." },
              { type: "output", content: "Terraform has been successfully initialized!" },
              { type: "comment", content: "" },
              { type: "comment", content: "Preview changes" },
              { type: "command", content: "terraform plan" },
              { type: "output", content: "Plan: 12 to add, 0 to change, 0 to destroy." },
              { type: "comment", content: "" },
              { type: "comment", content: "Apply changes" },
              { type: "command", content: "terraform apply" },
              { type: "output", content: "Apply complete! Resources: 12 added, 0 changed, 0 destroyed." },
              { type: "output", content: "" },
              { type: "output", content: "Outputs:" },
              { type: "output", content: "alb_dns_name = \"proj2-alb-123456789.us-east-1.elb.amazonaws.com\"" },
            ]}
          />

          <KeyTakeaway variant="blue">
            At this point, the ALB returns a 503 error because there are no targets yet — the ECS tasks haven&apos;t been deployed. This phase established the network foundation that our containers will run on.
          </KeyTakeaway>

          <PullQuote>
            Infrastructure as Code means you can destroy everything and rebuild it identically with a single command. That&apos;s power.
          </PullQuote>

          <Quiz
            title="Phase D Quiz"
            questions={[
              {
                question: "What does terraform plan do?",
                options: [
                  "Creates resources immediately",
                  "Shows a preview of changes without applying them",
                  "Deletes all resources",
                  "Downloads provider plugins",
                ],
                correctIndex: 1,
                explanation: "terraform plan shows what will happen without making any changes - it's a safety check before applying.",
              },
              {
                question: "Why does the ALB return 503 after Phase D?",
                options: [
                  "The ALB is misconfigured",
                  "There are no ECS tasks registered as targets yet",
                  "The security group blocks traffic",
                  "The VPC has no internet access",
                ],
                correctIndex: 1,
                explanation: "503 means 'Service Unavailable' - the ALB has no healthy targets because ECS tasks aren't deployed yet.",
              },
            ]}
            onComplete={(score, total) => {
              if (score / total >= 0.8) triggerCelebration(5);
            }}
          />
        </div>

        <OrganicDivider variant="terrain" />

        {/* ============================================ */}
        {/* PHASE 6: PHASE E - ECS Fargate */}
        {/* ============================================ */}
        <div
          ref={(el) => { phaseRefs.current[6] = el; }}
          data-phase="6"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <PhaseHeader phaseNumber="E" title="ECS Fargate Deployment" accentColor="terracotta" />
            <div className="flex flex-wrap gap-2">
              <BookmarkButton phaseId={6} phaseName="Phase E" projectSlug="terraform-ecs-deployment" />
              <ShareButtons title="Phase E: ECS Fargate" phaseId={6} />
              <PersonalNotes phaseId={6} phaseName="Phase E" projectSlug="terraform-ecs-deployment" />
            </div>
          </div>

          <LaunchChecklist
            items={[
              { label: "Time", value: "~15 min", icon: "clock" },
              { label: "Mode", value: "More Terraform magic", icon: "code" },
              { label: "Need", value: "Phase D infrastructure up", icon: "check" },
              { label: "Moment", value: "Your app goes live!", icon: "rocket" },
            ]}
          />

          {/* Content from PDF - verbatim */}
          <p className="text-lg text-text-taupe leading-relaxed mb-6">
            In Phase E, we deployed our containerized Flask application to AWS ECS Fargate. We created an IAM role (ecsTaskExecutionRole) that gives ECS permission to pull Docker images from ECR and write logs to CloudWatch. We set up a CloudWatch Log Group (/ecs/proj2-app) to capture container output. We then created an ECS Cluster (proj2-cluster) as a logical grouping for our containers, and a Task Definition that specifies exactly how to run our container — the Docker image from ECR, CPU (256 units = 0.25 vCPU), memory (512MB), port mapping (8080), and logging configuration. Finally, we created an ECS Service that maintains our desired task count, connects to the ALB target group, and automatically replaces unhealthy tasks. After terraform apply, the ALB health checks pass, and hitting the ALB URL now returns {`{"message": "Hello from ECS Fargate!", "service": "proj2-app"}`} — our app is live. The complete request flow is: User → ALB (port 80) → ECS Task (port 8080) → Flask app → response back through the same path.
          </p>

          <Collapsible title="ECS — Amazon Elastic Container Service" defaultOpen={true}>
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              <strong>What it is (simple):</strong> ECS is <strong>AWS&apos;s container runner and manager</strong>. It pulls images from ECR and runs them as containers.
            </p>
            <blockquote className="border-l-4 border-accent-moss pl-4 text-text-charcoal italic mb-4">
              Think: ECS = the service that starts, stops, restarts, and scales containers.
            </blockquote>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">Key ECS concepts (quick)</h4>
            <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
              <li><strong>Task Definition</strong>: blueprint (which image, CPU, memory, port)</li>
              <li><strong>Task</strong>: a running container</li>
              <li><strong>Service</strong>: keeps N tasks running (self-healing)</li>
              <li><strong>Cluster</strong>: logical place where services/tasks live</li>
              <li><strong>Compute</strong>: where tasks run → EC2 or <strong>Fargate</strong></li>
            </ul>
          </Collapsible>

          <Collapsible title="ECS on EC2 vs ECS on Fargate">
            <h4 className="text-lg font-serif text-text-charcoal mb-2">Option 1: ECS on EC2 (You manage the machines)</h4>
            <p className="text-text-taupe mb-4">What this means (plain English):</p>
            <blockquote className="border-l-4 border-text-charcoal/20 pl-4 text-text-taupe italic mb-4">
              You provide EC2 instances. ECS places containers on those EC2 instances.
            </blockquote>
            <p className="text-text-taupe mb-2">What YOU are responsible for (important):</p>
            <p className="text-text-taupe mb-4">With ECS on EC2, you manage: EC2 instance size, OS updates, Patching, Scaling EC2 up/down, Disk space, Failures of EC2</p>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">Option 2: ECS on Fargate (Serverless containers)</h4>
            <p className="text-text-taupe mb-4">Now the magic part.</p>
            <blockquote className="border-l-4 border-accent-moss pl-4 text-text-charcoal italic mb-4">
              Fargate is AWS saying: &quot;Don&apos;t think about servers at all.&quot;
            </blockquote>
            <p className="text-text-taupe mb-4">You tell ECS: &quot;I want 1 container&quot;, &quot;Give it 0.5 CPU and 1 GB RAM&quot;</p>
            <p className="text-text-taupe mb-4">AWS: Picks machines, Runs the container, Handles scaling, Handles failures</p>
            <p className="text-text-taupe mb-4">You never see: EC2, OS, Host machines</p>

            <table className="w-full mb-6 text-text-taupe">
              <thead>
                <tr className="border-b border-text-charcoal/20">
                  <th className="text-left py-2">Need</th>
                  <th className="text-left py-2">EC2</th>
                  <th className="text-left py-2">Fargate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-text-charcoal/10">
                  <td className="py-2">Control over servers</td>
                  <td className="py-2 text-accent-moss">Yes</td>
                  <td className="py-2 text-accent-terracotta">No</td>
                </tr>
                <tr className="border-b border-text-charcoal/10">
                  <td className="py-2">No server management</td>
                  <td className="py-2 text-accent-terracotta">No</td>
                  <td className="py-2 text-accent-moss">Yes</td>
                </tr>
                <tr className="border-b border-text-charcoal/10">
                  <td className="py-2">Simple setup</td>
                  <td className="py-2 text-accent-terracotta">No</td>
                  <td className="py-2 text-accent-moss">Yes</td>
                </tr>
                <tr className="border-b border-text-charcoal/10">
                  <td className="py-2">Cost predictability</td>
                  <td className="py-2 text-accent-moss">Yes</td>
                  <td className="py-2 text-accent-sand">Warning</td>
                </tr>
                <tr>
                  <td className="py-2">Beginner friendly</td>
                  <td className="py-2 text-accent-terracotta">No</td>
                  <td className="py-2 text-accent-moss">Yes</td>
                </tr>
              </tbody>
            </table>
          </Collapsible>

          <KeyTakeaway variant="green">
            ECS itself does NOT run containers. ECS only decides what should run and how many. The actual execution happens on: EC2 (you manage) OR Fargate (AWS manages).
          </KeyTakeaway>

          <Terminal
            title="Test Your Live App"
            lines={[
              { type: "comment", content: "Get ALB URL from Terraform output" },
              { type: "command", content: "terraform output alb_dns_name" },
              { type: "output", content: "proj2-alb-123456789.us-east-1.elb.amazonaws.com" },
              { type: "comment", content: "" },
              { type: "comment", content: "Test the app" },
              { type: "command", content: "curl http://proj2-alb-123456789.us-east-1.elb.amazonaws.com/" },
              { type: "output", content: '{"message":"Hello from ECS Fargate!","service":"proj2-app"}' },
              { type: "comment", content: "" },
              { type: "command", content: "curl http://proj2-alb-123456789.us-east-1.elb.amazonaws.com/health" },
              { type: "output", content: '{"status":"ok","timestamp":"2026-01-18T12:00:00"}' },
            ]}
          />

          <RealTalk>
            When you see your app running on a real public URL for the first time - that feeling never gets old. You built this. It&apos;s live. Real users could access it right now.
          </RealTalk>
        </div>

        <OrganicDivider variant="branch" />

        {/* ============================================ */}
        {/* PHASE 7: PHASE F - Monitoring */}
        {/* ============================================ */}
        <div
          ref={(el) => { phaseRefs.current[7] = el; }}
          data-phase="7"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <PhaseHeader phaseNumber="F" title="Monitoring & Alerting" accentColor="sage" />
            <div className="flex flex-wrap gap-2">
              <BookmarkButton phaseId={7} phaseName="Phase F" projectSlug="terraform-ecs-deployment" />
              <ShareButtons title="Phase F: Monitoring" phaseId={7} />
              <PersonalNotes phaseId={7} phaseName="Phase F" projectSlug="terraform-ecs-deployment" />
            </div>
          </div>

          <LaunchChecklist
            items={[
              { label: "Time", value: "~12 min", icon: "clock" },
              { label: "Mode", value: "AWS Console + Terraform", icon: "code" },
              { label: "Need", value: "Phase E (app running)", icon: "check" },
              { label: "Why", value: "Know when things break", icon: "warning" },
            ]}
          />

          {/* Content from PDF - verbatim */}
          <p className="text-lg text-text-taupe leading-relaxed mb-6">
            In Phase F, we set up monitoring and alerting to know when something goes wrong with our application. We created an SNS (Simple Notification Service) topic and subscribed your email to it, so you receive notifications when alarms trigger. We then created 7 CloudWatch Alarms that monitor critical metrics: high CPU utilization ({">"}80%), high memory utilization ({">"}80%), HTTP 5xx errors (server errors), HTTP 4xx errors (client errors), unhealthy targets in the load balancer, high ALB response time, and low running task count. When any of these thresholds are breached, you get an email alert. We also built a CloudWatch Dashboard that displays real-time graphs of request count, response times, error rates, CPU/memory usage, healthy host count, and running tasks — giving you a single pane of glass to monitor your application&apos;s health. This transforms the setup from &quot;hope it works&quot; to &quot;know it works&quot; — you&apos;ll be notified of problems before users even notice them.
          </p>

          <Collapsible title="What is CloudWatch? (Simple)" defaultOpen={true}>
            <p className="text-lg text-text-taupe leading-relaxed mb-4">
              <strong>Amazon Web Services CloudWatch</strong> is AWS&apos;s service for <strong>monitoring, logs, and alerts</strong>.
            </p>
            <p className="text-text-taupe mb-4">CloudWatch answers 3 questions:</p>
            <ol className="list-decimal list-inside text-text-taupe ml-4 mb-4">
              <li>&quot;<em>What is happening right now?</em>&quot; (metrics)</li>
              <li>&quot;<em>What happened?</em>&quot; (logs)</li>
              <li>&quot;<em>Should I be alerted?</em>&quot; (alarms)</li>
            </ol>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">CloudWatch Metrics (numbers over time)</h4>
            <p className="text-text-taupe mb-2">What they are: Automatic measurements AWS collects every few seconds/minutes.</p>
            <p className="text-text-taupe mb-2">Examples you&apos;ll actually see:</p>
            <ul className="list-disc list-inside text-text-taupe ml-4 mb-4">
              <li>EC2: CPUUtilization, NetworkIn/Out</li>
              <li>ALB: RequestCount, TargetResponseTime, HTTP 5xx</li>
              <li>ECS: CPUUtilization, MemoryUtilization</li>
              <li>RDS: CPU, FreeStorageSpace</li>
            </ul>
          </Collapsible>

          <KeyTakeaway variant="yellow">
            This transforms the setup from &quot;hope it works&quot; to &quot;know it works&quot; — you&apos;ll be notified of problems before users even notice them.
          </KeyTakeaway>
        </div>

        <OrganicDivider variant="wave" />

        {/* ============================================ */}
        {/* PHASE 8: PHASE G - CI/CD Pipeline */}
        {/* ============================================ */}
        <div
          ref={(el) => { phaseRefs.current[8] = el; }}
          data-phase="8"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <PhaseHeader phaseNumber="G" title="CI/CD Pipeline with AWS CodePipeline" accentColor="sand" />
            <div className="flex flex-wrap gap-2">
              <BookmarkButton phaseId={8} phaseName="Phase G" projectSlug="terraform-ecs-deployment" />
              <ShareButtons title="Phase G: CI/CD Pipeline" phaseId={8} />
              <PersonalNotes phaseId={8} phaseName="Phase G" projectSlug="terraform-ecs-deployment" />
            </div>
          </div>

          <LaunchChecklist
            items={[
              { label: "Time", value: "~15 min", icon: "clock" },
              { label: "Mode", value: "AWS Console setup", icon: "code" },
              { label: "Need", value: "Phase F + GitHub account", icon: "tool" },
              { label: "Level up", value: "Push to deploy", icon: "rocket" },
            ]}
          />

          {/* Content from PDF - verbatim */}
          <p className="text-lg text-text-taupe leading-relaxed mb-6">
            In Phase G, we built an automated CI/CD pipeline using AWS CodePipeline and CodeBuild so that code changes automatically deploy to production. We created a CodeStar Connection to link AWS with your GitHub repository (requires one-time manual authorization in the AWS Console). We set up an S3 bucket to store pipeline artifacts, and created IAM roles with the necessary permissions for CodeBuild and CodePipeline to access ECR, ECS, and other services. We wrote a buildspec.yml file that tells CodeBuild exactly what to do: log into ECR, build the Docker image from the app/ directory, tag it with the commit hash, push it to ECR, and generate an imagedefinitions.json file that tells ECS which image to deploy. The pipeline has three stages: Source (pulls code from GitHub), Build (runs CodeBuild), and Deploy (updates ECS service with the new image using rolling deployment). Now, whenever you git push to the main branch, the entire build-and-deploy process runs automatically in about 5-7 minutes — no manual steps required.
          </p>

          <Collapsible title="AWS CI/CD Services Explained" defaultOpen={true}>
            <h4 className="text-lg font-serif text-text-charcoal mb-2">1) CodeCommit — &quot;Where your code lives&quot; (Git repo)</h4>
            <p className="text-text-taupe mb-4">AWS&apos;s managed <strong>Git repository</strong> (like GitHub, GitLab). So CodeCommit = source code storage + trigger</p>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">2) CodeBuild — &quot;Build + test + create artifacts&quot;</h4>
            <p className="text-text-taupe mb-4">A managed build server that: installs dependencies, runs tests, builds Docker images, produces &quot;artifacts&quot; (outputs). So CodeBuild = compiler + tester + docker builder</p>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">3) CodeDeploy — &quot;Deployment automation&quot;</h4>
            <p className="text-text-taupe mb-4">A deployment service that can deploy to: EC2 (classic), Lambda, ECS (blue/green deployments). So CodeDeploy = deployment engine, especially for EC2 and advanced ECS strategies</p>

            <h4 className="text-lg font-serif text-text-charcoal mb-2">4) CodePipeline — &quot;The conductor / orchestrator&quot;</h4>
            <p className="text-text-taupe mb-4">CodePipeline connects the whole CI/CD flow into stages. It doesn&apos;t &quot;build&quot; or &quot;deploy&quot; by itself. It <strong>calls other services</strong> in order. So CodePipeline = the workflow manager</p>
          </Collapsible>

          <Terminal
            title="Pipeline Flow"
            lines={[
              { type: "comment", content: "Stage 1: Source" },
              { type: "output", content: "- Get latest code from GitHub" },
              { type: "output", content: "- Trigger: git push" },
              { type: "comment", content: "" },
              { type: "comment", content: "Stage 2: Build (CodeBuild)" },
              { type: "output", content: "- Run tests" },
              { type: "output", content: "- Build Docker image" },
              { type: "output", content: "- Push to ECR" },
              { type: "output", content: "- Generate imagedefinitions.json" },
              { type: "comment", content: "" },
              { type: "comment", content: "Stage 3: Deploy (ECS Deploy action)" },
              { type: "output", content: "- Update ECS service to new image" },
              { type: "output", content: "- ECS starts new tasks" },
              { type: "output", content: "- ALB health checks" },
              { type: "output", content: "- Old tasks replaced (rolling update)" },
            ]}
          />

          <KeyTakeaway variant="green">
            Now, whenever you git push to the main branch, the entire build-and-deploy process runs automatically — no manual steps required.
          </KeyTakeaway>

          <RealTalk>
            CI/CD is the turning point from &quot;I&apos;m learning&quot; to &quot;I&apos;m building like a professional.&quot; Automated deployments are how real teams ship code.
          </RealTalk>
        </div>

        <OrganicDivider variant="terrain" />

        {/* ============================================ */}
        {/* PHASE 9: PHASE H - Auto-Scaling */}
        {/* ============================================ */}
        <div
          ref={(el) => { phaseRefs.current[9] = el; }}
          data-phase="9"
          className="mb-16 scroll-mt-32"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <PhaseHeader phaseNumber="H" title="Auto-Scaling with Fargate Spot" accentColor="sage" />
            <div className="flex flex-wrap gap-2">
              <BookmarkButton phaseId={9} phaseName="Phase H" projectSlug="terraform-ecs-deployment" />
              <ShareButtons title="Phase H: Auto-Scaling" phaseId={9} />
              <PersonalNotes phaseId={9} phaseName="Phase H" projectSlug="terraform-ecs-deployment" />
            </div>
          </div>

          <LaunchChecklist
            items={[
              { label: "Time", value: "~12 min", icon: "clock" },
              { label: "Mode", value: "Terraform + cost optimization", icon: "code" },
              { label: "Need", value: "Everything up to Phase G", icon: "check" },
              { label: "Boss level", value: "Production-ready infra", icon: "rocket" },
            ]}
          />

          {/* Content from PDF - verbatim */}
          <p className="text-lg text-text-taupe leading-relaxed mb-6">
            In Phase H, we implemented auto-scaling and cost optimization for our ECS service. We configured Fargate Spot as a capacity provider, which uses AWS&apos;s spare compute capacity at up to 70% discount compared to regular Fargate — with the tradeoff that tasks can be interrupted with 2 minutes notice (we keep at least 1 task on regular Fargate for reliability). We set up Application Auto Scaling with two target tracking policies: one that scales based on CPU utilization (target 70%) and another based on ALB request count (target 100 requests per target per minute). When load increases, tasks scale out quickly (60-second cooldown); when load decreases, tasks scale in slowly (300-second cooldown) to avoid flapping. We also added scheduled scaling to save costs: at 10 PM UTC the service scales to 0 tasks (complete shutdown), and at 8 AM UTC it scales back up to 1-4 tasks. The capacity provider strategy uses an 80/20 split — 80% Fargate Spot, 20% regular Fargate. Combined, these optimizations reduce compute costs by roughly 83% compared to running regular Fargate 24/7.
          </p>

          <BeforeAfterComparison
            title="Cost Optimization"
            rows={[
              { before: "Regular Fargate 24/7", after: "Fargate Spot (70% discount)" },
              { before: "Fixed task count", after: "Auto-scaling based on CPU/requests" },
              { before: "Running at night", after: "Scheduled scaling to 0 at night" },
              { before: "100% Fargate", after: "80/20 Spot/Regular split" },
            ]}
          />

          <KeyTakeaway variant="blue">
            Combined, these optimizations reduce compute costs by roughly 83% compared to running regular Fargate 24/7.
          </KeyTakeaway>

          <Quiz
            title="Final Quiz"
            questions={[
              {
                question: "What is Fargate Spot?",
                options: [
                  "A premium tier of Fargate",
                  "AWS spare compute capacity at up to 70% discount",
                  "A monitoring service",
                  "A networking feature",
                ],
                correctIndex: 1,
                explanation: "Fargate Spot uses AWS's spare capacity at significant discounts, but tasks can be interrupted with 2 minutes notice.",
              },
              {
                question: "What triggers CodePipeline to run?",
                options: [
                  "A manual button click only",
                  "git push to the configured branch",
                  "AWS Console login",
                  "ECS health check failure",
                ],
                correctIndex: 1,
                explanation: "CodePipeline monitors your Git repository and automatically triggers when code is pushed to the configured branch.",
              },
              {
                question: "What does the ECS Service do?",
                options: [
                  "Stores Docker images",
                  "Maintains desired task count and replaces unhealthy tasks",
                  "Routes network traffic",
                  "Manages IAM permissions",
                ],
                correctIndex: 1,
                explanation: "The ECS Service ensures the desired number of tasks are always running and automatically replaces any that fail.",
              },
            ]}
            onComplete={(score, total) => {
              if (score / total >= 0.8) triggerCelebration(9);
            }}
          />
        </div>

        {/* Conclusion */}
        <div className="mb-16 p-8 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
          <h2 className="text-3xl font-serif text-text-charcoal mb-4">
            Congratulations!
          </h2>
          <p className="text-lg text-text-taupe leading-relaxed mb-4">
            You&apos;ve successfully built a production-grade AWS infrastructure with:
          </p>
          <ul className="list-disc list-inside text-text-taupe ml-4 mb-6">
            <li>Flask API containerized with Docker</li>
            <li>VPC with public/private subnets across 2 AZs</li>
            <li>Application Load Balancer with health checks</li>
            <li>ECS Fargate running your containers serverlessly</li>
            <li>CloudWatch monitoring with 7 alarms</li>
            <li>Automated CI/CD pipeline with CodePipeline</li>
            <li>Auto-scaling with Fargate Spot for cost optimization</li>
          </ul>
          <p className="text-text-charcoal font-serif text-lg">
            This is real production infrastructure used by companies. You now have the skills employers look for!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TerraformECSProject;
