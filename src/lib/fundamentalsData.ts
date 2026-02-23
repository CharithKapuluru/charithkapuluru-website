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
    tags: ["VMs", "Linux", "OS", "Kernel", "Servers", "SSH", "Ubuntu", "Terminal"],
    gradient: "from-accent-moss/20 via-accent-sage/10 to-bg-cream",
  },
  {
    id: "2",
    slug: "networking-basics",
    title: "Networking Basics",
    subtitle: "IPs, NAT, SSH & More",
    description:
      "How computers talk to each other — from IP addresses and DHCP to NAT, SSH tunnels, SCP file transfers, and VM networking. The concepts every engineer needs to understand.",
    category: "networking",
    icon: "network",
    readingTime: "30 min",
    sectionCount: 7,
    tags: ["IP Addresses", "DHCP", "NAT", "SSH", "SCP", "Networking", "VM"],
    gradient: "from-accent-terracotta/15 via-accent-sand/10 to-bg-cream",
  },
  {
    id: "3",
    slug: "linux-filesystem",
    title: "Linux Filesystem & Shell",
    subtitle: "Bash, Files, Directories & Users",
    description:
      "What Bash actually is, how files and directories work, the Linux filesystem structure, the root user, switching users with su, and mastering the ls command family.",
    category: "linux",
    icon: "terminal",
    readingTime: "25 min",
    sectionCount: 6,
    tags: ["Bash", "Filesystem", "Files", "Directories", "Root User", "su", "ls"],
    gradient: "from-accent-sage/20 via-accent-moss/10 to-bg-cream",
  },
  {
    id: "4",
    slug: "file-permissions",
    title: "File Permissions",
    subtitle: "chmod, Users & Special Bits",
    description:
      "Linux file permissions demystified — who can read, write, and execute files, how chmod numbers work, reading ls -l output, SSH permission requirements, and advanced SUID/SGID/Sticky bits.",
    category: "linux",
    icon: "lock",
    readingTime: "25 min",
    sectionCount: 7,
    tags: ["chmod", "Permissions", "ls -l", "SUID", "SGID", "SSH", "Security"],
    gradient: "from-accent-moss/15 via-accent-terracotta/5 to-bg-cream",
  },
];

export function getTopicBySlug(slug: string): FundamentalsTopic | undefined {
  return topics.find((t) => t.slug === slug);
}
