"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useReadingNav } from "@/hooks/useReadingNav";
import ArticleSection from "@/components/reading/ArticleSection";
import KeyTakeaway from "@/components/ui/KeyTakeaway";
import AnalogyBox from "@/components/ui/AnalogyBox";
import DidYouKnow from "@/components/ui/DidYouKnow";
import Terminal from "@/components/ui/Terminal";
import Quiz from "@/components/ui/Quiz";
import Flashcards from "@/components/ui/Flashcards";
import Confetti from "@/components/ui/Confetti";
import { iconFor } from "@/components/ui/icons";

const sectionNames = [
  "The Problem Docker Solves",
  "What is Docker?",
  "Containers vs VMs",
  "Images, Containers & Dockerfile",
  "Docker Commands",
  "What is nginx?",
  "What nginx Can Do",
];
const navSections = sectionNames.map((label, i) => ({ id: i, label }));

const quizQuestions = [
  {
    question: "What problem does Docker solve?",
    options: [
      "Makes code run faster",
      "'It works on my machine' — packages app + all dependencies into one container that runs identically everywhere",
      "Replaces the operating system",
      "Provides network security",
    ],
    correctIndex: 1,
    explanation: "The classic software problem: code works on your machine but crashes on the server. Docker packages your app AND everything it needs (Python version, libraries, config) into a container. The same container runs identically on your Mac, your friend's PC, Ubuntu server, and AWS.",
  },
  {
    question: "What is the difference between a Docker image and a container?",
    options: [
      "They are the same thing",
      "Image = recipe (blueprint), Container = running instance made from the recipe",
      "Container = recipe, Image = running instance",
      "Images are for Linux, containers are for Windows",
    ],
    correctIndex: 1,
    explanation: "Image = the recipe. Container = the meal made from the recipe. Same image can create 100 identical containers. Images are static (stored on Docker Hub). Containers are live running instances.",
  },
  {
    question: "How are containers different from virtual machines?",
    options: [
      "Containers have their own kernel, VMs share the host kernel",
      "VMs have their own full OS kernel; containers share the host kernel — making containers lighter and faster to start",
      "Containers are more secure than VMs",
      "VMs are faster than containers",
    ],
    correctIndex: 1,
    explanation: "VM = a full house (its own kitchen, bedroom, bathroom — full OS). Container = a hotel room (shared building infrastructure, your own private space). Containers share the host OS kernel, so they start in seconds and use far less RAM than VMs.",
  },
  {
    question: "What is Docker Hub?",
    options: [
      "Docker's command-line tool",
      "An online registry of pre-built images — like GitHub but for Docker images",
      "Docker's paid subscription service",
      "A tool for managing containers",
    ],
    correctIndex: 1,
    explanation: "Docker Hub is an online registry where people publish Docker images. 'docker pull nginx' downloads the official nginx web server image. 'docker pull postgres' gets a full PostgreSQL database. Thousands of ready-made images available instantly.",
  },
  {
    question: "What can nginx do that makes it essential for production servers?",
    options: [
      "Only serve static HTML files",
      "Serve files, act as a reverse proxy in front of your app, load balance across multiple servers, handle HTTPS",
      "Manage databases",
      "Replace the Linux kernel",
    ],
    correctIndex: 1,
    explanation: "nginx is far more than a web server. As a reverse proxy, it sits in front of your app and forwards requests — protecting it from direct internet exposure. As a load balancer, it distributes traffic across multiple servers. It handles SSL/HTTPS so your app doesn't have to.",
  },
];

const flashcardsData = [
  { front: "What is Docker?", back: "A tool that packages your app + all its dependencies into a container. The container runs identically on any machine — solving 'it works on my machine'." },
  { front: "Image vs Container", back: "Image = the recipe/blueprint (static). Container = a running instance made from the image. Same image → 100 identical containers. Images stored on Docker Hub." },
  { front: "Container vs VM", back: "VM = full OS inside (heavy, minutes to start). Container = shares host kernel (light, seconds to start). Container is like a hotel room, VM is like a full house." },
  { front: "What is a Dockerfile?", back: "A text file with instructions to build your own Docker image: FROM ubuntu, RUN apt install python3, COPY app.py, CMD python3 app.py" },
  { front: "What is Docker Hub?", back: "Online registry of Docker images — like GitHub for containers. Thousands of ready-made images: ubuntu, nginx, postgres, python, node. Pull with: docker pull nginx" },
  { front: "What is nginx?", back: "A high-performance web server used by Netflix, Airbnb, GitHub. Handles ~33% of all websites. Built in 2004 to solve Apache's performance problems under heavy traffic." },
  { front: "What is a reverse proxy?", back: "nginx sitting in front of your app — receives all requests, forwards to your app, sends response back. Protects your app from direct internet exposure. Also handles SSL termination." },
];

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" as const } }),
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

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="font-mono text-accent bg-accent/8 px-1.5 py-0.5 rounded text-[0.9em]">{children}</code>
);

