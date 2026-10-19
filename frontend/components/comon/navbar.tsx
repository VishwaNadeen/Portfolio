"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });
  const [shimPos, setShimPos] = useState(0);
  const nameChars = "Vishwa Nadeen".split("");

  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const lastY = useRef(0);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : !!pathname?.startsWith(href);

  const activeIdx = navItems.findIndex((i) => isActive(i.href));
  const targetIdx = hovered ?? activeIdx;

  // Name shimmer sweep
  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const duration = 4000;
    const step = (ts: number) => {
      if (start === null) start = ts;
      setShimPos((((ts - start) % duration) / duration) * 100);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Scroll: compact style, hide on scroll down / show on scroll up, progress line
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      setScrolled(y > 12);
      setProgress(max > 0 ? Math.min(1, y / max) : 0);

      if (y > lastY.current && y > 140) setHidden(true);
      else if (y < lastY.current) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sliding highlight: follows hover, rests on the active link
  useLayoutEffect(() => {
    const measure = () => {
      const el = itemRefs.current[targetIdx];
      if (!el) {
        setPill((p) => ({ ...p, ready: false }));
        return;
      }
      setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [targetIdx]);

  return (
    <>
    {/* Scroll progress: pinned to the very top of the screen, away from the navbar outline */}
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[10000] h-[3px]"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
    <header
      className={[
        "fixed inset-x-0 top-4 z-[9999] flex justify-center",
        "transition-transform duration-500 ease-[cubic-bezier(.22,.8,.5,1)] motion-reduce:transition-none",
        hidden && !mobileOpen ? "-translate-y-[140%]" : "translate-y-0",
      ].join(" ")}
    >
      <style>{`
        @keyframes letter-drop {
          from { opacity:0; transform:translateY(-14px) rotate(-4deg); }
          to   { opacity:1; transform:translateY(0)     rotate(0deg);  }
        }
        .nav-letter {
          display:inline-block;
          animation:letter-drop 0.5s cubic-bezier(.22,.8,.5,1) both;
        }
        @property --nav-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: true;
        }
        @keyframes nav-border-spin {
          to { --nav-angle: 360deg; }
        }
        .nav-frame {
          background: conic-gradient(
            from var(--nav-angle),
            rgba(34,211,238,0.12) 0%,
            rgba(34,211,238,1) 10%,
            rgba(129,140,248,1) 22%,
            rgba(34,211,238,0.12) 38%,
            rgba(255,255,255,0.10) 68%,
            rgba(34,211,238,0.12) 100%
          );
          animation: nav-border-spin 5s linear infinite;
        }
        .nav-frame-glow {
          background: conic-gradient(
            from var(--nav-angle),
            transparent 0%,
            rgba(34,211,238,0.9) 10%,
            rgba(129,140,248,0.9) 22%,
            transparent 38%,
            transparent 100%
          );
          filter: blur(16px);
          opacity: 0.55;
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-letter { animation:none; }
          .nav-frame { animation:none; }
        }
      `}</style>
      <div className="relative w-[92%] max-w-6xl">
        {/* Main bar */}
        <div
          className={[
            "nav-frame relative rounded-2xl p-[1.5px] transition-shadow duration-300",
            scrolled
              ? "shadow-[0_16px_50px_rgba(0,0,0,0.6)]"
              : "shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
          ].join(" ")}
        >
        <span
          aria-hidden
          className="nav-frame-glow pointer-events-none absolute inset-0 rounded-2xl"
        />
        <nav
          aria-label="Main"
          className="relative flex h-14 items-center justify-between overflow-hidden rounded-[14.5px] bg-slate-950 px-3 sm:px-4"
        >
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 no-underline"
            aria-label="Vishwa Nadeen — home"
          >
            <span className="inline-block text-base font-bold tracking-[0.03em] sm:text-[1.125rem]">
              {nameChars.map((ch, i) => {
                const pos = (i / (nameChars.length - 1)) * 100;
                const glow = Math.max(0, 1 - Math.abs(pos - shimPos) / 35);
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

          {/* Desktop links with sliding highlight */}
          <div
            className="relative hidden items-center rounded-xl border border-white/5 bg-white/[0.03] p-1 sm:flex"
            onMouseLeave={() => setHovered(null)}
          >
            <span
              aria-hidden
              className="absolute bottom-1 top-1 rounded-lg bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 ring-1 ring-cyan-400/25 transition-[left,width,opacity] duration-300 ease-[cubic-bezier(.22,.8,.5,1)] motion-reduce:transition-none"
              style={{
                left: pill.left,
                width: pill.width,
                opacity: pill.ready ? 1 : 0,
              }}
            />
            {navItems.map((item, idx) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={() => setHovered(idx)}
                  onFocus={() => setHovered(idx)}
                  onBlur={() => setHovered(null)}
                  className={[
                    "relative z-10 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors duration-200",
                    active || hovered === idx
                      ? "text-white"
                      : "text-slate-400",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side: CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((p) => !p)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 sm:hidden"
            >
              <span className="relative block h-4 w-5">
                <span
                  className={[
                    "absolute left-0 h-0.5 w-full rounded-full bg-current transition-all duration-300",
                    mobileOpen ? "top-[7px] rotate-45" : "top-0",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute left-0 top-[7px] h-0.5 w-full rounded-full bg-current transition-opacity duration-200",
                    mobileOpen ? "opacity-0" : "opacity-100",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute left-0 h-0.5 w-full rounded-full bg-current transition-all duration-300",
                    mobileOpen ? "top-[7px] -rotate-45" : "top-[14px]",
                  ].join(" ")}
                />
              </span>
            </button>
          </div>

        </nav>
        </div>

        {/* Mobile sheet */}
        <div
          className={[
            "grid transition-all duration-300 sm:hidden",
            mobileOpen
              ? "mt-2 grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0",
          ].join(" ")}
        >
          <div className="overflow-hidden rounded-2xl">
            <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-slate-950/90 p-2 shadow-[0_16px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-gradient-to-br from-cyan-400/15 to-indigo-500/15 text-white ring-1 ring-cyan-400/20"
                        : "text-slate-300 hover:bg-white/5",
                    ].join(" ")}
                  >
                    {item.label}
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}