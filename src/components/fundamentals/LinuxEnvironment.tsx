"use client";

import { useState, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { useActivePhase } from "@/hooks/useActivePhase";
import ArticleNav from "@/components/ui/ArticleNav";
import KeyTakeaway from "@/components/ui/KeyTakeaway";
import AnalogyBox from "@/components/ui/AnalogyBox";
import DidYouKnow from "@/components/ui/DidYouKnow";
import WarningBox from "@/components/ui/WarningBox";
import Terminal from "@/components/ui/Terminal";
import Quiz from "@/components/ui/Quiz";
import Flashcards from "@/components/ui/Flashcards";
import Confetti from "@/components/ui/Confetti";

const sectionNames = [
  "What is $PATH?",
  "Folders in $PATH",
  "How PATH Works",
  "Running Your Scripts",
  "Modifying PATH",
  "nano — Terminal Editor",
];
const navSections = sectionNames.map((label, i) => ({ id: i, label }));

const sectionStyles = [
  { bg: "bg-gradient-to-br from-accent-moss/[0.06] via-bg-paper to-accent-sage/[0.04]" },
  { bg: "bg-bg-cream/40" },
  { bg: "bg-gradient-to-br from-accent-terracotta/[0.04] via-bg-paper to-accent-sand/[0.05]" },
  { bg: "bg-bg-paper" },
  { bg: "bg-gradient-to-br from-accent-sage/[0.05] via-bg-paper to-accent-moss/[0.05]" },
  { bg: "bg-bg-cream/40" },
];

const accentColors = ["moss", "terracotta", "moss", "sage", "terracotta", "moss"];
const accentLineColors: Record<string, string> = {
  moss: "bg-accent-moss",
  terracotta: "bg-accent-terracotta",
  sage: "bg-accent-sage",
  sand: "bg-accent-sand",
};

const quizQuestions = [
  {
    question: "What is $PATH in Linux?",
    options: [
      "The location of your home folder",
      "A list of folders where Linux looks for commands",
      "A file that stores your password",
      "The root directory of the filesystem",
    ],
    correctIndex: 1,
    explanation: "$PATH is an environment variable — a list of directories separated by colons. When you type a command like 'ls', Linux searches each folder in $PATH to find the program. It's Linux's address book for commands.",
  },
  {
    question: "What does the colon (:) do in $PATH?",
    options: [
      "It marks the end of the path",
      "It separates folder names in the list",
      "It means 'run as root'",
      "It's a comment character",
    ],
    correctIndex: 1,
    explanation: "In $PATH, colons are separators between directory names. For example: /usr/bin:/usr/sbin:/bin means three separate folders: /usr/bin, /usr/sbin, and /bin. Linux checks each one in order.",
  },
  {
    question: "Why does typing './myscript.sh' work but 'myscript.sh' doesn't?",
    options: [
      "The ./ makes it executable",
      "./  tells Linux 'look in the CURRENT folder' — your folder isn't in $PATH",
      "You need sudo for both",
      "The script has a bug",
    ],
    correctIndex: 1,
    explanation: "./ means 'right here in the current directory'. Linux only looks in $PATH folders for commands. Since your personal folder usually isn't in $PATH, you must give the full path or use ./ to say 'it's right here'.",
  },
  {
    question: "What's dangerous about: export PATH='~/my-scripts'",
    options: [
      "Nothing, it's perfectly safe",
      "It replaces ALL of $PATH — ls, sudo, grep, everything stops working",
      "It adds too many folders",
      "It only works for root",
    ],
    correctIndex: 1,
    explanation: "This replaces the entire $PATH with just your folder. Suddenly Linux can't find ls, sudo, grep, or anything else — they're all gone from the lookup list. Always use: export PATH=\"$PATH:~/my-scripts\" to APPEND, not replace.",
  },
  {
    question: "How do you make a PATH change permanent across reboots?",
    options: [
      "Use sudo to save it",
      "Run 'path save' command",
      "Add it to ~/.bashrc — a file that runs every login",
      "It's always automatic",
    ],
    correctIndex: 2,
    explanation: "'export PATH=...' only lasts for the current terminal session. To make it permanent, add it to ~/.bashrc — a script that Bash runs every time you log in. Use: echo 'export PATH=\"$PATH:~/my-scripts\"' >> ~/.bashrc",
  },
];

const flashcardsData = [
  { front: "What is $PATH?", back: "An environment variable — a colon-separated list of directories where Linux searches for commands when you type them. Run 'echo $PATH' to see yours." },
  { front: "Why can't Linux find my script?", back: "Your personal folder isn't in $PATH. Fix it with ./ (ex: ./myscript.sh), full path (/home/charith/scripts/myscript.sh), or add your folder to $PATH." },
  { front: "What does ./ mean?", back: "Look in the current directory. Since Linux doesn't search your current folder by default (security reason), ./ explicitly says 'the program is right HERE'." },
  { front: "How do you add a folder to $PATH?", back: "export PATH=\"$PATH:~/your-folder\" — the $PATH: part keeps existing folders, then adds yours. Never omit $PATH: or you break all other commands." },
  { front: "How do you make PATH permanent?", back: "Add it to ~/.bashrc: echo 'export PATH=\"$PATH:~/your-folder\"' >> ~/.bashrc — this file runs every time you open a new terminal session." },
  { front: "What is nano?", back: "A terminal text editor — like Notepad but inside the terminal. Open a file: nano filename.txt. Save: Ctrl+O. Exit: Ctrl+X. Essential for servers with no GUI." },
  { front: "Why does /usr/bin exist separately from /bin?", back: "/bin has essential commands needed even when /usr isn't mounted (early boot). /usr/bin has most regular user programs. Modern systems often symlink them, but the distinction is historical." },
];

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" as const } }),
};

