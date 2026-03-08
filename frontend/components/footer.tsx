"use client";

import { useEffect, useRef, useState } from "react";
import { SOCIAL_LINKS } from "@/data/socialLinks";

const SOCIALS = [
  {
    label: "GitHub",
    href:  SOCIAL_LINKS.github,
    color: "hover:text-slate-200",
    glow:  "hover:shadow-[0_0_12px_rgba(226,232,240,0.3)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href:  SOCIAL_LINKS.linkedin,
    color: "hover:text-blue-500",
    glow:  "hover:shadow-[0_0_12px_rgba(10,102,194,0.4)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href:  SOCIAL_LINKS.instagram,
    color: "hover:text-pink-500",
    glow:  "hover:shadow-[0_0_12px_rgba(225,48,108,0.4)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: "Facebook",
    href:  SOCIAL_LINKS.facebook,
    color: "hover:text-blue-400",
    glow:  "hover:shadow-[0_0_12px_rgba(24,119,242,0.4)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    href:  SOCIAL_LINKS.tiktok,
    color: "hover:text-rose-400",
    glow:  "hover:shadow-[0_0_12px_rgba(238,29,82,0.4)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href:  SOCIAL_LINKS.youtube,
    color: "hover:text-red-500",
    glow:  "hover:shadow-[0_0_12px_rgba(255,0,0,0.4)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: "Telegram",
    href:  SOCIAL_LINKS.telegram,
    color: "hover:text-sky-400",
    glow:  "hover:shadow-[0_0_12px_rgba(34,158,217,0.4)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function Footer() {
  const { ref, visible } = useInView();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-r from-[#020817] via-[#0f172a] to-[#020817]">

      {/* glowing top border */}
      <div className="absolute top-0 left-0 right-0 h-px animate-pulse bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      {/* subtle bg radial glow */}
      <div className="pointer-events-none absolute -bottom-16 left-1/2 h-44 w-[500px] -translate-x-1/2 rounded-full bg-cyan-400/[0.04] blur-3xl" />

      <div ref={ref} className="w-full px-30 py-6">
        <div
          className={[
            "flex flex-wrap items-center justify-between gap-4",
            visible ? "animate-[fadeUp_0.3s_cubic-bezier(.22,.8,.5,1)_0.05s_both]" : "opacity-0",
          ].join(" ")}
        >

          {/* Copyright */}
          <span className="shrink-0 text-sm text-slate-600">
            © {new Date().getFullYear()}{" "}
            <span className="bg-gradient-to-r from-slate-200 via-cyan-400 to-indigo-400 bg-[length:250%_auto] bg-clip-text font-semibold text-transparent animate-[shimmer_4s_ease-in-out_infinite]">
              Vishwa Nadeen
            </span>
            <span className="text-slate-600">. All rights reserved.</span>
          </span>

          {/* Social icons */}
          <div
            className={[
              "flex items-center gap-4",
              visible ? "animate-[fadeUp_0.3s_cubic-bezier(.22,.8,.5,1)_0.08s_both]" : "opacity-0",
            ].join(" ")}
          >
            {SOCIALS.map((s, i) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className={[
                  "inline-flex h-[40px] w-[40px] items-center justify-center rounded-full",
                  "bg-white/5 text-slate-400/80",
                  "hover:-translate-y-1 hover:scale-110 hover:bg-white/10",
                  s.color,
                  s.glow,
                ].join(" ")}
                style={{
                  opacity:            visible ? 1 : 0,
                  transform:          visible ? "translateY(0)" : "translateY(6px)",
                  transitionProperty: "opacity, transform, color, box-shadow, background-color",
                  transitionDuration: visible ? `0.25s, 0.25s, 0.1s, 0.1s, 0.1s` : "0.25s",
                  transitionTimingFunction: "cubic-bezier(.22,.8,.5,1)",
                  transitionDelay:    visible ? `${i * 0.025}s` : "0s",
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>

        </div>
      </div>

      {/* keyframes injected once — minimal, just what Tailwind can't do */}
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes shimmer {
          0%,100% { background-position:0%   50%; }
          50%     { background-position:100% 50%; }
        }
      `}</style>
    </footer>
  );
}