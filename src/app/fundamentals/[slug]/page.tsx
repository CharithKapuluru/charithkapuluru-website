import { Metadata } from "next";
import { notFound } from "next/navigation";
import { topics, getTopicBySlug } from "@/lib/fundamentalsData";
import ComputingBasics from "@/components/fundamentals/ComputingBasics";
import NetworkingBasics from "@/components/fundamentals/NetworkingBasics";
import LinuxFilesystem from "@/components/fundamentals/LinuxFilesystem";
import FilePermissions from "@/components/fundamentals/FilePermissions";

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
    </main>
  );
}
