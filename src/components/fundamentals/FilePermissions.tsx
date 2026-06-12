"use client";

import { useState, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { useActivePhase } from "@/hooks/useActivePhase";
import ArticleNav from "@/components/ui/ArticleNav";
import DropCap from "@/components/ui/DropCap";
import KeyTakeaway from "@/components/ui/KeyTakeaway";
import AnalogyBox from "@/components/ui/AnalogyBox";
import DidYouKnow from "@/components/ui/DidYouKnow";
import WarningBox from "@/components/ui/WarningBox";
import ComparisonTable from "@/components/ui/ComparisonTable";
import Terminal from "@/components/ui/Terminal";
import Quiz from "@/components/ui/Quiz";
import Flashcards from "@/components/ui/Flashcards";
import Confetti, { CelebrationMessage } from "@/components/ui/Confetti";

const sectionNames = [
  "What is chmod?",
  "The Three Permissions",
  "Reading chmod Numbers",
  "Permission Strings",
  "Common Examples",
  "SSH Permissions",
  "Special Bits",
];
const navSections = sectionNames.map((label, i) => ({ id: i, label }));

const sectionStyles = [
  { bg: "bg-gradient-to-br from-accent-moss/[0.06] via-bg-paper to-accent-terracotta/[0.04]" },
  { bg: "bg-bg-cream/40" },
  { bg: "bg-gradient-to-br from-accent-terracotta/[0.04] via-bg-paper to-accent-sand/[0.05]" },
  { bg: "bg-bg-paper" },
  { bg: "bg-gradient-to-br from-accent-sage/[0.05] via-bg-paper to-accent-moss/[0.05]" },
  { bg: "bg-bg-cream/40" },
  { bg: "bg-gradient-to-br from-accent-terracotta/[0.04] via-bg-paper to-accent-sand/[0.05]" },
];

const accentColors = ["moss", "terracotta", "moss", "sage", "terracotta", "moss", "terracotta"];
const accentLineColors: Record<string, string> = {
  moss: "bg-accent-moss",
  terracotta: "bg-accent-terracotta",
  sage: "bg-accent-sage",
  sand: "bg-accent-sand",
};

const quizQuestions = [
  {
    question: "What does chmod stand for?",
    options: ["Change Mode", "Change Manager", "Character Modifier", "Command Handler"],
    correctIndex: 0,
    explanation: "chmod stands for Change Mode. It changes the mode (permissions) of a file or folder — controlling who can read, write, or execute it.",
  },
  {
    question: "In the permission number system, what value is 'write'?",
    options: ["1", "2", "4", "7"],
    correctIndex: 1,
    explanation: "Write = 2. Read = 4, Write = 2, Execute = 1. To get 'read + write', you add them: 4 + 2 = 6. Full access (read + write + execute) = 4 + 2 + 1 = 7.",
  },
  {
    question: "What does chmod 755 mean?",
    options: [
      "Owner: read only, Group: full, Others: full",
      "Owner: full, Group: read+execute, Others: read+execute",
      "Owner: full, Group: write only, Others: execute only",
      "Everyone has full access",
    ],
    correctIndex: 1,
    explanation: "chmod 755 = Owner gets 7 (rwx = full), Group gets 5 (r-x = read+execute), Others gets 5 (r-x = read+execute). Common for scripts and public programs.",
  },
  {
    question: "What does the 'd' at the start of a permission string mean?",
    options: ["Deleted file", "Directory (folder)", "Default permission", "Dangerous file"],
    correctIndex: 1,
    explanation: "The first character of a permission string tells you the type. 'd' means it's a directory (folder). '-' means it's a regular file. When you see 'drwxr-xr-x' that 'd' tells you it's a folder.",
  },
  {
    question: "Why does SSH require strict permissions on key files?",
    options: [
      "To make SSH faster",
      "Because SSH refuses to work if key files are readable by others — it's a security feature",
      "Because root requires it",
      "It's just a tradition",
    ],
    correctIndex: 1,
    explanation: "SSH is very strict about permissions as a security measure. If your private key file (~/.ssh/id_rsa) is readable by others, SSH refuses to use it — because a readable private key could be stolen. The correct permission is 600 (owner read+write only).",
  },
  {
    question: "What is SUID (Set User ID)?",
    options: [
      "A way to identify system users",
      "Makes a file run as its owner's permissions, not the person who runs it",
      "Gives everyone full access",
      "Prevents file deletion",
    ],
    correctIndex: 1,
    explanation: "SUID makes a file run as if it's being run by its owner — not by you. Example: the 'passwd' command has SUID so regular users can change their own password even though the password file is owned by root.",
  },
];

const flashcardsData = [
  { front: "What does chmod do?", back: "chmod (Change Mode) controls who can read, write, and execute a file or folder on Linux. It uses 3 digits representing owner, group, and others." },
  { front: "What are the 3 permission values?", back: "Read = 4, Write = 2, Execute = 1. Add them to combine: 6 = read+write, 5 = read+execute, 7 = read+write+execute (full access)." },
  { front: "What does chmod 755 mean?", back: "Owner: 7 (rwx = full access). Group: 5 (r-x = read+execute). Others: 5 (r-x = read+execute). Common for public scripts and programs." },
  { front: "What does chmod 600 mean?", back: "Owner: 6 (rw- = read+write). Group: 0 (no access). Others: 0 (no access). Used for private files like SSH keys." },
  { front: "What does chmod 700 mean?", back: "Owner: 7 (rwx = full access). Group: 0 (no access). Others: 0 (no access). Used for private folders like ~/.ssh/" },
  { front: "What does the first character in a permission string mean?", back: "The file type. '-' = regular file, 'd' = directory (folder). Example: 'drwxr-xr-x' starts with 'd' so it's a directory. '-rwxr-xr--' starts with '-' so it's a regular file." },
  { front: "What are the required SSH key permissions?", back: "~/.ssh/ directory: 700 (owner only). Private key (id_rsa): 600 (owner read+write only). SSH refuses to work if these are wrong — it's a security feature." },
  { front: "What is SUID?", back: "Set User ID (digit 4). Makes a file run as its owner's permissions instead of yours. Example: passwd has SUID so users can change their own password even though the password file is owned by root." },
  { front: "What is SGID?", back: "Set Group ID (digit 2). New files created inside an SGID folder automatically inherit the folder's group instead of the creator's group. Great for team shared folders." },
  { front: "What is the Sticky Bit?", back: "Sticky Bit (digit 1). In shared folders, you can only delete your own files — not other people's. Example: /tmp has the sticky bit so everyone can create temp files but can't delete each other's." },
];

/* ── Shared layout primitives ── */
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

/* ── Permission number display ── */
const PermNumber = ({ num, label, perms, color }: { num: string; label: string; perms: string; color: string }) => {
  const colors: Record<string, string> = {
    owner: "border-accent-moss/20 bg-accent-moss/10",
    group: "border-accent-terracotta/20 bg-accent-terracotta/10",
    others: "border-accent-sand/30 bg-accent-sand/15",
  };
  return (
    <div className={`flex-1 text-center p-5 rounded-2xl border-2 ${colors[color] || colors.owner}`}>
      <div className="text-5xl font-serif font-bold text-text-charcoal mb-2">{num}</div>
      <div className="text-sm font-mono font-bold text-text-charcoal mb-1">{perms}</div>
      <div className="text-xs text-text-olive font-serif">{label}</div>
    </div>
  );
};

/* ── Animated permission bar ── */
const PermBar = ({ r, w, x }: { r: boolean; w: boolean; x: boolean }) => (
  <div className="flex gap-2">
    {[{ label: "r", on: r, desc: "read" }, { label: "w", on: w, desc: "write" }, { label: "x", on: x, desc: "execute" }].map((p) => (
      <motion.div
        key={p.label}
        className={`px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${p.on ? "bg-accent-moss/15 text-accent-moss border border-accent-moss/25" : "bg-text-charcoal/5 text-text-charcoal/30 border border-text-charcoal/10"}`}
        whileHover={{ scale: 1.05 }}
      >
        {p.on ? p.label : "-"}
      </motion.div>
    ))}
  </div>
);

export default function FilePermissions() {
  const [currentSection, setCurrentSection] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { scrollYProgress } = useScroll();

  const scrollToSection = (id: number) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useActivePhase(sectionRefs, setCurrentSection);

  return (
    <div className="bg-bg-paper">
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      <CelebrationMessage isVisible={showCelebration} phaseName="File Permissions" onClose={() => setShowCelebration(false)} />

      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5">
        <motion.div className="h-full bg-accent-moss origin-left" style={{ scaleX: scrollYProgress }} />
      </div>

      <ArticleNav currentSection={currentSection} onSectionClick={scrollToSection} sections={navSections} />

      {/* ═══ HERO ═══ */}
      <header className="relative overflow-hidden min-h-[65vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-moss/[0.07] via-bg-paper to-accent-terracotta/[0.04]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-accent-moss)_0%,_transparent_60%)] opacity-[0.06]" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, var(--color-text-charcoal) 1px, transparent 1px)", backgroundSize: "44px 44px", opacity: 0.03 }} />

        <div className="relative w-full grid grid-cols-1 lg:grid-cols-5 gap-8 px-6 md:px-12 lg:px-20 xl:px-32 py-20 md:py-28">
          <div className="lg:col-span-3 flex flex-col justify-center">
            <motion.p className="text-sm font-mono uppercase tracking-[0.25em] text-accent-moss mb-5" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              Fundamentals
            </motion.p>
            <motion.h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-text-charcoal leading-[1.05] mb-8" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
              File{" "}
              <span className="relative inline-block">
                Permissions
                <motion.span className="absolute -bottom-2 left-0 h-1 bg-accent-moss rounded-full" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8, delay: 0.8 }} />
              </span>
            </motion.h1>
            <motion.p className="text-lg md:text-xl text-text-taupe leading-relaxed mb-8 max-w-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
              chmod demystified — who can read, write, and execute files, how permission numbers work, reading ls -l output, SSH key requirements, and advanced SUID/SGID/Sticky bits.
            </motion.p>
            <motion.div className="flex flex-wrap gap-6 pt-8 border-t border-text-charcoal/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
              {[{ label: "7 sections", sub: "permissions mastery" }, { label: "~25 min", sub: "estimated reading" }, { label: "Beginner", sub: "no prerequisites" }].map((s) => (
                <div key={s.label}>
                  <p className="text-lg font-serif font-semibold text-text-charcoal">{s.label}</p>
                  <p className="text-xs font-mono text-text-olive">{s.sub}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — animated chmod visual */}
          <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
            <motion.div className="w-full max-w-sm" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
              {/* chmod 755 visual */}
              <div className="p-6 rounded-2xl bg-text-charcoal border border-text-charcoal/20 shadow-2xl mb-4">
                <div className="font-mono text-green-400 mb-4 text-sm">$ chmod 755 myfile.sh</div>
                <div className="flex gap-3 justify-center mb-4">
                  {[
                    { digit: "7", label: "Owner", perms: "rwx", color: "#3A5A40" },
                    { digit: "5", label: "Group", perms: "r-x", color: "#BC4749" },
                    { digit: "5", label: "Others", perms: "r-x", color: "#D4A373" },
                  ].map((d, i) => (
                    <motion.div
                      key={d.label}
                      className="flex-1 text-center p-3 rounded-xl border border-white/10"
                      style={{ backgroundColor: `${d.color}22` }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.15, duration: 0.4 }}
                    >
                      <div className="text-3xl font-bold mb-1" style={{ color: d.color }}>{d.digit}</div>
                      <div className="text-xs font-mono text-gray-300">{d.perms}</div>
                      <div className="text-xs text-gray-500 mt-1">{d.label}</div>
                    </motion.div>
                  ))}
                </div>
                <motion.div className="font-mono text-sm text-gray-300 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                  -rwxr-xr-x  myfile.sh
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-bg-paper to-transparent" />
      </header>

      {/* ══════════ SECTION 0 — What is chmod? ══════════ */}
      <Section id="section-0" index={0} sectionRef={(el) => { sectionRefs.current[0] = el; }}>
        <SectionTitle title="What is chmod?" accent={accentColors[0]} />

        <Reveal>
          <DropCap accentColor="moss">
            chmod stands for <strong>Change Mode</strong>. It controls who can do what with a file or folder on Linux. Every file has permissions that determine whether the owner, the group, or everyone else can read it, write to it, or execute it.
          </DropCap>
        </Reveal>

        <H3>The Three Types of People</H3>
        <P className="mb-6">Every file in Linux has permissions for three categories of people:</P>

        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              { icon: "👤", title: "Owner", desc: "The person who created the file. Has the most control over it. Usually you.", color: "border-accent-moss/20 bg-accent-moss/[0.05]" },
              { icon: "👥", title: "Group", desc: "A collection of users who share access. Files can belong to a group like 'developers' or 'admins'.", color: "border-accent-terracotta/20 bg-accent-terracotta/[0.04]" },
              { icon: "🌍", title: "Others", desc: "Everyone else on the system — people who are neither the owner nor in the group.", color: "border-accent-sand/25 bg-accent-sand/[0.05]" },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                className={`p-6 rounded-2xl border ${c.color} text-center`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <span className="text-4xl block mb-3">{c.icon}</span>
                <p className="font-serif font-semibold text-text-charcoal text-lg mb-2">{c.title}</p>
                <p className="text-sm text-text-taupe leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <AnalogyBox icon="🏢">
            <p>Think of a document at work. The <strong>Owner</strong> is the person who wrote it — they can edit, share, or delete it. The <strong>Group</strong> is the team (like &ldquo;Marketing&rdquo;) who can read it but not edit it. <strong>Others</strong> are everyone else in the company — maybe they can&apos;t see it at all.</p>
          </AnalogyBox>
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="green">
            chmod controls file permissions for three categories: Owner (the creator), Group (a shared team), and Others (everyone else). Each gets their own set of permissions independently. A file can be wide open for the owner but locked for everyone else.
          </KeyTakeaway>
        </Reveal>
      </Section>

      {/* ══════════ SECTION 1 — The Three Permissions ══════════ */}
      <Section id="section-1" index={1} sectionRef={(el) => { sectionRefs.current[1] = el; }}>
        <SectionTitle title="The Three Permissions" accent={accentColors[1]} />

        <Reveal>
          <DropCap accentColor="terracotta">
            For each of the three types of people (owner, group, others), there are exactly three possible permissions: read, write, and execute. Each can be independently turned on or off.
          </DropCap>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              {
                letter: "r", name: "Read", value: "4", icon: "👁️",
                forFile: "Open and view the file contents",
                forDir: "List what's inside the directory (ls)",
                color: "border-accent-moss/20 bg-accent-moss/[0.05]",
              },
              {
                letter: "w", name: "Write", value: "2", icon: "✏️",
                forFile: "Modify, edit, or delete the file",
                forDir: "Create, delete, or rename files inside",
                color: "border-accent-terracotta/20 bg-accent-terracotta/[0.04]",
              },
              {
                letter: "x", name: "Execute", value: "1", icon: "▶️",
                forFile: "Run it as a program or script",
                forDir: "Enter the directory (cd)",
                color: "border-accent-sand/25 bg-accent-sand/[0.05]",
              },
            ].map((p, i) => (
              <motion.div
                key={p.letter}
                className={`p-6 rounded-2xl border ${p.color}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <code className="font-mono text-4xl font-bold text-text-charcoal">{p.letter}</code>
                  <div className="text-right">
                    <span className="text-3xl">{p.icon}</span>
                    <p className="text-xs font-mono text-text-olive mt-1">value = {p.value}</p>
                  </div>
                </div>
                <p className="font-serif font-semibold text-text-charcoal mb-4">{p.name}</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-text-olive mb-1">For a File</p>
                    <p className="text-sm text-text-taupe">{p.forFile}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-text-olive mb-1">For a Directory</p>
                    <p className="text-sm text-text-taupe">{p.forDir}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <H3>The Number System</H3>
        <P className="mb-6">Each permission has a numeric value. You add them together to get the permission number for each person:</P>

        <Reveal>
          <div className="p-6 rounded-2xl bg-bg-cream/60 border border-text-charcoal/8 mb-8 overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b border-text-charcoal/10">
                  <th className="text-left py-2 pr-4 text-text-olive font-normal">Permission</th>
                  <th className="text-left py-2 pr-4 text-text-olive font-normal">Value</th>
                  <th className="text-left py-2 text-text-olive font-normal">Means</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-text-charcoal/5">
                {[
                  { p: "r", v: "4", m: "Can read the file" },
                  { p: "w", v: "2", m: "Can write/modify the file" },
                  { p: "x", v: "1", m: "Can execute the file" },
                  { p: "rw", v: "4+2 = 6", m: "Read and write" },
                  { p: "rx", v: "4+1 = 5", m: "Read and execute" },
                  { p: "rwx", v: "4+2+1 = 7", m: "Full access (read, write, execute)" },
                  { p: "-", v: "0", m: "No access at all" },
                ].map((row) => (
                  <tr key={row.p}>
                    <td className="py-2 pr-4"><span className="text-accent-moss font-bold">{row.p}</span></td>
                    <td className="py-2 pr-4 text-accent-terracotta">{row.v}</td>
                    <td className="py-2 text-text-taupe font-sans">{row.m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="blue">
            r=4, w=2, x=1. Add them to get permission numbers. 7 = full access (4+2+1). 6 = read+write. 5 = read+execute. 4 = read only. 0 = no access. These three digits (one per person type) make up every chmod command.
          </KeyTakeaway>
        </Reveal>
      </Section>

      {/* ══════════ SECTION 2 — Reading chmod Numbers ══════════ */}
      <Section id="section-2" index={2} sectionRef={(el) => { sectionRefs.current[2] = el; }}>
        <SectionTitle title="Reading chmod Numbers" accent={accentColors[2]} />

        <Reveal>
          <DropCap accentColor="moss">
            Now that you know the permission values, reading any chmod command becomes straightforward. Every chmod command has 3 digits — one for owner, one for group, one for others.
          </DropCap>
        </Reveal>

        <H3>chmod 754 — A Full Example</H3>

        <Reveal>
          <div className="flex gap-4 mb-8 flex-wrap sm:flex-nowrap">
            <PermNumber num="7" label="Owner" perms="rwx — Full access" color="owner" />
            <PermNumber num="5" label="Group" perms="r-x — Read & execute" color="group" />
            <PermNumber num="4" label="Others" perms="r-- — Read only" color="others" />
          </div>
        </Reveal>

        <H3>Common chmod Numbers Decoded</H3>
        <Reveal>
          <div className="space-y-4 mb-8">
            {[
              { chmod: "chmod 777", owner: [true, true, true], group: [true, true, true], others: [true, true, true], desc: "Everyone has full access. Rarely needed. Usually a security risk.", danger: true },
              { chmod: "chmod 755", owner: [true, true, true], group: [true, false, true], others: [true, false, true], desc: "Owner has full access. Others can read and execute. Common for public scripts.", danger: false },
              { chmod: "chmod 700", owner: [true, true, true], group: [false, false, false], others: [false, false, false], desc: "Owner only. Nobody else can even see the contents. Used for private folders like ~/.ssh/", danger: false },
              { chmod: "chmod 644", owner: [true, true, false], group: [true, false, false], others: [true, false, false], desc: "Owner can read+write. Everyone else can only read. Common for config files.", danger: false },
              { chmod: "chmod 600", owner: [true, true, false], group: [false, false, false], others: [false, false, false], desc: "Owner can read+write. Nobody else has any access. Required for SSH private keys.", danger: false },
            ].map((row, i) => (
              <motion.div
                key={row.chmod}
                className={`p-5 rounded-2xl border ${row.danger ? "border-accent-terracotta/20 bg-accent-terracotta/[0.03]" : "border-text-charcoal/8 bg-bg-paper"} hover:shadow-md transition-all`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <code className={`font-mono font-bold text-lg flex-shrink-0 ${row.danger ? "text-accent-terracotta" : "text-accent-moss"}`}>{row.chmod}</code>
                  <div className="flex gap-6 flex-wrap">
                    <div>
                      <p className="text-xs font-mono text-text-olive mb-1">Owner</p>
                      <PermBar r={row.owner[0]} w={row.owner[1]} x={row.owner[2]} />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-text-olive mb-1">Group</p>
                      <PermBar r={row.group[0]} w={row.group[1]} x={row.group[2]} />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-text-olive mb-1">Others</p>
                      <PermBar r={row.others[0]} w={row.others[1]} x={row.others[2]} />
                    </div>
                  </div>
                </div>
                <p className={`text-sm mt-3 ${row.danger ? "text-accent-terracotta" : "text-text-taupe"}`}>{row.desc}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <AnalogyBox icon="🏢">
            <p><strong>chmod 700</strong> = Locked in YOUR personal drawer. Only you can see it. <br />
            <strong>chmod 755</strong> = Pinned on the notice board. Everyone can READ it, but only you can EDIT it. <br />
            <strong>chmod 777</strong> = Anybody can read it, edit it, and do whatever they want. (Not safe!) <br />
            <strong>chmod 600</strong> = In your personal folder. Only you can read and edit. Nobody else even knows it exists.</p>
          </AnalogyBox>
        </Reveal>

        <Reveal>
          <Terminal
            title="Quick reference commands"
            lines={[
              { type: "comment", content: "View current permissions of a file" },
              { type: "command", content: "ls -l myfile.txt" },
              { type: "output", content: "-rw-r--r-- 1 charith charith 1024 Feb 18 myfile.txt" },
              { type: "comment", content: "Give owner full access, no access to others" },
              { type: "command", content: "chmod 700 filename" },
              { type: "comment", content: "Make a script executable" },
              { type: "command", content: "chmod +x script.sh" },
              { type: "comment", content: "Give owner read/write, group read, others nothing" },
              { type: "command", content: "chmod 640 filename" },
              { type: "comment", content: "Apply permissions to a folder and everything inside" },
              { type: "command", content: "chmod -R 755 foldername" },
            ]}
          />
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="green">
            chmod 3-digit format: digit 1 = owner, digit 2 = group, digit 3 = others. Each digit is the sum of r(4) + w(2) + x(1). 7 = full, 5 = read+execute, 4 = read only, 0 = no access. Most files are 644 (owner rw, others r). Most scripts are 755 (owner rwx, others rx). Private keys are 600.
          </KeyTakeaway>
        </Reveal>
      </Section>

      {/* ══════════ SECTION 3 — Permission Strings ══════════ */}
      <Section id="section-3" index={3} sectionRef={(el) => { sectionRefs.current[3] = el; }}>
        <SectionTitle title="Reading Permission Strings" accent={accentColors[3]} />

        <Reveal>
          <DropCap accentColor="sage">
            When you run ls -l, you see permission strings like <Code>-rwxr-xr--</Code>. At first they look cryptic, but they follow a simple pattern you can decode in seconds once you know the structure.
          </DropCap>
        </Reveal>

        <H3>The Permission String Structure</H3>
        <Reveal>
          <div className="p-5 rounded-2xl bg-text-charcoal/[0.03] border border-text-charcoal/8 mb-6 overflow-x-auto">
            <code className="font-mono text-base text-text-charcoal">-rwxr-xr--  1  charith  charith  1024  Feb 18 10:30  notes.txt</code>
          </div>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { chars: "-", label: "Type", desc: "'-' = regular file\n'd' = directory", color: "bg-accent-sand/15" },
              { chars: "rwx", label: "Owner", desc: "r=read, w=write, x=execute\n7 = full access", color: "bg-accent-moss/10" },
              { chars: "r-x", label: "Group", desc: "r=read, -=no write, x=execute\n5 = read+execute", color: "bg-accent-terracotta/8" },
              { chars: "r--", label: "Others", desc: "r=read, -=no write, -=no execute\n4 = read only", color: "bg-accent-sage/10" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className={`p-5 rounded-2xl border border-text-charcoal/8 ${s.color} text-center`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <code className="font-mono text-2xl font-bold text-text-charcoal block mb-2">{s.chars}</code>
                <p className="font-serif font-semibold text-text-charcoal mb-2">{s.label}</p>
                <p className="text-xs text-text-taupe whitespace-pre-line leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <H3>The First Character — File or Directory?</H3>
        <Reveal>
          <ComparisonTable
            caption="First character meaning"
            headers={["First Character", "Meaning"]}
            rows={[
              ["d", "Directory (folder) — drwxr-xr-x"],
              ["-", "Regular file — -rwxr-xr--"],
            ]}
          />
        </Reveal>

        <H3>Real Examples from ls -la</H3>
        <Reveal>
          <Terminal
            title="ls -la output — decoded"
            lines={[
              { type: "command", content: "ls -la" },
              { type: "output", content: "drwxr-x--- → d = FOLDER  (.)" },
              { type: "output", content: "drwxr-xr-x → d = FOLDER  (..)" },
              { type: "output", content: "-rw-r--r-- → - = FILE    (.bash_logout)" },
              { type: "output", content: "-rw-r--r-- → - = FILE    (.bashrc)" },
              { type: "output", content: "drwxr-xr-x → d = FOLDER  (.local)" },
              { type: "output", content: "-rw-r--r-- → - = FILE    (.profile)" },
              { type: "output", content: "drwxr-xr-x → d = FOLDER  (projects)" },
              { type: "output", content: "drwx------ → d = FOLDER  (.ssh)" },
            ]}
          />
        </Reveal>

        <Reveal>
          <DidYouKnow>
            <p>The very first character tells you immediately whether something is a file or folder. <Code>d</Code> means directory, <Code>-</Code> means regular file. Just look at the very first character — <Code>d</Code> for directory, <Code>-</Code> for file. Simple!</p>
          </DidYouKnow>
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="yellow">
            Permission strings have 10 characters: 1 type character + 3 owner + 3 group + 3 others. <Code>d</Code> = directory, <Code>-</Code> = regular file. Each group of 3 shows r (read), w (write), x (execute), or <Code>-</Code> (no permission). Read them left to right: type, owner, group, others.
          </KeyTakeaway>
        </Reveal>
      </Section>

      {/* ══════════ SECTION 4 — Common Examples ══════════ */}
      <Section id="section-4" index={4} sectionRef={(el) => { sectionRefs.current[4] = el; }}>
        <SectionTitle title="Common Examples & Real-World Use" accent={accentColors[4]} />

        <Reveal>
          <DropCap accentColor="terracotta">
            Let&apos;s connect everything to real situations you&apos;ll encounter. These are the most common permission patterns and exactly when and why you&apos;d use each one.
          </DropCap>
        </Reveal>

        <Reveal>
          <div className="space-y-5 mb-10">
            {[
              {
                scenario: "Your personal SSH private key",
                chmod: "600",
                str: "-rw-------",
                why: "ONLY you can read and write. No group, no others. If anyone else can read your private key, SSH refuses to use it — it's compromised.",
                icon: "🔑",
              },
              {
                scenario: "A shell script you want to run",
                chmod: "755",
                str: "-rwxr-xr-x",
                why: "You have full control (edit + run). Others can run it but not modify it. Standard for publicly available programs.",
                icon: "📜",
              },
              {
                scenario: "A website config file",
                chmod: "644",
                str: "-rw-r--r--",
                why: "You can edit it. Web server process (different user) can read it. Nobody else can write to it. Standard for non-executable files.",
                icon: "⚙️",
              },
              {
                scenario: "Your ~/.ssh/ directory",
                chmod: "700",
                str: "drwx------",
                why: "Only you can see what's inside. No group, no others. SSH requires this — it won't work if others can list your .ssh folder.",
                icon: "📁",
              },
              {
                scenario: "A shared team folder",
                chmod: "775",
                str: "drwxrwxr-x",
                why: "You and your group can do everything (create, delete, edit). Others can only read. Good for collaborative team directories.",
                icon: "👥",
              },
            ].map((item, i) => (
              <motion.div
                key={item.chmod}
                className="p-6 rounded-2xl border border-text-charcoal/8 bg-bg-paper hover:border-accent-moss/15 hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <p className="font-serif font-semibold text-text-charcoal">{item.scenario}</p>
                      <code className="font-mono text-sm text-accent-moss bg-accent-moss/8 px-2 py-0.5 rounded">chmod {item.chmod}</code>
                      <code className="font-mono text-xs text-text-olive bg-bg-cream px-2 py-0.5 rounded">{item.str}</code>
                    </div>
                    <p className="text-sm text-text-taupe leading-relaxed">{item.why}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="green">
            The most important chmod values to memorize: <Code>600</Code> for private files (SSH keys), <Code>700</Code> for private directories (.ssh/), <Code>644</Code> for config files, <Code>755</Code> for scripts and programs. These cover 90% of real-world situations.
          </KeyTakeaway>
        </Reveal>
      </Section>

      {/* ══════════ SECTION 5 — SSH Permissions ══════════ */}
      <Section id="section-5" index={5} sectionRef={(el) => { sectionRefs.current[5] = el; }}>
        <SectionTitle title="SSH & Permissions" accent={accentColors[5]} />

        <Reveal>
          <DropCap accentColor="moss">
            SSH has the strictest permission requirements of any common tool. It will flat-out refuse to work if your key files have incorrect permissions — this is intentional, and it makes you safer.
          </DropCap>
        </Reveal>

        <Reveal>
          <WarningBox>
            <p>If you get &ldquo;Permissions are too open&rdquo; or &ldquo;WARNING: UNPROTECTED PRIVATE KEY FILE!&rdquo; — SSH is rejecting your key because the file permissions are wrong. Fix them with the commands below. This is the most common SSH error beginners hit.</p>
          </WarningBox>
        </Reveal>

        <H3>Required SSH Permissions</H3>
        <Reveal>
          <ComparisonTable
            caption="SSH file permission requirements"
            headers={["File/Folder", "Required Permission", "Why"]}
            rows={[
              ["~/.ssh/ directory", "700 (drwx------)", "Only you can list what's inside — prevents others seeing your keys"],
              ["~/.ssh/id_rsa (private key)", "600 (-rw-------)", "Only you can read — if others can read it, it's compromised"],
              ["~/.ssh/id_rsa.pub (public key)", "644 (-rw-r--r--)", "Public key is meant to be shared — others can read it"],
              ["~/.ssh/authorized_keys", "600 (-rw-------)", "SSH server rejects it if group or others can write to it"],
              ["~/.ssh/config", "600 (-rw-------)", "Config file with connection settings — keep it private"],
            ]}
          />
        </Reveal>

        <Reveal>
          <Terminal
            title="Fixing SSH permissions"
            lines={[
              { type: "comment", content: "Fix your .ssh directory" },
              { type: "command", content: "chmod 700 ~/.ssh" },
              { type: "comment", content: "Fix your private key" },
              { type: "command", content: "chmod 600 ~/.ssh/id_rsa" },
              { type: "comment", content: "Fix your public key" },
              { type: "command", content: "chmod 644 ~/.ssh/id_rsa.pub" },
              { type: "comment", content: "Fix authorized_keys" },
              { type: "command", content: "chmod 600 ~/.ssh/authorized_keys" },
              { type: "comment", content: "Verify everything looks right" },
              { type: "command", content: "ls -la ~/.ssh" },
              { type: "output", content: "drwx------  charith  charith  .ssh" },
              { type: "output", content: "-rw-------  charith  charith  id_rsa" },
              { type: "output", content: "-rw-r--r--  charith  charith  id_rsa.pub" },
            ]}
          />
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="blue">
            SSH requires: <Code>~/.ssh/</Code> = 700, private key = 600, public key = 644, authorized_keys = 600. If you get SSH permission errors, these are the first thing to check and fix. SSH refuses loose permissions as a security feature — it&apos;s protecting your access.
          </KeyTakeaway>
        </Reveal>
      </Section>

      {/* ══════════ SECTION 6 — Special Bits ══════════ */}
      <Section id="section-6" index={6} sectionRef={(el) => { sectionRefs.current[6] = el; }}>
        <SectionTitle title="Special Permission Bits" accent={accentColors[6]} />

        <Reveal>
          <DropCap accentColor="terracotta">
            Beyond the standard 3 digits, chmod can take a 4th digit at the front for three special permission bits: SUID, SGID, and the Sticky Bit. These are advanced but important — you&apos;ll see them on real systems.
          </DropCap>
        </Reveal>

        <Reveal>
          <div className="space-y-6 mb-10">
            {[
              {
                digit: "4",
                name: "SUID — Set User ID",
                code: "chmod 4755",
                icon: "🎫",
                what: "When you run this file, it runs as the file's OWNER — not as you.",
                example: "The passwd command lets regular users change their own password. But passwords are stored in /etc/shadow, which only root can edit. passwd has SUID set — so when you run it, it temporarily runs as root to edit the shadow file.",
                analogy: "You're an employee, but you have a special key card that temporarily gives you manager-level access for one specific task only.",
                color: "border-accent-moss/20 bg-accent-moss/[0.04]",
              },
              {
                digit: "2",
                name: "SGID — Set Group ID",
                code: "chmod 2775",
                icon: "🏷️",
                what: "New files created inside this folder automatically inherit the folder's group instead of the creator's group.",
                example: "A shared team project folder with SGID set: when any developer creates a file inside it, it gets tagged with the 'developers' group automatically — even if that developer normally belongs to a different group.",
                analogy: "A shared team folder — anything you put inside automatically gets tagged with the team name, not your personal name.",
                color: "border-accent-terracotta/15 bg-accent-terracotta/[0.03]",
              },
              {
                digit: "1",
                name: "Sticky Bit",
                code: "chmod 1777",
                icon: "📌",
                what: "In a shared folder, you can only delete YOUR OWN files — not other people's.",
                example: "/tmp is a folder where ALL users can create temporary files. Without sticky bit, anyone could delete anyone else's files. With chmod 1777 (sticky), you can only delete files you own.",
                analogy: "A community fridge at work. Everyone can put their lunch in it, but you can only throw away your own food — not someone else's.",
                color: "border-accent-sand/25 bg-accent-sand/[0.04]",
              },
            ].map((bit, i) => (
              <motion.div
                key={bit.digit}
                className={`rounded-2xl border ${bit.color} overflow-hidden`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl flex-shrink-0">{bit.icon}</span>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <span className="font-serif font-bold text-xl text-text-charcoal">4th digit = {bit.digit}</span>
                        <code className="font-mono text-sm text-accent-moss bg-accent-moss/8 px-2 py-0.5 rounded">{bit.code}</code>
                      </div>
                      <p className="font-serif text-lg text-text-charcoal">{bit.name}</p>
                    </div>
                  </div>
                  <p className="text-text-taupe leading-relaxed mb-3"><strong className="text-text-charcoal">What it does:</strong> {bit.what}</p>
                  <p className="text-text-taupe leading-relaxed mb-3"><strong className="text-text-charcoal">Real example:</strong> {bit.example}</p>
                  <p className="text-sm text-text-olive italic"><strong className="text-text-charcoal not-italic">Analogy:</strong> {bit.analogy}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <H3>Quick Summary</H3>
        <Reveal>
          <ComparisonTable
            caption="4th Digit Special Bits"
            headers={["4th Digit", "Name", "What It Does"]}
            rows={[
              ["4", "SUID", "File runs as the owner (not you) — chmod 4755"],
              ["2", "SGID", "New files in folder inherit the folder's group — chmod 2775"],
              ["1", "Sticky Bit", "You can only delete your own files in shared folder — chmod 1777"],
            ]}
          />
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="yellow">
            Special bits (4th digit): SUID(4) makes files run as their owner — used for commands like passwd that need temporary root access. SGID(2) auto-tags new files with the folder&apos;s group — great for team projects. Sticky Bit(1) protects shared folders so users can only delete their own files — used on /tmp.
          </KeyTakeaway>
        </Reveal>
      </Section>

      {/* ══════════ QUIZ & FLASHCARDS ══════════ */}
      <section className="relative bg-gradient-to-b from-bg-paper via-accent-moss/[0.03] to-bg-paper">
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-accent-moss/10 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-accent-terracotta/10 to-transparent" />
        <div className="px-6 md:px-12 lg:px-20 xl:px-32 py-20 md:py-28">
          <Reveal>
            <Quiz
              title="File Permissions Quiz"
              questions={quizQuestions}
              onComplete={(score, total) => {
                if (score >= total * 0.8) { setShowConfetti(true); setShowCelebration(true); }
              }}
            />
          </Reveal>
          <div className="mt-24">
            <Reveal><Flashcards cards={flashcardsData} title="Permissions Flashcards" /></Reveal>
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
