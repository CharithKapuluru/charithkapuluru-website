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
import { iconFor } from "@/components/ui/icons";

const sectionNames = [
  "What is $PATH?",
  "Folders in $PATH",
  "How PATH Works",
  "Running Your Scripts",
  "Modifying PATH",
  "nano — Terminal Editor",
];
const navSections = sectionNames.map((label, i) => ({ id: i, label }));

const flashcardsData = [
  { front: "What is $PATH?", back: "An environment variable — a colon-separated list of directories where Linux searches for commands when you type them. Run 'echo $PATH' to see yours." },
  { front: "Why can't Linux find my script?", back: "Your personal folder isn't in $PATH. Fix it with ./ (ex: ./myscript.sh), full path (/home/charith/scripts/myscript.sh), or add your folder to $PATH." },
  { front: "What does ./ mean?", back: "Look in the current directory. Since Linux doesn't search your current folder by default (security reason), ./ explicitly says 'the program is right HERE'." },
  { front: "How do you add a folder to $PATH?", back: "export PATH=\"$PATH:~/your-folder\" — the $PATH: part keeps existing folders, then adds yours. Never omit $PATH: or you break all other commands." },
  { front: "How do you make PATH permanent?", back: "Add it to ~/.bashrc: echo 'export PATH=\"$PATH:~/your-folder\"' >> ~/.bashrc — this file runs every time you open a new terminal session." },
  { front: "What is nano?", back: "A terminal text editor — like Notepad but inside the terminal. Open a file: nano filename.txt. Save: Ctrl+O. Exit: Ctrl+X. Essential for servers with no GUI." },
  { front: "Why does /usr/bin exist separately from /bin?", back: "/bin has essential commands needed even when /usr isn't mounted (early boot). /usr/bin has most regular user programs. Modern systems often symlink them, but the distinction is historical." },
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

const PathFolder = ({ path, desc, icon }: { path: string; desc: string; icon: string }) => (
  <Reveal>
    <div className="flex items-center gap-4 p-4 rounded-xl border border-fg/8 bg-surface hover:border-accent/20 hover:shadow-lg transition-all duration-300 group">
      <div className="text-2xl w-10 text-center">{iconFor(icon, { size: 22 })}</div>
      <div className="flex-1">
        <code className="font-mono text-accent text-sm font-bold">{path}</code>
        <p className="text-xs text-fg-2 mt-0.5">{desc}</p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 rounded-full bg-accent" />
      </div>
    </div>
  </Reveal>
);

export default function LinuxEnvironment() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useReadingNav(navSections, sectionRefs);

  return (
    <article>
      {/* Section 0: What is $PATH */}
      <ArticleSection id="s0" ref={el => { sectionRefs.current[0] = el; }}>
        <SectionTitle title="What is $PATH?" />
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
      </ArticleSection>

      {/* Section 1: Folders in $PATH */}
      <ArticleSection id="s1" ref={el => { sectionRefs.current[1] = el; }}>
        <SectionTitle title="Folders in $PATH" />
        <P className="text-lg mb-10">Each folder in $PATH has a specific purpose. Here&apos;s what you&apos;ll typically see on Ubuntu:</P>
        <div className="space-y-3 mb-10">
          <PathFolder path="/bin" desc="Essential commands for all users — ls, cp, mv, cat. Required for system operation." icon="storefront" />
          <PathFolder path="/sbin" desc="System admin tools — reboot, fsck, ip. Mostly for root/admin use." icon="wrench" />
          <PathFolder path="/usr/bin" desc="Most installed programs live here — git, python3, nano, curl." icon="shopping-cart" />
          <PathFolder path="/usr/sbin" desc="System programs for administration — useradd, iptables, sshd." icon="gear" />
          <PathFolder path="/usr/local/bin" desc="Software YOU installed manually (not via apt). Your personal tools." icon="buildings" />
          <PathFolder path="/usr/local/sbin" desc="Your own custom system administration tools." icon="key" />
        </div>
        <AnalogyBox>
          <strong>/bin</strong> = Ground floor essentials (pharmacy, grocery — things everyone needs)<br />
          <strong>/sbin</strong> = Manager&apos;s office (admin staff only)<br />
          <strong>/usr/bin</strong> = Regular shops (most apps you install)<br />
          <strong>/usr/local/bin</strong> = Pop-up shops (software you brought in yourself)
        </AnalogyBox>
        <DidYouKnow>On modern Ubuntu (22.04+), <Code>/bin</Code> and <Code>/usr/bin</Code> are actually the same folder — one is a symlink to the other. The separation is historical, from when /usr could be a separate disk.</DidYouKnow>
      </ArticleSection>

      {/* Section 2: How PATH Works */}
      <ArticleSection id="s2" ref={el => { sectionRefs.current[2] = el; }}>
        <SectionTitle title="How PATH Works" />
        <P className="text-lg mb-8">When you type a command, Linux walks through $PATH left-to-right, checking each folder until it finds the program or runs out of places to look.</P>
        <Reveal>
          <div className="rounded-2xl border border-fg/10 bg-surface overflow-hidden mb-8">
            <div className="px-6 py-4 bg-accent/5 border-b border-fg/8">
              <p className="font-mono text-sm text-fg font-semibold">You type: <span className="text-accent">ls</span></p>
            </div>
            <div className="p-6 space-y-3">
              {[
                { path: "/usr/local/sbin/ls", found: false },
                { path: "/usr/local/bin/ls", found: false },
                { path: "/usr/sbin/ls", found: false },
                { path: "/usr/bin/ls", found: true },
              ].map((item) => (
                <div
                  key={item.path}
                  className={`flex items-center justify-between p-3 rounded-lg font-mono text-sm ${item.found ? "bg-accent/10 border border-accent/20" : "bg-fg/3 border border-fg/5"}`}
                >
                  <span className={item.found ? "text-accent font-semibold" : "text-fg-2"}>{item.path}</span>
                  <span className={item.found ? "text-accent font-bold" : "text-fg/30"}>
                    {item.found ? "✓ Found! Run it." : "✗ No"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <P>If the command isn&apos;t found anywhere in $PATH, you get: <Code>command not found</Code>. The file might exist on your system — it&apos;s just not in a $PATH folder.</P>
        <KeyTakeaway>Linux never searches your entire filesystem. It ONLY looks in the specific folders listed in $PATH. This is both a performance optimization and a security feature.</KeyTakeaway>
      </ArticleSection>

      {/* Section 3: Running Your Scripts */}
      <ArticleSection id="s3" ref={el => { sectionRefs.current[3] = el; }}>
        <SectionTitle title="Running Your Scripts" />
        <P className="text-lg mb-8">Your personal scripts are usually in your home folder — which isn&apos;t in $PATH. You have three options:</P>
        <div className="space-y-6">
          {[
            { num: "01", title: "Use ./ (it's right HERE)", cmd: "sudo ./my-script.sh", desc: "./ means 'in the current directory'. The explicit address Linux needs." },
            { num: "02", title: "Full path", cmd: "sudo /home/charith/scripts/my-script.sh", desc: "Give Linux the exact location of the file, like a street address." },
            { num: "03", title: "Add your folder to $PATH", cmd: 'export PATH="$PATH:~/scripts"', desc: "Now you can type my-script.sh directly — Linux will find it." },
          ].map((opt) => (
            <Reveal key={opt.num}>
              <div className="rounded-2xl border border-fg/10 bg-surface p-6 hover:border-accent/20 hover:shadow-lg transition-all">
                <div className="flex items-start gap-5">
                  <span className="text-3xl font-bold text-accent/25">{opt.num}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-display text-fg font-semibold mb-2">{opt.title}</h3>
                    <code className="block font-mono text-sm text-accent bg-fg/4 rounded-lg px-4 py-2 mb-3">{opt.cmd}</code>
                    <p className="text-sm text-fg-2">{opt.desc}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </ArticleSection>

      {/* Section 4: Modifying PATH */}
      <ArticleSection id="s4" ref={el => { sectionRefs.current[4] = el; }}>
        <SectionTitle title="Modifying PATH" />
        <P className="text-lg mb-8">You can add folders to $PATH with the <Code>export</Code> command. But there&apos;s a critical detail that trips up beginners:</P>
        <Reveal>
          <Terminal lines={[
            { type: "comment", content: "CORRECT — appends your folder" },
            { type: "command", content: 'export PATH="$PATH:~/my-scripts"' },
            { type: "comment", content: "            ↑ keeps existing folders" },
            { type: "output", content: "" },
            { type: "comment", content: "DANGEROUS — replaces everything!" },
            { type: "command", content: 'export PATH="~/my-scripts"' },
            { type: "output", content: "bash: ls: command not found  ← oh no" },
          ]} />
        </Reveal>
        <WarningBox>
          If you forget <Code>$PATH:</Code> and write <Code>export PATH=&quot;~/my-scripts&quot;</Code>, Linux replaces the <em>entire</em> $PATH with just your folder. Suddenly <Code>ls</Code>, <Code>sudo</Code>, <Code>grep</Code> — everything stops working because Linux can&apos;t find them anymore.
        </WarningBox>
        <H3>Anatomy of the export command</H3>
        <Reveal>
          <div className="bg-terminal rounded-xl p-6 font-mono text-sm overflow-x-auto">
            <div className="text-white space-y-1">
              <p><span className="text-terminal-ok">export</span> <span className="text-terminal-accent">PATH</span>=<span className="text-terminal-accent">&quot;</span><span className="text-terminal-info">$PATH</span><span className="text-terminal-accent">:</span><span className="text-terminal-ok">~/my-scripts</span><span className="text-terminal-accent">&quot;</span></p>
              <p className="text-terminal-fg/60 text-xs mt-3">  └── OLD PATH ──┘ └─ NEW folder ─┘</p>
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
      </ArticleSection>

      {/* Section 5: nano */}
      <ArticleSection id="s5" ref={el => { sectionRefs.current[5] = el; }}>
        <SectionTitle title="nano — Your Terminal Text Editor" />
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
              { name: "nano", desc: "Beginner friendly. Controls shown at bottom. Use this.", tag: "Recommended" },
              { name: "vim", desc: "Powerful but has a steep learning curve. Modal editing (insert mode, command mode).", tag: "Advanced" },
              { name: "emacs", desc: "Extremely powerful. More of an IDE than an editor. Massive learning curve.", tag: "Expert" },
            ].map((e) => (
              <Reveal key={e.name}>
                <div className={`p-5 rounded-xl border ${e.tag === "Recommended" ? "border-accent/20 bg-accent/5" : "border-fg/10 bg-surface"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <code className="font-mono font-bold text-fg">{e.name}</code>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${e.tag === "Recommended" ? "bg-accent/15 text-accent" : "bg-fg/5 text-fg-3"}`}>{e.tag}</span>
                  </div>
                  <p className="text-sm text-fg-2">{e.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* Flashcards */}
        <div className="mt-16">
          <Reveal>
            <Flashcards cards={flashcardsData} />
          </Reveal>
        </div>
      </ArticleSection>
    </article>
  );
}
