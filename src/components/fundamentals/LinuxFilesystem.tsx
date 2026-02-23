"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ArticleNav from "@/components/ui/ArticleNav";
import DropCap from "@/components/ui/DropCap";
import KeyTakeaway from "@/components/ui/KeyTakeaway";
import AnalogyBox from "@/components/ui/AnalogyBox";
import DidYouKnow from "@/components/ui/DidYouKnow";
import WarningBox from "@/components/ui/WarningBox";
import ComparisonTable from "@/components/ui/ComparisonTable";
import Terminal from "@/components/ui/Terminal";
import Collapsible from "@/components/ui/Collapsible";
import Quiz from "@/components/ui/Quiz";
import Flashcards from "@/components/ui/Flashcards";
import Confetti, { CelebrationMessage } from "@/components/ui/Confetti";

const sectionNames = [
  "What is Bash?",
  "Files & Directories",
  "The Filesystem",
  "The Root Directory",
  "Root User & su",
  "ls Commands",
];
const navSections = sectionNames.map((label, i) => ({ id: i, label }));

const sectionStyles = [
  { bg: "bg-gradient-to-br from-accent-sage/[0.07] via-bg-paper to-accent-moss/[0.05]" },
  { bg: "bg-bg-cream/40" },
  { bg: "bg-gradient-to-br from-accent-moss/[0.05] via-bg-paper to-accent-sage/[0.07]" },
  { bg: "bg-bg-paper" },
  { bg: "bg-gradient-to-br from-accent-terracotta/[0.04] via-bg-paper to-accent-sand/[0.05]" },
  { bg: "bg-bg-cream/40" },
];

const accentColors = ["sage", "moss", "sage", "moss", "terracotta", "sage"];
const accentLineColors: Record<string, string> = {
  moss: "bg-accent-moss",
  terracotta: "bg-accent-terracotta",
  sage: "bg-accent-sage",
  sand: "bg-accent-sand",
};

const quizQuestions = [
  {
    question: "What does Bash stand for?",
    options: ["Basic Advanced Shell", "Bourne Again Shell", "Binary Application Shell Handler", "Basic Application Shell"],
    correctIndex: 1,
    explanation: "Bash stands for 'Bourne Again Shell' — a play on the original 'Bourne Shell' (sh). It's been the default shell on most Linux systems since 1989.",
  },
  {
    question: "What is the difference between a file and a directory?",
    options: [
      "Files are bigger than directories",
      "A file holds data; a directory holds files and other directories",
      "Directories can only hold text files",
      "There is no difference — they are the same thing",
    ],
    correctIndex: 1,
    explanation: "A file is a single piece of data (text, image, script, etc.). A directory is a container that organizes files and other directories. Directories don't hold data themselves — they just group things together.",
  },
  {
    question: "In Linux, what does '/' mean?",
    options: ["The user's home folder", "Division in a math command", "The root — the very top of the filesystem where everything begins", "A hidden folder"],
    correctIndex: 2,
    explanation: "In Linux, / is the root directory — the very top of the entire filesystem tree. Every single file and folder on a Linux system lives somewhere under /. It's where everything starts.",
  },
  {
    question: "What can the root user do?",
    options: [
      "Only view files",
      "Only install software",
      "Absolutely anything — install software, delete files, change settings, even break the system",
      "Only manage other user accounts",
    ],
    correctIndex: 2,
    explanation: "The root user is the superuser on Linux with unrestricted access to everything. It can install software, delete files, change system settings, add/remove users, and even break the entire system if used carelessly.",
  },
  {
    question: "What is the difference between 'su testdev' and 'su - testdev'?",
    options: [
      "They do exactly the same thing",
      "'su testdev' switches user but keeps your current environment; 'su - testdev' gives you their full environment",
      "'su -' is more dangerous",
      "'su testdev' requires a password; 'su - testdev' does not",
    ],
    correctIndex: 1,
    explanation: "'su testdev' switches to that user but brings your current folder and settings. 'su - testdev' fully switches — taking you to their home folder with their settings loaded. Always use 'su -' for a clean, proper switch.",
  },
  {
    question: "What does 'll' do in Ubuntu?",
    options: [
      "Logs out of the system",
      "Lists only hidden files",
      "It's an alias for 'ls -la' — lists all files with full details",
      "Links two files together",
    ],
    correctIndex: 2,
    explanation: "'ll' is a pre-made alias for 'ls -la'. Ubuntu includes it because typing 'ls -la' many times a day gets tiring. It shows all files (including hidden dot files) with full permission details.",
  },
];

