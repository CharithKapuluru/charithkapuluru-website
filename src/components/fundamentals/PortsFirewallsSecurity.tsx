"use client";

import { useRef } from "react";
import { useReadingNav } from "@/hooks/useReadingNav";
import ArticleSection from "@/components/reading/ArticleSection";
import KeyTakeaway from "@/components/ui/KeyTakeaway";
import AnalogyBox from "@/components/ui/AnalogyBox";
import DidYouKnow from "@/components/ui/DidYouKnow";
import WarningBox from "@/components/ui/WarningBox";
import Terminal from "@/components/ui/Terminal";
import Flashcards from "@/components/ui/Flashcards";

const sectionNames = [
  "What is a Port?",
  "Well-Known Ports",
  "Firewalls & ufw",
  "SSH Hardening",
  "Fail2ban",
  "DNS Explained",
];
const navSections = sectionNames.map((label, i) => ({ id: i, label }));

const flashcardsData = [
  { front: "What is a port?", back: "A number (1–65535) that identifies which service on a server an incoming connection wants. IP = building address, Port = apartment number." },
  { front: "What port does SSH use?", back: "Port 22. HTTP = 80, HTTPS = 443, MySQL = 3306, PostgreSQL = 5432. Ports 1–1024 are 'privileged' — only root can open them." },
  { front: "What is ufw?", back: "Uncomplicated Firewall — Ubuntu's firewall tool. When enabled: blocks all incoming by default, allows all outgoing. You explicitly allow what you need: sudo ufw allow 22" },
  { front: "What is SSH hardening?", back: "Changing /etc/ssh/sshd_config to make SSH harder to attack: PermitRootLogin no, PasswordAuthentication no, MaxAuthTries 3, AllowUsers charith" },
  { front: "What is Fail2ban?", back: "Watches auth logs for failed login attempts. After too many failures from one IP, it automatically adds a firewall rule to ban that IP. Stops brute-force attacks automatically." },
  { front: "What is DNS?", back: "Domain Name System — the internet's phonebook. Translates domain names to IP addresses. You type google.com, DNS returns 142.250.80.46. All happens in ~20ms automatically." },
  { front: "What is systemd-resolved?", back: "A local DNS resolver that runs on Ubuntu servers (listens on 127.0.0.53:53). It caches DNS results for the server itself and handles lookups when apt, curl, etc need to find servers." },
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

const PortRow = ({ port, service, desc, risk }: { port: string; service: string; desc: string; risk?: boolean }) => (
  <div className={`flex items-center gap-4 p-3 rounded-lg border ${risk ? "border-danger/50 bg-danger-soft/30" : "border-fg/8 bg-surface"} hover:shadow-sm transition-all`}>
    <span className="font-mono text-sm font-bold text-fg w-14 flex-shrink-0">{port}</span>
    <span className={`font-mono text-sm font-semibold w-24 flex-shrink-0 ${risk ? "text-danger" : "text-accent"}`}>{service}</span>
    <span className="text-sm text-fg-2 flex-1">{desc}</span>
    {risk && <span className="text-xs bg-danger-soft text-danger px-2 py-0.5 rounded-full flex-shrink-0">Sensitive</span>}
  </div>
);

export default function PortsFirewallsSecurity() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useReadingNav(navSections, sectionRefs);

  return (
    <article>
      {/* Section 0: Ports */}
      <ArticleSection id="s0" ref={el => { sectionRefs.current[0] = el; }}>
        <SectionTitle title="What is a Port?" />
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
      </ArticleSection>

      {/* Section 1: Well-Known Ports */}
      <ArticleSection id="s1" ref={el => { sectionRefs.current[1] = el; }}>
        <SectionTitle title="Well-Known Port Numbers" />
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
      </ArticleSection>

      {/* Section 2: Firewalls & ufw */}
      <ArticleSection id="s2" ref={el => { sectionRefs.current[2] = el; }}>
        <SectionTitle title="Firewalls &amp; ufw" />
        <P className="text-lg mb-8">By default, your server accepts connections on ANY port that has a listening service. A <strong>firewall</strong> sits in front of all those ports and enforces rules — only letting in what you explicitly allow.</P>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-5 rounded-xl border-2 border-danger/50 bg-danger-soft/20">
              <p className="font-semibold text-danger mb-3">WITHOUT firewall</p>
              <div className="font-mono text-xs space-y-1.5 text-fg-2">
                <p>Anyone → port 22  → SSH ✓ connects</p>
                <p>Anyone → port 80  → web ✓ connects</p>
                <p className="text-danger">Anyone → port 5432 → DB  ✓ connects</p>
              </div>
            </div>
            <div className="p-5 rounded-xl border-2 border-accent/20 bg-accent/5">
              <p className="font-semibold text-accent mb-3">WITH ufw</p>
              <div className="font-mono text-xs space-y-1.5 text-fg-2">
                <p>Anyone → port 22  → ALLOW ✓</p>
                <p>Anyone → port 80  → ALLOW ✓</p>
                <p className="text-accent">Anyone → port 5432 → DENY  ✗ blocked</p>
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
      </ArticleSection>

      {/* Section 3: SSH Hardening */}
      <ArticleSection id="s3" ref={el => { sectionRefs.current[3] = el; }}>
        <SectionTitle title="SSH Hardening" />
        <P className="text-lg mb-6">SSH on default settings works but isn&apos;t maximally secure. <strong>Hardening</strong> means changing <Code>/etc/ssh/sshd_config</Code> to make it harder to attack.</P>
        <Reveal>
          <div className="space-y-3 mb-8">
            {[
              { setting: "PermitRootLogin no", why: "Attacker must first compromise a normal user, then escalate — two steps instead of one." },
              { setting: "PasswordAuthentication no", why: "Only SSH keys allowed. Keys are mathematically impossible to brute-force. Passwords can be guessed." },
              { setting: "MaxAuthTries 3", why: "Disconnect after 3 wrong attempts. Limits how fast an attacker can try passwords." },
              { setting: "LoginGraceTime 20", why: "Disconnect if not logged in within 20 seconds. Frees connections from automated scanners." },
              { setting: "AllowUsers charith", why: "Only this specific user can SSH in. Even if an attacker creates another account, they can't SSH." },
            ].map((item) => (
              <Reveal key={item.setting}>
                <div className="p-4 rounded-xl border border-fg/8 bg-surface hover:border-success/25 transition-all">
                  <div className="flex items-start gap-4">
                    <code className="font-mono text-sm text-accent bg-accent/8 px-2 py-0.5 rounded flex-shrink-0">{item.setting}</code>
                    <p className="text-sm text-fg-2">{item.why}</p>
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
      </ArticleSection>

      {/* Section 4: Fail2ban */}
      <ArticleSection id="s4" ref={el => { sectionRefs.current[4] = el; }}>
        <SectionTitle title="Fail2ban" />
        <P className="text-lg mb-6">Even with hardening, attackers will still try. <strong>Fail2ban</strong> watches your logs and automatically bans IPs that fail too many times.</P>
        <Reveal>
          <div className="bg-terminal rounded-xl p-5 font-mono text-sm mb-8 overflow-x-auto">
            <p className="text-terminal-fg/50 mb-3">How Fail2ban works:</p>
            {[
              { line: "Attacker tries password 1  → fail → logged in /var/log/auth.log", color: "text-terminal-accent" },
              { line: "Attacker tries password 2  → fail → logged", color: "text-terminal-accent" },
              { line: "Attacker tries password 3  → fail → logged", color: "text-terminal-accent" },
              { line: 'Fail2ban reads log         → "this IP failed 3 times"', color: "text-terminal-accent" },
              { line: "Fail2ban adds rule         → IP 1.2.3.4 BANNED for 1 hour", color: "text-terminal-ok" },
              { line: "Attacker tries password 4  → connection REFUSED ✓", color: "text-terminal-ok" },
            ].map((item, i) => (
              <p key={i} className={`py-0.5 ${item.color}`}>{item.line}</p>
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
      </ArticleSection>

      {/* Section 5: DNS */}
      <ArticleSection id="s5" ref={el => { sectionRefs.current[5] = el; }}>
        <SectionTitle title="DNS — The Internet's Phonebook" />
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
            ].map((item) => (
              <Reveal key={item.step}>
                <div className="flex gap-4 items-start p-3 rounded-lg border border-fg/6 bg-surface hover:border-accent/15 transition-all">
                  <span className="w-7 h-7 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-mono font-bold text-accent flex-shrink-0">{item.step}</span>
                  <div>
                    <p className="text-sm text-fg">{item.text}</p>
                    <p className="text-xs text-fg-2 mt-0.5">{item.detail}</p>
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
      </ArticleSection>
    </article>
  );
}
