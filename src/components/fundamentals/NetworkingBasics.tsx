"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useReadingNav } from "@/hooks/useReadingNav";
import ArticleSection from "@/components/reading/ArticleSection";
import KeyTakeaway from "@/components/ui/KeyTakeaway";
import AnalogyBox from "@/components/ui/AnalogyBox";
import DidYouKnow from "@/components/ui/DidYouKnow";
import WarningBox from "@/components/ui/WarningBox";
import ComparisonTable from "@/components/ui/ComparisonTable";
import Terminal from "@/components/ui/Terminal";
import Confetti, { CelebrationMessage } from "@/components/ui/Confetti";
import Quiz from "@/components/ui/Quiz";
import Flashcards from "@/components/ui/Flashcards";
import { iconFor } from "@/components/ui/icons";

const sectionNames = [
  "What is a Network?",
  "Private vs Public IPs",
  "Your Router & NAT",
  "DHCP",
  "VM Networking",
  "SSH & SCP",
  "Finding Your IP",
];
const navSections = sectionNames.map((label, i) => ({ id: i, label }));

const quizQuestions = [
  {
    question: "What is a private IP address?",
    options: ["Your identity on the internet", "An IP used only inside your local network", "The address of Google's servers", "A permanent address assigned by your ISP"],
    correctIndex: 1,
    explanation: "A private IP address is used only inside your local network (like your home WiFi). It's assigned by your router via DHCP and cannot be reached directly from the internet.",
  },
  {
    question: "What does NAT stand for?",
    options: ["Network Access Terminal", "New Address Technology", "Network Address Translation", "Node Assignment Table"],
    correctIndex: 2,
    explanation: "NAT stands for Network Address Translation. Your router uses it to translate between your private IP addresses (inside your home) and your one public IP address (visible on the internet).",
  },
  {
    question: "What does DHCP do?",
    options: ["Encrypts your internet traffic", "Automatically assigns IP addresses to devices on a network", "Connects two networks together", "Speeds up your WiFi connection"],
    correctIndex: 1,
    explanation: "DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses when devices connect to a network. Without it, you'd have to manually type in an IP every time you connect to WiFi.",
  },
  {
    question: "What port does SSH use by default?",
    options: ["80", "443", "22", "3000"],
    correctIndex: 2,
    explanation: "SSH uses port 22 by default. Think of the IP address as the building and the port as the apartment number — SSH always knocks on door 22.",
  },
  {
    question: "What is the difference between SSH and SCP?",
    options: [
      "SSH is faster than SCP",
      "SSH runs commands remotely, SCP copies files using the SSH tunnel",
      "SCP is more secure than SSH",
      "They are completely different protocols",
    ],
    correctIndex: 1,
    explanation: "SSH is for running commands on a remote computer. SCP (Secure Copy) uses the same SSH encrypted tunnel but sends files instead of commands. Both are secure.",
  },
  {
    question: "If your Mac is on home WiFi and you go to a coffee shop, what changes?",
    options: [
      "Your MAC address changes",
      "Your public IP stays the same but your private IP changes",
      "Both your public and private IPs stay the same",
      "Your private IP changes, assigned by the new router",
    ],
    correctIndex: 3,
    explanation: "Each router manages its own pool of IP addresses and assigns a new private IP to your device via DHCP when you connect. Your MAC address (hardware ID) stays the same, but your private IP changes with every new network.",
  },
];

