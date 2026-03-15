"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ArticleNav from "@/components/ui/ArticleNav";
import KeyTakeaway from "@/components/ui/KeyTakeaway";
import AnalogyBox from "@/components/ui/AnalogyBox";
import DidYouKnow from "@/components/ui/DidYouKnow";
import Terminal from "@/components/ui/Terminal";
import Quiz from "@/components/ui/Quiz";
import Flashcards from "@/components/ui/Flashcards";
import Confetti from "@/components/ui/Confetti";

const sectionNames = [
  "What is systemd?",
  "systemctl Commands",
  "Services & Daemons",
  "Logs with journalctl",
  "The Boot Process",
  "Service Files",
];
const navSections = sectionNames.map((label, i) => ({ id: i, label }));

const sectionStyles = [
  { bg: "bg-gradient-to-br from-accent-terracotta/[0.06] via-bg-paper to-accent-sand/[0.04]" },
  { bg: "bg-bg-cream/40" },
  { bg: "bg-gradient-to-br from-accent-moss/[0.04] via-bg-paper to-accent-sage/[0.05]" },
  { bg: "bg-bg-paper" },
  { bg: "bg-gradient-to-br from-accent-sand/[0.06] via-bg-paper to-accent-terracotta/[0.04]" },
  { bg: "bg-bg-cream/40" },
];

const accentColors = ["terracotta", "moss", "terracotta", "sage", "terracotta", "moss"];
const accentLineColors: Record<string, string> = {
  moss: "bg-accent-moss",
  terracotta: "bg-accent-terracotta",
  sage: "bg-accent-sage",
  sand: "bg-accent-sand",
};

const quizQuestions = [
  {
    question: "What is PID 1 and why does it matter?",
    options: [
      "The first user account on the system",
      "systemd — the first process started by the kernel, parent of all others",
      "The root password identifier",
      "The boot loader program",
    ],
    correctIndex: 1,
    explanation: "Every running program gets a Process ID (PID). PID 1 goes to systemd because it's literally the first process the kernel starts after loading. Every other process on the system is a child or descendant of systemd.",
  },
  {
    question: "What's the difference between 'systemctl start' and 'systemctl enable'?",
    options: [
      "They do the same thing",
      "start = run now (once), enable = run on every boot",
      "enable = run now, start = run on boot",
      "start is for users, enable is for root",
    ],
    correctIndex: 1,
    explanation: "'start' starts the service right now, this one time. 'enable' tells systemd to start it automatically every time the system boots. For a new service, you typically do both: enable AND start.",
  },
  {
    question: "What is a daemon?",
    options: [
      "A dangerous virus",
      "A program that runs in the background, silently waiting for something to do",
      "A root user account",
      "A type of firewall rule",
    ],
    correctIndex: 1,
    explanation: "A daemon is a background process that silently waits for work. The 'd' at the end of sshd, mysqld, and nginx means daemon. Like a security guard waiting at the door — does nothing until someone arrives, then springs into action.",
  },
  {
    question: "What comes FIRST in the Linux boot order?",
    options: [
      "systemd starts",
      "The kernel loads",
      "BIOS/UEFI runs a hardware check",
      "SSH daemon starts",
    ],
    correctIndex: 2,
    explanation: "The order is: BIOS/UEFI (hardware check) → Boot Loader (GRUB) → Linux Kernel loads → systemd starts (PID 1) → services start. BIOS/UEFI is built into the hardware itself and runs before anything else.",
  },
  {
    question: "What does journalctl -u ssh -f do?",
    options: [
      "Stops the SSH service",
      "Shows SSH logs in real-time, like watching a security camera live",
      "Restarts SSH",
      "Lists all SSH connections ever made",
    ],
    correctIndex: 1,
    explanation: "journalctl reads systemd's logs. -u ssh filters to only SSH service logs. -f follows the log in real-time (like 'tail -f'). It's like watching a live security camera feed for what SSH is doing right now.",
  },
];

