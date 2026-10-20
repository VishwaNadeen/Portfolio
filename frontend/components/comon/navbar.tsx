"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
];

export default function Navbar() {
  const pathname = usePathname();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });
  const nameLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const scrollFrame = useRef<number | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const nameChars = "Vishwa Nadeen".split("");

  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const lastY = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : !!pathname?.startsWith(href);

  const activeIdx = navItems.findIndex((i) => isActive(i.href));
  const targetIdx = hovered ?? activeIdx;

  // Name intro: flip once after first paint so the Tailwind transitions play.
  useEffect(() => {
    const id = window.setTimeout(() => setIntroDone(true), 30);
    return () => window.clearTimeout(id);
  }, []);

  // Name shimmer sweep: update letter styles directly to avoid a React render every frame.
  useEffect(() => {
    if (popupOpen) return; // pause while the "Let's talk" popup is open
    let raf = 0;
    let start: number | null = null;
    let lastPaint = 0;
    const duration = 4000;
    const step = (ts: number) => {
      // 30fps is visually smooth for this decorative effect and lighter on mobile devices.
      if (ts - lastPaint >= 1000 / 30) {
        if (start === null) start = ts;
        const shimPos = (((ts - start) % duration) / duration) * 100;
        nameLetterRefs.current.forEach((el, i) => {
          if (!el) return;
          const pos = (i / Math.max(1, nameChars.length - 1)) * 100;
          const glow = Math.max(0, 1 - Math.abs(pos - shimPos) / 35);
          const r = Math.round(203 + (34 - 203) * glow);
          const g = Math.round(213 + (211 - 213) * glow);
          const b = Math.round(225 + (238 - 225) * glow);
          el.style.color = `rgb(${r},${g},${b})`;
          el.style.textShadow = glow > 0.4
            ? `0 0 ${Math.round(glow * 12)}px rgba(34,211,238,${(glow * 0.6).toFixed(2)})`
            : "none";
        });
        lastPaint = ts;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [popupOpen, nameChars.length]);

  // Slide away (same hide animation) while the "Let's talk" popup is open
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setPopupOpen(root.hasAttribute("data-contact-open"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-contact-open"],
    });
    return () => observer.disconnect();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close the mobile menu when tapping / clicking anywhere outside the navbar
  useEffect(() => {
    if (!mobileOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [mobileOpen]);

  // Scroll: update the progress line without rerendering the whole navbar on every scroll event.
  useEffect(() => {
    const onScroll = () => {
      if (scrollFrame.current !== null) return;
      scrollFrame.current = window.requestAnimationFrame(() => {
        scrollFrame.current = null;
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const nextProgress = max > 0 ? Math.min(1, y / max) : 0;

        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${nextProgress})`;
        }
        setScrolled((value) => value !== (y > 12) ? y > 12 : value);

        if (y > lastY.current && y > 140) setHidden((value) => value ? value : true);
        else if (y < lastY.current) setHidden((value) => value ? false : value);
        lastY.current = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = null;
    };
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
      className={[
        "pointer-events-none fixed inset-x-0 top-0 z-[10000] h-[3px]",
        "transition-transform duration-500 ease-[cubic-bezier(.22,.8,.5,1)] motion-reduce:transition-none",
        popupOpen ? "-translate-y-[400%]" : "translate-y-0",
      ].join(" ")}
    >
      <div
        ref={progressBarRef}
        className="h-full origin-left bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
    <header
      className={[
        "fixed inset-x-0 top-4 z-[9999] flex justify-center",
        "transition-transform duration-500 ease-[cubic-bezier(.22,.8,.5,1)] motion-reduce:transition-none",
        (hidden && !mobileOpen) || popupOpen
          ? "-translate-y-[140%]"
          : "translate-y-0",
      ].join(" ")}
    >
      <style>{`
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
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-frame { animation:none; }
        }
      `}</style>
      <div ref={containerRef} className="relative w-[92%] max-w-6xl">
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
          className="nav-frame-glow pointer-events-none absolute inset-0 rounded-2xl opacity-[0.55] blur-[16px] max-sm:opacity-[0.35] max-sm:blur-[8px]"
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
              {nameChars.map((ch, i) => (
                <span
                  key={i}
                  ref={(el) => { nameLetterRefs.current[i] = el; }}
                  className={[
                    "inline-block transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(.22,.8,.5,1)] motion-reduce:transition-none",
                    introDone
                      ? "translate-y-0 scale-100 opacity-100 blur-none"
                      : "translate-y-4 scale-75 opacity-0 blur-sm",
                  ].join(" ")}
                  style={{ transitionDelay: `${i * 45}ms` }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
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