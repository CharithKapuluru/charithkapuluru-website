"use client";

import { useState, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { useActivePhase } from "@/hooks/useActivePhase";
import ArticleNav from "@/components/ui/ArticleNav";
import KeyTakeaway from "@/components/ui/KeyTakeaway";
import AnalogyBox from "@/components/ui/AnalogyBox";
import DidYouKnow from "@/components/ui/DidYouKnow";
import Terminal from "@/components/ui/Terminal";
import Quiz from "@/components/ui/Quiz";
import Flashcards from "@/components/ui/Flashcards";
import Confetti from "@/components/ui/Confetti";

const sectionNames = [
  "/bin & /sbin",
  "/etc — Config Files",
  "/etc Examples",
  "Inodes — File Identity",
  "LVM — Flexible Storage",
  "LVM Commands",
];
const navSections = sectionNames.map((label, i) => ({ id: i, label }));

const sectionStyles = [
  { bg: "bg-gradient-to-br from-accent-sage/[0.07] via-bg-paper to-accent-moss/[0.04]" },
  { bg: "bg-bg-cream/40" },
  { bg: "bg-gradient-to-br from-accent-terracotta/[0.04] via-bg-paper to-accent-sand/[0.05]" },
  { bg: "bg-bg-paper" },
  { bg: "bg-gradient-to-br from-accent-moss/[0.06] via-bg-paper to-accent-sage/[0.04]" },
  { bg: "bg-bg-cream/40" },
];

const accentColors = ["sage", "moss", "terracotta", "sage", "moss", "terracotta"];
const accentLineColors: Record<string, string> = {
  moss: "bg-accent-moss",
  terracotta: "bg-accent-terracotta",
  sage: "bg-accent-sage",
  sand: "bg-accent-sand",
};

const quizQuestions = [
  {
    question: "What's the difference between /bin and /sbin?",
    options: [
      "/bin is for scripts, /sbin is for system files",
      "/bin has commands for all users, /sbin has system admin tools (mostly for root)",
      "/bin is faster than /sbin",
      "They are identical",
    ],
    correctIndex: 1,
    explanation: "/bin contains essential commands everyone uses: ls, cp, mv. /sbin contains system administration tools used mostly by root: reboot, fsck, ip. The 's' in sbin stands for 'system'.",
  },
  {
    question: "What lives in /etc?",
    options: [
      "Executable programs for all users",
      "System logs and variable data",
      "Configuration files for the system and installed programs",
      "Temporary files",
    ],
    correctIndex: 2,
    explanation: "/etc is the 'settings folder' of Linux. Configuration files for the whole system live here — /etc/passwd (user accounts), /etc/ssh/sshd_config (SSH settings), /etc/resolv.conf (DNS servers). Most are plain text files.",
  },
  {
    question: "What does an inode NOT contain?",
    options: [
      "File size",
      "The filename",
      "Owner and permissions",
      "Where on disk the data is stored",
    ],
    correctIndex: 1,
    explanation: "Inodes store everything ABOUT the file except the filename. The filename is stored in the directory, which maps names to inode numbers. This is why you can have hard links — multiple names pointing to the same inode.",
  },
  {
    question: "In LVM, what is a Volume Group (VG)?",
    options: [
      "The actual hard disk",
      "A pool of storage created from one or more physical disks",
      "A logical partition you mount",
      "A type of filesystem",
    ],
    correctIndex: 1,
    explanation: "VG = the combined pool of storage. Hard Disk (PV) → Pool (VG) → Buckets (LV). The VG is the water tank — you carve it into Logical Volumes (LVs) that Linux uses as partitions.",
  },
  {
    question: "Why does LVM matter in production?",
    options: [
      "It makes disks faster",
      "It lets you expand disk space in seconds with zero downtime, instead of hours of painful work",
      "It adds encryption",
      "It's required by Linux",
    ],
    correctIndex: 1,
    explanation: "WITHOUT LVM: disk fills up → shut down server → hours of work → data risk. WITH LVM: two commands, 10 seconds, zero downtime. Every production Linux server uses LVM for exactly this reason.",
  },
];

const flashcardsData = [
  { front: "What is /bin?", back: "Essential commands for all users: ls, cp, mv, cat. Required for basic system operation. Even if nothing else is mounted, /bin must be available." },
  { front: "What is /sbin?", back: "System administration tools, mostly for root: reboot, fsck (filesystem check), ip (network config). The 's' stands for system." },
  { front: "What is /etc?", back: "The 'settings folder' of Linux. Configuration files for the system and all installed programs. Most files are plain text — administrators edit them directly." },
  { front: "What is /etc/passwd?", back: "Stores basic info about all user accounts: username, user ID, group ID, home directory, default shell. View with: cat /etc/passwd" },
  { front: "What is an inode?", back: "A file's identity card. Stores size, owner, permissions, timestamps, and where on disk the data is stored. Does NOT store the filename — that's in the directory." },
  { front: "What is LVM?", back: "Logical Volume Manager. Replaces fixed partitions with a flexible pool system. Hard Disk (PV) → Pool (VG) → Buckets (LV). Expand volumes in seconds with zero downtime." },
  { front: "How do you expand a Linux filesystem with LVM?", back: "Two commands: 1) sudo lvextend -L +10G /dev/ubuntu-vg/ubuntu-lv (make bucket bigger) 2) sudo resize2fs /dev/ubuntu-vg/ubuntu-lv (tell filesystem to fill the space)" },
];

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" as const } }),
};

