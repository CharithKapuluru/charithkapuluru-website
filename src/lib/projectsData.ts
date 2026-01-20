export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  phaseCount?: number;
  gradient: string;
  icon: "pipeline" | "cloud" | "security" | "api";
}

export const projects: Project[] = [
  {
    id: "1",
    slug: "devsecops-pipeline",
    title: "Building a DevSecOps Pipeline",
    subtitle: "From Zero to Production",
    description:
      "Learn to build a secure CI/CD pipeline with automated testing, security scanning, and containerization.",
    technologies: ["FastAPI", "Docker", "GitHub Actions", "Semgrep", "Trivy"],
    phaseCount: 8,
    gradient: "from-accent-moss/20 via-accent-sage/10 to-bg-cream",
    icon: "pipeline",
  },
  // Project 2 will be added here later
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
