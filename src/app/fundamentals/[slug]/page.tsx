import { Metadata } from "next";
import { notFound } from "next/navigation";
import { topics, getTopicBySlug } from "@/lib/fundamentalsData";
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

export function generateStaticParams() {
  return topics.map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    return { title: "Topic Not Found" };
  }

  return {
    title: `${topic.title} | Fundamentals | Charith Kapuluru`,
    description: topic.description,
  };
}

export default async function FundamentalsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-bg-paper">
      {slug === "computing-basics" && <ComputingBasics />}
      {slug === "networking-basics" && <NetworkingBasics />}
      {slug === "linux-filesystem" && <LinuxFilesystem />}
      {slug === "file-permissions" && <FilePermissions />}
      {slug === "linux-environment" && <LinuxEnvironment />}
      {slug === "systemd-and-boot" && <SystemdAndBoot />}
      {slug === "linux-directories" && <LinuxDirectories />}
      {slug === "ports-firewalls-security" && <PortsFirewallsSecurity />}
      {slug === "cron-jobs" && <CronJobs />}
      {slug === "docker-and-nginx" && <DockerAndNginx />}
    </main>
  );
}
