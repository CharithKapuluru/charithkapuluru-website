import { Metadata } from "next";
import { notFound } from "next/navigation";
import { topics, getTopicBySlug } from "@/lib/fundamentalsData";
import ComputingBasics from "@/components/fundamentals/ComputingBasics";

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
    return {
      title: "Topic Not Found",
    };
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

      {/* Fallback for future topics */}
      {slug !== "computing-basics" && (
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-6xl py-16">
          <h1 className="text-4xl md:text-5xl font-serif text-text-charcoal mb-8">
            {topic.title}
          </h1>
          <p className="text-lg text-text-taupe mb-8">{topic.description}</p>
          <p className="mt-8 text-text-taupe italic">Content coming soon...</p>
        </div>
      )}
    </main>
  );
}
