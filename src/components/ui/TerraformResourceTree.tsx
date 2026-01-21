"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TerraformResource {
  id: string;
  name: string;
  type: string;
  description: string;
  status: "pending" | "creating" | "created";
  children?: TerraformResource[];
  properties?: { key: string; value: string }[];
}

const initialResources: TerraformResource[] = [
  {
    id: "vpc",
    name: "aws_vpc.main",
    type: "VPC",
    description: "Virtual Private Cloud - 10.0.0.0/16",
    status: "pending",
    properties: [
      { key: "cidr_block", value: "10.0.0.0/16" },
      { key: "enable_dns_hostnames", value: "true" },
    ],
    children: [
      {
        id: "igw",
        name: "aws_internet_gateway.main",
        type: "Internet Gateway",
        description: "Enables internet access for VPC",
        status: "pending",
        properties: [{ key: "vpc_id", value: "aws_vpc.main.id" }],
      },
      {
        id: "public-subnet-1",
        name: "aws_subnet.public_1",
        type: "Public Subnet",
        description: "10.0.1.0/24 in us-east-1a",
        status: "pending",
        properties: [
          { key: "cidr_block", value: "10.0.1.0/24" },
          { key: "availability_zone", value: "us-east-1a" },
          { key: "map_public_ip_on_launch", value: "true" },
        ],
      },
      {
        id: "public-subnet-2",
        name: "aws_subnet.public_2",
        type: "Public Subnet",
        description: "10.0.2.0/24 in us-east-1b",
        status: "pending",
        properties: [
          { key: "cidr_block", value: "10.0.2.0/24" },
          { key: "availability_zone", value: "us-east-1b" },
        ],
      },
      {
        id: "private-subnet-1",
        name: "aws_subnet.private_1",
        type: "Private Subnet",
        description: "10.0.101.0/24 in us-east-1a",
        status: "pending",
        properties: [
          { key: "cidr_block", value: "10.0.101.0/24" },
          { key: "availability_zone", value: "us-east-1a" },
        ],
      },
      {
        id: "private-subnet-2",
        name: "aws_subnet.private_2",
        type: "Private Subnet",
        description: "10.0.102.0/24 in us-east-1b",
        status: "pending",
        properties: [
          { key: "cidr_block", value: "10.0.102.0/24" },
          { key: "availability_zone", value: "us-east-1b" },
        ],
      },
      {
        id: "alb-sg",
        name: "aws_security_group.alb",
        type: "Security Group",
        description: "ALB security group - allows HTTP from internet",
        status: "pending",
        properties: [
          { key: "ingress", value: "port 80 from 0.0.0.0/0" },
          { key: "egress", value: "all traffic to 0.0.0.0/0" },
        ],
        children: [
          {
            id: "alb",
            name: "aws_lb.main",
            type: "Application Load Balancer",
            description: "Distributes traffic to ECS tasks",
            status: "pending",
            properties: [
              { key: "load_balancer_type", value: "application" },
              { key: "security_groups", value: "[aws_security_group.alb.id]" },
            ],
            children: [
              {
                id: "target-group",
                name: "aws_lb_target_group.app",
                type: "Target Group",
                description: "Routes to ECS tasks on port 8080",
                status: "pending",
                properties: [
                  { key: "port", value: "8080" },
                  { key: "target_type", value: "ip" },
                  { key: "health_check.path", value: "/health" },
                ],
              },
              {
                id: "listener",
                name: "aws_lb_listener.http",
                type: "HTTP Listener",
                description: "Listens on port 80",
                status: "pending",
                properties: [
                  { key: "port", value: "80" },
                  { key: "protocol", value: "HTTP" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "ecs-sg",
        name: "aws_security_group.ecs",
        type: "Security Group",
        description: "ECS tasks - only allows traffic from ALB",
        status: "pending",
        properties: [
          { key: "ingress", value: "port 8080 from ALB SG" },
          { key: "egress", value: "all traffic to 0.0.0.0/0" },
        ],
        children: [
          {
            id: "ecs-cluster",
            name: "aws_ecs_cluster.main",
            type: "ECS Cluster",
            description: "Logical grouping for ECS services",
            status: "pending",
            properties: [{ key: "name", value: "proj2-cluster" }],
            children: [
              {
                id: "task-def",
                name: "aws_ecs_task_definition.app",
                type: "Task Definition",
                description: "Container configuration",
                status: "pending",
                properties: [
                  { key: "cpu", value: "256" },
                  { key: "memory", value: "512" },
                  { key: "network_mode", value: "awsvpc" },
                ],
              },
              {
                id: "ecs-service",
                name: "aws_ecs_service.app",
                type: "ECS Service",
                description: "Maintains desired task count",
                status: "pending",
                properties: [
                  { key: "desired_count", value: "1" },
                  { key: "launch_type", value: "FARGATE" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

interface ResourceNodeProps {
  resource: TerraformResource;
  depth: number;
  onSelect: (resource: TerraformResource) => void;
  selectedId: string | null;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
}

const ResourceNode = ({
  resource,
  depth,
  onSelect,
  selectedId,
  expandedIds,
  onToggleExpand,
}: ResourceNodeProps) => {
  const isExpanded = expandedIds.has(resource.id);
  const hasChildren = resource.children && resource.children.length > 0;
  const isSelected = selectedId === resource.id;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "created":
        return "bg-accent-moss text-white";
      case "creating":
        return "bg-amber-500 text-white animate-pulse";
      default:
        return "bg-bg-stone text-text-olive";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "VPC":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        );
      case "Security Group":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case "Application Load Balancer":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        );
      case "ECS Cluster":
      case "ECS Service":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
    }
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer
                   transition-all hover:bg-bg-cream ${
                     isSelected ? "bg-amber-50 border border-amber-200" : ""
                   }`}
        style={{ marginLeft: `${depth * 20}px` }}
        onClick={() => onSelect(resource)}
      >
        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(resource.id);
            }}
            className="w-5 h-5 flex items-center justify-center text-text-olive hover:text-text-charcoal"
          >
            <svg
              className={`w-4 h-4 transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
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
        ) : (
          <div className="w-5 h-5" />
        )}

        {/* Status Indicator */}
        <div className={`w-2 h-2 rounded-full ${getStatusColor(resource.status)}`} />

        {/* Type Icon */}
        <div className="text-text-olive">{getTypeIcon(resource.type)}</div>

        {/* Resource Name */}
        <div className="flex-1">
          <code className="text-sm font-mono text-accent-moss">{resource.name}</code>
          <span className="ml-2 text-xs text-text-olive">({resource.type})</span>
        </div>
      </div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {resource.children!.map((child) => (
              <ResourceNode
                key={child.id}
                resource={child}
                depth={depth + 1}
                onSelect={onSelect}
                selectedId={selectedId}
                expandedIds={expandedIds}
                onToggleExpand={onToggleExpand}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TerraformResourceTree = () => {
  const [resources, setResources] = useState<TerraformResource[]>(initialResources);
  const [selectedResource, setSelectedResource] = useState<TerraformResource | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["vpc"]));
  const [isApplying, setIsApplying] = useState(false);

  const getAllResourceIds = (res: TerraformResource[]): string[] => {
    const ids: string[] = [];
    const traverse = (resources: TerraformResource[]) => {
      for (const r of resources) {
        ids.push(r.id);
        if (r.children) traverse(r.children);
      }
    };
    traverse(res);
    return ids;
  };

  const updateResourceStatus = (
    resources: TerraformResource[],
    id: string,
    status: "pending" | "creating" | "created"
  ): TerraformResource[] => {
    return resources.map((r) => {
      if (r.id === id) {
        return { ...r, status };
      }
      if (r.children) {
        return { ...r, children: updateResourceStatus(r.children, id, status) };
      }
      return r;
    });
  };

  const handleApply = async () => {
    setIsApplying(true);
    const allIds = getAllResourceIds(resources);
    setExpandedIds(new Set(allIds));

    for (const id of allIds) {
      setResources((prev) => updateResourceStatus(prev, id, "creating"));
      await new Promise((resolve) => setTimeout(resolve, 500));
      setResources((prev) => updateResourceStatus(prev, id, "created"));
    }

    setIsApplying(false);
  };

  const handleReset = () => {
    const resetStatus = (resources: TerraformResource[]): TerraformResource[] => {
      return resources.map((r) => ({
        ...r,
        status: "pending" as const,
        children: r.children ? resetStatus(r.children) : undefined,
      }));
    };
    setResources(resetStatus(resources));
    setExpandedIds(new Set(["vpc"]));
    setSelectedResource(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="my-8 p-6 bg-bg-cream/50 border border-text-charcoal/10 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-serif text-text-charcoal">
              Terraform Resource Tree
            </h3>
            <p className="text-sm text-text-olive">
              Infrastructure dependency graph
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-sm text-text-taupe hover:text-text-charcoal
                       border border-text-charcoal/10 rounded-lg hover:bg-bg-paper"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white
                       rounded-lg hover:bg-purple-700 transition-colors text-sm
                       disabled:opacity-50"
          >
            {isApplying ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Applying...
              </>
            ) : (
              <>
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
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                terraform apply
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tree View */}
        <div className="bg-bg-paper rounded-lg border border-text-charcoal/10 p-4 max-h-96 overflow-y-auto">
          {resources.map((resource) => (
            <ResourceNode
              key={resource.id}
              resource={resource}
              depth={0}
              onSelect={setSelectedResource}
              selectedId={selectedResource?.id || null}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
            />
          ))}
        </div>

        {/* Details Panel */}
        <div className="bg-bg-paper rounded-lg border border-text-charcoal/10 p-4">
          {selectedResource ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    selectedResource.status === "created"
                      ? "bg-accent-moss"
                      : selectedResource.status === "creating"
                      ? "bg-amber-500 animate-pulse"
                      : "bg-bg-stone"
                  }`}
                />
                <span className="text-xs uppercase tracking-wider text-text-olive">
                  {selectedResource.status}
                </span>
              </div>

              <h4 className="text-lg font-mono text-accent-moss mb-1">
                {selectedResource.name}
              </h4>
              <p className="text-sm text-text-olive mb-4">
                {selectedResource.type}
              </p>
              <p className="text-text-taupe mb-4">{selectedResource.description}</p>

              {selectedResource.properties && (
                <div className="bg-bg-cream rounded-lg p-3">
                  <p className="text-xs text-text-olive mb-2 uppercase tracking-wider">
                    Properties
                  </p>
                  <div className="space-y-1">
                    {selectedResource.properties.map((prop, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <code className="text-purple-600">{prop.key}</code>
                        <span className="text-text-olive">=</span>
                        <code className="text-accent-moss">{prop.value}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-text-olive">
              <p>Select a resource to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-text-olive">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-bg-stone" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Creating</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-moss" />
          <span>Created</span>
        </div>
      </div>
    </div>
  );
};

export default TerraformResourceTree;
