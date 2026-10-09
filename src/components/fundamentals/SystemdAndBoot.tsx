"use client";

import { useRef } from "react";
import { useReadingNav } from "@/hooks/useReadingNav";
import ArticleSection from "@/components/reading/ArticleSection";
import KeyTakeaway from "@/components/ui/KeyTakeaway";
import AnalogyBox from "@/components/ui/AnalogyBox";
import DidYouKnow from "@/components/ui/DidYouKnow";
import Terminal from "@/components/ui/Terminal";
import Flashcards from "@/components/ui/Flashcards";
import { iconFor } from "@/components/ui/icons";

const sectionNames = [
  "What is systemd?",
  "systemctl Commands",
  "Services & Daemons",
  "Logs with journalctl",
  "The Boot Process",
  "Service Files",
];
const navSections = sectionNames.map((label, i) => ({ id: i, label }));

const flashcardsData = [
  { front: "What is systemd?", back: "The manager of everything on a Linux system. It's PID 1 — the first process the kernel starts. It controls starting, stopping, and monitoring all services on your system." },
  { front: "What does systemctl do?", back: "systemctl is how you talk to systemd. Think of it as calling the hotel manager. 'start/stop/restart/status/enable/disable' a service." },
  { front: "start vs enable", back: "start = run right now, this session only. enable = run automatically on every boot. Usually do both: 'sudo systemctl enable ssh && sudo systemctl start ssh'" },
  { front: "What is a daemon?", back: "A background program silently waiting for work. The 'd' suffix gives it away: sshd, mysqld, nginx. Like a security guard — dormant until someone arrives." },
  { front: "What is journalctl?", back: "systemd's log viewer. View all logs: journalctl. Filter by service: journalctl -u ssh. Live tail: journalctl -u ssh -f. It's systemd's security camera footage." },
  { front: "What is GRUB?", back: "The boot loader. After BIOS checks the hardware, GRUB finds the Linux kernel on disk and loads it into RAM. It's the bridge between hardware-land and Linux-land." },
  { front: "What are service files?", back: "Config files that tell systemd how to run a service — what command to run, when to start it, what it depends on, whether to restart on crash. Stored in /etc/systemd/system/ and /lib/systemd/system/." },
];

const SectionTitle = ({ title }: { title: string }) => (
  <div className="mb-12">
    <div className="w-20 h-1.5 bg-accent mb-6 rounded-full" />
    <h2 className="text-h2 font-display text-fg leading-tight">{title}</h2>
  </div>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl md:text-2xl font-display text-fg mt-14 mb-5">{children}</h3>
);

