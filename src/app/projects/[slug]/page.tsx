import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug, getProjectProgressKey, getNextProject } from "@/lib/projectsData";
import DevSecOpsProject from "@/components/projects/DevSecOpsProject";
import TerraformECSProject from "@/components/projects/TerraformECSProject";
import LinuxSysAdminProject from "@/components/projects/LinuxSysAdminProject";
import ReadingLayout from "@/components/reading/ReadingLayout";
import ReadingHeader from "@/components/reading/ReadingHeader";
import FactsPanel from "@/components/reading/FactsPanel";
import ResumeNotice from "@/components/reading/ResumeNotice";
import PhaseRail from "@/components/reading/PhaseRail";
import ProjectTools from "@/components/reading/ProjectTools";
import NextUp from "@/components/reading/NextUp";
import Footer from "@/components/layout/Footer";

const CONTENT: Record<string, ComponentType> = {
  "devsecops-pipeline": DevSecOpsProject,
  "terraform-ecs-deployment": TerraformECSProject,
  "linux-sysadmin-deep-dive": LinuxSysAdminProject,
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.description, alternates: { canonical: `/projects/${slug}/` } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const Content = CONTENT[slug];
  const progressKey = getProjectProgressKey(project);
  const next = getNextProject(slug);

  return (
    <>
      <ReadingLayout
        crumbs={[{ label: "Projects", href: "/projects" }, { label: project.title }]}
        sheetLabel="Phases"
        header={
          <>
            <ReadingHeader
              eyebrow="Project walkthrough"
              title={project.title}
              lede={project.lede}
            />
            <FactsPanel repo={project.repo} stack={project.technologies} phaseCount={project.phaseCount} estimatedTime={project.estimatedTime} outcome={project.outcome} />
            <ResumeNotice slug={project.slug} progressKey={progressKey} />
          </>
        }
        rail={<PhaseRail progressKey={progressKey} actions={<ProjectTools slug={project.slug} />} />}
        after={<NextUp label="Next project" title={next.title} href={`/projects/${next.slug}`} meta={`${next.phaseCount} phases`} backHref="/projects" backLabel="All projects" />}
      >
        {Content ? <Content /> : <p className="text-fg-2">Content coming soon.</p>}
      </ReadingLayout>
      <Footer />
    </>
  );
}
