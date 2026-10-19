"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Download } from "lucide-react";
import { getPublicCvDownloadUrl } from "@/lib/cvApi";

export default function FloatingCvButton() {
  const pathname = usePathname();
  const isAboutPage = pathname === "/about";
  const [showButton, setShowButton] = useState(false);
  const [talkWidth, setTalkWidth] = useState<number | null>(null);

  // Match the width of the "Let's talk" button exactly (round on mobile,
  // pill on desktop) without touching that component.
  useEffect(() => {
    let observer: ResizeObserver | null = null;
    let raf = 0;
    let tries = 0;

    const attach = () => {
      const talk = document.querySelector<HTMLElement>(
        'button[aria-label="Open contact form"]'
      );

      if (!talk) {
        if (tries++ < 120) raf = requestAnimationFrame(attach);
        return;
      }

      const sync = () => setTalkWidth(talk.offsetWidth);
      sync();

      observer = new ResizeObserver(sync);
      observer.observe(talk);
    };

    attach();

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    setShowButton(false);

    if (!isAboutPage) return;

    const timer = window.setTimeout(() => {
      setShowButton(true);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [isAboutPage]);

  return (
    <>
      <style>{`
        @keyframes cv-icon-drop {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(3px); }
        }
        .cv-button:hover .cv-icon {
          animation: cv-icon-drop 0.7s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .cv-button, .cv-button .cv-icon {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <a
        href={getPublicCvDownloadUrl()}
        download
        aria-label="Download Resume"
        aria-hidden={!showButton}
        tabIndex={showButton ? 0 : -1}
        className={`
          cv-button group fixed right-4 z-[80] flex h-14 w-14 items-center justify-center gap-2.5
          overflow-hidden rounded-full border border-cyan-400/40
          bg-slate-950/80 text-cyan-300
          shadow-lg shadow-cyan-500/10 backdrop-blur-xl
          transition-[opacity,transform,background-color,border-color,color] duration-300 ease-out
          hover:border-cyan-300/70 hover:bg-cyan-400/10 hover:text-cyan-200
          active:scale-95
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300
          focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
          sm:right-7 sm:w-36
          ${
            showButton
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-5 opacity-0"
          }
        `}
        style={{
          bottom: "calc(1.25rem + env(safe-area-inset-bottom))",
          // Exact width of the talk button once measured (class width is the fallback)
          ...(talkWidth ? { width: talkWidth } : {}),
        }}
      >
        <Download
          size={22}
          strokeWidth={2}
          className="cv-icon shrink-0"
        />
        <span className="hidden text-sm font-semibold sm:inline">Resume</span>
      </a>
    </>
  );
}