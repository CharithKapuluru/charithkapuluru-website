export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  phaseCount?: number;
  gradient: string;
  icon: "pipeline" | "cloud" | "security" | "api" | "linux";
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
  {
    id: "2",
    slug: "terraform-ecs-deployment",
    title: "AWS ECS Fargate with Terraform",
    subtitle: "Infrastructure as Code",
    description:
      "Deploy containerized applications to AWS ECS Fargate using Terraform, with CI/CD pipelines, monitoring, and auto-scaling.",
    technologies: ["Flask", "Terraform", "AWS", "Docker", "CodePipeline"],
    phaseCount: 8,
    gradient: "from-amber-500/20 via-orange-400/10 to-bg-cream",
    icon: "cloud",
  },
  {
    id: "3",
    slug: "linux-sysadmin-deep-dive",
    title: "Linux SysAdmin Deep Dive",
    subtitle: "From Zero to Production Server",
    description:
      "A hands-on Linux system administration project — building real scripts, hardening a server, and automating everything from scratch on an Ubuntu VM.",
    technologies: [
      "Linux",
      "Bash",
      "systemd",
      "Docker",
      "ufw",
      "fail2ban",
      "cron",
      "LVM",
    ],
    phaseCount: 7,
    gradient: "from-emerald-600/20 via-green-400/10 to-bg-cream",
    icon: "linux",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