const Section = ({ id, index, children, sectionRef }: { id: string; index: number; children: React.ReactNode; sectionRef: (el: HTMLDivElement | null) => void }) => (
  <section id={id} ref={sectionRef} className={`relative scroll-mt-14 ${sectionStyles[index]?.bg || "bg-bg-paper"}`}>
    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-accent-sage/10 to-transparent" />
    <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-accent-moss/10 to-transparent" />
    <div className="px-6 md:px-12 lg:px-20 xl:px-32 py-20 md:py-28">{children}</div>
  </section>
);

const SectionTitle = ({ title, accent = "sage" }: { title: string; accent?: string }) => (
  <motion.div className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
    <motion.div className={`w-20 h-1.5 ${accentLineColors[accent] || "bg-accent-sage"} mb-6 rounded-full`} variants={fadeUp} custom={0} />
    <motion.h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif text-text-charcoal leading-tight" variants={fadeUp} custom={1}>{title}</motion.h2>
  </motion.div>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <motion.h3 className="text-xl md:text-2xl font-serif text-text-charcoal mt-14 mb-5" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5 }}>{children}</motion.h3>
);

const P = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.p className={`text-text-taupe leading-relaxed ${className}`} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5 }}>{children}</motion.p>
);

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay }}>{children}</motion.div>
);

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="font-mono text-accent-moss bg-accent-moss/8 px-1.5 py-0.5 rounded text-[0.9em]">{children}</code>
);

