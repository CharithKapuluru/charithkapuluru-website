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
  "What is a Cron Job?",
  "The Schedule Format",
  "Reading the Format",
  "Managing Crontabs",
  "Real Examples",
];
const navSections = sectionNames.map((label, i) => ({ id: i, label }));

const sectionStyles = [
  { bg: "bg-gradient-to-br from-accent-sand/[0.08] via-bg-paper to-accent-moss/[0.04]" },
  { bg: "bg-bg-cream/40" },
  { bg: "bg-gradient-to-br from-accent-moss/[0.04] via-bg-paper to-accent-sage/[0.05]" },
  { bg: "bg-bg-paper" },
  { bg: "bg-gradient-to-br from-accent-terracotta/[0.04] via-bg-paper to-accent-sand/[0.04]" },
];

const accentColors = ["sand", "moss", "sage", "terracotta", "moss"];
const accentLineColors: Record<string, string> = {
  moss: "bg-accent-moss",
  terracotta: "bg-accent-terracotta",
  sage: "bg-accent-sage",
  sand: "bg-accent-sand",
};

const quizQuestions = [
  {
    question: "What is a cron job?",
    options: [
      "A Linux process manager",
      "A scheduled task — a command that runs automatically at a time you specify",
      "A type of background daemon",
      "A user account for automated tasks",
    ],
    correctIndex: 1,
    explanation: "A cron job is Linux's task scheduler. Like setting an alarm: alarm = wakes you at 7am every day. Cron job = runs your backup script at 2am every day. Used by every production server for maintenance, monitoring, and automation.",
  },
  {
    question: "What does '*/5 * * * *' mean in a cron schedule?",
    options: [
      "Every 5 hours",
      "Every 5 days",
      "Every 5 minutes",
      "5 times per second",
    ],
    correctIndex: 2,
    explanation: "*/5 in the minute field means 'every 5 minutes' — i.e., at minute 0, 5, 10, 15, 20... The */ syntax means 'every N'. So */5 * * * * = every 5 minutes, every hour, every day, every month, every day of week.",
  },
  {
    question: "What does '0 9 * * 1' mean?",
    options: [
      "Every 9 minutes on Mondays",
      "Every Monday at 9am",
      "9am on the first of every month",
      "Every hour at minute 9, only on Mondays",
    ],
    correctIndex: 1,
    explanation: "0 = minute 0 (on the hour), 9 = 9am, * = any day of month, * = any month, 1 = Monday (0=Sunday, 1=Monday... 6=Saturday). So: every Monday at 9:00am.",
  },
  {
    question: "What command do you use to edit your cron jobs?",
    options: [
      "sudo cron edit",
      "crontab -e",
      "nano /etc/cron",
      "systemctl edit cron",
    ],
    correctIndex: 1,
    explanation: "crontab -e opens your personal crontab file in a text editor. Each user has their own crontab. crontab -l lists your current jobs. crontab -r removes ALL your jobs (be careful with this one!).",
  },
  {
    question: "Why do production servers use cron jobs?",
    options: [
      "They don't — cron is only for personal use",
      "For automating recurring tasks: backups, log cleanup, metric collection, report generation",
      "To replace systemd services",
      "For security monitoring only",
    ],
    correctIndex: 1,
    explanation: "Every production server uses cron extensively: run backups at 2am (off-peak), collect metrics every minute, clean old log files every Sunday, generate billing reports monthly. Automation that runs reliably without human intervention.",
  },
];