const P = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-fg-2 leading-relaxed ${className}`}>{children}</p>
);

const Reveal = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="font-mono text-accent bg-accent/8 px-1.5 py-0.5 rounded text-[0.9em]">{children}</code>
);

const CtlCmd = ({ cmd, desc, color = "accent" }: { cmd: string; desc: string; color?: "accent" | "danger" | "success" }) => {
  const colors: Record<string, string> = {
    accent: "border-accent/15 bg-accent/5 hover:border-accent/30",
    danger: "border-danger/15 bg-danger/5 hover:border-danger/30",
    success: "border-success/20 bg-success/5 hover:border-success/35",
  };
  return (
    <div className={`p-4 rounded-xl border transition-all duration-200 ${colors[color]}`}>
      <code className="font-mono text-sm text-fg font-semibold block mb-1">{cmd}</code>
      <p className="text-xs text-fg-2">{desc}</p>
    </div>
  );
};

const BootStep = ({ step, title, desc, icon }: { step: string; title: string; desc: string; icon: string }) => (
  <Reveal>
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-danger/10 border-2 border-danger/20 flex items-center justify-center text-lg flex-shrink-0">{iconFor(icon, { size: 22 })}</div>
        <div className="w-0.5 flex-1 bg-gradient-to-b from-danger/20 to-transparent mt-2" />
      </div>
      <div className="pb-10 flex-1">
        <p className="text-xs font-mono text-danger uppercase tracking-wider mb-1">{step}</p>
        <h3 className="text-lg font-display text-fg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-fg-2 leading-relaxed">{desc}</p>
      </div>
    </div>
  </Reveal>
);

export default function SystemdAndBoot() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useReadingNav(navSections, sectionRefs);

  return (
    <article>
      {/* Section 0: What is systemd */}
      <ArticleSection id="s0" ref={el => { sectionRefs.current[0] = el; }}>
        <SectionTitle title="What is systemd?" />
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
      </ArticleSection>

      {/* Section 1: systemctl */}
      <ArticleSection id="s1" ref={el => { sectionRefs.current[1] = el; }}>
        <SectionTitle title="systemctl Commands" />
        <P className="text-lg mb-8"><Code>systemctl</Code> is how you talk to systemd. Think of it as calling the hotel manager on the phone and giving instructions.</P>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            <CtlCmd cmd="sudo systemctl status ssh" desc="Is SSH running? Show current state and recent logs." color="accent" />
            <CtlCmd cmd="sudo systemctl start ssh" desc="Start SSH right now (once, this session)." color="accent" />
            <CtlCmd cmd="sudo systemctl stop ssh" desc="Stop SSH right now." color="danger" />
            <CtlCmd cmd="sudo systemctl restart ssh" desc="Stop then start. Apply config changes." color="danger" />
            <CtlCmd cmd="sudo systemctl enable ssh" desc="Start SSH automatically on every boot." color="success" />
            <CtlCmd cmd="sudo systemctl disable ssh" desc="Don't start automatically on boot." color="success" />
          </div>
        </Reveal>
        <H3>start vs enable — the critical difference</H3>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border-2 border-accent/20 bg-accent/5">
              <p className="font-mono font-bold text-accent mb-2">start</p>
              <p className="text-sm text-fg-2">Run it <strong>right now</strong>. If you reboot, it won&apos;t start again automatically.</p>
            </div>
            <div className="p-5 rounded-xl border-2 border-danger/20 bg-danger/5">
              <p className="font-mono font-bold text-danger mb-2">enable</p>
              <p className="text-sm text-fg-2">Run it <strong>on every boot</strong>. But doesn&apos;t start it right now.</p>
            </div>
          </div>
          <p className="text-sm text-fg-2 mt-4 italic">Setting up a new service? Do both: <code className="font-mono text-danger">sudo systemctl enable ssh &amp;&amp; sudo systemctl start ssh</code></p>
        </Reveal>
        <Reveal>
          <Terminal lines={[
            { type: "comment", content: "Check if SSH is running" },
            { type: "command", content: "sudo systemctl status ssh" },
            { type: "output", content: "● ssh.service - OpenBSD Secure Shell server" },
            { type: "output", content: "   Active: active (running) since Mon 2025-03-10" },
            { type: "output", content: "   Main PID: 1234 (sshd)" },
          ]} />
        </Reveal>
      </ArticleSection>

      {/* Section 2: Services & Daemons */}
      <ArticleSection id="s2" ref={el => { sectionRefs.current[2] = el; }}>
        <SectionTitle title="Services &amp; Daemons" />
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
            ].map((s) => (
              <Reveal key={s.name}>
                <div className="p-5 rounded-xl border border-fg/10 bg-surface hover:border-danger/20 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <code className="font-mono text-fg font-bold">{s.name}</code>
                    <span className="text-xs font-mono text-danger bg-danger/8 px-2 py-0.5 rounded">{s.port}</span>
                  </div>
                  <p className="text-sm text-fg-2">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </ArticleSection>

      {/* Section 3: journalctl */}
      <ArticleSection id="s3" ref={el => { sectionRefs.current[3] = el; }}>
        <SectionTitle title="Logs with journalctl" />
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
      </ArticleSection>

      {/* Section 4: Boot Process */}
      <ArticleSection id="s4" ref={el => { sectionRefs.current[4] = el; }}>
        <SectionTitle title="The Linux Boot Process" />
        <P className="text-lg mb-12">From pressing &ldquo;power on&rdquo; to seeing a login prompt — here&apos;s every step, explained:</P>
        <div>
          <BootStep step="Step 1" icon="plugs" title="BIOS / UEFI — Hardware Check" desc="Built into the hardware itself. Runs before anything else. Does a POST (Power-On Self-Test): is the CPU working? RAM? Storage? Then finds the bootloader and hands control to it." />
          <BootStep step="Step 2" icon="floppy-disk" title="GRUB — The Boot Loader" desc="GRUB finds the Linux kernel on your storage drive and loads it into RAM. If you have multiple OSes, GRUB shows a menu to choose. It's the bridge between hardware-land and Linux-land." />
          <BootStep step="Step 3" icon="lightning" title="Linux Kernel Loads" desc="Takes control of ALL hardware — CPU, RAM, storage, network card. Sets up memory management, detects devices. Then starts the very first user-space process: systemd." />
          <BootStep step="Step 4" icon="buildings" title="systemd Starts (PID 1)" desc="The kernel launches systemd as Process ID 1 — the very first process. Every other service, app, or program is started by systemd, making it the ancestor of everything on the system." />
          <BootStep step="Step 5" icon="clipboard-text" title="systemd Reads Service Files" desc="systemd reads config files in /etc/systemd/system/ to know what to start, in what order, and what each service depends on. Like opening the hotel's daily operations binder." />
          <BootStep step="Step 6" icon="rocket-launch" title="Services Start In Order" desc="Networking first (SSH needs the network). Then firewall rules. Then SSH, databases, web servers. Order matters — systemd handles all the dependencies automatically." />
          <BootStep step="Step 7" icon="check-circle" title="Login Prompt Appears" desc="All services running. systemd shows you the login prompt — either on the console directly or SSH is ready and waiting for your connection. Boot complete." />
        </div>
        <KeyTakeaway>The entire boot process — from power-on to ready login prompt — typically takes 3–8 seconds on a modern system. Impressive considering everything that happens.</KeyTakeaway>
      </ArticleSection>

      {/* Section 5: Service Files */}
      <ArticleSection id="s5" ref={el => { sectionRefs.current[5] = el; }}>
        <SectionTitle title="Service Files" />
        <P className="text-lg mb-6">systemd doesn&apos;t randomly start things. It reads <strong>service files</strong> — small config files that describe exactly how to run each service.</P>
        <P className="mb-8">Service files live in <Code>/etc/systemd/system/</Code> and <Code>/lib/systemd/system/</Code>. Here&apos;s what a typical one looks like:</P>
        <Reveal>
          <div className="rounded-2xl border border-border-strong bg-terminal overflow-hidden mb-8">
            <div className="px-5 py-3 bg-white/5 border-b border-white/10">
              <p className="font-mono text-xs text-terminal-fg/60">ssh.service</p>
            </div>
            <div className="p-5 font-mono text-sm space-y-1 overflow-x-auto">
              <p className="text-terminal-fg/60">[Unit]</p>
              <p><span className="text-terminal-ok">Description</span>=<span className="text-terminal-accent">OpenSSH Server</span></p>
              <p><span className="text-terminal-ok">After</span>=<span className="text-terminal-accent">network.target</span> <span className="text-terminal-fg/60">← start AFTER networking</span></p>
              <p className="mt-3 text-terminal-fg/60">[Service]</p>
              <p><span className="text-terminal-ok">ExecStart</span>=<span className="text-terminal-accent">/usr/sbin/sshd -D</span> <span className="text-terminal-fg/60">← command to run</span></p>
              <p><span className="text-terminal-ok">Restart</span>=<span className="text-terminal-accent">on-failure</span> <span className="text-terminal-fg/60">← restart if it crashes</span></p>
              <p className="mt-3 text-terminal-fg/60">[Install]</p>
              <p><span className="text-terminal-ok">WantedBy</span>=<span className="text-terminal-accent">multi-user.target</span> <span className="text-terminal-fg/60">← start on normal boot</span></p>
            </div>
          </div>
        </Reveal>
        <P>The <Code>After=network.target</Code> line is how systemd knows SSH must wait for networking to be ready. This is how it figures out the correct startup order automatically.</P>
        <div className="mt-16">
          <Reveal>
            <Flashcards cards={flashcardsData} />
          </Reveal>
        </div>
      </ArticleSection>
    </article>
  );
}
