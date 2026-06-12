"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import PhaseTimeline from "@/components/ui/PhaseTimeline";
import ProgressSidebar from "@/components/ui/ProgressSidebar";
import Terminal from "@/components/ui/Terminal";
import KeyTakeaway from "@/components/ui/KeyTakeaway";
import AnalogyBox from "@/components/ui/AnalogyBox";
import DidYouKnow from "@/components/ui/DidYouKnow";
import WarningBox from "@/components/ui/WarningBox";
import Collapsible from "@/components/ui/Collapsible";
import BeforeAfterComparison from "@/components/ui/BeforeAfterComparison";
import Quiz from "@/components/ui/Quiz";
import Flashcards from "@/components/ui/Flashcards";
import Confetti, { CelebrationMessage } from "@/components/ui/Confetti";
import SearchBar from "@/components/ui/SearchBar";

const phases = [
  { id: 0, label: "Overview" },
  { id: 1, label: "Linux" },
  { id: 2, label: "Bash" },
  { id: 3, label: "Processes" },
  { id: 4, label: "Network" },
  { id: 5, label: "Storage" },
  { id: 6, label: "Monitor" },
];

const phaseNames = [
  "Project Overview & Setup",
  "Linux Foundations",
  "Bash Scripting",
  "Process & Service Management",
  "Networking & Security",
  "Storage & Disk Management",
  "Monitoring & Alerting + Docker",
];

