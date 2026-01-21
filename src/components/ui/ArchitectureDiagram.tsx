"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ComponentInfo {
  id: string;
  name: string;
  description: string;
  details: string[];
  phase?: string;
}

const components: ComponentInfo[] = [
  {
    id: "internet",
    name: "Internet",
    description: "Public internet traffic from users",
    details: [
      "Users access your app via HTTP/HTTPS",
      "Traffic flows through Internet Gateway",
      "DNS resolves to ALB public IP",
    ],
  },
  {
    id: "igw",
    name: "Internet Gateway",
    description: "Allows VPC resources to communicate with the internet",
    details: [
      "Attached to VPC, not subnet",
      "Enables public IP routing",
      "Required for public subnet internet access",
    ],
    phase: "Phase D",
  },
  {
    id: "alb",
    name: "Application Load Balancer",
    description: "Distributes incoming traffic to ECS tasks",
    details: [
      "Listens on port 80 (HTTP)",
      "Health checks on /health endpoint",
      "Routes to target group",
      "Security group: Allow 80 from 0.0.0.0/0",
    ],
    phase: "Phase D",
  },
  {
    id: "public-subnet-1",
    name: "Public Subnet 1",
    description: "10.0.1.0/24 in us-east-1a",
    details: [
      "256 total IPs, 251 usable",
      "Route: 0.0.0.0/0 -> IGW",
      "Contains ALB nodes",
    ],
    phase: "Phase D",
  },
  {
    id: "public-subnet-2",
    name: "Public Subnet 2",
    description: "10.0.2.0/24 in us-east-1b",
    details: [
      "256 total IPs, 251 usable",
      "High availability across AZs",
      "Contains ALB nodes",
    ],
    phase: "Phase D",
  },
  {
    id: "private-subnet-1",
    name: "Private Subnet 1",
    description: "10.0.101.0/24 in us-east-1a",
    details: [
      "No direct internet access",
      "ECS tasks run here",
      "Only receives traffic from ALB",
    ],
    phase: "Phase D",
  },
  {
    id: "private-subnet-2",
    name: "Private Subnet 2",
    description: "10.0.102.0/24 in us-east-1b",
    details: [
      "No direct internet access",
      "ECS tasks run here",
      "High availability",
    ],
    phase: "Phase D",
  },
  {
    id: "ecs-task",
    name: "ECS Fargate Task",
    description: "Your Flask app running in a container",
    details: [
      "Image from ECR",
      "0.25 vCPU, 512MB memory",
      "Port 8080 exposed",
      "Logs to CloudWatch",
    ],
    phase: "Phase E",
  },
  {
    id: "ecr",
    name: "ECR Repository",
    description: "Stores your Docker images",
    details: [
      "Private container registry",
      "Automatic vulnerability scanning",
      "Image tagged with commit hash",
    ],
    phase: "Phase C",
  },
  {
    id: "cloudwatch",
    name: "CloudWatch",
    description: "Monitoring, logs, and alerts",
    details: [
      "Log group: /ecs/proj2-app",
      "Metrics: CPU, Memory, Request count",
      "Alarms for high CPU/errors",
    ],
    phase: "Phase F",
  },
  {
    id: "vpc",
    name: "VPC",
    description: "Virtual Private Cloud - 10.0.0.0/16",
    details: [
      "65,536 IP addresses",
      "Isolated network environment",
      "Contains all subnets",
    ],
    phase: "Phase D",
  },
];

interface ArchitectureDiagramProps {
  onComponentClick?: (componentId: string) => void;
  highlightPhase?: string;
}

