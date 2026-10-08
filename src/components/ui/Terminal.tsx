"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowCounterClockwise, SkipForward } from "@phosphor-icons/react/dist/ssr";
import { initialTerminalState } from "@/lib/terminal-state";

interface TerminalLine {
  type: "command" | "output" | "comment";
  content: string;
  delay?: number;
}

interface TerminalProps {
  title?: string;
  lines: TerminalLine[];
  autoPlay?: boolean;
}

const typingDelay = (char: string, base: number) => {
  if (char === " ") return base + Math.random() * 30 + 20;
  if (char === "." || char === ",") return base + Math.random() * 50 + 40;
  return base + (Math.random() * 20 - 10);
};

export default function Terminal({ title = "Terminal", lines, autoPlay = false }: TerminalProps) {
  const init = initialTerminalState(autoPlay, lines.length);
  const [visibleLines, setVisibleLines] = useState(init.visibleLines);
  const [playing, setPlaying] = useState(init.playing);
  const [complete, setComplete] = useState(init.complete);
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    if (visibleLines >= lines.length) {
      setComplete(true);
      setPlaying(false);
      return;
    }
    const line = lines[visibleLines];
    const base = line.delay ?? 40;
    let timeout: ReturnType<typeof setTimeout>;

    if (line.type === "command") {
      setTyping(true);
      let i = 0;
      const step = () => {
        if (i <= line.content.length) {
          setTyped(line.content.slice(0, i));
          timeout = setTimeout(step, typingDelay(line.content[i] ?? "", base));
          i += 1;
        } else {
          setTyping(false);
          timeout = setTimeout(() => {
            setVisibleLines((v) => v + 1);
            setTyped("");
          }, 250);
        }
      };
      step();
    } else {
      timeout = setTimeout(() => setVisibleLines((v) => v + 1), line.type === "output" ? 90 : 60);
    }
    return () => clearTimeout(timeout);
  }, [playing, visibleLines, lines]);

  useEffect(() => {
    if (playing && bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [visibleLines, typed, playing]);

  const replay = () => {
    setVisibleLines(0);
    setTyped("");
    setComplete(false);
    setPlaying(true);
  };

  const skip = () => {
    setVisibleLines(lines.length);
    setTyped("");
    setTyping(false);
    setComplete(true);
    setPlaying(false);
  };

  return (
    <div className="my-6 overflow-hidden rounded-md border border-border-strong bg-terminal text-terminal-fg">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
        <span className="font-mono text-caption text-terminal-fg/70">{title}</span>
        {playing ? (
          <button type="button" onClick={skip} className="inline-flex h-8 items-center gap-1.5 rounded-sm px-2 font-mono text-caption text-terminal-fg/80 hover:bg-white/10 hover:text-terminal-fg">
            <SkipForward size={14} aria-hidden /> Skip
          </button>
        ) : (
          <button type="button" onClick={replay} className="inline-flex h-8 items-center gap-1.5 rounded-sm px-2 font-mono text-caption text-terminal-fg/80 hover:bg-white/10 hover:text-terminal-fg">
            <ArrowCounterClockwise size={14} aria-hidden /> {complete ? "Replay" : "Play"}
          </button>
        )}
      </div>
      <div ref={bodyRef} className="max-h-[400px] overflow-y-auto p-4 font-mono text-small leading-relaxed">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="mb-1">
            {line.type === "command" ? (
              <div className="flex">
                <span className="mr-2 text-terminal-accent">$</span>
                <span>{line.content}</span>
              </div>
            ) : line.type === "comment" ? (
              <div className="italic text-terminal-fg/50"># {line.content}</div>
            ) : (
              <div className="pl-4 text-terminal-fg/80">{line.content}</div>
            )}
          </div>
        ))}
        {typing && (
          <div className="flex">
            <span className="mr-2 text-terminal-accent">$</span>
            <span>{typed}</span>
            <span className="animate-pulse" aria-hidden>▊</span>
          </div>
        )}
      </div>
    </div>
  );
}