const flashcardsData = [
  { front: "What is systemd?", back: "The manager of everything on a Linux system. It's PID 1 — the first process the kernel starts. It controls starting, stopping, and monitoring all services on your system." },
  { front: "What does systemctl do?", back: "systemctl is how you talk to systemd. Think of it as calling the hotel manager. 'start/stop/restart/status/enable/disable' a service." },
  { front: "start vs enable", back: "start = run right now, this session only. enable = run automatically on every boot. Usually do both: 'sudo systemctl enable ssh && sudo systemctl start ssh'" },
  { front: "What is a daemon?", back: "A background program silently waiting for work. The 'd' suffix gives it away: sshd, mysqld, nginx. Like a security guard — dormant until someone arrives." },
  { front: "What is journalctl?", back: "systemd's log viewer. View all logs: journalctl. Filter by service: journalctl -u ssh. Live tail: journalctl -u ssh -f. It's systemd's security camera footage." },
  { front: "What is GRUB?", back: "The boot loader. After BIOS checks the hardware, GRUB finds the Linux kernel on disk and loads it into RAM. It's the bridge between hardware-land and Linux-land." },
  { front: "What are service files?", back: "Config files that tell systemd how to run a service — what command to run, when to start it, what it depends on, whether to restart on crash. Stored in /etc/systemd/system/ and /lib/systemd/system/." },
];

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" as const } }),
};

const Section = ({ id, index, children, sectionRef }: { id: string; index: number; children: React.ReactNode; sectionRef: (el: HTMLDivElement | null) => void }) => (
  <section id={id} ref={sectionRef} className={`relative scroll-mt-14 ${sectionStyles[index]?.bg || "bg-bg-paper"}`}>
    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-accent-terracotta/10 to-transparent" />
    <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-accent-moss/10 to-transparent" />
    <div className="px-6 md:px-12 lg:px-20 xl:px-32 py-20 md:py-28">{children}</div>
  </section>
);

const SectionTitle = ({ title, accent = "terracotta" }: { title: string; accent?: string }) => (
  <motion.div className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
    <motion.div className={`w-20 h-1.5 ${accentLineColors[accent] || "bg-accent-terracotta"} mb-6 rounded-full`} variants={fadeUp} custom={0} />
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
  <code className="font-mono text-accent-terracotta bg-accent-terracotta/8 px-1.5 py-0.5 rounded text-[0.9em]">{children}</code>
);

const CtlCmd = ({ cmd, desc, color = "moss" }: { cmd: string; desc: string; color?: string }) => {
  const colors: Record<string, string> = {
    moss: "border-accent-moss/15 bg-accent-moss/5 hover:border-accent-moss/30",
    terracotta: "border-accent-terracotta/15 bg-accent-terracotta/5 hover:border-accent-terracotta/30",
    sage: "border-accent-sage/20 bg-accent-sage/5 hover:border-accent-sage/35",
  };
  return (
    <div className={`p-4 rounded-xl border transition-all duration-200 ${colors[color] || colors.moss}`}>
      <code className="font-mono text-sm text-text-charcoal font-semibold block mb-1">{cmd}</code>
      <p className="text-xs text-text-taupe">{desc}</p>
    </div>
  );
};

const BootStep = ({ step, title, desc, icon, delay }: { step: string; title: string; desc: string; icon: string; delay: number }) => (
  <Reveal delay={delay}>
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-accent-terracotta/10 border-2 border-accent-terracotta/20 flex items-center justify-center text-lg flex-shrink-0">{icon}</div>
        <div className="w-0.5 flex-1 bg-gradient-to-b from-accent-terracotta/20 to-transparent mt-2" />
      </div>
      <div className="pb-10 flex-1">
        <p className="text-xs font-mono text-accent-terracotta uppercase tracking-wider mb-1">{step}</p>
        <h4 className="text-lg font-serif text-text-charcoal font-semibold mb-2">{title}</h4>
        <p className="text-sm text-text-taupe leading-relaxed">{desc}</p>
      </div>
    </div>
  </Reveal>
);