const flashcardsData = [
  { front: "What is a network?", back: "Two or more computers connected so they can talk to each other. Your home WiFi is a network — your phone, laptop, and TV are all connected to the same router." },
  { front: "What is a private IP address?", back: "An IP address used only inside your local network (like 192.168.x.x). Assigned by your router via DHCP. Not reachable from the internet. Changes when you connect to a different WiFi." },
  { front: "What is a public IP address?", back: "Your identity on the internet. Assigned by your ISP. Only your router has one — all your devices share it. The internet only ever sees your public IP, never your private ones." },
  { front: "What is DHCP?", back: "Dynamic Host Configuration Protocol — the system that automatically assigns IP addresses when devices connect to a network. Your router does this automatically every time you connect to WiFi." },
  { front: "What is NAT?", back: "Network Address Translation — your router translates between private IPs (your devices) and the single public IP (what the internet sees). It's the bridge between your home network and the internet." },
  { front: "What is localhost / 127.0.0.1?", back: "A special IP address that means 'this computer itself'. Every computer has 127.0.0.1 pointing to itself. Used for testing apps locally without a real network." },
  { front: "What does `ssh user@ip` do?", back: "Opens an encrypted remote connection to another computer. 'user' is the username on the remote machine, 'ip' is its IP address. Everything you type runs on the remote machine." },
  { front: "What does SCP do?", back: "Secure Copy — copies files between computers using the SSH tunnel. Same security as SSH but transfers files instead of commands. Use -r flag to copy entire folders." },
  { front: "What does `ip a` do?", back: "Shows all network interfaces and IP addresses on your Linux machine. Look for 'inet' followed by an IP that is NOT 127.0.0.1 to find your actual IP address." },
  { front: "What is a port?", back: "Like an apartment number. The IP address is the building, the port is which door. SSH uses port 22, HTTP uses port 80, HTTPS uses port 443." },
];

/* ── Shared layout primitives (same as ComputingBasics) ── */
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const SectionTitle = ({ title }: { title: string }) => (
  <motion.div className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
    <motion.div className="w-20 h-1.5 bg-accent mb-6 rounded-full" variants={fadeUp} custom={0} />
    <motion.h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display text-fg leading-tight" variants={fadeUp} custom={1}>{title}</motion.h2>
  </motion.div>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <motion.h3 className="text-xl md:text-2xl font-display text-fg mt-14 mb-5" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5 }}>{children}</motion.h3>
);

const P = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.p className={`text-fg-2 leading-relaxed ${className}`} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5 }}>{children}</motion.p>
);

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay }}>{children}</motion.div>
);

/* ── Inline code pill ── */
const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="font-mono text-accent bg-accent/8 px-1.5 py-0.5 rounded text-[0.9em]">{children}</code>
);

/* ── Network diagram card ── */
const NetworkDiagram = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div
    className="my-8 rounded-2xl border border-fg/8 bg-surface overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="px-5 py-3 bg-fg/[0.03] border-b border-fg/8 flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-danger/40" />
      <div className="w-3 h-3 rounded-full bg-accent/40" />
      <div className="w-3 h-3 rounded-full bg-success/40" />
      <span className="ml-2 text-xs font-mono text-fg-3">{title}</span>
    </div>
    <div className="p-5 md:p-8 overflow-x-auto">
      <pre className="font-mono text-xs md:text-sm text-fg leading-relaxed whitespace-pre">{children}</pre>
    </div>
  </motion.div>
);

/* ── IP badge ── */
const IPBadge = ({ ip, label, color = "moss" }: { ip: string; label: string; color?: string }) => {
  const colors: Record<string, string> = {
    moss: "bg-accent/10 border-accent/20 text-accent",
    terracotta: "bg-danger/10 border-danger/20 text-danger",
    sand: "bg-accent/15 border-accent/30 text-fg",
    sage: "bg-success/15 border-success/30 text-fg",
  };
  return (
    <div className="flex items-center gap-3 py-2">
      <code className={`font-mono text-sm px-3 py-1.5 rounded-lg border font-bold ${colors[color] || colors.moss}`}>{ip}</code>
      <span className="text-fg-2 text-sm">{label}</span>
    </div>
  );
};