const flashcardsData = [
  { front: "What is Bash?", back: "Bourne Again Shell — the language your terminal speaks. When you type commands, Bash is the program that understands and executes them. It's the default shell on most Linux systems since 1989." },
  { front: "What is a shell?", back: "A shell is a program that lets you interact with the operating system through text commands. Bash is one shell. Others include zsh (macOS default), fish, and sh. They all do the same basic job but with different features." },
  { front: "What is a file?", back: "A single piece of data stored on disk. It has a name, contents (the actual data), and metadata (owner, permissions, size, date modified). Like a single document in a filing cabinet." },
  { front: "What is a directory?", back: "A folder that holds files and other directories. It doesn't contain data itself — it just organizes files. Like a folder in a filing cabinet that groups documents together." },
  { front: "What is a filesystem?", back: "The entire system that manages how files and directories are stored on a disk. It's the structure and rules (like ext4 on Linux) that make files and directories possible. Without it, your disk is just raw 1s and 0s." },
  { front: "What is / in Linux?", back: "The root directory — the very top of the filesystem. Every file and folder on Linux lives somewhere under /. It's where everything begins. /home, /etc, /var, /usr all live under /." },
  { front: "What is the root user?", back: "The most powerful user on a Linux system. Username is literally 'root'. Can do absolutely anything — install software, delete files, change settings, add/remove users, even break the system." },
  { front: "What does 'su - username' do?", back: "Switch User — changes to another user account with their full environment (home folder, settings, etc.). The '-' flag loads their full environment. Without '-', you switch but keep your current folder and settings." },
  { front: "What does 'ls -la' show?", back: "Lists ALL files (including hidden dot files) with full details: permissions, number of links, owner, group, file size, date modified, and filename. The most informative way to view directory contents." },
  { front: "What are hidden files in Linux?", back: "Files starting with a dot (.) are hidden. For example: .bashrc, .ssh/, .profile. They don't show in a regular 'ls' command — you need 'ls -a' or 'ls -la' to see them." },
];

/* ── Shared layout primitives ── */
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

/* ── File tree component ── */
const FileTree = ({ items, title }: { items: string[]; title?: string }) => (
  <motion.div
    className="my-8 rounded-2xl border border-text-charcoal/8 bg-bg-paper overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    {title && (
      <div className="px-5 py-3 bg-text-charcoal/[0.03] border-b border-text-charcoal/8 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-accent-terracotta/40" />
        <div className="w-3 h-3 rounded-full bg-accent-sand/40" />
        <div className="w-3 h-3 rounded-full bg-accent-moss/40" />
        <span className="ml-2 text-xs font-mono text-text-olive">{title}</span>
      </div>
    )}
    <div className="p-5 md:p-8 overflow-x-auto">
      <pre className="font-mono text-xs md:text-sm text-text-charcoal leading-relaxed whitespace-pre">{items.join("\n")}</pre>
    </div>
  </motion.div>
);

