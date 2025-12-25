"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, Brain, Cloud, Shield } from "lucide-react";

const projects = [
  {
    title: "AI-Powered Threat Detection",
    description:
      "Machine learning system for real-time cybersecurity threat detection using deep learning models to identify malicious network patterns.",
    image: "/projects/threat-detection.jpg",
    tags: ["Python", "TensorFlow", "AWS", "Security"],
    category: "ai",
    featured: true,
    github: "https://github.com/charithkapuluru/threat-detection",
    demo: "#",
  },
  {
    title: "Cloud Infrastructure Automation",
    description:
      "Terraform-based infrastructure as code solution for multi-cloud deployments with automated scaling and monitoring.",
    image: "/projects/cloud-infra.jpg",
    tags: ["Terraform", "AWS", "GCP", "Kubernetes"],
    category: "cloud",
    featured: true,
    github: "https://github.com/charithkapuluru/cloud-automation",
    demo: "#",
  },
  {
    title: "Secure Authentication System",
    description:
      "Zero-trust authentication platform with multi-factor authentication, biometric support, and advanced encryption.",
    image: "/projects/auth-system.jpg",
    tags: ["Node.js", "Cryptography", "OAuth", "Security"],
    category: "security",
    featured: true,
    github: "https://github.com/charithkapuluru/secure-auth",
    demo: "#",
  },
  {
    title: "NLP Document Analyzer",
    description:
      "Natural language processing tool for automated document classification and entity extraction.",
    image: "/projects/nlp-analyzer.jpg",
    tags: ["Python", "spaCy", "Transformers", "FastAPI"],
    category: "ai",
    featured: false,
    github: "https://github.com/charithkapuluru/nlp-analyzer",
    demo: "#",
  },
  {
    title: "Kubernetes Security Scanner",
    description:
      "Automated security scanner for Kubernetes clusters identifying misconfigurations and vulnerabilities.",
    image: "/projects/k8s-scanner.jpg",
    tags: ["Go", "Kubernetes", "Security", "Docker"],
    category: "security",
    featured: false,
    github: "https://github.com/charithkapuluru/k8s-scanner",
    demo: "#",
  },
  {
    title: "Serverless Data Pipeline",
    description:
      "Event-driven data processing pipeline using AWS Lambda and Step Functions for real-time analytics.",
    image: "/projects/data-pipeline.jpg",
    tags: ["AWS Lambda", "Python", "DynamoDB", "EventBridge"],
    category: "cloud",
    featured: false,
    github: "https://github.com/charithkapuluru/data-pipeline",
    demo: "#",
  },
];

const categoryIcons = {
  ai: Brain,
  cloud: Cloud,
  security: Shield,
};

const categoryColors = {
  ai: "cyan",
  cloud: "purple",
  security: "emerald",
};

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 font-mono text-sm tracking-wider uppercase mb-4 block">
              Portfolio
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              A selection of projects showcasing my expertise in AI, Cloud, and Security.
            </p>
          </motion.div>

          {/* Featured projects - Bento grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredProjects.map((project, index) => {
              const Icon = categoryIcons[project.category as keyof typeof categoryIcons];
              const color = categoryColors[project.category as keyof typeof categoryColors];

              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group relative rounded-3xl bg-zinc-900/50 border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-500 ${
                    index === 0 ? "md:col-span-2 lg:col-span-2" : ""
                  }`}
                >
                  {/* Project image placeholder */}
                  <div
                    className={`aspect-video bg-gradient-to-br ${
                      color === "cyan"
                        ? "from-cyan-900/30 to-cyan-950/30"
                        : color === "purple"
                        ? "from-purple-900/30 to-purple-950/30"
                        : "from-emerald-900/30 to-emerald-950/30"
                    } relative`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon
                        className={`w-16 h-16 ${
                          color === "cyan"
                            ? "text-cyan-400/50"
                            : color === "purple"
                            ? "text-purple-400/50"
                            : "text-emerald-400/50"
                        }`}
                      />
                    </div>
                    <div className="absolute inset-0 grid-pattern opacity-30" />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>

                  {/* Project info */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon
                        className={`w-4 h-4 ${
                          color === "cyan"
                            ? "text-cyan-400"
                            : color === "purple"
                            ? "text-purple-400"
                            : "text-emerald-400"
                        }`}
                      />
                      <span className="text-xs uppercase tracking-wider text-zinc-500">
                        {project.category === "ai"
                          ? "Artificial Intelligence"
                          : project.category === "cloud"
                          ? "Cloud Computing"
                          : "Cybersecurity"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-white/5 text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Other projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-6 text-zinc-300">Other Projects</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherProjects.map((project, index) => {
                const Icon = categoryIcons[project.category as keyof typeof categoryIcons];
                const color = categoryColors[project.category as keyof typeof categoryColors];

                return (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="group p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Icon
                        className={`w-6 h-6 ${
                          color === "cyan"
                            ? "text-cyan-400"
                            : color === "purple"
                            ? "text-purple-400"
                            : "text-emerald-400"
                        }`}
                      />
                      <div className="flex gap-2">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-500 hover:text-white transition-colors"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-500 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    <h4 className="font-semibold mb-2 group-hover:text-white transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-zinc-500 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-zinc-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* View all button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-12"
          >
            <a
              href="https://github.com/charithkapuluru"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300"
            >
              <Github className="w-4 h-4" />
              View All Projects on GitHub
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
