"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useReadingNav } from "@/hooks/useReadingNav";
import ArticleSection from "@/components/reading/ArticleSection";
import KeyTakeaway from "@/components/ui/KeyTakeaway";
import RealTalk from "@/components/ui/RealTalk";
import AnalogyBox from "@/components/ui/AnalogyBox";
import DidYouKnow from "@/components/ui/DidYouKnow";
import WarningBox from "@/components/ui/WarningBox";
import ComparisonTable from "@/components/ui/ComparisonTable";
import ResourceAllocator from "@/components/ui/ResourceAllocator";
import LayerDiagram from "@/components/ui/LayerDiagram";
import Terminal from "@/components/ui/Terminal";
import Collapsible from "@/components/ui/Collapsible";
import Quiz from "@/components/ui/Quiz";
import Flashcards from "@/components/ui/Flashcards";
import Confetti, { CelebrationMessage } from "@/components/ui/Confetti";
import { iconFor } from "@/components/ui/icons";

/* ── Data ── */
const sectionNames = [
  "Virtual Machines",
  "Operating Systems",
  "What is Linux?",
  "Why Linux Everywhere",
  "Servers",
  "The Kernel",
  "Distros & Ubuntu",
  "SSH",
  "Linux Commands",
];
const navSections = sectionNames.map((label, i) => ({ id: i, label }));

const flashcardsData = [
  { front: "What is a Virtual Machine?", back: "A software-based version of a physical computer that runs its own operating system and applications inside your actual computer. Think of it as a computer inside a computer." },
  { front: "What is a Hypervisor?", back: "The software that creates and manages Virtual Machines. It divides your physical computer's resources (RAM, CPU, storage) among VMs. Think of it as a building manager who divides apartments and allocates electricity/water." },
  { front: "What is an Operating System?", back: "The main software that runs your computer. It's the middleman between you (the user) and the hardware (CPU, RAM, hard drive). Without an OS, your computer is just a box of metal and wires." },
  { front: "What is Linux?", back: "Linux is technically just a kernel — the core engine of an operating system. It was created by Linus Torvalds in 1991. Different teams build complete operating systems (distros) around it." },
  { front: "What is a Linux Distribution?", back: "A complete operating system built around the Linux kernel by adding a desktop, file manager, apps, and tools. Examples: Ubuntu, Fedora, Kali Linux, Arch Linux." },
  { front: "What is a Server?", back: "A powerful computer designed to serve data and services to many users simultaneously. It runs 24/7, usually has no screen or keyboard, and sits in a data center." },
  { front: "What is a Kernel?", back: "The core part of an operating system that sits between hardware and software. It translates app requests into hardware actions — like a translator between you and a chef who speaks a different language." },
  { front: "What is SSH?", back: "Secure Shell — a protocol to remotely control another computer using encrypted text commands over a network. Unlike older tools like Telnet, SSH encrypts everything for security." },
  { front: "What does sudo mean?", back: "Super User DO — it runs a command with administrator (boss-level) permissions. Required for system-wide changes like installing software." },
  { front: "What does apt do?", back: "Advanced Package Tool — Ubuntu's software manager for the terminal. Like an App Store but with text commands. Used to install, update, and remove software." },
];

const quizQuestions = [
  { question: "What is a Hypervisor?", options: ["A type of virus", "Software that creates and manages Virtual Machines", "A special kind of hard drive", "A programming language"], correctIndex: 1, explanation: "A Hypervisor is the software that makes VMs possible. It divides your physical computer's resources (RAM, CPU, storage) among Virtual Machines — like a building manager allocating resources to apartments." },
  { question: "Which operating system is FREE and open source?", options: ["Windows", "macOS", "Linux", "All of them"], correctIndex: 2, explanation: "Linux is completely free and open source — anyone can download, use, modify, and redistribute it. Windows requires a license from Microsoft, and macOS only runs on Apple hardware." },
  { question: "What percentage of the world's top 500 supercomputers run Linux?", options: ["50%", "75%", "90%", "100%"], correctIndex: 3, explanation: "100% of the world's top 500 supercomputers run Linux — literally all of them! This shows just how powerful, reliable, and trusted Linux is." },
  { question: "What is the Kernel?", options: ["A type of popcorn", "The full operating system", "The core part of the OS that communicates between hardware and software", "A web browser"], correctIndex: 2, explanation: "The kernel is the core engine of the operating system. It sits between your apps and hardware, translating requests — like a translator between a customer and a chef who speak different languages." },
  { question: "What does 'sudo apt update' do?", options: ["Installs all available updates", "Checks if there are new versions available (doesn't install)", "Removes outdated software", "Restarts the computer"], correctIndex: 1, explanation: "'sudo apt update' refreshes the list of available updates — like asking a waiter 'What's new on the menu?' It does NOT install anything. You need 'sudo apt upgrade' to actually install updates." },
  { question: "Why is SSH called 'Secure' Shell?", options: ["Because it only works on secure networks", "Because it encrypts all communication between computers", "Because it requires a physical key", "Because it only works on Linux"], correctIndex: 1, explanation: "SSH encrypts everything sent between your computer and the remote computer. Unlike the older Telnet, which sent passwords and commands as plain text, SSH makes everything private and secure." },
];

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Animated section heading ── */
const SectionTitle = ({ title }: { title: string }) => (
  <motion.div
    className="mb-12"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
    variants={stagger}
  >
    <motion.div
      className="w-20 h-1.5 bg-accent mb-6 rounded-full"
      variants={fadeUp}
      custom={0}
    />
    <motion.h2
      className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display text-fg leading-tight"
      variants={fadeUp}
      custom={1}
    >
      {title}
    </motion.h2>
  </motion.div>
);

