"use client";

import { useState, useRef } from "react";
import { useReadingNav } from "@/hooks/useReadingNav";
import ArticleSection from "@/components/reading/ArticleSection";
import KeyTakeaway from "@/components/ui/KeyTakeaway";
import AnalogyBox from "@/components/ui/AnalogyBox";
import DidYouKnow from "@/components/ui/DidYouKnow";
import Terminal from "@/components/ui/Terminal";
import Flashcards from "@/components/ui/Flashcards";

const sectionNames = [
  "What is a Cron Job?",
  "The Schedule Format",
  "Reading the Format",
  "Managing Crontabs",
  "Real Examples",
];
const navSections = sectionNames.map((label, i) => ({ id: i, label }));

const flashcardsData = [
  { front: "What is a cron job?", back: "A scheduled task — a command that runs automatically at a time you specify. Like setting an alarm, but for scripts." },
  { front: "Cron format", back: "* * * * * command — minute(0-59) hour(0-23) day-of-month(1-31) month(1-12) day-of-week(0=Sun-6=Sat)" },
  { front: "What does * mean in cron?", back: "'Every'. * in the hour field = every hour. * in the month field = every month. All * = 'every minute of every day'." },
  { front: "*/5 * * * *", back: "Every 5 minutes. The */ syntax means 'every N of that unit'. */5 in minutes = every 5 minutes." },
  { front: "0 2 * * *", back: "Every day at 2am. 0 = minute 0 (on the hour), 2 = 2am, * * * = any day/month/weekday." },
  { front: "How to edit cron jobs?", back: "crontab -e (edit), crontab -l (list), crontab -r (remove ALL — be careful!). Each user has their own crontab file." },
  { front: "Where do production cron outputs go?", back: "By default, cron emails output to the local user. Better practice: redirect to a log file: */5 * * * * /path/script.sh >> /var/log/myscript.log 2>&1" },
];

