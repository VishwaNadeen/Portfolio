"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

const CODE_PAIRS = [
  ["</>", "{ }"],
  ["=>", "[ ]"],
  ["fn()", "&&"],
  ["const", "=>"],
  ["async", "{ }"],
];

function CenterDecoration() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setFrame((f) => (f + 1) % CODE_PAIRS.length),
      4000
    );
    return () => clearInterval(id);
  }, []);

  const [left, right] = CODE_PAIRS[frame];

  return (
    <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 select-none items-center gap-2.5 lg:flex">
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
          color: "rgba(34,211,238,0.55)",
          animation: "code-fade 4s ease-in-out both",
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
          color: "rgba(129,140,248,0.55)",
          animation: "code-fade 4s ease-in-out both",
        }}
      >
        {right}
      </span>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [shimPos, setShimPos] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
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
          50%     { box-shadow:0 0 16px 3px rgba(34,211,238,0.18); }
        }
        @keyframes border-glow {
          0%,100% { opacity:0.35; }
          50%     { opacity:0.9;  }
        }
        @keyframes nav-glow-move {
          0%   { transform: translateX(-120%); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        @keyframes nav-float {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-1px); }
        }

        .nav-letter {
          display:inline-block;
          animation:letter-drop 0.5s cubic-bezier(.22,.8,.5,1) both;
        }
        .nav-link {
          opacity:0;
          animation:nav-slide 0.45s cubic-bezier(.22,.8,.5,1) both;
        }
        .active-pill {
          animation:pill-breathe 3s ease-in-out infinite;
        }
        .border-glow-line {
          animation:border-glow 4s ease-in-out infinite;
        }
        .nav-hover-bg {
          position:absolute;
          inset:0;
          border-radius:0.75rem;
          background:linear-gradient(135deg, rgba(34,211,238,0.10), rgba(59,130,246,0.08));
          opacity:0;
          transform:scale(0.92);
          transition:opacity 0.2s ease, transform 0.2s cubic-bezier(.22,.8,.5,1);
          pointer-events:none;
        }
        .nav-item-wrap:hover .nav-hover-bg {
          opacity:1;
          transform:scale(1);
        }
        .navbar-shell {
          animation: nav-float 6s ease-in-out infinite;
        }
        .navbar-shell::before {
          content:"";
          position:absolute;
          inset:-1px;
          border-radius:1rem;
          padding:1px;
          background:linear-gradient(
            120deg,
            rgba(34,211,238,0.18),
            rgba(59,130,246,0.10),
            rgba(129,140,248,0.16),
            rgba(34,211,238,0.18)
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor;
          mask-composite:exclude;
          pointer-events:none;
        }
        .navbar-shine {
          position:absolute;
          top:0;
          bottom:0;
          width:35%;
          background:linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.08),
            transparent
          );
          animation: nav-glow-move 7s ease-in-out infinite;
          pointer-events:none;
        }
      `}</style>

      <header
        className={[
          "navbar-shell fixed top-4 left-1/2 z-50 w-[92%] max-w-6xl -translate-x-1/2 overflow-hidden rounded-2xl backdrop-blur-2xl transition-all duration-300",
          scrolled
            ? "border border-cyan-400/20 bg-slate-950/90 shadow-[0_20px_60px_rgba(0,0,0,0.75),0_0_40px_rgba(34,211,238,0.10)]"
            : "border border-slate-800/70 bg-slate-950/90 shadow-[0_12px_40px_rgba(0,0,0,0.55)]",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.04] via-transparent to-cyan-400/[0.03]" />
        <div className="navbar-shine" />
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent blur-sm" />
        <div className="border-glow-line absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent blur-[1px]" />

        <nav className="relative z-10 w-full">
          <div className="flex min-h-16 w-full flex-col justify-center gap-3 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0 md:px-8">
            {/* Brand */}
            <Link href="/" className="shrink-0 self-center no-underline sm:self-auto">
              <span className="inline-block text-base font-bold tracking-[0.03em] sm:text-[1.125rem]">
                {nameChars.map((ch, i) => {
                  const pos = (i / (nameChars.length - 1)) * 100;
                  const dist = Math.abs(pos - shimPos);
                  const glow = Math.max(0, 1 - dist / 35);

                  const r = Math.round(203 + (34 - 203) * glow);
                  const g = Math.round(213 + (211 - 213) * glow);
                  const b = Math.round(225 + (238 - 225) * glow);

                  return (
                    <span
                      key={i}
                      className="nav-letter"
                      style={{
                        animationDelay: `${i * 38}ms`,
                        color: `rgb(${r},${g},${b})`,
                        textShadow:
                          glow > 0.4
                            ? `0 0 ${Math.round(glow * 12)}px rgba(34,211,238,${(
                                glow * 0.6
                              ).toFixed(2)})`
                            : "none",
                      }}
                    >
                      {ch === " " ? "\u00A0" : ch}
                    </span>
                  );
                })}
              </span>
            </Link>

            <CenterDecoration />

            {/* Nav Links */}
            <div className="flex w-full flex-wrap items-center justify-center gap-1 sm:w-auto sm:justify-end">
              {navItems.map((item, idx) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-link nav-item-wrap relative rounded-xl px-3 py-2 text-xs font-medium sm:px-4 sm:text-sm"
                    style={{
                      color: active ? "#fff" : "#cbd5e1",
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
                      style={{
                        width: hoveredIdx === idx && !active ? "60%" : "0%",
                      }}
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