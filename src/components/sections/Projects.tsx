"use client";

import { projects } from "@/lib/projectsData";
import ProjectCard from "@/components/ui/ProjectCard";

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
      </div>
    </section>
  );
};

export default Projects;