export default function LinuxFilesystem() {
  const [currentSection, setCurrentSection] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
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
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <div className="bg-bg-paper">
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      <CelebrationMessage isVisible={showCelebration} phaseName="Linux Filesystem" onClose={() => setShowCelebration(false)} />

      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5">
        <motion.div className="h-full bg-accent-sage origin-left" style={{ scaleX: scrollProgress }} />
      </div>

      <ArticleNav currentSection={currentSection} onSectionClick={scrollToSection} sections={navSections} />

      {/* ═══ HERO ═══ */}
      <header className="relative overflow-hidden min-h-[65vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-sage/[0.08] via-bg-paper to-accent-moss/[0.06]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-accent-sage)_0%,_transparent_60%)] opacity-[0.07]" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, var(--color-text-charcoal) 1px, transparent 1px)", backgroundSize: "44px 44px", opacity: 0.03 }} />

        <div className="relative w-full grid grid-cols-1 lg:grid-cols-5 gap-8 px-6 md:px-12 lg:px-20 xl:px-32 py-20 md:py-28">
          <div className="lg:col-span-3 flex flex-col justify-center">
            <motion.p className="text-sm font-mono uppercase tracking-[0.25em] text-accent-sage mb-5" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              Fundamentals
            </motion.p>
            <motion.h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-text-charcoal leading-[1.05] mb-8" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
              Linux Filesystem{" "}
              <span className="relative inline-block">
                & Shell
                <motion.span className="absolute -bottom-2 left-0 h-1 bg-accent-sage rounded-full" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8, delay: 0.8 }} />
              </span>
            </motion.h1>
            <motion.p className="text-lg md:text-xl text-text-taupe leading-relaxed mb-8 max-w-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
              What Bash actually is, how files and directories work, the Linux filesystem structure, the root directory, the root user, switching users with su, and mastering the ls command family.
            </motion.p>
            <motion.div className="flex flex-wrap gap-6 pt-8 border-t border-text-charcoal/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
              {[{ label: "6 sections", sub: "filesystem essentials" }, { label: "~25 min", sub: "estimated reading" }, { label: "Beginner", sub: "no prerequisites" }].map((s) => (
                <div key={s.label}>
                  <p className="text-lg font-serif font-semibold text-text-charcoal">{s.label}</p>
                  <p className="text-xs font-mono text-text-olive">{s.sub}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — animated terminal */}
          <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
            <motion.div
              className="w-full max-w-sm rounded-2xl overflow-hidden border border-text-charcoal/10 shadow-2xl shadow-accent-sage/10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="px-4 py-3 bg-text-charcoal flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs font-mono text-white/60">charith@ubuntu: ~</span>
              </div>
              <div className="bg-[#1a1a2e] p-5 font-mono text-sm">
                {[
                  { delay: 0.6, color: "text-green-400", content: "charith@ubuntu:~$ ls -la" },
                  { delay: 1.0, color: "text-gray-300", content: "drwxr-xr-x  5 charith charith 4096 Feb 18 projects/" },
                  { delay: 1.2, color: "text-gray-300", content: "drwxr-xr-x  3 charith charith 4096 Feb 18 notes/" },
                  { delay: 1.4, color: "text-gray-400", content: "-rw-r--r--  1 charith charith  220 Feb 18 .bashrc" },
                  { delay: 1.6, color: "text-gray-400", content: "drwx------  2 charith charith 4096 Feb 18 .ssh/" },
                  { delay: 2.0, color: "text-green-400", content: "charith@ubuntu:~$ pwd" },
                  { delay: 2.4, color: "text-gray-300", content: "/home/charith" },
                  { delay: 2.8, color: "text-green-400", content: "charith@ubuntu:~$ _" },
                ].map((line, i) => (
                  <motion.div key={i} className={`${line.color} leading-relaxed`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: line.delay }}>
                    {line.content}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-bg-paper to-transparent" />
      </header>

      {/* ══════════ SECTION 0 — What is Bash? ══════════ */}
      <Section id="section-0" index={0} sectionRef={(el) => { sectionRefs.current[0] = el; }}>
        <SectionTitle title="What is Bash?" accent={accentColors[0]} />

        <Reveal>
          <DropCap accentColor="sage">
            Bash stands for <strong>Bourne Again Shell</strong>. It&apos;s the language your terminal speaks. When you type commands in the terminal, Bash is the program that reads, understands, and executes them.
          </DropCap>
        </Reveal>

        <H3>Why is Bash Used in the Terminal?</H3>
        <P className="mb-8">Three simple reasons make Bash the go-to shell for Linux:</P>

        <Reveal>
          <div className="space-y-5 mb-10">
            {[
              {
                num: "1",
                title: "It's the default on most Linux systems",
                body: "When you open a terminal on Ubuntu or most Linux distros, Bash is already running. It's been the standard since 1989. You don't need to install anything — it's just there, ready to go.",
              },
              {
                num: "2",
                title: "It can run commands AND write scripts",
                body: "Bash works in two ways: Interactive mode (you type commands one by one and get instant results — like a live conversation) and Script mode (you write multiple commands in a .sh file and run them all at once — like writing instructions). That's exactly why script files start with #!/usr/bin/env bash — it tells the system 'use Bash to read this file.'",
              },
              {
                num: "3",
                title: "It's powerful but simple",
                body: "You can do everything with Bash — navigate folders, create files, manage users, install software, automate tasks, manage servers. All with short, simple commands.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                className="flex gap-5 p-6 rounded-2xl border border-text-charcoal/8 bg-bg-paper hover:border-accent-sage/20 hover:shadow-md transition-all"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-sage/15 text-accent-moss font-serif font-bold text-lg flex items-center justify-center">{item.num}</span>
                <div>
                  <p className="font-serif font-medium text-text-charcoal mb-2">{item.title}</p>
                  <p className="text-sm text-text-taupe leading-relaxed">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <H3>Are There Other Shells?</H3>
        <P className="mb-6">Yes! Bash is just one shell. There are others, each with slightly different features:</P>

        <Reveal>
          <ComparisonTable
            caption="Common Terminal Shells"
            headers={["Shell", "Full Name", "Notable For"]}
            rows={[
              ["bash", "Bourne Again Shell", "Default on most Linux systems since 1989"],
              ["zsh", "Z Shell", "Default on macOS. More features, better autocomplete"],
              ["sh", "Bourne Shell", "The original — very basic, maximum compatibility"],
              ["fish", "Friendly Interactive Shell", "Beginner-friendly, colorful, smart suggestions"],
            ]}
          />
        </Reveal>

        <Reveal>
          <AnalogyBox icon="🗣️">
            <p>Think of shells like different languages. English (Bash), Spanish (zsh), French (fish) — they all let you communicate with the operating system, but they have different accents and features. When you write a script, you choose which language (shell) to use at the top of the file with <Code>#!/usr/bin/env bash</Code>.</p>
          </AnalogyBox>
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="green">
            Bash is the language your Linux terminal speaks. It&apos;s been the default since 1989, works both interactively (type commands) and as a scripting language (run .sh files). Other shells like zsh and fish exist, but Bash is still the most universal.
          </KeyTakeaway>
        </Reveal>
      </Section>

      {/* ══════════ SECTION 1 — Files & Directories ══════════ */}
      <Section id="section-1" index={1} sectionRef={(el) => { sectionRefs.current[1] = el; }}>
        <SectionTitle title="Files, Directories & the Filesystem" accent={accentColors[1]} />

        <Reveal>
          <DropCap accentColor="moss">
            Three terms that look similar but mean very different things: a file is a piece of data, a directory is a folder that organizes files, and a filesystem is the entire system that makes both possible.
          </DropCap>
        </Reveal>

        <H3>The File</H3>
        <P className="mb-4">A file is a <strong className="text-text-charcoal">single piece of data</strong> stored on disk. It could be anything:</P>

        <Reveal>
          <FileTree
            title="Examples of files"
            items={[
              "report.txt           ← a text file",
              "photo.jpg            ← an image",
              "filesystem-report.sh ← a script",
              "data.csv             ← a spreadsheet",
              "notes.pdf            ← a PDF document",
            ]}
          />
        </Reveal>

        <P className="mb-8">Every file has: a <strong className="text-text-charcoal">name</strong>, <strong className="text-text-charcoal">contents</strong> (the actual data inside), and <strong className="text-text-charcoal">metadata</strong> (owner, permissions, size, date modified). Think of it as a single document in a filing cabinet.</P>

        <H3>The Directory</H3>
        <P className="mb-4">A directory is a <strong className="text-text-charcoal">folder</strong> that holds files (and other directories inside it). It doesn&apos;t contain data itself — it just organizes files.</P>

        <FileTree
          title="Directory structure example"
          items={[
            "/home/charith/",
            "├── projects/           ← directory",
            "│   ├── app.py          ← file",
            "│   └── README.md       ← file",
            "├── notes/              ← directory",
            "│   └── todo.txt        ← file",
            "└── .bashrc             ← file (hidden — starts with .)",
          ]}
        />

        <P className="mb-8">Think of a directory as a <strong className="text-text-charcoal">folder in a filing cabinet</strong>. The folder itself isn&apos;t a document — it just groups documents together.</P>

        <H3>The Filesystem</H3>
        <P className="mb-4">A filesystem is the <strong className="text-text-charcoal">entire system</strong> that manages how files and directories are stored on a disk. It&apos;s the structure and rules that make files and directories possible.</P>

        <Reveal>
          <AnalogyBox icon="🏙️">
            <p>If files are individual documents and directories are folders, the filesystem is the entire filing room — with its cabinets, the organization system, the rules for naming things, and the physical shelves everything sits on. Without the filesystem, your disk is just raw 1s and 0s with no meaning.</p>
          </AnalogyBox>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 mt-8">
            {[
              { icon: "📄", title: "File", desc: "A single piece of data. Has a name, contents, and metadata (size, owner, date).", example: "notes.txt, photo.jpg, script.sh" },
              { icon: "📁", title: "Directory", desc: "A folder that organizes files and other directories. Contains no data itself.", example: "/home/charith/, /projects/, .ssh/" },
              { icon: "💽", title: "Filesystem", desc: "The entire system that manages storage. Rules for how 1s and 0s become files you can open.", example: "ext4 (Linux), APFS (macOS), NTFS (Windows)" },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                className="p-6 rounded-2xl border border-text-charcoal/8 bg-bg-paper hover:border-accent-moss/20 hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ y: -4 }}
              >
                <span className="text-3xl block mb-3">{c.icon}</span>
                <p className="font-serif font-semibold text-text-charcoal mb-2">{c.title}</p>
                <p className="text-sm text-text-taupe leading-relaxed mb-3">{c.desc}</p>
                <code className="text-xs font-mono text-text-olive bg-bg-cream px-2 py-1 rounded">{c.example}</code>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="blue">
            File = a piece of data. Directory = a folder that organizes files. Filesystem = the entire system of rules and structure that makes files and directories possible on disk. Without a filesystem, your storage is just meaningless 1s and 0s.
          </KeyTakeaway>
        </Reveal>
      </Section>

      {/* ══════════ SECTION 2 — The Filesystem ══════════ */}
      <Section id="section-2" index={2} sectionRef={(el) => { sectionRefs.current[2] = el; }}>
        <SectionTitle title="The Linux Filesystem Structure" accent={accentColors[2]} />

        <Reveal>
          <DropCap accentColor="sage">
            In Linux, every single file and folder lives under one starting point called the root directory, written as <Code>/</Code>. This is completely different from Windows, where you have separate drives like C:\ and D:\.
          </DropCap>
        </Reveal>

        <H3>What Does <Code>/</Code> Mean?</H3>
        <P className="mb-4">In Linux, <Code>/</Code> is the <strong className="text-text-charcoal">starting point of everything</strong>. Every single file and folder on your system lives under it:</P>

        <FileTree
          title="Linux filesystem tree"
          items={[
            "/ (root directory — EVERYTHING starts here)",
            "├── home/        (your personal files)",
            "│   └── charith/ (your home folder)",
            "│       ├── projects/",
            "│       └── notes.txt",
            "├── etc/         (system settings)",
            "│   └── passwd   (user accounts list)",
            "├── var/         (logs, data)",
            "│   └── log/",
            "│       └── syslog",
            "├── usr/         (programs and utilities)",
            "├── tmp/         (temporary files)",
            "└── ... literally everything else",
          ]}
        />

        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              { path: "/home", desc: "Personal files for each user. Your stuff lives here.", icon: "🏠" },
              { path: "/etc", desc: "System configuration files. Settings for every service.", icon: "⚙️" },
              { path: "/var", desc: "Variable data — logs, databases, spool files.", icon: "📊" },
              { path: "/usr", desc: "Programs and utilities installed on the system.", icon: "🔧" },
              { path: "/tmp", desc: "Temporary files. Cleared on reboot.", icon: "🗑️" },
              { path: "/bin", desc: "Essential commands: ls, cp, mv, bash etc.", icon: "⚡" },
            ].map((d, i) => (
              <motion.div
                key={d.path}
                className="p-4 rounded-xl border border-text-charcoal/8 bg-bg-paper hover:border-accent-sage/20 transition-all"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ y: -3 }}
              >
                <span className="text-2xl block mb-2">{d.icon}</span>
                <code className="font-mono text-sm text-accent-sage font-bold">{d.path}</code>
                <p className="text-sm text-text-taupe mt-1 leading-relaxed">{d.desc}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <AnalogyBox icon="🌳">
            <p>Think of the Linux filesystem as an upside-down tree. The root <Code>/</Code> is the trunk at the very top. Branches grow downward — <Code>/home</Code>, <Code>/etc</Code>, <Code>/var</Code>. Each branch can have more branches (subdirectories). Files are the leaves at the ends. Everything connects back to the same trunk: <Code>/</Code>.</p>
          </AnalogyBox>
        </Reveal>

        <Reveal>
          <ComparisonTable
            caption="Linux vs Windows Filesystem Comparison"
            headers={["Feature", "Linux", "Windows"]}
            rows={[
              ["Starting point", "/ (one root for everything)", "C:\\ D:\\ E:\\ (separate drives)"],
              ["Path separator", "/ (forward slash)", "\\ (backslash)"],
              ["Home folder", "/home/charith", "C:\\Users\\Charith"],
              ["Config files", "/etc/", "C:\\Windows\\System32\\"],
              ["Case sensitive?", "Yes — file.txt ≠ File.txt", "No — same file"],
            ]}
          />
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="green">
            In Linux, everything lives under <Code>/</Code> — a single root that branches into <Code>/home</Code>, <Code>/etc</Code>, <Code>/var</Code>, etc. Unlike Windows with separate drives (C:\\, D:\\), Linux has one unified tree. Every path starts from <Code>/</Code>.
          </KeyTakeaway>
        </Reveal>
      </Section>

      {/* ══════════ SECTION 3 — Root Directory ══════════ */}
      <Section id="section-3" index={3} sectionRef={(el) => { sectionRefs.current[3] = el; }}>
        <SectionTitle title="The Root User" accent={accentColors[3]} />

        <Reveal>
          <DropCap accentColor="moss">
            Don&apos;t confuse the root directory (<Code>/</Code>) with the root user. They share a name but are completely different things. The root user is the most powerful user on a Linux system — it can do absolutely anything.
          </DropCap>
        </Reveal>

        <Reveal>
          <WarningBox>
            <p>The root user can do <strong>everything</strong> — including break the entire system. That&apos;s why you should never log in as root for daily work. Instead, use <Code>sudo</Code> for individual commands that need admin permissions. This limits damage if you make a mistake.</p>
          </WarningBox>
        </Reveal>

        <H3>root vs Regular User</H3>
        <Reveal>
          <ComparisonTable
            caption="Regular User vs Root"
            headers={["Action", "Regular User", "Root User"]}
            rows={[
              ["Install software", "❌ Needs sudo", "✅ Always"],
              ["Delete system files", "❌ Permission denied", "✅ No restriction"],
              ["View any file", "❌ Some files restricted", "✅ All files"],
              ["Change passwords", "Only their own", "Anyone's"],
              ["Break the system", "Hard to do accidentally", "One wrong command can do it"],
              ["Prompt", "charith@ubuntu:~$", "root@ubuntu:~#"],
            ]}
          />
        </Reveal>

        <H3>How to Tell Who You Are</H3>
        <Reveal>
          <Terminal
            title="Checking who you are"
            lines={[
              { type: "comment", content: "Check your current username" },
              { type: "command", content: "whoami" },
              { type: "output", content: "charith" },
              { type: "comment", content: "If you were root, it would show:" },
              { type: "output", content: "root" },
              { type: "comment", content: "Your prompt also tells you — $ = regular, # = root" },
              { type: "command", content: "charith@ubuntu:~$" },
              { type: "comment", content: "↑ regular user" },
              { type: "command", content: "root@ubuntu:~#" },
              { type: "comment", content: "↑ root user (the # is a warning sign!)" },
            ]}
          />
        </Reveal>

        <Reveal>
          <DidYouKnow>
            <p>The <Code>#</Code> symbol in the shell prompt is a universal warning sign — it means you are root. When you see <Code>#</Code> instead of <Code>$</Code>, be extra careful. Every command runs with unrestricted power.</p>
          </DidYouKnow>
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="yellow">
            The root user (username: root) has absolute power on Linux — can do anything, including accidentally destroy the system. Never work as root for regular tasks. Use <Code>sudo</Code> for individual commands that need admin rights. When your prompt shows <Code>#</Code> instead of <Code>$</Code>, you are root — be careful.
          </KeyTakeaway>
        </Reveal>
      </Section>

      {/* ══════════ SECTION 4 — su ══════════ */}
      <Section id="section-4" index={4} sectionRef={(el) => { sectionRefs.current[4] = el; }}>
        <SectionTitle title="Switching Users with su" accent={accentColors[4]} />

        <Reveal>
          <DropCap accentColor="terracotta">
            <Code>su</Code> stands for Switch User. It lets you change to a different user account in the terminal without logging out. The difference between <Code>su username</Code> and <Code>su - username</Code> is subtle but important.
          </DropCap>
        </Reveal>

        <H3>The Command</H3>
        <Reveal>
          <Terminal
            title="Switching to another user"
            lines={[
              { type: "comment", content: "Switch to user 'testdev'" },
              { type: "command", content: "su - testdev" },
              { type: "output", content: "Password:" },
              { type: "output", content: "testdev@ubuntu:/home/testdev$" },
              { type: "comment", content: "You are now acting as testdev — full environment loaded" },
              { type: "command", content: "whoami" },
              { type: "output", content: "testdev" },
              { type: "command", content: "pwd" },
              { type: "output", content: "/home/testdev" },
              { type: "comment", content: "Exit and go back to original user" },
              { type: "command", content: "exit" },
            ]}
          />
        </Reveal>

        <H3>With <Code>-</Code> vs Without <Code>-</Code></H3>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div className="p-6 rounded-xl border border-accent-terracotta/15 bg-accent-terracotta/[0.03]" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
              <code className="font-mono text-accent-terracotta bg-bg-cream px-2 py-1 rounded text-sm">su testdev</code>
              <p className="font-serif font-medium text-text-charcoal mt-3 mb-2">Without <Code>-</Code></p>
              <p className="text-sm text-text-taupe">Switches to testdev but <strong className="text-text-charcoal">stays in your current folder</strong> with your settings. You&apos;re the person but in the wrong house.</p>
            </motion.div>
            <motion.div className="p-6 rounded-xl border border-accent-moss/15 bg-accent-moss/[0.03]" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
              <code className="font-mono text-accent-moss bg-bg-cream px-2 py-1 rounded text-sm">su - testdev</code>
              <p className="font-serif font-medium text-text-charcoal mt-3 mb-2">With <Code>-</Code> ✅ Recommended</p>
              <p className="text-sm text-text-taupe">Switches to testdev AND <strong className="text-text-charcoal">takes you to their home folder</strong> with their settings loaded. Fully becomes that user.</p>
            </motion.div>
          </div>
        </Reveal>

        <Reveal>
          <AnalogyBox icon="🏠">
            <p>Imagine visiting someone else&apos;s apartment. <Code>su testdev</Code> = You walk into their apartment but bring your own furniture and stuff — kind of weird. <Code>su - testdev</Code> = You walk in and use everything as they set it up — their desk, their settings, their environment. Like actually becoming them. Always use <Code>-</Code> for a clean, proper switch.</p>
          </AnalogyBox>
        </Reveal>

        <Reveal>
          <div className="space-y-4">
            <Collapsible title="When do you actually use su?" index={0}>
              <p className="text-text-taupe leading-relaxed">Common scenarios: switching to the root user (<Code>su - root</Code>) to perform system administration, testing how an app behaves as a different user, or verifying that a new user account is set up correctly.</p>
            </Collapsible>
            <Collapsible title="su vs sudo — what's the difference?" index={1}>
              <p className="text-text-taupe leading-relaxed"><Code>sudo</Code> runs a single command as root without switching users. <Code>su</Code> actually switches your identity to a different user for multiple commands. For most tasks, <Code>sudo</Code> is safer and more auditable — it logs which user ran what command.</p>
            </Collapsible>
          </div>
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="blue">
            <Code>su</Code> switches your user identity in the terminal. Always use <Code>su -</Code> (with a dash) to get the full environment of the target user — their home folder, settings, and PATH. Without the dash, you switch identity but keep your current context, which causes confusing behavior.
          </KeyTakeaway>
        </Reveal>
      </Section>

      {/* ══════════ SECTION 5 — ls Commands ══════════ */}
      <Section id="section-5" index={5} sectionRef={(el) => { sectionRefs.current[5] = el; }}>
        <SectionTitle title="Mastering ls" accent={accentColors[5]} />

        <Reveal>
          <DropCap accentColor="sage">
            <Code>ls</Code> is the most used command in Linux. It lists the contents of a directory. But the real power comes from its flags — <Code>-l</Code>, <Code>-a</Code>, and combining them. And Ubuntu even gives you a shortcut: <Code>ll</Code>.
          </DropCap>
        </Reveal>

        <H3>The Four Variations</H3>
        <Reveal>
          <Terminal
            title="ls command family"
            lines={[
              { type: "comment", content: "Basic ls — just file names" },
              { type: "command", content: "ls" },
              { type: "output", content: "notes.txt  projects  script.sh" },
              { type: "comment", content: "ls -l — long format with full details" },
              { type: "command", content: "ls -l" },
              { type: "output", content: "-rw-r--r-- 1 charith charith 1024 Feb 18 10:30 notes.txt" },
              { type: "output", content: "drwxr-xr-x 2 charith charith 4096 Feb 18 10:25 projects" },
              { type: "comment", content: "ls -la — all files (including hidden) with full details" },
              { type: "command", content: "ls -la" },
              { type: "output", content: "drwxr-xr-x 5 charith charith 4096 Feb 18 ." },
              { type: "output", content: "-rw-r--r-- 1 charith charith  220 Feb 18 .bash_logout" },
              { type: "output", content: "-rw-r--r-- 1 charith charith 3526 Feb 18 .bashrc" },
              { type: "output", content: "drwx------ 2 charith charith 4096 Feb 18 .ssh" },
              { type: "comment", content: "ll — shortcut for ls -la (Ubuntu alias)" },
              { type: "command", content: "ll" },
              { type: "comment", content: "← does the exact same thing as ls -la!" },
            ]}
          />
        </Reveal>

        <H3>Reading the ls -l Output</H3>
        <P className="mb-4">That long output from <Code>ls -l</Code> looks confusing at first. Let&apos;s decode it:</P>

        <Reveal>
          <div className="p-5 rounded-2xl bg-text-charcoal/[0.03] border border-text-charcoal/8 mb-6 overflow-x-auto">
            <code className="font-mono text-sm text-text-charcoal">-rwxr-xr--  1  charith  charith  1024  Feb 18 10:30  notes.txt</code>
          </div>
        </Reveal>

        <Reveal>
          <ComparisonTable
            caption="ls -l output decoded"
            headers={["Part", "What It Means"]}
            rows={[
              ["-rwxr-xr--", "Permissions (who can read, write, execute) — more on this in File Permissions"],
              ["1", "Number of hard links to this file"],
              ["charith (first)", "Owner of the file"],
              ["charith (second)", "Group of the file"],
              ["1024", "File size in bytes"],
              ["Feb 18 10:30", "Last modified date and time"],
              ["notes.txt", "The filename"],
            ]}
          />
        </Reveal>

        <H3>Hidden Files — What the <Code>-a</Code> Flag Reveals</H3>
        <P className="mb-4">In Linux, any file or folder starting with a <Code>.</Code> (dot) is hidden. Regular <Code>ls</Code> won&apos;t show them. You need <Code>ls -a</Code> or <Code>ls -la</Code>:</P>

        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { file: ".bashrc", desc: "Your shell configuration — customizations, aliases, etc." },
              { file: ".ssh/", desc: "SSH keys and config — kept hidden for security" },
              { file: ".profile", desc: "Runs at login — sets environment variables" },
            ].map((f, i) => (
              <motion.div key={f.file} className="p-4 rounded-xl border border-text-charcoal/8 bg-bg-paper" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <code className="font-mono text-sm text-accent-sage font-bold">{f.file}</code>
                <p className="text-sm text-text-taupe mt-2 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <H3>The <Code>ll</Code> Shortcut</H3>
        <P className="mb-4">Ubuntu comes with a pre-made <strong className="text-text-charcoal">alias</strong> — a shortcut for a longer command. <Code>ll</Code> is just a shorter way to type <Code>ls -la</Code>:</P>

        <Reveal>
          <div className="p-6 rounded-2xl bg-accent-moss/[0.04] border border-accent-moss/15 mb-8">
            <div className="flex items-center gap-3 flex-wrap">
              <code className="font-mono text-accent-moss font-bold text-lg">ll</code>
              <span className="text-text-taupe font-serif text-lg">=</span>
              <code className="font-mono text-accent-moss font-bold text-lg">ls -la</code>
              <span className="text-text-taupe ml-2">They do the <strong className="text-text-charcoal">exact same thing</strong></span>
            </div>
            <p className="text-sm text-text-taupe mt-3">Because typing <Code>ls -la</Code> many times a day gets tiring, Ubuntu includes this alias by default. It&apos;s defined in your <Code>~/.bashrc</Code> file.</p>
          </div>
        </Reveal>

        <Reveal>
          <ComparisonTable
            caption="Quick ls Reference"
            headers={["Command", "What It Shows"]}
            rows={[
              ["ls", "File names only (no hidden files, no details)"],
              ["ls -l", "File names with full details (permissions, owner, size, date)"],
              ["ls -a", "All files including hidden (dot files), names only"],
              ["ls -la", "All files including hidden, with full details"],
              ["ll", "Same as ls -la (Ubuntu alias — shorter to type)"],
            ]}
          />
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="yellow">
            <Code>ls</Code> lists files. <Code>ls -l</Code> adds details. <Code>ls -a</Code> reveals hidden dot files. <Code>ls -la</Code> (or <Code>ll</Code>) does both — the most informative view. Use <Code>ll</Code> in Ubuntu for the full picture with minimal typing.
          </KeyTakeaway>
        </Reveal>
      </Section>

      {/* ══════════ QUIZ & FLASHCARDS ══════════ */}
      <section className="relative bg-gradient-to-b from-bg-paper via-accent-sage/[0.03] to-bg-paper">
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-accent-sage/10 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-accent-moss/10 to-transparent" />
        <div className="px-6 md:px-12 lg:px-20 xl:px-32 py-20 md:py-28">
          <Reveal>
            <Quiz
              title="Linux Filesystem Quiz"
              questions={quizQuestions}
              onComplete={(score, total) => {
                if (score >= total * 0.8) { setShowConfetti(true); setShowCelebration(true); }
              }}
            />
          </Reveal>
          <div className="mt-24">
            <Reveal><Flashcards cards={flashcardsData} title="Filesystem Flashcards" /></Reveal>
          </div>
          <Reveal>
            <div className="mt-24 text-center">
              <motion.a
                href="/fundamentals"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-moss text-white rounded-xl hover:bg-accent-moss/90 transition-colors font-serif text-lg shadow-lg shadow-accent-moss/20"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Fundamentals
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
