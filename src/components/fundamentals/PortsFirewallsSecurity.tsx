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
  "What is a Port?",
  "Well-Known Ports",
  "Firewalls & ufw",
  "SSH Hardening",
  "Fail2ban",
  "DNS Explained",
];
const navSections = sectionNames.map((label, i) => ({ id: i, label }));

const sectionStyles = [
  { bg: "bg-gradient-to-br from-accent-terracotta/[0.06] via-bg-paper to-accent-sand/[0.04]" },
  { bg: "bg-bg-cream/40" },
  { bg: "bg-gradient-to-br from-accent-moss/[0.04] via-bg-paper to-accent-sage/[0.05]" },
  { bg: "bg-bg-paper" },
  { bg: "bg-gradient-to-br from-accent-terracotta/[0.04] via-bg-paper to-accent-sand/[0.04]" },
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
    question: "What is a port number?",
    options: [
      "The IP address of a server",
      "An apartment number — tells the server which service an incoming connection wants",
      "The speed of a network connection",
      "The physical network socket on a machine",
    ],
    correctIndex: 1,
    explanation: "IP address = the building. Port = the apartment number. 192.168.1.1:22 means 'building 192.168.1.1, apartment 22 (SSH)'. Ports let multiple services run on one IP address simultaneously.",
  },
  {
    question: "What port does SSH use by default?",
    options: ["80", "443", "22", "3306"],
    correctIndex: 2,
    explanation: "SSH runs on port 22 by default. This is why you can 'ssh user@server' without specifying a port — SSH clients automatically connect to port 22. You can change it in /etc/ssh/sshd_config.",
  },
  {
    question: "What does ufw do?",
    options: [
      "Updates your system software",
      "A firewall tool — blocks or allows connections based on rules you define",
      "Monitors running processes",
      "Creates user accounts",
    ],
    correctIndex: 1,
    explanation: "ufw (Uncomplicated Firewall) is Ubuntu's firewall tool. When enabled, it blocks ALL incoming connections by default, and you explicitly allow what you need. Without it, any port with a listening service accepts connections from anywhere.",
  },
  {
    question: "What does 'PasswordAuthentication no' in sshd_config do?",
    options: [
      "Disables SSH completely",
      "Forces SSH key authentication — passwords can't be used to log in",
      "Removes the root password",
      "Blocks all incoming connections",
    ],
    correctIndex: 1,
    explanation: "This makes SSH only accept key-based authentication, not passwords. Passwords can be guessed or brute-forced. SSH keys are mathematically impossible to brute-force. Combined with Fail2ban, this makes your server extremely hard to compromise.",
  },
  {
    question: "What does DNS do?",
    options: [
      "Encrypts your internet traffic",
      "Translates domain names (google.com) into IP addresses (142.250.80.46)",
      "Assigns IP addresses to computers",
      "Manages firewall rules",
    ],
    correctIndex: 1,
    explanation: "DNS = Domain Name System. It's the internet's phonebook. You type 'google.com', DNS translates it to '142.250.80.46', and your browser connects to that IP. Without DNS you'd need to memorize IP addresses for every website.",
  },
];

