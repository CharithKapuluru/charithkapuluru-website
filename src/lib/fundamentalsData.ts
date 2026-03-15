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
  {
    id: "devops",
    label: "DevOps Tools",
    description:
      "Docker, nginx, cron jobs, and the tools that run modern infrastructure.",
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
  {
    id: "5",
    slug: "linux-environment",
    title: "Linux Environment & $PATH",
    subtitle: "$PATH, nano & Command Lookup",
    description:
      "Why typing 'ls' works but your own script doesn't. How Linux finds commands using $PATH, three ways to run your scripts, how to safely modify $PATH, and nano — the terminal text editor.",
    category: "linux",
    icon: "terminal",
    readingTime: "15 min",
    sectionCount: 6,
    tags: ["$PATH", "Environment", "nano", "export", "bashrc", "Scripts"],
    gradient: "from-accent-moss/20 via-accent-sage/10 to-bg-cream",
  },
  {
    id: "6",
    slug: "systemd-and-boot",
    title: "systemd & Boot Process",
    subtitle: "PID 1, systemctl & Linux Boot",
    description:
      "What systemd is, how to control services with systemctl, what daemons are, reading logs with journalctl, and the full Linux boot sequence from power-on to login prompt.",
    category: "linux",
    icon: "server",
    readingTime: "20 min",
    sectionCount: 6,
    tags: ["systemd", "systemctl", "Boot Process", "Daemons", "journalctl", "Services"],
    gradient: "from-accent-terracotta/15 via-accent-sand/10 to-bg-cream",
  },
  {
    id: "7",
    slug: "linux-directories",
    title: "Linux Directories, Inodes & LVM",
    subtitle: "/bin, /etc, Inodes & Storage",
    description:
      "What lives in /bin, /sbin, and /etc. How inodes store file metadata. And LVM — the flexible storage system that lets you expand disk space on a live server in 10 seconds.",
    category: "linux",
    icon: "folder",
    readingTime: "20 min",
    sectionCount: 6,
    tags: ["/bin", "/sbin", "/etc", "Inodes", "LVM", "Filesystem", "Config Files"],
    gradient: "from-accent-sage/20 via-accent-moss/10 to-bg-cream",
  },
  {
    id: "8",
    slug: "ports-firewalls-security",
    title: "Ports, Firewalls & DNS",
    subtitle: "ufw, SSH Hardening & DNS",
    description:
      "What ports are, the well-known port numbers every engineer should know, how ufw firewall works, hardening SSH against brute-force attacks, Fail2ban, and how DNS translates google.com to an IP in 20ms.",
    category: "networking",
    icon: "shield",
    readingTime: "25 min",
    sectionCount: 6,
    tags: ["Ports", "ufw", "Firewall", "SSH Hardening", "Fail2ban", "DNS", "Security"],
    gradient: "from-accent-terracotta/15 via-accent-sand/8 to-bg-cream",
  },
  {
    id: "9",
    slug: "cron-jobs",
    title: "Cron Jobs & Task Scheduling",
    subtitle: "Automate Linux Like a Pro",
    description:
      "How Linux runs tasks automatically while you sleep. The cron schedule format explained, reading and writing crontab files, practical production examples, and how to log cron output.",
    category: "linux",
    icon: "clock",
    readingTime: "15 min",
    sectionCount: 5,
    tags: ["Cron", "crontab", "Scheduling", "Automation", "Bash", "Scripts"],
    gradient: "from-accent-sand/20 via-accent-moss/8 to-bg-cream",
  },
  {
    id: "10",
    slug: "docker-and-nginx",
    title: "Docker & nginx",
    subtitle: "Containers, Images & Web Servers",
    description:
      "Why 'it works on my machine' killed careers. How Docker containers solve environment differences. Container vs VM. Images, Dockerfiles, Docker Hub. And nginx — the web server powering a third of the internet.",
    category: "devops",
    icon: "container",
    readingTime: "25 min",
    sectionCount: 7,
    tags: ["Docker", "Containers", "nginx", "Images", "Dockerfile", "DevOps", "Web Server"],
    gradient: "from-accent-moss/15 via-accent-terracotta/5 to-bg-cream",
  },
];

export function getTopicBySlug(slug: string): FundamentalsTopic | undefined {
  return topics.find((t) => t.slug === slug);
}