const ArchitectureDiagram = ({
  onComponentClick,
  highlightPhase,
}: ArchitectureDiagramProps) => {
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentInfo | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleClick = (id: string) => {
    const component = components.find((c) => c.id === id);
    if (component) {
      setSelectedComponent(component);
      onComponentClick?.(id);
    }
  };

  const isHighlighted = (component: ComponentInfo) => {
    if (!highlightPhase) return true;
    return component.phase === highlightPhase;
  };

  return (
    <div className="my-8 p-6 bg-bg-cream/50 border border-text-charcoal/10 rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-serif text-text-charcoal">
            AWS Architecture Diagram
          </h3>
          <p className="text-sm text-text-olive">
            Click on components to learn more
          </p>
        </div>
      </div>

      <div className="relative">
        {/* SVG Diagram */}
        <svg
          viewBox="0 0 800 500"
          className="w-full h-auto"
          style={{ maxHeight: "500px" }}
        >
          {/* Background */}
          <rect width="800" height="500" fill="#FDFCF8" rx="8" />

          {/* Internet */}
          <g
            onClick={() => handleClick("internet")}
            onMouseEnter={() => setHoveredId("internet")}
            onMouseLeave={() => setHoveredId(null)}
            className="cursor-pointer"
          >
            <circle
              cx="400"
              cy="40"
              r="25"
              fill={hoveredId === "internet" ? "#f97316" : "#3B82F6"}
              className="transition-colors"
            />
            <text
              x="400"
              y="45"
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
            >
              WWW
            </text>
            <text
              x="400"
              y="80"
              textAnchor="middle"
              fill="#4A4641"
              fontSize="11"
            >
              Internet
            </text>
          </g>

          {/* Arrow from Internet to IGW */}
          <path
            d="M400 65 L400 100"
            stroke="#9CA3AF"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />

          {/* VPC Container */}
          <g
            onClick={() => handleClick("vpc")}
            onMouseEnter={() => setHoveredId("vpc")}
            onMouseLeave={() => setHoveredId(null)}
            className="cursor-pointer"
          >
            <rect
              x="50"
              y="110"
              width="700"
              height="370"
              fill="none"
              stroke={hoveredId === "vpc" ? "#f97316" : "#3A5A40"}
              strokeWidth="2"
              strokeDasharray="8 4"
              rx="8"
            />
            <text x="70" y="135" fill="#3A5A40" fontSize="12" fontWeight="bold">
              VPC: 10.0.0.0/16
            </text>
          </g>

          {/* Internet Gateway */}
          <g
            onClick={() => handleClick("igw")}
            onMouseEnter={() => setHoveredId("igw")}
            onMouseLeave={() => setHoveredId(null)}
            className="cursor-pointer"
          >
            <rect
              x="350"
              y="120"
              width="100"
              height="40"
              fill={hoveredId === "igw" ? "#fed7aa" : "#FEF3C7"}
              stroke={hoveredId === "igw" ? "#f97316" : "#F59E0B"}
              strokeWidth="2"
              rx="4"
            />
            <text
              x="400"
              y="145"
              textAnchor="middle"
              fill="#92400E"
              fontSize="11"
              fontWeight="bold"
            >
              Internet Gateway
            </text>
          </g>

          {/* Arrow from IGW to ALB */}
          <path
            d="M400 160 L400 190"
            stroke="#9CA3AF"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />

          {/* Public Subnets Container */}
          <rect
            x="80"
            y="180"
            width="640"
            height="100"
            fill="#DBEAFE"
            fillOpacity="0.5"
            stroke="#3B82F6"
            strokeWidth="1"
            rx="4"
          />
          <text x="100" y="200" fill="#1E40AF" fontSize="10" fontWeight="bold">
            Public Subnets
          </text>

          {/* Public Subnet 1 */}
          <g
            onClick={() => handleClick("public-subnet-1")}
            onMouseEnter={() => setHoveredId("public-subnet-1")}
            onMouseLeave={() => setHoveredId(null)}
            className="cursor-pointer"
          >
            <rect
              x="100"
              y="210"
              width="180"
              height="60"
              fill={hoveredId === "public-subnet-1" ? "#bfdbfe" : "#EFF6FF"}
              stroke={hoveredId === "public-subnet-1" ? "#f97316" : "#3B82F6"}
              strokeWidth="1"
              rx="4"
            />
            <text x="190" y="230" textAnchor="middle" fill="#1E40AF" fontSize="10">
              Public Subnet 1
            </text>
            <text
              x="190"
              y="245"
              textAnchor="middle"
              fill="#6B7280"
              fontSize="9"
            >
              10.0.1.0/24 (us-east-1a)
            </text>
          </g>

          {/* Public Subnet 2 */}
          <g
            onClick={() => handleClick("public-subnet-2")}
            onMouseEnter={() => setHoveredId("public-subnet-2")}
            onMouseLeave={() => setHoveredId(null)}
            className="cursor-pointer"
          >
            <rect
              x="520"
              y="210"
              width="180"
              height="60"
              fill={hoveredId === "public-subnet-2" ? "#bfdbfe" : "#EFF6FF"}
              stroke={hoveredId === "public-subnet-2" ? "#f97316" : "#3B82F6"}
              strokeWidth="1"
              rx="4"
            />
            <text x="610" y="230" textAnchor="middle" fill="#1E40AF" fontSize="10">
              Public Subnet 2
            </text>
            <text
              x="610"
              y="245"
              textAnchor="middle"
              fill="#6B7280"
              fontSize="9"
            >
              10.0.2.0/24 (us-east-1b)
            </text>
          </g>

          {/* ALB */}
          <g
            onClick={() => handleClick("alb")}
            onMouseEnter={() => setHoveredId("alb")}
            onMouseLeave={() => setHoveredId(null)}
            className="cursor-pointer"
          >
            <rect
              x="310"
              y="205"
              width="180"
              height="50"
              fill={hoveredId === "alb" ? "#fde68a" : "#FEF3C7"}
              stroke={hoveredId === "alb" ? "#f97316" : "#F59E0B"}
              strokeWidth="2"
              rx="4"
            />
            <text
              x="400"
              y="225"
              textAnchor="middle"
              fill="#92400E"
              fontSize="11"
              fontWeight="bold"
            >
              Application Load Balancer
            </text>
            <text
              x="400"
              y="242"
              textAnchor="middle"
              fill="#B45309"
              fontSize="9"
            >
              Port 80 (HTTP)
            </text>
          </g>

          {/* Arrows from ALB to Private Subnets */}
          <path
            d="M350 255 L220 300"
            stroke="#9CA3AF"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
          <path
            d="M450 255 L580 300"
            stroke="#9CA3AF"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />

          {/* Private Subnets Container */}
          <rect
            x="80"
            y="290"
            width="640"
            height="130"
            fill="#F3E8FF"
            fillOpacity="0.5"
            stroke="#8B5CF6"
            strokeWidth="1"
            rx="4"
          />
          <text x="100" y="310" fill="#6D28D9" fontSize="10" fontWeight="bold">
            Private Subnets
          </text>

          {/* Private Subnet 1 */}
          <g
            onClick={() => handleClick("private-subnet-1")}
            onMouseEnter={() => setHoveredId("private-subnet-1")}
            onMouseLeave={() => setHoveredId(null)}
            className="cursor-pointer"
          >
            <rect
              x="100"
              y="320"
              width="180"
              height="90"
              fill={hoveredId === "private-subnet-1" ? "#e9d5ff" : "#FAF5FF"}
              stroke={hoveredId === "private-subnet-1" ? "#f97316" : "#8B5CF6"}
              strokeWidth="1"
              rx="4"
            />
            <text
              x="190"
              y="340"
              textAnchor="middle"
              fill="#6D28D9"
              fontSize="10"
            >
              Private Subnet 1
            </text>
            <text
              x="190"
              y="355"
              textAnchor="middle"
              fill="#6B7280"
              fontSize="9"
            >
              10.0.101.0/24 (us-east-1a)
            </text>

            {/* ECS Task in Subnet 1 */}
            <g
              onClick={(e) => {
                e.stopPropagation();
                handleClick("ecs-task");
              }}
              onMouseEnter={() => setHoveredId("ecs-task")}
              onMouseLeave={() => setHoveredId(null)}
            >
              <rect
                x="130"
                y="365"
                width="120"
                height="35"
                fill={hoveredId === "ecs-task" ? "#bbf7d0" : "#DCFCE7"}
                stroke={hoveredId === "ecs-task" ? "#f97316" : "#22C55E"}
                strokeWidth="1"
                rx="4"
              />
              <text
                x="190"
                y="380"
                textAnchor="middle"
                fill="#166534"
                fontSize="9"
                fontWeight="bold"
              >
                ECS Fargate Task
              </text>
              <text
                x="190"
                y="393"
                textAnchor="middle"
                fill="#15803D"
                fontSize="8"
              >
                Flask App :8080
              </text>
            </g>
          </g>

          {/* Private Subnet 2 */}
          <g
            onClick={() => handleClick("private-subnet-2")}
            onMouseEnter={() => setHoveredId("private-subnet-2")}
            onMouseLeave={() => setHoveredId(null)}
            className="cursor-pointer"
          >
            <rect
              x="520"
              y="320"
              width="180"
              height="90"
              fill={hoveredId === "private-subnet-2" ? "#e9d5ff" : "#FAF5FF"}
              stroke={hoveredId === "private-subnet-2" ? "#f97316" : "#8B5CF6"}
              strokeWidth="1"
              rx="4"
            />
            <text
              x="610"
              y="340"
              textAnchor="middle"
              fill="#6D28D9"
              fontSize="10"
            >
              Private Subnet 2
            </text>
            <text
              x="610"
              y="355"
              textAnchor="middle"
              fill="#6B7280"
              fontSize="9"
            >
              10.0.102.0/24 (us-east-1b)
            </text>

            {/* ECS Task in Subnet 2 */}
            <rect
              x="550"
              y="365"
              width="120"
              height="35"
              fill="#DCFCE7"
              stroke="#22C55E"
              strokeWidth="1"
              rx="4"
            />
            <text
              x="610"
              y="380"
              textAnchor="middle"
              fill="#166534"
              fontSize="9"
              fontWeight="bold"
            >
              ECS Fargate Task
            </text>
            <text
              x="610"
              y="393"
              textAnchor="middle"
              fill="#15803D"
              fontSize="8"
            >
              Flask App :8080
            </text>
          </g>

          {/* ECR (outside VPC) */}
          <g
            onClick={() => handleClick("ecr")}
            onMouseEnter={() => setHoveredId("ecr")}
            onMouseLeave={() => setHoveredId(null)}
            className="cursor-pointer"
          >
            <rect
              x="320"
              y="430"
              width="160"
              height="40"
              fill={hoveredId === "ecr" ? "#fecaca" : "#FEE2E2"}
              stroke={hoveredId === "ecr" ? "#f97316" : "#EF4444"}
              strokeWidth="2"
              rx="4"
            />
            <text
              x="400"
              y="450"
              textAnchor="middle"
              fill="#991B1B"
              fontSize="10"
              fontWeight="bold"
            >
              ECR Repository
            </text>
            <text
              x="400"
              y="463"
              textAnchor="middle"
              fill="#B91C1C"
              fontSize="8"
            >
              proj2-app:latest
            </text>
          </g>

          {/* CloudWatch */}
          <g
            onClick={() => handleClick("cloudwatch")}
            onMouseEnter={() => setHoveredId("cloudwatch")}
            onMouseLeave={() => setHoveredId(null)}
            className="cursor-pointer"
          >
            <rect
              x="640"
              y="430"
              width="100"
              height="40"
              fill={hoveredId === "cloudwatch" ? "#c7d2fe" : "#E0E7FF"}
              stroke={hoveredId === "cloudwatch" ? "#f97316" : "#6366F1"}
              strokeWidth="2"
              rx="4"
            />
            <text
              x="690"
              y="450"
              textAnchor="middle"
              fill="#3730A3"
              fontSize="10"
              fontWeight="bold"
            >
              CloudWatch
            </text>
            <text
              x="690"
              y="463"
              textAnchor="middle"
              fill="#4338CA"
              fontSize="8"
            >
              Logs & Metrics
            </text>
          </g>

          {/* Dashed lines to ECR and CloudWatch */}
          <path
            d="M250 400 L350 430"
            stroke="#9CA3AF"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
          <path
            d="M550 400 L450 430"
            stroke="#9CA3AF"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
          <path
            d="M280 380 L640 450"
            stroke="#9CA3AF"
            strokeWidth="1"
            strokeDasharray="4 2"
          />

          {/* Arrow Marker Definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#9CA3AF" />
            </marker>
          </defs>
        </svg>

        {/* Component Info Panel */}
        <AnimatePresence>
          {selectedComponent && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-4 right-4 w-72 bg-bg-paper border border-text-charcoal/10
                         rounded-lg shadow-lg p-4"
            >
              <button
                onClick={() => setSelectedComponent(null)}
                className="absolute top-2 right-2 text-text-olive hover:text-text-charcoal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h4 className="text-lg font-serif text-text-charcoal mb-1">
                {selectedComponent.name}
              </h4>
              {selectedComponent.phase && (
                <span className="inline-block px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded mb-2">
                  {selectedComponent.phase}
                </span>
              )}
              <p className="text-sm text-text-taupe mb-3">
                {selectedComponent.description}
              </p>
              <ul className="space-y-1">
                {selectedComponent.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-text-olive">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-moss mt-1.5 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-text-olive">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-blue-100 border border-blue-400 rounded" />
          <span>Public Subnet</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-purple-100 border border-purple-400 rounded" />
          <span>Private Subnet</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-green-100 border border-green-400 rounded" />
          <span>ECS Task</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-yellow-100 border border-yellow-400 rounded" />
          <span>Load Balancer</span>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