const flashcardsData = [
  { front: "What is a port?", back: "A number (1–65535) that identifies which service on a server an incoming connection wants. IP = building address, Port = apartment number." },
  { front: "What port does SSH use?", back: "Port 22. HTTP = 80, HTTPS = 443, MySQL = 3306, PostgreSQL = 5432. Ports 1–1024 are 'privileged' — only root can open them." },
  { front: "What is ufw?", back: "Uncomplicated Firewall — Ubuntu's firewall tool. When enabled: blocks all incoming by default, allows all outgoing. You explicitly allow what you need: sudo ufw allow 22" },
  { front: "What is SSH hardening?", back: "Changing /etc/ssh/sshd_config to make SSH harder to attack: PermitRootLogin no, PasswordAuthentication no, MaxAuthTries 3, AllowUsers charith" },
  { front: "What is Fail2ban?", back: "Watches auth logs for failed login attempts. After too many failures from one IP, it automatically adds a firewall rule to ban that IP. Stops brute-force attacks automatically." },
  { front: "What is DNS?", back: "Domain Name System — the internet's phonebook. Translates domain names to IP addresses. You type google.com, DNS returns 142.250.80.46. All happens in ~20ms automatically." },
  { front: "What is systemd-resolved?", back: "A local DNS resolver that runs on Ubuntu servers (listens on 127.0.0.53:53). It caches DNS results for the server itself and handles lookups when apt, curl, etc need to find servers." },
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

const PortRow = ({ port, service, desc, risk }: { port: string; service: string; desc: string; risk?: boolean }) => (
  <div className={`flex items-center gap-4 p-3 rounded-lg border ${risk ? "border-red-200/50 bg-red-50/30" : "border-text-charcoal/8 bg-bg-paper"} hover:shadow-sm transition-all`}>
    <span className="font-mono text-sm font-bold text-text-charcoal w-14 flex-shrink-0">{port}</span>
    <span className={`font-mono text-sm font-semibold w-24 flex-shrink-0 ${risk ? "text-red-500" : "text-accent-moss"}`}>{service}</span>
    <span className="text-sm text-text-taupe flex-1">{desc}</span>
    {risk && <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full flex-shrink-0">Sensitive</span>}
  </div>
);

export default function PortsFirewallsSecurity() {
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
      <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-accent-terracotta z-50 origin-left" style={{ scaleX: scrollYProgress }} />
      <ArticleNav sections={navSections} currentSection={currentSection} onSectionClick={scrollToSection} />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[65vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-terracotta/10 via-bg-cream to-accent-sand/8" />
        <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="flex flex-col justify-center px-6 md:px-12 lg:px-20 xl:px-32 py-20">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-xs font-mono uppercase tracking-[0.25em] text-accent-terracotta mb-5">Networking & Security</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-serif text-text-charcoal mb-6 leading-[1.1]">
              Ports, Firewalls<br /><em className="text-accent-terracotta not-italic">&amp; Linux Security</em>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg text-text-taupe leading-relaxed max-w-xl">
              How hackers see your server. What ports are. How firewalls work. How to harden SSH. And how DNS translates google.com into an IP address in 20 milliseconds.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="flex gap-6 mt-8 pt-8 border-t border-text-charcoal/10">
              {[{ label: "Sections", value: "6" }, { label: "Read time", value: "25 min" }, { label: "Level", value: "Beginner" }].map(s => (
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
                <p className="text-white/40 text-xs mb-4">Hacker scanning your server:</p>
                {[
                  { attempt: "192.168.1.1:22", result: "OPEN — SSH", status: "warn" },
                  { attempt: "192.168.1.1:80", result: "OPEN — HTTP", status: "warn" },
                  { attempt: "192.168.1.1:5432", result: "BLOCKED — ufw", status: "good" },
                  { attempt: "192.168.1.1:3306", result: "BLOCKED — ufw", status: "good" },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.3 }} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-white/60 text-xs">{item.attempt}</span>
                    <span className={`text-xs font-semibold ${item.status === "good" ? "text-[#6ee7b7]" : "text-orange-300"}`}>{item.result}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 0: Ports */}
      <Section id="s0" index={0} sectionRef={el => { sectionRefs.current[0] = el; }}>
        <SectionTitle title="What is a Port?" accent={accentColors[0]} />
        <P className="text-lg md:text-xl mb-8">Your server has one IP address. But many different services run on it simultaneously — SSH, a web server, a database. How does the server know which incoming connection goes to which service? <strong>Ports.</strong></P>
        <AnalogyBox>
          <strong>IP address</strong> = the building address (192.168.64.3)<br />
          <strong>Port</strong> = the apartment number<br /><br />
          192.168.64.3<strong>:22</strong> → apartment 22 → SSH lives here<br />
          192.168.64.3<strong>:80</strong> → apartment 80 → web server lives here<br />
          192.168.64.3<strong>:5432</strong> → apartment 5432 → PostgreSQL database lives here<br /><br />
          When you SSH in: your Mac says &quot;I want to connect to 192.168.64.3, <em>apartment 22</em>&quot;
        </AnalogyBox>
        <DidYouKnow>Ports 1–1024 are &ldquo;privileged&rdquo; — only root can open them. That&apos;s why web servers need root or special capabilities to listen on port 80. Ports 1025–65535 are &ldquo;unprivileged&rdquo; — any user can open them.</DidYouKnow>
        <KeyTakeaway>A port is just a number. It tells the OS &quot;this incoming connection is for THAT service.&quot; Without ports, a server could only run one service at a time.</KeyTakeaway>
      </Section>

      {/* Section 1: Well-Known Ports */}
      <Section id="s1" index={1} sectionRef={el => { sectionRefs.current[1] = el; }}>
        <SectionTitle title="Well-Known Port Numbers" accent={accentColors[1]} />
        <P className="text-lg mb-8">These are standardized — every Linux server uses the same ones. Memorize the common ones:</P>
        <Reveal>
          <div className="space-y-2">
            <PortRow port="22" service="SSH" desc="Remote terminal access. How you connect from your Mac to your server." />
            <PortRow port="80" service="HTTP" desc="Unencrypted web traffic. When you visit http://..." />
            <PortRow port="443" service="HTTPS" desc="Encrypted web traffic. The padlock in your browser." />
            <PortRow port="53" service="DNS" desc="Domain name lookups. Every DNS query uses this port." />
            <PortRow port="25" service="SMTP" desc="Email sending. Old and often blocked by ISPs." />
            <PortRow port="3306" service="MySQL" desc="MySQL database server." risk />
            <PortRow port="5432" service="PostgreSQL" desc="PostgreSQL database server." risk />
            <PortRow port="6379" service="Redis" desc="Redis cache database. Should never be public." risk />
            <PortRow port="8080" service="HTTP-alt" desc="Alternative HTTP. Used in dev/testing." />
          </div>
        </Reveal>
        <WarningBox>
          Ports 3306, 5432, 6379 — these should only be accessible from within your server or your private network. A database exposed to the internet is a catastrophic security risk. ufw blocks these by default.
        </WarningBox>
      </Section>

      {/* Section 2: Firewalls & ufw */}
      <Section id="s2" index={2} sectionRef={el => { sectionRefs.current[2] = el; }}>
        <SectionTitle title="Firewalls &amp; ufw" accent={accentColors[2]} />
        <P className="text-lg mb-8">By default, your server accepts connections on ANY port that has a listening service. A <strong>firewall</strong> sits in front of all those ports and enforces rules — only letting in what you explicitly allow.</P>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-5 rounded-xl border-2 border-red-200/50 bg-red-50/20">
              <p className="font-semibold text-red-600 mb-3">❌ WITHOUT firewall</p>
              <div className="font-mono text-xs space-y-1.5 text-text-taupe">
                <p>Anyone → port 22  → SSH ✓ connects</p>
                <p>Anyone → port 80  → web ✓ connects</p>
                <p className="text-red-500">Anyone → port 5432 → DB  ✓ connects 😱</p>
              </div>
            </div>
            <div className="p-5 rounded-xl border-2 border-accent-moss/20 bg-accent-moss/5">
              <p className="font-semibold text-accent-moss mb-3">✅ WITH ufw</p>
              <div className="font-mono text-xs space-y-1.5 text-text-taupe">
                <p>Anyone → port 22  → ALLOW ✓</p>
                <p>Anyone → port 80  → ALLOW ✓</p>
                <p className="text-accent-moss">Anyone → port 5432 → DENY  ✗ blocked</p>
              </div>
            </div>
          </div>
        </Reveal>
        <H3>ufw commands</H3>
        <Reveal>
          <Terminal lines={[
            { type: "command", content: "sudo ufw status          # is it on?" },
            { type: "command", content: "sudo ufw enable          # turn it on" },
            { type: "output", content: "" },
            { type: "comment", content: "Allow specific ports" },
            { type: "command", content: "sudo ufw allow 22        # SSH" },
            { type: "command", content: "sudo ufw allow 80        # HTTP" },
            { type: "command", content: "sudo ufw allow 443       # HTTPS" },
            { type: "output", content: "" },
            { type: "comment", content: "Block a port" },
            { type: "command", content: "sudo ufw deny 5432       # block PostgreSQL" },
            { type: "output", content: "" },
            { type: "comment", content: "Allow only from your network" },
            { type: "command", content: "sudo ufw allow from 192.168.64.0/24" },
          ]} />
        </Reveal>
        <KeyTakeaway>Default ufw policy when enabled: <strong>DENY all incoming, ALLOW all outgoing</strong>. You explicitly allow what you need. Everything else is blocked.</KeyTakeaway>
      </Section>

      {/* Section 3: SSH Hardening */}
      <Section id="s3" index={3} sectionRef={el => { sectionRefs.current[3] = el; }}>
        <SectionTitle title="SSH Hardening" accent={accentColors[3]} />
        <P className="text-lg mb-6">SSH on default settings works but isn&apos;t maximally secure. <strong>Hardening</strong> means changing <Code>/etc/ssh/sshd_config</Code> to make it harder to attack.</P>
        <Reveal>
          <div className="space-y-3 mb-8">
            {[
              { setting: "PermitRootLogin no", why: "Attacker must first compromise a normal user, then escalate — two steps instead of one." },
              { setting: "PasswordAuthentication no", why: "Only SSH keys allowed. Keys are mathematically impossible to brute-force. Passwords can be guessed." },
              { setting: "MaxAuthTries 3", why: "Disconnect after 3 wrong attempts. Limits how fast an attacker can try passwords." },
              { setting: "LoginGraceTime 20", why: "Disconnect if not logged in within 20 seconds. Frees connections from automated scanners." },
              { setting: "AllowUsers charith", why: "Only this specific user can SSH in. Even if an attacker creates another account, they can't SSH." },
            ].map((item, i) => (
              <Reveal key={item.setting} delay={i * 0.08}>
                <div className="p-4 rounded-xl border border-text-charcoal/8 bg-bg-paper hover:border-accent-sage/25 transition-all">
                  <div className="flex items-start gap-4">
                    <code className="font-mono text-sm text-accent-moss bg-accent-moss/8 px-2 py-0.5 rounded flex-shrink-0">{item.setting}</code>
                    <p className="text-sm text-text-taupe">{item.why}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <Terminal lines={[
            { type: "comment", content: "Edit SSH config" },
            { type: "command", content: "sudo nano /etc/ssh/sshd_config" },
            { type: "output", content: "" },
            { type: "comment", content: "After saving, restart SSH to apply" },
            { type: "command", content: "sudo systemctl restart ssh" },
          ]} />
        </Reveal>
      </Section>

      {/* Section 4: Fail2ban */}
      <Section id="s4" index={4} sectionRef={el => { sectionRefs.current[4] = el; }}>
        <SectionTitle title="Fail2ban" accent={accentColors[4]} />
        <P className="text-lg mb-6">Even with hardening, attackers will still try. <strong>Fail2ban</strong> watches your logs and automatically bans IPs that fail too many times.</P>
        <Reveal>
          <div className="bg-text-charcoal rounded-xl p-5 font-mono text-sm mb-8 overflow-x-auto">
            <p className="text-white/40 mb-3">How Fail2ban works:</p>
            {[
              { line: "Attacker tries password 1  → fail → logged in /var/log/auth.log", color: "text-orange-300" },
              { line: "Attacker tries password 2  → fail → logged", color: "text-orange-300" },
              { line: "Attacker tries password 3  → fail → logged", color: "text-orange-300" },
              { line: 'Fail2ban reads log         → "this IP failed 3 times"', color: "text-yellow-300" },
              { line: "Fail2ban adds rule         → IP 1.2.3.4 BANNED for 1 hour", color: "text-[#6ee7b7]" },
              { line: "Attacker tries password 4  → connection REFUSED ✓", color: "text-[#6ee7b7]" },
            ].map((item, i) => (
              <motion.p key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`py-0.5 ${item.color}`}>{item.line}</motion.p>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <Terminal lines={[
            { type: "comment", content: "Install Fail2ban" },
            { type: "command", content: "sudo apt install fail2ban" },
            { type: "output", content: "" },
            { type: "comment", content: "Check banned IPs" },
            { type: "command", content: "sudo fail2ban-client status sshd" },
            { type: "output", content: "Status for the jail: sshd" },
            { type: "output", content: "|- Filter: Currently failed: 2, Total failed: 47" },
            { type: "output", content: "`- Actions: Currently banned: 3, Total banned: 12" },
          ]} />
        </Reveal>
        <DidYouKnow>Any public-facing Linux server receives hundreds of automated SSH login attempts per day. This isn&apos;t personal — bots constantly scan the entire internet looking for weak servers. Fail2ban, SSH hardening, and ufw work together to make these attempts useless.</DidYouKnow>
      </Section>

      {/* Section 5: DNS */}
      <Section id="s5" index={5} sectionRef={el => { sectionRefs.current[5] = el; }}>
        <SectionTitle title="DNS — The Internet's Phonebook" accent={accentColors[5]} />
        <P className="text-lg mb-6">Every website has an IP address. Google is at 142.250.80.46. But nobody remembers that. <strong>DNS</strong> (Domain Name System) translates domain names into IP addresses automatically.</P>
        <AnalogyBox>
          You want to call your friend but only know their name, not their number.<br /><br />
          You → phonebook → &quot;what&apos;s John&apos;s number?&quot;<br />
          Phonebook → &quot;John&apos;s number is 555-1234&quot;<br />
          You → call 555-1234<br /><br />
          <strong>DNS is the phonebook. Domain names are names. IP addresses are phone numbers.</strong>
        </AnalogyBox>
        <H3>How DNS resolution works step by step</H3>
        <Reveal>
          <div className="space-y-3 mb-8">
            {[
              { step: "1", text: "You type google.com in your browser", detail: "Browser asks the OS: what's google.com's IP?" },
              { step: "2", text: "OS asks the local DNS resolver", detail: "On Ubuntu servers, that's systemd-resolved at 127.0.0.53:53" },
              { step: "3", text: "Local resolver checks its cache", detail: "Recently looked up? Return cached answer immediately. Otherwise..." },
              { step: "4", text: "Asks a Root DNS server", detail: '"Who handles .com domains?"' },
              { step: "5", text: "Root says 'ask Verisign'", detail: "Verisign handles all .com registrations" },
              { step: "6", text: "Verisign says 'ask Google's nameserver'", detail: "google.com's own authoritative nameserver" },
              { step: "7", text: "Google says '142.250.80.46'", detail: "The actual IP address" },
              { step: "8", text: "Your browser connects to 142.250.80.46", detail: "All of this takes ~20–50ms. You never see it." },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 0.07}>
                <div className="flex gap-4 items-start p-3 rounded-lg border border-text-charcoal/6 bg-bg-paper hover:border-accent-moss/15 transition-all">
                  <span className="w-7 h-7 rounded-full bg-accent-moss/10 border border-accent-moss/20 flex items-center justify-center text-xs font-mono font-bold text-accent-moss flex-shrink-0">{item.step}</span>
                  <div>
                    <p className="text-sm font-serif text-text-charcoal">{item.text}</p>
                    <p className="text-xs text-text-taupe mt-0.5">{item.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <Terminal lines={[
            { type: "comment", content: "Look up a domain's IP from command line" },
            { type: "command", content: "nslookup google.com" },
            { type: "output", content: "Server: 127.0.0.53" },
            { type: "output", content: "Address: 127.0.0.53#53" },
            { type: "output", content: "" },
            { type: "output", content: "Non-authoritative answer:" },
            { type: "output", content: "Name: google.com" },
            { type: "output", content: "Address: 142.250.80.46" },
          ]} />
        </Reveal>
        <KeyTakeaway>Port 53 is the DNS port. Your Ubuntu server runs a local DNS resolver (systemd-resolved) at 127.0.0.53:53 — so when apt needs to find archive.ubuntu.com, it uses its own local DNS first.</KeyTakeaway>
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