export default function LinuxDirectories() {
  const [currentSection, setCurrentSection] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const { scrollYProgress } = useScroll();

  const scrollToSection = (id: number) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useActivePhase(sectionRefs, setCurrentSection);

  return (
    <div className="min-h-screen bg-bg-paper font-serif">
      <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-accent-sage z-50 origin-left" style={{ scaleX: scrollYProgress }} />
      <ArticleNav sections={navSections} currentSection={currentSection} onSectionClick={scrollToSection} />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[65vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-sage/10 via-bg-cream to-accent-moss/8" />
        <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="flex flex-col justify-center px-6 md:px-12 lg:px-20 xl:px-32 py-20">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-xs font-mono uppercase tracking-[0.25em] text-accent-moss mb-5">Linux Internals</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-serif text-text-charcoal mb-6 leading-[1.1]">
              Linux Directories,<br /><em className="text-accent-moss not-italic">Inodes &amp; LVM</em>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg text-text-taupe leading-relaxed max-w-xl">
              What&apos;s in /bin vs /sbin? What is /etc? What&apos;s an inode? And how does Linux expand disk space without shutting down? All explained.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="flex gap-6 mt-8 pt-8 border-t border-text-charcoal/10">
              {[{ label: "Sections", value: "6" }, { label: "Read time", value: "20 min" }, { label: "Level", value: "Beginner" }].map(s => (
                <div key={s.label}>
                  <p className="text-xs font-mono uppercase tracking-wider text-text-olive">{s.label}</p>
                  <p className="text-lg font-serif font-semibold text-text-charcoal">{s.value}</p>
                </div>
              ))}
            </motion.div>
          </div>
          <div className="hidden lg:flex items-center justify-center px-12">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.4 }} className="w-full max-w-sm font-mono text-sm">
              <div className="bg-text-charcoal rounded-2xl p-5 shadow-2xl">
                <p className="text-white/40 text-xs mb-3">Linux filesystem</p>
                {[
                  { dir: "/", desc: "root", indent: 0 },
                  { dir: "├── bin/", desc: "user commands", indent: 1 },
                  { dir: "├── sbin/", desc: "admin tools", indent: 1 },
                  { dir: "├── etc/", desc: "config files", indent: 1 },
                  { dir: "│   ├── passwd", desc: "users", indent: 2 },
                  { dir: "│   ├── ssh/", desc: "SSH config", indent: 2 },
                  { dir: "│   └── resolv.conf", desc: "DNS", indent: 2 },
                  { dir: "├── home/", desc: "user folders", indent: 1 },
                  { dir: "└── var/", desc: "logs & data", indent: 1 },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.12 }}
                    className="flex items-center gap-3 py-0.5">
                    <span className="text-[#6ee7b7]">{item.dir}</span>
                    <span className="text-white/30 text-xs">{item.desc}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 0: /bin and /sbin */}
      <Section id="s0" index={0} sectionRef={el => { sectionRefs.current[0] = el; }}>
        <SectionTitle title="/bin and /sbin" accent={accentColors[0]} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Reveal>
            <div className="p-6 rounded-2xl border-2 border-accent-moss/15 bg-accent-moss/5 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-moss/15 flex items-center justify-center font-mono font-bold text-accent-moss">/bin</div>
                <div>
                  <p className="font-serif font-semibold text-text-charcoal">User Binaries</p>
                  <p className="text-xs text-text-taupe">Everyone can use these</p>
                </div>
              </div>
              <ul className="space-y-1.5 text-sm text-text-taupe">
                {["/bin/ls → list files", "/bin/cp → copy files", "/bin/mv → move files", "/bin/cat → read files", "/bin/rm → delete files"].map(cmd => (
                  <li key={cmd} className="font-mono text-xs bg-bg-paper rounded px-2 py-1">{cmd}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="p-6 rounded-2xl border-2 border-accent-terracotta/15 bg-accent-terracotta/5 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-terracotta/15 flex items-center justify-center font-mono font-bold text-accent-terracotta">/sbin</div>
                <div>
                  <p className="font-serif font-semibold text-text-charcoal">System Binaries</p>
                  <p className="text-xs text-text-taupe">Admin / root only</p>
                </div>
              </div>
              <ul className="space-y-1.5 text-sm text-text-taupe">
                {["/sbin/reboot → restart system", "/sbin/fsck → check filesystem", "/sbin/ip → network config", "/sbin/useradd → create users", "/sbin/iptables → firewall rules"].map(cmd => (
                  <li key={cmd} className="font-mono text-xs bg-bg-paper rounded px-2 py-1">{cmd}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
        <AnalogyBox>
          <strong>/bin</strong> = steering wheel, pedals — basic controls everyone uses<br />
          <strong>/sbin</strong> = mechanic&apos;s tools — for admin work under the hood<br />
          <strong>/etc</strong> = car settings and configuration<br />
          <strong>/var</strong> = dashboard logs and usage data
        </AnalogyBox>
        <KeyTakeaway>When you type <Code>ls</Code>, Linux actually runs <Code>/bin/ls</Code>. When you <Code>sudo reboot</Code>, it runs <Code>/sbin/reboot</Code>. $PATH connects the short command name to the full path.</KeyTakeaway>
      </Section>

      {/* Section 1: /etc */}
      <Section id="s1" index={1} sectionRef={el => { sectionRefs.current[1] = el; }}>
        <SectionTitle title="/etc — The Settings Folder" accent={accentColors[1]} />
        <P className="text-lg md:text-xl mb-8">
          <Code>/etc</Code> stores <strong>configuration files for the entire system</strong> and installed programs. Think of it as the &quot;settings folder&quot; of Linux.
        </P>
        <P className="mb-8">These files are mostly plain text — you can open, read, and edit them with a text editor. When you change a setting (SSH port, DNS server, user account), it happens in <Code>/etc</Code>.</P>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { file: "/etc/passwd", desc: "All user accounts on the system", icon: "👤" },
              { file: "/etc/ssh/sshd_config", desc: "SSH server settings — ports, auth methods", icon: "🔑" },
              { file: "/etc/resolv.conf", desc: "Which DNS servers to use", icon: "🌐" },
              { file: "/etc/hosts", desc: "Local DNS overrides — map hostnames to IPs", icon: "📋" },
              { file: "/etc/crontab", desc: "System-wide scheduled tasks", icon: "⏰" },
              { file: "/etc/fstab", desc: "Which disks to mount at boot and where", icon: "💾" },
            ].map((item, i) => (
              <Reveal key={item.file} delay={i * 0.07}>
                <div className="p-4 rounded-xl border border-text-charcoal/8 bg-bg-paper hover:border-accent-moss/20 hover:shadow-md transition-all group">
                  <div className="text-xl mb-2">{item.icon}</div>
                  <code className="font-mono text-xs text-accent-moss block mb-1.5 break-all">{item.file}</code>
                  <p className="text-xs text-text-taupe">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
        <DidYouKnow>The name &ldquo;etc&rdquo; originally stood for &ldquo;etcetera&rdquo; — it was the catch-all folder for everything that didn&apos;t fit elsewhere. Now it&apos;s specifically for configuration files by convention.</DidYouKnow>
      </Section>

      {/* Section 2: /etc examples */}
      <Section id="s2" index={2} sectionRef={el => { sectionRefs.current[2] = el; }}>
        <SectionTitle title="/etc in Practice" accent={accentColors[2]} />
        <H3>/etc/passwd — User Accounts</H3>
        <P className="mb-4">Every user on the system has an entry in this file. Run <Code>cat /etc/passwd</Code> to see it:</P>
        <Reveal>
          <div className="bg-text-charcoal rounded-xl p-5 font-mono text-sm overflow-x-auto mb-6">
            <p className="text-[#6ee7b7]">charith:x:1000:1000:Charith:/home/charith:/bin/bash</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {[
                { part: "charith", desc: "username" },
                { part: "x", desc: "password (stored elsewhere)" },
                { part: "1000", desc: "user ID (UID)" },
                { part: "1000", desc: "group ID (GID)" },
                { part: "Charith", desc: "display name" },
                { part: "/home/charith", desc: "home directory" },
                { part: "/bin/bash", desc: "default shell" },
              ].map(f => (
                <div key={f.part} className="flex gap-2">
                  <span className="text-orange-300">{f.part}</span>
                  <span className="text-white/40">→ {f.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <H3>/etc/ssh/sshd_config — SSH Server Config</H3>
        <Reveal>
          <Terminal lines={[
            { type: "comment", content: "Key SSH settings" },
            { type: "output", content: "Port 22                    # SSH port" },
            { type: "output", content: "PermitRootLogin no         # block direct root login" },
            { type: "output", content: "PasswordAuthentication yes # allow password login" },
            { type: "output", content: "MaxAuthTries 3             # disconnect after 3 fails" },
          ]} />
        </Reveal>
        <H3>/etc/resolv.conf — DNS Servers</H3>
        <Reveal>
          <Terminal lines={[
            { type: "comment", content: "Which DNS servers to ask when resolving domain names" },
            { type: "output", content: "nameserver 8.8.8.8   # Google DNS" },
            { type: "output", content: "nameserver 1.1.1.1   # Cloudflare DNS" },
          ]} />
        </Reveal>
        <KeyTakeaway>Almost every program you install on Linux has its config in <Code>/etc</Code>. Learning to read and edit these files is a core sysadmin skill.</KeyTakeaway>
      </Section>

      {/* Section 3: Inodes */}
      <Section id="s3" index={3} sectionRef={el => { sectionRefs.current[3] = el; }}>
        <SectionTitle title="Inodes — A File's Identity Card" accent={accentColors[3]} />
        <P className="text-lg md:text-xl mb-8">Every file on Linux has two things stored on disk: the <strong>actual data</strong> (the content) and an <strong>inode</strong> (the identity card).</P>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-2xl border-2 border-accent-moss/15 bg-accent-moss/5">
              <p className="text-sm font-mono font-bold text-accent-moss mb-3">INODE — Metadata (identity card)</p>
              <ul className="space-y-1.5 text-sm text-text-taupe">
                {["✅ File size", "✅ Owner (charith)", "✅ Permissions (rw-r--r--)", "✅ Created / Modified / Accessed timestamps", "✅ WHERE on disk the data is stored", "❌ The filename (NOT here!)"].map(item => (
                  <li key={item} className="text-sm">{item}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-2xl border-2 border-accent-terracotta/15 bg-accent-terracotta/5">
              <p className="text-sm font-mono font-bold text-accent-terracotta mb-3">DIRECTORY — Name lookup</p>
              <div className="font-mono text-sm space-y-2 text-text-taupe">
                <p><span className="text-text-charcoal">&quot;notes.txt&quot;</span> → inode #4521</p>
                <p><span className="text-text-charcoal">&quot;backup.sh&quot;</span> → inode #4522</p>
                <p><span className="text-text-charcoal">&quot;config.yml&quot;</span> → inode #4523</p>
                <p className="text-xs mt-3 text-text-olive italic">The directory maps name → inode number. The inode holds everything else.</p>
              </div>
            </div>
          </div>
        </Reveal>
        <AnalogyBox>
          <strong>Patient file folder</strong> = inode (name, age, blood type, room number — metadata ABOUT the patient)<br />
          <strong>The actual patient</strong> = the file&apos;s data (the real content)<br />
          <strong>Hospital reception</strong> = directory (&quot;John Smith is in room 204&quot; — maps name to location)
        </AnalogyBox>
        <H3>See it yourself</H3>
        <Reveal>
          <Terminal lines={[
            { type: "comment", content: "-i flag shows inode numbers" },
            { type: "command", content: "ls -li /etc/passwd" },
            { type: "output", content: "12847 -rw-r--r-- 1 root root 1872 Mar 10 /etc/passwd" },
            { type: "output", content: "↑" },
            { type: "output", content: "inode number — unique ID for this file" },
          ]} />
        </Reveal>
        <DidYouKnow>This is why <strong>hard links</strong> work — two filenames in different directories can point to the same inode number. Both &quot;names&quot; are the same file. Delete one name, the inode (and data) still exists until all names are removed.</DidYouKnow>
      </Section>

      {/* Section 4: LVM */}
      <Section id="s4" index={4} sectionRef={el => { sectionRefs.current[4] = el; }}>
        <SectionTitle title="LVM — Flexible Storage" accent={accentColors[4]} />
        <P className="text-lg mb-6"><strong>LVM (Logical Volume Manager)</strong> solves one of the most painful problems in Linux administration: running out of disk space on a live server.</P>
        <H3>The Problem with Normal Partitions</H3>
        <Reveal>
          <div className="bg-text-charcoal rounded-xl p-5 font-mono text-sm mb-6 overflow-x-auto">
            <p className="text-white/40 mb-2">YOUR HARD DISK (60GB) — fixed partitions:</p>
            <p className="text-orange-300">┌─────────────┬────────────────┬────────┐</p>
            <p className="text-orange-300">│  /boot (2GB)│  / Linux (30GB)│  ???  │</p>
            <p className="text-orange-300">└─────────────┴────────────────┴────────┘</p>
            <p className="text-red-400 mt-3">If / fills up → shut down → hours of work → data risk 😱</p>
          </div>
        </Reveal>
        <H3>What LVM Does — The Pool System</H3>
        <Reveal>
          <div className="bg-text-charcoal rounded-xl p-5 font-mono text-sm mb-6 overflow-x-auto">
            <p className="text-white/40 mb-2">WITH LVM — flexible pool:</p>
            <p className="text-[#6ee7b7]">┌─────────────────────────────────────┐</p>
            <p className="text-[#6ee7b7]">│      POOL OF STORAGE (60GB)         │</p>
            <p className="text-[#6ee7b7]">│  ┌──────────────┐ ┌─────────────┐  │</p>
            <p className="text-[#6ee7b7]">│  │ Bucket A     │ │ Bucket B    │  │</p>
            <p className="text-[#6ee7b7]">│  │ / (Linux)    │ │ /backups    │  │</p>
            <p className="text-[#6ee7b7]">│  │ 30GB         │ │ 10GB        │  │</p>
            <p className="text-[#6ee7b7]">│  └──────────────┘ └─────────────┘  │</p>
            <p className="text-[#6ee7b7]">│              ~20GB FREE             │</p>
            <p className="text-[#6ee7b7]">└─────────────────────────────────────┘</p>
            <p className="text-[#6ee7b7] mt-3">Bucket A getting full? Two commands, 10 seconds. ✓</p>
          </div>
        </Reveal>
        <H3>The 3 LVM Terms</H3>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { term: "PV", full: "Physical Volume", desc: "Your actual hard disk. The water source.", color: "border-accent-terracotta/20 bg-accent-terracotta/5" },
              { term: "VG", full: "Volume Group", desc: "The combined pool of storage. All disks merged together.", color: "border-accent-moss/20 bg-accent-moss/5" },
              { term: "LV", full: "Logical Volume", desc: "A bucket carved from the pool. What Linux mounts and uses.", color: "border-accent-sage/20 bg-accent-sage/5" },
            ].map((item, i) => (
              <Reveal key={item.term} delay={i * 0.1}>
                <div className={`p-5 rounded-xl border-2 ${item.color} text-center`}>
                  <p className="text-2xl font-mono font-bold text-text-charcoal mb-1">{item.term}</p>
                  <p className="text-sm font-serif font-semibold text-text-charcoal mb-2">{item.full}</p>
                  <p className="text-xs text-text-taupe">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
        <p className="text-center text-text-taupe mt-4 font-mono text-sm">Hard Disk (PV) → Pool (VG) → Buckets (LV)</p>
      </Section>

      {/* Section 5: LVM Commands */}
      <Section id="s5" index={5} sectionRef={el => { sectionRefs.current[5] = el; }}>
        <SectionTitle title="LVM Commands" accent={accentColors[5]} />
        <P className="text-lg mb-8">On your Ubuntu VM, half the disk is sitting unused in the LVM pool — ready whenever you need more space. Here&apos;s how to check and use it:</P>
        <Reveal>
          <Terminal lines={[
            { type: "comment", content: "Check current state" },
            { type: "command", content: "vgs" },
            { type: "output", content: "ubuntu-vg  60.95g  0  2  0  30.47g" },
            { type: "output", content: "                              ↑ free space in pool" },
            { type: "output", content: "" },
            { type: "command", content: "lvs" },
            { type: "output", content: "ubuntu-lv  ubuntu-vg  30.47g" },
            { type: "output", content: "" },
            { type: "command", content: "df -h /" },
            { type: "output", content: "/dev/ubuntu-vg/ubuntu-lv  30G  22G  6.8G  77% /" },
          ]} />
        </Reveal>
        <H3>Expanding your disk — 2 commands, zero downtime</H3>
        <Reveal>
          <Terminal lines={[
            { type: "comment", content: "Step 1: make the bucket bigger" },
            { type: "command", content: "sudo lvextend -L +10G /dev/ubuntu-vg/ubuntu-lv" },
            { type: "output", content: "Size of logical volume ubuntu-vg/ubuntu-lv changed to 40.47 GiB." },
            { type: "output", content: "" },
            { type: "comment", content: "Step 2: tell the filesystem to fill the new space" },
            { type: "command", content: "sudo resize2fs /dev/ubuntu-vg/ubuntu-lv" },
            { type: "output", content: "The filesystem on /dev/ubuntu-vg/ubuntu-lv is now 10616832 blocks long." },
            { type: "output", content: "" },
            { type: "comment", content: "Verify" },
            { type: "command", content: "df -h /" },
            { type: "output", content: "/dev/ubuntu-vg/ubuntu-lv  40G  22G  16G  58% /  ✓" },
          ]} />
        </Reveal>
        <KeyTakeaway>Every production Linux server uses LVM. When you&apos;re working as a DevOps or sysadmin engineer, you <em>will</em> use these commands. This is why they matter.</KeyTakeaway>
        <div className="mt-16">
          <Reveal>
            <Flashcards cards={flashcardsData} />
          </Reveal>
        </div>
      </Section>

      <Confetti isActive={showConfetti} />

    </div>
  );
}
