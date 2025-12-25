"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Brain,
  Cloud,
  Shield,
  Code2,
  Database,
  Server,
  Lock,
  Cpu,
  Network,
  Bot,
  CloudCog,
  ShieldCheck,
} from "lucide-react";

const skillCategories = [
  {
    title: "Artificial Intelligence",
    icon: Brain,
    color: "cyan",
    description: "Building intelligent systems that learn and adapt",
    skills: [
      { name: "Machine Learning", icon: Bot },
      { name: "Deep Learning", icon: Cpu },
      { name: "NLP", icon: Code2 },
      { name: "Computer Vision", icon: Brain },
    ],
    tools: ["TensorFlow", "PyTorch", "Scikit-learn", "OpenAI API", "LangChain", "Hugging Face"],
  },
  {
    title: "Cloud Computing",
    icon: Cloud,
    color: "purple",
    description: "Architecting scalable infrastructure",
    skills: [
      { name: "AWS", icon: CloudCog },
      { name: "GCP", icon: Cloud },
      { name: "DevOps", icon: Server },
      { name: "Kubernetes", icon: Network },
    ],
    tools: ["AWS", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD"],
  },
  {
    title: "Cybersecurity",
    icon: Shield,
    color: "emerald",
    description: "Protecting systems from digital threats",
    skills: [
      { name: "Penetration Testing", icon: ShieldCheck },
      { name: "Network Security", icon: Network },
      { name: "Cryptography", icon: Lock },
      { name: "Security Auditing", icon: Database },
    ],
    tools: ["Burp Suite", "Wireshark", "Metasploit", "Nmap", "OWASP", "Splunk"],
  },
];

const colorClasses = {
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    glow: "group-hover:shadow-cyan-500/20",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    glow: "group-hover:shadow-purple-500/20",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    glow: "group-hover:shadow-emerald-500/20",
  },
};

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-32 relative" ref={ref}>
      {/* Background accent */}
      <div className="absolute inset-0 mesh-gradient opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 font-mono text-sm tracking-wider uppercase mb-4 block">
              Expertise
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Skills & <span className="gradient-text">Technologies</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              My core competencies span across three pillars of modern technology,
              enabling me to build comprehensive solutions.
            </p>
          </motion.div>

          {/* Skills grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {skillCategories.map((category, index) => {
              const colors = colorClasses[category.color as keyof typeof colorClasses];
              const Icon = category.icon;

              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group relative p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all duration-500 hover:shadow-xl ${colors.glow}`}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 ${colors.text}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                  <p className="text-zinc-500 mb-6">{category.description}</p>

                  {/* Skills */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {category.skills.map((skill) => {
                      const SkillIcon = skill.icon;
                      return (
                        <div
                          key={skill.name}
                          className="flex items-center gap-2 p-2 rounded-lg bg-white/5"
                        >
                          <SkillIcon className={`w-4 h-4 ${colors.text}`} />
                          <span className="text-sm text-zinc-300">{skill.name}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tools */}
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Tools & Frameworks</p>
                    <div className="flex flex-wrap gap-2">
                      {category.tools.map((tool) => (
                        <span
                          key={tool}
                          className={`px-3 py-1 text-xs rounded-full ${colors.bg} ${colors.text}`}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 rounded-3xl ${colors.bg} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`} />
                </motion.div>
              );
            })}
          </div>

          {/* Additional tech stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <p className="text-zinc-500 mb-6">Also proficient in</p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "MongoDB", "Redis", "Git", "Linux", "REST APIs", "GraphQL"].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-full border border-white/10 text-zinc-400 hover:border-white/20 hover:text-white transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