const Section = ({ id, index, children, sectionRef }: { id: string; index: number; children: React.ReactNode; sectionRef: (el: HTMLDivElement | null) => void }) => (
  <section id={id} ref={sectionRef} className={`relative scroll-mt-14 ${sectionStyles[index]?.bg || "bg-bg-paper"}`}>
    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-accent-moss/10 to-transparent" />
    <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-accent-terracotta/10 to-transparent" />
    <div className="px-6 md:px-12 lg:px-20 xl:px-32 py-20 md:py-28">{children}</div>
  </section>
);

const SectionTitle = ({ title, accent = "moss" }: { title: string; accent?: string }) => (
  <motion.div className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
    <motion.div className={`w-20 h-1.5 ${accentLineColors[accent] || "bg-accent-moss"} mb-6 rounded-full`} variants={fadeUp} custom={0} />
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

const PathFolder = ({ path, desc, icon, delay }: { path: string; desc: string; icon: string; delay: number }) => (
  <Reveal delay={delay}>
    <div className="flex items-center gap-4 p-4 rounded-xl border border-text-charcoal/8 bg-bg-paper hover:border-accent-moss/20 hover:shadow-lg transition-all duration-300 group">
      <div className="text-2xl w-10 text-center">{icon}</div>
      <div className="flex-1">
        <code className="font-mono text-accent-moss text-sm font-bold">{path}</code>
        <p className="text-xs text-text-taupe mt-0.5">{desc}</p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 rounded-full bg-accent-moss" />
      </div>
    </div>
  </Reveal>
);

export default function LinuxEnvironment() {
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
      {/* Scroll progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-accent-moss z-50 origin-left" style={{ scaleX: scrollYProgress }} />

      <ArticleNav sections={navSections} currentSection={currentSection} onSectionClick={scrollToSection} />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[65vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-moss/10 via-bg-cream to-accent-sage/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-accent-moss)_0%,_transparent_55%)] opacity-[0.06]" />
        <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="flex flex-col justify-center px-6 md:px-12 lg:px-20 xl:px-32 py-20">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-xs font-mono uppercase tracking-[0.25em] text-accent-moss mb-5">Linux Environment</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-serif text-text-charcoal mb-6 leading-[1.1]">
              $PATH &amp; the Linux<br /><em className="text-accent-moss not-italic">Command Environment</em>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg text-text-taupe leading-relaxed max-w-xl">
              Ever wonder why typing <Code>ls</Code> works but your own script doesn&apos;t? It all comes down to $PATH — Linux&apos;s address book for finding programs.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="flex gap-6 mt-8 pt-8 border-t border-text-charcoal/10">
              {[{ label: "Sections", value: "6" }, { label: "Read time", value: "15 min" }, { label: "Level", value: "Beginner" }].map(s => (
                <div key={s.label}>
                  <p className="text-xs font-mono uppercase tracking-wider text-text-olive">{s.label}</p>
                  <p className="text-lg font-serif font-semibold text-text-charcoal">{s.value}</p>
                </div>
              ))}
            </motion.div>
          </div>
          {/* Terminal animation */}
          <div className="hidden lg:flex items-center justify-center px-12">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.4 }} className="w-full max-w-md">
              <div className="bg-text-charcoal rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-3 bg-text-charcoal/80 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-white/40 font-mono">terminal</span>
                </div>
                <div className="p-5 font-mono text-sm space-y-2">
                  {[
                    { prompt: "$ ", cmd: "echo $PATH", color: "text-white" },
                    { prompt: "", cmd: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin", color: "text-green-400" },
                    { prompt: "$ ", cmd: "ls", color: "text-white" },
                    { prompt: "", cmd: "✓ Found at /usr/bin/ls", color: "text-accent-moss/80 text-[#6ee7b7]" },
                    { prompt: "$ ", cmd: "./my-script.sh", color: "text-white" },
                    { prompt: "", cmd: "✓ Found here (./ = current dir)", color: "text-[#6ee7b7]" },
                  ].map((line, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.3 }} className={line.color}>
                      <span className="text-[#6ee7b7]">{line.prompt}</span>{line.cmd}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 0: What is $PATH */}
      <Section id="s0" index={0} sectionRef={el => { sectionRefs.current[0] = el; }}>
        <SectionTitle title="What is $PATH?" accent={accentColors[0]} />
        <P className="text-lg md:text-xl mb-8">
          <Code>$PATH</Code> is an <strong>environment variable</strong> — a list of folders that Linux searches when you type a command. It&apos;s Linux&apos;s address book for finding programs.
        </P>
        <Reveal>
          <Terminal lines={[
            { type: "command", content: "echo $PATH" },
            { type: "output", content: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" },
          ]} />
        </Reveal>
        <P className="mt-6">Those colons <Code>:</Code> are separators between folder names. Linux checks each folder <em>in order</em> until it finds your command — or says &quot;command not found&quot;.</P>
        <AnalogyBox>
          When you ask a local &quot;where&apos;s the post office?&quot; they know — because it&apos;s in the city directory. But &quot;where&apos;s Charith&apos;s house?&quot; — nobody knows, it&apos;s not listed.<br /><br />
          <strong>ls</strong> = post office (in the directory / $PATH)<br />
          <strong>./my-script.sh</strong> = Charith&apos;s house (you give the exact address)
        </AnalogyBox>
        <KeyTakeaway>$PATH is how Linux knows where to find programs. No $PATH entry = &quot;command not found&quot;, even if the file exists.</KeyTakeaway>
      </Section>

      {/* Section 1: Folders in $PATH */}
      <Section id="s1" index={1} sectionRef={el => { sectionRefs.current[1] = el; }}>
        <SectionTitle title="Folders in $PATH" accent={accentColors[1]} />
        <P className="text-lg mb-10">Each folder in $PATH has a specific purpose. Here&apos;s what you&apos;ll typically see on Ubuntu:</P>
        <div className="space-y-3 mb-10">
          <PathFolder path="/bin" desc="Essential commands for all users — ls, cp, mv, cat. Required for system operation." icon="🏪" delay={0} />
          <PathFolder path="/sbin" desc="System admin tools — reboot, fsck, ip. Mostly for root/admin use." icon="🔧" delay={0.05} />
          <PathFolder path="/usr/bin" desc="Most installed programs live here — git, python3, nano, curl." icon="🛒" delay={0.1} />
          <PathFolder path="/usr/sbin" desc="System programs for administration — useradd, iptables, sshd." icon="⚙️" delay={0.15} />
          <PathFolder path="/usr/local/bin" desc="Software YOU installed manually (not via apt). Your personal tools." icon="🏗️" delay={0.2} />
          <PathFolder path="/usr/local/sbin" desc="Your own custom system administration tools." icon="🔑" delay={0.25} />
        </div>
        <AnalogyBox>
          <strong>/bin</strong> = Ground floor essentials (pharmacy, grocery — things everyone needs)<br />
          <strong>/sbin</strong> = Manager&apos;s office (admin staff only)<br />
          <strong>/usr/bin</strong> = Regular shops (most apps you install)<br />
          <strong>/usr/local/bin</strong> = Pop-up shops (software you brought in yourself)
        </AnalogyBox>
        <DidYouKnow>On modern Ubuntu (22.04+), <Code>/bin</Code> and <Code>/usr/bin</Code> are actually the same folder — one is a symlink to the other. The separation is historical, from when /usr could be a separate disk.</DidYouKnow>
      </Section>

      {/* Section 2: How PATH Works */}
      <Section id="s2" index={2} sectionRef={el => { sectionRefs.current[2] = el; }}>
        <SectionTitle title="How PATH Works" accent={accentColors[2]} />
        <P className="text-lg mb-8">When you type a command, Linux walks through $PATH left-to-right, checking each folder until it finds the program or runs out of places to look.</P>
        <Reveal>
          <div className="rounded-2xl border border-text-charcoal/10 bg-bg-paper overflow-hidden mb-8">
            <div className="px-6 py-4 bg-accent-moss/5 border-b border-text-charcoal/8">
              <p className="font-mono text-sm text-text-charcoal font-semibold">You type: <span className="text-accent-moss">ls</span></p>
            </div>
            <div className="p-6 space-y-3">
              {[
                { path: "/usr/local/sbin/ls", found: false },
                { path: "/usr/local/bin/ls", found: false },
                { path: "/usr/sbin/ls", found: false },
                { path: "/usr/bin/ls", found: true },
              ].map((item, i) => (
                <motion.div key={item.path} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-lg font-mono text-sm ${item.found ? "bg-accent-moss/10 border border-accent-moss/20" : "bg-text-charcoal/3 border border-text-charcoal/5"}`}>
                  <span className={item.found ? "text-accent-moss font-semibold" : "text-text-taupe"}>{item.path}</span>
                  <span className={item.found ? "text-accent-moss font-bold" : "text-text-charcoal/30"}>
                    {item.found ? "✓ Found! Run it." : "✗ No"}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
        <P>If the command isn&apos;t found anywhere in $PATH, you get: <Code>command not found</Code>. The file might exist on your system — it&apos;s just not in a $PATH folder.</P>
        <KeyTakeaway>Linux never searches your entire filesystem. It ONLY looks in the specific folders listed in $PATH. This is both a performance optimization and a security feature.</KeyTakeaway>
      </Section>

      {/* Section 3: Running Your Scripts */}
      <Section id="s3" index={3} sectionRef={el => { sectionRefs.current[3] = el; }}>
        <SectionTitle title="Running Your Scripts" accent={accentColors[3]} />
        <P className="text-lg mb-8">Your personal scripts are usually in your home folder — which isn&apos;t in $PATH. You have three options:</P>
        <div className="space-y-6">
          {[
            { num: "01", title: "Use ./ (it's right HERE)", cmd: "sudo ./my-script.sh", desc: "./ means 'in the current directory'. The explicit address Linux needs." },
            { num: "02", title: "Full path", cmd: "sudo /home/charith/scripts/my-script.sh", desc: "Give Linux the exact location of the file, like a street address." },
            { num: "03", title: "Add your folder to $PATH", cmd: 'export PATH="$PATH:~/scripts"', desc: "Now you can type my-script.sh directly — Linux will find it." },
          ].map((opt, i) => (
            <Reveal key={opt.num} delay={i * 0.1}>
              <div className="rounded-2xl border border-text-charcoal/10 bg-bg-paper p-6 hover:border-accent-moss/20 hover:shadow-lg transition-all">
                <div className="flex items-start gap-5">
                  <span className="text-3xl font-serif font-bold text-accent-moss/25">{opt.num}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-serif text-text-charcoal font-semibold mb-2">{opt.title}</h3>
                    <code className="block font-mono text-sm text-accent-moss bg-text-charcoal/4 rounded-lg px-4 py-2 mb-3">{opt.cmd}</code>
                    <p className="text-sm text-text-taupe">{opt.desc}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Section 4: Modifying PATH */}
      <Section id="s4" index={4} sectionRef={el => { sectionRefs.current[4] = el; }}>
        <SectionTitle title="Modifying PATH" accent={accentColors[4]} />
        <P className="text-lg mb-8">You can add folders to $PATH with the <Code>export</Code> command. But there&apos;s a critical detail that trips up beginners:</P>
        <Reveal>
          <Terminal lines={[
            { type: "comment", content: "✅ CORRECT — appends your folder" },
            { type: "command", content: 'export PATH="$PATH:~/my-scripts"' },
            { type: "comment", content: "            ↑ keeps existing folders" },
            { type: "output", content: "" },
            { type: "comment", content: "❌ DANGEROUS — replaces everything!" },
            { type: "command", content: 'export PATH="~/my-scripts"' },
            { type: "output", content: "bash: ls: command not found  ← oh no" },
          ]} />
        </Reveal>
        <WarningBox>
          If you forget <Code>$PATH:</Code> and write <Code>export PATH=&quot;~/my-scripts&quot;</Code>, Linux replaces the <em>entire</em> $PATH with just your folder. Suddenly <Code>ls</Code>, <Code>sudo</Code>, <Code>grep</Code> — everything stops working because Linux can&apos;t find them anymore.
        </WarningBox>
        <H3>Anatomy of the export command</H3>
        <Reveal>
          <div className="bg-text-charcoal rounded-xl p-6 font-mono text-sm overflow-x-auto">
            <div className="text-white space-y-1">
              <p><span className="text-[#6ee7b7]">export</span> <span className="text-yellow-300">PATH</span>=<span className="text-orange-300">&quot;</span><span className="text-blue-300">$PATH</span><span className="text-orange-300">:</span><span className="text-green-300">~/my-scripts</span><span className="text-orange-300">&quot;</span></p>
              <p className="text-white/40 text-xs mt-3">  └── OLD PATH ──┘ └─ NEW folder ─┘</p>
            </div>
          </div>
        </Reveal>
        <H3>Making it permanent</H3>
        <P className="mb-4"><Code>export</Code> only lasts for the current terminal session. Close it, it&apos;s gone. To survive reboots, add it to <Code>~/.bashrc</Code>:</P>
        <Reveal>
          <Terminal lines={[
            { type: "comment", content: "Add to ~/.bashrc (runs every login)" },
            { type: "command", content: "echo 'export PATH=\"$PATH:~/my-scripts\"' >> ~/.bashrc" },
            { type: "command", content: "source ~/.bashrc  # apply now without restarting" },
          ]} />
        </Reveal>
        <KeyTakeaway>~/.bashrc is a script that Bash runs every time you open a terminal. Put your PATH changes there to make them permanent.</KeyTakeaway>
      </Section>

      {/* Section 5: nano */}
      <Section id="s5" index={5} sectionRef={el => { sectionRefs.current[5] = el; }}>
        <SectionTitle title="nano — Your Terminal Text Editor" accent={accentColors[5]} />
        <P className="text-lg mb-6">On a server with no graphical desktop — no VS Code, no mouse — you edit files in the terminal. <Code>nano</Code> is the friendliest option.</P>
        <AnalogyBox>
          ...but instead of opening a window, it runs inside your terminal. Same idea: open a file, type, save, close. Just without the mouse.
        </AnalogyBox>
        <Reveal>
          <Terminal lines={[
            { type: "comment", content: "Open a file for editing" },
            { type: "command", content: "nano ~/.bashrc" },
            { type: "output", content: "" },
            { type: "comment", content: "Once inside nano:" },
            { type: "output", content: "Ctrl+O  → Save (Write Out)" },
            { type: "output", content: "Ctrl+X  → Exit" },
            { type: "output", content: "Ctrl+K  → Cut a line" },
            { type: "output", content: "Ctrl+W  → Search (Where)" },
          ]} />
        </Reveal>
        <H3>Other terminal editors</H3>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {[
              { name: "nano", desc: "Beginner friendly. Controls shown at bottom. ✅ Use this.", tag: "Recommended" },
              { name: "vim", desc: "Powerful but has a steep learning curve. Modal editing (insert mode, command mode).", tag: "Advanced" },
              { name: "emacs", desc: "Extremely powerful. More of an IDE than an editor. Massive learning curve.", tag: "Expert" },
            ].map((e, i) => (
              <Reveal key={e.name} delay={i * 0.1}>
                <div className={`p-5 rounded-xl border ${e.tag === "Recommended" ? "border-accent-moss/20 bg-accent-moss/5" : "border-text-charcoal/10 bg-bg-paper"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <code className="font-mono font-bold text-text-charcoal">{e.name}</code>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${e.tag === "Recommended" ? "bg-accent-moss/15 text-accent-moss" : "bg-text-charcoal/5 text-text-olive"}`}>{e.tag}</span>
                  </div>
                  <p className="text-sm text-text-taupe">{e.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* Quiz */}

        {/* Flashcards */}
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
