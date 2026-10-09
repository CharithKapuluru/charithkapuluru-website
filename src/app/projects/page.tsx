import type { Metadata } from "next";
import SiteNav from "@/components/layout/SiteNav";
import Footer from "@/components/layout/Footer";
import ProjectRows from "@/components/home/ProjectRows";
import { pageOpenGraph } from "@/lib/seo";

const TITLE = "Projects";
const DESCRIPTION = "Three production-style walkthroughs: a DevSecOps pipeline, AWS ECS Fargate with Terraform, and a Linux server built from scratch.";
const CANONICAL = "/projects/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: pageOpenGraph({ title: TITLE, description: DESCRIPTION, path: CANONICAL }),
};

export default function ProjectsPage() {
  return (
    <>
      <SiteNav active="projects" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-14 outline-none sm:px-6 md:py-20">
        <h1 className="text-display-lg text-fg">Projects</h1>
        <p className="mt-4 max-w-[60ch] text-lede text-fg-2">Three production-style walkthroughs. Each one is a real repository, documented phase by phase.</p>
        <ProjectRows detailed headingLevel="h2" className="mt-12" />
      </main>
      <Footer />
    </>
  );
}
