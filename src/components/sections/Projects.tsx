"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Sentinal AI",
    category: "Artificial Intelligence",
    description: "An autonomous threat detection system leveraging deep learning to identify and neutralize zero-day vulnerabilities in real-time. Designed for enterprise-scale networks processing millions of packets per second.",
    year: "2024",
    image: "bg-accent-moss/10" // Placeholder for image class
  },
  {
    title: "Nebula Ops",
    category: "Cloud Infrastructure",
    description: "Self-healing infrastructure automation platform. Orchestrates multi-cloud environments with Terraform and Kubernetes, ensuring 99.99% availability through automated failover protocols.",
    year: "2023",
    image: "bg-accent-terracotta/10"
  },
  {
    title: "LockVault",
    category: "Cybersecurity",
    description: "Zero-trust authentication protocol implementing biometric verification and quantum-resistant encryption. Redefining identity management for the post-password era.",
    year: "2023",
    image: "bg-accent-sand/10"
  }
];

const Projects = () => {
  return (
    <section id="projects" className="py-32 bg-bg-paper">
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-24">
          <h2 className="text-[10vw] leading-[0.85] font-serif text-text-charcoal tracking-tight">
            Selected <br /> <span className="italic text-text-olive">Works</span>
          </h2>
          <div className="hidden md:block mb-4">
             <span className="block text-xs font-mono text-text-olive mb-1 text-right">CASE STUDIES</span>
             <span className="block text-sm font-sans text-text-charcoal text-right">2023 — Present</span>
          </div>
        </div>

        <div className="space-y-32">
          {projects.map((project, index) => (
            <div key={project.title} className={`group grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Image Side (Alternating) */}
              <div className={`aspect-[4/3] rounded-sm overflow-hidden ${project.image} relative order-1 ${index % 2 === 1 ? 'md:order-2' : 'md:order-1'}`}>
                 <div className="absolute inset-0 bg-text-charcoal/5 group-hover:bg-transparent transition-colors duration-300" />
                 {/* Placeholder for actual project screenshot */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <span className="font-serif italic text-4xl text-text-charcoal">{project.title}</span>
                 </div>
              </div>

              {/* Text Side */}
              <div className={`space-y-8 order-2 ${index % 2 === 1 ? 'md:order-1' : 'md:order-2'}`}>
                <div className="flex items-center justify-between border-b border-text-charcoal pb-4">
                   <span className="font-mono text-sm text-text-olive">0{index + 1}</span>
                   <span className="font-mono text-sm text-text-olive">{project.category}</span>
                </div>
                
                <h3 className="text-5xl md:text-6xl font-serif text-text-charcoal group-hover:italic transition-all duration-300">
                  {project.title}
                </h3>
                
                <p className="text-lg text-text-taupe leading-relaxed max-w-md">
                  {project.description}
                </p>

                <a href="#" className="inline-flex items-center gap-2 text-text-charcoal font-medium hover:text-accent-terracotta transition-colors group/link">
                  View Case Study
                  <ArrowUpRight className="w-5 h-5 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Projects;