const SectionTitle = ({ title }: { title: string }) => (
  <div className="mb-12">
    <div className="w-20 h-1.5 bg-accent mb-6 rounded-full" />
    <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display text-fg leading-tight">{title}</h2>
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

const CronField = ({ value, label, desc, active }: { value: string; label: string; desc: string; active?: boolean }) => (
  <div className={`flex flex-col items-center p-4 rounded-xl border-2 ${active ? "border-accent/30 bg-accent/8" : "border-fg/8 bg-surface"}`}>
    <span className={`font-mono text-2xl font-bold mb-2 ${active ? "text-accent" : "text-fg/40"}`}>{value}</span>
    <span className="text-xs font-semibold text-fg">{label}</span>
    <span className="text-xs text-fg-2 mt-1 text-center">{desc}</span>
  </div>
);

export default function CronJobs() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeExample, setActiveExample] = useState(0);

  useReadingNav(navSections, sectionRefs);

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
    <article>
      {/* Section 0: What is a cron job */}
      <ArticleSection id="s0" ref={el => { sectionRefs.current[0] = el; }}>
        <SectionTitle title="What is a Cron Job?" />
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
            ].map((item) => (
              <Reveal key={item.interval}>
                <div className="flex gap-3 p-3 rounded-lg border border-fg/8 bg-surface hover:border-accent/15 transition-all">
                  <span className="text-xs font-mono font-semibold text-accent bg-accent/8 px-2 py-1 rounded flex-shrink-0 self-start">{item.interval}</span>
                  <span className="text-sm text-fg-2">{item.task}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
        <KeyTakeaway>Every production Linux server has dozens of cron jobs running. It&apos;s how sysadmin work gets automated — the server does maintenance while you sleep.</KeyTakeaway>
      </ArticleSection>

      {/* Section 1: Schedule Format */}
      <ArticleSection id="s1" ref={el => { sectionRefs.current[1] = el; }}>
        <SectionTitle title="The Schedule Format" />
        <P className="text-lg mb-8">Every cron job has a schedule written in this exact format. Five fields, then the command:</P>
        <Reveal>
          <div className="bg-terminal rounded-xl p-6 font-mono mb-8 overflow-x-auto">
            <p className="text-white text-lg mb-4"><span className="text-terminal-accent">*</span> <span className="text-terminal-danger">*</span> <span className="text-terminal-ok">*</span> <span className="text-terminal-info">*</span> <span className="text-terminal-fg">*</span> <span className="text-white/60">command-to-run</span></p>
            <div className="grid grid-cols-5 gap-2 text-xs text-center">
              {[
                { val: "│", color: "text-terminal-accent" }, { val: "│", color: "text-terminal-danger" },
                { val: "│", color: "text-terminal-ok" }, { val: "│", color: "text-terminal-info" },
                { val: "│", color: "text-terminal-fg" },
              ].map((c, i) => <p key={i} className={c.color}>{c.val}</p>)}
              {[
                { label: "Minute", range: "0–59", color: "text-terminal-accent" },
                { label: "Hour", range: "0–23", color: "text-terminal-danger" },
                { label: "Day", range: "1–31", color: "text-terminal-ok" },
                { label: "Month", range: "1–12", color: "text-terminal-info" },
                { label: "Weekday", range: "0=Sun..6=Sat", color: "text-terminal-fg" },
              ].map(f => (
                <div key={f.label} className="text-center">
                  <p className={`font-semibold ${f.color}`}>{f.label}</p>
                  <p className="text-terminal-fg/50">{f.range}</p>
                </div>
              ))}
            </div>
            <p className="text-terminal-fg/50 text-xs mt-4">* means &quot;every&quot; — every minute, every hour, every day, etc.</p>
          </div>
        </Reveal>
        <P className="mb-4">The <Code>*</Code> wildcard means &quot;every possible value.&quot; So <Code>* * * * *</Code> runs every single minute of every day.</P>
        <DidYouKnow>The name &ldquo;cron&rdquo; comes from the Greek word &ldquo;chronos&rdquo; meaning time. The program that reads and executes crontabs is the &ldquo;cron daemon&rdquo; (crond), which wakes up every minute to check if any jobs need to run.</DidYouKnow>
      </ArticleSection>

      {/* Section 2: Interactive examples */}
      <ArticleSection id="s2" ref={el => { sectionRefs.current[2] = el; }}>
        <SectionTitle title="Reading the Format" />
        <P className="text-lg mb-8">Click any example below to see how the format breaks down:</P>
        <Reveal>
          <div className="flex flex-wrap gap-2 mb-8">
            {cronExamples.map((ex, i) => (
              <button key={i} onClick={() => setActiveExample(i)}
                className={`px-3 py-1.5 rounded-lg font-mono text-sm border transition-all ${activeExample === i ? "border-accent/30 bg-accent/10 text-accent" : "border-fg/10 bg-surface text-fg-2 hover:border-accent/20"}`}>
                {ex.schedule}
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <div className="rounded-2xl border border-fg/10 bg-surface p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <code className="font-mono text-lg text-fg font-bold">{cronExamples[activeExample].schedule}</code>
              <span className="text-fg-2">→</span>
              <span className="text-accent font-semibold">{cronExamples[activeExample].meaning}</span>
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
            ].map((s) => (
              <Reveal key={s.sym}>
                <div className="p-3 rounded-lg border border-fg/8 bg-surface">
                  <code className="font-mono font-bold text-accent text-sm block mb-1">{s.sym}</code>
                  <p className="text-xs text-fg-2">{s.meaning}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </ArticleSection>

      {/* Section 3: Managing Crontabs */}
      <ArticleSection id="s3" ref={el => { sectionRefs.current[3] = el; }}>
        <SectionTitle title="Managing Crontabs" />
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
      </ArticleSection>

      {/* Section 4: Real Examples */}
      <ArticleSection id="s4" ref={el => { sectionRefs.current[4] = el; }}>
        <SectionTitle title="Real Crontab Examples" />
        <P className="text-lg mb-8">Here&apos;s what a typical sysadmin&apos;s crontab looks like:</P>
        <Reveal>
          <div className="bg-terminal rounded-xl p-5 font-mono text-sm overflow-x-auto mb-8">
            <p className="text-terminal-fg/50 mb-4"># crontab -l output</p>
            {[
              { schedule: "*/5 * * * *", cmd: "/home/charith/scripts/collect-metrics.sh", note: "every 5 min" },
              { schedule: "0 * * * *", cmd: "/home/charith/scripts/check-services.sh", note: "every hour" },
              { schedule: "0 2 * * *", cmd: "/home/charith/scripts/backup.sh", note: "2am daily" },
              { schedule: "0 0 * * 0", cmd: "/home/charith/scripts/clean-logs.sh", note: "Sunday midnight" },
              { schedule: "0 9 * * 1-5", cmd: "/home/charith/scripts/send-report.sh", note: "9am weekdays" },
            ].map((job, i) => (
              <div key={i} className="py-1.5 border-b border-white/5 last:border-0">
                <span className="text-terminal-accent">{job.schedule}</span>
                <span className="text-terminal-ok ml-3">{job.cmd}</span>
                <span className="text-terminal-fg/50 ml-3 text-xs">← {job.note}</span>
              </div>
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
      </ArticleSection>
    </article>
  );
}
