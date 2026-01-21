"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

const CodeBlock = ({ code, language = "bash", filename }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="my-4 relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with filename/language */}
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 bg-text-charcoal/90 rounded-t-lg border-b border-white/10">
          <span className="text-xs font-mono text-white/60">
            {filename || language}
          </span>
          <AnimatePresence>
            {isHovered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2 py-1 text-xs font-mono rounded hover:bg-white/10 transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-accent-moss" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-accent-moss">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white/60">Copy</span>
                  </>
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Code content */}
      <div className={`relative ${filename || language ? 'rounded-b-lg' : 'rounded-lg'}`}>
        <pre className={`bg-bg-cream p-4 overflow-x-auto text-sm font-mono ${filename || language ? '' : 'rounded-lg'}`}>
          <code className="text-text-charcoal">{code}</code>
        </pre>

        {/* Copy button for code blocks without header */}
        {!(filename || language) && (
          <AnimatePresence>
            {isHovered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                onClick={handleCopy}
                className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 text-xs font-mono bg-text-charcoal/80 text-white rounded hover:bg-text-charcoal transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-accent-moss" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-accent-moss">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </motion.button>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default CodeBlock;