export default function NetworkingBasics() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useReadingNav(navSections, sectionRefs);

  return (
    <article>
      {/* ══════════ SECTION 0 — What is a Network? ══════════ */}
      <ArticleSection id="section-0" ref={(el) => { sectionRefs.current[0] = el; }}>
        <SectionTitle title="What is a Network?" />

        <Reveal>
          <p className="mb-6 text-lede leading-relaxed text-fg-2">
            A network is two or more computers connected so they can talk to each other. Your home WiFi is a network — your phone, laptop, and TV are all connected to the same router and can communicate.
          </p>
        </Reveal>

        <P className="mb-8">Every device on a network gets an <strong className="text-fg">IP address</strong> — a unique number that identifies it, like a house address on a street. Without it, devices wouldn&apos;t know where to send data.</P>

        <Reveal>
          <AnalogyBox>
            <p>Think of a network like a neighborhood. Every house (device) has a unique street address (IP address). When you send a letter (data), you write the destination address on it. The postal service (network) delivers it to exactly the right house. Without addresses, letters would just get lost.</p>
          </AnalogyBox>
        </Reveal>

        <H3>Every Packet Has a Destination</H3>
        <P className="mb-6">When you watch YouTube, your computer sends thousands of tiny packets of data. Each packet has a destination IP address (YouTube&apos;s server) and a source IP address (your device). The network routes each packet to the right destination — like a postal system for data.</P>

        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: "house", title: "Your Home Network", desc: "Your phone, laptop, and TV connected via WiFi router. Private, local, only visible inside your home." },
              { icon: "buildings", title: "Company Network", desc: "Hundreds of computers, servers, and printers connected in an office. Managed by IT professionals." },
              { icon: "globe", title: "The Internet", desc: "The world's largest network — millions of computers all connected, talking to each other globally." },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                className="p-5 rounded-xl border border-fg/8 bg-surface hover:border-danger/20 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ y: -4 }}
              >
                <span className="text-3xl block mb-3">{iconFor(card.icon, { size: 22 })}</span>
                <p className="font-medium text-fg mb-2">{card.title}</p>
                <p className="text-sm text-fg-2 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="blue">
            A network is computers connected together to share data. Every device gets a unique IP address — like a house address — so data knows where to go. Your home WiFi is a network. The internet is just a massive global network of networks.
          </KeyTakeaway>
        </Reveal>
      </ArticleSection>

      {/* ══════════ SECTION 1 — Private vs Public IPs ══════════ */}
      <ArticleSection id="section-1" ref={(el) => { sectionRefs.current[1] = el; }}>
        <SectionTitle title="Private vs Public IP Addresses" />

        <Reveal>
          <p className="mb-6 text-lede leading-relaxed text-fg-2">
            There are two types of IP addresses, and understanding the difference is fundamental. Private IPs are used inside your home network. Public IPs are your identity on the internet.
          </p>
        </Reveal>

        <H3>Private IP Address</H3>
        <P className="mb-4">A private IP address is used <strong className="text-fg">only inside your local network</strong> (like your home WiFi). Devices on the same network use private IPs to talk to each other.</P>

        <Reveal>
          <div className="p-6 rounded-2xl bg-bg/60 border border-fg/8 mb-6">
            <p className="text-sm font-mono uppercase tracking-wider text-fg-3 mb-4">Common private IP ranges</p>
            <div className="space-y-1">
              <IPBadge ip="192.168.x.x" label="Most home routers use this range" color="moss" />
              <IPBadge ip="10.x.x.x" label="Common in companies and offices" color="sage" />
              <IPBadge ip="172.16.x.x" label="Less common, but also private" color="sand" />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <ul className="list-disc list-inside space-y-2 text-fg-2 mb-8">
            <li>Assigned by your <strong className="text-fg">router automatically</strong> (using DHCP)</li>
            <li>Only visible to devices <strong className="text-fg">on the same network</strong></li>
            <li>Cannot be reached from the internet</li>
            <li>Changes when you connect to a different WiFi</li>
          </ul>
        </Reveal>

        <NetworkDiagram title="Your Home Network (192.168.1.x)">
{`                    Router (192.168.1.1)
                         │
          ┌──────────────┼──────────────┐
          │              │              │
     Mac (.1.6)    iPhone (.1.10)   TV (.1.150)

Every device gets a unique last number.
They can all talk to each other using these addresses.`}
        </NetworkDiagram>

        <H3>Public IP Address</H3>
        <P className="mb-4">A public IP address is your identity <strong className="text-fg">on the internet</strong>. The entire world can reach you through it.</P>

        <Reveal>
          <ul className="list-disc list-inside space-y-2 text-fg-2 mb-6">
            <li>Assigned by your <strong className="text-fg">ISP</strong> (Internet Service Provider — like AT&T, Comcast, Verizon)</li>
            <li>Only your <strong className="text-fg">router</strong> has a public IP — your individual devices do NOT</li>
            <li><strong className="text-fg">Shared by all devices</strong> in your house</li>
            <li>Can change periodically (your ISP may reassign it)</li>
          </ul>
        </Reveal>

        <Reveal>
          <DidYouKnow>
            <p>Search &ldquo;what is my ip&rdquo; on Google to see your public IP address — it&apos;s what every website and server sees when you connect to them. Your phone and laptop both appear to come from the same public IP when they&apos;re on your home WiFi.</p>
          </DidYouKnow>
        </Reveal>

        <Reveal>
          <ComparisonTable
            caption="Private vs Public IP"
            headers={["Feature", "Private IP", "Public IP"]}
            rows={[
              ["Visibility", "Only inside your local network", "Visible to the entire internet"],
              ["Assigned by", "Your router (DHCP)", "Your ISP"],
              ["Who has one", "Every device on your network", "Only your router"],
              ["Shared?", "No — each device is unique", "Yes — shared by all home devices"],
              ["Changes?", "When you switch WiFi networks", "Periodically, ISP may reassign"],
              ["Example", "192.168.1.6", "74.83.52.19"],
            ]}
          />
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="green">
            Private IPs work inside your home (192.168.x.x) — every device has one. Public IPs work on the internet — only your router has one, shared by all your devices. Think of private IP as your room number and public IP as your house&apos;s street address.
          </KeyTakeaway>
        </Reveal>
      </ArticleSection>

      {/* ══════════ SECTION 2 — Router & NAT ══════════ */}
      <ArticleSection id="section-2" ref={(el) => { sectionRefs.current[2] = el; }}>
        <SectionTitle title="Your Router & NAT" />

        <Reveal>
          <p className="mb-6 text-lede leading-relaxed text-fg-2">
            Your router is the bridge between your home network and the internet. It has two IP addresses — one for each side. And it uses a clever process called NAT to translate between them.
          </p>
        </Reveal>

        <NetworkDiagram title="Router as Bridge">
{`THE INTERNET              YOUR ROUTER              YOUR HOME NETWORK

                    ┌─────────────────┐
                    │  Public side:   │
 Google, YouTube ◄──►  74.83.52.19   │◄──►  Mac    192.168.1.6
 Netflix, etc.      │                 │      iPhone  192.168.1.10
                    │  Private side:  │      TV      192.168.1.150
                    │  192.168.1.1    │
                    └─────────────────┘`}
        </NetworkDiagram>

        <H3>What is NAT?</H3>
        <P className="mb-4">Your devices can&apos;t talk to the internet directly — they only have private IPs that the internet doesn&apos;t understand. The router acts as a <strong className="text-fg">translator</strong> between private and public addresses. This process is called <strong className="text-fg">NAT (Network Address Translation)</strong>.</P>

        <Reveal>
          <AnalogyBox>
            <p>Imagine a big company with hundreds of employees. They all work from the same office building (public IP). When they send a letter, it goes out with the company&apos;s address — not their personal home address. The company&apos;s receptionist (NAT) knows which employee each reply is meant for and routes it to the right desk (private IP).</p>
          </AnalogyBox>
        </Reveal>

        <H3>NAT Step-by-Step: Searching Google</H3>
        <P className="mb-6">Here&apos;s exactly what happens when you search &ldquo;what is Linux&rdquo; from your Mac:</P>

        <Reveal>
          <div className="relative pl-8 border-l-2 border-danger/25 space-y-5 mb-8">
            {[
              { step: 1, text: 'Mac (192.168.1.6) sends request to Router (192.168.1.1): "Hey router, I want to reach Google"' },
              { step: 2, text: 'Router swaps the source IP. Changes "From: 192.168.1.6" → "From: 74.83.52.19". Sends the request to Google.' },
              { step: 3, text: "Google receives it, sends response back to 74.83.52.19. Google has NO idea 192.168.1.6 exists — it only sees the router." },
              { step: 4, text: 'Router receives the response, remembers "this was for the Mac". Forwards it to 192.168.1.6.' },
              { step: 5, text: "You see search results on your Mac." },
            ].map((s, i) => (
              <motion.div key={s.step} className="flex items-start gap-4" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.4 }}>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-danger/15 text-danger text-sm font-bold flex items-center justify-center mt-0.5">{s.step}</span>
                <p className="text-fg-2 leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <DidYouKnow>
            <p>All devices in your house share the same public IP. When Google sees a request from your house, it always sees <Code>74.83.52.19</Code> — whether it came from your Mac, iPhone, or TV. Your router keeps track of which device asked for what and routes replies correctly.</p>
          </DidYouKnow>
        </Reveal>

        <H3>Your IP Changes With Every WiFi Network</H3>
        <P className="mb-4">When you connect to a new WiFi network, the new router assigns your device a new private IP. Your old IP is released.</P>

        <NetworkDiagram title="IP addresses by location">
{`At Home:         Home router gives your Mac  →  192.168.1.6

At Coffee Shop:  Their router gives your Mac  →  10.0.0.47

At University:   Their router gives your Mac  →  172.16.5.112

At Friend's:     Their router gives your Mac  →  192.168.0.23

Your MAC address (hardware ID) stays the same — only the IP changes.`}
        </NetworkDiagram>

        <Reveal>
          <KeyTakeaway variant="blue">
            Your router has two faces — a private IP for your home network and a public IP for the internet. NAT is the translation process that lets all your home devices share one public IP. Your private IP changes every time you connect to a new WiFi, but your hardware ID (MAC address) never changes.
          </KeyTakeaway>
        </Reveal>
      </ArticleSection>

      {/* ══════════ SECTION 3 — DHCP ══════════ */}
      <ArticleSection id="section-3" ref={(el) => { sectionRefs.current[3] = el; }}>
        <SectionTitle title="DHCP — Auto IP Assignment" />

        <Reveal>
          <p className="mb-6 text-lede leading-relaxed text-fg-2">
            DHCP stands for Dynamic Host Configuration Protocol. It&apos;s the system that automatically assigns IP addresses when devices connect to a network. Without it, you&apos;d have to manually type in an IP address every time you connected to WiFi.
          </p>
        </Reveal>

        <Reveal>
          <AnalogyBox>
            <p>Think of DHCP like a hotel receptionist. When you check in (connect to WiFi), the receptionist (router) gives you a room key with a room number (IP address). That room number is yours for your stay. When you check out (disconnect), the room number is freed up for the next guest. No need to choose your own room — it&apos;s all handled automatically.</p>
          </AnalogyBox>
        </Reveal>

        <H3>How DHCP Works</H3>
        <NetworkDiagram title="DHCP Handshake">
{`Step 1: Your Mac connects to WiFi
        Mac: "Hey, I'm new here. Can I get an IP address?"

Step 2: Router responds
        Router: "Sure, you can use 192.168.1.6"

Step 3: Mac uses that IP until it disconnects
        When you leave, the router reclaims that IP for
        someone else`}
        </NetworkDiagram>

        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <motion.div className="p-6 rounded-xl border border-accent/15 bg-accent/[0.03]" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
              <p className="font-medium text-fg mb-2">With DHCP</p>
              <p className="text-sm text-fg-2">Connect to WiFi. IP is automatically assigned. Everything just works. You don&apos;t think about it.</p>
            </motion.div>
            <motion.div className="p-6 rounded-xl border border-danger/15 bg-danger/[0.03]" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
              <p className="font-medium text-fg mb-2">Without DHCP</p>
              <p className="text-sm text-fg-2">You&apos;d need to manually enter an IP address, subnet mask, gateway, and DNS server every single time you connected anywhere.</p>
            </motion.div>
          </div>
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="green">
            DHCP is the invisible system that automatically hands out IP addresses. Your router is a DHCP server — it manages a pool of IP addresses and assigns them to devices as they connect. This is why you never have to type in an IP address when joining WiFi.
          </KeyTakeaway>
        </Reveal>
      </ArticleSection>

      {/* ══════════ SECTION 4 — VM Networking ══════════ */}
      <ArticleSection id="section-4" ref={(el) => { sectionRefs.current[4] = el; }}>
        <SectionTitle title="VM Networking (UTM)" />

        <Reveal>
          <p className="mb-6 text-lede leading-relaxed text-fg-2">
            When you create a VM in UTM (or VirtualBox/VMware), it creates a tiny private network between your Mac and the VM — completely inside your machine. This is how you SSH into a VM even with no WiFi.
          </p>
        </Reveal>

        <NetworkDiagram title="Inside Your Mac — UTM Private Network">
{`INSIDE YOUR MAC
┌────────────────────────────────────────────────────┐
│                                                    │
│   UTM Private Network (192.168.64.x)               │
│                                                    │
│   ┌──────────────┐         ┌────────────────┐      │
│   │  Mac side    │ ◄─────► │  Ubuntu VM     │      │
│   │ 192.168.64.1 │         │ 192.168.64.4   │      │
│   └──────────────┘         └────────────────┘      │
│                                                    │
└────────────────────────────────────────────────────┘

This network exists only inside your Mac.
Works even with no WiFi. Never changes.`}
        </NetworkDiagram>

        <H3>Your Mac Has Multiple IPs at Once</H3>
        <P className="mb-4">This surprises most people — your Mac can have several IP addresses simultaneously, each for a different network:</P>

        <Reveal>
          <div className="p-6 rounded-2xl bg-bg/60 border border-fg/8 mb-8">
            <div className="space-y-1">
              <IPBadge ip="192.168.1.6" label="← on home WiFi (changes per network)" color="terracotta" />
              <IPBadge ip="192.168.64.1" label="← on UTM VM network (always the same)" color="moss" />
              <IPBadge ip="127.0.0.1" label="← localhost (always, on every computer)" color="sage" />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <AnalogyBox>
            <p>Think of your Mac as a building with multiple entrances. One entrance faces your home WiFi (192.168.1.6). Another entrance faces the internal VM corridor (192.168.64.1). And there&apos;s a special door that only your Mac itself can use — localhost (127.0.0.1). All the same building, multiple addresses.</p>
          </AnalogyBox>
        </Reveal>

        <Reveal>
          <ComparisonTable
            caption="Your Learning Setup vs Real Job"
            headers={["", "Your VM Setup", "Real Job"]}
            rows={[
              ["Server", "Ubuntu VM on your Mac", "Ubuntu in a data center or AWS"],
              ["Server IP", "192.168.64.4 (UTM)", "10.0.1.54 (company VPC)"],
              ["How you connect", "ssh charith@192.168.64.4", "ssh charith@10.0.1.54"],
              ["Network", "UTM private bridge", "Company VPN or private cloud"],
              ["The commands", "Identical", "Identical"],
            ]}
          />
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="yellow">
            VM networking creates a mini private network entirely inside your computer. Your Mac and VM communicate through this internal network using IPs like 192.168.64.x. Everything you practice on your VM works exactly the same on real servers — the only difference is the IP address.
          </KeyTakeaway>
        </Reveal>
      </ArticleSection>

      {/* ══════════ SECTION 5 — SSH & SCP ══════════ */}
      <ArticleSection id="section-5" ref={(el) => { sectionRefs.current[5] = el; }}>
        <SectionTitle title="SSH & SCP — Remote Access" />

        <Reveal>
          <p className="mb-6 text-lede leading-relaxed text-fg-2">
            SSH (Secure Shell) lets you remotely control another computer by typing commands in your terminal. Everything is encrypted — nobody can eavesdrop. SCP (Secure Copy) uses the same SSH tunnel to transfer files.
          </p>
        </Reveal>

        <H3>Breaking Down the SSH Command</H3>
        <Reveal>
          <Terminal
            title="SSH into a remote machine"
            lines={[
              { type: "command", content: "ssh charith@192.168.64.4" },
              { type: "output", content: "charith@192.168.64.4's password:" },
              { type: "output", content: "Welcome to Ubuntu 22.04.3 LTS" },
              { type: "output", content: "Last login: Mon Feb 16 10:30:22 2026" },
              { type: "comment", content: "You are now INSIDE the remote machine" },
              { type: "command", content: "whoami" },
              { type: "output", content: "charith" },
              { type: "command", content: "hostname" },
              { type: "output", content: "ubuntu-vm-01" },
            ]}
          />
        </Reveal>

        <Reveal>
          <ComparisonTable
            caption="SSH Command Breakdown"
            headers={["Part", "Meaning"]}
            rows={[
              ["ssh", 'The command — "open a secure encrypted connection"'],
              ["charith", "Username on the remote machine"],
              ["@", '"at" — connecting these two pieces'],
              ["192.168.64.4", "IP address of the remote machine"],
            ]}
          />
        </Reveal>

        <NetworkDiagram title="What SSH actually does">
{`Your Mac Terminal                          Ubuntu VM
┌──────────────┐    encrypted tunnel   ┌──────────────┐
│ You type     │ ══════════════════════► Commands run  │
│ commands     │                        HERE           │
│ here         │ ◄══════════════════════ Output sent   │
│              │                        back           │
└──────────────┘                       └──────────────┘

You type on your Mac, but everything runs on the VM.`}
        </NetworkDiagram>

        <H3>SCP — Copying Files Over SSH</H3>
        <P className="mb-4">SCP uses the same SSH tunnel but sends files instead of commands:</P>

        <Reveal>
          <Terminal
            title="Copy a folder to the remote VM"
            lines={[
              { type: "comment", content: "Copy entire Desktop/Linux_Proj/ folder to the VM" },
              { type: "command", content: "scp -r ~/Desktop/Linux_Proj/ charith@192.168.64.4:~/projects/" },
              { type: "output", content: "report.txt                          100%  12KB  1.2MB/s   00:00" },
              { type: "output", content: "script.sh                           100%  3.4KB  3.4MB/s   00:00" },
              { type: "output", content: "data.csv                            100%  234KB  5.2MB/s   00:00" },
            ]}
          />
        </Reveal>

        <Reveal>
          <ComparisonTable
            caption="SCP Command Breakdown"
            headers={["Part", "Meaning"]}
            rows={[
              ["scp", "Secure Copy command"],
              ["-r", "Recursive — copy entire folder and everything inside"],
              ["~/Desktop/Linux_Proj/", "Source: folder on your Mac"],
              ["charith@192.168.64.4:", "Remote machine (same format as SSH)"],
              ["~/projects/", "Destination: where to put it on the VM"],
            ]}
          />
        </Reveal>

        <Reveal>
          <WarningBox>
            <p>SSH is picky about file permissions on your private key files. If you get a &ldquo;Permission denied&rdquo; error, check that your <Code>~/.ssh/</Code> folder has permission <Code>700</Code> and your key files have permission <Code>600</Code>. SSH refuses to work if these are wrong — it&apos;s a security feature.</p>
          </WarningBox>
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="green">
            SSH gives you an encrypted remote terminal into any machine. SCP copies files through that same encrypted tunnel. Together they let engineers manage servers, deploy code, and transfer files — all securely, from anywhere in the world.
          </KeyTakeaway>
        </Reveal>
      </ArticleSection>

      {/* ══════════ SECTION 6 — Finding Your IP ══════════ */}
      <ArticleSection id="section-6" ref={(el) => { sectionRefs.current[6] = el; }}>
        <SectionTitle title="Finding Your IP Address" />

        <Reveal>
          <p className="mb-6 text-lede leading-relaxed text-fg-2">
            Knowing how to find IP addresses is a core sysadmin skill. Different operating systems use different commands, and you&apos;ll use these constantly when working with servers and VMs.
          </p>
        </Reveal>

        <H3>On Linux (Ubuntu VM)</H3>
        <Reveal>
          <Terminal
            title="ip a — show all interfaces"
            lines={[
              { type: "command", content: "ip a" },
              { type: "output", content: "1: lo: <LOOPBACK,UP> mtu 65536" },
              { type: "output", content: "    inet 127.0.0.1/8 scope host lo" },
              { type: "output", content: "" },
              { type: "output", content: "2: enp0s1: <BROADCAST,MULTICAST,UP>" },
              { type: "output", content: "    inet 192.168.64.4/24 brd 192.168.64.255" },
              { type: "comment", content: "← This is your VM's IP address! (ignore 127.0.0.1)" },
            ]}
          />
        </Reveal>

        <H3>On macOS</H3>
        <Reveal>
          <Terminal
            title="ifconfig — show network interfaces"
            lines={[
              { type: "command", content: 'ifconfig | grep "inet "' },
              { type: "output", content: "inet 127.0.0.1 netmask 0xff000000" },
              { type: "comment", content: "← localhost, ignore this" },
              { type: "output", content: "inet 192.168.1.6 netmask 0xffffff00 broadcast 192.168.1.255" },
              { type: "comment", content: "← home WiFi IP" },
              { type: "output", content: "inet 192.168.64.1 netmask 0xffffff00 broadcast 192.168.64.255" },
              { type: "comment", content: "← UTM VM network IP" },
            ]}
          />
        </Reveal>

        <Reveal>
          <DidYouKnow>
            <p><Code>ip a</Code> works on Linux but NOT on macOS. <Code>ifconfig</Code> works on macOS and older Linux systems. On modern Linux, <Code>ip a</Code> is the preferred command. To find your public IP (what the internet sees), just search &ldquo;what is my ip&rdquo; on Google from any device.</p>
          </DidYouKnow>
        </Reveal>

        <H3>Quick Reference</H3>
        <Reveal>
          <ComparisonTable
            caption="Finding IP addresses on different systems"
            headers={["System", "Command / Method"]}
            rows={[
              ["Linux (Ubuntu)", "ip a  →  look for 'inet' that is NOT 127.0.0.1"],
              ["macOS", "ifconfig | grep 'inet '  →  ignore 127.0.0.1 and inet6"],
              ["iPhone", "Settings → WiFi → tap (i) next to network → IP Address"],
              ["Your public IP", "Search 'what is my ip' on Google from any device"],
            ]}
          />
        </Reveal>

        <Reveal>
          <ComparisonTable
            caption="Common IP Address Cheat Sheet"
            headers={["Address", "What It Is"]}
            rows={[
              ["127.0.0.1", "Localhost — any computer referring to itself"],
              ["192.168.1.1", "Typical home router address"],
              ["192.168.1.x", "Devices on a typical home network"],
              ["192.168.64.1", "Your Mac on the UTM VM network"],
              ["192.168.64.4", "Your Ubuntu VM (verify with ip a on VM)"],
              ["10.x.x.x", "Private IPs common in offices and cloud"],
              ["0.0.0.0", '"All interfaces" or "any address" in server configs'],
            ]}
          />
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="yellow">
            Use <Code>ip a</Code> on Linux and <Code>ifconfig</Code> on macOS to find IP addresses. Always ignore 127.0.0.1 (that&apos;s localhost — the computer talking to itself). On Linux, look for the &apos;inet&apos; line that isn&apos;t 127.0.0.1 — that&apos;s your real IP on the network.
          </KeyTakeaway>
        </Reveal>
      </ArticleSection>

      {/* ══════════ QUIZ & FLASHCARDS ══════════ */}
      <ArticleSection id="quiz">
        <Reveal>
          <Quiz
            title="Networking Basics Quiz"
            questions={quizQuestions}
            onComplete={(score, total) => {
              if (score >= total * 0.8) { setShowConfetti(true); setShowCelebration(true); }
            }}
          />
        </Reveal>
        <div className="mt-12">
          <Reveal><Flashcards cards={flashcardsData} title="Networking Flashcards" /></Reveal>
        </div>
        <Reveal>
          <div className="mt-12 text-center">
            <motion.a
              href="/fundamentals"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-primary-fg transition-opacity hover:opacity-90 text-lg"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
            >
              {iconFor("arrow-left")}
              Back to Fundamentals
            </motion.a>
          </div>
        </Reveal>
      </ArticleSection>

      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      <CelebrationMessage isVisible={showCelebration} phaseName="Networking Basics" onClose={() => setShowCelebration(false)} />
    </article>
  );
}