const DockerCmd = ({ cmd, desc }: { cmd: string; desc: string }) => (
  <div className="flex items-start gap-4 p-3 rounded-lg border border-fg/8 bg-surface hover:border-accent/20 hover:shadow-sm transition-all group">
    <code className="font-mono text-sm text-accent font-semibold flex-shrink-0 group-hover:text-accent/80">{cmd}</code>
    <p className="text-sm text-fg-2">{desc}</p>
  </div>
);

export default function DockerAndNginx() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useReadingNav(navSections, sectionRefs);

  return (
    <article>
      {/* Section 0: The Problem */}
      <ArticleSection id="s0" ref={el => { sectionRefs.current[0] = el; }}>
        <SectionTitle title="The Problem Docker Solves" />
        <P className="text-lg md:text-xl mb-8">Every developer has said this at least once. You build an app on your Mac, it works perfectly. You send it to a colleague or deploy it to a server — and it immediately crashes.</P>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-5 rounded-xl border-2 border-accent/15 bg-accent/5">
              <p className="font-semibold text-accent mb-3">Your Mac</p>
              <div className="font-mono text-xs space-y-1 text-fg-2">
                <p>Python 3.11 ✓</p>
                <p>Library A version 2.0 ✓</p>
                <p>Library B version 5.1 ✓</p>
                <p className="text-accent font-bold mt-2">App works perfectly ✓</p>
              </div>
            </div>
            <div className="p-5 rounded-xl border-2 border-danger/60 bg-danger-soft/25">
              <p className="font-semibold text-danger mb-3">Your server</p>
              <div className="font-mono text-xs space-y-1 text-fg-2">
                <p>Python 3.8 ← different version!</p>
                <p>Library A version 1.5 ← old version!</p>
                <p>Library B not installed ← missing!</p>
                <p className="text-danger font-bold mt-2">App crashes</p>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <div className="bg-terminal rounded-xl p-5 text-center mb-8">
            <p className="text-2xl text-white italic mb-2">&ldquo;It works on my machine!&rdquo;</p>
            <p className="text-terminal-fg/50 text-sm">— every developer, at least once</p>
          </div>
        </Reveal>
        <P>Docker solves this completely by packaging your app <em>and everything it needs</em> into a single portable box called a <strong>container</strong>.</P>
        <KeyTakeaway>Docker doesn&apos;t fix your code — it eliminates environment differences. Same container, same behavior, everywhere.</KeyTakeaway>
      </ArticleSection>

      {/* Section 1: What is Docker */}
      <ArticleSection id="s1" ref={el => { sectionRefs.current[1] = el; }}>
        <SectionTitle title="What is Docker?" />
        <P className="text-lg mb-8">Docker packages your app and all its dependencies into a <strong>container</strong> — a self-contained box that runs identically on any machine.</P>
        <Reveal>
          <div className="bg-terminal rounded-xl p-5 font-mono text-sm mb-8 overflow-x-auto">
            <p className="text-terminal-fg/50 mb-3">What&apos;s inside a container:</p>
            <p className="text-terminal-ok">┌─────────────────────────────┐</p>
            <p className="text-terminal-ok">│         CONTAINER           │</p>
            <p className="text-terminal-ok">│                             │</p>
            <p className="text-terminal-ok">│  Your app                   │</p>
            <p className="text-terminal-ok">│  Python 3.11                │</p>
            <p className="text-terminal-ok">│  Library A 2.0              │</p>
            <p className="text-terminal-ok">│  Library B 5.1              │</p>
            <p className="text-terminal-ok">│  All config files           │</p>
            <p className="text-terminal-ok">│                             │</p>
            <p className="text-terminal-ok">└─────────────────────────────┘</p>
            <div className="mt-4 space-y-1 text-terminal-ok">
              <p>Your Mac      → runs ✓</p>
              <p>Friend&apos;s PC  → runs ✓</p>
              <p>Ubuntu server → runs ✓</p>
              <p>AWS cloud     → runs ✓</p>
            </div>
          </div>
        </Reveal>
        <H3>Where Docker Hub comes in</H3>
        <P className="mb-6">Docker Hub is like GitHub but for Docker images. Thousands of ready-made images you can use instantly:</P>
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "ubuntu", desc: "Bare Ubuntu system" },
              { name: "nginx", desc: "Web server, ready" },
              { name: "postgres", desc: "Full PostgreSQL DB" },
              { name: "python", desc: "Python + pip" },
              { name: "node", desc: "Node.js ready" },
              { name: "redis", desc: "Cache DB" },
              { name: "mysql", desc: "MySQL database" },
              { name: "alpine", desc: "Tiny Linux base" },
            ].map((img, i) => (
              <Reveal key={img.name} delay={i * 0.06}>
                <div className="p-3 rounded-lg border border-fg/8 bg-surface text-center hover:border-accent/20 transition-all">
                  <code className="font-mono text-sm font-bold text-accent block">{img.name}</code>
                  <p className="text-xs text-fg-2 mt-1">{img.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </ArticleSection>

      {/* Section 2: Containers vs VMs */}
      <ArticleSection id="s2" ref={el => { sectionRefs.current[2] = el; }}>
        <SectionTitle title="Containers vs Virtual Machines" />
        <P className="text-lg mb-8">You already use a VM (your Ubuntu server). How is a Docker container different?</P>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl border-2 border-danger/15 bg-danger/5 overflow-hidden">
              <div className="p-4 border-b border-danger/10">
                <p className="font-semibold text-fg">Virtual Machine</p>
                <p className="text-xs text-fg-2 mt-0.5">A full house with its own kitchen</p>
              </div>
              <div className="p-4 font-mono text-xs space-y-0.5 text-fg-2">
                <p>Your Mac hardware</p>
                <p className="pl-2">└── UTM (hypervisor)</p>
                <p className="pl-6">└── Full Ubuntu OS</p>
                <p className="pl-10">├── kernel, drivers</p>
                <p className="pl-10">└── your app</p>
                <p className="mt-3 text-danger text-xs">Heavy — full OS inside</p>
                <p className="text-danger text-xs">Minutes to start, GBs of RAM</p>
              </div>
            </div>
            <div className="rounded-xl border-2 border-accent/15 bg-accent/5 overflow-hidden">
              <div className="p-4 border-b border-accent/10">
                <p className="font-semibold text-fg">Docker Container</p>
                <p className="text-xs text-fg-2 mt-0.5">A hotel room — shared building</p>
              </div>
              <div className="p-4 font-mono text-xs space-y-0.5 text-fg-2">
                <p>Ubuntu Server</p>
                <p className="pl-2">Linux kernel (shared ↔ all containers)</p>
                <p className="pl-2">├── Container A: App + libs</p>
                <p className="pl-2">├── Container B: App + libs</p>
                <p className="pl-2">└── Container C: App + libs</p>
                <p className="mt-3 text-accent text-xs">Light — no separate OS</p>
                <p className="text-accent text-xs">Seconds to start, MBs of RAM</p>
              </div>
            </div>
          </div>
        </Reveal>
        <AnalogyBox>
          <strong>VM</strong> = a full house (you own the kitchen, bedroom, bathroom — everything duplicated)<br />
          <strong>Container</strong> = a hotel room (shared building infrastructure — electricity, plumbing, elevator — your own private space inside)<br /><br />
          Hotel rooms are faster to set up, cheaper, and you can have 100 of them in one building.
        </AnalogyBox>
        <DidYouKnow>Containers start in seconds. A full Ubuntu VM might take 30–60 seconds to boot. This is why microservices (running 50+ small containers) are practical with Docker but impractical with VMs.</DidYouKnow>
      </ArticleSection>

      {/* Section 3: Images, Containers, Dockerfile */}
      <ArticleSection id="s3" ref={el => { sectionRefs.current[3] = el; }}>
        <SectionTitle title="Images, Containers &amp; Dockerfile" />
        <div className="space-y-6 mb-10">
          {[
            {
              term: "Image",
              icon: "clipboard-text",
              desc: "A blueprint — like a recipe. Static, read-only. Stored on Docker Hub. From one image you can create 100 identical containers.",
              color: "border-success/20 bg-success/5",
            },
            {
              term: "Container",
              icon: "package",
              desc: "A running instance made from an image. Like a meal made from a recipe. You can run, stop, restart, delete containers independently.",
              color: "border-accent/20 bg-accent/5",
            },
            {
              term: "Dockerfile",
              icon: "file-text",
              desc: "A text file with instructions to build your OWN custom image. Define what OS to start from, what software to install, what files to copy in.",
              color: "border-danger/20 bg-danger/5",
            },
          ].map((item, i) => (
            <Reveal key={item.term} delay={i * 0.1}>
              <div className={`p-5 rounded-xl border-2 ${item.color} flex gap-5`}>
                <span className="text-3xl flex-shrink-0">{iconFor(item.icon, { size: 22 })}</span>
                <div>
                  <p className="font-semibold text-fg text-lg mb-1">{item.term}</p>
                  <p className="text-sm text-fg-2">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <H3>A real Dockerfile</H3>
        <Reveal>
          <div className="bg-terminal rounded-xl p-5 font-mono text-sm overflow-x-auto">
            <p className="text-terminal-fg/50 mb-3">Dockerfile</p>
            <div className="space-y-2">
              {[
                { code: "FROM ubuntu:24.04", comment: "← start from official Ubuntu image" },
                { code: "RUN apt install -y python3", comment: "← install Python" },
                { code: "COPY app.py /app/", comment: "← copy your app into the container" },
                { code: 'CMD ["python3", "/app/app.py"]', comment: "← run this on container start" },
              ].map(line => (
                <div key={line.code} className="flex flex-wrap gap-3">
                  <span className="text-terminal-ok">{line.code}</span>
                  <span className="text-terminal-fg/50 text-xs self-end">{line.comment}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <KeyTakeaway>Image = recipe. Container = meal. Dockerfile = instructions for writing your own recipe. One image, infinite identical containers.</KeyTakeaway>
      </ArticleSection>

      {/* Section 4: Docker Commands */}
      <ArticleSection id="s4" ref={el => { sectionRefs.current[4] = el; }}>
        <SectionTitle title="Docker Commands" />
        <P className="text-lg mb-8">The commands you&apos;ll use 90% of the time:</P>
        <Reveal>
          <div className="space-y-2 mb-8">
            <DockerCmd cmd="docker pull ubuntu" desc="Download the Ubuntu image from Docker Hub" />
            <DockerCmd cmd="docker run ubuntu" desc="Create and start a container from the ubuntu image" />
            <DockerCmd cmd="docker run -it ubuntu bash" desc="-it = interactive terminal. Drops you inside the container with a bash shell" />
            <DockerCmd cmd="docker run -d nginx" desc="-d = detached (runs in background). Start nginx web server in background" />
            <DockerCmd cmd="docker ps" desc="List all currently running containers" />
            <DockerCmd cmd="docker ps -a" desc="List ALL containers, including stopped ones" />
            <DockerCmd cmd="docker stop <id>" desc="Stop a running container (graceful shutdown)" />
            <DockerCmd cmd="docker rm <id>" desc="Delete a stopped container" />
            <DockerCmd cmd="docker images" desc="List all images downloaded on your machine" />
            <DockerCmd cmd="docker logs <id>" desc="See stdout/stderr output from a container" />
          </div>
        </Reveal>
        <H3>Real-world example</H3>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-xl border-2 border-danger/40 bg-danger-soft/20">
              <p className="font-semibold text-danger mb-3">Without Docker</p>
              <div className="text-xs text-fg-2 space-y-1">
                <p>Server 1 → Python 3.8, app v1.0</p>
                <p>Server 2 → Python 3.9, app v1.0 ← drift</p>
                <p>Server 3 → Python 3.8, app v1.1 ← drift</p>
                <p className="text-danger mt-2">Nightmare to manage. Every server different.</p>
              </div>
            </div>
            <div className="p-5 rounded-xl border-2 border-accent/15 bg-accent/5">
              <p className="font-semibold text-accent mb-3">With Docker</p>
              <div className="font-mono text-xs text-fg-2 space-y-1">
                <p>docker run myapp:v1.0  ← all servers</p>
                <p className="text-success">Identical everywhere, always.</p>
                <p className="text-success">Update → docker run myapp:v1.1</p>
                <p className="text-success">Rollback → docker run myapp:v1.0</p>
              </div>
            </div>
          </div>
        </Reveal>
      </ArticleSection>

      {/* Section 5: What is nginx */}
      <ArticleSection id="s5" ref={el => { sectionRefs.current[5] = el; }}>
        <SectionTitle title="What is nginx?" />
        <P className="text-lg mb-6">When you type a URL in your browser, something on the server receives your request and sends back the webpage. That &quot;something&quot; is a <strong>web server</strong> — and nginx is one of the most popular ones in the world.</P>
        <Reveal>
          <div className="rounded-xl border border-fg/10 bg-surface p-5 mb-8 font-mono text-sm overflow-x-auto">
            <div className="space-y-1 text-fg-2">
              <p>You type google.com</p>
              <p className="pl-4">↓</p>
              <p>Your browser sends a request to the server</p>
              <p className="pl-4">↓</p>
              <p className="text-accent font-semibold">nginx receives the request</p>
              <p className="pl-4">↓</p>
              <p>nginx finds the right file (HTML, image, etc)</p>
              <p className="pl-4">↓</p>
              <p>nginx sends it back to your browser</p>
              <p className="pl-4">↓</p>
              <p>You see the webpage ✓</p>
            </div>
          </div>
        </Reveal>
        <H3>Who uses nginx?</H3>
        <Reveal>
          <div className="flex flex-wrap gap-3 mb-8">
            {["Netflix", "Airbnb", "GitHub", "Dropbox", "WordPress", "Cloudflare", "GitLab", "Uber"].map((co, i) => (
              <motion.span key={co} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="px-4 py-2 rounded-full border border-fg/8 bg-surface text-sm text-fg hover:border-accent/20 transition-all">
                {co}
              </motion.span>
            ))}
          </div>
        </Reveal>
        <DidYouKnow>About 33% of all websites on the internet use nginx. It was built in 2004 specifically because Apache struggled under heavy traffic. nginx handles 10,000+ concurrent connections efficiently where Apache would slow to a crawl.</DidYouKnow>
        <H3>nginx vs Apache</H3>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-fg/10 bg-surface">
              <p className="font-mono font-bold text-fg mb-2">Apache (1995)</p>
              <ul className="text-sm text-fg-2 space-y-1">
                <li>• Each request gets its own thread</li>
                <li>• Gets slow under heavy traffic</li>
                <li>• More memory per connection</li>
                <li>• Easier config for beginners</li>
              </ul>
            </div>
            <div className="p-5 rounded-xl border-2 border-accent/15 bg-accent/5">
              <p className="font-mono font-bold text-accent mb-2">nginx (2004)</p>
              <ul className="text-sm text-fg-2 space-y-1">
                <li>• Event-driven, non-blocking</li>
                <li>• Handles thousands of connections</li>
                <li>• Far less memory</li>
                <li>• Built for production scale</li>
              </ul>
            </div>
          </div>
        </Reveal>
      </ArticleSection>

      {/* Section 6: What nginx can do */}
      <ArticleSection id="s6" ref={el => { sectionRefs.current[6] = el; }}>
        <SectionTitle title="What nginx Can Do" />
        <P className="text-lg mb-10">nginx is far more than a web server. Here are the 4 main roles it plays in production:</P>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {[
            {
              num: "01", title: "Serve Static Files", icon: "file-text",
              desc: "HTML, CSS, images, JavaScript. User requests index.html → nginx finds it and sends it back. Extremely fast — nginx is optimized for this.",
              color: "border-accent/15 bg-accent/5",
            },
            {
              num: "02", title: "Reverse Proxy", icon: "shuffle",
              desc: "Sits in front of your app. Receives all requests → forwards to your app → sends response back. Protects your app from direct internet exposure.",
              color: "border-danger/15 bg-danger/5",
            },
            {
              num: "03", title: "Load Balancer", icon: "scales",
              desc: "Spreads traffic across multiple servers. Server 1 gets request 1, Server 2 gets request 2. No single server gets overwhelmed.",
              color: "border-success/15 bg-success/5",
            },
            {
              num: "04", title: "SSL Termination", icon: "lock",
              desc: "Handles HTTPS encryption. Your app communicates in plain HTTP internally. nginx handles the security layer — the padlock in the browser.",
              color: "border-accent/25 bg-accent/10",
            },
          ].map((role, i) => (
            <Reveal key={role.num} delay={i * 0.1}>
              <div className={`p-6 rounded-2xl border-2 ${role.color} h-full`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{iconFor(role.icon, { size: 22 })}</span>
                  <div>
                    <span className="text-xs font-mono text-fg-3">{role.num}</span>
                    <p className="font-semibold text-fg">{role.title}</p>
                  </div>
                </div>
                <p className="text-sm text-fg-2">{role.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <KeyTakeaway>nginx + Docker is one of the most common production setups in the world. nginx handles incoming traffic and SSL, Docker containers run the actual app. Understanding both makes you dangerous as a DevOps engineer.</KeyTakeaway>
        <div className="mt-16">
          <Reveal>
            <Flashcards cards={flashcardsData} />
          </Reveal>
        </div>
      </ArticleSection>

      <Confetti isActive={showConfetti} />

    </article>
  );
}
