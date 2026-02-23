"use client";

import Link from "next/link";
import { projects } from "@/lib/projectsData";
import ProjectCard from "@/components/ui/ProjectCard";
import { topics } from "@/lib/fundamentalsData";

const Projects = () => {
  return (
    <section id="projects" className="bg-bg-paper py-24">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-6xl">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-text-charcoal mb-4">
            Projects
          </h2>
          <p className="text-lg font-serif text-text-taupe max-w-2xl leading-relaxed">
            Hands-on tutorials and demonstrations showcasing DevSecOps, cloud
            infrastructure, and modern software development practices.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Fundamentals Section */}
        <div className="mt-16 pt-16 border-t border-text-charcoal/10">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-serif text-text-charcoal mb-4">
              Fundamentals
            </h2>
            <p className="text-lg font-serif text-text-taupe max-w-2xl leading-relaxed">
              Master the building blocks of computing — from virtual machines
              and Linux to servers, kernels, and SSH. Real-world analogies,
              zero assumptions.
            </p>
          </div>

          <Link
            href="/fundamentals"
            className="group block overflow-hidden rounded-xl border border-text-charcoal/10 bg-bg-paper transition-all duration-300 hover:shadow-xl hover:shadow-accent-moss/10 hover:border-accent-moss/20 hover:-translate-y-1"
          >
            <div className="h-36 bg-gradient-to-br from-accent-sage/20 via-accent-moss/10 to-bg-cream relative flex items-center px-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-bg-paper/90 border border-text-charcoal/5 text-text-olive group-hover:text-accent-moss transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-serif text-accent-moss block mb-1">
                    Learning Path
                  </span>
                  <h3 className="text-2xl font-serif text-text-charcoal group-hover:text-accent-moss transition-colors">
                    Fundamentals
                  </h3>
                </div>
              </div>

              <div className="absolute top-4 right-4 flex gap-2">
                <span className="px-3 py-1.5 rounded-full bg-bg-paper/90 border border-text-charcoal/5 text-xs font-medium font-serif text-text-charcoal">
                  {topics.length} Topics
                </span>
                <span className="px-3 py-1.5 rounded-full bg-bg-paper/90 border border-text-charcoal/5 text-xs font-medium font-serif text-accent-moss">
                  Beginner Friendly
                </span>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm font-serif text-text-taupe mb-4 leading-relaxed">
                {topics.length} in-depth articles covering virtual machines, Linux, networking, file permissions, SSH, and more — built for aspiring engineers who want to understand how things actually work.
              </p>
              <div className="flex flex-wrap gap-2">
                {topics.map((t) => (
                  <span key={t.id} className="px-2.5 py-1 text-xs font-serif bg-bg-cream text-text-olive rounded">
                    {t.title}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;
