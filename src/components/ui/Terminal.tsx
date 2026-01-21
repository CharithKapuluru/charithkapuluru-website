"use client";

import { useState, useEffect, useRef } from "react";

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

const Terminal = ({ title = "Terminal", lines, autoPlay = false }: TerminalProps) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isComplete, setIsComplete] = useState(false);
  const [showThinkingDots, setShowThinkingDots] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Variable typing speed - slower at spaces and periods for realism
  const getTypingDelay = (char: string, baseDelay: number): number => {
    if (char === " ") return baseDelay + Math.random() * 30 + 20; // Slower at spaces
    if (char === "." || char === ",") return baseDelay + Math.random() * 50 + 40; // Slower at punctuation
    if (char === "-") return baseDelay + Math.random() * 20 + 10;
    // Add slight random variation for natural feel
    return baseDelay + (Math.random() * 20 - 10);
  };

  useEffect(() => {
    if (!isPlaying || visibleLines >= lines.length) {
      if (visibleLines >= lines.length) {
        setIsComplete(true);
        setIsPlaying(false);
      }
      return;
    }

    const currentLine = lines[visibleLines];
    const baseDelay = currentLine.delay || 40;

    if (currentLine.type === "command") {
      setIsTyping(true);
      let charIndex = 0;
      let timeoutId: NodeJS.Timeout;

      const typeNextChar = () => {
        if (charIndex <= currentLine.content.length) {
          setCurrentText(currentLine.content.slice(0, charIndex));
          const currentChar = currentLine.content[charIndex] || "";
          const delay = getTypingDelay(currentChar, baseDelay);
          charIndex++;
          timeoutId = setTimeout(typeNextChar, delay);
        } else {
          setIsTyping(false);
          // Show "thinking" dots before output appears
          const nextLine = lines[visibleLines + 1];
          if (nextLine && nextLine.type === "output" && nextLine.content.length > 0) {
            setShowThinkingDots(true);
            setTimeout(() => {
              setShowThinkingDots(false);
              setVisibleLines((prev) => prev + 1);
              setCurrentText("");
            }, 400 + Math.random() * 300);
          } else {
            setTimeout(() => {
              setVisibleLines((prev) => prev + 1);
              setCurrentText("");
            }, 200);
          }
        }
      };

      typeNextChar();

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    } else {
      // Output or comment - show with slight delay
      const delay = currentLine.type === "output" ? 80 + Math.random() * 40 : 60;
      const timeoutId = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [isPlaying, visibleLines, lines]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLines, currentText, showThinkingDots]);

  const handlePlay = () => {
    if (isComplete) {
      setVisibleLines(0);
      setCurrentText("");
      setIsComplete(false);
    }
    setIsPlaying(true);
  };

  const handleSkip = () => {
    setVisibleLines(lines.length);
    setIsTyping(false);
    setCurrentText("");
    setShowThinkingDots(false);
    setIsComplete(true);
    setIsPlaying(false);
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-text-charcoal/20 shadow-lg">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-text-charcoal">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-terracotta" />
          <div className="w-3 h-3 rounded-full bg-accent-sand" />
          <div className="w-3 h-3 rounded-full bg-accent-moss" />
        </div>
        <span className="text-xs font-mono text-white/70">{title}</span>
        <div className="flex items-center gap-2">
          {!isComplete && !isPlaying && (
            <button
              onClick={handlePlay}
              className="text-xs font-mono text-accent-moss hover:text-accent-sage transition-colors"
            >
              ▶ Play
            </button>
          )}
          {isPlaying && (
            <button
              onClick={handleSkip}
              className="text-xs font-mono text-accent-sand hover:text-white transition-colors"
            >
              ⏭ Skip
            </button>
          )}
          {isComplete && (
            <button
              onClick={handlePlay}
              className="text-xs font-mono text-accent-sage hover:text-white transition-colors"
            >
              ↺ Replay
            </button>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalRef}
        className="bg-[#1a1a1a] p-4 font-mono text-sm min-h-[200px] max-h-[400px] overflow-y-auto"
      >
        {lines.slice(0, visibleLines).map((line, index) => (
          <div key={index} className="mb-1">
            {line.type === "command" ? (
              <div className="flex">
                <span className="text-accent-moss mr-2">$</span>
                <span className="text-white">{line.content}</span>
              </div>
            ) : line.type === "comment" ? (
              <div className="text-text-olive italic"># {line.content}</div>
            ) : (
              <div className="text-gray-400 pl-4">{line.content}</div>
            )}
          </div>
        ))}

        {/* Currently typing line */}
        {isTyping && (
          <div className="flex">
            <span className="text-accent-moss mr-2">$</span>
            <span className="text-white">{currentText}</span>
            <span className="text-white animate-pulse">▊</span>
          </div>
        )}

        {/* Thinking dots before output */}
        {showThinkingDots && (
          <div className="flex items-center pl-4 text-gray-400">
            <span className="animate-pulse">...</span>
          </div>
        )}

        {/* Cursor when idle */}
        {!isTyping && !isComplete && isPlaying && !showThinkingDots && (
          <div className="flex">
            <span className="text-accent-moss mr-2">$</span>
            <span className="text-white animate-pulse">▊</span>
          </div>
        )}

        {/* Prompt when not started */}
        {!isPlaying && visibleLines === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-4xl mb-3">▶️</div>
            <p className="text-accent-sage font-medium mb-1">Click the Play button above to start!</p>
            <p className="text-text-olive text-xs">Watch the commands execute step by step</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
