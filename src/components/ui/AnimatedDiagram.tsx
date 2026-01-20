"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DiagramStep {
  id: string;
  label: string;
  description: string;
  icon?: string;
}

interface AnimatedDiagramProps {
  title: string;
  steps: DiagramStep[];
  type?: "pipeline" | "flow" | "cycle";
}

const AnimatedDiagram = ({ title, steps, type = "pipeline" }: AnimatedDiagramProps) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const handlePlay = () => {
    setActiveStep(0);
    setIsPlaying(true);
  };

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setIsPlaying(false);
  };

  return (
    <div className="my-8 p-6 bg-bg-cream rounded-lg border border-text-charcoal/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif text-text-charcoal">{title}</h3>
        <button
          onClick={handlePlay}
          className="px-4 py-1 text-sm font-mono text-accent-moss border border-accent-moss rounded hover:bg-accent-moss hover:text-white transition-colors"
        >
          {isPlaying ? "Playing..." : "▶ Animate"}
        </button>
      </div>

      {/* Pipeline Diagram */}
      {type === "pipeline" && (
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-text-charcoal/10 hidden md:block" />
          <div
            className="absolute top-8 left-0 h-0.5 bg-accent-moss transition-all duration-500 hidden md:block"
            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isComplete = index < activeStep;

              return (
                <motion.div
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`relative flex flex-col items-center cursor-pointer group`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Node */}
                  <motion.div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 transition-all duration-300 ${
                      isActive
                        ? "bg-accent-moss border-accent-moss text-white scale-110 shadow-lg"
                        : isComplete
                        ? "bg-accent-moss/20 border-accent-moss text-accent-moss"
                        : "bg-bg-paper border-text-charcoal/20 text-text-olive group-hover:border-accent-moss/50"
                    }`}
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 1 }}
                  >
                    {step.icon || (index + 1)}
                  </motion.div>

                  {/* Label */}
                  <span
                    className={`mt-3 text-xs font-mono text-center transition-colors ${
                      isActive ? "text-accent-moss font-medium" : "text-text-olive"
                    }`}
                  >
                    {step.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Flow Diagram */}
      {type === "flow" && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isComplete = index < activeStep;

            return (
              <div key={step.id} className="flex items-center">
                <motion.div
                  onClick={() => handleStepClick(index)}
                  className={`px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                    isActive
                      ? "bg-accent-moss border-accent-moss text-white shadow-lg"
                      : isComplete
                      ? "bg-accent-moss/20 border-accent-moss text-accent-moss"
                      : "bg-bg-paper border-text-charcoal/20 text-text-olive hover:border-accent-moss/50"
                  }`}
                  animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 1 }}
                >
                  <div className="text-xl mb-1">{step.icon}</div>
                  <div className="text-xs font-mono whitespace-nowrap">{step.label}</div>
                </motion.div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <motion.div
                    className={`mx-2 text-xl hidden md:block ${
                      index < activeStep ? "text-accent-moss" : "text-text-charcoal/20"
                    }`}
                    animate={index === activeStep - 1 ? { x: [0, 5, 0] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Description Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-6 p-4 bg-bg-paper rounded-lg border border-text-charcoal/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{steps[activeStep].icon}</span>
            <span className="font-serif text-lg text-text-charcoal">{steps[activeStep].label}</span>
          </div>
          <p className="text-text-taupe">{steps[activeStep].description}</p>
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => handleStepClick(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeStep
                ? "bg-accent-moss w-6"
                : index < activeStep
                ? "bg-accent-moss/50"
                : "bg-text-charcoal/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Pre-defined diagrams from Project.docx content
export const cicdPipelineSteps: DiagramStep[] = [
  {
    id: "push",
    label: "Push Code",
    description: "Developer pushes code changes to GitHub repository, triggering the CI/CD pipeline automatically.",
    icon: "📤",
  },
  {
    id: "lint",
    label: "Lint & Format",
    description: "Ruff checks code for bugs, bad practices, and ensures consistent formatting across the codebase.",
    icon: "🧹",
  },
  {
    id: "test",
    label: "Run Tests",
    description: "Pytest runs all automated tests to verify the code works correctly and nothing is broken.",
    icon: "🧪",
  },
  {
    id: "sast",
    label: "Security Scan",
    description: "Semgrep scans source code for security vulnerabilities like SQL injection and XSS.",
    icon: "🔒",
  },
  {
    id: "build",
    label: "Build Image",
    description: "Docker builds a container image containing the application and all its dependencies.",
    icon: "🐳",
  },
  {
    id: "trivy",
    label: "Container Scan",
    description: "Trivy scans the Docker image for known vulnerabilities in dependencies and OS packages.",
    icon: "🛡️",
  },
];

export const dockerFlowSteps: DiagramStep[] = [
  {
    id: "dockerfile",
    label: "Dockerfile",
    description: "A recipe file that contains instructions on how to build the Docker image - what base image to use, what to install, and how to run the app.",
    icon: "📝",
  },
  {
    id: "build",
    label: "Build Image",
    description: "Docker reads the Dockerfile and creates an image - a packaged, read-only template containing everything needed to run the application.",
    icon: "🔨",
  },
  {
    id: "image",
    label: "Docker Image",
    description: "The built image is stored locally or pushed to a registry. It's like a blueprint that can create identical containers anywhere.",
    icon: "📦",
  },
  {
    id: "run",
    label: "Run Container",
    description: "When you run the image, Docker creates a container - a running instance of your application that can handle real requests.",
    icon: "▶️",
  },
  {
    id: "scale",
    label: "Scale Up",
    description: "During high traffic, multiple containers can be created from the same image, distributing the load across them.",
    icon: "📈",
  },
];

export default AnimatedDiagram;