const LinuxSysAdminProject = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedPhase, setCelebratedPhase] = useState<number | null>(null);

  const scrollToPhase = (phaseId: number) => {
    phaseRefs.current[phaseId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = phaseRefs.current.length - 1; i >= 0; i--) {
        const ref = phaseRefs.current[i];
        if (ref && ref.offsetTop <= scrollPosition) {
          setCurrentPhase(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerCelebration = (phaseId: number) => {
    if (celebratedPhase !== phaseId) {
      setCelebratedPhase(phaseId);
      setShowConfetti(true);
      setShowCelebration(true);
    }
  };

  return (
    <div className="bg-bg-paper">
      {/* Global Components */}
      <SearchBar />
      <Confetti
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
      <CelebrationMessage
        isVisible={showCelebration}
        phaseName={
          celebratedPhase !== null
            ? `Phase ${celebratedPhase}: ${phaseNames[celebratedPhase]}`
            : ""
        }
        onClose={() => setShowCelebration(false)}
      />

      {/* Phase Timeline - Sticky at top */}
      <PhaseTimeline
        currentPhase={currentPhase}
        onPhaseClick={scrollToPhase}
        phases={phases}
      />

      {/* Progress Sidebar - Desktop only */}
      <ProgressSidebar
        currentPhase={currentPhase}
        onPhaseClick={scrollToPhase}
        phases={phases.map((p) => ({
          ...p,
          title: phaseNames[p.id],
        }))}
        projectSlug="linux-sysadmin"
      />

      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-6xl py-16 lg:mr-64">
        {/* ============================================================ */}
        {/* PHASE 0: Project Overview & Setup                            */}
        {/* ============================================================ */}
        <div
          ref={(el) => {
            phaseRefs.current[0] = el;
          }}
          data-phase="0"
          className="mb-16 scroll-mt-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Hero Section */}
            <h1 className="text-4xl md:text-5xl font-serif text-text-charcoal mb-4">
              Linux SysAdmin Deep Dive: Building a Production-Ready Server from
              Scratch
            </h1>
            <p className="text-xl text-text-taupe mb-2 font-serif italic">
              From blank Ubuntu VM to fully monitored, hardened, Dockerized
              server
            </p>
            <p className="text-lg text-text-taupe leading-relaxed mb-8">
              This project documents my journey of setting up an Ubuntu Server
              24.04 ARM64 virtual machine on UTM (MacBook Air), then
              systematically learning and applying every fundamental Linux
              sysadmin skill: filesystem navigation, user management, bash
              scripting, process control, networking, security hardening, disk
              management, monitoring, and Docker. Every phase includes real
              scripts I wrote, real terminal output, and real lessons learned.
            </p>

            {/* Before/After Comparison */}
            <BeforeAfterComparison
              title="Before vs. After This Project"
              rows={[
                {
                  before: "Afraid of the terminal",
                  after: "Comfortable navigating any Linux system",
                },
                {
                  before: "No idea how permissions work",
                  after: "Can audit and fix file permissions confidently",
                },
                {
                  before: "Copy-paste bash commands",
                  after: "Write production-ready bash scripts from scratch",
                },
                {
                  before: "No understanding of systemd",
                  after: "Create and manage custom systemd services",
                },
                {
                  before: "Server security is a mystery",
                  after: "Hardened SSH, firewall rules, fail2ban setup",
                },
                {
                  before: "No disk management knowledge",
                  after: "LVM, inode monitoring, swap management",
                },
                {
                  before: "No monitoring or alerting",
                  after: "Automated metrics collection and threshold alerts",
                },
                {
                  before: "Docker is just a buzzword",
                  after: "Build images, run containers, port mapping",
                },
              ]}
            />

            {/* Tech Stack Grid */}
            <div className="my-12">
              <h2 className="text-2xl font-serif text-text-charcoal mb-6">
                Technologies Used
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    name: "Ubuntu Server",
                    desc: "24.04 LTS ARM64",
                    icon: "🐧",
                  },
                  {
                    name: "Bash",
                    desc: "Shell scripting",
                    icon: "📜",
                  },
                  {
                    name: "SSH",
                    desc: "Secure remote access",
                    icon: "🔐",
                  },
                  {
                    name: "UFW",
                    desc: "Firewall management",
                    icon: "🛡",
                  },
                  {
                    name: "systemd",
                    desc: "Service management",
                    icon: "⚙️",
                  },
                  {
                    name: "Docker",
                    desc: "Containerization",
                    icon: "🐳",
                  },
                  {
                    name: "cron",
                    desc: "Task scheduling",
                    icon: "⏰",
                  },
                  {
                    name: "LVM",
                    desc: "Logical Volume Manager",
                    icon: "💾",
                  },
                ].map((tech) => (
                  <div
                    key={tech.name}
                    className="p-4 bg-bg-cream/60 border border-text-charcoal/10 rounded-lg text-center hover:shadow-md transition-shadow"
                  >
                    <div className="text-3xl mb-2">{tech.icon}</div>
                    <h3 className="font-serif text-text-charcoal font-semibold">
                      {tech.name}
                    </h3>
                    <p className="text-sm text-text-taupe">{tech.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Environment Info */}
            <div className="my-8 p-6 bg-gradient-to-r from-accent-sage/[0.07] via-bg-paper to-accent-moss/[0.05] border border-text-charcoal/10 rounded-lg">
              <h3 className="text-xl font-serif text-text-charcoal mb-3">
                Lab Environment
              </h3>
              <ul className="text-text-taupe space-y-2">
                <li>
                  <strong>OS:</strong> Ubuntu Server 24.04 LTS (ARM64)
                </li>
                <li>
                  <strong>Hypervisor:</strong> UTM on MacBook Air (Apple
                  Silicon)
                </li>
                <li>
                  <strong>Connection:</strong> SSH from macOS terminal into the
                  VM
                </li>
                <li>
                  <strong>Username:</strong> charith
                </li>
                <li>
                  <strong>IP Address:</strong> 192.168.64.3
                </li>
              </ul>
            </div>

            {/* Terminal: SSH Connection */}
            <Terminal
              title="Connecting to the Server"
              lines={[
                {
                  type: "comment",
                  content: "SSH into the Ubuntu VM from macOS",
                },
                { type: "command", content: "ssh charith@192.168.64.3" },
                {
                  type: "output",
                  content:
                    "Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-31-generic aarch64)",
                },
                { type: "output", content: "" },
                {
                  type: "output",
                  content:
                    " * Documentation:  https://help.ubuntu.com",
                },
                {
                  type: "output",
                  content:
                    " * Management:     https://landscape.canonical.com",
                },
                { type: "output", content: "" },
                {
                  type: "output",
                  content: "Last login: Mon Mar 15 09:42:11 2026 from 192.168.64.1",
                },
                { type: "command", content: "whoami" },
                { type: "output", content: "charith" },
                { type: "command", content: "hostname" },
                { type: "output", content: "ubuntu-server" },
                { type: "command", content: "uname -a" },
                {
                  type: "output",
                  content:
                    "Linux ubuntu-server 6.8.0-31-generic #31-Ubuntu SMP aarch64 GNU/Linux",
                },
              ]}
              autoPlay
            />

            <KeyTakeaway variant="green">
              The entire project runs on a headless Ubuntu Server VM with no
              GUI. Everything is done through SSH and the command line. This is
              how real servers work in production — there is no desktop
              environment, just a terminal.
            </KeyTakeaway>
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* PHASE 1: Linux Foundations                                    */}
        {/* ============================================================ */}
        <div
          ref={(el) => {
            phaseRefs.current[1] = el;
          }}
          data-phase="1"
          className="mb-16 scroll-mt-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-accent-sage/[0.07] via-bg-paper to-accent-moss/[0.05] p-8 rounded-xl"
          >
            <h2 className="text-3xl font-serif text-text-charcoal mb-4">
              Phase 1: Linux Foundations
            </h2>
            <p className="text-lg text-text-taupe leading-relaxed mb-6">
              Before you can manage a Linux server, you need to understand its
              foundations: the filesystem hierarchy, user and group management,
              file permissions, and the package management system. This phase
              explores all of these through hands-on scripts and exercises.
            </p>

            {/* Filesystem Exploration Terminal */}
            <Terminal
              title="Exploring the Linux Filesystem"
              lines={[
                {
                  type: "comment",
                  content: "See the top-level directories",
                },
                { type: "command", content: "ls /" },
                {
                  type: "output",
                  content:
                    "bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run  sbin  snap  srv  sys  tmp  usr  var",
                },
                {
                  type: "comment",
                  content: "Configuration files live in /etc",
                },
                { type: "command", content: "ls /etc | head -10" },
                {
                  type: "output",
                  content:
                    "adduser.conf\nalternatives\napt\nbash.bashrc\ncron.d\ncrontab\ndefault\nenvironment\nfstab\ngroup",
                },
                {
                  type: "comment",
                  content: "System logs live in /var/log",
                },
                { type: "command", content: "ls /var/log | head -8" },
                {
                  type: "output",
                  content:
                    "alternatives.log\nauth.log\nboot.log\ndpkg.log\nkern.log\nlastlog\nsyslog\nufw.log",
                },
                {
                  type: "comment",
                  content: "Check disk usage of top-level dirs",
                },
                { type: "command", content: "du -sh /* 2>/dev/null | sort -rh | head -5" },
                {
                  type: "output",
                  content:
                    "2.1G\t/usr\n512M\t/var\n128M\t/boot\n64M\t/lib\n12M\t/etc",
                },
              ]}
            />

            <AnalogyBox icon="🏙️">
              Think of the Linux filesystem like a city — <code>/etc</code> is
              the city hall (all the configuration), <code>/var/log</code> is
              the security cameras (all the logs), <code>/home</code> is the
              residential area, and <code>/tmp</code> is a whiteboard that gets
              erased each night.
            </AnalogyBox>

            {/* Script: filesystem-report.sh */}
            <Collapsible
              title="filesystem-report.sh — Map the Entire Filesystem"
              index={0}
            >
              <p className="text-text-taupe mb-4">
                This script generates a comprehensive report of the filesystem:
                disk usage per directory, largest files, recently modified config
                files, and open file descriptors. It is the first script I wrote
                to get a feel for what lives where on a Linux system.
              </p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4">
                {`#!/bin/bash
# filesystem-report.sh — Generate a filesystem overview report
set -euo pipefail

echo "=== Disk Usage by Top-Level Directory ==="
du -sh /* 2>/dev/null | sort -rh | head -10

echo ""
echo "=== Top 10 Largest Files ==="
find / -type f -exec du -h {} + 2>/dev/null | sort -rh | head -10

echo ""
echo "=== Recently Modified Config Files (last 24h) ==="
find /etc -type f -mtime -1 -ls 2>/dev/null

echo ""
echo "=== Mount Points ==="
df -hT | grep -v tmpfs

echo ""
echo "=== Open File Descriptors ==="
echo "Total open FDs: $(cat /proc/sys/fs/file-nr | awk '{print $1}')"
echo "Max allowed FDs: $(cat /proc/sys/fs/file-nr | awk '{print $3}')"
echo ""
echo "Report generated at: $(date)"
`}
              </pre>
              <Terminal
                title="Running filesystem-report.sh"
                lines={[
                  {
                    type: "command",
                    content: "chmod +x filesystem-report.sh && ./filesystem-report.sh",
                  },
                  {
                    type: "output",
                    content: "=== Disk Usage by Top-Level Directory ===",
                  },
                  { type: "output", content: "2.1G\t/usr" },
                  { type: "output", content: "512M\t/var" },
                  { type: "output", content: "128M\t/boot" },
                  { type: "output", content: "" },
                  {
                    type: "output",
                    content: "=== Top 10 Largest Files ===",
                  },
                  {
                    type: "output",
                    content: "48M\t/usr/lib/firmware/amdgpu/gc_11_0_0_mes.bin",
                  },
                  { type: "output", content: "" },
                  {
                    type: "output",
                    content: "=== Open File Descriptors ===",
                  },
                  { type: "output", content: "Total open FDs: 1248" },
                  { type: "output", content: "Max allowed FDs: 9223372036854775807" },
                ]}
              />
            </Collapsible>

            {/* Script: create-dev-user.sh */}
            <Collapsible
              title="create-dev-user.sh — User & Group Management"
              index={1}
            >
              <p className="text-text-taupe mb-4">
                This script demonstrates creating users, assigning groups,
                setting up home directories, and configuring sudo access. On a
                real server, user management is one of the most critical tasks —
                every person who accesses the server needs their own account with
                appropriate permissions.
              </p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4">
                {`#!/bin/bash
# create-dev-user.sh — Create a new developer user with proper setup
set -euo pipefail

USERNAME=\${1:?"Usage: $0 <username>"}

echo "[1/5] Creating user: $USERNAME"
sudo useradd -m -s /bin/bash "$USERNAME"

echo "[2/5] Setting temporary password"
echo "$USERNAME:changeme123" | sudo chpasswd
sudo passwd -e "$USERNAME"  # Force password change on first login

echo "[3/5] Adding to groups"
sudo usermod -aG sudo,docker "$USERNAME"

echo "[4/5] Setting up SSH directory"
sudo mkdir -p /home/$USERNAME/.ssh
sudo chmod 700 /home/$USERNAME/.ssh
sudo touch /home/$USERNAME/.ssh/authorized_keys
sudo chmod 600 /home/$USERNAME/.ssh/authorized_keys
sudo chown -R $USERNAME:$USERNAME /home/$USERNAME/.ssh

echo "[5/5] Verifying user"
id "$USERNAME"
echo "Home directory: $(ls -la /home/$USERNAME)"
echo "User $USERNAME created successfully!"
`}
              </pre>
              <Terminal
                title="Running create-dev-user.sh"
                lines={[
                  {
                    type: "command",
                    content: "sudo ./create-dev-user.sh developer1",
                  },
                  {
                    type: "output",
                    content: "[1/5] Creating user: developer1",
                  },
                  {
                    type: "output",
                    content: "[2/5] Setting temporary password",
                  },
                  {
                    type: "output",
                    content: "[3/5] Adding to groups",
                  },
                  {
                    type: "output",
                    content: "[4/5] Setting up SSH directory",
                  },
                  {
                    type: "output",
                    content: "[5/5] Verifying user",
                  },
                  {
                    type: "output",
                    content:
                      "uid=1001(developer1) gid=1001(developer1) groups=1001(developer1),27(sudo),998(docker)",
                  },
                  {
                    type: "output",
                    content: "User developer1 created successfully!",
                  },
                ]}
              />
            </Collapsible>

            {/* Script: permission-audit.sh */}
            <Collapsible
              title="permission-audit.sh — File Permission Auditing"
              index={2}
            >
              <p className="text-text-taupe mb-4">
                Permissions are the backbone of Linux security. This script
                audits the system for common permission mistakes: world-writable
                files, SUID/SGID binaries, files without owners, and insecure
                home directories. Running this on a production server can reveal
                serious security holes.
              </p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4">
                {`#!/bin/bash
# permission-audit.sh — Audit file permissions for security issues
set -euo pipefail

echo "=== PERMISSION AUDIT REPORT ==="
echo "Date: $(date)"
echo ""

echo "[1] World-writable files (excluding /tmp, /proc, /sys):"
find / -xdev -type f -perm -0002 2>/dev/null | head -20
echo ""

echo "[2] SUID binaries (can run as owner):"
find / -xdev -type f -perm -4000 2>/dev/null
echo ""

echo "[3] SGID binaries (can run as group):"
find / -xdev -type f -perm -2000 2>/dev/null
echo ""

echo "[4] Files with no owner:"
find / -xdev -nouser -o -nogroup 2>/dev/null | head -10
echo ""

echo "[5] Home directory permissions:"
for dir in /home/*/; do
    user=$(basename "$dir")
    perms=$(stat -c "%a" "$dir")
    echo "  $user: $perms (should be 750 or 700)"
done
`}
              </pre>
              <Terminal
                title="Running permission-audit.sh"
                lines={[
                  {
                    type: "command",
                    content: "sudo ./permission-audit.sh",
                  },
                  {
                    type: "output",
                    content: "=== PERMISSION AUDIT REPORT ===",
                  },
                  {
                    type: "output",
                    content: "[1] World-writable files:",
                  },
                  { type: "output", content: "(none found - good!)" },
                  { type: "output", content: "" },
                  {
                    type: "output",
                    content: "[2] SUID binaries (can run as owner):",
                  },
                  { type: "output", content: "/usr/bin/sudo" },
                  { type: "output", content: "/usr/bin/passwd" },
                  { type: "output", content: "/usr/bin/chfn" },
                  { type: "output", content: "" },
                  {
                    type: "output",
                    content: "[5] Home directory permissions:",
                  },
                  {
                    type: "output",
                    content: "  charith: 755 (should be 750 or 700)",
                  },
                ]}
              />
            </Collapsible>

            {/* Script: system-update.sh */}
            <Collapsible
              title="system-update.sh — Safe Package Updates"
              index={3}
            >
              <p className="text-text-taupe mb-4">
                Keeping packages updated is one of the most important sysadmin
                tasks. This script automates updates safely: it creates a
                snapshot list of installed packages before updating, runs the
                update, logs everything, and reports what changed.
              </p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4">
                {`#!/bin/bash
# system-update.sh — Safe, logged system update
set -euo pipefail

LOG="/var/log/system-update-$(date +%Y%m%d).log"

echo "=== System Update Starting ===" | tee "$LOG"
echo "Date: $(date)" | tee -a "$LOG"

echo "[1/4] Saving current package list..." | tee -a "$LOG"
dpkg --get-selections > /tmp/packages-before.txt

echo "[2/4] Updating package index..." | tee -a "$LOG"
sudo apt update 2>&1 | tee -a "$LOG"

echo "[3/4] Upgrading packages..." | tee -a "$LOG"
sudo apt upgrade -y 2>&1 | tee -a "$LOG"

echo "[4/4] Cleaning up..." | tee -a "$LOG"
sudo apt autoremove -y 2>&1 | tee -a "$LOG"

echo ""
echo "Packages upgraded:" | tee -a "$LOG"
diff /tmp/packages-before.txt <(dpkg --get-selections) || true
echo "Log saved to: $LOG"
`}
              </pre>
              <Terminal
                title="Running system-update.sh"
                lines={[
                  {
                    type: "command",
                    content: "sudo ./system-update.sh",
                  },
                  {
                    type: "output",
                    content: "=== System Update Starting ===",
                  },
                  {
                    type: "output",
                    content: "[1/4] Saving current package list...",
                  },
                  {
                    type: "output",
                    content: "[2/4] Updating package index...",
                  },
                  {
                    type: "output",
                    content: "Hit:1 http://ports.ubuntu.com/ubuntu-ports noble InRelease",
                  },
                  {
                    type: "output",
                    content: "12 packages can be upgraded.",
                  },
                  {
                    type: "output",
                    content: "[3/4] Upgrading packages...",
                  },
                  {
                    type: "output",
                    content: "12 upgraded, 0 newly installed, 0 to remove.",
                  },
                  {
                    type: "output",
                    content: "[4/4] Cleaning up...",
                  },
                  {
                    type: "output",
                    content: "Log saved to: /var/log/system-update-20260315.log",
                  },
                ]}
              />
            </Collapsible>

            <KeyTakeaway variant="yellow">
              <strong>Permissions matter more than you think.</strong>{" "}
              <code>chmod</code> changes file permissions, <code>chown</code>{" "}
              changes file ownership. SUID (Set User ID) lets a file run as its
              owner — that is why <code>/usr/bin/passwd</code> can modify{" "}
              <code>/etc/shadow</code> even when run by a normal user. SGID
              works the same way but for group permissions. Always audit SUID
              binaries on production servers.
            </KeyTakeaway>

            <WarningBox>
              <strong>Never use <code>chmod 777</code> on any file.</strong>{" "}
              This gives read, write, and execute permissions to everyone on the
              system. It is the equivalent of leaving your front door wide open
              with a sign that says &quot;come on in.&quot; If you see 777
              permissions in production, treat it as a security incident.
            </WarningBox>

            <DidYouKnow>
              The Linux filesystem starts at <code>/</code> (called
              &quot;root&quot;). Unlike Windows, there are no drive letters like
              C: or D:. Everything, including external drives and network
              shares, is mounted somewhere under this single tree. The command{" "}
              <code>mount</code> shows you where every device is attached.
            </DidYouKnow>
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* PHASE 2: Bash Scripting                                      */}
        {/* ============================================================ */}
        <div
          ref={(el) => {
            phaseRefs.current[2] = el;
          }}
          data-phase="2"
          className="mb-16 scroll-mt-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-bg-cream via-bg-paper to-accent-sand/[0.05] p-8 rounded-xl"
          >
            <h2 className="text-3xl font-serif text-text-charcoal mb-4">
              Phase 2: Bash Scripting
            </h2>
            <p className="text-lg text-text-taupe leading-relaxed mb-6">
              Bash scripting is the duct tape of system administration. It lets
              you automate repetitive tasks, build monitoring tools, and chain
              commands together into powerful workflows. In this phase, I moved
              beyond running individual commands and started building real tools
              — a log analyzer, a backup system, and a live system monitor.
            </p>

            {/* Basic Bash Concepts Terminal */}
            <Terminal
              title="Bash Basics: Variables, Loops, Functions"
              lines={[
                {
                  type: "comment",
                  content: "Variables — no spaces around the =",
                },
                { type: "command", content: 'NAME="charith"' },
                { type: "command", content: 'echo "Hello, $NAME"' },
                { type: "output", content: "Hello, charith" },
                { type: "comment", content: "Loops — iterate over items" },
                {
                  type: "command",
                  content:
                    'for service in ssh ufw cron; do systemctl is-active $service; done',
                },
                { type: "output", content: "active" },
                { type: "output", content: "active" },
                { type: "output", content: "active" },
                {
                  type: "comment",
                  content: "Functions — reusable blocks of code",
                },
                {
                  type: "command",
                  content:
                    'check_disk() { usage=$(df / | tail -1 | awk \'{print $5}\'); echo "Disk: $usage"; }',
                },
                { type: "command", content: "check_disk" },
                { type: "output", content: "Disk: 42%" },
                {
                  type: "comment",
                  content: "Command substitution — capture output",
                },
                {
                  type: "command",
                  content: 'UPTIME=$(uptime -p); echo "Server $UPTIME"',
                },
                {
                  type: "output",
                  content: "Server up 3 days, 14 hours, 22 minutes",
                },
              ]}
            />

            <AnalogyBox icon="📖">
              A bash script is like a recipe — you write the steps once, and the
              chef (Linux) follows them exactly every time. Variables are your
              ingredients, functions are cooking techniques, and pipes are like
              passing a dish from one chef to the next for additional
              preparation.
            </AnalogyBox>

            {/* Script: log-analyzer.sh */}
            <Collapsible
              title="log-analyzer.sh — Parse and Analyze System Logs"
              index={4}
            >
              <p className="text-text-taupe mb-4">
                This script analyzes <code>/var/log/auth.log</code> and{" "}
                <code>/var/log/syslog</code> to find failed login attempts, top
                IP addresses hitting the server, error patterns, and SSH session
                durations. It uses the classic Unix pipeline:{" "}
                <code>grep | sort | uniq -c | sort -rn | head</code>.
              </p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4">
                {`#!/bin/bash
# log-analyzer.sh — Analyze system logs for security and errors
set -euo pipefail

AUTH_LOG="/var/log/auth.log"
SYS_LOG="/var/log/syslog"

echo "=== LOG ANALYSIS REPORT ==="
echo "Generated: $(date)"
echo ""

echo "--- Failed SSH Login Attempts ---"
grep "Failed password" "$AUTH_LOG" 2>/dev/null | \\
  awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head -10
echo ""

echo "--- Top 10 IPs in Auth Log ---"
grep -oP '\\d+\\.\\d+\\.\\d+\\.\\d+' "$AUTH_LOG" 2>/dev/null | \\
  sort | uniq -c | sort -rn | head -10
echo ""

echo "--- Error Count by Service (syslog) ---"
grep -i "error" "$SYS_LOG" 2>/dev/null | \\
  awk -F'[][]' '{print $1}' | awk '{print $5}' | \\
  sort | uniq -c | sort -rn | head -10
echo ""

echo "--- SSH Sessions Today ---"
grep "session opened" "$AUTH_LOG" 2>/dev/null | \\
  grep "$(date +%b' '%e)" | wc -l
echo "active sessions found"
`}
              </pre>
              <Terminal
                title="Running log-analyzer.sh"
                lines={[
                  { type: "command", content: "sudo ./log-analyzer.sh" },
                  {
                    type: "output",
                    content: "=== LOG ANALYSIS REPORT ===",
                  },
                  {
                    type: "output",
                    content: "--- Failed SSH Login Attempts ---",
                  },
                  { type: "output", content: "     14 192.168.64.1" },
                  { type: "output", content: "      3 10.0.0.55" },
                  { type: "output", content: "" },
                  {
                    type: "output",
                    content: "--- Top 10 IPs in Auth Log ---",
                  },
                  { type: "output", content: "    142 192.168.64.1" },
                  { type: "output", content: "     28 192.168.64.3" },
                  { type: "output", content: "" },
                  {
                    type: "output",
                    content: "--- SSH Sessions Today ---",
                  },
                  { type: "output", content: "4 active sessions found" },
                ]}
              />
            </Collapsible>

            {/* Script: backup-tool.sh */}
            <Collapsible
              title="backup-tool.sh — Incremental Backups with rsync"
              index={5}
            >
              <p className="text-text-taupe mb-4">
                This script uses <code>rsync</code> with{" "}
                <code>--link-dest</code> to create space-efficient incremental
                backups. Unchanged files are hard-linked to the previous backup
                instead of being copied again, so each backup appears to be a
                full copy but only uses disk space for files that actually
                changed. It also implements automatic rotation to keep only the
                last 7 backups.
              </p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4">
                {`#!/bin/bash
# backup-tool.sh — Incremental backups with rsync and rotation
set -euo pipefail

SOURCE="/home/charith/projects"
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
CURRENT="$BACKUP_DIR/$TIMESTAMP"
LATEST="$BACKUP_DIR/latest"
MAX_BACKUPS=7

echo "=== Backup Starting ==="
echo "Source: $SOURCE"
echo "Destination: $CURRENT"

# Create incremental backup using hard links
if [ -L "$LATEST" ]; then
    rsync -avh --delete --link-dest="$LATEST" "$SOURCE/" "$CURRENT/"
else
    rsync -avh "$SOURCE/" "$CURRENT/"
fi

# Update the 'latest' symlink
rm -f "$LATEST"
ln -s "$CURRENT" "$LATEST"

# Rotate: keep only last N backups
cd "$BACKUP_DIR"
ls -dt */ | tail -n +$((MAX_BACKUPS + 1)) | xargs rm -rf

echo "=== Backup Complete ==="
du -sh "$CURRENT"
`}
              </pre>
              <Terminal
                title="Running backup-tool.sh"
                lines={[
                  {
                    type: "command",
                    content: "sudo ./backup-tool.sh",
                  },
                  {
                    type: "output",
                    content: "=== Backup Starting ===",
                  },
                  {
                    type: "output",
                    content: "Source: /home/charith/projects",
                  },
                  {
                    type: "output",
                    content: "Destination: /backups/20260315-143022",
                  },
                  {
                    type: "output",
                    content: "sending incremental file list",
                  },
                  {
                    type: "output",
                    content: "scripts/log-analyzer.sh",
                  },
                  {
                    type: "output",
                    content: "scripts/new-script.sh",
                  },
                  {
                    type: "output",
                    content: "=== Backup Complete ===",
                  },
                  {
                    type: "output",
                    content: "2.4M\t/backups/20260315-143022",
                  },
                ]}
              />
            </Collapsible>

            {/* Script: system-monitor.sh */}
            <Collapsible
              title="system-monitor.sh — Live Dashboard with Color-Coded Thresholds"
              index={6}
            >
              <p className="text-text-taupe mb-4">
                This script creates a live terminal dashboard that refreshes
                every 5 seconds, showing CPU usage, memory, disk, top processes,
                and network connections. Values are color-coded: green means
                healthy, yellow means warning, and red means critical. It uses
                ANSI escape codes for colors and <code>tput</code> for cursor
                control.
              </p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4">
                {`#!/bin/bash
# system-monitor.sh — Live color-coded system dashboard
set -euo pipefail

RED='\\033[0;31m'; YELLOW='\\033[1;33m'
GREEN='\\033[0;32m'; NC='\\033[0m'

colorize() {
    local val=$1 warn=$2 crit=$3
    if (( val >= crit )); then echo -e "\${RED}\${val}%\${NC}"
    elif (( val >= warn )); then echo -e "\${YELLOW}\${val}%\${NC}"
    else echo -e "\${GREEN}\${val}%\${NC}"; fi
}

while true; do
    clear
    echo "====== SYSTEM MONITOR ======"
    echo "Host: $(hostname) | Time: $(date +%H:%M:%S)"
    echo ""

    CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print int($2)}')
    echo -e "CPU Usage: $(colorize $CPU 70 90)"

    MEM=$(free | awk '/Mem:/ {printf "%d", $3/$2*100}')
    echo -e "Memory:    $(colorize $MEM 80 95)"

    DISK=$(df / | tail -1 | awk '{print int($5)}')
    echo -e "Disk /:    $(colorize $DISK 80 95)"

    echo ""
    echo "--- Top 5 Processes (by CPU) ---"
    ps aux --sort=-%cpu | head -6

    echo ""
    echo "--- Network Connections ---"
    ss -tuln | head -10

    sleep 5
done
`}
              </pre>
              <Terminal
                title="system-monitor.sh Output"
                lines={[
                  { type: "command", content: "./system-monitor.sh" },
                  {
                    type: "output",
                    content: "====== SYSTEM MONITOR ======",
                  },
                  {
                    type: "output",
                    content: "Host: ubuntu-server | Time: 14:32:05",
                  },
                  { type: "output", content: "" },
                  { type: "output", content: "CPU Usage: 12% (green)" },
                  { type: "output", content: "Memory:    45% (green)" },
                  { type: "output", content: "Disk /:    42% (green)" },
                  { type: "output", content: "" },
                  {
                    type: "output",
                    content: "--- Top 5 Processes (by CPU) ---",
                  },
                  {
                    type: "output",
                    content:
                      "charith   1234  2.1  0.4 system-monitor.sh",
                  },
                  {
                    type: "output",
                    content:
                      "root         1  0.0  0.3 /sbin/init",
                  },
                ]}
              />
            </Collapsible>

            <KeyTakeaway variant="blue">
              <strong>
                Always start your scripts with{" "}
                <code>set -euo pipefail</code>.
              </strong>{" "}
              This is your safety net. <code>-e</code> exits on any error,{" "}
              <code>-u</code> treats unset variables as errors, and{" "}
              <code>-o pipefail</code> catches failures in piped commands.
              Without this, a script can silently fail halfway through and keep
              running, causing real damage on a production server.
            </KeyTakeaway>

            <DidYouKnow>
              The Unix pipeline concept (<code>cmd1 | cmd2 | cmd3</code>) is one
              of the most powerful ideas in computing. Each command does one
              small thing well, and the pipe connects them. For example,{" "}
              <code>grep &quot;error&quot; syslog | sort | uniq -c | sort -rn | head -5</code>{" "}
              finds errors, sorts them, counts unique entries, sorts by count,
              and shows the top 5 — all in a single line. This &quot;small tools
              connected by pipes&quot; philosophy is the Unix Way.
            </DidYouKnow>
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* PHASE 3: Process & Service Management                        */}
        {/* ============================================================ */}
        <div
          ref={(el) => {
            phaseRefs.current[3] = el;
          }}
          data-phase="3"
          className="mb-16 scroll-mt-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-accent-sage/[0.07] via-bg-paper to-accent-moss/[0.05] p-8 rounded-xl"
          >
            <h2 className="text-3xl font-serif text-text-charcoal mb-4">
              Phase 3: Process & Service Management
            </h2>
            <p className="text-lg text-text-taupe leading-relaxed mb-6">
              Everything running on a Linux system is a process. Understanding
              how processes work, how to inspect them, how to manage them with
              systemd, and how to troubleshoot stuck or zombie processes is
              essential for any sysadmin. This phase covers the entire lifecycle:
              from PID 1 (systemd) to creating your own custom services.
            </p>

            <AnalogyBox icon="👨‍🍳">
              A process is like a chef cooking — the program is the recipe book
              on the shelf, but a process is a chef actively cooking from that
              recipe. PID is the chef&apos;s employee badge number. You can have
              multiple chefs cooking from the same recipe (multiple processes
              from the same program), and each has their own badge number.
            </AnalogyBox>

            {/* Process Inspection Terminal */}
            <Terminal
              title="Inspecting Processes and Services"
              lines={[
                {
                  type: "comment",
                  content: "View all running processes",
                },
                { type: "command", content: "ps aux | head -8" },
                {
                  type: "output",
                  content:
                    "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND",
                },
                {
                  type: "output",
                  content:
                    "root         1  0.0  0.3  22084 13212 ?        Ss   09:00   0:02 /sbin/init",
                },
                {
                  type: "output",
                  content:
                    "root         2  0.0  0.0      0     0 ?        S    09:00   0:00 [kthreadd]",
                },
                {
                  type: "output",
                  content:
                    "root       512  0.0  0.1   8376  5692 ?        Ss   09:00   0:00 /usr/sbin/sshd",
                },
                {
                  type: "output",
                  content:
                    "charith   1089  0.0  0.1   9124  4876 pts/0    Ss   10:15   0:00 -bash",
                },
                {
                  type: "comment",
                  content: "View process tree (parent-child relationships)",
                },
                { type: "command", content: "pstree -p | head -12" },
                {
                  type: "output",
                  content: "systemd(1)─┬─cron(498)",
                },
                {
                  type: "output",
                  content: "           ├─sshd(512)───sshd(1087)───bash(1089)───pstree(1234)",
                },
                {
                  type: "output",
                  content: "           ├─systemd-journal(234)",
                },
                {
                  type: "output",
                  content: "           └─ufw(501)",
                },
                {
                  type: "comment",
                  content: "Check a specific service status",
                },
                {
                  type: "command",
                  content: "systemctl status ssh",
                },
                {
                  type: "output",
                  content:
                    "● ssh.service - OpenBSD Secure Shell server",
                },
                {
                  type: "output",
                  content:
                    "     Loaded: loaded (/lib/systemd/system/ssh.service; enabled)",
                },
                {
                  type: "output",
                  content: "     Active: active (running) since Mon 2026-03-15 09:00:12 UTC",
                },
                {
                  type: "output",
                  content:
                    "   Main PID: 512 (sshd)",
                },
              ]}
            />

            {/* Script: process-investigator.sh */}
            <Collapsible
              title="process-investigator.sh — Deep Dive into Any Process"
              index={7}
            >
              <p className="text-text-taupe mb-4">
                This script takes a PID as input and provides a complete
                investigation: the command that started it, its parent process,
                open file descriptors, network connections, environment
                variables, memory maps, and CPU/memory usage. It reads directly
                from the <code>/proc</code> filesystem, which is the kernel&apos;s
                window into every running process.
              </p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4">
                {`#!/bin/bash
# process-investigator.sh — Deep dive into a running process
set -euo pipefail

PID=\${1:?"Usage: $0 <PID>"}

if [ ! -d "/proc/$PID" ]; then
    echo "Error: Process $PID does not exist"
    exit 1
fi

echo "=== PROCESS INVESTIGATION: PID $PID ==="
echo ""

echo "[1] Command:"
cat /proc/$PID/cmdline | tr '\\0' ' '
echo ""

echo "[2] Status:"
head -10 /proc/$PID/status
echo ""

echo "[3] Open File Descriptors:"
ls -la /proc/$PID/fd 2>/dev/null | tail -5
echo "(Total: $(ls /proc/$PID/fd 2>/dev/null | wc -l))"
echo ""

echo "[4] Network Connections:"
ss -tlnp | grep "pid=$PID" || echo "No network connections"
echo ""

echo "[5] Environment Variables (first 5):"
cat /proc/$PID/environ 2>/dev/null | tr '\\0' '\\n' | head -5
echo ""

echo "[6] Memory Usage:"
awk '/VmRSS|VmSize/ {print $0}' /proc/$PID/status
`}
              </pre>
              <Terminal
                title="Investigating the SSH daemon"
                lines={[
                  {
                    type: "command",
                    content: "sudo ./process-investigator.sh 512",
                  },
                  {
                    type: "output",
                    content: "=== PROCESS INVESTIGATION: PID 512 ===",
                  },
                  { type: "output", content: "" },
                  { type: "output", content: "[1] Command:" },
                  { type: "output", content: "/usr/sbin/sshd -D" },
                  { type: "output", content: "" },
                  {
                    type: "output",
                    content: "[3] Open File Descriptors:",
                  },
                  {
                    type: "output",
                    content: "lr-x------ 1 root root 64 ... 0 -> /dev/null",
                  },
                  {
                    type: "output",
                    content: "lrwx------ 1 root root 64 ... 3 -> socket:[18423]",
                  },
                  { type: "output", content: "(Total: 5)" },
                  { type: "output", content: "" },
                  {
                    type: "output",
                    content: "[4] Network Connections:",
                  },
                  {
                    type: "output",
                    content: "LISTEN  0  128  0.0.0.0:22  0.0.0.0:*  users:((\"sshd\",pid=512,fd=3))",
                  },
                  { type: "output", content: "" },
                  {
                    type: "output",
                    content: "[6] Memory Usage:",
                  },
                  { type: "output", content: "VmSize:    8376 kB" },
                  { type: "output", content: "VmRSS:     5692 kB" },
                ]}
              />
            </Collapsible>

            {/* Script: service-manager.sh */}
            <Collapsible
              title="service-manager.sh — Create a Custom systemd Service"
              index={8}
            >
              <p className="text-text-taupe mb-4">
                This script demonstrates creating a real systemd service from
                scratch: it writes a unit file, registers it with systemd,
                starts it, enables it on boot, and verifies it is running. This
                is exactly how you would deploy a custom application on a
                production server. Understanding the systemd unit file format is
                a core sysadmin skill.
              </p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4">
                {`#!/bin/bash
# service-manager.sh — Create and manage a custom systemd service
set -euo pipefail

SERVICE_NAME="health-check"
SCRIPT_PATH="/opt/scripts/health-check.sh"

echo "[1/5] Creating the service script..."
sudo mkdir -p /opt/scripts
sudo tee "$SCRIPT_PATH" > /dev/null << 'SCRIPT'
#!/bin/bash
while true; do
    echo "$(date): System healthy - Load: $(uptime | awk -F'load average:' '{print $2}')" >> /var/log/health-check.log
    sleep 60
done
SCRIPT
sudo chmod +x "$SCRIPT_PATH"

echo "[2/5] Creating systemd unit file..."
sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null << EOF
[Unit]
Description=System Health Check Service
After=network.target

[Service]
Type=simple
ExecStart=$SCRIPT_PATH
Restart=always
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
EOF

echo "[3/5] Reloading systemd daemon..."
sudo systemctl daemon-reload

echo "[4/5] Starting and enabling service..."
sudo systemctl start $SERVICE_NAME
sudo systemctl enable $SERVICE_NAME

echo "[5/5] Verifying..."
systemctl status $SERVICE_NAME --no-pager
`}
              </pre>
              <Terminal
                title="Creating a custom systemd service"
                lines={[
                  {
                    type: "command",
                    content: "sudo ./service-manager.sh",
                  },
                  {
                    type: "output",
                    content: "[1/5] Creating the service script...",
                  },
                  {
                    type: "output",
                    content: "[2/5] Creating systemd unit file...",
                  },
                  {
                    type: "output",
                    content: "[3/5] Reloading systemd daemon...",
                  },
                  {
                    type: "output",
                    content: "[4/5] Starting and enabling service...",
                  },
                  {
                    type: "output",
                    content: "[5/5] Verifying...",
                  },
                  {
                    type: "output",
                    content: "● health-check.service - System Health Check Service",
                  },
                  {
                    type: "output",
                    content: "     Active: active (running)",
                  },
                  {
                    type: "output",
                    content: "   Main PID: 2341 (health-check.sh)",
                  },
                ]}
              />
            </Collapsible>

            <KeyTakeaway variant="green">
              <strong>
                <code>kill</code> vs <code>kill -9</code>: know the difference.
              </strong>{" "}
              By default, <code>kill</code> sends SIGTERM (signal 15), which
              politely asks a process to shut down and lets it clean up (save
              files, close connections, release locks). <code>kill -9</code>{" "}
              sends SIGKILL, which immediately terminates the process with no
              chance to clean up. Always try SIGTERM first. Only use SIGKILL as
              a last resort when a process is truly unresponsive.
            </KeyTakeaway>

            <DidYouKnow>
              A <strong>zombie process</strong> is a process that has finished
              running but still has an entry in the process table because its
              parent has not yet read its exit status (via the{" "}
              <code>wait()</code> system call). You can spot them with{" "}
              <code>ps aux | grep Z</code>. A few zombies are harmless, but
              thousands of them can exhaust the PID table and prevent new
              processes from starting. The fix is usually to kill or restart the
              parent process.
            </DidYouKnow>

            <AnalogyBox icon="🏷️">
              Think of PID 1 (systemd) as the general manager of a hotel.
              Every other process is a guest or staff member. When systemd
              starts, it reads its checklist (unit files) and launches all the
              services the hotel needs: the front desk (SSH), the security
              guards (UFW), the janitors (cron jobs). If any of them crash,
              systemd can restart them automatically — that is what{" "}
              <code>Restart=always</code> does in a unit file.
            </AnalogyBox>
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* PHASE 4: Networking & Security                               */}
        {/* ============================================================ */}
        <div
          ref={(el) => {
            phaseRefs.current[4] = el;
          }}
          data-phase="4"
          className="mb-16 scroll-mt-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-bg-cream via-bg-paper to-accent-sand/[0.05] p-8 rounded-xl"
          >
            <h2 className="text-3xl font-serif text-text-charcoal mb-4">
              Phase 4: Networking & Security
            </h2>
            <p className="text-lg text-text-taupe leading-relaxed mb-6">
              A server connected to a network is a target. This phase covers
              hardening the server against attacks: configuring the UFW firewall,
              locking down SSH, running a comprehensive security audit, and
              understanding fail2ban. Security is not a one-time task — it is a
              continuous process of auditing, hardening, and monitoring.
            </p>

            {/* Firewall Setup Terminal */}
            <Terminal
              title="Setting Up the UFW Firewall"
              lines={[
                {
                  type: "comment",
                  content: "Check current firewall status",
                },
                { type: "command", content: "sudo ufw status" },
                { type: "output", content: "Status: inactive" },
                {
                  type: "comment",
                  content:
                    "CRITICAL: Allow SSH BEFORE enabling the firewall!",
                },
                { type: "command", content: "sudo ufw allow 22/tcp" },
                {
                  type: "output",
                  content: "Rules updated",
                },
                {
                  type: "comment",
                  content: "Allow HTTP and HTTPS for web services",
                },
                { type: "command", content: "sudo ufw allow 80/tcp" },
                { type: "output", content: "Rules updated" },
                { type: "command", content: "sudo ufw allow 443/tcp" },
                { type: "output", content: "Rules updated" },
                {
                  type: "comment",
                  content: "Set default policy: deny all incoming, allow outgoing",
                },
                {
                  type: "command",
                  content: "sudo ufw default deny incoming",
                },
                { type: "output", content: "Default incoming policy changed to 'deny'" },
                {
                  type: "command",
                  content: "sudo ufw default allow outgoing",
                },
                { type: "output", content: "Default outgoing policy changed to 'allow'" },
                {
                  type: "comment",
                  content: "Enable the firewall",
                },
                { type: "command", content: "sudo ufw enable" },
                {
                  type: "output",
                  content:
                    "Firewall is active and enabled on system startup",
                },
                { type: "command", content: "sudo ufw status numbered" },
                {
                  type: "output",
                  content:
                    "     To                         Action      From\n[ 1] 22/tcp                     ALLOW IN    Anywhere\n[ 2] 80/tcp                     ALLOW IN    Anywhere\n[ 3] 443/tcp                    ALLOW IN    Anywhere",
                },
              ]}
            />

            <WarningBox>
              <strong>
                Always allow port 22 (SSH) BEFORE enabling the firewall.
              </strong>{" "}
              Otherwise you lock yourself out of your own server. If you are
              connected remotely via SSH and you enable UFW without allowing port
              22, your connection will drop immediately and you will have no way
              to get back in unless you have physical console access to the
              machine.
            </WarningBox>

            {/* SSH Hardening Terminal */}
            <Terminal
              title="SSH Hardening Configuration"
              lines={[
                {
                  type: "comment",
                  content: "Check current SSH configuration",
                },
                {
                  type: "command",
                  content: "sudo sshd -T | grep -i 'permitrootlogin\\|maxauthtries\\|passwordauthentication\\|pubkeyauthentication'",
                },
                {
                  type: "output",
                  content: "permitrootlogin yes",
                },
                { type: "output", content: "maxauthtries 6" },
                {
                  type: "output",
                  content: "passwordauthentication yes",
                },
                {
                  type: "output",
                  content: "pubkeyauthentication yes",
                },
                {
                  type: "comment",
                  content: "These defaults are insecure! Let's harden them.",
                },
                {
                  type: "command",
                  content: "sudo nano /etc/ssh/sshd_config",
                },
                {
                  type: "output",
                  content:
                    "# Add/modify these lines:",
                },
                {
                  type: "output",
                  content: "PermitRootLogin no",
                },
                {
                  type: "output",
                  content: "MaxAuthTries 3",
                },
                {
                  type: "output",
                  content: "PasswordAuthentication no",
                },
                {
                  type: "output",
                  content: "PubkeyAuthentication yes",
                },
                {
                  type: "comment",
                  content: "Restart SSH to apply changes",
                },
                {
                  type: "command",
                  content: "sudo systemctl restart ssh",
                },
                {
                  type: "comment",
                  content: "Verify the new settings",
                },
                {
                  type: "command",
                  content: "sudo sshd -T | grep -i 'permitrootlogin\\|maxauthtries'",
                },
                { type: "output", content: "permitrootlogin no" },
                { type: "output", content: "maxauthtries 3" },
              ]}
            />

            {/* Script: security-audit.sh */}
            <Collapsible
              title="security-audit.sh — 10-Point Security Audit with Scoring"
              index={9}
            >
              <p className="text-text-taupe mb-4">
                This script runs 10 security checks against the server and
                calculates a score out of 10. Each check is a real security best
                practice: SSH root login disabled, firewall active, no
                world-writable files, no empty passwords, automatic updates
                configured, and more. Running this regularly on a production
                server helps catch configuration drift.
              </p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4">
                {`#!/bin/bash
# security-audit.sh — 10-check server security audit
set -euo pipefail

SCORE=0
TOTAL=10

check() {
    local name="$1" result="$2"
    if [ "$result" = "PASS" ]; then
        echo -e "[PASS] $name"
        ((SCORE++))
    else
        echo -e "[FAIL] $name"
    fi
}

echo "=== SECURITY AUDIT ==="
echo "Date: $(date)"
echo ""

# 1. SSH root login disabled
ROOT_LOGIN=$(sudo sshd -T 2>/dev/null | grep -i "permitrootlogin" | awk '{print $2}')
check "SSH root login disabled" "$([ "$ROOT_LOGIN" = "no" ] && echo PASS || echo FAIL)"

# 2. Firewall active
check "UFW firewall active" "$(sudo ufw status | grep -q 'active' && echo PASS || echo FAIL)"

# 3. No empty passwords in shadow
EMPTY=$(sudo awk -F: '($2 == "") {print $1}' /etc/shadow)
check "No empty passwords" "$([ -z "$EMPTY" ] && echo PASS || echo FAIL)"

# 4. SSH max auth tries <= 3
MAX_AUTH=$(sudo sshd -T 2>/dev/null | grep maxauthtries | awk '{print $2}')
check "SSH max auth tries <= 3" "$([ "$MAX_AUTH" -le 3 ] && echo PASS || echo FAIL)"

# 5. No world-writable files in /etc
WW=$(find /etc -xdev -type f -perm -0002 2>/dev/null | wc -l)
check "No world-writable files in /etc" "$([ "$WW" -eq 0 ] && echo PASS || echo FAIL)"

# ... checks 6-10: password auth disabled, fail2ban running,
#     auto-updates enabled, SSH key-only auth, SUID audit

echo ""
echo "=== SCORE: $SCORE / $TOTAL ==="
`}
              </pre>
              <Terminal
                title="Running the security audit"
                lines={[
                  {
                    type: "command",
                    content: "sudo ./security-audit.sh",
                  },
                  {
                    type: "output",
                    content: "=== SECURITY AUDIT ===",
                  },
                  { type: "output", content: "" },
                  {
                    type: "output",
                    content: "[PASS] SSH root login disabled",
                  },
                  {
                    type: "output",
                    content: "[PASS] UFW firewall active",
                  },
                  {
                    type: "output",
                    content: "[PASS] No empty passwords",
                  },
                  {
                    type: "output",
                    content: "[PASS] SSH max auth tries <= 3",
                  },
                  {
                    type: "output",
                    content: "[PASS] No world-writable files in /etc",
                  },
                  {
                    type: "output",
                    content: "[PASS] Password auth disabled (key-only)",
                  },
                  {
                    type: "output",
                    content: "[FAIL] fail2ban not installed",
                  },
                  {
                    type: "output",
                    content: "[PASS] Automatic updates configured",
                  },
                  {
                    type: "output",
                    content: "[PASS] SSH key-based auth enabled",
                  },
                  {
                    type: "output",
                    content: "[PASS] SUID binaries audit clean",
                  },
                  { type: "output", content: "" },
                  {
                    type: "output",
                    content: "=== SCORE: 9 / 10 ===",
                  },
                ]}
              />
            </Collapsible>

            <KeyTakeaway variant="yellow">
              <strong>SSH hardening checklist:</strong> (1) Disable root login
              with <code>PermitRootLogin no</code>. (2) Limit auth attempts
              with <code>MaxAuthTries 3</code>. (3) Disable password auth with{" "}
              <code>PasswordAuthentication no</code>. (4) Require SSH keys with{" "}
              <code>PubkeyAuthentication yes</code>. These four settings
              eliminate the vast majority of SSH-based attacks.
            </KeyTakeaway>

            <DidYouKnow>
              <strong>fail2ban</strong> is a tool that automatically bans IP
              addresses after repeated failed login attempts. It monitors log
              files (like <code>/var/log/auth.log</code>) in real time and adds
              temporary firewall rules to block offending IPs. The default
              configuration bans an IP for 10 minutes after 5 failed SSH
              attempts. On internet-facing servers, fail2ban blocks thousands of
              brute-force attempts per day — it is one of the first things you
              should install on any public server.
            </DidYouKnow>

            <AnalogyBox icon="🏰">
              Think of server security like a medieval castle. The firewall (UFW)
              is the outer wall — it controls who can even approach. SSH
              hardening is the gatehouse — checking credentials before letting
              anyone in. fail2ban is the guard who remembers faces and bans
              troublemakers. And security audits are the castle inspector who
              walks around checking for cracks in the walls.
            </AnalogyBox>
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* PHASE 5: Storage & Disk Management                           */}
        {/* ============================================================ */}
        <div
          ref={(el) => {
            phaseRefs.current[5] = el;
          }}
          data-phase="5"
          className="mb-16 scroll-mt-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-accent-sage/[0.07] via-bg-paper to-accent-moss/[0.05] p-8 rounded-xl"
          >
            <h2 className="text-3xl font-serif text-text-charcoal mb-4">
              Phase 5: Storage & Disk Management
            </h2>
            <p className="text-lg text-text-taupe leading-relaxed mb-6">
              Running out of disk space at 3 AM is every sysadmin&apos;s
              nightmare. This phase covers LVM (Logical Volume Manager) for
              flexible disk management, inode monitoring, swap configuration,
              and building an automated disk monitoring script that catches
              problems before they become outages.
            </p>

            <AnalogyBox icon="🏠">
              LVM is like having adjustable rooms in your house — instead of
              fixed walls (partitions), you can move walls and make rooms bigger
              without rebuilding the entire house. With traditional partitions,
              if your <code>/home</code> partition fills up, you are stuck even if{" "}
              <code>/var</code> has plenty of free space. With LVM, you can
              dynamically grow or shrink volumes without downtime.
            </AnalogyBox>

            {/* Disk Inspection Terminal */}
            <Terminal
              title="Inspecting Disk Usage and LVM"
              lines={[
                {
                  type: "comment",
                  content: "Check disk space (human-readable)",
                },
                { type: "command", content: "df -h" },
                {
                  type: "output",
                  content:
                    "Filesystem                  Size  Used Avail Use% Mounted on",
                },
                {
                  type: "output",
                  content:
                    "/dev/mapper/ubuntu--vg-root  28G   12G   15G  42% /",
                },
                {
                  type: "output",
                  content:
                    "/dev/vda1                   974M  130M  777M  15% /boot",
                },
                {
                  type: "comment",
                  content: "Check inode usage (often overlooked!)",
                },
                { type: "command", content: "df -i" },
                {
                  type: "output",
                  content:
                    "Filesystem                  Inodes  IUsed   IFree IUse% Mounted on",
                },
                {
                  type: "output",
                  content:
                    "/dev/mapper/ubuntu--vg-root 1835008 142567 1692441    8% /",
                },
                {
                  type: "comment",
                  content: "View LVM logical volumes",
                },
                { type: "command", content: "sudo lvs" },
                {
                  type: "output",
                  content:
                    "  LV   VG        Attr       LSize  Pool Origin Data%  Meta%",
                },
                {
                  type: "output",
                  content:
                    "  root ubuntu-vg -wi-ao---- 28.00g",
                },
                {
                  type: "comment",
                  content: "View volume groups",
                },
                { type: "command", content: "sudo vgs" },
                {
                  type: "output",
                  content:
                    "  VG        #PV #LV #SN Attr   VSize  VFree",
                },
                {
                  type: "output",
                  content:
                    "  ubuntu-vg   1   1   0 wz--n- 30.00g 2.00g",
                },
                {
                  type: "comment",
                  content: "Check swap usage",
                },
                { type: "command", content: "free -h | grep Swap" },
                {
                  type: "output",
                  content: "Swap:         2.0Gi       0B       2.0Gi",
                },
              ]}
            />

            {/* Script: disk-monitor.sh */}
            <Collapsible
              title="disk-monitor.sh — Comprehensive Disk Health Monitor"
              index={10}
            >
              <p className="text-text-taupe mb-4">
                This script checks six aspects of disk health: filesystem usage,
                inode usage, LVM free space, swap usage, the 10 largest files,
                and log directory sizes. Each check has configurable thresholds
                and produces clear PASS/WARN/CRITICAL output. This is the kind
                of script that runs via cron and sends alerts before a disk fills
                up.
              </p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4">
                {`#!/bin/bash
# disk-monitor.sh — Comprehensive disk health check
set -euo pipefail

WARN_DISK=80
CRIT_DISK=95
WARN_INODE=80
CRIT_INODE=95

echo "=== DISK HEALTH REPORT ==="
echo "Date: $(date)"
echo ""

echo "--- Filesystem Usage ---"
while read -r line; do
    usage=$(echo "$line" | awk '{print int($5)}')
    mount=$(echo "$line" | awk '{print $6}')
    if (( usage >= CRIT_DISK )); then
        echo "[CRITICAL] $mount at \${usage}%"
    elif (( usage >= WARN_DISK )); then
        echo "[WARNING]  $mount at \${usage}%"
    else
        echo "[OK]       $mount at \${usage}%"
    fi
done < <(df -h | tail -n +2 | grep -v tmpfs)

echo ""
echo "--- Inode Usage ---"
while read -r line; do
    usage=$(echo "$line" | awk '{print int($5)}')
    mount=$(echo "$line" | awk '{print $6}')
    if (( usage >= CRIT_INODE )); then
        echo "[CRITICAL] $mount inodes at \${usage}%"
    elif (( usage >= WARN_INODE )); then
        echo "[WARNING]  $mount inodes at \${usage}%"
    else
        echo "[OK]       $mount inodes at \${usage}%"
    fi
done < <(df -i | tail -n +2 | grep -v tmpfs)

echo ""
echo "--- Top 10 Largest Files ---"
find / -xdev -type f -exec du -h {} + 2>/dev/null | sort -rh | head -10

echo ""
echo "--- Log Directory Sizes ---"
du -sh /var/log/* 2>/dev/null | sort -rh | head -5
`}
              </pre>
              <Terminal
                title="Running disk-monitor.sh"
                lines={[
                  {
                    type: "command",
                    content: "sudo ./disk-monitor.sh",
                  },
                  {
                    type: "output",
                    content: "=== DISK HEALTH REPORT ===",
                  },
                  { type: "output", content: "" },
                  {
                    type: "output",
                    content: "--- Filesystem Usage ---",
                  },
                  {
                    type: "output",
                    content: "[OK]       / at 42%",
                  },
                  {
                    type: "output",
                    content: "[OK]       /boot at 15%",
                  },
                  { type: "output", content: "" },
                  {
                    type: "output",
                    content: "--- Inode Usage ---",
                  },
                  {
                    type: "output",
                    content: "[OK]       / inodes at 8%",
                  },
                  { type: "output", content: "" },
                  {
                    type: "output",
                    content: "--- Top 10 Largest Files ---",
                  },
                  {
                    type: "output",
                    content:
                      "48M  /usr/lib/firmware/amdgpu/gc_11_0_0_mes.bin",
                  },
                  {
                    type: "output",
                    content: "32M  /var/log/syslog",
                  },
                  { type: "output", content: "" },
                  {
                    type: "output",
                    content: "--- Log Directory Sizes ---",
                  },
                  {
                    type: "output",
                    content: "32M\t/var/log/syslog",
                  },
                  {
                    type: "output",
                    content: "8.4M\t/var/log/auth.log",
                  },
                  {
                    type: "output",
                    content: "4.2M\t/var/log/kern.log",
                  },
                ]}
              />
            </Collapsible>

            <KeyTakeaway variant="blue">
              <strong>Inode exhaustion is a silent killer.</strong> Every file
              and directory on a Linux filesystem uses one inode. You can run out
              of inodes even when you have plenty of disk space — this typically
              happens when an application creates millions of tiny files (like
              mail queues or session files). The command{" "}
              <code>df -i</code> shows inode usage. If IUse% hits 100%, no new
              files can be created even if the disk is 50% empty.
            </KeyTakeaway>

            <DidYouKnow>
              When you run <code>rm</code> on a large file, the disk space is
              not immediately freed if any process still has the file open.
              Linux only releases the space when the last file descriptor is
              closed. This is why <code>df</code> sometimes shows a disk as
              full even after you have deleted files. The fix is to restart the
              process that had the file open, or use{" "}
              <code>lsof +L1</code> to find deleted files still held open.
            </DidYouKnow>

            <AnalogyBox icon="📋">
              Think of inodes like entries in a library catalog. Each book (file)
              needs a catalog entry that records its title, location, and
              checkout status. You can have empty shelves (free disk space) but
              if you run out of catalog cards (inodes), you cannot add any new
              books. The <code>df -i</code> command is like checking how many
              blank catalog cards remain.
            </AnalogyBox>
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* PHASE 6: Monitoring & Alerting + Docker                      */}
        {/* ============================================================ */}
        <div
          ref={(el) => {
            phaseRefs.current[6] = el;
          }}
          data-phase="6"
          className="mb-16 scroll-mt-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-bg-cream via-bg-paper to-accent-sand/[0.05] p-8 rounded-xl"
          >
            <h2 className="text-3xl font-serif text-text-charcoal mb-4">
              Phase 6: Monitoring, Alerting & Docker
            </h2>
            <p className="text-lg text-text-taupe leading-relaxed mb-6">
              The final phase ties everything together. First, we build an
              automated monitoring and alerting system that collects metrics via
              cron and triggers alerts when thresholds are breached. Then, we
              explore Docker to containerize applications on our server. This
              phase represents the transition from managing a server to
              operating one.
            </p>

            {/* MONITORING SECTION */}
            <div className="mb-12">
              <h3 className="text-2xl font-serif text-text-charcoal mb-4">
                Monitoring & Alerting
              </h3>

              {/* Script: metrics-collector.sh */}
              <Collapsible
                title="metrics-collector.sh — Automated Metrics via Cron"
                index={11}
              >
                <p className="text-text-taupe mb-4">
                  This script collects system metrics (CPU, memory, disk, load
                  average, network connections, top processes) and appends them
                  to a CSV file. It is designed to run every 5 minutes via cron,
                  building a historical record of system performance that you can
                  analyze for trends, capacity planning, and post-incident
                  investigation.
                </p>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4">
                  {`#!/bin/bash
# metrics-collector.sh — Collect system metrics to CSV
set -euo pipefail

METRICS_FILE="/var/log/metrics/system-metrics.csv"
mkdir -p /var/log/metrics

# Create header if file doesn't exist
if [ ! -f "$METRICS_FILE" ]; then
    echo "timestamp,cpu_pct,mem_pct,disk_pct,load_1m,load_5m,load_15m,connections,processes" > "$METRICS_FILE"
fi

TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%S)
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{printf "%d", $2}')
MEM=$(free | awk '/Mem:/ {printf "%d", $3/$2*100}')
DISK=$(df / | tail -1 | awk '{print int($5)}')
LOAD=$(cat /proc/loadavg | awk '{print $1","$2","$3}')
CONNS=$(ss -tuln | wc -l)
PROCS=$(ps aux | wc -l)

echo "$TIMESTAMP,$CPU,$MEM,$DISK,$LOAD,$CONNS,$PROCS" >> "$METRICS_FILE"

# Rotate: keep last 7 days of metrics
find /var/log/metrics -name "*.csv" -mtime +7 -delete 2>/dev/null
`}
                </pre>
                <Terminal
                  title="Setting up cron for metrics collection"
                  lines={[
                    {
                      type: "comment",
                      content: "Edit the crontab to add the metrics job",
                    },
                    { type: "command", content: "crontab -e" },
                    {
                      type: "output",
                      content:
                        "# Add this line to collect metrics every 5 minutes:",
                    },
                    {
                      type: "output",
                      content:
                        "*/5 * * * * /home/charith/scripts/metrics-collector.sh",
                    },
                    {
                      type: "comment",
                      content: "Verify the cron job is registered",
                    },
                    { type: "command", content: "crontab -l" },
                    {
                      type: "output",
                      content:
                        "*/5 * * * * /home/charith/scripts/metrics-collector.sh",
                    },
                    {
                      type: "comment",
                      content: "Check if metrics are being collected",
                    },
                    {
                      type: "command",
                      content: "tail -3 /var/log/metrics/system-metrics.csv",
                    },
                    {
                      type: "output",
                      content:
                        "2026-03-15T14:30:00,12,45,42,0.15,0.22,0.18,14,112",
                    },
                    {
                      type: "output",
                      content:
                        "2026-03-15T14:35:00,8,44,42,0.10,0.20,0.17,13,110",
                    },
                    {
                      type: "output",
                      content:
                        "2026-03-15T14:40:00,15,46,42,0.25,0.23,0.19,15,114",
                    },
                  ]}
                />
              </Collapsible>

              {/* Script: alert-monitor.sh */}
              <Collapsible
                title="alert-monitor.sh — Threshold-Based Alerting"
                index={12}
              >
                <p className="text-text-taupe mb-4">
                  This script reads the latest metrics and compares them against
                  configurable thresholds. When a metric exceeds its warning or
                  critical threshold, it logs an alert with the current values
                  and (in production) would send a notification via email, Slack,
                  or PagerDuty. It is the second half of the monitoring stack:
                  metrics-collector gathers data, alert-monitor acts on it.
                </p>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4">
                  {`#!/bin/bash
# alert-monitor.sh — Check metrics against thresholds and alert
set -euo pipefail

ALERT_LOG="/var/log/metrics/alerts.log"

# Thresholds
CPU_WARN=70;  CPU_CRIT=90
MEM_WARN=80;  MEM_CRIT=95
DISK_WARN=80; DISK_CRIT=95

alert() {
    local level="$1" metric="$2" value="$3" threshold="$4"
    local msg="[$level] $metric at \${value}% (threshold: \${threshold}%)"
    echo "$(date +%Y-%m-%dT%H:%M:%S) $msg" | tee -a "$ALERT_LOG"
}

# Current values
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{printf "%d", $2}')
MEM=$(free | awk '/Mem:/ {printf "%d", $3/$2*100}')
DISK=$(df / | tail -1 | awk '{print int($5)}')

# Check CPU
if (( CPU >= CPU_CRIT )); then alert "CRITICAL" "CPU" "$CPU" "$CPU_CRIT"
elif (( CPU >= CPU_WARN )); then alert "WARNING" "CPU" "$CPU" "$CPU_WARN"
fi

# Check Memory
if (( MEM >= MEM_CRIT )); then alert "CRITICAL" "Memory" "$MEM" "$MEM_CRIT"
elif (( MEM >= MEM_WARN )); then alert "WARNING" "Memory" "$MEM" "$MEM_WARN"
fi

# Check Disk
if (( DISK >= DISK_CRIT )); then alert "CRITICAL" "Disk" "$DISK" "$DISK_CRIT"
elif (( DISK >= DISK_WARN )); then alert "WARNING" "Disk" "$DISK" "$DISK_WARN"
fi

echo "Alert check complete. Log: $ALERT_LOG"
`}
                </pre>
                <Terminal
                  title="Testing alert-monitor.sh"
                  lines={[
                    {
                      type: "command",
                      content: "sudo ./alert-monitor.sh",
                    },
                    {
                      type: "output",
                      content: "Alert check complete. Log: /var/log/metrics/alerts.log",
                    },
                    {
                      type: "comment",
                      content:
                        "Simulate high CPU to trigger an alert",
                    },
                    {
                      type: "command",
                      content:
                        "stress --cpu 4 --timeout 10 & sleep 2 && sudo ./alert-monitor.sh",
                    },
                    {
                      type: "output",
                      content:
                        "[WARNING] CPU at 85% (threshold: 70%)",
                    },
                    {
                      type: "output",
                      content: "Alert check complete. Log: /var/log/metrics/alerts.log",
                    },
                  ]}
                />
              </Collapsible>
            </div>

            {/* DOCKER SECTION */}
            <div className="mb-12">
              <h3 className="text-2xl font-serif text-text-charcoal mb-4">
                Docker Containerization
              </h3>

              <AnalogyBox icon="📦">
                A Docker container is like a shipping container — it packages
                everything your app needs (code, libraries, config) into a
                standardized box that runs the same way on any machine. Just
                like how a shipping container can be loaded onto any truck,
                ship, or train, a Docker container runs identically on your
                laptop, a staging server, or a production cluster.
              </AnalogyBox>

              <Terminal
                title="Docker in Action"
                lines={[
                  {
                    type: "comment",
                    content: "Check Docker is installed and running",
                  },
                  { type: "command", content: "docker --version" },
                  {
                    type: "output",
                    content: "Docker version 24.0.7, build afdd53b",
                  },
                  {
                    type: "comment",
                    content: "Run an Nginx web server container",
                  },
                  {
                    type: "command",
                    content: "docker run -d -p 8080:80 --name my-web nginx",
                  },
                  {
                    type: "output",
                    content:
                      "Unable to find image 'nginx:latest' locally",
                  },
                  {
                    type: "output",
                    content: "latest: Pulling from library/nginx",
                  },
                  {
                    type: "output",
                    content:
                      "a2318d6c47ec: Pull complete",
                  },
                  {
                    type: "output",
                    content:
                      "Status: Downloaded newer image for nginx:latest",
                  },
                  {
                    type: "output",
                    content:
                      "d4f9e2c8b1a3e5f7...",
                  },
                  {
                    type: "comment",
                    content: "See running containers",
                  },
                  { type: "command", content: "docker ps" },
                  {
                    type: "output",
                    content:
                      "CONTAINER ID   IMAGE   COMMAND                  STATUS          PORTS                  NAMES",
                  },
                  {
                    type: "output",
                    content:
                      "d4f9e2c8b1a3   nginx   \"/docker-entrypoint...\"   Up 5 seconds   0.0.0.0:8080->80/tcp   my-web",
                  },
                  {
                    type: "comment",
                    content: "Test the web server",
                  },
                  {
                    type: "command",
                    content: "curl -s http://localhost:8080 | head -5",
                  },
                  {
                    type: "output",
                    content: "<!DOCTYPE html>",
                  },
                  {
                    type: "output",
                    content: "<html>",
                  },
                  {
                    type: "output",
                    content: "<head>",
                  },
                  {
                    type: "output",
                    content: "<title>Welcome to nginx!</title>",
                  },
                  {
                    type: "comment",
                    content: "Build a custom image from a Dockerfile",
                  },
                  {
                    type: "command",
                    content: "docker build -t my-webpage .",
                  },
                  {
                    type: "output",
                    content: "Sending build context to Docker daemon  2.048kB",
                  },
                  {
                    type: "output",
                    content:
                      "Successfully built a1b2c3d4e5f6",
                  },
                  {
                    type: "output",
                    content:
                      "Successfully tagged my-webpage:latest",
                  },
                ]}
              />

              <KeyTakeaway variant="green">
                <strong>
                  Port mapping: <code>-p 8080:80</code> means &quot;connect port
                  8080 on the host to port 80 inside the container.&quot;
                </strong>{" "}
                The format is always <code>HOST_PORT:CONTAINER_PORT</code>.
                When you visit <code>http://server:8080</code>, the traffic
                enters port 8080 on the host machine, Docker forwards it to port
                80 inside the container, and Nginx (listening on port 80 inside
                the container) handles the request.
              </KeyTakeaway>

              <DidYouKnow>
                Docker images use a layered filesystem. Each instruction in a
                Dockerfile (FROM, RUN, COPY) creates a new read-only layer.
                When you change one line and rebuild, Docker only rebuilds from
                that layer onward — unchanged layers are cached. This is why
                you should put rarely-changing instructions (like installing
                dependencies) before frequently-changing ones (like copying your
                code). Smart layer ordering can reduce build times from minutes
                to seconds.
              </DidYouKnow>
            </div>

            {/* What I Learned The Hard Way */}
            <div className="my-12 p-8 bg-bg-cream/60 border border-text-charcoal/10 rounded-xl">
              <h3 className="text-2xl font-serif text-text-charcoal mb-6">
                What I Learned The Hard Way
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="text-2xl flex-shrink-0">1.</span>
                  <div>
                    <p className="text-text-charcoal font-semibold mb-1">
                      Always test firewall rules before enabling UFW
                    </p>
                    <p className="text-text-taupe">
                      I locked myself out of my own VM once by enabling UFW
                      without allowing SSH first. Had to access the VM console
                      through UTM to fix it. On a remote cloud server, this
                      mistake could mean a support ticket and hours of downtime.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl flex-shrink-0">2.</span>
                  <div>
                    <p className="text-text-charcoal font-semibold mb-1">
                      <code>rm -rf /</code> protection exists for a reason
                    </p>
                    <p className="text-text-taupe">
                      Modern Linux distributions have safeguards against{" "}
                      <code>rm -rf /</code>, but <code>rm -rf /*</code> (with
                      the asterisk) bypasses them. I learned to always
                      double-check destructive commands, use{" "}
                      <code>rm -i</code> for interactive confirmation, and never
                      run anything as root unless absolutely necessary.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl flex-shrink-0">3.</span>
                  <div>
                    <p className="text-text-charcoal font-semibold mb-1">
                      Bash scripts fail silently without <code>set -euo pipefail</code>
                    </p>
                    <p className="text-text-taupe">
                      I had a backup script that was silently failing for weeks
                      because a directory did not exist. Without{" "}
                      <code>set -e</code>, the script continued past the error
                      and reported success. The backups were empty. Now every
                      script starts with <code>set -euo pipefail</code>.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl flex-shrink-0">4.</span>
                  <div>
                    <p className="text-text-charcoal font-semibold mb-1">
                      Log files can fill up a disk faster than you think
                    </p>
                    <p className="text-text-taupe">
                      A misconfigured service was logging every request at DEBUG
                      level, generating 2 GB of logs per hour. The disk filled
                      up overnight. I learned to always configure log rotation
                      (logrotate) and monitor <code>/var/log</code> sizes.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl flex-shrink-0">5.</span>
                  <div>
                    <p className="text-text-charcoal font-semibold mb-1">
                      Docker containers are ephemeral by default
                    </p>
                    <p className="text-text-taupe">
                      I stored important data inside a container, then ran{" "}
                      <code>docker rm</code> and lost everything. Containers
                      are disposable — any data that needs to persist must be
                      stored in Docker volumes or bind mounts, not inside the
                      container filesystem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* FINAL QUIZ                                                   */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-text-charcoal mb-6">
            Final Quiz: Test Your Knowledge
          </h2>
          <p className="text-lg text-text-taupe mb-6">
            10 questions covering every phase of the project. Score 80% or
            higher to celebrate!
          </p>
          <Quiz
            title="Linux SysAdmin Deep Dive — Final Quiz"
            questions={[
              {
                question:
                  "What directory stores all system configuration files on Linux?",
                options: ["/home", "/var", "/etc", "/usr"],
                correctIndex: 2,
                explanation:
                  "/etc (\"et cetera\" or \"editable text configuration\") is where virtually all system configuration files live — from SSH settings to user accounts to network configuration.",
              },
              {
                question: "What does `chmod 755 file.sh` do?",
                options: [
                  "Makes the file readable by root only",
                  "Owner: rwx, Group: r-x, Others: r-x",
                  "Owner: rw-, Group: r-x, Others: r-x",
                  "Makes the file executable by everyone with full write access",
                ],
                correctIndex: 1,
                explanation:
                  "7=rwx (owner can read/write/execute), 5=r-x (group can read/execute), 5=r-x (others can read/execute). This is the standard permission for scripts that everyone should be able to run but only the owner can modify.",
              },
              {
                question:
                  "What does `set -euo pipefail` do in a bash script?",
                options: [
                  "Enables verbose debug output",
                  "Sets the script to run as root",
                  "Exits on error, undefined variables, and pipe failures",
                  "Enables color output in the terminal",
                ],
                correctIndex: 2,
                explanation:
                  "-e exits immediately if any command fails, -u treats unset variables as errors, -o pipefail catches failures in piped commands. Together they prevent scripts from silently continuing after errors.",
              },
              {
                question: "What is PID 1 on a Linux system?",
                options: [
                  "The kernel itself",
                  "The bash shell",
                  "systemd (or init) — the first userspace process",
                  "The SSH daemon",
                ],
                correctIndex: 2,
                explanation:
                  "PID 1 is systemd (or init on older systems). It is the first process started by the kernel after boot and is the parent/ancestor of every other process on the system. It manages all services.",
              },
              {
                question: "What signal does `kill` send by default?",
                options: [
                  "SIGKILL (9)",
                  "SIGTERM (15)",
                  "SIGHUP (1)",
                  "SIGINT (2)",
                ],
                correctIndex: 1,
                explanation:
                  "kill sends SIGTERM (signal 15) by default, which politely asks a process to terminate and gives it a chance to clean up. SIGKILL (kill -9) is the forceful termination that does not allow cleanup.",
              },
              {
                question:
                  "Why should you always allow SSH (port 22) before enabling UFW?",
                options: [
                  "SSH won't work without UFW enabled",
                  "UFW requires SSH to be configured first",
                  "Otherwise you lock yourself out of the server with no way to reconnect",
                  "Port 22 is blocked by default on Ubuntu",
                ],
                correctIndex: 2,
                explanation:
                  "If you enable UFW (which defaults to denying all incoming traffic) without first allowing port 22, your SSH connection drops immediately and you cannot reconnect remotely. You would need physical or console access to fix it.",
              },
              {
                question: "What are inodes?",
                options: [
                  "Network connection endpoints",
                  "Docker image layers",
                  "Metadata structures that store file information (permissions, location on disk, timestamps)",
                  "A type of system log entry",
                ],
                correctIndex: 2,
                explanation:
                  "An inode stores all metadata about a file: its size, permissions, owner, timestamps, and the disk blocks where its data lives. The filename itself is stored in the directory entry, not the inode. You can run out of inodes even with free disk space.",
              },
              {
                question:
                  "What does `rsync --link-dest` do for backups?",
                options: [
                  "Creates symbolic links to backup files",
                  "Compresses the backup with hard links",
                  "Creates hard links to unchanged files, saving disk space while each backup appears complete",
                  "Links the backup to a remote server",
                ],
                correctIndex: 2,
                explanation:
                  "rsync --link-dest compares each file to a reference directory. Unchanged files get a hard link (using almost no extra disk space) instead of a full copy. Each backup directory looks like a complete snapshot but only files that changed actually occupy new disk space.",
              },
              {
                question:
                  "What does `-p 8080:80` mean in a Docker run command?",
                options: [
                  "Sets the process priority to 8080 with max 80",
                  "Maps host port 8080 to container port 80",
                  "Opens ports 80 through 8080",
                  "Maps container port 8080 to host port 80",
                ],
                correctIndex: 1,
                explanation:
                  "The format is HOST_PORT:CONTAINER_PORT. Traffic arriving on port 8080 of the host machine is forwarded to port 80 inside the container. This is how you expose container services to the outside world.",
              },
              {
                question:
                  "What tool automatically bans IPs after repeated failed SSH login attempts?",
                options: ["UFW", "iptables", "fail2ban", "SELinux"],
                correctIndex: 2,
                explanation:
                  "fail2ban monitors log files for patterns of failed authentication attempts and dynamically adds firewall rules to ban offending IP addresses for a configurable duration. It is essential for any internet-facing server.",
              },
            ]}
            onComplete={(score, total) => {
              if (score / total >= 0.8) triggerCelebration(6);
            }}
          />
        </motion.div>

        {/* ============================================================ */}
        {/* FLASHCARDS                                                   */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-text-charcoal mb-6">
            Review Flashcards
          </h2>
          <p className="text-lg text-text-taupe mb-6">
            15 flashcards to help you memorize key Linux sysadmin concepts.
            Click a card to flip it.
          </p>
          <Flashcards
            title="Linux SysAdmin Key Concepts"
            cards={[
              {
                front: "What does /etc store?",
                back: "System configuration files — SSH config, user accounts, network settings, firewall rules, and more.",
              },
              {
                front: "What is the difference between chmod and chown?",
                back: "chmod changes file permissions (who can read/write/execute). chown changes file ownership (which user and group own the file).",
              },
              {
                front: "What does set -euo pipefail do?",
                back: "-e: exit on error. -u: error on undefined variables. -o pipefail: catch failures in piped commands. The essential safety net for bash scripts.",
              },
              {
                front: "What is PID 1?",
                back: "systemd (or init) — the first userspace process started by the kernel. It is the parent of all other processes and manages all services.",
              },
              {
                front: "SIGTERM vs SIGKILL",
                back: "SIGTERM (15): politely asks a process to stop, allows cleanup. SIGKILL (9): forcefully terminates with no cleanup. Always try SIGTERM first.",
              },
              {
                front: "What is a zombie process?",
                back: "A process that has finished but its parent hasn't read its exit status via wait(). It still occupies a PID table entry. Fix: restart the parent.",
              },
              {
                front: "What are the 4 SSH hardening essentials?",
                back: "1. PermitRootLogin no\n2. MaxAuthTries 3\n3. PasswordAuthentication no\n4. PubkeyAuthentication yes",
              },
              {
                front: "What is fail2ban?",
                back: "A tool that monitors log files for failed login attempts and automatically bans offending IPs via firewall rules. Essential for public servers.",
              },
              {
                front: "What are inodes?",
                back: "Metadata structures for files — they store permissions, ownership, timestamps, and disk block locations. You can run out of inodes even with free disk space.",
              },
              {
                front: "What is LVM?",
                back: "Logical Volume Manager — allows dynamic resizing of disk partitions without downtime. Think of it as adjustable walls in a house.",
              },
              {
                front: "What does rsync --link-dest do?",
                back: "Creates hard links to unchanged files during backups, making each backup appear complete while only using disk space for changed files.",
              },
              {
                front: "What is the cron format?",
                back: "minute hour day-of-month month day-of-week command\nExample: */5 * * * * means every 5 minutes.",
              },
              {
                front: "What does -p 8080:80 mean in Docker?",
                back: "Maps host port 8080 to container port 80. Format: HOST_PORT:CONTAINER_PORT. Traffic on 8080 gets forwarded to the container's port 80.",
              },
              {
                front: "Docker image vs container",
                back: "Image: a read-only template/blueprint. Container: a running instance of an image. You can run many containers from one image.",
              },
              {
                front: "Why does df still show a disk as full after rm?",
                back: "If a process still has the deleted file open, Linux won't free the space until the file descriptor is closed. Use lsof +L1 to find such files.",
              },
            ]}
          />
        </motion.div>

        {/* ============================================================ */}
        {/* GITHUB LINK                                                  */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="my-16 p-8 bg-bg-cream/50 border border-text-charcoal/10 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <svg
                className="w-8 h-8 text-text-charcoal"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <h3 className="text-2xl font-serif text-text-charcoal">
                View Source Code
              </h3>
            </div>
            <p className="text-text-taupe mb-4">
              All scripts, configuration files, and documentation from this
              project are available on GitHub. Explore the complete source code,
              try the scripts on your own VM, and follow along with each phase.
            </p>
            <a
              href="https://github.com/CharithKapuluru/linux-sysadmin-deep-dive"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-text-charcoal text-bg-paper rounded-lg hover:bg-accent-moss transition-colors font-mono text-sm"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LinuxSysAdminProject;
