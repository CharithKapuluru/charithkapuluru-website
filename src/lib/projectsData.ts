export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  /** One sentence under the H1 (the former in-content title). */
  lede: string;
  description: string;
  technologies: string[];
  phaseCount: number;
  repo: string;
  outcome: string;
  estimatedTime: string;
  whatYouBuild: string;
  icon: "git-branch" | "cloud-arrow-up" | "terminal";
  /** Firestore progress document id when it differs from the slug (historical data). */
  progressKey?: string;
}

export const projects: Project[] = [
  {
    id: "1",
    slug: "devsecops-pipeline",
    title: "Building a DevSecOps Pipeline",
    subtitle: "From Zero to Production",
    lede: "A FastAPI microservice taken from an empty folder to a production-style pipeline with tests, linting, Docker and two security gates.",
    description: "Learn to build a secure CI/CD pipeline with automated testing, security scanning, and containerization.",
    technologies: ["FastAPI", "Docker", "GitHub Actions", "Semgrep", "Trivy"],
    phaseCount: 8,
    repo: "https://github.com/CharithKapuluru/fastapi-devsecops-demo",
    outcome: "18 automated tests, 700+ lint rules, and Semgrep and Trivy security gates on every merge.",
    estimatedTime: "2 to 3 hours",
    whatYouBuild: "A containerized FastAPI service with tests, linting, GitHub Actions CI/CD and two security scanners in the pipeline.",
    icon: "git-branch",
  },
  {
    id: "2",
    slug: "terraform-ecs-deployment",
    title: "AWS ECS Fargate with Terraform",
    subtitle: "Infrastructure as Code",
    lede: "A Flask app deployed to AWS ECS Fargate with every piece of infrastructure written in Terraform, then wired to CodePipeline and CloudWatch.",
    description: "Deploy containerized applications to AWS ECS Fargate using Terraform, with CI/CD pipelines, monitoring, and auto-scaling.",
    technologies: ["Flask", "Terraform", "AWS", "Docker", "CodePipeline"],
    phaseCount: 10,
    repo: "https://github.com/CharithKapuluru/proj2-ecs-fargate",
    outcome: "About 70% lower compute cost with Fargate Spot and autoscaling, with CloudWatch alarms and SNS alerts in place.",
    estimatedTime: "3 to 4 hours",
    whatYouBuild: "A VPC, ALB, ECS Fargate cluster and ECR registry defined in Terraform, deployed by CodePipeline and monitored in CloudWatch.",
    icon: "cloud-arrow-up",
  },
  {
    id: "3",
    slug: "linux-sysadmin-deep-dive",
    title: "Linux SysAdmin Deep Dive",
    subtitle: "From Zero to Production Server",
    lede: "An Ubuntu VM taken from a blank install to a monitored, hardened, Dockerized server, with real scripts and real mistakes along the way.",
    description: "A hands-on Linux system administration project: building real scripts, hardening a server, and automating everything from scratch on an Ubuntu VM.",
    technologies: ["Linux", "Bash", "systemd", "Docker", "ufw", "fail2ban", "cron", "LVM"],
    phaseCount: 7,
    repo: "https://github.com/CharithKapuluru/linux-sysadmin-deep-dive",
    outcome: "A hardened Ubuntu server with ufw, fail2ban, systemd services, cron jobs and LVM storage you can expand live.",
    estimatedTime: "4 to 5 hours",
    whatYouBuild: "Your own Bash tooling, hardened SSH, a firewall, scheduled jobs, flexible storage and a Docker-based monitoring stack.",
    icon: "terminal",
    progressKey: "linux-sysadmin",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectProgressKey(project: Project): string {
  return project.progressKey ?? project.slug;
}

export function getNextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length];
}
