"use client";

import { useEffect, useState, useCallback } from "react";

/* Mouse parallax hook */
function useMouse() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return pos;
}

/* Glitch effect on name */
function GlitchName({ name }: { name: string }) {
  const [glitching, setGlitching] = useState(false);

  const trigger = useCallback(() => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 600);
  }, []);

  return (
    <span
      className="relative inline-block cursor-default select-none"
      onMouseEnter={trigger}
    >
      <span className="animate-[gradientMove_6s_linear_infinite] bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-[length:200%_200%] bg-clip-text text-transparent">
        {name}
      </span>

      {glitching && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-rose-400 to-fuchsia-400 bg-clip-text text-transparent [clip-path:inset(30%_0_50%_0)] [mix-blend-mode:screen] [transform:translate(-3px,2px)]"
          >
            {name}
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent [clip-path:inset(60%_0_20%_0)] [mix-blend-mode:screen] [transform:translate(3px,-2px)]"
          >
            {name}
          </span>
        </>
      )}
    </span>
  );
}

/* Main Component */
export default function HeroSection() {
  const mouse = useMouse();

  const px = (mouse.x - 0.5) * 28;
  const py = (mouse.y - 0.5) * 28;

  return (
    <>
      <style>{`
        @keyframes scan {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientMove {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950/70 to-slate-900/40 p-5 backdrop-blur-xl sm:p-8 md:p-12">
        {/* scan line */}
        <div className="pointer-events-none absolute inset-0 h-[60px] bg-[linear-gradient(transparent_0%,rgba(103,232,249,0.03)_50%,transparent_100%)] animate-[scan_8s_linear_infinite]" />

        {/* mouse-parallax glows */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl transition-transform duration-300 ease-out sm:-right-24 sm:-top-24 sm:h-64 sm:w-64 md:-right-32 md:-top-32 md:h-80 md:w-80"
          style={{ transform: `translate(${-px * 0.4}px, ${-py * 0.4}px)` }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl transition-transform duration-300 ease-out sm:-bottom-24 sm:-left-24 sm:h-64 sm:w-64 md:-bottom-32 md:-left-32 md:h-80 md:w-80"
          style={{ transform: `translate(${px * 0.3}px, ${py * 0.3}px)` }}
        />

        {/* floating particles */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-8 top-10 h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping sm:left-12 sm:top-12 sm:h-2 sm:w-2" />
          <div className="absolute right-10 top-20 h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping sm:right-20 sm:top-24 sm:h-2 sm:w-2" />
          <div className="absolute bottom-16 left-1/3 h-1.5 w-1.5 rounded-full bg-cyan-300 animate-ping sm:bottom-20 sm:h-2 sm:w-2" />
        </div>

        {/* ── content ── */}
        <div className="relative space-y-4 animate-[rise_0.65s_cubic-bezier(.22,.8,.5,1)_0.1s_both] opacity-0 sm:space-y-5 md:space-y-6">
          {/* heading */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-5xl">
              Hi, I'm <GlitchName name="Vishwa Nadeen" />
            </h1>
          </div>

          {/* description */}
          <p className="text-sm leading-7 text-justify text-slate-300 sm:text-base sm:leading-8 md:text-lg">
            Hi, I'm a Software Engineer from Sri Lanka with a love for building things people enjoy using. 
            From cross-platform mobile apps to full web experiences, I focus on quality at every layer - 
            thoughtful design, and interactions that just feel right. I enjoy turning ideas into real, 
            working products that make a meaningful difference in people's daily lives, one great experience 
            at a time.
          </p>
        </div>
      </section>
    </>
  );
}