/* ── Animated paragraph ── */
const P = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.p
    className={`text-fg-2 leading-relaxed ${className}`}
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.p>
);

/* ── Animated sub-heading ── */
const H3 = ({ children }: { children: React.ReactNode }) => (
  <motion.h3
    className="text-xl md:text-2xl font-display text-fg mt-14 mb-5"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.h3>
);

/* ── Animated wrapper for any block ── */
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

/* ═══════════ MAIN COMPONENT ═══════════ */
const ComputingBasics = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useReadingNav(navSections, sectionRefs, setCurrentSection);

  return (
    <article>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      <CelebrationMessage isVisible={showCelebration} phaseName="Computing Basics" onClose={() => setShowCelebration(false)} />

      {/* ══════════ SECTION 0 — Virtual Machines ══════════ */}
      <ArticleSection id="section-0" ref={(el) => { sectionRefs.current[0] = el; }}>
        <SectionTitle title="What is a Virtual Machine (VM)?" />

        <Reveal>
          <p className="mb-6 text-lede leading-relaxed text-fg-2">
            A Virtual Machine is basically a computer inside a computer. It&apos;s a software-based version of a physical computer that runs its own operating system and applications, just like a real computer would — but it lives inside your actual computer.
          </p>
        </Reveal>

        <H3>Why Do People Use Virtual Machines?</H3>
        <P className="mb-6">Let me give you some real scenarios:</P>

        <motion.div
          className="space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {[
            { title: "Testing a New Operating System", content: "Let's say you're using Windows on your laptop, but you're curious about Linux. You don't want to delete Windows and install Linux — what if you don't like it? Instead, you create a Virtual Machine inside your Windows computer, and you install Linux on that VM. Now you can use Linux inside a window on your desktop, just like opening any other app. If you don't like it, you just delete the VM. Your real computer is completely untouched." },
            { title: "Software Developers", content: "Imagine a developer is building an app. They need to test if the app works on Windows 10, Windows 11, macOS, and Ubuntu Linux. They don't need to buy 4 separate computers! Instead, they create 4 Virtual Machines on their one computer — each running a different operating system — and test the app on all of them." },
            { title: "Companies and Servers", content: "A big company like Amazon or Google has powerful physical servers. Instead of using one server for one task, they divide one powerful server into many Virtual Machines. One VM runs the email service, another runs the website, another runs the database. This saves them a LOT of money because they don't need to buy separate physical machines for each task." },
            { title: "Safety and Security", content: "Let's say you downloaded a suspicious file from the internet and you want to open it, but you're scared it might be a virus. You can open it inside a Virtual Machine. If the virus destroys the VM — no problem! Your real computer is completely safe. You just delete that VM and create a new one. It's like a sandbox — whatever happens inside stays inside." },
          ].map((item, i) => (
            <motion.div key={item.title} variants={fadeUp} custom={i}>
              <Collapsible title={item.title} index={i}>
                <p className="text-fg-2 leading-relaxed">{item.content}</p>
              </Collapsible>
            </motion.div>
          ))}
        </motion.div>

        <Reveal delay={0.1}>
          <WarningBox>
            <p>Never open suspicious files on your real machine! Use a Virtual Machine as a sandbox. Whatever happens inside stays inside — your real computer stays completely safe.</p>
          </WarningBox>
        </Reveal>

        <H3>How Does It Actually Work?</H3>
        <P className="mb-4">Here&apos;s the simple flow: Your Physical Computer (Host) runs a special software called a <strong className="text-fg">Hypervisor</strong>, which creates and manages Virtual Machines (Guests).</P>

        <Reveal>
          <ul className="list-disc list-inside space-y-2 text-fg-2 mb-6">
            <li><strong className="text-fg">Host Machine</strong> = Your real, physical computer</li>
            <li><strong className="text-fg">Guest Machine</strong> = The Virtual Machine running inside it</li>
            <li><strong className="text-fg">Hypervisor</strong> = The software that makes it all possible</li>
          </ul>
        </Reveal>

        <Reveal>
          <AnalogyBox>
            <p>Think of the Hypervisor as a building manager who divides a large house into apartments and makes sure each apartment gets its fair share of electricity, water, etc. Each apartment (VM) operates independently, but they all share the same building (your physical computer).</p>
          </AnalogyBox>
        </Reveal>

        <Reveal>
          <ResourceAllocator
            title="How 16GB RAM Gets Split Among VMs"
            total={16} unit="GB"
            segments={[
              { label: "VM 1 (Windows 11)", value: 4, unit: "GB", detail: "Windows 11 VM — 4GB RAM, 100GB storage" },
              { label: "VM 2 (Ubuntu)", value: 4, unit: "GB", detail: "Ubuntu Linux VM — 4GB RAM, 100GB storage" },
              { label: "VM 3 (macOS)", value: 4, unit: "GB", detail: "macOS VM — 4GB RAM, 80GB storage" },
            ]}
          />
        </Reveal>

        <H3>Popular VM Software</H3>
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { name: "VirtualBox", desc: "Free, by Oracle — great for beginners", icon: "package" },
              { name: "VMware Workstation", desc: "Popular in professional settings", icon: "buildings" },
              { name: "Hyper-V", desc: "Built into Windows Pro", icon: "app-window" },
              { name: "Parallels", desc: "Popular for Mac", icon: "apple-logo" },
            ].map((vm, i) => (
              <motion.div
                key={vm.name}
                className="p-5 rounded-xl border border-fg/8 bg-surface hover:border-accent/20 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ y: -4 }}
              >
                <span className="text-2xl mb-2 block">{iconFor(vm.icon, { size: 22 })}</span>
                <p className="font-medium text-fg">{vm.name}</p>
                <p className="text-sm text-fg-2 mt-1">{vm.desc}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="green">
            A Virtual Machine is a software-based computer running inside your real computer. A Hypervisor divides your physical resources among VMs. This is how companies like Amazon and Google efficiently run thousands of services on fewer physical machines.
          </KeyTakeaway>
        </Reveal>
      </ArticleSection>

      {/* ══════════ SECTION 1 — Operating Systems ══════════ */}
      <ArticleSection id="section-1" ref={(el) => { sectionRefs.current[1] = el; }}>
        <SectionTitle title="What is an Operating System?" />

        <Reveal>
          <p className="mb-6 text-lede leading-relaxed text-fg-2">
            An Operating System is the main software that runs your computer. It&apos;s the middleman between you (the user) and the hardware (CPU, RAM, hard drive, etc.). Without an OS, your computer is just a useless box of metal and wires.
          </p>
        </Reveal>

        <Reveal>
          <AnalogyBox>
            <p>Think of your computer hardware as a car engine, and the Operating System as the steering wheel, pedals, and dashboard. The engine is powerful, but without the steering wheel and pedals, you can&apos;t drive the car. The OS gives you the controls to use the hardware.</p>
          </AnalogyBox>
        </Reveal>

        <Reveal>
          <ComparisonTable caption="The Big Three Operating Systems" headers={["OS", "Made By", "Used On"]} rows={[["Windows", "Microsoft", "Most PCs and laptops"], ["macOS", "Apple", "MacBooks and iMacs only"], ["Linux", "Community (open-source)", "Servers, devs, Android, and more"]]} />
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="blue">
            The Operating System is the middleman between you and your hardware. The three major operating systems are Windows (Microsoft), macOS (Apple), and Linux (community-built and free).
          </KeyTakeaway>
        </Reveal>
      </ArticleSection>

      {/* ══════════ SECTION 2 — What is Linux? ══════════ */}
      <ArticleSection id="section-2" ref={(el) => { sectionRefs.current[2] = el; }}>
        <SectionTitle title="What is Linux?" />

        <Reveal>
          <p className="mb-6 text-lede leading-relaxed text-fg-2">
            Linux IS an Operating System — just like Windows and macOS. But here&apos;s where it gets interesting — Linux is a little different from Windows and macOS. Let me explain how.
          </p>
        </Reveal>

        <H3>1. Linux is FREE and Open Source</H3>
        <Reveal>
          <div className="space-y-3 mb-6">
            <P><strong className="text-fg">Windows</strong> — You pay Microsoft for a license (it&apos;s usually included when you buy a laptop, but someone paid for it).</P>
            <P><strong className="text-fg">macOS</strong> — You can only get it on Apple hardware, which is expensive.</P>
            <P><strong className="text-fg">Linux</strong> — Completely FREE. Anyone can download, use, modify, and even redistribute it. The code is open for everyone to see and improve.</P>
          </div>
        </Reveal>

        <H3>2. Linux Has Many &ldquo;Flavors&rdquo; (Distributions)</H3>
        <P className="mb-6">Unlike Windows where there&apos;s just Windows 10, 11, etc., Linux comes in hundreds of versions made by different teams. These versions are called <strong className="text-fg">distributions (distros)</strong>.</P>

        <Reveal>
          <ComparisonTable caption="Popular Linux Distributions" headers={["Distro", "Best For"]} rows={[["Ubuntu", "Beginners (most popular, easy to use)"], ["Linux Mint", "People switching from Windows (looks similar)"], ["Fedora", "Developers"], ["Kali Linux", "Cybersecurity and ethical hacking"], ["Arch Linux", "Advanced users who want full control"], ["CentOS / Rocky Linux", "Servers in companies"]]} />
        </Reveal>

        <H3>3. Linux is EVERYWHERE</H3>

        <Reveal>
          <DidYouKnow>
            <p>You already use Linux without knowing it! Android phones? Built on Linux. Netflix, Google, Facebook, Amazon? All run on Linux servers. Smart TVs, routers, traffic lights, space stations? Many run Linux. Even Tesla cars run on Linux!</p>
          </DidYouKnow>
        </Reveal>

        <Reveal>
          <ComparisonTable caption="Windows vs macOS vs Linux" headers={["Feature", "Windows", "macOS", "Linux"]} rows={[["Price", "Paid", "Comes with Apple hardware", "Free"], ["Source Code", "Closed (secret)", "Closed (secret)", "Open (anyone can see/modify)"], ["Ease of Use", "Easy", "Easy", "Depends on distro (Ubuntu is easy)"], ["Customization", "Limited", "Very limited", "Extremely customizable"], ["Gaming", "Best for gaming", "Decent", "Improving, but not the best yet"], ["Security", "Most targeted by viruses", "More secure", "Very secure"], ["Used For", "Home, office, gaming", "Creative work, Apple ecosystem", "Servers, development, hacking, everything"]]} />
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="green">
            Linux is free, open source, and comes in many distributions (flavors). While Windows dominates personal desktops, Linux absolutely dominates servers, phones (Android), IoT devices, and the internet.
          </KeyTakeaway>
        </Reveal>
      </ArticleSection>

      {/* ══════════ SECTION 3 — Why Linux Everywhere ══════════ */}
      <ArticleSection id="section-3" ref={(el) => { sectionRefs.current[3] = el; }}>
        <SectionTitle title="Why Linux is Used Everywhere" />

        <Reveal>
          <p className="mb-6 text-lede leading-relaxed text-fg-2">
            Now the big question — why does Linux power almost everything? There are several strong reasons that make Linux the dominant force in computing infrastructure.
          </p>
        </Reveal>

        <H3>Reason 1: It&apos;s FREE (Zero Cost)</H3>
        <P className="mb-6">Imagine you&apos;re a company and you need to run 10,000 servers (like Google or Amazon does). If you use Windows Server, you&apos;d need to pay Microsoft a license fee for <em>each</em> server. That could be millions of dollars. With Linux? $0. Zero. Nothing.</P>

        <H3>Reason 2: It&apos;s Extremely Customizable</H3>
        <P className="mb-4">Since the source code is open, companies can modify Linux to fit their exact needs. You can&apos;t do this with Windows or macOS — their code is locked.</P>

        <Reveal>
          <Collapsible title="Real-World Examples of Linux Customization" index={0}>
            <ul className="list-disc list-inside space-y-3 text-fg-2">
              <li><strong className="text-fg">Google&apos;s Android</strong> — Google took Linux, customized it heavily, and created Android. Today, Android runs on over 3 billion devices worldwide.</li>
              <li><strong className="text-fg">Amazon Linux</strong> — Amazon created their own version of Linux, optimized specifically for their cloud services (AWS).</li>
              <li><strong className="text-fg">Tesla</strong> — Tesla takes Linux and customizes it to run the touchscreen, autopilot, navigation — everything in their cars.</li>
            </ul>
          </Collapsible>
        </Reveal>

        <H3>Reason 3: It&apos;s Super Stable and Reliable</H3>
        <Reveal>
          <RealTalk>
            Think about your Windows computer. How many times have you seen the blue screen of death? How many times has Windows forced you to restart for updates? Now think about Google.com. Has Google.com ever gone down for a Windows update? No. That&apos;s because Google runs on Linux, and Linux servers can run continuously for months or even years without needing a restart.
          </RealTalk>
        </Reveal>

        <H3>Reason 4: It&apos;s Incredibly Secure</H3>
        <P className="mb-4">Linux is much more secure than Windows for two key reasons: fewer viruses target Linux, and the open-source model means thousands of security experts constantly check the code.</P>

        <Reveal>
          <AnalogyBox>
            <p>Imagine two houses. House A (Windows) has a locked door, but nobody is allowed to inspect the lock. If there&apos;s a weakness, only the company knows — and they might take months to fix it. House B (Linux) has a lock that everyone can inspect. Thousands of security experts around the world are constantly checking it. If someone finds a vulnerability, it gets fixed within hours or days, not months.</p>
          </AnalogyBox>
        </Reveal>

        <H3>Reason 5: It&apos;s Lightweight and Fast</H3>
        <P className="mb-4">Linux can run on anything — from a massive server with 128 CPUs to a tiny Raspberry Pi the size of a credit card. Old, slow computers that can barely run Windows 11 will run fast and smooth with a lightweight Linux distro like Lubuntu.</P>

        <Reveal>
          <DidYouKnow>
            <p>100% of the world&apos;s top 500 supercomputers run Linux — literally ALL of them! Linux also powers IoT devices (smart thermostats, fridges, routers), embedded systems (ATMs, traffic lights, airport displays), and more.</p>
          </DidYouKnow>
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="yellow">
            Linux dominates because it&apos;s free ($0), extremely customizable (Android, Amazon Linux, Tesla), super stable (runs for years), incredibly secure (open-source advantage), and lightweight (runs on anything from a Raspberry Pi to a supercomputer).
          </KeyTakeaway>
        </Reveal>
      </ArticleSection>

      {/* ══════════ SECTION 4 — Servers ══════════ */}
      <ArticleSection id="section-4" ref={(el) => { sectionRefs.current[4] = el; }}>
        <SectionTitle title="What is a Server?" />

        <Reveal>
          <p className="mb-6 text-lede leading-relaxed text-fg-2">
            A server is indeed a computer. It has a CPU, RAM, storage, and a network connection — just like your laptop or desktop. But there are some key differences between a regular computer and a server.
          </p>
        </Reveal>

        <Reveal>
          <AnalogyBox>
            <p>Think of a regular computer as a family car (like a Honda Civic). It&apos;s built for one person or family to use daily — comfortable, has a radio, AC, looks nice. Now think of a server as a heavy-duty truck (like an 18-wheeler). It&apos;s not pretty, it&apos;s not comfortable, but it&apos;s built to carry heavy loads, run long distances, and work non-stop.</p>
          </AnalogyBox>
        </Reveal>

        <Reveal>
          <ComparisonTable caption="Regular Computer vs Server" headers={["Feature", "Your Regular Computer", "A Server"]} rows={[["Purpose", "For YOU to browse, game, work", "To SERVE data/services to many people"], ["Users", "One person (you)", "Hundreds, thousands, or millions"], ["Runs 24/7?", "No, you turn it off at night", "Yes, it runs 24/7, 365 days a year"], ["Hardware", "Moderate (8-32 GB RAM, 1 CPU)", "Very powerful (128-1024+ GB RAM, multiple CPUs)"], ["Screen/Keyboard?", "Yes, you sit in front of it", "Usually NO — managed remotely"], ["Location", "Your desk or lap", "In a data center"]]} />
        </Reveal>

        <H3>Real-World Example: How YouTube Works</H3>
        <P className="mb-4">When you open YouTube on your phone, your phone doesn&apos;t have all those videos stored inside it. So what happens?</P>

        <Reveal>
          <motion.div className="relative pl-8 border-l-2 border-danger/30 space-y-4 mb-6">
            {[
              "You type youtube.com or open the app",
              'Your phone sends a request over the internet: "Hey, I want to watch this video"',
              "That request travels to one of Google's servers in a data center somewhere",
              "The server finds the video, processes it, and sends it back to your phone",
              "You watch the video",
            ].map((step, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-danger/15 text-danger text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-fg-2 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </motion.div>
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="blue">
            A server is a powerful computer designed to serve data and services to many users simultaneously. It runs 24/7, usually has no screen or keyboard, and is managed remotely. That&apos;s why it&apos;s called a &ldquo;server&rdquo; — it literally serves you!
          </KeyTakeaway>
        </Reveal>
      </ArticleSection>

      {/* ══════════ SECTION 5 — The Kernel ══════════ */}
      <ArticleSection id="section-5" ref={(el) => { sectionRefs.current[5] = el; }}>
        <SectionTitle title="What is the Kernel?" />

        <Reveal>
          <p className="mb-6 text-lede leading-relaxed text-fg-2">
            A kernel is the core part of an operating system that sits between your hardware (CPU, RAM, storage, keyboard, screen, etc.) and your software (apps like Chrome, Spotify, games, etc.). Its job is to make them talk to each other.
          </p>
        </Reveal>

        <Reveal>
          <AnalogyBox>
            <p>Imagine you&apos;re an English speaker visiting a Chinese restaurant in China. You don&apos;t speak Chinese, and the chef doesn&apos;t speak English. You need a translator sitting between you and the chef. You (the customer) = the software/apps. The chef = the hardware. The translator = the KERNEL. You tell the translator &ldquo;I want fried rice&rdquo; (you click a file). The translator tells the chef in Chinese (kernel tells CPU/RAM). The chef cooks it (hardware processes). The translator brings it back in English (kernel sends result to your app).</p>
          </AnalogyBox>
        </Reveal>

        <H3>What Does the Kernel Actually Do?</H3>
        <motion.div
          className="space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {[
            {
              title: "Example: You press a key on your keyboard",
              steps: ["Your keyboard hardware sends an electrical signal", 'The kernel receives that signal, figures out which key was pressed, and tells the app "Hey, the user pressed the letter A"', 'The app then shows the letter "A" on your screen'],
              note: "Without the kernel? You press the key and nothing happens.",
            },
            {
              title: "Example: You open Spotify and play a song",
              steps: ['Spotify (the app) says to the kernel: "I need to play this audio file"', "The kernel talks to the storage to load the file, talks to the CPU to process the audio, and talks to the speakers to play the sound", "You hear the music"],
              note: "Without the kernel? Spotify has no way to reach your speakers.",
            },
            {
              title: "Example: Chrome, a game, and Word open at the same time",
              steps: ["All three apps need CPU time and RAM", 'The kernel acts as a traffic controller: "Chrome gets 30% of CPU, the game gets 50%, Word gets 20%"', "It makes sure they all run smoothly without crashing into each other"],
              note: "Without the kernel? All three apps would try to grab the CPU at the same time and everything would crash.",
            },
          ].map((item, i) => (
            <motion.div key={item.title} variants={fadeUp} custom={i}>
              <Collapsible title={item.title} index={i}>
                <ol className="list-decimal list-inside space-y-2 text-fg-2">
                  {item.steps.map((step, j) => (
                    <li key={j}>{step}</li>
                  ))}
                </ol>
                <p className="text-fg-2 mt-3 italic">{item.note}</p>
              </Collapsible>
            </motion.div>
          ))}
        </motion.div>

        <H3>Kernel vs Operating System</H3>

        <Reveal>
          <AnalogyBox>
            <p>Think of a car. The engine = the Kernel (the most critical part that makes everything run). The full car (engine + body + seats + steering wheel + dashboard + AC + radio) = the Operating System. You can&apos;t drive just an engine on the road — you need the full car wrapped around it.</p>
          </AnalogyBox>
        </Reveal>

        <Reveal>
          <ComparisonTable caption="Kernel vs Operating System" headers={["Component", "What It Is"]} rows={[["Kernel", "The engine — handles hardware communication, memory, processes"], ["Operating System", "The full car — kernel + desktop + apps + file manager + everything"]]} />
        </Reveal>

        <Reveal>
          <LayerDiagram
            title="The Computing Layer Stack"
            layers={[
              { label: "Applications", description: "Chrome, Spotify, games, Word — the apps you use every day. They send requests down to the OS.", color: "rgba(163, 177, 138, 0.3)" },
              { label: "Operating System", description: "The full package — desktop, file manager, settings, tools. Wraps around the kernel to give you a usable experience.", color: "rgba(212, 163, 115, 0.3)" },
              { label: "Kernel", description: "The core translator. Takes requests from the OS and apps, and communicates with the hardware. Manages memory, processes, and devices.", color: "rgba(58, 90, 64, 0.3)" },
              { label: "Hardware", description: "Physical components — CPU, RAM, storage, keyboard, screen, speakers. Raw power that needs the kernel to be useful.", color: "rgba(188, 71, 73, 0.2)" },
            ]}
          />
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="green">
            The kernel is the core engine of the operating system that translates between your apps and your hardware. Without it, your apps can&apos;t use the CPU, RAM, storage, or any device. The OS is the full package built around the kernel.
          </KeyTakeaway>
        </Reveal>
      </ArticleSection>

      {/* ══════════ SECTION 6 — Distros & Ubuntu ══════════ */}
      <ArticleSection id="section-6" ref={(el) => { sectionRefs.current[6] = el; }}>
        <SectionTitle title="Linux Distros & Ubuntu" />

        <Reveal>
          <p className="mb-6 text-lede leading-relaxed text-fg-2">
            Now that you understand what a kernel is, this will make much more sense. Linux is JUST the kernel — just the engine. It was created by Linus Torvalds in 1991. By itself, you cannot sit down and use just the Linux kernel — there&apos;s no desktop, no apps, no file manager, nothing visual.
          </p>
        </Reveal>

        <H3>So How Do People Actually Use Linux?</H3>
        <P className="mb-6">Different teams take the Linux kernel (engine) and build a complete operating system around it by adding a graphical desktop, a file manager, pre-installed apps, a software store, themes, settings, and tools. This complete package is called a <strong className="text-fg">Linux Distribution (Distro)</strong>.</P>

        <Reveal>
          <AnalogyBox>
            <p>Imagine the Linux kernel is a car engine. Different car companies take that same engine and build completely different cars around it: Toyota takes the engine and builds a reliable family car — that&apos;s like <strong>Ubuntu</strong>. Ferrari takes it and builds a sports car — that&apos;s like <strong>Kali Linux</strong>. Jeep takes it and builds an off-road beast — that&apos;s like <strong>Arch Linux</strong>. Honda takes it and builds something smooth and familiar — that&apos;s like <strong>Linux Mint</strong>. They ALL have the same engine inside (Linux kernel), but the car around it looks, feels, and behaves differently.</p>
          </AnalogyBox>
        </Reveal>

        <H3>Ubuntu Specifically</H3>
        <P className="mb-4"><strong className="text-fg">Ubuntu</strong> = Linux kernel + GNOME desktop + Software Center + pre-installed apps + tons of user-friendly features, all packaged together by a company called Canonical.</P>
        <P className="mb-4">It&apos;s the most popular distro for beginners because:</P>

        <Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: "tag", text: "It's free" },
              { icon: "target", text: "Easy to install and use" },
              { icon: "sparkle", text: "Clean, modern look" },
              { icon: "handshake", text: "Huge community" },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                className="p-4 rounded-xl bg-surface border border-fg/8 text-center hover:border-success/20 hover:shadow-md transition-all"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ y: -3 }}
              >
                <span className="text-2xl block mb-2">{iconFor(item.icon, { size: 22 })}</span>
                <p className="text-sm text-fg">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="blue">
            Linux is just the kernel (engine). A distro is a complete OS built around that kernel. Ubuntu is the most popular beginner-friendly distro, maintained by Canonical. All distros share the same Linux kernel but differ in everything else.
          </KeyTakeaway>
        </Reveal>
      </ArticleSection>

      {/* ══════════ SECTION 7 — SSH ══════════ */}
      <ArticleSection id="section-7" ref={(el) => { sectionRefs.current[7] = el; }}>
        <SectionTitle title="What is SSH?" />

        <Reveal>
          <p className="mb-6 text-lede leading-relaxed text-fg-2">
            SSH stands for Secure Shell. It&apos;s a way to remotely control another computer using just text commands, over the internet or a network — securely. You sit at your computer and type commands that travel through SSH to the remote computer, which executes them.
          </p>
        </Reveal>

        <H3>Why is it Called &ldquo;Secure&rdquo; Shell?</H3>

        <Reveal>
          <WarningBox>
            <p>Before SSH, there was <strong>Telnet</strong> which did the same thing — let you control a remote computer. But Telnet sent everything as <strong>plain text</strong>, meaning anyone snooping on the network could see your password, your commands, everything. SSH encrypts all communication. Never use Telnet for anything sensitive!</p>
          </WarningBox>
        </Reveal>

        <H3>When Do People Use SSH?</H3>
        <P className="mb-6">Remember we talked about servers — powerful computers in data centers with no screen or keyboard? So how does an engineer manage them? They <strong className="text-fg">SSH into the server</strong> from their laptop!</P>

        <Reveal>
          <Terminal
            title="SSH into a Remote Server"
            lines={[
              { type: "comment", content: "Connect to a remote server as user 'charith'" },
              { type: "command", content: "ssh charith@192.168.1.50" },
              { type: "output", content: "charith@192.168.1.50's password:" },
              { type: "output", content: "Welcome to Ubuntu 22.04.3 LTS" },
              { type: "output", content: "Last login: Mon Feb 16 10:30:22 2026" },
              { type: "output", content: "" },
              { type: "comment", content: "You're now inside the remote server!" },
              { type: "command", content: "hostname" },
              { type: "output", content: "production-server-01" },
              { type: "command", content: "whoami" },
              { type: "output", content: "charith" },
              { type: "comment", content: "Every command now runs on the server, not your laptop" },
            ]}
          />
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="green">
            SSH (Secure Shell) lets you remotely control another computer using encrypted text commands. It&apos;s how engineers manage servers that have no screen or keyboard — all from their own laptop, from anywhere in the world.
          </KeyTakeaway>
        </Reveal>
      </ArticleSection>

      {/* ══════════ SECTION 8 — Linux Commands ══════════ */}
      <ArticleSection id="section-8" ref={(el) => { sectionRefs.current[8] = el; }}>
        <SectionTitle title="Linux Commands: sudo, apt, update & upgrade" />

        <Reveal>
          <p className="mb-6 text-lede leading-relaxed text-fg-2">
            Let&apos;s break down one of the most common Linux commands you&apos;ll ever use: sudo apt update && sudo apt upgrade -y. There are 4 key parts: sudo, apt, update/upgrade, and &&.
          </p>
        </Reveal>

        <H3>1. sudo = &ldquo;Run as Admin/Boss&rdquo;</H3>
        <P className="mb-4"><code className="font-mono text-accent bg-bg px-1.5 py-0.5 rounded">sudo</code> stands for &ldquo;Super User DO&rdquo;.</P>

        <Reveal>
          <AnalogyBox>
            <p>Imagine you work at an office. Regular employees can do basic things — use the printer, sit at their desk. But some actions require the boss&apos;s permission — like accessing the safe, or changing company policies. When you add <code className="font-mono">sudo</code> before a command, you&apos;re saying &ldquo;I want to do this as the boss (administrator)&rdquo;.</p>
          </AnalogyBox>
        </Reveal>

        <H3>2. apt = The App Store (for the Terminal)</H3>
        <P className="mb-6"><code className="font-mono text-accent bg-bg px-1.5 py-0.5 rounded">apt</code> stands for Advanced Package Tool. It&apos;s Ubuntu&apos;s software manager — like the App Store on your iPhone or Google Play Store on Android, but instead of tapping icons, you type commands.</P>

        <H3>3. update vs upgrade</H3>
        <P className="mb-4">These two words sound similar but do very different things:</P>

        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              className="p-6 rounded-xl border border-accent/15 bg-accent/[0.03]"
              whileHover={{ y: -3, borderColor: "rgba(58, 90, 64, 0.3)" }}
              transition={{ duration: 0.2 }}
            >
              <code className="font-mono text-accent bg-bg px-2 py-1 rounded text-sm">sudo apt update</code>
              <p className="font-medium text-fg mt-3 mb-2">&ldquo;Check what&apos;s new&rdquo;</p>
              <p className="text-sm text-fg-2">Refreshes the list of available updates. It does NOT install anything.</p>
            </motion.div>
            <motion.div
              className="p-6 rounded-xl border border-danger/15 bg-danger/[0.03]"
              whileHover={{ y: -3, borderColor: "rgba(188, 71, 73, 0.3)" }}
              transition={{ duration: 0.2 }}
            >
              <code className="font-mono text-danger bg-bg px-2 py-1 rounded text-sm">sudo apt upgrade -y</code>
              <p className="font-medium text-fg mt-3 mb-2">&ldquo;Install all updates&rdquo;</p>
              <p className="text-sm text-fg-2">Actually downloads and installs all new versions. <code className="font-mono">-y</code> means &ldquo;yes to everything&rdquo;.</p>
            </motion.div>
          </div>
        </Reveal>

        <Reveal>
          <AnalogyBox>
            <p>Imagine you go to a restaurant and ask the waiter &ldquo;What&apos;s new on the menu today?&rdquo; The waiter tells you what&apos;s available. You haven&apos;t ordered anything yet — you&apos;re just checking. That&apos;s <code className="font-mono">apt update</code>.</p>
          </AnalogyBox>
        </Reveal>

        <H3>4. && = &ldquo;If the first succeeds, then do the next&rdquo;</H3>
        <P className="mb-6">The <code className="font-mono text-accent bg-bg px-1.5 py-0.5 rounded">&&</code> connects two commands. It means: run the first command, and <em>only if it succeeds</em>, run the next one. It makes no sense to install updates (upgrade) if you haven&apos;t checked what&apos;s available (update) first — it&apos;s like ordering food before seeing the menu.</P>

        <Reveal>
          <Terminal
            title="Updating Ubuntu"
            lines={[
              { type: "comment", content: "Step 1: Check for available updates" },
              { type: "command", content: "sudo apt update" },
              { type: "output", content: "[sudo] password for charith:" },
              { type: "output", content: "Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease" },
              { type: "output", content: "Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [119 kB]" },
              { type: "output", content: "Get:3 http://security.ubuntu.com/ubuntu jammy-security InRelease [110 kB]" },
              { type: "output", content: "Fetched 229 kB in 2s (115 kB/s)" },
              { type: "output", content: "Reading package lists... Done" },
              { type: "output", content: "12 packages can be upgraded. Run 'apt list --upgradable' to see them." },
              { type: "output", content: "" },
              { type: "comment", content: "Step 2: Install all available updates" },
              { type: "command", content: "sudo apt upgrade -y" },
              { type: "output", content: "Reading package lists... Done" },
              { type: "output", content: "Building dependency tree... Done" },
              { type: "output", content: "Calculating upgrade... Done" },
              { type: "output", content: "The following packages will be upgraded:" },
              { type: "output", content: "  base-files curl libcurl4 openssl ..." },
              { type: "output", content: "12 upgraded, 0 newly installed, 0 to remove." },
              { type: "output", content: "Need to get 4,521 kB of archives." },
              { type: "output", content: "Unpacking base-files (12ubuntu4.5) over (12ubuntu4.4) ..." },
              { type: "output", content: "Setting up base-files (12ubuntu4.5) ..." },
              { type: "output", content: "Processing triggers for man-db ..." },
              { type: "output", content: "Done! All packages are up to date." },
            ]}
          />
        </Reveal>

        <Reveal>
          <KeyTakeaway variant="yellow">
            <code className="font-mono">sudo</code> = run as admin. <code className="font-mono">apt</code> = package manager. <code className="font-mono">update</code> = check for new versions. <code className="font-mono">upgrade</code> = install them. <code className="font-mono">&&</code> = only continue if the first command succeeds. Together: <code className="font-mono">sudo apt update && sudo apt upgrade -y</code> is the most common command to keep your system up to date.
          </KeyTakeaway>
        </Reveal>
      </ArticleSection>

      {/* ══════════ QUIZ & FLASHCARDS ══════════ */}
      <section className="relative bg-gradient-to-b from-surface via-accent/[0.04] to-surface">
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-accent/10 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-success/10 to-transparent" />

        <div className="px-6 md:px-12 lg:px-20 xl:px-32 py-20 md:py-28">
          <Reveal>
            <Quiz
              title="Computing Basics Quiz"
              questions={quizQuestions}
              onComplete={(score, total) => {
                if (score >= total * 0.8) {
                  setShowConfetti(true);
                  setShowCelebration(true);
                }
              }}
            />
          </Reveal>

          <div className="mt-24">
            <Reveal>
              <Flashcards cards={flashcardsData} title="Key Concepts Flashcards" />
            </Reveal>
          </div>

          {/* Back link */}
          <Reveal>
            <div className="mt-24 text-center">
              <motion.a
                href="/fundamentals"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors text-lg shadow-lg shadow-accent/20"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
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
    </article>
  );
};

export default ComputingBasics;