const flashcardsData = [
  { front: "What is a cron job?", back: "A scheduled task — a command that runs automatically at a time you specify. Like setting an alarm, but for scripts." },
  { front: "Cron format", back: "* * * * * command — minute(0-59) hour(0-23) day-of-month(1-31) month(1-12) day-of-week(0=Sun-6=Sat)" },
  { front: "What does * mean in cron?", back: "'Every'. * in the hour field = every hour. * in the month field = every month. All * = 'every minute of every day'." },
  { front: "*/5 * * * *", back: "Every 5 minutes. The */ syntax means 'every N of that unit'. */5 in minutes = every 5 minutes." },
  { front: "0 2 * * *", back: "Every day at 2am. 0 = minute 0 (on the hour), 2 = 2am, * * * = any day/month/weekday." },
  { front: "How to edit cron jobs?", back: "crontab -e (edit), crontab -l (list), crontab -r (remove ALL — be careful!). Each user has their own crontab file." },
  { front: "Where do production cron outputs go?", back: "By default, cron emails output to the local user. Better practice: redirect to a log file: */5 * * * * /path/script.sh >> /var/log/myscript.log 2>&1" },
];

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" as const } }),
};

const Section = ({ id, index, children, sectionRef }: { id: string; index: number; children: React.ReactNode; sectionRef: (el: HTMLDivElement | null) => void }) => (
  <section id={id} ref={sectionRef} className={`relative scroll-mt-14 ${sectionStyles[index]?.bg || "bg-bg-paper"}`}>
    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-accent-sand/15 to-transparent" />
    <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-accent-moss/10 to-transparent" />
    <div className="px-6 md:px-12 lg:px-20 xl:px-32 py-20 md:py-28">{children}</div>
  </section>
);

