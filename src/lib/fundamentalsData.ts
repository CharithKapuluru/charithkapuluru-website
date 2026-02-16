export interface FundamentalsTopic {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  icon: string;
  readingTime: string;
  sectionCount: number;
  tags: string[];
  gradient: string;
}

export interface FundamentalsCategory {
  id: string;
  label: string;
  description: string;
}

export const categories: FundamentalsCategory[] = [
  {
    id: "computing-basics",
    label: "Computing Basics",
    description:
      "Virtual machines, operating systems, servers, and how computers actually work.",
  },
  {
    id: "linux",
    label: "Linux & Command Line",
    description:
      "Linux fundamentals, distributions, terminal commands, and why Linux powers the internet.",
  },
  {
    id: "networking",
    label: "Networking & Security",
    description:
      "SSH, protocols, networking basics, and security fundamentals.",
  },
];

export const topics: FundamentalsTopic[] = [
  {
    id: "1",
    slug: "computing-basics",
    title: "Computing Basics",
    subtitle: "VMs, Linux, Servers & More",
    description:
      "Everything you need to know about virtual machines, operating systems, Linux, servers, kernels, SSH, and essential terminal commands — explained with real-world analogies.",
    category: "computing-basics",
    icon: "server",
    readingTime: "35 min",
    sectionCount: 9,
    tags: [
      "VMs",
      "Linux",
      "OS",
      "Kernel",
      "Servers",
      "SSH",
      "Ubuntu",
      "Terminal",
    ],
    gradient: "from-accent-moss/20 via-accent-sage/10 to-bg-cream",
  },
];

export function getTopicBySlug(slug: string): FundamentalsTopic | undefined {
  return topics.find((t) => t.slug === slug);
}
