"use client";

import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  phaseId?: number;
}

const ShareButtons = ({ title, phaseId }: ShareButtonsProps) => {
  const [showCopied, setShowCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getShareUrl = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return phaseId !== undefined ? `${baseUrl}/#phase-${phaseId}` : baseUrl;
  };

  const shareText = `Check out "${title}" - FastAPI DevSecOps Demo`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${shareText}\n\n${getShareUrl()}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-mono bg-bg-cream text-text-olive border border-text-charcoal/10 hover:border-accent-moss/50 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        Share
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-bg-paper border border-text-charcoal/10 rounded-lg shadow-lg z-50 overflow-hidden">
            <button
              onClick={() => {
                handleCopyLink();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-charcoal hover:bg-bg-cream transition-colors"
            >
              <svg className="w-4 h-4 text-text-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {showCopied ? "Copied!" : "Copy Link"}
            </button>

            <button
              onClick={() => {
                handleTwitterShare();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-charcoal hover:bg-bg-cream transition-colors"
            >
              <svg className="w-4 h-4 text-text-olive" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Twitter / X
            </button>

            <button
              onClick={() => {
                handleLinkedInShare();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-charcoal hover:bg-bg-cream transition-colors"
            >
              <svg className="w-4 h-4 text-text-olive" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </button>

            <button
              onClick={() => {
                handleEmailShare();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-charcoal hover:bg-bg-cream transition-colors"
            >
              <svg className="w-4 h-4 text-text-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButtons;