const SectionTitle = ({ title, accent = "sand" }: { title: string; accent?: string }) => (
  <motion.div className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
    <motion.div className={`w-20 h-1.5 ${accentLineColors[accent] || "bg-accent-sand"} mb-6 rounded-full`} variants={fadeUp} custom={0} />
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

const CronField = ({ value, label, desc, active }: { value: string; label: string; desc: string; active?: boolean }) => (
  <div className={`flex flex-col items-center p-4 rounded-xl border-2 ${active ? "border-accent-moss/30 bg-accent-moss/8" : "border-text-charcoal/8 bg-bg-paper"}`}>
    <span className={`font-mono text-2xl font-bold mb-2 ${active ? "text-accent-moss" : "text-text-charcoal/40"}`}>{value}</span>
    <span className="text-xs font-semibold text-text-charcoal">{label}</span>
    <span className="text-xs text-text-taupe mt-1 text-center">{desc}</span>
  </div>
);

export default function CronJobs() {
  const [currentSection, setCurrentSection] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeExample, setActiveExample] = useState(0);

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

  const cronExamples = [
    { schedule: "* * * * *", meaning: "Every single minute", fields: ["*", "*", "*", "*", "*"] },
    { schedule: "0 * * * *", meaning: "Every hour (at minute 0)", fields: ["0", "*", "*", "*", "*"] },
    { schedule: "0 9 * * *", meaning: "Every day at 9am", fields: ["0", "9", "*", "*", "*"] },
    { schedule: "0 9 * * 1", meaning: "Every Monday at 9am", fields: ["0", "9", "*", "*", "1"] },
    { schedule: "*/5 * * * *", meaning: "Every 5 minutes", fields: ["*/5", "*", "*", "*", "*"] },
    { schedule: "0 0 * * 0", meaning: "Every Sunday at midnight", fields: ["0", "0", "*", "*", "0"] },
    { schedule: "0 2 * * *", meaning: "Every day at 2am", fields: ["0", "2", "*", "*", "*"] },
  ];

  const fieldLabels = ["Minute", "Hour", "Day", "Month", "Weekday"];
  const fieldDescs = ["0–59", "0–23", "1–31", "1–12", "0=Sun, 6=Sat"];

  return (
    <div className="min-h-screen bg-bg-paper font-serif">
      <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-accent-sand z-50 origin-left" style={{ scaleX: scrollProgress }} />
      <ArticleNav sections={navSections} currentSection={currentSection} onSectionClick={scrollToSection} />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[65vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-sand/12 via-bg-cream to-accent-moss/8" />
        <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="flex flex-col justify-center px-6 md:px-12 lg:px-20 xl:px-32 py-20">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-xs font-mono uppercase tracking-[0.25em] text-accent-moss mb-5">Linux Automation</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-serif text-text-charcoal mb-6 leading-[1.1]">
              Cron Jobs &amp;<br /><em className="text-accent-moss not-italic">Task Scheduling</em>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg text-text-taupe leading-relaxed max-w-xl">
              How Linux runs backups at 2am without anyone touching a keyboard. The scheduler behind every production server&apos;s automation.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="flex gap-6 mt-8 pt-8 border-t border-text-charcoal/10">
              {[{ label: "Sections", value: "5" }, { label: "Read time", value: "15 min" }, { label: "Level", value: "Beginner" }].map(s => (
                <div key={s.label}>
                  <p className="text-xs font-mono uppercase tracking-wider text-text-olive">{s.label}</p>
                  <p className="text-lg font-serif font-semibold text-text-charcoal">{s.value}</p>
                </div>
              ))}
            </motion.div>
          </div>
          <div className="hidden lg:flex items-center justify-center px-12">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.4 }} className="w-full max-w-sm">
              <div className="bg-text-charcoal rounded-2xl p-5 font-mono text-sm shadow-2xl">
                <p className="text-white/40 text-xs mb-4">Your server, running while you sleep:</p>
                {[
                  { time: "00:00", job: "clean-logs.sh", note: "Sunday midnight" },
                  { time: "02:00", job: "backup.sh", note: "Every night" },
                  { time: "09:00", job: "send-report.sh", note: "Weekdays" },
                  { time: "*/5", job: "collect-metrics.sh", note: "Every 5 min" },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.25 }} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <span className="text-orange-300 w-12 text-xs">{item.time}</span>
                    <span className="text-[#6ee7b7] flex-1">{item.job}</span>
                    <span className="text-white/30 text-xs">{item.note}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 0: What is a cron job */}
      <Section id="s0" index={0} sectionRef={el => { sectionRefs.current[0] = el; }}>
        <SectionTitle title="What is a Cron Job?" accent={accentColors[0]} />
        <P className="text-lg md:text-xl mb-8">A <strong>cron job</strong> is a scheduled task — a command that runs automatically at a time you specify. No manual intervention. No staying up at 2am to run the backup.</P>
        <AnalogyBox>
          Alarm clock = runs at 7am every day → wakes you up<br />
          Cron job = runs at 7am every day → checks disk space, or sends a report, or cleans up old files
        </AnalogyBox>
        <H3>What companies use cron for</H3>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {[
              { interval: "Every minute", task: "Check if services are running, collect metrics" },
              { interval: "Every hour", task: "Aggregate logs, send alerts if something looks wrong" },
              { interval: "Every day at 2am", task: "Run database backups (off-peak, low traffic)" },
              { interval: "Every Sunday midnight", task: "Clean up old log files, rotate archives" },
              { interval: "Every Monday 9am", task: "Send weekly performance reports to stakeholders" },
              { interval: "Every month 1st", task: "Generate billing reports, renew SSL certificates" },
            ].map((item, i) => (
              <Reveal key={item.interval} delay={i * 0.07}>
                <div className="flex gap-3 p-3 rounded-lg border border-text-charcoal/8 bg-bg-paper hover:border-accent-moss/15 transition-all">
                  <span className="text-xs font-mono font-semibold text-accent-moss bg-accent-moss/8 px-2 py-1 rounded flex-shrink-0 self-start">{item.interval}</span>
                  <span className="text-sm text-text-taupe">{item.task}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
        <KeyTakeaway>Every production Linux server has dozens of cron jobs running. It&apos;s how sysadmin work gets automated — the server does maintenance while you sleep.</KeyTakeaway>
      </Section>

      {/* Section 1: Schedule Format */}
      <Section id="s1" index={1} sectionRef={el => { sectionRefs.current[1] = el; }}>
        <SectionTitle title="The Schedule Format" accent={accentColors[1]} />
        <P className="text-lg mb-8">Every cron job has a schedule written in this exact format. Five fields, then the command:</P>
        <Reveal>
          <div className="bg-text-charcoal rounded-xl p-6 font-mono mb-8 overflow-x-auto">
            <p className="text-white text-lg mb-4"><span className="text-orange-300">*</span> <span className="text-yellow-300">*</span> <span className="text-[#6ee7b7]">*</span> <span className="text-blue-300">*</span> <span className="text-purple-300">*</span> <span className="text-white/60">command-to-run</span></p>
            <div className="grid grid-cols-5 gap-2 text-xs text-center">
              {[
                { val: "│", color: "text-orange-300" }, { val: "│", color: "text-yellow-300" },
                { val: "│", color: "text-[#6ee7b7]" }, { val: "│", color: "text-blue-300" },
                { val: "│", color: "text-purple-300" },
              ].map((c, i) => <p key={i} className={c.color}>{c.val}</p>)}
              {[
                { label: "Minute", range: "0–59", color: "text-orange-300" },
                { label: "Hour", range: "0–23", color: "text-yellow-300" },
                { label: "Day", range: "1–31", color: "text-[#6ee7b7]" },
                { label: "Month", range: "1–12", color: "text-blue-300" },
                { label: "Weekday", range: "0=Sun..6=Sat", color: "text-purple-300" },
              ].map(f => (
                <div key={f.label} className="text-center">
                  <p className={`font-semibold ${f.color}`}>{f.label}</p>
                  <p className="text-white/40">{f.range}</p>
                </div>
              ))}
            </div>
            <p className="text-white/40 text-xs mt-4">* means &quot;every&quot; — every minute, every hour, every day, etc.</p>
          </div>
        </Reveal>
        <P className="mb-4">The <Code>*</Code> wildcard means &quot;every possible value.&quot; So <Code>* * * * *</Code> runs every single minute of every day.</P>
        <DidYouKnow>The name &ldquo;cron&rdquo; comes from the Greek word &ldquo;chronos&rdquo; meaning time. The program that reads and executes crontabs is the &ldquo;cron daemon&rdquo; (crond), which wakes up every minute to check if any jobs need to run.</DidYouKnow>
      </Section>

      {/* Section 2: Interactive examples */}
      <Section id="s2" index={2} sectionRef={el => { sectionRefs.current[2] = el; }}>
        <SectionTitle title="Reading the Format" accent={accentColors[2]} />
        <P className="text-lg mb-8">Click any example below to see how the format breaks down:</P>
        <Reveal>
          <div className="flex flex-wrap gap-2 mb-8">
            {cronExamples.map((ex, i) => (
              <button key={i} onClick={() => setActiveExample(i)}
                className={`px-3 py-1.5 rounded-lg font-mono text-sm border transition-all ${activeExample === i ? "border-accent-moss/30 bg-accent-moss/10 text-accent-moss" : "border-text-charcoal/10 bg-bg-paper text-text-taupe hover:border-accent-moss/20"}`}>
                {ex.schedule}
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <div className="rounded-2xl border border-text-charcoal/10 bg-bg-paper p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <code className="font-mono text-lg text-text-charcoal font-bold">{cronExamples[activeExample].schedule}</code>
              <span className="text-text-taupe">→</span>
              <span className="font-serif text-accent-moss font-semibold">{cronExamples[activeExample].meaning}</span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {cronExamples[activeExample].fields.map((field, i) => (
                <CronField key={i} value={field} label={fieldLabels[i]} desc={fieldDescs[i]} active={field !== "*"} />
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { sym: "*", meaning: "every (all values)" },
              { sym: "*/5", meaning: "every 5 of that unit" },
              { sym: "0", meaning: "at exactly 0 (midnight, top of hour)" },
              { sym: "1-5", meaning: "a range (Monday through Friday)" },
              { sym: "1,3,5", meaning: "specific values (Mon, Wed, Fri)" },
            ].map((s, i) => (
              <Reveal key={s.sym} delay={i * 0.07}>
                <div className="p-3 rounded-lg border border-text-charcoal/8 bg-bg-paper">
                  <code className="font-mono font-bold text-accent-moss text-sm block mb-1">{s.sym}</code>
                  <p className="text-xs text-text-taupe">{s.meaning}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Section 3: Managing Crontabs */}
      <Section id="s3" index={3} sectionRef={el => { sectionRefs.current[3] = el; }}>
        <SectionTitle title="Managing Crontabs" accent={accentColors[3]} />
        <P className="text-lg mb-6">Each user has their own <strong>crontab</strong> — a file listing their scheduled jobs. You manage it with the <Code>crontab</Code> command:</P>
        <Reveal>
          <Terminal lines={[
            { type: "comment", content: "Edit your cron jobs (opens in default editor)" },
            { type: "command", content: "crontab -e" },
            { type: "output", content: "" },
            { type: "comment", content: "List your current cron jobs" },
            { type: "command", content: "crontab -l" },
            { type: "output", content: "*/5 * * * * /home/charith/scripts/collect-metrics.sh" },
            { type: "output", content: "0 2 * * * /home/charith/scripts/backup.sh" },
            { type: "output", content: "" },
            { type: "comment", content: "Remove ALL your cron jobs (be careful!)" },
            { type: "command", content: "crontab -r" },
          ]} />
        </Reveal>
        <KeyTakeaway><Code>crontab -r</Code> removes ALL your cron jobs with no confirmation prompt. Unlike most destructive commands, there&apos;s no &quot;are you sure?&quot; Always double-check with <Code>crontab -l</Code> first.</KeyTakeaway>
      </Section>

      {/* Section 4: Real Examples */}
      <Section id="s4" index={4} sectionRef={el => { sectionRefs.current[4] = el; }}>
        <SectionTitle title="Real Crontab Examples" accent={accentColors[4]} />
        <P className="text-lg mb-8">Here&apos;s what a typical sysadmin&apos;s crontab looks like:</P>
        <Reveal>
          <div className="bg-text-charcoal rounded-xl p-5 font-mono text-sm overflow-x-auto mb-8">
            <p className="text-white/40 mb-4"># crontab -l output</p>
            {[
              { schedule: "*/5 * * * *", cmd: "/home/charith/scripts/collect-metrics.sh", note: "every 5 min" },
              { schedule: "0 * * * *", cmd: "/home/charith/scripts/check-services.sh", note: "every hour" },
              { schedule: "0 2 * * *", cmd: "/home/charith/scripts/backup.sh", note: "2am daily" },
              { schedule: "0 0 * * 0", cmd: "/home/charith/scripts/clean-logs.sh", note: "Sunday midnight" },
              { schedule: "0 9 * * 1-5", cmd: "/home/charith/scripts/send-report.sh", note: "9am weekdays" },
            ].map((job, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="py-1.5 border-b border-white/5 last:border-0">
                <span className="text-orange-300">{job.schedule}</span>
                <span className="text-[#6ee7b7] ml-3">{job.cmd}</span>
                <span className="text-white/30 ml-3 text-xs">← {job.note}</span>
              </motion.div>
            ))}
          </div>
        </Reveal>
        <H3>Logging cron output</H3>
        <P className="mb-4">By default, cron emails output to the local user — which nobody reads. Better practice: redirect to a log file:</P>
        <Reveal>
          <Terminal lines={[
            { type: "comment", content: ">> appends stdout to log file, 2>&1 captures errors too" },
            { type: "output", content: "*/5 * * * * /home/charith/scripts/collect-metrics.sh >> /var/log/metrics.log 2>&1" },
          ]} />
        </Reveal>

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
