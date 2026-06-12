import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, getProjectBySlug } from "@/lib/projectsData";
import DevSecOpsProject from "@/components/projects/DevSecOpsProject";
import TerraformECSProject from "@/components/projects/TerraformECSProject";
import LinuxSysAdminProject from "@/components/projects/LinuxSysAdminProject";

// Generate static params for all projects
export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Generate metadata for each project page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Charith Kapuluru`,
    description: project.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-bg-paper">
      {/* Project Content */}
      {slug === "devsecops-pipeline" && <DevSecOpsProject />}
      {slug === "terraform-ecs-deployment" && <TerraformECSProject />}
      {slug === "linux-sysadmin-deep-dive" && <LinuxSysAdminProject />}

      {/* Fallback for future projects */}
      {slug !== "devsecops-pipeline" && slug !== "terraform-ecs-deployment" && slug !== "linux-sysadmin-deep-dive" && (
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-6xl py-16">
          <h1 className="text-4xl md:text-5xl font-serif text-text-charcoal mb-8">
            {project.title}
          </h1>
          <p className="text-lg text-text-taupe mb-8">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm font-mono bg-bg-cream text-text-olive rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="mt-8 text-text-taupe italic">
            Content coming soon...
          </p>
        </div>
      )}
    </main>
  );
}
