"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FlowStep {
  id: number;
  title: string;
  description: string;
  component: string;
  details: string[];
  port?: string;
  security?: string;
}

const flowSteps: FlowStep[] = [
  {
    id: 1,
    title: "User Request",
    description: "User opens browser and navigates to your app URL",
    component: "Browser",
    details: [
      "HTTP GET request sent",
      "DNS resolves to ALB IP",
      "Request goes to port 80",
    ],
    port: "HTTP/443",
  },
  {
    id: 2,
    title: "Internet Gateway",
    description: "Request enters VPC through Internet Gateway",
    component: "IGW",
    details: [
      "Routes public traffic into VPC",
      "Attached to VPC, not subnet",
      "No security group filtering here",
    ],
  },
  {
    id: 3,
    title: "Load Balancer",
    description: "ALB receives request and performs health check",
    component: "ALB",
    details: [
      "Security Group: Allow port 80 from 0.0.0.0/0",
      "Checks /health endpoint on targets",
      "Selects healthy ECS task",
    ],
    port: "80",
    security: "ALB Security Group",
  },
  {
    id: 4,
    title: "Target Group",
    description: "ALB forwards to registered ECS task",
    component: "Target Group",
    details: [
      "IP-based target type (awsvpc)",
      "Health check: /health every 30s",
      "Routes to port 8080",
    ],
    port: "8080",
  },
  {
    id: 5,
    title: "ECS Task",
    description: "Flask app processes the request",
    component: "ECS Fargate",
    details: [
      "Security Group: Allow 8080 from ALB SG only",
      "Container runs Flask/Gunicorn",
      "Logs sent to CloudWatch",
    ],
    port: "8080",
    security: "ECS Security Group",
  },
  {
    id: 6,
    title: "Response",
    description: "Flask returns JSON response back through the same path",
    component: "Response",
    details: [
      '{"message": "Hello from ECS Fargate!"}',
      "HTTP 200 OK",
      "Response time logged",
    ],
  },
];

const TrafficFlowAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    if (autoPlay && isPlaying) {
      const timer = setTimeout(() => {
        if (currentStep < flowSteps.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          setAutoPlay(false);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, autoPlay, isPlaying]);

  const handlePlay = () => {
    setCurrentStep(0);
    setIsPlaying(true);
    setAutoPlay(true);
  };

  const handleStep = (direction: "next" | "prev") => {
    setAutoPlay(false);
    if (direction === "next" && currentStep < flowSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else if (direction === "prev" && currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const getStepColor = (index: number) => {
    if (index < currentStep) return "bg-accent-moss text-white";
    if (index === currentStep) return "bg-amber-500 text-white ring-4 ring-amber-200";
    return "bg-bg-stone text-text-olive";
  };

  return (
    <div className="my-8 p-6 bg-bg-cream/50 border border-text-charcoal/10 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-serif text-text-charcoal">
              Traffic Flow Animation
            </h3>
            <p className="text-sm text-text-olive">
              Step through how requests flow through your infrastructure
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-moss text-white
                       rounded-lg hover:bg-accent-moss/90 transition-colors text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Play All
          </button>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="relative mb-6">
        {/* Connection Line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-bg-stone" />
        <motion.div
          className="absolute top-6 left-6 h-0.5 bg-amber-500"
          initial={{ width: "0%" }}
          animate={{
            width: `${(currentStep / (flowSteps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {flowSteps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                setAutoPlay(false);
                setCurrentStep(index);
              }}
            >
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center
                           font-bold text-sm transition-all ${getStepColor(index)}`}
                animate={{
                  scale: index === currentStep ? 1.1 : 1,
                }}
              >
                {index + 1}
              </motion.div>
              <p
                className={`mt-2 text-xs text-center max-w-16 ${
                  index === currentStep
                    ? "text-text-charcoal font-medium"
                    : "text-text-olive"
                }`}
              >
                {step.component}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Step Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-bg-paper p-6 rounded-lg border border-text-charcoal/10"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs text-amber-600 font-medium">
                Step {currentStep + 1} of {flowSteps.length}
              </span>
              <h4 className="text-lg font-serif text-text-charcoal">
                {flowSteps[currentStep].title}
              </h4>
              <p className="text-text-taupe">
                {flowSteps[currentStep].description}
              </p>
            </div>
            {flowSteps[currentStep].port && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-mono">
                Port {flowSteps[currentStep].port}
              </span>
            )}
          </div>

          {flowSteps[currentStep].security && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="text-sm text-amber-700 font-medium">
                  {flowSteps[currentStep].security}
                </span>
              </div>
            </div>
          )}

          <ul className="space-y-2">
            {flowSteps[currentStep].details.map((detail, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 text-sm text-text-olive"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                {detail.startsWith("{") ? (
                  <code className="font-mono text-xs bg-bg-cream px-2 py-1 rounded">
                    {detail}
                  </code>
                ) : (
                  detail
                )}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => handleStep("prev")}
          disabled={currentStep === 0}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-text-taupe
                     hover:text-text-charcoal disabled:opacity-40 disabled:cursor-not-allowed"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>

        <div className="flex gap-1">
          {flowSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setAutoPlay(false);
                setCurrentStep(index);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? "bg-amber-500" : "bg-bg-stone"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => handleStep("next")}
          disabled={currentStep === flowSteps.length - 1}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-text-taupe
                     hover:text-text-charcoal disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TrafficFlowAnimation;
