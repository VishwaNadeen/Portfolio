"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/",         label: "Home"     },
  { href: "/about",    label: "About"    },
  { href: "/projects", label: "Projects" },
  { href: "/contact",  label: "Contact"  },
];

const CODE_PAIRS = [
  ["</>",   "{ }"],
  ["=>",    "[ ]"],
  ["fn()",  "&&" ],
  ["const", "=>" ],
  ["async", "{ }"],
];

function CenterDecoration() {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % CODE_PAIRS.length), 4000);
    return () => clearInterval(id);
  }, []);
  const [left, right] = CODE_PAIRS[frame];

  return (
    <div className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 select-none items-center gap-2.5">
      <style>{`
        @keyframes code-fade {
          0%   { opacity:0; transform:translateY(6px);  }
          12%  { opacity:1; transform:translateY(0px);  }
          88%  { opacity:1; transform:translateY(0px);  }
          100% { opacity:0; transform:translateY(-6px); }
        }
        @keyframes dot-travel {
          0%   { left:0%;   opacity:0; }
          8%   { opacity:1; }
          92%  { opacity:1; }
          100% { left:100%; opacity:0; }
        }
      `}</style>

      <span
        key={`l-${frame}`}
        className="text-[10px] font-medium tracking-[0.05em]"
        style={{
          fontFamily: "'Fira Code','JetBrains Mono',monospace",
          color:      "rgba(34,211,238,0.55)",
          animation:  "code-fade 4s ease-in-out both",
        }}
      >
        {left}
      </span>

      <div className="relative flex h-0.5 w-12 items-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/15 via-indigo-500/50 to-cyan-400/15" />
        <div
          key={`dt-${frame}`}
          className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-cyan-400/90 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)]"
          style={{ animation: "dot-travel 4s ease-in-out infinite" }}
        />
      </div>

      <span
        key={`r-${frame}`}
        className="text-[10px] font-medium tracking-[0.05em]"
        style={{
          fontFamily: "'Fira Code','JetBrains Mono',monospace",
          color:      "rgba(129,140,248,0.55)",
          animation:  "code-fade 4s ease-in-out both",
        }}
      >
        {right}
      </span>
    </div>
  );
}

export default function Navbar() {
  const pathname                    = usePathname();
  const [scrolled, setScrolled]     = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [shimPos, setShimPos]       = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const duration = 4000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = ((ts - start) % duration) / duration;
      setShimPos(p * 100);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const nameChars = "Vishwa Nadeen".split("");

  return (
    <>
      <style>{`
        @keyframes letter-drop {
          from { opacity:0; transform:translateY(-14px) rotate(-4deg); }
          to   { opacity:1; transform:translateY(0)     rotate(0deg);  }
        }
        @keyframes nav-slide {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:translateY(0);     }
        }
        @keyframes pill-breathe {
          0%,100% { box-shadow:0 0 0 0 rgba(34,211,238,0); }
          50%     { box-shadow:0 0 12px 2px rgba(34,211,238,0.15); }
        }
        @keyframes border-glow {
          0%,100% { opacity:0.35; }
          50%     { opacity:0.8;  }
        }
        .nav-letter {
          display:inline-block;
          animation:letter-drop 0.5s cubic-bezier(.22,.8,.5,1) both;
        }
        .nav-link {
          opacity:0;
          animation:nav-slide 0.45s cubic-bezier(.22,.8,.5,1) both;
        }
        .active-pill { animation:pill-breathe 3s ease-in-out infinite; }
        .border-glow-line { animation:border-glow 4s ease-in-out infinite; }
        .nav-hover-bg {
          position:absolute; inset:0; border-radius:0.75rem;
          background:rgba(255,255,255,0.05);
          opacity:0; transform:scale(0.92);
          transition:opacity 0.2s ease, transform 0.2s cubic-bezier(.22,.8,.5,1);
          pointer-events:none;
        }
        .nav-item-wrap:hover .nav-hover-bg { opacity:1; transform:scale(1); }
      `}</style>

      <header
        className={[
          "sticky top-0 z-50 w-full backdrop-blur-xl transition-[background,box-shadow] duration-300",
          scrolled
            ? "bg-[rgba(2,8,23,0.92)] shadow-[0_4px_32px_rgba(0,0,0,0.4)]"
            : "bg-gradient-to-r from-[#020817] via-[#0f172a] to-[#020817] shadow-none",
        ].join(" ")}
      >
        {/* animated bottom border */}
        <div className="border-glow-line absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        <nav className="w-full">
          <div className="flex h-16 w-full items-center justify-between px-4 md:px-8">

            {/* ── Brand (left) ── */}
            <Link href="/" className="shrink-0 no-underline">
              <span className="inline-block text-[1.125rem] font-bold tracking-[0.03em]">
                {nameChars.map((ch, i) => {
                  const pos  = (i / (nameChars.length - 1)) * 100;
                  const dist = Math.abs(pos - shimPos);
                  const glow = Math.max(0, 1 - dist / 35);

                  const r = Math.round(203 + (34  - 203) * glow);
                  const g = Math.round(213 + (211 - 213) * glow);
                  const b = Math.round(225 + (238 - 225) * glow);
                  const letterColor = `rgb(${r},${g},${b})`;

                  return (
                    <span
                      key={i}
                      className="nav-letter"
                      style={{
                        animationDelay: `${i * 38}ms`,
                        color:          letterColor,
                        textShadow:     glow > 0.4
                          ? `0 0 ${Math.round(glow * 12)}px rgba(34,211,238,${(glow * 0.6).toFixed(2)})`
                          : "none",
                        transition: "color 0.05s linear, text-shadow 0.05s linear",
                      }}
                    >
                      {ch === " " ? "\u00A0" : ch}
                    </span>
                  );
                })}
              </span>
            </Link>

            {/* ── Center ── */}
            <CenterDecoration />

            {/* ── Nav Links (right) ── */}
            <div className="flex shrink-0 items-center gap-1">
              {navItems.map((item, idx) => {
                const active = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-link nav-item-wrap relative rounded-xl px-4 py-2 text-sm font-medium no-underline transition-colors duration-200"
                    style={{
                      color:          active ? "#fff" : "#cbd5e1",
                      animationDelay: `${500 + idx * 80}ms`,
                    }}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    <span className="nav-hover-bg" />

                    {active && (
                      <span className="active-pill absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-blue-500/18 to-cyan-400/15" />
                    )}

                    <span className="relative z-10">{item.label}</span>

                    {active && (
                      <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                    )}

                    <span
                      className="absolute bottom-1 left-1/2 h-[1.5px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-60 transition-[width] duration-[250ms]"
                      style={{ width: hoveredIdx === idx && !active ? "60%" : "0%" }}
                    />
                  </Link>
                );
              })}
            </div>

          </div>
        </nav>
      </header>
    </>
  );
}