export default function SystemdAndBoot() {
  const [currentSection, setCurrentSection] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollToSection = (id: number) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handle = () => {
      const pos = window.scrollY + 200;
      for (let i = sectionRefs.current.length - 1; i >= 0; i--) {
        const r = sectionRefs.current[i];
        if (r && r.offsetTop <= pos) { setCurrentSection(i); break; }
      }
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? window.scrollY / docH : 0);
    };
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <div className="min-h-screen bg-bg-paper font-serif">
      <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-accent-terracotta z-50 origin-left" style={{ scaleX: scrollProgress }} />
      <ArticleNav sections={navSections} currentSection={currentSection} onSectionClick={scrollToSection} />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[65vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-terracotta/10 via-bg-cream to-accent-sand/10" />
        <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="flex flex-col justify-center px-6 md:px-12 lg:px-20 xl:px-32 py-20">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-xs font-mono uppercase tracking-[0.25em] text-accent-terracotta mb-5">Linux Internals</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-serif text-text-charcoal mb-6 leading-[1.1]">
              systemd &amp; the<br /><em className="text-accent-terracotta not-italic">Linux Boot Process</em>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg text-text-taupe leading-relaxed max-w-xl">
              From the moment you press &ldquo;power on&rdquo; to a ready login prompt — what actually happens, step by step, and who&apos;s in charge of it all.
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
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.4 }} className="w-full max-w-sm">
              <div className="space-y-3">
                {[
                  { icon: "🔌", label: "Power On", sub: "BIOS/UEFI" },
                  { icon: "💾", label: "Bootloader", sub: "GRUB" },
                  { icon: "⚡", label: "Kernel loads", sub: "Linux kernel" },
                  { icon: "🏨", label: "systemd starts", sub: "PID 1" },
                  { icon: "🚀", label: "Services start", sub: "SSH, nginx..." },
                  { icon: "✅", label: "Login prompt", sub: "Ready!" },
                ].map((step, i) => (
                  <motion.div key={step.label} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.15 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-bg-paper border border-text-charcoal/8 shadow-sm">
                    <span className="text-xl w-8 text-center">{step.icon}</span>
                    <div>
                      <p className="font-serif text-text-charcoal font-medium text-sm">{step.label}</p>
                      <p className="text-xs text-text-taupe">{step.sub}</p>
                    </div>
                    {i < 5 && <div className="ml-auto w-4 h-4 text-accent-terracotta/40">↓</div>}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 0: What is systemd */}
      <Section id="s0" index={0} sectionRef={el => { sectionRefs.current[0] = el; }}>
        <SectionTitle title="What is systemd?" accent={accentColors[0]} />
        <P className="text-lg md:text-xl mb-8">
          <Code>systemd</Code> is the <strong>manager of everything</strong> that runs on your Linux system. The moment you turn on your computer, systemd is the first thing that starts — and it controls starting, stopping, and watching over all programs and services.
        </P>
        <AnalogyBox>
          Your Linux system is a big hotel.<br /><br />
          <strong>systemd</strong> = the Hotel Manager who runs everything<br />
          <strong>Services</strong> (SSH, web server, database) = hotel departments (housekeeping, security, front desk)<br /><br />
          When the hotel opens in the morning (boot), the manager turns on electricity, opens the front desk, starts housekeeping, opens room service — in the right order. If a department crashes, the manager restarts it automatically.
        </AnalogyBox>
        <KeyTakeaway>systemd is Process ID 1 (PID 1) — the first process the kernel starts. Every other process on the system is a child of systemd.</KeyTakeaway>
      </Section>

      {/* Section 1: systemctl */}
      <Section id="s1" index={1} sectionRef={el => { sectionRefs.current[1] = el; }}>
        <SectionTitle title="systemctl Commands" accent={accentColors[1]} />
        <P className="text-lg mb-8"><Code>systemctl</Code> is how you talk to systemd. Think of it as calling the hotel manager on the phone and giving instructions.</P>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            <CtlCmd cmd="sudo systemctl status ssh" desc="Is SSH running? Show current state and recent logs." color="moss" />
            <CtlCmd cmd="sudo systemctl start ssh" desc="Start SSH right now (once, this session)." color="moss" />
            <CtlCmd cmd="sudo systemctl stop ssh" desc="Stop SSH right now." color="terracotta" />
            <CtlCmd cmd="sudo systemctl restart ssh" desc="Stop then start. Apply config changes." color="terracotta" />
            <CtlCmd cmd="sudo systemctl enable ssh" desc="Start SSH automatically on every boot." color="sage" />
            <CtlCmd cmd="sudo systemctl disable ssh" desc="Don't start automatically on boot." color="sage" />
          </div>
        </Reveal>
        <H3>start vs enable — the critical difference</H3>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border-2 border-accent-moss/20 bg-accent-moss/5">
              <p className="font-mono font-bold text-accent-moss mb-2">start</p>
              <p className="text-sm text-text-taupe">Run it <strong>right now</strong>. If you reboot, it won&apos;t start again automatically.</p>
            </div>
            <div className="p-5 rounded-xl border-2 border-accent-terracotta/20 bg-accent-terracotta/5">
              <p className="font-mono font-bold text-accent-terracotta mb-2">enable</p>
              <p className="text-sm text-text-taupe">Run it <strong>on every boot</strong>. But doesn&apos;t start it right now.</p>
            </div>
          </div>
          <p className="text-sm text-text-taupe mt-4 italic">💡 Setting up a new service? Do both: <code className="font-mono text-accent-terracotta">sudo systemctl enable ssh &amp;&amp; sudo systemctl start ssh</code></p>
        </Reveal>
        <Reveal delay={0.1}>
          <Terminal lines={[
            { type: "comment", content: "Check if SSH is running" },
            { type: "command", content: "sudo systemctl status ssh" },
            { type: "output", content: "● ssh.service - OpenBSD Secure Shell server" },
            { type: "output", content: "   Active: active (running) since Mon 2025-03-10" },
            { type: "output", content: "   Main PID: 1234 (sshd)" },
          ]} />
        </Reveal>
      </Section>

      {/* Section 2: Services & Daemons */}
      <Section id="s2" index={2} sectionRef={el => { sectionRefs.current[2] = el; }}>
        <SectionTitle title="Services &amp; Daemons" accent={accentColors[2]} />
        <P className="text-lg mb-8">A <strong>service</strong> (also called a <strong>daemon</strong>) is a program that runs in the background, silently waiting for something to do. The <Code>d</Code> at the end of <Code>sshd</Code>, <Code>mysqld</Code>, and <Code>nginx</Code> stands for daemon.</P>
        <AnalogyBox>
          A security guard stands at the door of a building. They don&apos;t do anything most of the time — just wait. But the moment someone comes to the door, they spring into action.<br /><br />
          <strong>sshd</strong> = security guard waiting for SSH connections<br />
          <strong>nginx</strong> = waiter waiting for web requests<br />
          <strong>mysqld</strong> = librarian waiting for database queries
        </AnalogyBox>
        <H3>Common services you&apos;ll work with</H3>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "ssh / sshd", desc: "Remote terminal access. What lets you connect from your Mac to your server.", port: "Port 22" },
              { name: "nginx", desc: "Web server. Serves websites, acts as reverse proxy.", port: "Port 80/443" },
              { name: "mysql / mysqld", desc: "MySQL database server. Stores and retrieves structured data.", port: "Port 3306" },
              { name: "cron", desc: "Scheduled task runner. Runs jobs at specific times automatically.", port: "—" },
            ].map((s, i) => (
              <Reveal key={s.name} delay={i * 0.08}>
                <div className="p-5 rounded-xl border border-text-charcoal/10 bg-bg-paper hover:border-accent-terracotta/20 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <code className="font-mono text-text-charcoal font-bold">{s.name}</code>
                    <span className="text-xs font-mono text-accent-terracotta bg-accent-terracotta/8 px-2 py-0.5 rounded">{s.port}</span>
                  </div>
                  <p className="text-sm text-text-taupe">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Section 3: journalctl */}
      <Section id="s3" index={3} sectionRef={el => { sectionRefs.current[3] = el; }}>
        <SectionTitle title="Logs with journalctl" accent={accentColors[3]} />
        <P className="text-lg mb-6">systemd records <em>everything</em> that happens on your system. <Code>journalctl</Code> is how you read those records.</P>
        <AnalogyBox>
          journalctl is like checking the hotel&apos;s security camera footage — you can see what happened, when, and with which service. The <Code>-f</Code> flag means you&apos;re watching the live feed.
        </AnalogyBox>
        <Reveal>
          <Terminal lines={[
            { type: "comment", content: "See all logs (can be massive)" },
            { type: "command", content: "sudo journalctl" },
            { type: "output", content: "" },
            { type: "comment", content: "Filter to just one service" },
            { type: "command", content: "sudo journalctl -u ssh" },
            { type: "output", content: "" },
            { type: "comment", content: "Watch live (Ctrl+C to stop)" },
            { type: "command", content: "sudo journalctl -u ssh -f" },
            { type: "output", content: "" },
            { type: "comment", content: "Show logs since last boot" },
            { type: "command", content: "sudo journalctl -b" },
          ]} />
        </Reveal>
        <DidYouKnow>journalctl stores logs in a binary format, not plain text files. This means it can store more data, query faster, and can&apos;t be as easily tampered with as plain text log files.</DidYouKnow>
      </Section>

      {/* Section 4: Boot Process */}
      <Section id="s4" index={4} sectionRef={el => { sectionRefs.current[4] = el; }}>
        <SectionTitle title="The Linux Boot Process" accent={accentColors[4]} />
        <P className="text-lg mb-12">From pressing &ldquo;power on&rdquo; to seeing a login prompt — here&apos;s every step, explained:</P>
        <div>
          <BootStep step="Step 1" icon="🔌" title="BIOS / UEFI — Hardware Check" desc="Built into the hardware itself. Runs before anything else. Does a POST (Power-On Self-Test): is the CPU working? RAM? Storage? Then finds the bootloader and hands control to it." delay={0} />
          <BootStep step="Step 2" icon="💾" title="GRUB — The Boot Loader" desc="GRUB finds the Linux kernel on your storage drive and loads it into RAM. If you have multiple OSes, GRUB shows a menu to choose. It's the bridge between hardware-land and Linux-land." delay={0.1} />
          <BootStep step="Step 3" icon="⚡" title="Linux Kernel Loads" desc="Takes control of ALL hardware — CPU, RAM, storage, network card. Sets up memory management, detects devices. Then starts the very first user-space process: systemd." delay={0.2} />
          <BootStep step="Step 4" icon="🏨" title="systemd Starts (PID 1)" desc="The kernel launches systemd as Process ID 1 — the very first process. Every other service, app, or program is started by systemd, making it the ancestor of everything on the system." delay={0.3} />
          <BootStep step="Step 5" icon="📋" title="systemd Reads Service Files" desc="systemd reads config files in /etc/systemd/system/ to know what to start, in what order, and what each service depends on. Like opening the hotel's daily operations binder." delay={0.4} />
          <BootStep step="Step 6" icon="🚀" title="Services Start In Order" desc="Networking first (SSH needs the network). Then firewall rules. Then SSH, databases, web servers. Order matters — systemd handles all the dependencies automatically." delay={0.5} />
          <BootStep step="Step 7" icon="✅" title="Login Prompt Appears" desc="All services running. systemd shows you the login prompt — either on the console directly or SSH is ready and waiting for your connection. Boot complete." delay={0.6} />
        </div>
        <KeyTakeaway>The entire boot process — from power-on to ready login prompt — typically takes 3–8 seconds on a modern system. Impressive considering everything that happens.</KeyTakeaway>
      </Section>

      {/* Section 5: Service Files */}
      <Section id="s5" index={5} sectionRef={el => { sectionRefs.current[5] = el; }}>
        <SectionTitle title="Service Files" accent={accentColors[5]} />
        <P className="text-lg mb-6">systemd doesn&apos;t randomly start things. It reads <strong>service files</strong> — small config files that describe exactly how to run each service.</P>
        <P className="mb-8">Service files live in <Code>/etc/systemd/system/</Code> and <Code>/lib/systemd/system/</Code>. Here&apos;s what a typical one looks like:</P>
        <Reveal>
          <div className="rounded-2xl border border-text-charcoal/10 bg-text-charcoal overflow-hidden mb-8">
            <div className="px-5 py-3 bg-white/5 border-b border-white/10">
              <p className="font-mono text-xs text-white/40">ssh.service</p>
            </div>
            <div className="p-5 font-mono text-sm space-y-1 overflow-x-auto">
              <p className="text-white/40">[Unit]</p>
              <p><span className="text-[#6ee7b7]">Description</span>=<span className="text-orange-300">OpenSSH Server</span></p>
              <p><span className="text-[#6ee7b7]">After</span>=<span className="text-orange-300">network.target</span> <span className="text-white/30">← start AFTER networking</span></p>
              <p className="mt-3 text-white/40">[Service]</p>
              <p><span className="text-[#6ee7b7]">ExecStart</span>=<span className="text-orange-300">/usr/sbin/sshd -D</span> <span className="text-white/30">← command to run</span></p>
              <p><span className="text-[#6ee7b7]">Restart</span>=<span className="text-orange-300">on-failure</span> <span className="text-white/30">← restart if it crashes</span></p>
              <p className="mt-3 text-white/40">[Install]</p>
              <p><span className="text-[#6ee7b7]">WantedBy</span>=<span className="text-orange-300">multi-user.target</span> <span className="text-white/30">← start on normal boot</span></p>
            </div>
          </div>
        </Reveal>
        <P>The <Code>After=network.target</Code> line is how systemd knows SSH must wait for networking to be ready. This is how it figures out the correct startup order automatically.</P>
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
