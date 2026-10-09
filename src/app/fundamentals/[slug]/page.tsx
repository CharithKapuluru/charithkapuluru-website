import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { topics, categories, getTopicBySlug, getNextTopic } from "@/lib/fundamentalsData";
import { avatarLines } from "@/lib/avatarLines";
import ComputingBasics from "@/components/fundamentals/ComputingBasics";
import NetworkingBasics from "@/components/fundamentals/NetworkingBasics";
import LinuxFilesystem from "@/components/fundamentals/LinuxFilesystem";
import FilePermissions from "@/components/fundamentals/FilePermissions";
import LinuxEnvironment from "@/components/fundamentals/LinuxEnvironment";
import SystemdAndBoot from "@/components/fundamentals/SystemdAndBoot";
import LinuxDirectories from "@/components/fundamentals/LinuxDirectories";
import PortsFirewallsSecurity from "@/components/fundamentals/PortsFirewallsSecurity";
import CronJobs from "@/components/fundamentals/CronJobs";
import DockerAndNginx from "@/components/fundamentals/DockerAndNginx";
import ReadingLayout from "@/components/reading/ReadingLayout";
import ReadingHeader from "@/components/reading/ReadingHeader";
import OnThisPage from "@/components/reading/OnThisPage";
import SignInControl from "@/components/reading/SignInControl";
import AvatarNote from "@/components/reading/AvatarNote";
import NextUp from "@/components/reading/NextUp";
import Footer from "@/components/layout/Footer";
import { pageOpenGraph } from "@/lib/seo";

const CONTENT: Record<string, ComponentType> = {
  "computing-basics": ComputingBasics,
  "networking-basics": NetworkingBasics,
  "linux-filesystem": LinuxFilesystem,
  "file-permissions": FilePermissions,
  "linux-environment": LinuxEnvironment,
  "systemd-and-boot": SystemdAndBoot,
  "linux-directories": LinuxDirectories,
  "ports-firewalls-security": PortsFirewallsSecurity,
  "cron-jobs": CronJobs,
  "docker-and-nginx": DockerAndNginx,
};

export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return { title: "Topic not found" };
  const title = `${topic.title} | Fundamentals | Charith Kapuluru`;
  const canonical = `/fundamentals/${slug}/`;
  return {
    title,
    description: topic.description,
    alternates: { canonical },
    openGraph: pageOpenGraph({ title, description: topic.description, path: canonical }),
  };
}

export default async function FundamentalsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();
  const Content = CONTENT[slug];
  const category = categories.find((c) => c.id === topic.category)?.label;
  const next = getNextTopic(slug);

  return (
    <>
      <ReadingLayout
        crumbs={[{ label: "Fundamentals", href: "/fundamentals" }, { label: topic.title }]}
        sheetLabel="Sections"
        header={
          <ReadingHeader
            eyebrow={category}
            title={topic.title}
            lede={topic.lede}
            meta={[
              { label: "Reading time", value: topic.readingTime },
              { label: "Sections", value: String(topic.sectionCount) },
            ]}
            aside={<AvatarNote pose="read" line={avatarLines[slug]} />}
          />
        }
        rail={
          <>
            <OnThisPage />
            <SignInControl className="mt-6" />
          </>
        }
        after={<NextUp label="Next guide" title={next.title} href={`/fundamentals/${next.slug}`} meta={next.readingTime} backHref="/fundamentals" backLabel="All guides" />}
      >
        {Content ? <Content /> : null}
      </ReadingLayout>
      <Footer />
    </>
  );
}
